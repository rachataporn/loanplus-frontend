import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { SelectFilterService, Page, BrowserService, ModalService, ModelRef, Size, RowState } from '@app/shared';
import { Image } from '@ks89/angular-modal-gallery';
import { Category, ConfigurationService } from '../../../shared/service/configuration.service';
import { finalize } from 'rxjs/operators';
import { Trts01Service, Tracking, ReportParam, TrackingAttachment } from './trts01.service';
import { Trts01LookupComponent } from './trts01-lookup.component';
import { Attachment } from '@app/shared/attachment/attachment.model';

@Component({
  templateUrl: './trts01-detail.component.html'
})
export class Trts01DetailComponent implements OnInit {
  Trts01LookupContent = Trts01LookupComponent;
  tracking = {} as Tracking;
  reportParam = {} as ReportParam;
  TrackingForm: FormGroup;
  searchForm: FormGroup;
  popup: ModelRef;
  submitted: boolean;
  focusToggle: boolean;
  saving: boolean;
  disabled: boolean;
  disabledDisApp = true;
  image: string;
  maxAmount = 0;
  dataUrl: string;
  ImagePicture: Image[] = [];
  statusDDLList = [];
  dateNow = new Date();
  TabSelect: string = '';
  assetTypeList = [];
  LoanTypeList = [];
  LoanTypeLists = [];
  contractPeriods = [];
  docStatusList = [];
  approvalStatusList = [];
  loanChannelList = [];
  flagCalPeriod: boolean;
  disabledSuc: boolean;
  showDisApp = true;
  disabledCancel: boolean;
  ContractHeadId = null;
  ContractList: any[];
  Status: any[];
  TrItemList: any[];
  beforeSearch = '';
  statusPage = true;
  pageCall = new Page();
  pageCom = new Page();
  pageNpl = new Page();
  pageSearch = new Page();
  customerList = [];
  count = 0;
  images = [];
  printing: boolean;
  srcResult = null;
  amountList: any;
  borrowerList: any;
  ContractByCustomerList: any;
  callHisCount = 0;
  callHis = [];
  comHisCount = 0;
  comHis = [];
  nplHisCount = 0;
  nplHis = [];
  flagRemark = true;
  TelOther = [];
  dueDateNpl = null;
  pageAttach = new Page();
  category = Category.TrackingAttachment;
  attachmentFiles: Attachment[] = [];
  trackingAttachment = [];
  trackingAttachmentCount = 0;
  isDisableAttachment: boolean = false;
  attachmentDeleting = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private config: ConfigurationService,
    private sv: Trts01Service,
    public lang: LangService,
    private browser: BrowserService,
    private filter: SelectFilterService,
    private selectFilter: SelectFilterService,
    private modal: ModalService,


  ) {
    this.createForm();
  }

  createForm() {
    this.TrackingForm = this.fb.group({
      TrackingId: null,
      MainContractHeadId: null,
      CountTime: 1,
      TrackingDate: this.dateNow,
      DueDate: null,
      MeetingDate: [null, Validators.required],
      TrackingItemNameTha: "โทรติดตาม",
      CallTrackingStatus: [null, Validators.required],
      Remark: null,
      CustomerCode: null,
      CustomerNameTha: null,
      ContractNo: null,
      CostMoveRefinance: null,
      TrackingAttachment: this.fb.array([]),
    });

    if (this.TrackingForm.controls.TrackingId.value === null) {
      this.TrackingForm.controls.CustomerCode.setValidators([Validators.required]);
      this.TrackingForm.controls.CustomerNameTha.setValidators([Validators.required]);
      this.TrackingForm.controls.ContractNo.setValidators([Validators.required]);
    } else {
      this.TrackingForm.controls.CustomerCode.clearValidators();
      this.TrackingForm.controls.CustomerNameTha.clearValidators();
      this.TrackingForm.controls.ContractNo.clearValidators();
    }

    this.TrackingForm.controls.CallTrackingStatus.valueChanges.subscribe(value => {
      if (value == 'M') {
        this.TrackingForm.controls.MeetingDate.enable();
        this.TrackingForm.controls.MeetingDate.setValue(new Date());
      } else {
        this.TrackingForm.controls.MeetingDate.setValue(null);
        this.TrackingForm.controls.MeetingDate.disable();
      }
    });

    this.TrackingForm.controls.CustomerNameTha.valueChanges.subscribe(value => {
      this.tracking = {} as Tracking;
      this.amountList = null;
      if (value) {
        this.TrackingForm.patchValue(value, { emitEvent: false, onlySelf: true });
        this.TrackingForm.controls.ContractNo.setValue(null, { emitEvent: false, onlySelf: true });

        this.tracking.MobileNo = value.MobileNo;
        this.tracking.CountTime = value.CountTime;
        this.tracking.ProfileImage = value.ProfileImage;
        this.tracking.CustomerCode = value.CustomerCode;
        this.tracking.CustomerNameTha = value.CustomerNameTha;

        this.getContractByCustomerList();
      }
    });

    this.TrackingForm.controls.MeetingDate.valueChanges.subscribe(value => {
      if (value) {
        if (this.dueDateNpl && value > this.dueDateNpl) {
          this.as.warning('', 'วันที่นัดชำระ ต้องไม่เกิน Due Date ที่เริ่มค้าง + 50 วัน');
          this.TrackingForm.controls.MeetingDate.setValue(null);
        }
      }
    });
  }

  tabSelect(value) {
    setTimeout(this.triggerResize.bind(this), 1)
  }

  private triggerResize() {
    if (this.browser.isIE) {
      var evt = document.createEvent('UIEvents');
      evt.initEvent('resize', true, false);
      window.dispatchEvent(evt);
    } else {
      window.dispatchEvent(new Event('resize'));
    }
  }
  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });
    this.count = 10;
    this.route.data.subscribe((data) => {
      this.statusDDLList = data.trts01.master.StatusDDL;
      this.tracking = data.trts01.TrackingDetail;
    });
    this.rebuildForm();
    this.bindDropDownList();
  }

  rebuildForm() {
    if (this.tracking.TrackingId) {
      this.TrackingForm.markAsPristine();
      this.TrackingForm.patchValue(this.tracking, { emitEvent: false, onlySelf: true });
      this.TrackingForm.setControl('TrackingAttachment', this.fb.array(this.tracking.TrackingAttachment.map((detail) => this.trackingAttachForm(detail))))
      this.TrackingForm.controls.MeetingDate.disable();
      if (!this.TrackingForm.controls.TrackingDate.value) {
        this.TrackingForm.controls.TrackingDate.setValue(this.dateNow);
      }
      if (this.TrackingForm.controls.CallTrackingStatus.value == 'C' ||
        this.TrackingForm.controls.CallTrackingStatus.value == 'L') {
        this.TrackingForm.controls.CallTrackingStatus.setValue(null);
      }

      if (this.flagRemark) {
        this.TrackingForm.controls.Remark.setValue(null);
      }
      this.getSearchAmount();
      this.getBorrowerList();
      this.onSearchHis();
      this.checkContractAttachment();
    }
    this.TrackingForm.controls.CountTime.disable();
    this.TrackingForm.controls.TrackingItemNameTha.disable();
    this.TrackingForm.controls.TrackingDate.disable();

    this.dueDateNpl = new Date(this.tracking.DueDate);
    this.dueDateNpl.setDate(this.dueDateNpl.getDate() + 50);
  }

  getContractByCustomerList() {
    this.TrackingForm.controls.MainContractHeadId.setValue(null, { emitEvent: false, onlySelf: true });
    this.TrackingForm.controls.ContractNo.setValue(null, { emitEvent: false, onlySelf: true });

    this.tracking.MainContractHeadId = null;
    this.tracking.ContractNo = null;
    this.tracking.CallTrackingStatus = null;
    this.tracking.HomeTrackingStatus = null;
    this.tracking.LawTrackingStatus = null;
    this.tracking.NplTrackingStatus = null;
    this.tracking.TotalAmount = null;

    this.amountList = null;

    this.sv.getContractList(this.tracking.CustomerCode).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.ContractByCustomerList = res.ContractList;
        }
      );
  }

  changeContractDDL(ddl) {
    let contract = ddl.selectedValues[0];
    if (contract) {
      this.tracking.MainContractHeadId = contract.MainContractHeadId;
      this.tracking.ContractNo = contract.ContractNo;
      this.tracking.DueDate = contract.DueDate;
      this.tracking.CallTrackingStatus = contract.CallTrackingStatus;
      this.tracking.HomeTrackingStatus = contract.HomeTrackingStatus;
      this.tracking.LawTrackingStatus = contract.LawTrackingStatus;
      this.tracking.NplTrackingStatus = contract.NplTrackingStatus;
      this.tracking.TotalAmount = contract.TotalAmount;

      this.TrackingForm.controls.MainContractHeadId.setValue(contract.MainContractHeadId);
      this.TrackingForm.controls.ContractNo.setValue(contract.ContractNo);
      this.TrackingForm.controls.DueDate.setValue(contract.DueDate);

      this.getSearchAmount();

      this.dueDateNpl = new Date(contract.DueDate);
      this.dueDateNpl.setDate(this.dueDateNpl.getDate() + 50);
    }
  }

  bindDropDownList() {
    this.filterReportCondition(true);
  }

  getSearchAmount() {
    this.sv.getSearchAmount(this.tracking.MainContractHeadId).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.amountList = res.AmountList;
        }
      );
  }

  getBorrowerList() {
    this.sv.getBorrowerList(this.tracking.MainContractHeadId).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.borrowerList = res.BorrowerList;
        }
      );
  }

  filterReportCondition(filter?: boolean) {
    this.statusDDLList = this.selectFilter.FilterActive(this.statusDDLList);
    this.statusDDLList = [...this.statusDDLList];
  }

  onTableEventComHis(event) {
    this.pageCom = event;
    this.statusPage = false;
    this.searchHistoryCompany();
  }

  onTableEventNplHis(event) {
    this.pageNpl = event;
    this.statusPage = false;
    this.searchHistoryHome();
  }

  onTableEventCallHis(event) {
    this.pageCall = event;
    this.statusPage = false;
    this.searchHistoryCall();
  }

  onSearchHis() {
    this.searchHistoryCall();
    this.searchHistoryCompany();
    this.searchHistoryHome();
  }

  searchHistoryCall() {
    this.sv.getSearchHistoryCall(this.tracking.CustomerCode, this.pageCall)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.callHis = res.Rows;
          this.callHisCount = res.Rows.length ? res.Total : 0;
        });
  }

  searchHistoryCompany() {
    this.sv.getSearchHistoryCompany(this.tracking.CustomerCode, this.pageCom)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.comHis = res.Rows;
          this.comHisCount = res.Rows.length ? res.Total : 0;
        });
  }

  searchHistoryHome() {
    this.sv.getSearchHistoryHome(this.tracking.CustomerCode, this.pageNpl)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.nplHis = res.Rows;
          this.nplHisCount = res.Rows.length ? res.Total : 0;
        });
  }

  filterListDropdown() {
    this.TrItemList = this.filter.FilterActive(this.approvalStatusList);
    this.filter.SortByLang(this.TrItemList);
    this.TrItemList = [...this.approvalStatusList];
  }

  prepareSave(values) {
    Object.assign(this.tracking, values);
    if (this.tracking.TrackingAttachment != undefined) {
      const beforeAddPayName = this.tracking.TrackingAttachment.filter((item) => {
        return item.RowState !== RowState.Add;
      });
      this.tracking.TrackingAttachment = beforeAddPayName;
    }

    if (this.tracking.TrackingAttachment) {
      const data = values.TrackingAttachment.concat(this.attachmentDeleting);

      this.tracking.TrackingAttachment.map(detail => {
        return Object.assign(detail, data.find((o) => {
          return o.AttachmentId === detail.AttahmentId;
        }));
      });

      this.add(values);
    } else {
      this.tracking.TrackingAttachment = [];
      this.add(values);
    }
  }

  add(values) {
    const attachmentAdding = values.TrackingAttachment.filter((item) => {
      return item.RowState === RowState.Add;
    });
    this.tracking.TrackingAttachment = this.tracking.TrackingAttachment.concat(attachmentAdding);
    this.tracking.TrackingAttachment = this.tracking.TrackingAttachment.concat(this.attachmentDeleting);
    this.attachmentDeleting = [];
  }

  onSubmit() {
    this.submitted = true;
    if (this.TrackingForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    if (this.TrackingForm.controls.CallTrackingStatus.value == 'L' ||
      this.TrackingForm.controls.CallTrackingStatus.value == 'C'
    ) {
      this.as.warning('', 'กรุณาเปลี่ยนสถานะการติดตาม');
      return;
    }
    this.saving = true;
    this.prepareSave(this.TrackingForm.getRawValue());
    this.sv.saveRequestRoan(this.tracking).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: Tracking) => {
          this.tracking = res;
          this.flagRemark = false;
          this.rebuildForm();
          this.as.success('', 'บันทึกสำเร็จ');
        }
      );
  }

  back() {
    this.router.navigate(['/tr/trts01'], { skipLocationChange: true });
  }

  loanDetailOutput(loanDetail) {
    if (loanDetail != undefined) {
      this.ContractHeadId = loanDetail.ContractHeadId;
    }
  }

  print(TrackingItemCode) {
    this.printing = true;
    this.reportParam.CustomerCode = this.tracking.CustomerCode;
    this.reportParam.CompanyCode = null;
    this.reportParam.TrackingItemCode = TrackingItemCode;
    this.reportParam.ReportName = 'TRTSHistory';
    this.reportParam.ReportCode = 'TRTS01';
    this.reportParam.ExportType = 'pdf';
    this.sv.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.printing = false;
      })
    )
      .subscribe((res: any) => {
        if (res) {
          // this.srcResult = res;
          this.OpenWindow(res, this.tracking.ContractNo);
        }
      });
  }

  async OpenWindow(data, TrackingNo) {
    let doc = document.createElement("a");
    doc.href = "data:application/pdf;base64," + data;
    doc.download = "TRTS01_" + TrackingNo + ".pdf"
    doc.click();
  }

  linkToContract(id) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/tr/trts01' }], { skipLocationChange: true }));
    window.open(url, '_blank');
  }

  openModal(content, CustomerCode) {

    this.sv.getMobileNumberOther(CustomerCode).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.popup = this.modal.open(content, Size.large);
          this.TelOther = res.Rows;
        }
      );
  }
  closeModal() {
    this.popup.hide();
  }

  get trackingAttach(): FormArray {
    return this.TrackingForm.get('TrackingAttachment') as FormArray;
  }

  trackingAttachForm(item: TrackingAttachment): FormGroup {
    let fg = this.fb.group({
      TrackingAttachmentId: null,
      AttahmentId: null,
      FilePath: null,
      FileName: null,
      Description: null,
      isDisableAttachment: null,
      RowState: RowState.Add,
      CreatedDate: null,
      CreatedBy: null
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

  addAttachment() {
    this.trackingAttach.markAsDirty();
    this.trackingAttach.push(this.trackingAttachForm({} as TrackingAttachment));
  }

  fileNameReturn(filename, index) {
    let form = this.trackingAttach.controls[index] as FormGroup;
    form.controls.FileName.setValue(filename);
  }

  removeAttachment(index) {
    const attachment = this.trackingAttach.at(index) as FormGroup;
    if (attachment.controls.RowState.value !== RowState.Add) {
      attachment.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
      this.attachmentDeleting.push(attachment.getRawValue());
    }

    const rows = [...this.trackingAttach.getRawValue()];
    rows.splice(index, 1);

    this.trackingAttach.patchValue(rows, { emitEvent: false });
    this.trackingAttach.removeAt(this.trackingAttach.length - 1);
    this.TrackingForm.markAsDirty();

  }

  checkContractAttachment() {
    this.trackingAttach.enable();
    for (let i = 0; i < this.trackingAttach.length; i++) {
      let form = this.trackingAttach.controls[i] as FormGroup;
      if (form.controls.AttahmentId.value) {
        form.controls.AttahmentId.disable({ emitEvent: false });
        form.controls.Description.disable({ emitEvent: false });
      }
    }
  }

}
