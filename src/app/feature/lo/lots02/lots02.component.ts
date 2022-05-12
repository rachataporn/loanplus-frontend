import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots02Service } from '@app/feature/lo/lots02/lots02.service';
import { Page, ModalService, ModalRef, Size, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lots02.component.html'
})

export class Lots02Component implements OnInit {
  searchForm: FormGroup;
  popup: ModalRef;
  mytime: Date = new Date();
  assetTypeList: any[];
  assetTypeDate = [];
  docStatusList = [];
  approvalStatusList = [];
  loanChannelList = [];

  countNewLoant: Number = 5;
  pageNewLoant = new Page();
  loadingNewLoan: boolean = false;
  countLoanContacted: Number = 5;
  pageLoanContacted = new Page();
  loadingLoanContacted: boolean = false;
  customerList = [];

  page = new Page();

  resetStatus: boolean;
  beforeSearch = '';
  statusPage: boolean;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lots02Service: Lots02Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService
  ) {
    this.createForm();
  }

  createForm() {
    const now = new Date();

    this.searchForm = this.fb.group({
      InputSearch: null,
      StartDate: null,
      EndDate: null,
      assetType: null,
      status: '1',
      requestWait: '',
      flagApprove: '',
      flagSearch: true,
      beforeSearch: null,
      page: new Page(),
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.assetTypeList = data.requestLoan.master.AssetList;
      this.docStatusList = data.requestLoan.master.DocStatusList;
      this.approvalStatusList = data.requestLoan.master.ApprovalStatusList;
      this.loanChannelList = data.requestLoan.master.LoanChannelList;
      this.filterListDropdown();
    });
    const saveData = this.saveData.retrive('LOTS02');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.page = this.searchForm.controls.page.value;
    if (!this.searchForm.controls.flagSearch.value) {
      this.beforeSearch = this.searchForm.controls.beforeSearch.value;
      this.statusPage = this.searchForm.controls.flagSearch.value;
    } else {
      this.statusPage = true;
    }
    this.onSearch();
  }

  filterListDropdown() {
    this.assetTypeDate = this.assetTypeList.filter(item => item.Active === false);
    this.assetTypeDate = this.selectFilter.FilterActive(this.assetTypeDate);
    this.selectFilter.SortByLang(this.assetTypeDate);
    this.assetTypeDate = [...this.assetTypeDate];
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    if (this.searchForm.controls['InputSearch'].value) {
      this.searchForm.controls['InputSearch'].setValue(this.searchForm.controls['InputSearch'].value.trim());
    }
    this.onSearch();
  }
  onSearch() {

    this.lots02Service.getSearchMaster(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
      .pipe(finalize(() => {
        if (this.statusPage) {
          this.beforeSearch = this.searchForm.value;
          this.searchForm.controls.beforeSearch.reset();
          this.searchForm.controls.page.setValue(this.page);
          this.searchForm.controls.beforeSearch.setValue(this.searchForm.value);
        }
      }))
      .subscribe(
        (res: any) => {
          this.customerList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  edit(CustomerCode: string, Flag: boolean) {
    this.router.navigate(['/lo/lots02/detail', { CustomerCode: CustomerCode, Flag: Flag }], { skipLocationChange: true });
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lots02') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOTS02');
    } else {
      this.saveData.delete('LOTS02');
    }
  }

}
