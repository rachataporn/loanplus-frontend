import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page, SelectFilterService } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lomt05Service, CompanyAccount } from './lomt05.service';

@Component({
  templateUrl: './lomt05-detail.component.html'
})
export class Lomt05DetailComponent implements OnInit {

  searchForm: FormGroup;
  companyAccountFrom: FormGroup;
  companyAccount: CompanyAccount = {} as CompanyAccount;

  submitted: boolean;
  focusToggle: boolean;

  page = new Page();
  flagClose = '';
  statusSave = '';
  saving: boolean;

  detailList: {
    BankList: any[], AccountTypeList: any[], ReceiveTypeList: any[], CompanyCodeList: any[]
  };
  bankList = [];
  branchList = [];
  accountTypeList = [];
  receiveTypeList = [];
  companyCodeList = [];

  BankCode = [];
  AccountTypeCode = [];
  ReceiveTypeCode = [];
  CompanyCode = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Lomt05Service,
    private modal: ModalService,
    private filter: SelectFilterService,
    private saveData: SaveDataService,
    public lang: LangService
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LOMT05');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.searchForm.controls.flagSearch.setValue(false);
    this.route.data.subscribe((data) => {
      this.companyAccount = data.lomt05.CompanyAccountDetail;
      this.BankCode = data.lomt05.DetailList.BankList;
      this.AccountTypeCode = data.lomt05.DetailList.AccountTypeList;
      this.ReceiveTypeCode = data.lomt05.DetailList.ReceiveTypeList;
      this.CompanyCode = data.lomt05.DetailList.CompanyCodeList;
      this.rebuildForm();
    });
    this.lang.onChange().subscribe(() => {
      this.bindDropDownBank();
      this.bindDropDownAccountType();
      this.bindDropDownReceiveType();
      this.bindDropDownCompanyCode();
    });
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] == "lomt05") {
      this.saveData.save(this.searchForm.value, 'LOMT05');
    } else {
      this.saveData.save(this.searchForm.value, 'LOMT05');
    }
  }

  createForm() {
    this.companyAccountFrom = this.fb.group({
      ReceiveTypeCode: [null, Validators.required],
      BankCode: [null, Validators.required],
      BranchName: null,
      BranchCode: [null, Validators.required],
      AccountCode: null,
      BankAccountTypeCode: [null, Validators.required],
      AccountNo: [null, Validators.required],
      AccountName: [null, Validators.required],
      Active: true,
      CompanyCode: [null, Validators.required],
      RowVersion: null,
    });

    this.companyAccountFrom.controls.BranchCode.valueChanges.subscribe(value => {
      if (value) {
        this.companyAccountFrom.controls.BranchName.setValue(this.getText(value, this.branchList));
      }
    })
  }

  createBackSearchForm() {
    this.searchForm = this.fb.group({
      ReceiveTypeCode: null,
      BankCode: null,
      BranchName: null,
      AccountCode: null,
      BankAccountTypeCode: null,
      AccountNo: null,
      AccountName: null,
      flagSearch: false,
      beforeSearch: null,
    });

  }

  rebuildForm() {
    this.companyAccountFrom.markAsPristine();
    this.bindDropDownBank(true);
    this.bindDropDownAccountType(true);
    this.bindDropDownReceiveType(true);
    this.bindDropDownCompanyCode(true);
    this.companyAccountFrom.enable();
    this.companyAccountFrom.patchValue(this.companyAccount);
    this.changeBankCode(false);
    if(this.companyAccountFrom.controls.RowVersion.value){
      this.companyAccountFrom.controls.CompanyCode.disable({ emitEvent: false })
      this.companyAccountFrom.controls.AccountNo.disable({ emitEvent: false })
    }
  }

  bindDropDownBank(filter?: boolean) {
    if (filter) {
      if (this.companyAccount.CompanyAccountId) {
        this.bankList = this.filter.FilterActiveByValue(this.BankCode, this.companyAccountFrom.controls.BankCode.value);
      }
      else {
        this.bankList = this.filter.FilterActive(this.BankCode);
      }
    }
    this.filter.SortByLang(this.bankList);
    this.bankList = [...this.BankCode];
  }

  bindDropDownAccountType(filter?: boolean) {
    if (filter) {
      if (this.companyAccount.CompanyAccountId) {
        this.accountTypeList = this.filter.FilterActiveByValue(this.AccountTypeCode, this.companyAccountFrom.controls.BankAccountTypeCode.value);
      }
      else {
        this.accountTypeList = this.filter.FilterActive(this.AccountTypeCode);
      }
    }
    this.filter.SortByLang(this.accountTypeList);
    this.accountTypeList = [...this.AccountTypeCode];
  }

  bindDropDownReceiveType(filter?: boolean) {
    if (filter) {
      if (this.companyAccount.CompanyAccountId) {
        this.receiveTypeList = this.filter.FilterActiveByValue(this.ReceiveTypeCode, this.companyAccountFrom.controls.ReceiveTypeCode.value);
      }
      else {
        this.receiveTypeList = this.filter.FilterActive(this.ReceiveTypeCode);
      }
    }
    this.filter.SortByLang(this.receiveTypeList);
    this.receiveTypeList = [...this.ReceiveTypeCode];
  }

  bindDropDownCompanyCode(filter?: boolean) {
    if (filter) {
      if (this.companyAccount.CompanyAccountId) {
        this.companyCodeList = this.filter.FilterActiveByValue(this.CompanyCode, this.companyAccountFrom.controls.CompanyCode.value);
      }
      else {
        this.companyCodeList = this.filter.FilterActive(this.CompanyCode);
      }
    }
    this.filter.SortByLang(this.companyCodeList);
    this.companyCodeList = [...this.CompanyCode];
  }

  changeBankCode(flag?: boolean) {
    if (flag) {
      this.branchList = [];
      this.companyAccountFrom.controls.BranchCode.setValue(null);
      this.js.getBranchList(this.companyAccountFrom.controls.BankCode.value).pipe(
        finalize(() => { }))
        .subscribe(
          (res) => {
            this.branchList = res.BranchList;
          }
        );
    } else {
      this.js.getBranchList(this.companyAccountFrom.controls.BankCode.value).pipe(
        finalize(() => { }))
        .subscribe(
          (res) => {
            this.branchList = res.BranchList;
          }
        );
    }
  }

  getText(value, list: any) {
    var ls = [];
    ls = list;
    if (value && ls.length > 0) {
      const textData = list.find(data => {
        return data.Value == value;
      });
      return this.lang.CURRENT == "Tha" ? textData.TextTha : textData.TextEng;
    }
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.companyAccountFrom.controls['BranchName'].value) {
      this.companyAccountFrom.controls['BranchName'].setValue(this.companyAccountFrom.controls['BranchName'].value.trim());
    }
    if (this.companyAccountFrom.controls['AccountCode'].value) {
      this.companyAccountFrom.controls['AccountCode'].setValue(this.companyAccountFrom.controls['AccountCode'].value.trim());
    }
    if (this.companyAccountFrom.controls['AccountNo'].value) {
      this.companyAccountFrom.controls['AccountNo'].setValue(this.companyAccountFrom.controls['AccountNo'].value.trim());
    }
    if (this.companyAccountFrom.controls['AccountName'].value) {
      this.companyAccountFrom.controls['AccountName'].setValue(this.companyAccountFrom.controls['AccountName'].value.trim());
    }
    if (this.companyAccountFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      this.statusSave = '';
      return;
    }
    this.saving = true;
    this.prepareSave(this.companyAccountFrom.value);
    // this.companyAccount.BranchName = this.getText(this.companyAccountFrom.controls.BranchName.value, this.branchList);
    this.js.checkDupCompanyAccount(this.companyAccount).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: any) => {
        res === 0 ? this.onSave() : this.as.error('', 'ข้อมูลมีค่าซ้ำ');
      });
     
  }

  onSave() {
    this.saving = true;
    this.js.saveCompanyAccount(this.companyAccount).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: CompanyAccount) => {
          this.companyAccount = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        }
      );
      
  }

  prepareSave(values: Object) {
    Object.assign(this.companyAccount, values);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.companyAccountFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/lo/lomt05'], { skipLocationChange: true });
  }

}
