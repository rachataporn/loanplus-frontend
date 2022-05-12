import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, SelectFilterService, Page, ModalRef, Size } from '@app/shared';
import { Image, PlainGalleryConfig, PlainGalleryStrategy, GridLayout } from '@ks89/angular-modal-gallery';
import { ConfigurationService, ContentType, Category } from '../../../shared/service/configuration.service';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as numeral from 'numeral';

@Component({
  templateUrl: './trts01-2-detail.component.html'
})
export class Trts0102DetailComponent implements OnInit {
  // reportParam = {} as ReportParam;
  tracking = {};
  TrackingForm: FormGroup;
  searchForm: FormGroup;
  submitted: boolean;
  focusToggle: boolean;
  saving: boolean;
  disabled: boolean;
  disabledDisApp = true;
  image: string;
  maxAmount = 0;
  dataUrl: string;
  ImagePicture: Image[] = [];
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
  // Trts02LookupDetailComponent = Trts02LookupDetailComponent;
  ContractHeadId = null;
  ContractList: any[];
  Status: any[];
  TrItemList: any[];
  beforeSearch = '';
  statusPage = true;
  page = new Page();
  customerList = [];
  count = 0;
  images = [];
  customerLists = [{ Name: 'กนภัณฑ์ ไชยบุญเรือง', Phone: '0889920000' }]
  printing: boolean;
  srcResult = null;
  status = [{ Value: '1', Text: 'ลูกค้านัดชำระ' }, { Value: '2', Text: 'ติดต่อไม่ได้, ไม่นัดชำระ' }]
  changePopup: ModalRef;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private config: ConfigurationService,
    private modal: ModalService,
    // private trts02Service: Trts02Service,
    public lang: LangService,
    private filter: SelectFilterService,

  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createBackSearchForm() {
    const now = new Date();

    this.searchForm = this.fb.group({
      ContractNo: null,
      TrackingDate: now,
      TrackingItemId: null,
      Status: '1',
      beforeSearch: null,
      flagSearch: null
    });
  }

  createForm() {
    this.TrackingForm = this.fb.group({
      TrackingId: null,
      ContractHeadId: null,
      TrackingNo: null,
      TrackingItemId: null,
      TrackingDate: null,
      TrackingStatus: null,
      TrackingCost: null,
      Remark: null,
      TrackingStatusCurrent: null,
      PaymentDate: null,

      CountNumber: null,
      ContractNo: null,
      CustomerCode: null,
      CustomerNameTha: null,
      CustomerNameEng: null,
      MobileNo: null,
      DueDate: null,
      PrincipleAmount: null,
      InterestAmount: null,
      FineAmount: null,
      TrackingAmount: null,
      TotalAmount: null,
      ProfileImage: null,
      CompanyCode: null,
    });

  }

  tabSelect(value) {

  }
  open(content) {
    this.changePopup = this.modal.open(content, Size.medium);
  }
  closeReset() {
    this.changePopup.hide();
  }
  ngOnInit() {
    this.count = 10;
    // this.route.data.subscribe((data) => {
    //   this.assetTypeList = data.trts02.master.ContractList;
    //   this.docStatusList = data.trts02.master.Status;
    //   this.approvalStatusList = data.trts02.master.TrItemList;
    //   this.tracking = data.trts02.TrackingDetail;
    // });
    // this.rebuildForm();
    // this.filterListDropdown();
    // this.searchForm.controls.flagSearch.setValue(false);
    // this.onSearch();

    // this.lang.onChange().subscribe(() => {
    //   this.filterListDropdown();
    // });
  }

  rebuildForm() {
    // this.TrackingForm.markAsPristine();
    // this.TrackingForm.patchValue(this.tracking);
    // const imgProfileImage = { DataUrl: this.tracking.ProfileImage, Name: 'imgCard1.jpg', Uploaded: false };
    // this.TrackingForm.controls.ProfileImage.setValue(imgProfileImage);
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  onSearch() {
    // this.trts02Service.getSearchHistoryDetail(this.TrackingForm.value, this.page)
    //   .pipe(finalize(() => {
    //   }))
    //   .subscribe(
    //     (res: any) => {
    //       this.customerList = res.Rows;
    //       this.count = res.Rows.length ? res.Total : 0;
    //     });
  }

  get getStatus() {
    return this.docStatusList.find((item) => { return item.Value == this.TrackingForm.controls['TrackingStatus'].value });
  };

  filterListDropdown() {
    this.TrItemList = this.filter.FilterActive(this.approvalStatusList);
    this.filter.SortByLang(this.TrItemList);
    this.TrItemList = [...this.approvalStatusList];

  }

  onSubmit() {
    // this.submitted = true;
    // if (this.TrackingForm.invalid) {
    //   this.focusToggle = !this.focusToggle;
    //   return;
    // }
    // this.saving = true;
    // this.prepareSave(this.TrackingForm.getRawValue());
    // this.trts02Service.saveRequestRoan(this.tracking).pipe(
    //   finalize(() => {
    //     this.saving = false;
    //     this.submitted = false;
    //     this.onSearch();
    //   }))
    //   .subscribe(
    //     (res: Tracking) => {
    //       this.tracking = res;
    //       this.rebuildForm();
    //       this.as.success('', 'บันทึกสำเร็จ');
    //     }
    //   );
  }

  prepareSave(values: Object) {
    // Object.assign(this.tracking, values);
  }

  back() {
    this.router.navigate(['/tr/trts01-2'], { skipLocationChange: true });
  }

  loanDetailOutput(loanDetail) {
    if (loanDetail != undefined) {
      this.ContractHeadId = loanDetail.ContractHeadId;
    }
  }

  print() {
    // this.printing = true;
    // this.reportParam.CompanyCode = this.tracking.CompanyCode;
    // this.reportParam.CustomerCode = this.tracking.CustomerCode;
    // this.reportParam.ReportName = 'TRTSHistory';
    // this.reportParam.ReportCode = 'TRTS02';
    // this.reportParam.ExportType = 'pdf';
    // this.trts02Service.generateReport(this.reportParam).pipe(
    //   finalize(() => {
    //     this.printing = false;
    //   })
    // )
    //   .subscribe((res: any) => {
    //     if (res) {
    //       // this.srcResult = res;
    //       this.OpenWindow(res, this.tracking.TrackingNo);
    //     }
    //   });
  }

  async OpenWindow(data, TrackingNo) {
    let doc = document.createElement("a");
    doc.href = "data:application/pdf;base64," + data;
    doc.download = "TRTS02_" + TrackingNo + ".pdf"
    doc.click();
  }
}
