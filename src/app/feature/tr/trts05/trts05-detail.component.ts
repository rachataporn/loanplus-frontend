import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, SelectFilterService, Page } from '@app/shared';
import { Trts05Service, Tracking } from './trts05.service';
import { Image, PlainGalleryConfig, PlainGalleryStrategy, GridLayout } from '@ks89/angular-modal-gallery';
import { ConfigurationService, ContentType, Category } from '../../../shared/service/configuration.service';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as numeral from 'numeral';
// import { Trts05LookupDetailComponent } from './trts05-lookup-detail.component';

@Component({
  templateUrl: './trts05-detail.component.html'
})
export class Trts05DetailComponent implements OnInit {
  tracking: Tracking = {} as Tracking;
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private config: ConfigurationService,
    private sv: Trts05Service,
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

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.assetTypeList = data.trts02.master.ContractList;
      this.docStatusList = data.trts02.master.Status;
      this.approvalStatusList = data.trts02.master.TrItemList;
      this.tracking = data.trts02.TrackingDetail;
    });
    this.rebuildForm();
    this.filterListDropdown();
    this.searchForm.controls.flagSearch.setValue(false);
    this.onSearch();

    this.lang.onChange().subscribe(() => {
      this.filterListDropdown();
    });
  }

  rebuildForm() {
    this.TrackingForm.markAsPristine();
    this.TrackingForm.patchValue(this.tracking);

    this.tracking.PaymentDate != null ? this.TrackingForm.controls.PaymentDate.setValue(new Date(this.tracking.PaymentDate)) : this.TrackingForm.controls.PaymentDate.setValue(new Date());

    const imgProfileImage = { DataUrl: this.tracking.ProfileImage, Name: 'imgCard1.jpg', Uploaded: false };
    this.TrackingForm.controls.ProfileImage.setValue(imgProfileImage);
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  onSearch() {
    this.sv.getSearchMaster(this.statusPage ? this.searchForm.value : this.beforeSearch, this.page)
      .pipe(finalize(() => {
        if (this.statusPage) {
          this.beforeSearch = this.searchForm.value;
          this.searchForm.controls.beforeSearch.setValue(this.searchForm.value);
        }
      }))
      .subscribe(
        (res: any) => {
          this.customerList = res.Rows;
          this.count = res.Rows.length ? res.Total : 0;
        });
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
    this.submitted = true;
    if (this.TrackingForm.invalid) {
      this.focusToggle = !this.focusToggle;
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
          this.rebuildForm();
          this.as.success('', 'บันทึกสำเร็จ');
        }
      );
  }

  prepareSave(values: Object) {
    Object.assign(this.tracking, values);
  }

  back() {
    this.router.navigate(['/tr/trts02'], { skipLocationChange: true });
  }

  loanDetailOutput(loanDetail) {
    if (loanDetail != undefined) {
      this.ContractHeadId = loanDetail.ContractHeadId;
    }
  }
}