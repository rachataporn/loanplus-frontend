import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots28Service, LoanAgreement, Contract } from '@app/feature/lo/lots28/lots28.service';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  templateUrl: './lots28.component.html'
})

export class Lots28Component implements OnInit {

  searchForm: FormGroup;
  cate: any[];
  submitted: boolean;
  saving: boolean;
  isSuperUser: boolean;
  typeOfContract = [{ Value: '1', Text: 'Pico Finance' }, { Value: '2', Text: 'กฏหมายแพ่งและพาณิชย์' }, { Value: '3', Text: 'ประนอมหนี้' }];
  typeOfLoan = [{ Value: '1', Text: 'กู้ใหม่' }, { Value: '2', Text: 'Refinance' }, { Value: '3', Text: 'Refinance(NPL)' }];
  typeOfPay = [{ Value: '1', Text: 'ส่งเป็นงวด' }, { Value: '2', Text: 'ส่งแต่ดอกเบี้ย' }];
  grade = [];
  LoanContractType = null;
  typeAmount1: number;
  typeAmount2: number;
  typeAmount3: number;
  typeAmount4: number;
  typeAmount5: number;
  loanTypeData = [];
  focusToggle: boolean;
  MaxPeriod: any;
  MinPeriod: any;
  subject: Subject<any> = new Subject();
  subjectSecuritiesAmount: Subject<any> = new Subject();

