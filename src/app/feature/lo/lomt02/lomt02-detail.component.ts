import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, RowState, Page, SelectFilterService, Size } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lomt02Service, LoanAgreementType, LoanCompany } from './lomt02.service';
import { Lomt02ModalComponent } from './lomt02-modal.component';

@Component({
  templateUrl: './lomt02-detail.component.html'
})
export class Lomt02DetailComponent implements OnInit {

  itemsLOV = [];
  flagClose = '';
  selected = [];
  checkMenuList = [];
  count: number = 5;
  countCh: number;
  statusSave: string;
  data = '';
  page = new Page();
  focusToggle: boolean;
  statusPage: boolean;
  saving: boolean;
  submitted: boolean;
  loanCompany: LoanCompany[] = [];
  loanAgreementType: LoanAgreementType = {} as LoanAgreementType;
  loanAgreementForm: FormGroup;
  master: {
    GuarantorList: any[]
    , ContractList: any[]
    , InterestList: any[]
    , PaymentList: any[]
    , ChartList: any[]
    , BotLoanList: any[]
    , FpoLoanList: any[]
    , LoanTypeList: any[]
  };
  guarantorList = [];
  contractList = [];
  interestList = [];
  paymentList = [];
  chartList = [];
  botLoanList = [];
  fpoLoanList = [];
  companyList = [];
  LoanTypeList = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private filter: SelectFilterService,
    private lomt02Service: Lomt02Service,
    private modal: ModalService,
    public lang: LangService
  ) {
    this.createForm();
  }

  createForm() {
    this.loanAgreementForm = this.fb.group({
      LoanTypeCode: [null, [Validators.required, Validators.pattern(/\S+/)]],
      LoanTypeNameTha: [null, Validators.required],
      LoanTypeNameEng: null,
      Active: true,
      LoanNameSignin: [null, Validators.required],
      InterestRate: [null, Validators.required],
      FeeRate1: [null, Validators.required],
      FeeRate2: [null, Validators.required],
      InterestAllMax: [null, Validators.required],
      InterestAllMax2: [null, Validators.required],
      GuaranteeRate: [null, Validators.required],
      GuarantorYn: [null, Validators.required],
      GuaranteeAssetYn: [null, Validators.required],
      InterestType: [null, Validators.required],
      FineType: [null, Validators.required],
      FineMonth: [null, Validators.required],
      FineRate: [null, Validators.required],
      InterestDiscountRate: [null, Validators.required],
      AccDebtor: [null, Validators.required],
      AccInterest: [null, Validators.required],
      AccFine: [null, Validators.required],
      AccCash: [null, Validators.required],
      AccFee1: [null, Validators.required],
      AccFee2: null,
      AccFee3: null,
      AccClose: null,
      AccAccrueInterest: null,
      AccCashTemporary: null,
      BotLoanType: null,
      FpoLoanType: null,
      CategoryId: [null, Validators.required],
      MortgageFee: 0,
      SecuritiesPercent: 0,
      MaxLoanAmount: 0,
      Company: this.fb.array([])
    });

    this.loanAgreementForm.controls.MaxLoanAmount.valueChanges.subscribe(
      (val) => {
        if (val && val > 0) {
          this.loanAgreementForm.controls.SecuritiesPercent.setValue(0, { emitEvent: false });
        }
      }
    );

    this.loanAgreementForm.controls.SecuritiesPercent.valueChanges.subscribe(
      (val) => {
        if (val && val > 0) {
          this.loanAgreementForm.controls.MaxLoanAmount.setValue(0, { emitEvent: false });
        }
      }
    );
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.loanAgreementType = data.attribute.LoanTypeDetail;
      this.master = data.attribute.master;
      this.rebuildForm();
    });
  }

  prepareSave(values: Object) {
    Object.assign(this.loanAgreementType, values);
    delete this.loanAgreementType['Comapny'];
    this.add(values);
  }

  bindDropDownList() {
    this.filter.SortByLang(this.master.GuarantorList);
    this.filter.SortByLang(this.master.ContractList);
    this.filter.SortByLang(this.master.InterestList);
    this.filter.SortByLang(this.master.PaymentList);
    this.filter.SortByLang(this.master.ChartList);
    this.filter.SortByLang(this.master.BotLoanList);
    this.filter.SortByLang(this.master.FpoLoanList);
    this.filter.SortByLang(this.master.LoanTypeList);
    this.master.LoanTypeList = this.filter.FilterActive(this.master.LoanTypeList);
    this.guarantorList = [...this.master.GuarantorList];
    this.contractList = [...this.master.ContractList];
    this.interestList = [...this.master.InterestList];
    this.paymentList = [...this.master.PaymentList];
    this.chartList = [...this.master.ChartList];
    this.botLoanList = [...this.master.BotLoanList];
    this.fpoLoanList = [...this.master.FpoLoanList];
    this.LoanTypeList = [...this.master.LoanTypeList];
    return;
  }

  checkLoanTypeCode() {
    if (this.loanAgreementForm.controls.LoanTypeCode.value) {
      this.loanAgreementForm.controls.LoanTypeCode.setValue(this.loanAgreementForm.controls.LoanTypeCode.value.trim(), { eventEmit: false });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.loanAgreementForm.invalid) {
      this.focusToggle = !this.focusToggle;
      this.saving = false;
      return this.as.warning('', 'Message.LO00003');
    }
    if (this.loanAgreementForm.value.Company.length === 0) {
      return this.as.warning('', 'Message.STD00012', ['Label.LOMT02.CompanyCode']);
    }

    if (this.getCompany.getRawValue) {
      for (const item of this.getCompany.getRawValue()) {
        if (this.checkDuplicateChild(item) == true) {
          return this.as.error('', 'Label.LOMT02.MessageDupBranch');
        }
      }
    }
    if (!this.loanAgreementType.LoanTypeCode) {
      this.lomt02Service.checkDuplicate(this.loanAgreementForm.controls.LoanTypeCode.value)
        .pipe(finalize(() => {
        }))
        .subscribe(
          (res: any) => {
            if (res) {
              this.as.error('', 'Message.STD00004', ['Label.LOMT02.LoanTypeCode']);
              return;
            } else {
              this.statusSave = 'insert';
              this.onSave();
            }
          }, (error) => {
            console.log(error);
          });
    }
    else {
      this.statusSave = 'update';
      this.onSave();
    }

  }
  onSave() {
    this.saving = true;
    this.prepareSave(this.loanAgreementForm.getRawValue());
    this.lomt02Service.saveLoan(this.loanAgreementType, this.statusSave).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
        this.checkMenuList = [];
      }))
      .subscribe(
        (res: LoanAgreementType) => {
          this.loanAgreementType = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        }
      );
  }

  rebuildForm() {
    this.loanAgreementForm.markAsPristine();
    this.bindDropDownList();
    this.loanAgreementForm.patchValue(this.loanAgreementType);
    if (this.loanAgreementType.LoanTypeCode) {
      this.loanAgreementForm.controls.LoanTypeCode.disable();
      this.loanAgreementForm.setControl('Company', this.fb.array(
        this.loanAgreementType.Company.map((detail) => this.createCompanyForm(detail))
      ));
    } else {
      this.loanAgreementForm.controls.LoanTypeCode.enable();
    }

  }

  createCompanyForm(item: LoanCompany): FormGroup {
    let fg = this.fb.group({
      LoanTypeDivId: null,
      LoanTypeCode: null,
      CompanyNameTha: null,
      CompanyNameEng: null,
      CompanyCode: null,
      Active: null,
      RowVersion: 0,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });
    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState !== RowState.Add) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    );
    return fg;
  }
  get getCompany(): FormArray {
    return this.loanAgreementForm.get('Company') as FormArray;
  }

  addCompany() {
    this.modal.openComponent(Lomt02ModalComponent, Size.large).subscribe(
      (result) => {
        if (result.length > 0) {
          for (const item of result) {
            if (!this.checkDuplicate(item)) {
              this.getCompany.push(
                this.createCompanyForm(
                  item as LoanCompany
                )
              );
            }
          }
        }
      });
  }

  checkDuplicate(result) {
    for (const form of this.getCompany.value) {
      if (form.CompanyCode === result.CompanyCode) {
        this.as.warning('', 'Label.LOMT02.Message.Company');
        return true;
      }
    }
  }

  removeRow(index) {
    let detail = this.getCompany.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      detail.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
      this.loanCompany.push(detail.value);
    }

    let rows = [...this.getCompany.value];
    rows.splice(index, 1);

    this.getCompany.patchValue(rows, { emitEvent: false });
    this.getCompany.removeAt(this.getCompany.length - 1);
    this.getCompany.markAsDirty();
  }

  add(values) {
    const adding = values.Company.filter(function (item) {
      return item.RowState === RowState.Add;
    });
    this.loanAgreementType.Company = this.loanCompany.concat(adding);
    this.loanCompany = [];
  }

  delete() {
    this.loanAgreementType.Company = this.loanAgreementType.Company.concat(this.loanCompany);
    this.loanCompany = [];
  }

  checkDuplicateChild(result) {
    this.countCh = 0;
    if (this.loanAgreementType.Company) {
      for (const form of this.loanAgreementType.Company) {
        if (form.CompanyCode === result.CompanyCode && RowState.Add === result.RowState) {
          return true;
          // && result.ObjectState != ObjectState.Deleted
        }
      }
    }
    for (const form of this.getCompany.getRawValue()) {
      if (form.CompanyCode === result.CompanyCode && RowState.Add === result.RowState) {
        this.countCh += 1;
        if (this.countCh > 1) {
          this.countCh = 0;
          return true;
        }
        // && result.ObjectState != ObjectState.Deleted
      }
    }
  }
  // canDeactivate(): Observable<boolean> | boolean {
  //   if (!this.loanAgreementForm.dirty) {
  //     return true;
  //   }
  //   return this.modal.confirm('Message.STD00002');
  // }

  back() {
    this.router.navigate(['/lo/lomt02'], { skipLocationChange: true });
  }
}
