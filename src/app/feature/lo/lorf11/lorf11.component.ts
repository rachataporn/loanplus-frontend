import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AkornAttachment, Lorf11Service, ReportParam } from '@app/feature/lo/lorf11/lorf11.service';
import { Page, ModalService, SelectFilterService, RowState } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { from } from 'rxjs';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { switchMap } from 'rxjs/operators';
import { Category } from '@app/shared/service/configuration.service';

@Component({
  templateUrl: './lorf11.component.html'
})

export class Lorf11Component implements OnInit {
  searchForm: FormGroup;
  printing: boolean;
  branchList = [];
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  contractNoList = [];
  fromContractNoList = [];
  toContractNoList = [];
  ReportTypeList = [];
  ReportSBTNameList = [];
  ReportSDNameList = [];
  MonthList = [];
  YearList = [];
  SdPeriod = [];
  User = [];
  profileCode: any;
  nameReport: string;
  focusToggle: boolean;
  saving: boolean;
  submitted: boolean;
  srcResult = null;
  attachmentFiles: Attachment[] = [];
  reportParam: ReportParam = {} as ReportParam;
  category = Category.AkornAttachment;
  deleting = [];

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorf11Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      AkornAttachmentHeadId: 0,
      BranchCode: [null, Validators.required],
      // ToBranchCode: null,
      Month: [null, Validators.required],
      Year: [null, Validators.required],
      ReportType: [null, Validators.required],
      ReportSBTName: [null, Validators.required],
      ReportSDName: [null, Validators.required],
      SdPeriod: [null, Validators.required],
      AttachmentsForm: this.fb.array([]),
    });

    this.searchForm.controls.ReportType.valueChanges.subscribe(value => {
      value == 'SBT' ? this.searchForm.controls.ReportSDName.reset() : this.searchForm.controls.ReportSBTName.reset()
      if (value == 'SBT') {
        this.searchForm.controls.ReportSBTName.enable();
        this.searchForm.controls.ReportSDName.reset();
        this.searchForm.controls.ReportSDName.disable();

        this.searchForm.controls.SdPeriod.reset();
        this.searchForm.controls.SdPeriod.disable();
      } else {
        this.searchForm.controls.ReportSDName.enable();
        this.searchForm.controls.ReportSBTName.reset();
        this.searchForm.controls.ReportSBTName.disable();

        this.searchForm.controls.SdPeriod.enable();
      }
    });
  }

  createAttachmentForm(item: AkornAttachment): FormGroup {
    let fg = this.fb.group({
      guid: Math.random().toString(),//important for tracking change
      AkornAttachmentDetailId: 0,
      FileName: null,
      AttachmentId: [null, Validators.required],
      Description: null,
      RowState: RowState.Add,
      IsDisableAttachment: null,
      RowVersion: null,
    });
    fg.patchValue(item, { emitEvent: false });

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )
    this.attachmentFiles.push(new Attachment());
    return fg;
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORF11');
    if (saveData) this.searchForm.patchValue(saveData);
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });
    this.route.data.subscribe((data) => {
      this.ReportTypeList = data.garuntee.ReportType;
      this.ReportSBTNameList = data.garuntee.ReportSBTName;
      this.ReportSDNameList = data.garuntee.ReportSDName;
      this.MonthList = data.garuntee.Month;
      this.branchList = data.garuntee.Branch;
      this.SdPeriod = data.garuntee.SDPeriod;
      this.User = data.garuntee.User;
      this.profileCode = data.garuntee.User[0].ProfileCode;
      this.bindDropDownList();
      this.buildYearList();
    });
  }

  bindDropDownList() {
    this.filterMonthList(true);
    this.filterYearList(true);
    this.filterSDPeriodList(true);
  }

  filterMonthList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.MonthList = this.selectFilter.FilterActiveByValue(this.MonthList, detail.Month);
      }
      else {
        this.MonthList = this.selectFilter.FilterActive(this.MonthList);
      }
    }
    this.MonthList = [...this.MonthList];
  }

  filterYearList(filter?: boolean) {
    this.YearList = [...this.YearList];
  }

  filterSDPeriodList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.SdPeriod = this.selectFilter.FilterActiveByValue(this.SdPeriod, detail.ToBranchCode);
      }
      else {
        this.SdPeriod = this.selectFilter.FilterActive(this.SdPeriod);
      }
    }
    this.SdPeriod = [...this.SdPeriod];
  }

  buildYearList() {
    var date = new Date();
    var indexYear = date.getFullYear() - 1740;
    for (var i = -1; i <= indexYear; i++) {
      var Value
      var TextEng = Value = date.getFullYear() - i;
      var TextTha = (date.getFullYear() - i) + 543;
      this.YearList.push({ Value, TextTha, TextEng });
    }
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORF11');
  }

  preparePrint() {
    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.ReportName = 'LORF11_' + this.searchForm.controls.ReportType.value + (this.searchForm.controls.ReportSBTName.value != null ? this.searchForm.controls.ReportSBTName.value : this.searchForm.controls.ReportSDName.value);
    this.nameReport = this.getText((this.searchForm.controls.ReportSBTName.value != null ? this.searchForm.controls.ReportSBTName.value : this.searchForm.controls.ReportSDName.value), (this.searchForm.controls.ReportSBTName.value != null ? this.ReportSBTNameList : this.ReportSDNameList));
    if (this.searchForm.controls.ReportSDName.value == '02') {
      this.reportParam.ExportType = 'pdf';
    } else {
      this.reportParam.ExportType = 'xlsx';
    }
  }

  prepareSave(values: Object) {
    Object.assign(this.reportParam, values);

    this.reportParam.ReportName = 'LORF11_' + this.searchForm.controls.ReportType.value + (this.searchForm.controls.ReportSBTName.value != null ? this.searchForm.controls.ReportSBTName.value : this.searchForm.controls.ReportSDName.value);
    this.nameReport = this.getText((this.searchForm.controls.ReportSBTName.value != null ? this.searchForm.controls.ReportSBTName.value : this.searchForm.controls.ReportSDName.value), (this.searchForm.controls.ReportSBTName.value != null ? this.ReportSBTNameList : this.ReportSDNameList));
    if (this.searchForm.controls.ReportSDName.value == '02') {
      this.reportParam.ExportType = 'pdf';
    } else {
      this.reportParam.ExportType = 'xlsx';
    }

    this.reportParam.AkornAttachmentDetail = [];
    // -----------------------------------------------------receiptAttachments--------------------------------------------------------
    const attachments = this.getAttachments.getRawValue();
    //add
    const adding = attachments.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.reportParam.AkornAttachmentDetail.map(attach => {
      return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).concat(this.deleting).find((item) => {
        return attach.AkornAttachmentDetailId == item.AkornAttachmentDetailId
      }));
    })
    this.reportParam.AkornAttachmentDetail = this.reportParam.AkornAttachmentDetail.filter(item => item.RowState !== RowState.Normal && item.RowState !== RowState.Add).concat(adding);
    this.reportParam.AkornAttachmentDetail = this.reportParam.AkornAttachmentDetail.concat(this.deleting);

    this.deleting = [];
    delete this.reportParam['AttachmentsForm'];
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.preparePrint();
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    ).subscribe((res) => {
      if (res) {
        this.OpenWindow(res, this.nameReport);
      }
    });
  }

  getLocaleCompare(from, to) {
    if (from == null || to == null) {
      return 0;
    } else {
      return from.localeCompare(to);
    }
  }

  getText(value, list) {
    if (value) {
      const textData = list.find(data => {
        return data.Value == value;
      });
      // return this.lang.CURRENT == "Tha" ? textData.TextTha : textData.TextEng;
      return textData.TextEng;
    }
  }

  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + this.reportParam.ExportType + ";base64," + data;
    doc.download = name + "_" + this.reportParam.Month + "_" + this.reportParam.Year + "." + this.reportParam.ExportType
    doc.click();
  }

  get getAttachments(): FormArray {
    return this.searchForm.get('AttachmentsForm') as FormArray;
  };

  addAttachment() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;

      this.as.warning('', 'กรุณาเลือกเงื่อนไขการออกรายงานให้ครบถ้วน')
      return;
    }

    this.getAttachments.markAsDirty();
    this.getAttachments.push(this.createAttachmentForm({} as AkornAttachment));

    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.getAttachments.getRawValue().length == 0 && this.reportParam.AkornAttachmentDetail.length == 0) {
      this.as.warning('', 'รายการเอกสารแนบต้องมีมากกว่า 1 รายการ')
      return;
    }

    this.saving = true;
    this.prepareSave(this.searchForm.getRawValue());
    this.ls.saveAttachment(this.reportParam).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: any) => {
        this.onSearchAttachment();
        this.as.success('', 'Message.STD00006');
      });
  }

  onSearchAttachment() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.preparePrint();
    this.ls.getReportDetail(this.reportParam)
      .pipe(finalize(() => {
        this.submitted = false;
      }))
      .subscribe(
        (res: ReportParam) => {
          if (res) {
            this.reportParam = res;

            this.searchForm.markAsPristine();
            this.searchForm.patchValue(res);

            setTimeout(() => {
              this.searchForm.setControl('AttachmentsForm', this.fb.array(res.AkornAttachmentDetail.map((detail) => this.createAttachmentForm(detail))))
              this.checkAkornAttachment();
            }, 300);
          } else {
            this.searchForm.controls.AkornAttachmentHeadId.setValue(0);
            this.searchForm.setControl('AttachmentsForm', this.fb.array([]));
          }
        });
  }

  removeAttachment(index) {
    this.attachmentFiles.splice(index, 1);
    let detail = this.getAttachments.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      //เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
      // const deleting = this.reportParam.AkornAttachmentDetail.find(item =>
      //   item.AkornAttachmentDetailId == detail.controls.AkornAttachmentDetailId.value
      // )
      detail.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
      this.deleting.push(detail.getRawValue());
    }

    const rows = [...this.getAttachments.getRawValue()];
    rows.splice(index, 1);

    //--ลบข้อมูลrecordนี้ออกจาก formarray
    this.getAttachments.patchValue(rows, { emitEvent: false });
    this.getAttachments.removeAt(this.getAttachments.length - 1);
    this.getAttachments.markAsDirty();
    //---------------------------------
    this.checkAkornAttachment();
  }

  checkAkornAttachment() {
    this.getAttachments.enable();
    for (let i = 0; i < this.getAttachments.length; i++) {
      let form = this.getAttachments.controls[i] as FormGroup;
      if (form.controls.AkornAttachmentDetailId.value != 0) {
        form.controls.AttachmentId.disable({ emitEvent: false });
        form.controls.Description.disable({ emitEvent: false });
      }
    }
  }

  fileNameReturn(filename, index) {
    let form = this.getAttachments.controls[index] as FormGroup;
    form.controls.FileName.setValue(filename);
  }
}