  constructor(
    private fb: FormBuilder,
    private lots28: Lots28Service,
    public lang: LangService,
    private as: AlertService,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      TypeOfLoan: ['1', Validators.required],
      Grade: [null, Validators.required],
      Period: [{ value: null, disabled: true }, Validators.required],
      SecuritiesAmount: [null, Validators.required],
      Interest: [{ value: null, disabled: true }, Validators.required],
      LoanTotalAmount: [{ value: null, disabled: true }, Validators.required],
      TypeOfPay: ['1', Validators.required],
      CategoryId: [null, Validators.required],
      LoanTypeCode: [{ value: null, disabled: true }, Validators.required],
      MinToPay: { value: null, disabled: true },
    });

    this.searchForm.controls.TypeOfLoan.valueChanges.subscribe(
      (val) => {
        this.LoanContractType = null;
        this.searchForm.controls.LoanTypeCode.setValue(null);
        this.searchForm.controls.Period.setValue(null);
        this.searchForm.controls.Interest.setValue(null);
        this.searchForm.controls.MinToPay.setValue(null);
        this.searchForm.controls.LoanTotalAmount.setValue(null);
        this.searchForm.controls.SecuritiesAmount.setValue(null);
        this.searchForm.controls.CategoryId.setValue(null);
        this.searchForm.controls.LoanTotalAmount.disable({ emitEvent: false });
        this.searchForm.controls.Period.disable({ emitEvent: false });
        this.typeAmount1 = 0;
        this.typeAmount2 = 0;
        this.typeAmount3 = 0;
        this.typeAmount4 = 0;
        this.typeAmount5 = 0;
      }
    )

    this.searchForm.controls.TypeOfPay.valueChanges.subscribe(
      (val) => {
        this.LoanContractType = null;
        this.searchForm.controls.LoanTypeCode.setValue(null);
        this.searchForm.controls.Period.setValue(null);
        this.searchForm.controls.Interest.setValue(null);
        this.searchForm.controls.MinToPay.setValue(null);
        this.searchForm.controls.LoanTotalAmount.setValue(null);
        this.searchForm.controls.SecuritiesAmount.setValue(null);
        this.searchForm.controls.CategoryId.setValue(null);
        this.searchForm.controls.LoanTotalAmount.disable({ emitEvent: false });
        this.searchForm.controls.Period.disable({ emitEvent: false });
        this.typeAmount1 = 0;
        this.typeAmount2 = 0;
        this.typeAmount3 = 0;
        this.typeAmount4 = 0;
        this.typeAmount5 = 0;
      }
    )

    this.searchForm.controls.Grade.valueChanges.subscribe(
      (val) => {
        this.LoanContractType = null;
        this.searchForm.controls.LoanTypeCode.setValue(null);
        this.searchForm.controls.Period.setValue(null);
        this.searchForm.controls.Interest.setValue(null);
        this.searchForm.controls.MinToPay.setValue(null);
        this.searchForm.controls.LoanTotalAmount.setValue(null);
        this.searchForm.controls.SecuritiesAmount.setValue(null);
        this.searchForm.controls.CategoryId.setValue(null);
        this.searchForm.controls.LoanTotalAmount.disable({ emitEvent: false });
        this.searchForm.controls.Period.disable({ emitEvent: false });
        this.typeAmount1 = 0;
        this.typeAmount2 = 0;
        this.typeAmount3 = 0;
        this.typeAmount4 = 0;
        this.typeAmount5 = 0;
      }
    )

    this.searchForm.controls.CategoryId.valueChanges.subscribe(
      (val) => {
        this.LoanContractType = null;
        this.searchForm.controls.LoanTypeCode.setValue(null);
        this.searchForm.controls.Period.setValue(null);
        this.searchForm.controls.Interest.setValue(null);
        this.searchForm.controls.MinToPay.setValue(null);
        this.searchForm.controls.LoanTotalAmount.setValue(null);
        this.searchForm.controls.SecuritiesAmount.setValue(null);
        this.searchForm.controls.LoanTotalAmount.disable({ emitEvent: false });
        this.searchForm.controls.Period.disable({ emitEvent: false });
        this.typeAmount1 = 0;
        this.typeAmount2 = 0;
        this.typeAmount3 = 0;
        this.typeAmount4 = 0;
        this.typeAmount5 = 0;
      }
    )

    this.searchForm.controls.Period.valueChanges.subscribe(
      (val) => {
        this.getRegTotalMonth();
      }
    )

  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
    });

    this.route.data.subscribe((data) => {
      this.grade = data.lots28.master.Grade;
      this.cate = data.lots28.master.SecuritiesCategorys;
    });

    this.subject
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.changeLoanTotalAmount();
      }
      );

    this.subjectSecuritiesAmount
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.changeSecuritiesAmount();
      }
      );
  }

  ngOnDestroy() {
  }

  getData() {
    this.submitted = true;
    if (this.searchForm.controls.TypeOfLoan.invalid ||
      this.searchForm.controls.Grade.invalid ||
      this.searchForm.controls.SecuritiesAmount.invalid ||
      this.searchForm.controls.CategoryId.invalid ||
      this.searchForm.controls.TypeOfPay.invalid) {
      this.searchForm.controls.Period.disable();
      this.searchForm.controls.LoanTotalAmount.disable();
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.LoanContractType = null;
    this.searchForm.controls.LoanTypeCode.setValue(null);
    this.searchForm.controls.Period.setValue(null);
    this.searchForm.controls.Interest.setValue(null);
    this.searchForm.controls.MinToPay.setValue(null);
    this.searchForm.controls.LoanTotalAmount.setValue(null);
    this.searchForm.controls.Period.disable();
    this.searchForm.controls.LoanTotalAmount.disable();
    this.getMaxLoanAmount()
  }

  rebuildForm() {
  }

  onChangeLoanContractType(typeAmount) {
    this.submitted = true;
    if (this.searchForm.controls.TypeOfLoan.invalid ||
      this.searchForm.controls.Grade.invalid ||
      this.searchForm.controls.SecuritiesAmount.invalid ||
      this.searchForm.controls.CategoryId.invalid ||
      this.searchForm.controls.TypeOfPay.invalid) {
      this.focusToggle = !this.focusToggle;
      this.searchForm.controls.Period.disable();
      this.searchForm.controls.LoanTotalAmount.disable();
      return;
    }
    this.searchForm.controls.LoanTypeCode.setValue(null);
    this.searchForm.controls.Period.setValue(null);
    this.searchForm.controls.Interest.setValue(null);
    this.searchForm.controls.MinToPay.setValue(null);
    this.searchForm.controls.LoanTotalAmount.setValue(null);
    this.searchForm.controls.Period.enable();
    this.searchForm.controls.LoanTotalAmount.enable();

    this.loanTypeData = [];

    if (typeAmount && typeAmount > 0) {
      this.getLoanType();
    }
  }

  getMaxLoanAmount() {
    this.lots28.getMaxLoanAmount(this.searchForm.controls.CategoryId.value, this.searchForm.controls.TypeOfLoan.value, this.LoanContractType, this.searchForm.controls.SecuritiesAmount.value, this.searchForm.controls.TypeOfPay.value, this.searchForm.controls.Grade.value).subscribe(
      (res) => {
        this.typeAmount1 = res.Type1;
        this.typeAmount2 = res.Type2;
        this.typeAmount3 = res.Type3;
        this.typeAmount4 = res.Type4;
        this.typeAmount5 = res.Type5;

      })
  }

  getLoanType() {
    this.lots28.getLoanType(this.searchForm.controls.CategoryId.value, this.searchForm.controls.TypeOfLoan.value, this.LoanContractType, this.searchForm.controls.SecuritiesAmount.value, this.searchForm.controls.TypeOfPay.value, this.searchForm.controls.Grade.value).subscribe(
      (res) => {
        this.loanTypeData = res.loanTypes;
      })
  }

  getRegTotalMonth() {
    if (!this.searchForm.controls.Period.value) {
      this.searchForm.controls.Period.setErrors({ 'required': true })
      return;
    } else if (this.searchForm.controls.Period.value < this.MinPeriod) {
      this.searchForm.controls.Period.setErrors({ 'minPeriod': true })
      return;
    } else if (this.searchForm.controls.Period.value > this.MaxPeriod) {
      this.searchForm.controls.Period.setErrors({ 'maxPeriod': true })
      return;
    } else {
      this.searchForm.controls.Period.setErrors(null);
      return (this.searchForm.controls.Period.value * this.searchForm.controls.Period.value)
    }
  }

  getMinToPay() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.saving = true;
    this.lots28.getMinToPay(this.searchForm.controls.Period.value, this.searchForm.controls.Interest.value, this.searchForm.controls.LoanTotalAmount.value, this.searchForm.controls.TypeOfPay.value).pipe(
      finalize(() => {
        this.submitted = false;
        this.saving = false;
      }))
      .subscribe(
        (res) => {
          this.searchForm.controls.MinToPay.setValue(res);
          this.saving = false;
        })
  }

  changeLoanTotalAmountKeyUp() {
    this.subject.next();
  }

  changeLoanTotalAmount() {
    if (this.searchForm.controls.LoanTotalAmount.value) {
      if (this.loanTypeData) {
        var loanTypeData = this.loanTypeData.find(data => this.searchForm.controls.LoanTotalAmount.value >= data.LoanMinimumAmount && this.searchForm.controls.LoanTotalAmount.value <= data.LoanLimitAmount)

        if (!loanTypeData) {
          this.searchForm.controls.LoanTotalAmount.setErrors({ 'unmatchAmountInLoanType': true });
          return this.as.warning('', 'วงเงินขอสินเชื่อไม่ตรงกับประเภทสัญญา');
        }

        this.searchForm.controls.LoanTypeCode.setValue(loanTypeData.Value, { emitEvent: false })
        this.searchForm.controls.Interest.setValue(loanTypeData.InterestRate, { emitEvent: false })

        if (loanTypeData.MaxPeriod) {
          this.MaxPeriod = loanTypeData.MaxPeriod;
        }
        if (loanTypeData.MinPeriod) {
          this.MinPeriod = loanTypeData.MinPeriod;
        }

        this.searchForm.controls.LoanTotalAmount.setErrors(null);
      }
    } else {
      this.searchForm.controls.LoanTypeCode.setValue(null, { emitEvent: false })
      this.searchForm.controls.LoanTotalAmount.setErrors({ 'required': true });
    }
  }

  changeSecuritiesAmountKeyUp() {
    this.subjectSecuritiesAmount.next();
  }

  changeSecuritiesAmount() {
    this.LoanContractType = null;
    this.searchForm.controls.LoanTypeCode.setValue(null);
    this.searchForm.controls.Period.setValue(null);
    this.searchForm.controls.Interest.setValue(null);
    this.searchForm.controls.MinToPay.setValue(null);
    this.searchForm.controls.LoanTotalAmount.setValue(null);
    this.searchForm.controls.LoanTotalAmount.disable({ emitEvent: false });
    this.searchForm.controls.Period.disable({ emitEvent: false });
    this.typeAmount1 = 0;
    this.typeAmount2 = 0;
    this.typeAmount3 = 0;
    this.typeAmount4 = 0;
    this.typeAmount5 = 0;
    this.getData();
  }
}
