import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { SelectFilterService, Page, BrowserService, ModalService, ModelRef, Size, RowState } from '@app/shared';
import { Trts04Service, Tracking, ReportParamLorf02, ReportParamLorp15, ReportParamNotice, AttachHis, TrackingAttachment } from './trts04.service';
import { Image } from '@ks89/angular-modal-gallery';
import { Category, ConfigurationService } from '../../../shared/service/configuration.service';
import { finalize } from 'rxjs/operators';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Trts0401LookupComponent } from './trts0401-lookup.component';

@Component({
  templateUrl: './trts04-detail.component.html'
})
export class Trts04DetailComponent implements OnInit {
  tracking = {} as Tracking;
  Trts0401LookupContent = Trts0401LookupComponent;
  reportParamLorf02 = {} as ReportParamLorf02;
  reportParamNotice = {} as ReportParamNotice;
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
  PeriodList = ['12', '24', '36', '48'];
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
  pageLaw = new Page();
  pageAttach = new Page();
  customerList = [];
  count = 0;
  images = [];
  customerLists = [{ Name: 'กนภัณฑ์ ไชยบุญเรือง', Phone: '0889920000' }]
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
  lawHisCount = 0;
  lawHis = [];
  attachHisCount = 0;
  attachHis = [];
  minDate = new Date();
  flagRemark = true;
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
    private sv: Trts04Service,
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
      // this.TrackingForm.controls.TrackingId.setValue(contract.TrackingId)
      // this.tracking.TotalAmount = contract.TotalAmount;
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
      AuctionDate: [null, Validators.required],
      CostSue: [null, Validators.required],
      MeetingDate: [null, Validators.required],
      TrackingItemNameTha: "การติดตามสำหรับ Law department",
      LawTrackingStatus: [null, Validators.required],
      Remark: null,
      AttachHis: this.fb.array([]),
      CustomerCode: null,
      CustomerNameTha: null,
      ContractNo: null,
      OwnerDeadthDate: null,
      TrackingAttachment: this.fb.array([]),
      CostExecute: [null, Validators.required]
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


    this.TrackingForm.controls.LawTrackingStatus.valueChanges.subscribe(value => {
      let date = new Date()
      let nummber = new Number()
      if (value == 'M') {
        this.TrackingForm.controls.MeetingDate.enable();
        this.TrackingForm.controls.MeetingDate.setValue(date);
        this.TrackingForm.controls.AuctionDate.setValue(null);
        this.TrackingForm.controls.AuctionDate.disable();
        this.TrackingForm.controls.CostSue.setValue(null);
        this.TrackingForm.controls.CostSue.disable();
        this.TrackingForm.controls.CostExecute.setValue(null);
        this.TrackingForm.controls.CostExecute.disable();
      } else if (value == 'LE') {
        this.TrackingForm.controls.AuctionDate.enable();
        this.TrackingForm.controls.AuctionDate.setValue(date);
        this.TrackingForm.controls.MeetingDate.setValue(null);
        this.TrackingForm.controls.MeetingDate.disable();
        this.TrackingForm.controls.CostSue.setValue(null);
        this.TrackingForm.controls.CostSue.disable();
        this.TrackingForm.controls.CostExecute.setValue(null);
        this.TrackingForm.controls.CostExecute.enable();
      } else if (value == 'S') {
        this.TrackingForm.controls.AuctionDate.setValue(null);
        this.TrackingForm.controls.AuctionDate.disable();
        this.TrackingForm.controls.MeetingDate.setValue(null);
        this.TrackingForm.controls.MeetingDate.disable();
        this.TrackingForm.controls.CostSue.enable();
        this.TrackingForm.controls.CostExecute.disable();
      } else {
        this.TrackingForm.controls.AuctionDate.setValue(null);
        this.TrackingForm.controls.MeetingDate.setValue(null);
        this.TrackingForm.controls.AuctionDate.disable();
        this.TrackingForm.controls.MeetingDate.disable();
        this.TrackingForm.controls.CostSue.setValue(null);
        this.TrackingForm.controls.CostSue.disable();
        this.TrackingForm.controls.CostExecute.setValue(null);
        this.TrackingForm.controls.CostExecute.disable();
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
      this.statusDDLList = data.trts04.master.StatusDDL;
      this.tracking = data.trts04.TrackingDetail;
    });
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.rebuildForm();
    this.bindDropDownList();
  }

  rebuildForm() {
    this.TrackingForm.controls.CountTime.disable();
    this.TrackingForm.controls.TrackingItemNameTha.disable();
    this.TrackingForm.controls.TrackingDate.disable();
    this.TrackingForm.controls.AuctionDate.disable();
    if (this.tracking.TrackingId) {
      this.TrackingForm.markAsPristine();
      this.TrackingForm.patchValue(this.tracking);
      this.TrackingForm.setControl('TrackingAttachment', this.fb.array(this.tracking.TrackingAttachment.map((detail) => this.trackingAttachForm(detail))))
      this.TrackingForm.setControl('TrackingAttachment', this.fb.array(this.tracking.TrackingAttachment.map((detail) => this.trackingAttachForm(detail))))
      if (!this.TrackingForm.controls.TrackingDate.value) {
        this.TrackingForm.controls.TrackingDate.setValue(this.dateNow)
      }
      if (this.TrackingForm.controls.LawTrackingStatus.value == 'LW' ||
        this.TrackingForm.controls.LawTrackingStatus.value == 'L') {
        this.TrackingForm.controls.LawTrackingStatus.setValue(null);
      }

      if (this.flagRemark) {
        this.TrackingForm.controls.Remark.setValue(null);
      }
      this.getSearchAmount();
      this.getBorrowerList();
      this.onSearchHis();
      this.checkContractAttachment();
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

  onTableEventLawHis(event) {
    this.pageLaw = event;
    this.statusPage = false;
    this.searchHistoryLaw();
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
    this.searchHistoryLaw();
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

  searchHistoryLaw() {
    this.sv.getSearchHistoryLaw(this.tracking.CustomerCode, this.pageNpl)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.lawHis = res.Rows;
          this.lawHisCount = res.Rows.length ? res.Total : 0;
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

  filterListDropdown() {
    this.TrItemList = this.filter.FilterActive(this.approvalStatusList);
    this.filter.SortByLang(this.TrItemList);
    this.TrItemList = [...this.approvalStatusList];
  }

  prepareSave(values) {
    Object.assign(this.tracking, values); if (this.tracking.TrackingAttachment != undefined) {
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
    if (this.TrackingForm.controls.LawTrackingStatus.value == 'L' ||
      this.TrackingForm.controls.LawTrackingStatus.value == 'C'
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
    this.router.navigate(['/tr/trts04'], { skipLocationChange: true });
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

    this.reportParamLorp15.FromContractNo = this.tracking.ContractNo
    this.reportParamLorp15.ToContractNo = this.tracking.ContractNo
    this.reportParamLorp15.FromContractCodeText = this.tracking.ContractNo;
    this.reportParamLorp15.ToContractCodeText = this.tracking.ContractNo;
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

  onPrintNotice() {
    this.reportParamNotice.TrackingNo = this.tracking.TrackingId.toString();
    this.sv.generateNotice(this.reportParamNotice).pipe(
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
    doc.download = "trts04_" + TrackingNo + ".pdf"
    doc.click();
  }

  linkToContract(id) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/tr/trts04' }], { skipLocationChange: true }));
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
