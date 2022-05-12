import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, SelectFilterService, Page, BrowserService, ModelRef, Size } from '@app/shared';
import { Trts06Service, Tracking } from './trts06.service';
import { Image } from '@ks89/angular-modal-gallery';
import { ConfigurationService, Category } from '../../../shared/service/configuration.service';
import { finalize } from 'rxjs/operators';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Trts06LookupComponent } from './trts06-lookup.component';

@Component({
  templateUrl: './trts06-detail.component.html'
})
export class Trts06DetailComponent implements OnInit {
  Trts06LookupContent = Trts06LookupComponent;
  tracking = {} as Tracking;
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private config: ConfigurationService,
    private sv: Trts06Service,
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
          this.tracking.ProfileImage = res.ProfileImage;
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
      this.TrackingForm.controls.MainContractHeadId.setValue(contract.MainContractHeadId);
      this.TrackingForm.controls.ContractNo.setValue(contract.ContractNo);
      this.TrackingForm.controls.TrackingId.setValue(contract.TrackingId, { emitEvent: false, onlySelf: true });
      this.TrackingForm.controls.DueDate.setValue(contract.DueDate);
      this.getSearchAmount();
      this.getBorrowerList();
    }
  }

  createForm() {
    this.TrackingForm = this.fb.group({
      TrackingId: null,
      MainContractHeadId: null,
      TrackingDate: new Date(),
      DueDate: null,
      TrackingItemNameTha: "ส่งเรื่องฟ้องด่วน",
      NplTrackingStatus: ['LW', Validators.required],
      Remark: null,
      CustomerCode: null,
      CustomerNameTha: null,
      ContractNo: null
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

    this.TrackingForm.controls.CustomerNameTha.valueChanges.subscribe(value => {
      if (!this.tracking.TrackingId) {
        this.tracking = {} as Tracking;
        this.amountList = null;
        if (value) {
          this.TrackingForm.patchValue(value, { emitEvent: false, onlySelf: true });
          this.TrackingForm.controls.ContractNo.setValue(null, { emitEvent: false, onlySelf: true });
          this.TrackingForm.controls.TrackingId.setValue(null);
          this.tracking.MobileNo = value.MobileNo;
          this.tracking.CustomerCode = value.CustomerCode;
          this.tracking.CustomerNameTha = value.CustomerNameTha;

          this.getContractByCustomerList();
        }
      }
    });
  }

  get AttachHis(): FormArray {
    return this.TrackingForm.get('AttachHis') as FormArray;
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

    this.route.data.subscribe((data) => {
      this.statusDDLList = data.trts06.master.StatusDDL;
      this.tracking = data.trts06.TrackingDetail;
    });
    this.rebuildForm();
    this.bindDropDownList();
  }

  rebuildForm() {
    this.TrackingForm.controls.TrackingItemNameTha.disable();

    if (this.tracking.TrackingId) {
      this.TrackingForm.markAsPristine();
      this.TrackingForm.patchValue(this.tracking);

      this.TrackingForm.controls.Remark.disable();
    }
    this.TrackingForm.controls.TrackingDate.disable();
    this.TrackingForm.controls.NplTrackingStatus.disable();
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

  prepareSave(values: Object) {
    Object.assign(this.tracking, values);
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
          this.flagRemark = false;
          this.rebuildForm();
          this.as.success('', 'บันทึกสำเร็จ');
        }
      );
  }

  back() {
    this.router.navigate(['/tr/trts06'], { skipLocationChange: true });
  }

  loanDetailOutput(loanDetail) {
    if (loanDetail != undefined) {
      this.ContractHeadId = loanDetail.ContractHeadId;
    }
  }

  linkToContract(id) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots06/detail', { id: id, backToPage: '/tr/trts06' }], { skipLocationChange: true }));
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
}
