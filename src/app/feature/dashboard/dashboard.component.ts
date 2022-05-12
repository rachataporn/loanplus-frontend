import { Component, OnInit, ApplicationRef, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LangService, AuthService } from '@app/core';
import { DashboardService, ApprovePermission, ContractForm, TrackingDocumentAttachment } from './dashboard.service';
import { ModalService, ModelRef, Page, RowState, SelectFilterService, Size } from '@app/shared';
import { finalize, first, switchMap } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { interval, Subscription, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category } from '@app/shared/service/configuration.service';
import { AlertService } from '@app/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private updateSubscription: Subscription;
  private isStableSubject = new BehaviorSubject<boolean>(false);
  companies = [];
  contracts = [];
  contractsHistory: ContractForm = {} as ContractForm;
  TrackingDoc: ContractForm[] = [];
  historyContract = [];
  ApproveContracts = [];
  ApproveTransferContracts = [];
  pagecontracts = new Page();
  pageweb = new Page();
  pageApproveContracts = new Page();
  pageApproveTransferContracts = new Page();
  pageTrackingDocWeb = new Page();
  pageHistoryContract = new Page();
  pageSearch = new Page();
  statusPage: boolean;
  saving: boolean;
  submitted: boolean;
  NewCustomer: number = 0;
  CustomerAll: number = 0;
  NewContract: number = 0;
  SummaryPrincipleAmount: number = 0;
  SummaryPrincipleAmountAll: number = 0;
  ApproveContract: number = 0;
  SummaryReceiveTotalAmount: number = 0;
  percentReceiveTotalAmount: number = 0;
  DetailCustomerAll = [];
  data1 = [];
  myWorkCreateContract: boolean;
  myWorkApproveContract: boolean;
  myWorkTransferContracts: boolean;
  chart: any;
  chart1: any;
  chart2: any;
  approveWeb = [];
  trackingDocWeb = [];
  autoRefreshRate: number = 60000;
  approvePermission = {} as ApprovePermission;
  popup: ModelRef;
  attachmentDeleting = [];
  category = Category.TrackingDocument;
  attachmentFiles: Attachment[] = [];
  AttachmentDoc: TrackingDocumentAttachment[] = [];
  focusToggle = false;
  ContractForm: FormGroup;
  SearchForm: FormGroup;
  PackageForm: FormGroup;
  IsDisableReturnDoc: boolean = true;
  @ViewChild('historyControlDoc') historyControlDoc: TemplateRef<any>;
  loanAgreement = [];
  pageLoanAgreement = new Page();
  loanRefinance = [];
  pageLoanRefinance = new Page();
  loanWait = [];
  pageWait = new Page();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    public lang: LangService,
    public selectFilter: SelectFilterService,
    public dbService: DashboardService,
    private appRef: ApplicationRef,
    private zone: NgZone,
    private modal: ModalService,
    private fb: FormBuilder,
    private as: AlertService,
  ) {
    this.createForm();
    this.createSearchForm();
    this.appRef.isStable.pipe(
      first(stable => stable)
    ).subscribe(() => this.isStableSubject.next(true))
  }

  createForm() {
    this.ContractForm = this.fb.group({
      ContractNo: null,
      CustomerName: null,
      ContractRefinance: null,
      CloseContract: null,
      ReqDocumentStatus: null,
      CheckCloseContract: null,
      TrackingDocumentAttachment: this.fb.array([]),

    });
  }

  createSearchForm() {
    this.SearchForm = this.fb.group({
      InputSearch: null,
      beforeSearch: null,
      flagSearch: true,
      Keyword: null,
      CompanyCode: null,
      CompanyReqTake: null,
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.companies = data.dashboard.company;
      this.approvePermission = data.dashboard.approvePermission;

    });
    this.selectFilter.SortByLang(this.companies);
    this.companies = [...this.companies];

    this.searchDashbord();
    this.searchCreateContract(false);
    this.searchApproveContractQuery(false);
    this.searchApproveTransferContractQuery(false);
    this.searchApproveWeb(false);
    this.searchTrackingDocWeb();
    this.searchLoanAgreement();
    this.searchLoanRefinance();
    this.searchLoanWait();

    this.isStableSubject.pipe(
      switchMap(() => interval(this.autoRefreshRate))
    ).subscribe(counter => this.zone.run(() => {
      if (this.router.url != undefined && this.router.url === '/dashboard') {
        this.searchDashbord();
        this.searchCreateContract(false);
        this.searchApproveContractQuery(false);
        this.searchApproveTransferContractQuery(false);
        this.searchApproveWeb(false);
        this.searchTrackingDocWeb();
      }
    })
    );
    this.rebuildForm();
  }

  rebuildForm() {
    this.attachmentFiles = [];
    this.ContractForm.markAsPristine();
    this.ContractForm.patchValue(this.contractsHistory);

    this.ContractForm.controls.CustomerName.setValue(this.contractsHistory.CustomerName);
    this.ContractForm.controls.ContractRefinance.setValue(this.contractsHistory.ContractRefinance);
    this.ContractForm.controls.CloseContract.setValue(this.contractsHistory.CloseContract);
    this.ContractForm.disable({ emitEvent: false });

    if (this.contractsHistory.LocationCode == this.auth.company) {
      this.IsDisableReturnDoc = false;
    }

    var companyInit = this.companies.find(com => com.CompanyCode == this.auth.company);
    this.auth.isCompanyTracking = companyInit.IsCompanyTracking;
  }

  get currentCompany() {
    return (this.companies.find(com => com.CompanyCode == this.auth.company) || {});
  }

  onChangeCompany(code, isCompanyTracking) {
    this.auth.company = code;
    this.auth.isCompanyTracking = isCompanyTracking;
    this.searchDashbord();
    this.searchCreateContract(false);
    this.searchApproveContractQuery(false);
    this.searchApproveTransferContractQuery(false);
    this.searchTrackingDocWeb();
  }

  searchDashbord() {
    this.dbService.getMaster({ CompanyCode: this.auth.company }).subscribe(
      (res) => {
        this.autoRefreshRate = res.AutoRefreshRate;
        this.NewCustomer = res.NewCustomer
        this.CustomerAll = res.CustomerAll
        this.NewContract = res.NewContract
        this.SummaryPrincipleAmount = res.SummaryPrincipleAmount
        this.SummaryPrincipleAmountAll = res.SummaryPrincipleAmountAll
        this.ApproveContract = res.ApproveContract
        this.SummaryReceiveTotalAmount = res.SummaryReceiveTotalAmount
        this.DetailCustomerAll = res.DetailCustomerAll

        if (this.SummaryReceiveTotalAmount && this.SummaryPrincipleAmountAll) {
          this.percentReceiveTotalAmount = Math.round(this.SummaryReceiveTotalAmount * 100 / this.SummaryPrincipleAmountAll);
        } else {
          this.percentReceiveTotalAmount = 0;
        }
      }
    )
  }

  onChangeDetailCreateContract($event) {
    this.searchCreateContract($event);
  }

  onChangeDetailApproveContract($event) {
    this.searchApproveContractQuery($event);
  }

  onChangeDetailApproveTransferContract($event) {
    this.searchApproveTransferContractQuery($event);
  }

  concatLeasing() {
    let leasing = [];
    if (this.DetailCustomerAll.length > 0) {
      this.DetailCustomerAll.forEach(item => {
        this.data1.push(item.CountCategory)
      })
    }
  }

  onTableEventContracts(event) {
    this.searchCreateContract();
  }

  onTableEventApproveContracts(event) {
    this.searchApproveContractQuery();
  }

  onTableEventApproveTransferContracts(event) {
    this.searchApproveTransferContractQuery();
  }

  searchCreateContract(myWork?) {
    this.dbService.getCreateContractQuery({ CompanyCode: this.auth.company, myWork: myWork == null ? false : myWork }, this.pagecontracts)
      .pipe(finalize(() => { }))
      .subscribe(
        (res) => {
          this.contracts = res.Rows;
          this.pagecontracts.totalElements = res.Total;
        });
  }

  searchApproveWeb(myWork?) {
    this.dbService.getApproveWeb({ CompanyCode: this.auth.company, myWork: myWork }, this.pageweb)
      .pipe(finalize(() => { }))
      .subscribe(
        (res) => {
          this.approveWeb = res.Rows;
          this.pageweb.totalElements = res.Total;
        });
  }

  searchApproveContractQuery(myWork?) {
    this.dbService.getApproveContractQuery({ CompanyCode: this.auth.company, myWork: myWork }, this.pageApproveContracts)
      .pipe(finalize(() => { }))
      .subscribe(
        (res) => {
          this.ApproveContracts = res.Rows;
          this.pageApproveContracts.totalElements = res.Total;
        });
  }

  searchApproveTransferContractQuery(myWork?) {
    this.dbService.getApproveTransferContractQuery({ CompanyCode: this.auth.company, myWork: myWork }, this.pageApproveTransferContracts)
      .pipe(finalize(() => { }))
      .subscribe(
        (res) => {
          this.ApproveTransferContracts = res.Rows;
          this.pageApproveTransferContracts.totalElements = res.Total;
        });
  }

  searchTrackingDocWeb() {
    this.dbService.getTrackingDocWeb({ CompanyCode: this.auth.company }, this.pageTrackingDocWeb)
      .pipe(finalize(() => { }))
      .subscribe(
        (res) => {
          this.trackingDocWeb = res.Rows;
          this.pageTrackingDocWeb.totalElements = res.Total;
        });
  }

  searcheHistoryContract(MainContractHeadId) {
    this.dbService.getHistoryContract({ MainContractHeadId: MainContractHeadId }, this.pageHistoryContract)
      .pipe(finalize(() => { }))
      .subscribe(
        (res) => {
          this.historyContract = res.Rows;
          this.pageHistoryContract.totalElements = res.Total;
        });
  }

  editContract(id) {
    this.router.navigate(['/lo/lots03/detail', { id: id, backToPage: '/dashboard' }], { skipLocationChange: true });
  }

  editApproveContract(ContractNo) {
    this.router.navigate(['/lo/lots05/', { ContractNo: ContractNo, }], { skipLocationChange: true });
  }

  editApproveTransferContract(ContractNo) {
    this.router.navigate(['/lo/lots06/', { ContractNo: ContractNo, }], { skipLocationChange: true });
  }

  editApproveWeb(CustomerCode: string, Flag: boolean) {
    this.router.navigate(['/lo/lots02/detail', { CustomerCode: CustomerCode, Flag: Flag }], { skipLocationChange: true });
  }

  onTableEventWeb(event) {
    this.searchApproveWeb();
  }

  onTableEventTrackingDocWeb(event) {
    this.searchTrackingDocWeb();
  }

  onTableEventHistoryContract(event) {
    this.searcheHistoryContract(this.contractsHistory.MainContractHeadId);
  }

  openModal(content, MainContractHeadId) {
    this.pageHistoryContract = new Page();
    this.popup = this.modal.open(content, Size.large);
    this.searcheHistoryContract(MainContractHeadId);
  }

  openModalSearch(content) {
    this.popup = this.modal.open(content, Size.large);
    this.onSearch();
  }

  openModal2(content) {
    this.ContractForm.setControl('TrackingDocumentAttachment', this.fb.array([]));
    this.popup = this.modal.open(content, Size.large);
  }

  openModalAttachment(content) {
    this.dbService.getSearchTrackingAttachment(this.contractsHistory.TrackingDocumentControlId).pipe(
      finalize(() => {
      }))
      .subscribe((res: ContractForm) => {
        this.popup = this.modal.open(content, Size.large);
        this.contractsHistory = res;
        this.ContractForm.setControl('TrackingDocumentAttachment', this.fb.array(this.contractsHistory.TrackingDocumentAttachment.map((detail) => this.contractAttachmentsForm(detail))))
        this.checkContractAttachment();
        this.rebuildForm();
      });
  }

  closeModal() {
    this.popup.hide();
  }

  edit(TrackingDocumentPackageId) {
    this.router.navigate(['/lo/lots20/detail/package', { TrackingDocumentPackageId: TrackingDocumentPackageId }], { skipLocationChange: true });
  }

  searchEdit(TrackingDocumentId, controlId) {
    this.dbService.getSearchContract(TrackingDocumentId, controlId).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: ContractForm) => {
          this.contractsHistory = res;
          this.rebuildForm();
        });
  }

  prepareSave(values) {
    Object.assign(this.contractsHistory, values);
    // const attachments = this.contractAttachments.getRawValue();

    if (this.contractsHistory.TrackingDocumentAttachment != undefined) {
      const beforeAddPayName = this.contractsHistory.TrackingDocumentAttachment.filter((item) => {
        return item.RowState !== RowState.Add;
      });
      this.contractsHistory.TrackingDocumentAttachment = beforeAddPayName;
    }

    if (this.contractsHistory.TrackingDocumentAttachment) {
      const data = values.TrackingDocumentAttachment.concat(this.attachmentDeleting);

      this.contractsHistory.TrackingDocumentAttachment.map(detail => {
        return Object.assign(detail, data.find((o) => {
          return o.TrackingDocumentAttachmentId === detail.TrackingDocumentAttachmentId;
        }));
      });

      this.add(values);
    } else {
      this.contractsHistory.TrackingDocumentAttachment = [];
      this.add(values);
    }
  }

  add(values) {
    const attachmentAdding = values.TrackingDocumentAttachment.filter((item) => {
      return item.RowState === RowState.Add;
    });
    this.contractsHistory.TrackingDocumentAttachment = this.contractsHistory.TrackingDocumentAttachment.concat(attachmentAdding);
    this.contractsHistory.TrackingDocumentAttachment = this.contractsHistory.TrackingDocumentAttachment.concat(this.attachmentDeleting);
    this.attachmentDeleting = [];
  }

  onSubmit() {
    this.submitted = true;
    if (this.ContractForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.contractAttachments.getRawValue().length <= 0) {
      this.as.warning("", "ต้องมีเอกสารแนบอย่างน้อย 1 รายการ");
      return;
    }

    this.saving = true;
    this.prepareSave(this.ContractForm.getRawValue());
    this.dbService.saveReturnDocument(this.contractsHistory).pipe(
      switchMap(() => this.dbService.getSearchContract(this.contractsHistory.TrackingDocumentId, null)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: ContractForm) => {
          this.contractsHistory = res;
          this.closeModal();
          this.openModal(this.historyControlDoc, this.contractsHistory.MainContractHeadId);
          this.rebuildForm();
        });
  }


  linkContractDetail(TrackingDocumentPackageId) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots20/detail/package', { TrackingDocumentPackageId: TrackingDocumentPackageId, backToPage: '/lo/lots20', Company: this.auth.company }], { skipLocationChange: true }));
    window.open(url, '_blank');
  }

  onTableEventSearch(event) {
    this.onSearch();
  }

  searchContract() {
    this.pageSearch = new Page();
    this.statusPage = true;
    if (this.SearchForm.controls['InputSearch'].value) {
      this.SearchForm.controls['InputSearch'].setValue(this.SearchForm.controls['InputSearch'].value.trim());
    }
    this.onSearch();
  }

  onSearch() {
    this.dbService.getSearchTrackingDoc(Object.assign({
      Keyword: this.SearchForm.controls.Keyword.value,
      CompanyCode: this.SearchForm.controls.CompanyReqTake.value,
    }), this.pageSearch)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.TrackingDoc = res.Rows;
          this.pageSearch.totalElements = res.Total;
        });
  }

  contractAttachmentsForm(item: TrackingDocumentAttachment): FormGroup {
    let fg = this.fb.group({
      TrackingDocumentAttachmentId: null,
      AttachmentId: [null, Validators.required],
      FileName: null,
      Remark: null,
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

  get contractAttachments(): FormArray {
    return this.ContractForm.get('TrackingDocumentAttachment') as FormArray;
  }

  addAttachment() {
    this.contractAttachments.markAsDirty();
    this.contractAttachments.push(this.contractAttachmentsForm({} as TrackingDocumentAttachment));
  }

  removeAttachment(index) {
    const attachment = this.contractAttachments.at(index) as FormGroup;
    if (attachment.controls.RowState.value !== RowState.Add) {
      attachment.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
      this.attachmentDeleting.push(attachment.getRawValue());
    }

    const rows = [...this.contractAttachments.getRawValue()];
    rows.splice(index, 1);

    this.contractAttachments.patchValue(rows, { emitEvent: false });
    this.contractAttachments.removeAt(this.contractAttachments.length - 1);
    this.ContractForm.markAsDirty();

    this.checkContractAttachment();
  }

  checkContractAttachment() {
    this.contractAttachments.enable();
    for (let i = 0; i < this.contractAttachments.length; i++) {
      let form = this.contractAttachments.controls[i] as FormGroup;
      if (form.controls.TrackingDocumentAttachmentId.value) {
        form.controls.AttachmentId.disable({ emitEvent: false });
        form.controls.Remark.disable({ emitEvent: false });
      }
    }
  }

  fileNameReturn(filename, index) {
    let form = this.contractAttachments.controls[index] as FormGroup;
    form.controls.FileName.setValue(filename);
  }

  onTableEventLoanAgreement(event) {
    this.searchLoanAgreement();
  }

  searchLoanAgreement() {
    this.dbService.searchLoanAgreement(this.pageLoanAgreement)
      .pipe(finalize(() => { }))
      .subscribe(
        (res) => {
          this.loanAgreement = res.Rows;
          this.pageLoanAgreement.totalElements = res.Total;
        });
  }

  editLoanAgreement(id, event) {
    if (event.which == 3) {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots25/detail', { id: id, backToPage: '/lo/lots25' }], { skipLocationChange: true }));
      window.open(url, '_blank');
    } else {
      this.router.navigate(['/lo/lots25/detail', { id: id, backToPage: '/lo/lots25' }], { skipLocationChange: true });
    }
  }

  onTableEventLoanRefinance(event) {
    this.searchLoanRefinance();
  }

  searchLoanRefinance() {
    this.dbService.getContractManagement(this.pageLoanRefinance)
      .pipe(finalize(() => { }))
      .subscribe(
        (res) => {
          this.loanRefinance = res.Rows;
          this.pageLoanRefinance.totalElements = res.Total;
        });
  }

  editRefinance(id, OldContractId, event) {
    if (event.which == 3) {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots24/detail', { id: id, OldContractId: OldContractId, backToPage: '/lo/lots24' }], { skipLocationChange: true }));
      window.open(url, '_blank');
    } else {
      this.router.navigate(['/lo/lots24/detail', { id: id, OldContractId: OldContractId, backToPage: '/lo/lots24' }], { skipLocationChange: true });
    }
  }

  onTableEventWait(event) {
    this.searchLoanWait();
  }

  searchLoanWait() {
    this.dbService.getLoanWait(this.pageWait)
      .pipe(finalize(() => { }))
      .subscribe(
        (res) => {
          this.loanWait = res.Rows;
          this.pageWait.totalElements = res.Total;
        });
  }

  editWait(id, signature, event) {
    if (event.which == 3) {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots26/detail', { id: id, isSignature: signature }], { skipLocationChange: true }));
      window.open(url, '_blank');
    } else {
      this.router.navigate(['/lo/lots26/detail', { id: id, isSignature: signature }], { skipLocationChange: true });
    }
  }

}
