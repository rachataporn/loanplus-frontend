import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lomt05Service, CompanyAccount } from '@app/feature/lo/lomt05/lomt05.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lomt05.component.html'
})

export class Lomt05Component implements OnInit {
  companyAccount: CompanyAccount = {} as CompanyAccount;
  companyAccountList = [];

  detailList: {
    BankList: any[], AccountTypeList: any[], ReceiveTypeList: any[], CompanyCodeList: any[]
  };
  bankList = [];
  accountTypeList = [];
  receiveTypeList = [];
  companyCodeList = [];

  BankCode = [];
  AccountTypeCode = [];
  ReceiveTypeCode = [];
  CompanyCode = [];
  branchList = [];

  // menuForm: FormGroup;
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;
  beforeSearch: '';

  constructor(
    private router: Router,
    private modal: ModalService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private lomt05Service: Lomt05Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private filter: SelectFilterService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      CompanyCode: null,
      ReceiveTypeCode: null,
      BankCode: null,
      BranchName: null,
      BranchCode: null,
      AccountCode: null,
      BankAccountTypeCode: null,
      AccountNo: null,
      AccountName: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page()
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LOMT05');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.page = this.searchForm.controls.page.value;
    if (!this.searchForm.controls.flagSearch.value) {
      this.beforeSearch = this.searchForm.controls.beforeSearch.value;
      this.statusPage = this.searchForm.controls.flagSearch.value;
    } else {
      this.statusPage = true;
    }
    this.lang.onChange().subscribe(() => {
      this.bindDropDownBank();
      this.bindDropDownAccountType();
      this.bindDropDownReceiveType();
      this.bindDropDownCompanyCode();
    });
    this.route.data.subscribe((data) => {
      this.BankCode = data.lomt05.DetailList.BankList;
      this.AccountTypeCode = data.lomt05.DetailList.AccountTypeList;
      this.ReceiveTypeCode = data.lomt05.DetailList.ReceiveTypeList;
      this.CompanyCode = data.lomt05.DetailList.CompanyCodeList;
    });
    this.rebuildForm();
  }

  rebuildForm() {
    this.bindDropDownBank(true);
    this.bindDropDownAccountType(true);
    this.bindDropDownReceiveType(true);
    this.bindDropDownCompanyCode(true);
    this.onSearch();
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lomt05') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOMT05');
    } else {
      this.saveData.delete('LOMT05');
    }
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    if (this.searchForm.controls['BranchName'].value) {
      this.searchForm.controls['BranchName'].setValue(this.searchForm.controls['BranchName'].value.trim());
    }
    if (this.searchForm.controls['AccountCode'].value) {
      this.searchForm.controls['AccountCode'].setValue(this.searchForm.controls['AccountCode'].value.trim());
    }
    if (this.searchForm.controls['AccountNo'].value) {
      this.searchForm.controls['AccountNo'].setValue(this.searchForm.controls['AccountNo'].value.trim());
    }
    if (this.searchForm.controls['AccountName'].value) {
      this.searchForm.controls['AccountName'].setValue(this.searchForm.controls['AccountName'].value.trim());
    }
    this.onSearch();
  }

  onSearch() {
    this.lomt05Service.getData(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page).pipe(finalize(() => {
      if (this.statusPage) {
        this.beforeSearch = this.searchForm.value;
        this.searchForm.controls.beforeSearch.reset();
        this.searchForm.controls.page.setValue(this.page);
        this.searchForm.controls.beforeSearch.setValue(this.searchForm.value);
      }
    }))
      .subscribe(
        (res: any) => {
          this.companyAccountList = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  bindDropDownBank(filter?: boolean) {
    if (filter) {
      this.bankList = this.filter.FilterActive(this.BankCode);
    }
    this.filter.SortByLang(this.BankCode);
    this.bankList = [...this.BankCode];
  }

  bindDropDownAccountType(filter?: boolean) {
    if (filter) {
      this.accountTypeList = this.filter.FilterActive(this.AccountTypeCode);
    }
    this.filter.SortByLang(this.AccountTypeCode);
    this.accountTypeList = [...this.AccountTypeCode];
  }

  bindDropDownReceiveType(filter?: boolean) {
    if (filter) {
      this.receiveTypeList = this.filter.FilterActive(this.ReceiveTypeCode);
    }
    this.filter.SortByLang(this.ReceiveTypeCode);
    this.receiveTypeList = [...this.ReceiveTypeCode];
  }

  bindDropDownCompanyCode(filter?: boolean) {
    if (filter) {
      this.companyCodeList = this.filter.FilterActive(this.CompanyCode);
    }
    this.filter.SortByLang(this.CompanyCode);
    this.companyCodeList = [...this.CompanyCode];
  }

  add() {
    this.router.navigate(['/lo/lomt05/detail'], { skipLocationChange: true });
  }
  edit(CompanyAccountId) {
    this.router.navigate(['/lo/lomt05/detail', { CompanyAccountId: CompanyAccountId }], { skipLocationChange: true });
  }

  onRemove(CompanyAccountId, RowVersion, AccountNo) {
    this.modal.confirm('Message.STD000030').subscribe(
      (res) => {
        if (res) {
          this.lomt05Service.usageCheck(CompanyAccountId).subscribe(
            (response) => {
              response === 0 ? this.remove(CompanyAccountId, RowVersion,AccountNo) : this.as.error('', 'ข้อมูลถูกใช้งาน');
            });
        }
      });
  }

  changeBankCode() {
    this.branchList = [];
    this.searchForm.controls.BranchCode.setValue(null);
    this.lomt05Service.getBranchList(this.searchForm.controls.BankCode.value).pipe(
      finalize(() => { }))
      .subscribe(
        (res) => {
          this.branchList = res.BranchList;
        }
      );
  }

  remove(CompanyAccountId, RowVersion, AccountNo) {
    this.lomt05Service.deleteCompanyAccount(CompanyAccountId, RowVersion, AccountNo).subscribe(
      (response) => {
        this.as.success(' ', 'Message.STD00014');
        this.search();
      }, (error) => {
        console.log(error);
        this.as.error(' ', 'Message.STD000032');
      });
  }

}
