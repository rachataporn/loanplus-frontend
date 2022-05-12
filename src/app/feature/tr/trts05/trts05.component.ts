import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Trts05Service, Report } from '@app/feature/tr/trts05/trts05.service';
import { Page, ModalService, ModalRef, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService, AuthService } from '@app/core';
// import { Trts02LookupDetailComponent } from './trts05-lookup-detail.component';

@Component({
  templateUrl: './trts05.component.html'
})

export class Trts05Component implements OnInit {
  searchForm: FormGroup;
  popup: ModalRef;
  mytime: Date = new Date();
  assetTypeList: any[];
  assetTypeDate = [];
  docStatusList = [];
  approvalStatusList = [];
  loanChannelList = [];
  // Trts02LookupDetailComponent = Trts02LookupDetailComponent;
  countNewLoant: Number = 5;
  pageNewLoant = new Page();
  loadingNewLoan: boolean = false;
  countLoanContacted: Number = 5;
  pageLoanContacted = new Page();
  loadingLoanContacted: boolean = false;
  customerList = [];
  companies: any[];
  report: Report = {} as Report;
  count = 0;
  page = new Page();
  now = new Date();
  resetStatus: boolean;
  beforeSearch = '';
  statusPage = true;
  srcResult = null;
  branchList = [];
  BranchList = [];

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private trts05Service: Trts05Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private selectFilter: SelectFilterService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      CompanyCode: null,
      InputSearch: null,
      beforeSearch: null,
      flagSearch: null
    });
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    this.onSearch();
  }

  filterListDropdown() {
    this.selectFilter.SortByLang(this.docStatusList);
    this.docStatusList = [...this.docStatusList];
    this.selectFilter.SortByLang(this.approvalStatusList);
    this.approvalStatusList = [...this.approvalStatusList];
    this.selectFilter.SortByLang(this.companies);
    this.companies = [...this.companies];
    this.selectFilter.SortByLang(this.BranchList);
    this.branchList = [...this.BranchList];
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  onSearch() {
    if (this.searchForm.controls.InputSearch.value) {
      this.searchForm.controls.InputSearch.setValue(this.searchForm.controls.InputSearch.value.trim());
    }
    this.trts05Service.getSearchMaster(this.statusPage ? this.searchForm.value : this.beforeSearch, this.page)
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

  ngOnInit() {
    const saveData = this.saveData.retrive('TRTS05');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.docStatusList = data.trts05.master.Status;
      this.approvalStatusList = data.trts05.master.TrItemList;
      this.BranchList = data.trts05.master.Branch;
      this.companies = data.trts05.company;
      this.filterListDropdown();
    });

    if (!this.searchForm.controls.flagSearch.value) {
      this.beforeSearch = this.searchForm.controls.beforeSearch.value;
      this.statusPage = this.searchForm.controls.flagSearch.value;
    } else {
      this.statusPage = true
    }

    this.search();

    this.lang.onChange().subscribe(() => {
      this.filterListDropdown();
    });
  }

  get currentCompany() {
    return (this.companies.find(com => com.CompanyCode == this.auth.company) || {});
  }

  onChangeCompany(code) {
    this.auth.company = code;
    this.searchForm.controls.CompanyCode.setValue(this.auth.company);
    this.onSearch();
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'TRTS05');
  }

  Add() {
    this.router.navigate(['/tr/trts05/detail'], { skipLocationChange: true });
  }

  edit(TrackingId: number, TrackingNo: string) {
    this.router.navigate(['/tr/trts05/detail', { TrackingId: TrackingId, TrackingNo: TrackingNo }], { skipLocationChange: true });
  }

  loanDetailOutput(loanDetail) {
    if (loanDetail != undefined) {
      this.searchForm.controls.ContractNo.setValue(loanDetail.ContractNo)
    }
  }

  onPrint(TrackingNo, TrackingItemId: number) {
    this.report.TrackingNo = TrackingNo;
    this.report.TrackingType = TrackingItemId;

    this.trts05Service.print(this.report)
      .pipe(
        finalize(() => { })
      ).subscribe((res) => {
        if (res) { this.OpenWindow(res, TrackingNo);}
      });
  }




  async OpenWindow(data, TrackingNo) {
    let doc = document.createElement("a");
    doc.href = "data:application/pdf;base64," + data;
    doc.download = "TRTS05_" +  TrackingNo + ".pdf"
    doc.click();
  }

}
