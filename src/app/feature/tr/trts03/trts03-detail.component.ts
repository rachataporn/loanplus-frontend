import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, SelectFilterService, Page, BrowserService, ModelRef, Size, RowState } from '@app/shared';
import { Trts03Service, Tracking, ReportParamLorf02, ReportParamLorp15, AttachHis, TrackingAttachment } from './trts03.service';
import { Image } from '@ks89/angular-modal-gallery';
import { ConfigurationService, Category } from '../../../shared/service/configuration.service';
import { finalize } from 'rxjs/operators';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Trts03LookupComponent } from './trts03-lookup.component';

@Component({
  templateUrl: './trts03-detail.component.html'
})
export class Trts03DetailComponent implements OnInit {
  Trts03LookupContent = Trts03LookupComponent;
  tracking = {} as Tracking;
  reportParamLorf02 = {} as ReportParamLorf02;
  reportParamLorp15 = {} as ReportParamLorp15;
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
  pageAttach = new Page();
  customerList = [];
  count = 0;
  images = [];
  printing: boolean;
  srcResult = null;
  amountList: any;
  borrowerList: any;
  callHisCount = 0;
  callHis = [];
  comHisCount = 0;
  comHis = [];
  nplHisCount = 0;
  nplHis = [];
  attachHisCount = 0;
  attachHis = [];
  minDate = new Date();
  duedate3m: any;
  flagRemark = true;
  category = Category.ContractAttachment;
  attachmentFiles: Attachment[] = [];
  ContractByCustomerList: any;
  TelOther = [];
  pageAttach2 = new Page();
  category2 = Category.TrackingAttachment;
  attachmentFiles2: Attachment[] = [];
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
    private sv: Trts03Service,
    public lang: LangService,
    private filter: SelectFilterService,
    private browser: BrowserService,
    private selectFilter: SelectFilterService,
    private modal: ModalService,

  ) {
    this.createForm();
  }


  getContractByCustomerList() {
    this.TrackingForm.controls.MainContractHeadId.setValue(null, { emitEvent: false, onlySelf: true });
    this.TrackingForm.controls.ContractNo.setValue(null, { emitEvent: false, onlySelf: true });

    if (!this.tracking.TrackingId) {
      this.tracking.MainContractHeadId = null;
      this.tracking.ContractNo = null;
      this.tracking.CallTrackingStatus = null;
      this.tracking.HomeTrackingStatus = null;
      this.tracking.LawTrackingStatus = null;
      this.tracking.NplTrackingStatus = null;
      this.tracking.TotalAmount = null;
    }
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
      this.tracking.TrackingId = contract.TrackingId;
      this.tracking.RowVersion = contract.RowVersion;
      this.TrackingForm.controls.MainContractHeadId.setValue(contract.MainContractHeadId);
      this.TrackingForm.controls.ContractNo.setValue(contract.ContractNo);
      this.TrackingForm.controls.TrackingId.setValue(contract.TrackingId, { emitEvent: false, onlySelf: true });
      this.TrackingForm.controls.DueDate.setValue(contract.DueDate);
      this.getSearchAmount();
    }
  }

  createForm() {
    this.TrackingForm = this.fb.group({
      TrackingId: null,
      MainContractHeadId: null,
      CountTime: 1,
      TrackingDate: new Date(),
      DueDate: null,
      MeetingDate: null,
      TrackingItemNameTha: "ติดตามที่บ้าน (NPL)",
      NplTrackingStatus: ['MN', Validators.required],
      MeetingNpl: [null, Validators.required],
      Remark: null,
      AttachHis: this.fb.array([]),
      CustomerCode: null,
      CustomerNameTha: null,
      ContractNo: null,
      StockValue:[null, Validators.required],
      CostForeclosure:[null, Validators.required],
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

    this.TrackingForm.controls.NplTrackingStatus.valueChanges.subscribe(value => {
      let date = new Date()
      if (value == 'M') {
        this.TrackingForm.controls.MeetingDate.enable();
        this.TrackingForm.controls.MeetingDate.setValue(date);
        this.TrackingForm.controls.MeetingNpl.setValue(null);
        this.TrackingForm.controls.MeetingNpl.disable();
        this.TrackingForm.controls.StockValue.setValue(null);
        this.TrackingForm.controls.CostForeclosure.setValue(null);
        this.TrackingForm.controls.StockValue.disable();
        this.TrackingForm.controls.CostForeclosure.disable();
      } else if (value == 'MN') {
        date.setDate(date.getDate() + 1)
        this.TrackingForm.controls.MeetingNpl.enable();
        this.TrackingForm.controls.MeetingNpl.setValue(date);
        this.TrackingForm.controls.MeetingDate.setValue(null);
        this.TrackingForm.controls.MeetingDate.disable();
        this.TrackingForm.controls.StockValue.setValue(null);
        this.TrackingForm.controls.CostForeclosure.setValue(null);
        this.TrackingForm.controls.StockValue.disable();
        this.TrackingForm.controls.CostForeclosure.disable();
      } else if (value == 'SQ') {
        this.TrackingForm.controls.StockValue.enable();
        this.TrackingForm.controls.CostForeclosure.enable();
      }
      else {
        this.TrackingForm.controls.MeetingDate.setValue(null);
        this.TrackingForm.controls.MeetingNpl.setValue(null);
        this.TrackingForm.controls.MeetingNpl.disable();
        this.TrackingForm.controls.MeetingDate.disable();
        this.TrackingForm.controls.StockValue.setValue(null);
        this.TrackingForm.controls.CostForeclosure.setValue(null);
        this.TrackingForm.controls.StockValue.disable();
        this.TrackingForm.controls.CostForeclosure.disable();
      }
    });

    this.TrackingForm.controls.CustomerNameTha.valueChanges.subscribe(value => {
      if (!this.tracking.TrackingId) {
        this.tracking = {} as Tracking;
        this.amountList = null;
        if (value) {
          this.TrackingForm.patchValue(value, { emitEvent: false, onlySelf: true });
          this.TrackingForm.controls.ContractNo.setValue(null, { emitEvent: false, onlySelf: true });
          this.TrackingForm.controls.TrackingId.setValue(null);
          this.tracking.MobileNo = value.MobileNo;
          this.tracking.CountTime = value.CountTime;
          this.tracking.ProfileImage = value.ProfileImage;
          this.tracking.CustomerCode = value.CustomerCode;
          this.tracking.CustomerNameTha = value.CustomerNameTha;

          this.getContractByCustomerList();
        }
      }
    });

    this.TrackingForm.controls.MainContractHeadId.valueChanges.subscribe(value => {
      if (value) {
        this.onSearchHis();
      }
    });

  }

  get AttachHis(): FormArray {
    return this.TrackingForm.get('AttachHis') as FormArray;
  }

  attachHisForm(item: AttachHis): FormGroup {
    let fg = this.fb.group({
      ContractAttachmentId: 0,
      AttachmentTypeCode: null,
      AttachmentType: null,
      FileName: null,
      AttahmentId: { value: null, disabled: true },
      Description: null
    });
    fg.patchValue(item, { emitEvent: false });

    this.attachmentFiles.push(new Attachment());
    return fg;
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
      this.statusDDLList = data.trts03.master.StatusDDL;
      this.tracking = data.trts03.TrackingDetail;
    });
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.rebuildForm();
    this.bindDropDownList();
    // this.checkDue();
  }

  rebuildForm() {
    this.TrackingForm.controls.CountTime.disable();
    this.TrackingForm.controls.TrackingItemNameTha.disable();
    this.TrackingForm.controls.TrackingDate.disable();
    this.TrackingForm.controls.MeetingDate.disable();
    if (this.tracking.TrackingId) {

      this.TrackingForm.markAsPristine();
      this.TrackingForm.patchValue(this.tracking);
      this.TrackingForm.setControl('TrackingAttachment', this.fb.array(this.tracking.TrackingAttachment.map((detail) => this.trackingAttachForm(detail))))
      if (!this.TrackingForm.controls.TrackingDate.value) {
        this.TrackingForm.controls.TrackingDate.setValue(this.dateNow)
      }
      if (this.TrackingForm.controls.NplTrackingStatus.value == 'NPL' ||
        this.TrackingForm.controls.NplTrackingStatus.value == 'L') {
        this.TrackingForm.controls.NplTrackingStatus.setValue(null);
      }

      if (this.flagRemark) {
        this.TrackingForm.controls.Remark.setValue(null);
      }
      this.getSearchAmount();
      this.getBorrowerList();
      this.onSearchHis();
      this.checkContractAttachment();
    } else {
      this.TrackingForm.controls.NplTrackingStatus.disable();
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
          if (!this.tracking.TotalAmount) {
            this.amountList.forEach(element => {
              this.tracking.TotalAmount += element.AmountToBePay
            });
          }

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

    this.statusDDLList = this.statusDDLList.map((item) => {
      return Object.assign(item, { disabled: !this.tracking.CanSendLawDepartment && item.Value == 'LW' })
    })
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

  onTableEventAttachHis(event) {
    this.pageAttach = event;
    this.statusPage = false;
    this.searchHistoryAttach();
  }

  onSearchHis() {
    this.searchHistoryCall();
    this.searchHistoryCompany();
    this.searchHistoryHome();
    this.searchHistoryAttach();
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

  searchHistoryAttach() {
    this.sv.getSearchHistoryAttach(this.tracking.MainContractHeadId, this.pageAttach)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.attachHis = res.Rows;
          this.attachHisCount = res.Rows.length ? res.Total : 0;
          this.TrackingForm.setControl('AttachHis', this.fb.array(res.Rows.map((detail) => this.attachHisForm(detail))));
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
  

  onsave(){
    this.submitted = true;
    if (this.TrackingForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    if (this.TrackingForm.controls.NplTrackingStatus.value == 'L' ||
      this.TrackingForm.controls.NplTrackingStatus.value == 'C'
    ) {
      this.as.warning('', 'กรุณาเปลี่ยนสถานะการติดตาม');
      return;
    }
        this.onSubmit();
  }

  onSubmit() {

    // if (this.TrackingForm.controls.NplTrackingStatus.value == 'LW' &&
    //   this.duedate3m == true) {
    //   this.as.warning('', 'ไม่สามารถส่งรายชื่อให้ Law department ได้ เนื่่องจาก ยังค้างชำระไม่เกิน 3 เดือน');
    //   return;
    // }
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
    this.router.navigate(['/tr/trts03'], { skipLocationChange: true });
  }

  loanDetailOutput(loanDetail) {
    if (loanDetail != undefined) {
      this.ContractHeadId = loanDetail.ContractHeadId;
    }
  }

  // print(TrackingItemCode) {
  //   this.printing = true;
  //   this.reportParam.CustomerCode = this.tracking.CustomerCode;
  //   this.reportParam.CompanyCode = null;
  //   this.reportParam.TrackingItemCode = TrackingItemCode;
  //   this.reportParam.ReportName = 'TRTSHistory';
  //   this.reportParam.ReportCode = 'TRTS01';
  //   this.reportParam.ExportType = 'pdf';
  //   this.sv.generateReport(this.reportParam).pipe(
  //     finalize(() => {
  //       this.printing = false;
  //     })
  //   )
  //     .subscribe((res: any) => {
  //       if (res) {
  //         // this.srcResult = res;
  //         this.OpenWindow(res, this.tracking.ContractNo);
  //       }
  //     });
  // }

  onPrintRp15() {
    const date = new Date();
    this.reportParamLorp15.FromContractNo = this.tracking.ContractNo
    this.reportParamLorp15.ToContractNo = this.tracking.ContractNo
    this.reportParamLorp15.FromContractCodeText = this.tracking.ContractNo;
    this.reportParamLorp15.ToContractCodeText = this.tracking.ContractNo;
    this.reportParamLorp15.FromCustomerCodeText = this.tracking.CustomerCode;
    this.reportParamLorp15.ToCustomerCodeText = this.tracking.CustomerCode;
    this.reportParamLorp15.ToContractCodeText = this.tracking.ContractNo;
    this.reportParamLorp15.AsOfDate = date;
    this.reportParamLorp15.ReportName = 'LORP15_01';
    this.reportParamLorp15.ExportType = 'pdf';
    this.sv.generateReportLorp15(this.reportParamLorp15).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        if (res) {
          this.DownLoadFile(res);
        }
      });
  }

  onPrintRf02() {
    this.reportParamLorf02.FromContractNo = this.tracking.ContractNo;
    this.reportParamLorf02.ToContractNo = this.tracking.ContractNo;
    this.reportParamLorf02.ReportName = 'LORF02_New';
    this.reportParamLorf02.ExportType = 'pdf';

    this.sv.generateReportRf02(this.reportParamLorf02).pipe(
      finalize(() => {
      })
    )
      .subscribe((res) => {
        if (res) {
          this.DownLoadFile(res);
        }
      });
  }

  async DownLoadFile(data) {
    let doc = document.createElement("a");
    doc.href = "data:application/pdf;base64," + data;
    doc.download = this.tracking.ContractNo + ".pdf";
    doc.click();
  }

  async OpenWindow(data, TrackingNo) {
    let doc = document.createElement("a");
    doc.href = "data:application/pdf;base64," + data;
    doc.download = "trts03_" + TrackingNo + ".pdf"
    doc.click();
  }

  checkDue() {
    this.sv.checkDue(this.tracking.TrackingId).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.duedate3m = res;
        }
      );
  }

  linkToContract(id) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/tr/trts03' }], { skipLocationChange: true }));
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
    this.attachmentFiles2.push(new Attachment());
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
