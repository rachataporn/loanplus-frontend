import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { LoadingService } from '@app/core/loading.service';
import { ContractBorrower, ContractHead, ContractInformation, ContractItem, ContractMgm, ContractMgmEmployee, ContractPeriod, ContractSecurities, Lots04Service } from '@app/feature/lo/lots04/lots04.service';
import { ModalRef, ModalService, Page, RowState, SelectFilterService, Size } from '@app/shared';
import * as numeral from 'numeral';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/internal/operators/finalize';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BorrowerLookupComponent } from './borrower-lookup.component';
import { CustomerLookupComponent } from './customer-lookup.component';
import { MainContractLookupComponent } from './main-contract-lookup.component';

@Component({
  templateUrl: './lots04.component.html',
  styleUrls: ['./lots04.component.scss'],
})

export class Lots04Component implements OnInit {
  @ViewChild('addMgmModal') tplAddMgmModal: TemplateRef<any>;
  @ViewChild('addEmployeeModal') tplAddEmployeeModal: TemplateRef<any>;
  status = 1;
  contractMgmEmployee = {} as ContractMgmEmployee;
  mainContract = {} as ContractHead;
  contractHead = {} as ContractHead;
  contractForm: FormGroup;
  searchEmpForm: FormGroup;
  searchMgmForm: FormGroup;
  submitted: boolean;
  focusToggle: boolean;
  MaxLoanAmount: number = 0;
  maxLoanAmount: number = 0;
  maxLoanLimitAmount: number = 0;
  maximumLoaner: number = 0;
  maximumGuarantor: number = 0;
  payTypeMonth: string;
  maxLoanMsg: boolean = false;
  mainLoanMsg: boolean = false;
  mainCusLoanMsg: boolean = false;
  mainLoanUnmatchLoanTypeMsg: boolean = false;
  company = [];
  companyList = [];
  loanType = [];
  loanTypeData = [];
  pays = [];
  informations = [];
  incomeLoan = [];
  paymentLoan = [];
  customerSecurities = [];
  customerSecuritiesData = [];
  cateSecurities: string;
  totalLoanAmount: number;
  deletingBorrowers = [];
  deletingSecurities = [];
  deletingIncomeItems = [];
  deletingPaymentItems = [];
  deletingGuarantor = [];
  paymentCompanyAccount = [];
  receiveCompanyAccount = [];
  paymentCompanyAccountData = [];
  receiveCompanyAccountData = [];
  paymentType = [];
  paymentTypeData = [];
  customerReceiveType = [];
  customerReceiveTypeData = [];
  receivePaymentType = [];
  receivePaymentTypeData = [];
  bankAccountType = [];
  appInterestTypes = [];
  banklist = [];
  saving: boolean;
  nextStep: boolean = true;
  GuaranteeAssetYN: boolean;
  GuarantorYN: boolean;
  tranfersType: string;
  contractTypeList = [];
  SecuritiesCategories = [];
  SecuritiesCategoriesData = [];
  customerslist = [];
  companyCode: string;
  CustomersAddress = [];
  MainContractLookupContent = MainContractLookupComponent;
  summayLoanAllContract: number;
  TotalMainLoanAmount: number = 0;
  TotalBorrowersLoanAmount: number = 0;
  AmountForBorrowers: number = 0;
  MortgageFee: number;
  contractReFinance = [];
  contractReFinanceData = [];
  borowwerAmountOver: boolean = false;
  borowwerAmountMin: boolean = false;
  borowwerAmountRequire: boolean = false;
  LoanTypeMax: number;
  securitiesPer: number;
  totalamountSecurities: number;
  overLoanTypeMax: boolean;
  tranfersTypeT: any;
  tranfersTypeM: any;
  closeRefinance: boolean = false;
  flagAddMgmEmployee: boolean = false;
  page = new Page();
  pageMgm = new Page();
  pageEmployee = new Page();
  popupEmployee: ModalRef;
  getEmployeeList = [];
  getMgmList = [];
  attributeSelected = [];
  ContractMgmEmployeeDeleting = [];
  ContractMgmDeleting = [];
  subject: Subject<any> = new Subject();
  MaxPeriod: number = 0;
  MinPeriod: number = 0;
  IsNeedBorrower: boolean;
  ContractMaximumLimitBorrower: number;
  ContractType: string;
  IsAgeOverSixty: boolean;
  MaxLoanDebtAmount: number;
  RefinanceAdditionalPayment: boolean;
  CanRefinance: boolean;
  mainDebtAmount: number = 0;
  P36U: number = 0;
  P28U: number = 0;
  L15U: number = 0;
  CustomerAge: number = 0;
  refinanceAmount: number = 0;
  MainOldContractLoanPrincipleAmount: number = 0;
  mainLoanRefinanceMsg: boolean = false;
  mainLoanRefinanceAdditionalMsg: boolean = false;
  IsSuperUser: boolean;
  IsCompanyCapital: boolean;
  checkMode = false;
  addOn = false;
  CustomerLookupContent = CustomerLookupComponent;
  loanTypeExitSecurities: string;
  refinanceAmtMod1000: number = 0;
  refinanceBorrowers = [];
  isCustomerRefinance: boolean = false;
  compose: boolean = false;
  RoundInterestAmount = 0;
  mainLoanComposeMsg: boolean = false;
  mainLoanPeriodAmountComposeMsg: boolean = false;
  LoanContractType = null;
  categoryId: any;
  isRefinance: boolean = false;
  refinanceData: any;
  typeOfPay = [{ Value: '1', Text: 'ส่งเป็นงวด' }, { Value: '2', Text: 'ส่งแต่ดอกเบี้ย' }]
  typeAmount1: number;
  typeAmount2: number;
  typeAmount3: number;
  typeAmount4: number;
  typeAmount5: number;
  MortgageOnly: boolean = false;
  refinanceType: string;
  securitiesMatched: number = 0;
  securitiesUnmatched: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    private lots04Service: Lots04Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private selectFilter: SelectFilterService,
    private ls: LoadingService,

  ) {
    this.createForm();
  }


  clickStepper(status) {
    if (!this.chkNextStep(this.status)) {
      return;
    }
    window.scrollTo(0, 0);
    this.status = status;
  }

  onPrevious() {
    if (!this.chkNextStep(this.status)) {
      return;
    }

    window.scrollTo(0, 0);
    this.status = this.status - 1;

    if (this.status != 2) {
      this.contractForm.controls.MainLoanPrincipleAmount.enable({ emitEvent: false });
    }
  }

  onNext() {
    if (!this.chkNextStep(this.status)) {
      return;
    }

    if (this.contractForm.controls.MGMCheckbox.value) {
      if (!this.validateEmployee()) {
        this.as.warning('', 'Message.STD00012', ['MGM พนักงาน']);
        return;
      }
    }

    window.scrollTo(0, 0);
    this.status = this.status + 1;

    if (this.status == 2) {
      this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });
      if (this.ContractType == '2' || this.ContractType == '3' || this.ContractType == '4') {
        this.contractForm.controls.AppLoanPeriodAmountDisplay.enable({ emitEvent: false });
      } else {
        this.contractForm.controls.AppLoanPeriodAmountDisplay.disable({ emitEvent: false });
      }

      this.processPeriod();
    }
  }

  chkNextStep(statusValue) {
    this.submitted = true;
    this.nextStep = true;
    if (statusValue === 1) {

      if (this.contractForm.controls.ContractType.invalid
        || this.contractForm.controls.MainContractNo.invalid
        || this.contractForm.controls.MainLoanPrincipleAmount.invalid
        || this.contractForm.controls.ContractDate.invalid
        || this.contractForm.controls.CompanyCode.invalid
        || this.contractForm.controls.CustomerName.invalid
        || this.contractForm.controls.LoanTypeCode.invalid
        || this.contractForm.controls.LoanObjective.invalid
        || this.contractForm.controls.PayType.invalid
        || this.contractForm.controls.ReqLoanAmount.invalid
        || this.contractForm.controls.TotalAmount.invalid
        || this.contractForm.controls.ReqTotalPeriod.invalid
        || this.contractForm.controls.ReqGapPeriod.invalid
        || this.contractForm.controls.AddOn.invalid
        || this.contractForm.controls.ReqTotalMonth.invalid) {
        this.focusToggle = !this.focusToggle;
        this.nextStep = false;
      }

      this.checkMaxLoanAmountByCustomer(this.contractForm.controls.CustomerCode.value)

      var activeInoformation = this.contractInformations.getRawValue().filter(x => x.Active);
      if (activeInoformation.length == 0 && !this.contractForm.controls.MGMCheckbox.value) {
        this.as.warning('', 'Message.STD00012', ['Label.LOTS04.informationCard']);
        this.nextStep = false;
      }

      if (this.IsNeedBorrower) {
        if (this.contractBorrowers.value.length === 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOTS04.GurranteeCode']);
          this.nextStep = false;
        }
      }

      if (this.IsAgeOverSixty) {
        var hasBorrower2Oversixty = this.contractBorrowers.getRawValue().some(function (item) {
          return item.Age < 60;
        });

        if (this.CustomerAge > 60 && !hasBorrower2Oversixty) {
          this.as.warning('', 'Message.LO00057');
          this.nextStep = false;
        }
      }

      if (this.contractForm.controls.MainLoanPrincipleAmount.value > this.LoanTypeMax) {
        this.as.warning('', 'Message.LO00061');
        this.nextStep = false;
      }

      if (this.ContractType == '1' && this.mainDebtAmount > this.maxLoanLimitAmount) {
        this.as.warning('', 'Message.LO00007');
        this.nextStep = false;
      }

      if (this.chkRegLoanAmountForGenerate()) {
        this.as.warning('', 'Message.LO00021');
        this.nextStep = false;
      }

      if (this.summaryTotalLoanAmount() !== this.AmountForBorrowers) {
        this.as.warning('', 'Message.LO00022');
        this.nextStep = false;
      }

      if (this.contractSecuritiess.value.length === 0 && this.contractForm.controls.LoanTypeCode.value != this.loanTypeExitSecurities) {
        this.as.warning('', 'Message.STD00012', ['Label.LOTS04.customerSecuritiesCard']);
        this.nextStep = false;
      }

      if (this.contractBorrowers.value.length > this.maximumLoaner) {
        this.as.warning('', 'Message.LO00002', ['Label.LOTS04.CustomerCodeBorrower']);
        return;
      }

      if (this.chkDupContractBorrowers()) {
        this.as.error("", "Message.STD00004", ["Label.LOTS04.CustomerCodeBorrower"]);
        this.nextStep = false;
      }

      if (this.chkDupContractSecurities()) {
        this.as.error("", "Message.STD00004", ["Label.LOTS04.customerSecurities"]);
        this.nextStep = false;
      }

      if (this.chkDupIncomeItems()) {
        this.as.error("", "Message.STD00004", ["Label.LOTS04.income"]);
        this.nextStep = false;
      }

      if (this.chkDupPaymentItem()) {
        this.as.error("", "Message.STD00004", ["Label.LOTS04.cost"]);
        this.nextStep = false;
      }

      this.checkMainAmountSecrurities();

      if (this.mainCusLoanMsg) {
        this.as.warning('', 'Message.LO00058');
        this.nextStep = false;
      }

      if (this.mainLoanMsg) {
        this.as.warning('', 'Message.LO00008');
        this.nextStep = false;
      }

      if (this.overLoanTypeMax) {
        this.as.warning('', 'Message.LO00027');
        this.nextStep = false;
      }

      if (!this.compose) {
        if (this.mainLoanRefinanceMsg) {
          this.as.warning('', 'Message.LO00060');
          this.nextStep = false;
        }
      } else {
        if (this.mainLoanComposeMsg) {
          this.as.warning('', 'Message.LO00072');
          this.nextStep = false;
        }
      }

      if (this.mainLoanRefinanceAdditionalMsg) {
        this.as.warning('', 'Message.LO00062', [this.refinanceAmtMod1000.toString()]);
        this.nextStep = false;
      }

      if (this.isCustomerRefinance && this.contractForm.controls.OldContractId.value == null) {
        this.as.warning('', 'Message.LO00059');
        this.nextStep = false;
      }

      if (this.closeRefinance) {
        if (!this.CanRefinance) {
          this.as.warning('', 'Message.LO00068');
          this.nextStep = false;
        }

        if (this.findPerson() > 0 && this.MainOldContractLoanPrincipleAmount > this.maxLoanLimitAmount) {
          if (this.refinanceBorrowers.length > 0 && !this.checkBorrowersRefinance()) {
            this.as.warning('', 'Message.LO00069');
            this.nextStep = false;
          }
        }
      }

      if (this.chkMainLoanPrincipleAmount()) {
        if (this.contractForm.controls.CategoryId.value == 3) {
          this.as.warning('', 'Message.LO00067');
        } else {
          this.as.warning('', 'Message.LO00066');
        }
        this.nextStep = false;
      }

      if (this.mainLoanUnmatchLoanTypeMsg) {
        this.as.warning('', 'ยอดเงินกู้ ไม่ตรงตามประเภทสัญญา');
        this.nextStep = false;
      }
    } else if (statusValue === 2) {

      if (this.contractForm.controls.ApprovedDate.invalid
        || this.contractForm.controls.TransferDate.invalid
        || this.contractForm.controls.StartInterestDate.invalid
        || this.contractForm.controls.StartPaymentDate.invalid
        || this.contractForm.controls.AppLoanPrincipleAmount.invalid
        || this.contractForm.controls.AppLoanTotalPeriod.invalid
        || this.contractForm.controls.AppLoanInterestRate.invalid
        || this.contractForm.controls.AppLoanInterestAmount.invalid
        || this.contractForm.controls.AppLoanPeriodAmount.invalid
        || this.contractForm.controls.AppLoanAmountTotal.invalid) {
        this.focusToggle = !this.focusToggle;
        this.nextStep = false;;
      }

      if (this.checkLoanAmountAllContract()) {
        this.as.warning('', 'Message.LO00010');
        this.nextStep = false;
      }

      if (this.contractForm.controls.ReqLoanAmount.value != this.contractForm.controls.AppLoanPrincipleAmount.value) {
        this.as.warning('', 'Message.LO00010');
        this.nextStep = false;
      }

      if (this.mainLoanPeriodAmountComposeMsg) {
        this.as.warning('', 'Message.LO00073');
        this.nextStep = false;
      }

    }
    return this.nextStep;
  }

  createForm() {
    this.contractForm = this.fb.group({
      CustomerCode: [null, Validators.required],
      CustomerName: null,
      CategoryId: [{ value: null, disabled: true }, Validators.required],
      ContractType: [{ value: 'M', disabled: true }, Validators.required],
      MainContractNo: [{ value: null, disabled: true }, Validators.required],
      MainLoanPrincipleAmount: [{ value: null, disabled: true }, Validators.required],
      TotalAllContractAmount: [{ value: null, disabled: true }],
      ContractNo: null,
      ContractDate: [{ value: new Date(), disabled: true }, Validators.required],
      CompanyCode: null,
      CompanyNameTha: [{ value: null, disabled: true }],
      CompanyNameEng: [{ value: null, disabled: true }],
      ContractStatusTha: null,
      ContractStatusEng: null,
      LoanTypeCode: [null, Validators.required],
      LoanObjective: [null, Validators.required],
      PayType: [{ value: null, disabled: true }, Validators.required],
      ReqLoanAmount: null,
      TotalAmount: [{ value: null, disabled: true }],
      ReqTotalPeriod: [null, [Validators.required, Validators.min(1)]],
      ReqGapPeriod: [{ value: '1', disabled: true }, [Validators.required, Validators.min(1)]],
      ReqTotalMonth: [{ value: null, disabled: true }],
      ApprovedDate: [{ value: new Date(), disabled: true }, Validators.required],
      TransferDate: [{ value: new Date(), disabled: true }, Validators.required],
      StartInterestDate: [{ value: new Date(), disabled: true }, Validators.required],
      StartPaymentDate: [{ value: this.getStartPaymentDate(new Date(new Date().setMonth(new Date().getMonth() + 1))), disabled: true }, Validators.required],
      EndPaymentDate: [{ value: null, disabled: true }, Validators.required],
      AppLoanPrincipleAmount: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]],
      AppLoanTotalPeriod: [{ value: null, disabled: true }, Validators.required],
      AppLoanInterestRate: [{ value: null, disabled: true }, Validators.required],
      AppLoanInterestAmount: [{ value: null, disabled: true }, Validators.required],
      AppLoanPeriodAmount: [{ value: null, disabled: true }],
      AppLoanPeriodAmountDisplay: [{ value: null, disabled: true }],
      AppLoanAmountTotal: [{ value: null, disabled: true }],
      AppInterestType: null,
      AppLoanEffectiveInterestRate: [{ value: null, disabled: true }],
      AppLoanEffectiveInterestRatePlan: null,
      AppLoanEffectiveInterestRateYear: [{ value: null, disabled: true }],
      AppFeeRate1: [{ value: null, disabled: true }],
      AppFeeRate2: [{ value: null, disabled: true }],
      AppFeeRate3: [{ value: null, disabled: true }],
      AppFeeAmount1: [{ value: null, disabled: true }],
      AppFeeAmount2: [{ value: null, disabled: true }],
      AppFeeAmount3: [{ value: null, disabled: true }],
      LatePaymentDay: [{ value: null, disabled: true }],
      LatePaymentFeeRate: [{ value: null, disabled: true }],
      PaymentTypeCode: null,
      PaymentCompanyAccountId: [{ value: null, disabled: true }],
      CustomerReceiveTypeCode: null,
      CustomerAccountNo: [{ value: null, disabled: true }],
      CustomerAccountName: [{ value: null, disabled: true }],
      CustomerBankCode: [{ value: null, disabled: true }],
      CustomerBranchName: [{ value: null, disabled: true }],
      CustomerBankAccountTypeCode: null,
      CustomerAccountAuto: null,
      Barcode: null,
      LoanFeeAmount: null,
      Remark: null,
      MGMCheckbox: false,
      Activity: [null, Validators.required],
      MaximumInterestRate: [{ value: null, disabled: true }, Validators.required],
      MaximumInterestRateDisplay: null,
      PriorityPrinciple: null,
      OldContractId: [{ value: null, disabled: true }],
      DescLoan: null,
      AddOn: [null, Validators.required],
      OldContractNo: [{ value: null, disabled: true }],
      ReqType: 'W',
      TypeOfPay: '1',
      contractBorrowers: this.fb.array([]),
      contractSecuritiess: this.fb.array([]),
      contractItems: this.fb.array([]),
      contractIncomeItems: this.fb.array([]),
      contractPaymentItems: this.fb.array([]),
      contractInformations: this.fb.array([]),
      contractPeriods: this.fb.array([]),
      ContractMgmEmployee: this.fb.array([]),
      ContractMgm: this.fb.array([]),
      CloseRefinanceAmount: [{ value: null, disabled: true }],
    });

    this.searchEmpForm = this.fb.group({
      EmployeeCode: null,
      EmployeeName: null
    });

    this.searchMgmForm = this.fb.group({
      MgmCode: null,
      MgmName: null,
      CustomerCode: null
    });

    this.contractForm.controls.CompanyCode.valueChanges.subscribe(
      (val) => {
        if (val) {
          let data = this.company.find(o => { return o.Value == val }) || {};
          this.contractForm.controls.CompanyNameTha.setValue(data.TextTha);
          this.contractForm.controls.CompanyNameEng.setValue(data.TextEng);
          this.filterPaymentCompanyAccount(true);

          let paymentid = null;
          // if (val == 'NMA01001') {
          paymentid = this.paymentCompanyAccount.find(o => { return o.CompanyCode == '999S' }) || {};
          // } else {
          //   paymentid = this.paymentCompanyAccount.find(o => { return o.CompanyCode == data.MainCompany }) || {};
          // }

          this.contractForm.controls.PaymentCompanyAccountId.setValue(paymentid.Value);
        }
      }
    )

    this.contractForm.controls.CustomerCode.valueChanges.subscribe(
      (val) => {
        this.checkCustomerCount(val)
        this.filterCustomerSecurities(null);
        this.contractForm.controls.CustomerReceiveTypeCode.setValue(this.tranfersType);
        this.checkContractRefinanceByCustomer(val);

        if (val) {
          this.contractForm.controls.OldContractId.setValue(null, { emitEvent: false });
          this.contractForm.controls.OldContractId.enable({ emitEvent: false });

          this.contractForm.controls.CategoryId.setValue(null, { emitEvent: false });

          this.contractForm.controls.LoanTypeCode.setValue(null);
          this.contractForm.controls.LoanTypeCode.disable({ emitEvent: false });

          this.contractForm.controls.MainLoanPrincipleAmount.setValue(null, { emitEvent: false });
          this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });
        } else {
          this.mainDebtAmount = 0;

          this.contractForm.controls.LoanTypeCode.setValue(null);
          this.contractForm.controls.LoanTypeCode.disable({ emitEvent: false });

          this.contractForm.controls.CategoryId.setValue(null);

          this.contractForm.controls.OldContractId.setValue(null, { emitEvent: false });
          this.contractForm.controls.OldContractId.disable({ emitEvent: false });

          this.contractForm.controls.MainLoanPrincipleAmount.setValue(null, { emitEvent: false });
          this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });

          this.resetSecurities();
          this.resetBorrower();
        }
      }
    )

    this.contractForm.controls.ContractType.valueChanges.subscribe(
      (val) => {
        if (val) {
          if (val == 'S') {
            this.contractForm.controls.MainContractNo.enable({ emitEvent: false });

            this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
            this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });

            this.contractForm.controls.LoanTypeCode.setValue(null);
            this.contractForm.controls.LoanTypeCode.disable({ emitEvent: false });

            this.contractForm.controls.CategoryId.setValue(null);
            this.contractForm.controls.CategoryId.disable({ emitEvent: false });

            if (this.contractForm.controls.CustomerName.invalid)
              this.contractForm.controls.MainContractNo.disable()

          } else {
            this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
            this.contractForm.controls.MainLoanPrincipleAmount.enable({ emitEvent: false });

            this.contractForm.controls.MainContractNo.setValue(null);
            this.contractForm.controls.MainContractNo.disable({ emitEvent: false });

            this.contractForm.controls.LoanTypeCode.setValue(null);
            this.contractForm.controls.LoanTypeCode.enable({ emitEvent: false });

            this.contractForm.controls.CategoryId.setValue(null);
          }
        } else {

          this.contractForm.controls.MainContractNo.setValue(null);
          this.contractForm.controls.MainContractNo.disable({ emitEvent: false });

          this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
          this.contractForm.controls.MainLoanPrincipleAmount.enable({ emitEvent: false });

          this.contractForm.controls.LoanTypeCode.setValue(null);
          this.contractForm.controls.LoanTypeCode.enable({ emitEvent: false });

          this.contractForm.controls.CategoryId.setValue(null);
        }
      }
    )

    this.contractForm.controls.MainContractNo.valueChanges.subscribe(
      (val) => {
        if (val) {
          if (this.contractHead.MainContractNo == null) {
            this.lots04Service.getMainContractDetailQuery(val).subscribe(
              (res) => {
                if (res) {
                  this.mainContract = res;
                  this.filterSecuritiesCategories(this.mainContract.CustomerCode);

                  this.loanTypeData = this.mainContract.LoantypesList;
                  const detail = this.contractHead;
                  if (detail.LoanTypeCode) {
                    this.loanTypeData = this.selectFilter.FilterActiveByValue(this.loanTypeData, detail.LoanTypeCode);
                  }
                  else {
                    this.loanTypeData = this.selectFilter.FilterActive(this.loanTypeData);
                  }
                  this.selectFilter.SortByLang(this.loanTypeData);
                  this.loanTypeData = [...this.loanTypeData];

                  this.contractForm.controls.CategoryId.setValue(this.mainContract.CategoryId);
                  this.contractForm.controls.CategoryId.disable({ emitEvent: false });

                  this.contractForm.controls.MainLoanPrincipleAmount.setValue(this.mainContract.MainLoanPrincipleAmount, { emitEvent: false });
                  this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });

                  this.contractForm.controls.TotalAllContractAmount.setValue(res.TotalAllContractAmount);
                  this.summayLoanAllContract = res.TotalAllContractAmount;

                  this.contractForm.controls.LoanTypeCode.setValue(this.mainContract.LoanTypeCode, { emitEvent: false });
                  this.contractForm.controls.LoanTypeCode.disable({ emitEvent: false });

                  this.contractForm.controls.LoanObjective.setValue(this.mainContract.LoanObjective, { emitEvent: false })
                  this.getInterestAllmax(this.mainContract.AppLoanPrincipleAmount, this.mainContract.LoanTypeCode)

                  this.contractForm.controls.ReqLoanAmount.setValue(this.mainContract.ReqLoanAmount, { emitEvent: false });
                  this.contractForm.controls.ReqGapPeriod.setValue(this.mainContract.ReqGapPeriod, { emitEvent: false });
                  this.contractForm.controls.ReqTotalPeriod.setValue(this.mainContract.ReqTotalPeriod, { emitEvent: false });
                  this.contractForm.controls.ReqTotalMonth.setValue(this.mainContract.ReqTotalMonth, { emitEvent: false });

                  this.contractForm.controls.ApprovedDate.setValue(this.mainContract.ApprovedDate, { emitEvent: false });
                  this.contractForm.controls.TransferDate.setValue(this.mainContract.TransferDate, { emitEvent: false });
                  this.contractForm.controls.StartInterestDate.setValue(this.mainContract.StartInterestDate, { emitEvent: false });
                  this.contractForm.controls.StartPaymentDate.setValue(this.mainContract.StartPaymentDate, { emitEvent: false });
                  this.contractForm.controls.EndPaymentDate.setValue(this.mainContract.EndPaymentDate, { emitEvent: false });

                  this.contractForm.controls.AppInterestType.setValue(this.mainContract.AppInterestType, { emitEvent: false });
                  this.contractForm.controls.AppLoanInterestRate.setValue(this.mainContract.AppLoanInterestRate, { emitEvent: false });
                  this.contractForm.controls.AppLoanPrincipleAmount.setValue(this.mainContract.AppLoanPrincipleAmount, { emitEvent: false });
                  this.contractForm.controls.AppLoanTotalPeriod.setValue(this.mainContract.AppLoanTotalPeriod, { emitEvent: false });

                  this.contractForm.controls.AppFeeRate1.setValue(this.mainContract.AppFeeRate1, { emitEvent: false });
                  this.contractForm.controls.AppFeeRate2.setValue(this.mainContract.AppFeeRate2, { emitEvent: false });

                  this.contractForm.controls.AppFeeRate3.setValue(this.mainContract.AppFeeRate3, { emitEvent: false });
                  this.contractForm.controls.AppFeeAmount3.setValue(this.mainContract.AppFeeAmount3, { emitEvent: false });


                  this.contractForm.controls.PaymentTypeCode.setValue(this.mainContract.PaymentTypeCode, { emitEvent: false });
                  this.contractForm.controls.PaymentCompanyAccountId.setValue(this.mainContract.PaymentCompanyAccountId, { emitEvent: false });

                  let borrower = this.mainContract.ContractBorrower.filter(item => { return item.CustomerCode !== this.contractForm.controls.CustomerCode.value })
                  this.contractForm.setControl('contractBorrowers', this.fb.array(borrower.map((detail) => this.contractBorrowersForm(detail))))
                  this.contractForm.setControl('contractSecuritiess', this.fb.array(this.mainContract.ContractSecurities.map((detail) => this.contractSecuritiesForm(detail))))
                }
              }
            )
          }
        } else {

          this.contractForm.controls.CategoryId.setValue(null);
          this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
          this.contractForm.controls.TotalAllContractAmount.setValue(null);
          this.summayLoanAllContract = null;

          this.contractForm.controls.LoanTypeCode.setValue(null);
          this.contractForm.controls.LoanObjective.setValue(null)

          this.contractForm.controls.ReqLoanAmount.setValue(null);
          this.contractForm.controls.ReqGapPeriod.setValue(1);
          this.contractForm.controls.ReqTotalPeriod.setValue(null);
          this.contractForm.controls.ReqTotalMonth.setValue(null);

          this.contractForm.controls.ApprovedDate.setValue(new Date());

          this.contractForm.controls.AppLoanPrincipleAmount.setValue(null, { emitEvent: false });

          this.contractForm.controls.PaymentTypeCode.setValue(null);
          this.contractForm.controls.PaymentCompanyAccountId.setValue(null);

          this.resetSecurities();
          this.resetBorrower();
        }
      }
    )

    this.contractForm.controls.MainLoanPrincipleAmount.valueChanges.subscribe(
      (val) => {
        if (val) {
          if (this.ContractType == '0' || this.ContractType == '2' || this.ContractType == '3' || this.ContractType == '4') {
            this.contractForm.controls.ReqLoanAmount.setValue(val);
          } else {
            let data = this.maxLoanLimitAmount - this.mainDebtAmount
            if (data >= this.maxLoanAmount) {
              if (val >= this.maxLoanAmount) {
                this.contractForm.controls.ReqLoanAmount.setValue(this.maxLoanAmount);
              } else {
                this.contractForm.controls.ReqLoanAmount.setValue(val);
              }
            } else {
              if (data < val) {
                this.contractForm.controls.ReqLoanAmount.setValue(data);
              } else {
                this.contractForm.controls.ReqLoanAmount.setValue(val);
              }
            }
          }
          let AppFeeAmount3 = val * (this.MortgageFee / 100)
          if (AppFeeAmount3 > 0)
            this.contractForm.controls.AppFeeAmount3.setValue(AppFeeAmount3, { emitEvent: false })

          if (this.closeRefinance) {
            var indexCustomerRefinance = this.contractInformations.getRawValue().findIndex(x => x.InformationId == 12);
            var indexCustomerAddOn = this.contractInformations.getRawValue().findIndex(x => x.InformationId == 13);

            if (val != 0 && val == this.MainOldContractLoanPrincipleAmount) {
              const controlArray = <FormArray>this.contractForm.get('contractInformations');
              controlArray.controls[indexCustomerRefinance].get('Active').setValue(true);
              controlArray.controls[indexCustomerAddOn].get('Active').setValue(false);

            } else if (val != 0 && val > this.MainOldContractLoanPrincipleAmount) {
              const controlArray = <FormArray>this.contractForm.get('contractInformations');
              controlArray.controls[indexCustomerAddOn].get('Active').setValue(true);
              controlArray.controls[indexCustomerRefinance].get('Active').setValue(false);
              this.onChange();
              this.contractForm.controls.AddOn.setValue(val - this.MainOldContractLoanPrincipleAmount);
            } else {
              const controlArray = <FormArray>this.contractForm.get('contractInformations');
              controlArray.controls[indexCustomerAddOn].get('Active').setValue(false);
              controlArray.controls[indexCustomerRefinance].get('Active').setValue(false);
              this.onChange();
              this.contractForm.controls.AddOn.setValue(null);
            }

            if (AppFeeAmount3 > 0) {
              this.contractForm.controls.AppFeeRate3.enable({ emitEvent: false })
              this.contractForm.controls.AppFeeAmount3.enable({ emitEvent: false })
            }
          }
        } else {
          this.contractForm.controls.ReqLoanAmount.setValue(null);
          this.contractForm.controls.AppFeeRate3.setValue(null, { emitEvent: false })
          this.contractForm.controls.AppFeeAmount3.setValue(null, { emitEvent: false })
          this.contractForm.controls.LoanTypeCode.setValue(null, { emitEvent: false })
        }

        if (this.loanTypeData) {
          var loanTypeDataResult = this.loanTypeData.find(data => val >= data.LoanMinimumAmount && val <= data.LoanLimitAmount);
          if (loanTypeDataResult) {
            this.contractForm.controls.LoanTypeCode.setValue(loanTypeDataResult.Value);
          }
        }
      }
    )

    this.contractForm.controls.CategoryId.valueChanges.subscribe(
      (val) => {
        if (val) {
          this.categoryId = val;
          this.isRefinance = false;
          this.refinanceData = null;
        }
      }
    )

    this.contractForm.controls.LoanTypeCode.valueChanges.subscribe(
      (val) => {
        if (val) {
          let type = this.loanTypeData.find(o => { return o.Value == val }) || {};
          if (type) {
            // this.contractForm.controls.MainLoanPrincipleAmount.enable({ emitEvent: false });

            this.GuaranteeAssetYN = type.GuaranteeAssetYN;
            this.GuarantorYN = type.GuarantorYN;

            this.contractForm.controls.AppLoanInterestRate.setValue(type.InterestRate, { emitEvent: false });
            this.contractForm.controls.AppInterestType.setValue(type.InterestType, { emitEvent: false });
            this.contractForm.controls.AppFeeRate1.setValue(type.AccFee1, { emitEvent: false });
            this.contractForm.controls.AppFeeRate2.setValue(type.AccFee2, { emitEvent: false });

            // ค่าจดจำนอง
            this.MortgageFee = type.MortgageFee;
            let AppFeeAmount3 = this.contractForm.controls.MainLoanPrincipleAmount.value * (type.MortgageFee / 100)
            this.contractForm.controls.AppFeeRate3.setValue(type.MortgageFee)
            if (AppFeeAmount3 > 0) {
              this.contractForm.controls.AppFeeAmount3.setValue(AppFeeAmount3)
            }
            else {
              this.contractForm.controls.AppFeeAmount3.setValue(null)
            }

            if (type.SecuritiesPercent) {
              this.securitiesPer = type.SecuritiesPercent;
            }

            if (type.MaxLoanAmount) {
              this.LoanTypeMax = type.MaxLoanAmount;
            }

            if (type.MaxPeriod) {
              this.MaxPeriod = type.MaxPeriod;
            }

            if (type.MinPeriod) {
              this.MinPeriod = type.MinPeriod;
            }

            if (type.IsNeedBorrower) {
              this.IsNeedBorrower = type.IsNeedBorrower;
            } else {
              this.IsNeedBorrower = false;
            }

            this.MaxLoanAmount = type.ContractMaximumLimit;

            this.ContractMaximumLimitBorrower = type.ContractMaximumLimitBorrower;

            this.ContractType = type.ContractType;

            if (this.ContractType == '0' && this.closeRefinance) {
              this.contractForm.controls.MainLoanPrincipleAmount.setValue(this.contractForm.controls.MainLoanPrincipleAmount.value, { emitEvent: false });
              this.checkMainAmountSecrurities();
            }

            this.checkMaxLoanAmountByCustomer(this.contractForm.controls.CustomerCode.value);

            this.IsAgeOverSixty = type.IsAgeOverSixty;

            this.RefinanceAdditionalPayment = type.RefinanceAdditionalPayment;

            if (type.CanRefinance) {
              this.CanRefinance = type.CanRefinance;
            }

            this.getInterestAllmax(this.contractForm.controls.AppLoanPrincipleAmount.value, val);
            this.checkDebtAmountLimitCustomer();

            this.contractForm.controls.DescLoan.setValue(type.ContractDocument);

          } else {
            this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
            this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });

            this.contractForm.controls.DescLoan.setValue(null);
            this.contractForm.controls.TotalAmount.setValue(null);

          }
        } else {
          this.GuaranteeAssetYN = null;
          this.GuarantorYN = null;

          this.contractForm.controls.AppLoanInterestRate.setValue(null, { emitEvent: false });
          this.contractForm.controls.AppInterestType.setValue(null, { emitEvent: false });
          this.contractForm.controls.AppFeeRate1.setValue(null, { emitEvent: false });
          this.contractForm.controls.AppFeeRate2.setValue(null, { emitEvent: false });
          this.contractForm.controls.AppFeeRate3.setValue(null, { emitEvent: false });
          this.contractForm.controls.AppFeeAmount3.setValue(null, { emitEvent: false });

          this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
          this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });

          this.contractForm.controls.DescLoan.setValue(null);
          this.contractForm.controls.TotalAmount.setValue(null);

          this.resetSecurities();
          this.resetBorrower();
        }
      }
    )

    this.contractForm.controls.OldContractId.valueChanges.subscribe(
      (val) => {
        if (val) {
          let data = this.contractReFinanceData.find(o => { return o.Value == val }) || {};
          this.lots04Service.getCloseRefinanceContractdetailQuery(val, this.contractForm.controls.CustomerCode.value).subscribe(
            (res) => {
              if (data.preRefinanceType == '1') {
                this.compose = true;
              } else {
                this.closeRefinance = true;
              }

              this.refinanceType = data.preRefinanceType;
              this.contractForm.controls.CategoryId.setValue(res.CategoryId);
              this.refinanceAmount = res.MainLoanPrincipleAmount;

              this.categoryId = res.CategoryId;
              this.isRefinance = true;
              this.refinanceData = res;
              this.filterCustomerSecurities(null)
              this.contractForm.setControl('contractSecuritiess', this.fb.array(res.ContractSecurities.map((detail) => this.contractSecuritiesForm(detail))));

              if (this.contractSecuritiess.length > 0) {
                this.securitiesMatched = this.contractSecuritiess.value.filter(x => x.CategoryId == this.contractForm.controls.CategoryId.value)
                  .map(row => row.loanLimitAmount == null ? 0 : row.loanLimitAmount)
                  .reduce((res, cell) => res += cell, 0);

                this.securitiesUnmatched = this.contractSecuritiess.value.filter(x => x.CategoryId != this.contractForm.controls.CategoryId.value)
                  .map(row => row.loanLimitAmount == null ? 0 : row.loanLimitAmount)
                  .reduce((res, cell) => res += cell, 0);
              } else {
                this.securitiesMatched = 0;
                this.securitiesUnmatched = 0;
              }

              this.getMaxLoanAmount();
            }
          )
        } else {
          this.closeRefinance = false;
          this.compose = false;
          this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
          this.contractForm.controls.CategoryId.setValue(null);
          this.contractForm.controls.LoanTypeCode.setValue(null);
          this.resetSecurities();
        }
      })

    this.contractForm.controls.ReqLoanAmount.valueChanges.subscribe(
      (val) => {
        if (val) {
          let reqTotal = this.contractForm.controls.TotalAmount.value;
          this.checkMaxLoanAmount(val, reqTotal);

          let mainAmount = this.contractForm.controls.MainLoanPrincipleAmount.value;
          this.checkMainLoanAmout(mainAmount, val)

          let custCode = this.contractForm.controls.CustomerCode.value;
          this.checkMaxLoanAmountByCustomer(custCode);

          this.contractForm.controls.AppLoanPrincipleAmount.setValue(val)
          this.contractForm.controls.AppLoanPrincipleAmount.markAsDirty();
        } else {
          this.contractForm.controls.AppLoanPrincipleAmount.setValue(null)
          this.contractForm.controls.AppLoanPrincipleAmount.markAsDirty();
        }
      }
    )

    this.contractForm.controls.ReqTotalPeriod.valueChanges.subscribe(
      (val) => {
        if (val) {
          let reqTotal = this.getRegTotalMonth();
          this.contractForm.controls.ReqTotalMonth.setValue(reqTotal)
          this.contractForm.controls.AppLoanTotalPeriod.setValue(val, { emitEvent: false })
        } else {
          this.contractForm.controls.ReqTotalMonth.setValue(null)
          this.contractForm.controls.AppLoanTotalPeriod.setValue(null, { emitEvent: false })
        }
      }
    )

    this.contractForm.controls.ReqGapPeriod.valueChanges.subscribe(
      (val) => {
        if (val) {
          let reqTotal = this.getRegTotalMonth();
          this.contractForm.controls.ReqTotalMonth.setValue(reqTotal)
        }
        else {
          this.contractForm.controls.ReqTotalMonth.setValue(null)
        }
      }
    )

    this.contractForm.controls.ReqTotalMonth.valueChanges.subscribe(
      (val) => {
        if (val) {
          let start = this.contractForm.controls.StartPaymentDate.value;
          if (start) {
            let end = this.getEndPaymentDate(start, val);
            this.contractForm.controls.EndPaymentDate.setValue(end, { emitEvent: false })
          }
        } else {
          this.contractForm.controls.EndPaymentDate.setValue(null, { emitEvent: false })
        }
      }
    )

    this.contractForm.controls.ApprovedDate.valueChanges.subscribe(
      (val) => {
        if (val) {
          this.contractForm.controls.TransferDate.setValue(val);
          this.contractForm.controls.StartInterestDate.setValue(val);
        } else {
          this.contractForm.controls.TransferDate.setValue(null, { emitEvent: false });
          this.contractForm.controls.StartInterestDate.setValue(null, { emitEvent: false });
          this.contractForm.controls.StartPaymentDate.setValue(null, { emitEvent: false });
          this.contractForm.controls.EndPaymentDate.setValue(null, { emitEvent: false })
        }
      }
    )

    this.contractForm.controls.TransferDate.valueChanges.subscribe(
      (val) => {
        if (val) {

          this.contractForm.controls.StartInterestDate.setValue(val);

          let interestDate: Date = new Date(val);
          let date = new Date(interestDate.setMonth(interestDate.getMonth() + 1));

          let startdate = this.getStartPaymentDate(date);
          this.contractForm.controls.StartPaymentDate.setValue(startdate, { emitEvent: false });

          let end: Date = this.getEndPaymentDate(startdate, this.contractForm.controls.ReqTotalMonth.value);
          this.contractForm.controls.EndPaymentDate.setValue(end, { emitEvent: false })
        } else {
          this.contractForm.controls.StartInterestDate.setValue(null, { emitEvent: false });
          this.contractForm.controls.StartPaymentDate.setValue(null, { emitEvent: false });
          this.contractForm.controls.EndPaymentDate.setValue(null, { emitEvent: false })
        }
      }
    )

    this.contractForm.controls.StartPaymentDate.valueChanges.subscribe(
      (val) => {
        if (val) {
          let ReqTotalMonth = this.contractForm.controls.ReqTotalMonth.value;
          if (ReqTotalMonth) {
            let end: Date = this.getEndPaymentDate(val, ReqTotalMonth);
            this.contractForm.controls.EndPaymentDate.setValue(end, { emitEvent: false })
          }
        } else {
          this.contractForm.controls.EndPaymentDate.setValue(null, { emitEvent: false })
        }
      }
    )

    this.contractForm.controls.AppLoanPrincipleAmount.valueChanges.subscribe(
      (val) => {
        if (val) {
          let reqAmount = this.contractForm.controls.ReqLoanAmount.value;
          if (reqAmount < val) {
            this.contractForm.controls.AppLoanPrincipleAmount.setErrors({ 'over': true });
          } else {
            this.contractForm.controls.AppLoanPrincipleAmount.setErrors(null);
          }
          this.getInterestAllmax(val, this.contractForm.controls.LoanTypeCode.value)
        }
      }
    )

    this.contractForm.controls.CustomerReceiveTypeCode.valueChanges.subscribe(
      (val) => {
        this.contractForm.controls.CustomerAccountNo.setValue(null, { emitEvent: false })
        this.contractForm.controls.CustomerAccountName.setValue(null, { emitEvent: false })
        this.contractForm.controls.CustomerBankCode.setValue(null, { emitEvent: false })
        this.contractForm.controls.CustomerBranchName.setValue(null, { emitEvent: false })
        this.contractForm.controls.CustomerBankAccountTypeCode.setValue(null, { emitEvent: false })
        this.contractForm.controls.CustomerAccountAuto.setValue(null, { emitEvent: false })

        if (val == this.tranfersType) {
          if (this.contractHead.CustomerAccountNo == null
            && this.contractHead.CustomerAccountName == null
            && this.contractHead.CustomerBankCode == null
            && this.contractHead.CustomerBranchName == null) {
            this.lots04Service.getCustomerBankAccount(this.contractForm.controls.CustomerCode.value).subscribe(
              (result) => {
                if (result) {
                  this.contractForm.controls.CustomerAccountNo.setValue(result.AccountNo, { emitEvent: false })
                  this.contractForm.controls.CustomerAccountName.setValue(result.AccountName, { emitEvent: false })
                  this.contractForm.controls.CustomerBankCode.setValue(result.BankCode, { emitEvent: false })
                  this.contractForm.controls.CustomerBranchName.setValue(result.BankBranch, { emitEvent: false })
                } else {
                  this.contractForm.controls.CustomerAccountNo.setValue(null, { emitEvent: false })
                  this.contractForm.controls.CustomerAccountName.setValue(null, { emitEvent: false })
                  this.contractForm.controls.CustomerBankCode.setValue(null, { emitEvent: false })
                  this.contractForm.controls.CustomerBranchName.setValue(null, { emitEvent: false })
                }
              }
            )
          }
        }
      }
    )

    this.contractForm.controls.AppLoanPrincipleAmount.valueChanges.subscribe(
      (val) => {
        this.clearPeriod();
      }
    )

    this.contractForm.controls.AppLoanTotalPeriod.valueChanges.subscribe(
      (val) => {
        this.clearPeriod();
      }
    )

    this.contractForm.controls.AppLoanInterestRate.valueChanges.subscribe(
      (val) => {
        this.clearPeriod();
      }
    )

    this.contractForm.controls.MGMCheckbox.valueChanges.subscribe(value => {
      if (value) {
        this.flagAddMgmEmployee = true;
        this.contractForm.controls.Activity.enable();
      } else {
        if (!this.contractForm.controls.Activity.invalid || this.ContractMgmEmployee.length > 0 || this.ContractMgm.length > 0) {
          this.modal.confirm("ต้องการละทิ้ง MGM หรือไม่").subscribe(
            (res) => {
              if (res) {
                this.flagAddMgmEmployee = false;
                this.contractForm.controls.Activity.setValue(null);
                this.contractForm.controls.Activity.disable();

                if (this.ContractMgmEmployee.length > 0) {
                  this.ContractMgmEmployee.getRawValue().forEach(index => {
                    this.removeRowEmployee(index);
                  });
                }

                if (this.ContractMgm.length > 0) {
                  this.ContractMgm.getRawValue().forEach(index => {
                    this.removeRowMgm(index);
                  });
                }

              } else {
                this.contractForm.controls.MGMCheckbox.setValue(true);
              }
            })
        } else {
          this.flagAddMgmEmployee = false;
          this.contractForm.controls.Activity.setValue(null);
          this.contractForm.controls.Activity.disable();
        }
      }
    });

    this.contractForm.controls.TypeOfPay.valueChanges.subscribe(
      (val) => {
        this.LoanContractType = null;
        this.contractForm.controls.LoanTypeCode.setValue(null, { emitEvent: false });
        this.contractForm.controls.MainLoanPrincipleAmount.setValue(null, { emitEvent: false });
        this.contractForm.controls.TotalAmount.setValue(null, { emitEvent: false });
      }
    )
  }


  createContractMgmEmployeeForm(item: ContractMgmEmployee): FormGroup {
    const fg = this.fb.group({
      ContractMgmEmployeeId: null,
      ContractHeadId: null,
      CompanyCode: null,
      EmployeeCode: null,
      EmployeeNameTha: null,
      EmployeeNameEng: null,
      RowVersion: 0,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });
    return fg;
  }

  createContractMgmForm(item: ContractMgm): FormGroup {
    const fg = this.fb.group({
      ContractMgmId: null,
      ContractHeadId: null,
      MgmCode: null,
      CustomerCode: null,
      MgmNameTha: null,
      MgmNameEng: null,
      RowVersion: 0,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });
    return fg;
  }

  get CustomerReceiveTypeCode() {
    return this.contractForm.controls.CustomerReceiveTypeCode;
  }

  get contractBorrowers(): FormArray {
    return this.contractForm.get('contractBorrowers') as FormArray;
  }

  get contractSecuritiess(): FormArray {
    return this.contractForm.get('contractSecuritiess') as FormArray;
  }

  get contractInformations(): FormArray {
    return this.contractForm.get('contractInformations') as FormArray;
  };

  get contractIncomeItems(): FormArray {
    return this.contractForm.get('contractIncomeItems') as FormArray;
  };

  get contractPaymentItems(): FormArray {
    return this.contractForm.get('contractPaymentItems') as FormArray;
  };

  get contractPeriods(): FormArray {
    return this.contractForm.get('contractPeriods') as FormArray;
  };

  contractBorrowersForm(item: ContractBorrower): FormGroup {
    let fg = this.fb.group({
      ContractBorrowerId: 0,
      ContractHeadId: 0,
      CustomerCode: [null, Validators.required],
      CustomerNameEng: null,
      CustomerNameTha: null,
      LoanAmount: [null, [Validators.required, Validators.min(0)]],
      DebtAmount: null,
      Age: null,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState !== RowState.Add) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )

    fg.controls.LoanAmount.valueChanges.subscribe(
      (val) => {
        if (val) {
          let amount = this.maxLoanLimitAmount - fg.controls.DebtAmount.value;
          if (val > amount) {
            fg.controls.LoanAmount.setErrors({ 'over': true });
            this.borowwerAmountOver = true;
          } else {
            fg.controls.LoanAmount.setErrors(null);
            this.borowwerAmountMin = false;
          }
        } else {
          this.borowwerAmountMin = true;
          this.borowwerAmountOver = false;
        }
      }
    )
    return fg;
  }


  contractSecuritiesForm(item: ContractSecurities): FormGroup {
    let fg = this.fb.group({
      ContractSecuritiesId: 0,
      ContractHeadId: 0,
      CustomerSecuritiesId: [null, Validators.required],
      securitiesTha: null,
      securitiesEng: null,
      TypeNameTha: null,
      TypeNameEng: null,
      Description: null,
      loanLimitAmount: null,
      CategoryId: null,
      Priority: null,
      loanFileName: null,
      RowState: RowState.Add,
      StatusTracking: null
    });
    fg.patchValue(item, { emitEvent: false });

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState !== RowState.Add) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )

    fg.controls.CustomerSecuritiesId.valueChanges.subscribe(
      (val) => {
        if (val) {
          this.LoanContractType = null;
          this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
          let cust = this.customerSecurities.find(o => { return o.Value == val }) || {};
          if (cust) {
            fg.controls.TypeNameTha.setValue(cust.TypeNameTha, { emitEvent: false });
            fg.controls.TypeNameEng.setValue(cust.TypeNameEng, { emitEvent: false });
            fg.controls.loanFileName.setValue(cust.loanFileName, { emitEvent: false });
            fg.controls.loanLimitAmount.setValue(cust.loanLimitAmount, { emitEvent: false });
            fg.controls.Description.setValue(cust.description, { emitEvent: false });
            fg.controls.CategoryId.setValue(cust.CategoryId, { emitEvent: false });
            fg.controls.Priority.setValue(cust.Priority, { emitEvent: false });
            fg.controls.StatusTracking.setValue(cust.StatusTracking, { emitEvent: false });

            let priority = null;
            let categoryId = null;
            this.contractSecuritiess.value.forEach(element => {
              if (priority == null) {
                priority = element.Priority;
                categoryId = element.CategoryId;
              } else {
                if (priority > element.Priority) {
                  priority = element.Priority
                  categoryId = element.CategoryId
                }
              }
            });
            this.contractForm.controls.CategoryId.setValue(categoryId, { emitEvent: false });
          }
          this.customerSecurities.find(o => { return o.Value == val })

          if (this.contractSecuritiess.length > 0) {
            this.securitiesMatched = this.contractSecuritiess.value.filter(x => x.CategoryId == this.contractForm.controls.CategoryId.value)
              .map(row => row.loanLimitAmount == null ? 0 : row.loanLimitAmount)
              .reduce((res, cell) => res += cell, 0);

            this.securitiesUnmatched = this.contractSecuritiess.value.filter(x => x.CategoryId != this.contractForm.controls.CategoryId.value)
              .map(row => row.loanLimitAmount == null ? 0 : row.loanLimitAmount)
              .reduce((res, cell) => res += cell, 0);
          } else {
            this.securitiesMatched = 0;
            this.securitiesUnmatched = 0;
          }

          this.getMaxLoanAmount();
        }
        else {
          fg.controls.TypeNameTha.setValue(null, { emitEvent: false });
          fg.controls.TypeNameEng.setValue(null, { emitEvent: false });
          fg.controls.loanLimitAmount.setValue(null, { emitEvent: false });
          fg.controls.loanFileName.setValue(null, { emitEvent: false });
          fg.controls.Description.setValue(null, { emitEvent: false });
        }

        this.checkMainAmountSecrurities();
      }
    )

    if (fg.controls.ContractSecuritiesId.value !== 0)
      this.filterCustomerSecurities(fg.controls.ContractSecuritiesId.value);

    return fg;
  }

  contractInformationsForm(item: ContractInformation): FormGroup {
    let fg = this.fb.group({
      ContractInformationId: 0,
      InformationId: 0,
      ContractHeadId: 0,
      TextTha: null,
      TextEng: null,
      AddOn: null,
      Active: false,
      RowState: RowState.Add
    });

    fg.patchValue(item, { emitEvent: false });

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )

    fg.controls.Active.valueChanges.subscribe((value) => {
      if (value) {
        if (fg.controls.RowState.value == null || fg.controls.RowState.value == RowState.Add) {
          fg.controls.RowState.setValue(RowState.Add, { emitEvent: false });
        } else {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
      else {
        if (fg.controls.RowState.value == RowState.Add) {
          fg.controls.RowState.setValue(null, { emitEvent: false });
        } else {
          fg.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
        }

        if (this.contractHead.ContractInformation.length > 0) {
          // เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
          const deleting = this.contractHead.ContractInformation.find((item) =>
            item.ContractInformationId === fg.controls.ContractInformationId.value
          );
          deleting.RowState = RowState.Delete;
        }
      }
    })

    return fg;
  }

  ContractIncomeItemsForm(item: ContractItem): FormGroup {
    let fg = this.fb.group({
      ContractItemId: 0,
      LoItemCode: [null, Validators.required],
      LoItemSectionCode: null,
      Amount: [null, [Validators.required, Validators.min(1)]],
      ContractHeadId: 0,
      Description: null,
      RowState: RowState.Add,
    });

    fg.patchValue(item, { emitEvent: false });

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )

    return fg;
  }

  ContractPaymentItemsForm(item: ContractItem): FormGroup {
    let fg = this.fb.group({
      ContractItemId: 0,
      LoItemCode: [null, Validators.required],
      LoItemSectionCode: null,
      Amount: [null, [Validators.required, Validators.min(1)]],
      ContractHeadId: 0,
      Description: null,

      RowState: RowState.Add,
    });

    fg.patchValue(item, { emitEvent: false });

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )

    return fg;
  }

  contractPeriodsForm(item: ContractPeriod): FormGroup {
    let fg = this.fb.group({
      ContractPeriodId: 0,
      Period: null,
      ReceiveDate: null,
      PaymentYear: null,
      PaymentPeriod: null,
      PrincipleAmount: null,
      InterestAmount: null,
      TotalAmount: null,
      RoundPrincipleAmount: null,
      RoundInterestAmount: null,
      RoundTotalAmount: null,
      BalPrincipleAmount: null,
      RowState: null,
    });

    fg.patchValue(item, { emitEvent: false });

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )

    return fg;
  }

  get getParameterForSingleLookup() {
    return { ListItemGroupCode: "income_loan" }
  }

  ngOnInit() {
    this.closeRefinance = this.route.snapshot.params['CloseRefinance'] ? JSON.parse(this.route.snapshot.params['CloseRefinance']) : this.closeRefinance;
    this.compose = this.route.snapshot.params['Compose'] ? JSON.parse(this.route.snapshot.params['Compose']) : this.compose;

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.maxLoanAmount = data.contract.master.MaximumLoanAmount;
      this.maxLoanLimitAmount = data.contract.master.MaximumLoanLimitAmount
      this.maximumLoaner = data.contract.master.MaximumLoaner;
      this.maximumGuarantor = data.contract.master.MaximumGuarantor;
      this.payTypeMonth = data.contract.master.PayTypeMonth;
      this.tranfersType = data.contract.master.TranfersType;
      this.tranfersTypeT = data.contract.master.TranfersTypeT;
      this.tranfersTypeM = data.contract.master.TranfersTypeM;
      this.company = data.contract.master.CompanyDetail;
      this.companyList = data.contract.master.CompanysList;
      this.pays = data.contract.master.Pays;
      this.paymentCompanyAccount = data.contract.master.CompanyAccounts;
      this.receiveCompanyAccount = data.contract.master.CompanyAccounts;
      this.paymentType = data.contract.master.ReceiveTypeList;
      this.customerReceiveType = data.contract.master.ReceiveTypeList;
      this.receivePaymentType = data.contract.master.ReceiveTypeList;
      this.bankAccountType = data.contract.master.BankAccountTypeList;
      this.incomeLoan = data.contract.master.IncomeLoanList;
      this.paymentLoan = data.contract.master.PaymentLoanList;
      this.customerSecurities = data.contract.master.CustomerSecuritiesList;
      this.informations = data.contract.master.InformationList;
      this.appInterestTypes = data.contract.master.AppInterestType;
      this.banklist = data.contract.master.BankList;
      this.contractTypeList = data.contract.master.ContractType;
      this.SecuritiesCategories = data.contract.master.SecuritiesCategorys;
      this.companyCode = data.contract.master.CompanyCode;
      this.CustomersAddress = data.contract.master.CustomersAddress;
      this.MortgageFee = data.contract.master.MortgageFee;
      this.contractReFinance = data.contract.master.ContractReFinance;
      this.IsSuperUser = data.contract.master.IsSuperUser;
      this.IsCompanyCapital = data.contract.master.IsCompanyCapital;
      this.loanTypeExitSecurities = data.contract.master.LoanTypeExitSecurities;

      this.contractHead = data.contract.detail;
      this.rebuildForm();
    })

    this.subject
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.checkMainAmountSecrurities();
        this.summaryAmountForBorrowers();
      }
      );
  }

  rebuildForm() {
    this.contractForm.controls.AddOn.disable({ emitEvent: false });
    this.contractForm.markAsPristine();
    this.contractForm.controls.PayType.setValue(this.payTypeMonth, { emitEvent: false })
    this.contractForm.controls.CompanyCode.setValue(this.companyCode);
    this.contractForm.controls.PaymentTypeCode.setValue(this.tranfersType);
    this.contractForm.controls.PaymentTypeCode.disable({ emitEvent: false });
    this.contractForm.controls.CustomerReceiveTypeCode.disable({ emitEvent: false });
    this.contractForm.controls.DescLoan.disable({ emitEvent: false });

    // เพิ่มสัญญา
    if (this.contractHead.ContractNo != null) {
      this.contractForm.patchValue(this.contractHead);
      this.contractForm.controls.ContractType.disable({ emitEvent: false });
      this.contractForm.controls.MainContractNo.disable({ emitEvent: false });
      this.contractForm.controls.CategoryId.disable({ emitEvent: false });
      this.contractForm.controls.LoanTypeCode.disable({ emitEvent: false });
      this.contractForm.controls.ReqLoanAmount.setValue(this.contractHead.ReqLoanAmount);
      this.contractForm.controls.LoanTypeCode.setValue(this.contractHead.LoanTypeCode);
      this.contractForm.setControl('contractInformations', this.fb.array(this.contractHead.ContractInformation.map((detail) => this.contractInformationsForm(detail))))
      this.contractForm.setControl('contractSecuritiess', this.fb.array(this.contractHead.ContractSecurities.map((detail) => this.contractSecuritiesForm(detail))))
    }
    else {
      this.contractForm.setControl('contractInformations', this.fb.array(this.informations.map((detail) => this.contractInformationsForm(detail))))
    }

    // เพิ่มสัญญา กรณีปิดสัญญาแบบ ReFinance
    if (this.contractHead.CustomerCode != null) {
      this.contractForm.controls.CustomerCode.setValue(this.contractHead.CustomerCode);
      this.contractForm.controls.CustomerName.setValue(this.contractHead.CustomerName);

      this.filterSecuritiesCategories(this.contractForm.controls.CustomerCode.value);
      this.filterContractReFinance(this.contractForm.controls.CustomerCode.value);
      this.checkMaxLoanAmountByCustomer(this.contractForm.controls.CustomerCode.value);
      this.checkMainDebtAmountCustomer(this.contractForm.controls.CustomerCode.value);

      this.contractForm.controls.OldContractId.setValue(this.contractHead.OldContractId);
      this.contractForm.setControl('contractSecuritiess', this.fb.array(this.contractHead.ContractSecurities.map((detail) => this.contractSecuritiesForm(detail))))
      this.contractHead.ContractSecurities = [];
    }

    this.contractForm.controls.MGMCheckbox.value ? this.contractForm.controls.Activity.enable() : this.contractForm.controls.Activity.disable();

    this.contractForm.setControl('contractBorrowers', this.fb.array(this.contractHead.ContractBorrower.map((detail) => this.contractBorrowersForm(detail))))
    this.contractForm.setControl('contractIncomeItems', this.fb.array(this.contractHead.ContractIncomeItem.map((detail) => this.ContractIncomeItemsForm(detail))))
    this.contractForm.setControl('contractPaymentItems', this.fb.array(this.contractHead.ContractPaymentItem.map((detail) => this.ContractPaymentItemsForm(detail))))
    this.contractForm.setControl('contractPeriods', this.fb.array(this.contractHead.ContractPeriod.map((detail) => this.contractPeriodsForm(detail))))

    // Super User สาารถแก้ไขวันที่ได้
    if (this.IsSuperUser) {
      this.contractForm.controls.ContractDate.enable({ emitEvent: false });
      this.contractForm.controls.ApprovedDate.enable({ emitEvent: false });
      this.contractForm.controls.TransferDate.enable({ emitEvent: false });
      this.contractForm.controls.StartInterestDate.enable({ emitEvent: false });
    }

    // สาขาภายใต้ 9999 เพิ่มสัญญาจากระบบเก่าเข้าระบบใหม่
    if (this.IsCompanyCapital) {
      this.contractForm.controls.OldContractNo.enable({ emitEvent: false });
      this.contractForm.controls.PaymentCompanyAccountId.enable({ emitEvent: false });
    }

    this.bindDropDownList();
    this.checkDropDown();

    this.LoanContractType = null;
  }


  bindDropDownList() {
    this.selectFilter.SortByLang(this.incomeLoan);
    this.incomeLoan = [...this.incomeLoan];

    this.selectFilter.SortByLang(this.paymentLoan);
    this.paymentLoan = [...this.paymentLoan];

    this.filterPaymentType(true);
    this.filterCustomerReceiveType(true);
    this.filterReceiveTypeCode(true);
    this.filterPaymentCompanyAccount(true);
    this.filterReceiveCompanyAccount(true);
    this.filterBankAccountType(true);
    this.filterBank(true);
  }

  filterContractReFinance(CustormerCode) {
    if (this.contractReFinance) {
      this.contractReFinanceData = this.contractReFinance.filter(item => { return item.CustomerCode == CustormerCode });
      this.contractReFinanceData = [...this.contractReFinanceData];
    }
  }

  filterSecuritiesCategories(CustormerCode) {
    this.SecuritiesCategoriesData = this.SecuritiesCategories.filter(item => { return item.CustomerCode == CustormerCode });
    this.selectFilter.SortByLang(this.SecuritiesCategoriesData);
    this.SecuritiesCategoriesData = [...this.SecuritiesCategoriesData];
  }

  filterPaymentCompanyAccount(filter?: boolean) {
    if (filter) {
      const detail = this.contractHead;
      if (detail.PaymentCompanyAccountId) {
        this.paymentCompanyAccount = this.selectFilter.FilterActiveByValue(this.paymentCompanyAccount, detail.PaymentCompanyAccountId);
      }
      else {
        this.paymentCompanyAccount = this.selectFilter.FilterActive(this.paymentCompanyAccount);
      }
    }
    this.selectFilter.SortByLang(this.paymentCompanyAccount);
    this.paymentCompanyAccount = [...this.paymentCompanyAccount];
  }

  filterBankAccountType(filter?: boolean) {
    if (filter) {
      const detail = this.contractHead;
      if (detail.CustomerBankAccountTypeCode) {
        this.bankAccountType = this.selectFilter.FilterActiveByValue(this.bankAccountType, detail.CustomerBankAccountTypeCode);
      }
      else {
        this.bankAccountType = this.selectFilter.FilterActive(this.bankAccountType);
      }
    }
    this.selectFilter.SortByLang(this.bankAccountType);
    this.bankAccountType = [...this.bankAccountType];
  }

  filterReceiveCompanyAccount(filter?: boolean) {
    if (filter) {
      const detail = this.contractHead;
      if (detail.ReceiveCompanyAccountId) {
        this.receiveCompanyAccount = this.selectFilter.FilterActiveByValue(this.receiveCompanyAccount, detail.ReceiveCompanyAccountId);
      }
      else {
        this.receiveCompanyAccount = this.selectFilter.FilterActive(this.receiveCompanyAccount);
      }
    }
    this.selectFilter.SortByLang(this.receiveCompanyAccount);
    this.receiveCompanyAccount = [...this.receiveCompanyAccount];
  }

  filterPaymentType(filter?: boolean) {
    this.paymentTypeData = this.paymentType.filter(item => { return item.PaymentFlag == true });
    if (filter) {
      const detail = this.contractHead;
      if (detail.PaymentTypeCode) {
        this.paymentTypeData = this.selectFilter.FilterActiveByValue(this.paymentTypeData, detail.PaymentTypeCode);
      }
      else {
        this.paymentTypeData = this.selectFilter.FilterActive(this.paymentTypeData);
      }
    }
    this.selectFilter.SortByLang(this.paymentTypeData);
    this.paymentTypeData = [...this.paymentTypeData];
  }

  filterCustomerReceiveType(filter?: boolean) {
    this.customerReceiveTypeData = this.customerReceiveType.filter(item => { return item.CustomerReceiveflag == true });
    if (filter) {
      const detail = this.contractHead;
      if (detail.CustomerReceiveTypeCode) {
        this.customerReceiveTypeData = this.selectFilter.FilterActiveByValue(this.customerReceiveTypeData, detail.CustomerReceiveTypeCode);
      }
      else {
        this.customerReceiveTypeData = this.selectFilter.FilterActive(this.customerReceiveTypeData);
      }
    }
    this.selectFilter.SortByLang(this.customerReceiveTypeData);
    this.customerReceiveTypeData = [...this.customerReceiveTypeData];
  }

  filterReceiveTypeCode(filter?: boolean) {
    this.receivePaymentTypeData = this.receivePaymentType.filter(item => { return item.Receiveflag == true });
    if (filter) {
      const detail = this.contractHead;
      if (detail.CustomerBankAccountTypeCode) {
        this.receivePaymentTypeData = this.selectFilter.FilterActiveByValue(this.receivePaymentTypeData, detail.CustomerBankAccountTypeCode);
      }
      else {
        this.receivePaymentTypeData = this.selectFilter.FilterActive(this.receivePaymentTypeData);
      }
    }
    this.selectFilter.SortByLang(this.receivePaymentTypeData);
    this.receivePaymentTypeData = [...this.receivePaymentTypeData];
  }

  filterCustomerSecurities(contractSecuritiesId) {
    const customercode = this.contractForm.controls.CustomerCode.value;
    const cateId = this.contractForm.controls.CategoryId.value;

    if (customercode) {

      const baseValue = this.contractHead.ContractSecurities.find((item) => {
        return item.ContractSecuritiesId === contractSecuritiesId
      });

      if (baseValue != null) {
        this.customerSecuritiesData = this.customerSecurities.filter(o => {
          return o.CustomerCode == customercode
        })
        this.customerSecuritiesData = this.selectFilter.FilterActiveByValue(this.customerSecuritiesData, baseValue.ContractSecuritiesId);
      }
      else {
        this.customerSecuritiesData = this.customerSecurities.filter(o => {
          return o.CustomerCode == customercode // && o.refs == true
        })
        this.customerSecuritiesData = this.selectFilter.FilterActive(this.customerSecuritiesData);
      }

      this.selectFilter.SortByLang(this.customerSecuritiesData);
      this.customerSecuritiesData = [...this.customerSecuritiesData];
    }


  }

  filterIncomeLoan(ContractItemId) {
    const baseValue = this.contractHead.ContractIncomeItem.find((item) => {
      return item.ContractItemId === ContractItemId
    });
    if (baseValue) {
      this.incomeLoan = this.selectFilter.FilterActiveByValue(this.incomeLoan, baseValue.LoItemCode);
    }
    else {
      this.incomeLoan = this.selectFilter.FilterActive(this.incomeLoan);
    }
    this.selectFilter.SortByLang(this.incomeLoan);
    this.incomeLoan = [...this.incomeLoan];
  }

  filterPaymentLoan(ContractItemId) {
    const baseValue = this.contractHead.ContractPaymentItem.find((item) => {
      return item.ContractItemId === ContractItemId
    });
    if (baseValue) {
      this.paymentLoan = this.selectFilter.FilterActiveByValue(this.paymentLoan, baseValue.LoItemCode);
    }
    else {
      this.paymentLoan = this.selectFilter.FilterActive(this.paymentLoan);
    }
    this.selectFilter.SortByLang(this.paymentLoan);
    this.paymentLoan = [...this.paymentLoan];
  }

  filterBank(filter?: boolean) {
    if (filter) {
      const detail = this.contractHead;
      if (detail.CustomerBankCode) {
        this.banklist = this.selectFilter.FilterActiveByValue(this.banklist, detail.CustomerBankCode);
      }
      else {
        this.banklist = this.selectFilter.FilterActive(this.banklist);
      }
    }
    this.selectFilter.SortByLang(this.banklist);
    this.banklist = [...this.banklist];
  }

  checkDropDown() {
    if (this.loanTypeData.length > 0) {
      if (this.contractHead.CategoryId == null) {
        this.contractForm.controls.LoanTypeCode.disable();
      } else {
        this.contractForm.controls.LoanTypeCode.enable();
      }
    } else {
      this.contractForm.controls.LoanTypeCode.setValue(null);
      this.contractForm.controls.LoanTypeCode.disable();
    }
  }

  // คำนวณจำนวนงวดทั้งหมด
  getRegTotalMonth() {
    if (!this.contractForm.controls.ReqTotalPeriod.value) {
      this.contractForm.controls.ReqTotalPeriod.setErrors({ 'required': true })
      return;
    } else if (this.contractForm.controls.ReqTotalPeriod.value < this.MinPeriod) {
      this.contractForm.controls.ReqTotalPeriod.setErrors({ 'minPeriod': true })
      return;
    } else if (this.contractForm.controls.ReqTotalPeriod.value > this.MaxPeriod) {
      this.contractForm.controls.ReqTotalPeriod.setErrors({ 'maxPeriod': true })
      return;
    } else {
      this.contractForm.controls.ReqTotalPeriod.setErrors(null);
      return (this.contractForm.controls.ReqTotalPeriod.value * this.contractForm.controls.ReqGapPeriod.value)
    }
  }

  // คำนวณวันที่เริ่มชำระ
  getStartPaymentDate(StartDate) {
    let tempdate = Number(StartDate.getDate().toString());
    let date = new Date(StartDate)
    if (tempdate > 1 && tempdate < 11) {
      date.setDate(11);
    } else if (tempdate > 11 && tempdate < 21) {
      date.setDate(21);
    } else if (tempdate > 21) {
      date.setDate(1);
      date.setMonth(date.getMonth() + 1);
    }
    return date;
  }

  // คำนวณวันสิ้นสุดการชำระ
  getEndPaymentDate(StartDate, ReqTotalMonth) {
    if (ReqTotalMonth) {
      let period = ReqTotalMonth - 1;
      let endDate = new Date(StartDate);
      return new Date(endDate.setMonth(endDate.getMonth() + period));
    }
  }

  // default ค่า Interest All max
  getInterestAllmax(ApproveAmount, loantypecode) {
    this.lots04Service.getMaxInterestRate({
      CustomerCode: this.contractForm.controls.CustomerCode.value,
      ContractType: this.contractForm.controls.ContractType.value,
      MainContractNo: (this.contractForm.controls.MainContractNo.value || null),
      LoanAmount: ApproveAmount
    }).subscribe(
      (res) => {
        let type = this.loanTypeData.find(o => { return o.Value == loantypecode }) || {};
        if (res == 'B') {
          this.contractForm.controls.MaximumInterestRate.setValue(type.InterestAllMax2)
          this.contractForm.controls.MaximumInterestRateDisplay.setValue(type.InterestAllMax2Display)
        } else {
          this.contractForm.controls.MaximumInterestRate.setValue(type.InterestAllMax)
          this.contractForm.controls.MaximumInterestRateDisplay.setValue(type.InterestAllMaxDisplay)
        }
      }
    )
  }

  checkDebtAmountLimitCustomer() {
    this.lots04Service.checkDebtAmountLimitCustomer({
      CustomerCode: this.contractForm.controls.CustomerCode.value
    }).subscribe(
      (res: number) => {
        var loanDebtAmount = 0;

        if (this.MaxLoanAmount) {
          loanDebtAmount = numeral(this.MaxLoanAmount).subtract(res).value();
        } else {
          loanDebtAmount = res;
        }

        this.MaxLoanDebtAmount = loanDebtAmount;
      }
    )
  }

  // เคลียร์ค่า ผู้กู้ร่วม - ผู้ค้ำประกัน
  resetBorrower() {
    if (this.contractHead.ContractBorrower) {
      this.contractHead.ContractBorrower.forEach(item => {
        if (item.RowVersion)
          item.RowState = RowState.Delete
        else
          item.RowState = null
      })
    }
    if (this.contractBorrowers.length > 0) {
      while (this.contractBorrowers.length !== 0) {
        this.contractBorrowers.removeAt(0)
      }
    }
  }

  // เคลียร์ค่า หลักทรัพย์
  resetSecurities() {
    if (this.contractHead.ContractSecurities) {
      this.contractHead.ContractSecurities.forEach(item => {
        if (item.RowVersion)
          item.RowState = RowState.Delete
        else
          item.RowState = null
      })
    }
    if (this.contractSecuritiess.length > 0) {
      while (this.contractSecuritiess.length !== 0) {
        this.contractSecuritiess.removeAt(0)
      }
      this.contractForm.controls.TotalAmount.setValue(null);
    }
  }

  // เช็คยอดเงินกู้ไม่เกินความสามารถในการกู้
  checkMainLoanAmout(mainLoanamout, reqLoanAmount) {
    if ((reqLoanAmount > 0) && (mainLoanamout > 0)) {
      if (reqLoanAmount > mainLoanamout) {
        this.maxLoanMsg = true;
        this.contractForm.controls.ReqLoanAmount.setErrors({ 'over': true });
      } else {
        this.maxLoanMsg = false;
        this.contractForm.controls.ReqLoanAmount.setErrors(null);
      }
      return this.maxLoanMsg
    }
    return null;
  }

  // เช็คยอดเงินกู้ไม่เกินความสามารถในการกู้ กับ ยอดรวมหลักทรัพย์
  checkMainAmountSecrurities() {
    let mainAmount = this.contractForm.controls.MainLoanPrincipleAmount.value;
    // let total = this.summary() ? this.summary() : 0; 
    let total = this.contractForm.controls.TotalAmount.value;
    // let maxAmount = this.securitiesPer ? total * this.securitiesPer / 100 : total;
    let maxAmount = 0;

    if (this.contractForm.controls.TotalAmount.value == 0) {
      maxAmount = 0;
      // } else if (total < this.contractForm.controls.TotalAmount.value) {
      //   maxAmount = this.contractForm.controls.TotalAmount.value;
    } else {
      maxAmount = total;
    }

    if (mainAmount == null) {
      this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'required': true });
    } else if (this.closeRefinance) {
      if (mainAmount < this.MainOldContractLoanPrincipleAmount) {
        this.mainLoanRefinanceMsg = true;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'lessthanLoanCloseRefinance': true });
      } else {
        this.mainLoanRefinanceMsg = false;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
      }

      if (!this.RefinanceAdditionalPayment) {
        if (!this.IsCompanyCapital) {
          if (this.contractForm.controls.CategoryId.value == 3) {
            if ((mainAmount > numeral(this.MainOldContractLoanPrincipleAmount).add(numeral(100).subtract(this.MainOldContractLoanPrincipleAmount % 100).value()).value())) {
              this.mainLoanRefinanceAdditionalMsg = true;
              this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'refinanceAdditionalPayment': true });
            }
          } else {
            if (!this.RefinanceAdditionalPayment && (mainAmount > numeral(this.MainOldContractLoanPrincipleAmount).add(numeral(1000).subtract(this.MainOldContractLoanPrincipleAmount % 1000).value()).value())) {
              this.mainLoanRefinanceAdditionalMsg = true;
              this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'refinanceAdditionalPayment': true });
            }
          }
        }
      } else {
        this.mainLoanRefinanceAdditionalMsg = false;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
      }

      if ((maxAmount >= 0) && mainAmount > maxAmount) {
        if (this.loanTypeData.length > 0) {
          this.overLoanTypeMax = true;
          this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'overLoanTypeMax': true });
        } else {
          this.mainLoanUnmatchLoanTypeMsg = true;
          this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'unmatchAmountInLoanType': true });
        }
      } else {
        this.overLoanTypeMax = false;
        this.mainLoanUnmatchLoanTypeMsg = false;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
      }
    } else if (this.compose) {
      if (mainAmount >= this.MainOldContractLoanPrincipleAmount) {
        this.mainLoanComposeMsg = true;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'morethanLoanCloseCompose': true });
      } else {
        this.mainLoanComposeMsg = false;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
      }

      if ((maxAmount >= 0) && mainAmount > maxAmount) {
        this.overLoanTypeMax = true;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'overLoanTypeMax': true });
      } else {
        this.overLoanTypeMax = false;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
      }
    } else if (this.LoanTypeMax) {
      if ((maxAmount >= 0) && maxAmount <= this.LoanTypeMax) {
        if ((mainAmount > 0) && mainAmount > maxAmount) {
          this.mainLoanMsg = true;
          this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'over': true });
        } else if ((mainAmount > 0) && mainAmount > this.contractForm.controls.TotalAmount.value) {
          this.mainLoanUnmatchLoanTypeMsg = true;
          this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'unmatchAmountInLoanType': true });
        } else {
          this.mainLoanMsg = false;
          this.mainLoanUnmatchLoanTypeMsg = false;
          this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
        }
      } else {
        this.mainLoanMsg = false;
        this.mainLoanUnmatchLoanTypeMsg = false;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);

        if ((mainAmount > 0) && mainAmount > this.LoanTypeMax) {
          this.overLoanTypeMax = true;
          this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'overLoanTypeMax': true });
        } else {
          this.overLoanTypeMax = false;
          this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
        }
      }
    } else if (this.ContractMaximumLimitBorrower == 0) {
      let maxmimumCusMainLoanAmount = 0;
      if (this.MaxLoanAmount) {
        maxmimumCusMainLoanAmount = numeral(this.MaxLoanAmount).subtract(this.P36U).subtract(this.P28U).value();
      } else {
        maxmimumCusMainLoanAmount = numeral(this.P36U).subtract(this.P28U).value();
      }

      if (this.contractForm.controls.MainLoanPrincipleAmount.value > maxmimumCusMainLoanAmount) {
        this.mainCusLoanMsg = true;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'overLoanCusAmount': true });
      } else {
        this.mainCusLoanMsg = false;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
      }
    } else {
      if ((maxAmount >= 0) && mainAmount > maxAmount) {
        this.overLoanTypeMax = true;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'overLoanTypeMax': true });
      } else if ((mainAmount > 0) && mainAmount > this.contractForm.controls.TotalAmount.value) {
        this.mainLoanUnmatchLoanTypeMsg = true;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'unmatchAmountInLoanType': true });
      } else {
        this.overLoanTypeMax = false;
        this.mainLoanUnmatchLoanTypeMsg = false;
        this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
      }
    }
  }

  // คำนวณยอดเงินกู้ทั้งหมดของทุกสัญญา
  checkLoanAmountAllContract() {
    if (this.contractForm.controls.ContractType.value != 'M') {
      let MainLoanPrincipleAmount = this.contractForm.controls.MainLoanPrincipleAmount.value;
      let TotalAllContractAmount = this.contractForm.controls.TotalAllContractAmount.value;
      let mainAppLoanPrincipleAmount = this.mainContract.AppLoanPrincipleAmount;
      let AppLoanPrincipleAmount = this.contractForm.controls.AppLoanPrincipleAmount.value;
      let summaryLoanAmount = TotalAllContractAmount + AppLoanPrincipleAmount;
      if (MainLoanPrincipleAmount
        && TotalAllContractAmount
        && mainAppLoanPrincipleAmount
        && AppLoanPrincipleAmount) {
        if (summaryLoanAmount > MainLoanPrincipleAmount) {
          return true;
        }
      }
      return false;
    }
  }

  // เช็คยอดเงินกู้ไม่เกินตามผู้กู้หลักในแต่ละสาขา
  checkMaxLoanAmountByCustomer(customerCode) {
    if (customerCode) {
      this.lots04Service.getCheckMaxLoanAmountByCustomerCompany({
        CustomerCode: customerCode,
        LoanAmount: (this.contractForm.controls.ReqLoanAmount.value || 0),
        RefinanceAmount: this.refinanceAmount,
        ProgramCode: "LOTS04",
        ContractNo: "Z",
      }).subscribe(
        (res) => {
          if (!res) {
            if (this.ContractType == '0' || this.ContractType == '2' || this.ContractType == '3' || this.ContractType == '4') {
              this.contractForm.controls.CustomerName.setErrors(null);
            } else {
              this.contractForm.controls.CustomerName.setErrors({ 'maxLoanAmount': true });
            }
          }
        }
      )
    }
  }

  // เช็คยอดเงินกู้ไม่เกินตามผู้กู้หลักของสัญญา
  checkMaxLoanAmount(reqLoanAmount, reqTotal) {
    if (this.contractForm.controls.CustomerCode.value) {
      this.lots04Service.getCheckMaxLoanAmount({
        CustomerCode: this.contractForm.controls.CustomerCode.value,
        LoanAmount: (this.contractForm.controls.ReqLoanAmount.value || 0),
        RefinanceAmount: this.refinanceAmount,
        ProgramCode: "LOTS04",
        ContractNo: "Z",
      }).subscribe(
        (res) => {
          if (reqLoanAmount > 0
            && reqLoanAmount <= this.maxLoanAmount
            && res == true) {
            this.maxLoanMsg = false;
            this.contractForm.controls.ReqLoanAmount.setErrors(null);
          } else if (this.ContractType == '0' || this.ContractType == '2' || this.ContractType == '3' || this.ContractType == '4') {
            this.maxLoanMsg = false;
            this.contractForm.controls.ReqLoanAmount.setErrors(null);
          } else {
            this.maxLoanMsg = true;
            this.contractForm.controls.ReqLoanAmount.setErrors({ 'invalid': true });
          }
        }
      )
    }
  }

  // เช็คยอดเงินกู้ของผู้กู้ร่วม
  chkRegLoanAmountForGenerate() {
    let Debt = this.contractForm.controls.MainLoanPrincipleAmount.value - this.TotalMainLoanAmount;
    if (Debt > 0 && this.IsNeedBorrower) {
      if (this.contractBorrowers.value.length > 0)
        return false
      else
        return true
    } else {
      return false
    }
  }

  summaryTotalLoanAmount() {
    if (this.contractForm.controls.ContractType.value == 'M') {
      let total = this.contractBorrowers.getRawValue().map(row => row.LoanAmount == null ? 0 : row.LoanAmount)
        .reduce((res, cell) => res += cell, 0);
      this.TotalBorrowersLoanAmount = total;
      return total;
    }
  }

  summaryDeptLeft() {
    if (this.MaxLoanAmount && this.MaxLoanAmount > 0) {
      this.TotalMainLoanAmount = this.MaxLoanAmount - this.mainDebtAmount;
    } else {
      this.TotalMainLoanAmount = 0;
    }
    return this.TotalMainLoanAmount
  }

  summaryAmountForBorrowers() {
    if (this.contractForm.controls.ContractType.value == 'M' && this.TotalMainLoanAmount > 0 && this.contractForm.controls.MainLoanPrincipleAmount.value > this.TotalMainLoanAmount) {
      this.AmountForBorrowers = this.contractForm.controls.MainLoanPrincipleAmount.value - this.TotalMainLoanAmount;
      return this.AmountForBorrowers;
    }
    this.AmountForBorrowers = 0;
    return 0
  }

  findPerson() {
    if (this.AmountForBorrowers)
      return Math.ceil(this.AmountForBorrowers / this.maxLoanLimitAmount);
    else
      return 0;
  }

  addBorrower() {
    if (this.contractForm.controls.CustomerCode.value == null)
      return this.as.warning('', 'Message.STD00023', ['Label.LOTS04.CustomerCode']);

    if (!this.contractForm.controls.MainLoanPrincipleAmount.value)
      return this.as.warning('', 'Message.LO00002', ['Label.LOTS04.MainLoanPrincipleAmount']);

    let amountLeft = this.AmountForBorrowers;

    this.modal.openComponent(BorrowerLookupComponent, Size.large, { CustomerMain: this.contractForm.controls.CustomerCode.value, IsRefinance: this.closeRefinance }).subscribe(
      (result) => {
        result.forEach(element => {
          if (element.CustomerCode) {
            this.lots04Service.checkBorrowerAddress({
              LoanTypeCode: this.contractForm.controls.LoanTypeCode.value,
              MainCustomerCode: this.contractForm.controls.CustomerCode.value,
              CustomerCode: element.CustomerCode
            }).subscribe(
              (res) => {
                if (!res) {
                  return this.as.warning('', 'Message.LO00037');
                } else {
                  if (this.maxLoanLimitAmount) {
                    let data = this.maxLoanLimitAmount - element.DebtAmount;
                    if (data >= this.maxLoanLimitAmount) {
                      if (amountLeft >= this.maxLoanLimitAmount) {
                        element.LoanAmount = this.maxLoanLimitAmount;

                        // หัก ยอดเงินที่กู้ออกจากยอดกู้ของผู้กู้ร่วม
                        amountLeft = amountLeft - this.maxLoanLimitAmount;
                      } else {

                        element.LoanAmount = amountLeft;

                        // หัก ยอดเงินที่กู้ออกจากยอดกู้ของผู้กู้ร่วม
                        amountLeft = amountLeft - amountLeft;
                      }
                    } else {
                      if (data < amountLeft) {
                        element.LoanAmount = data
                      } else {
                        element.LoanAmount = amountLeft
                      }
                    }
                  }
                  this.contractBorrowers.push(this.contractBorrowersForm(element));
                  this.contractBorrowers.markAsDirty();
                }
              }
            )
          }
        });
      }
    )
  }

  removeRowBorrower(index) {
    let detail = this.contractBorrowers.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      // เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
      const deleting = this.contractHead.ContractBorrower.find((item) =>
        item.ContractBorrowerId === detail.controls.ContractBorrowerId.value
      );
      deleting.RowState = RowState.Delete;
    }

    let rows = [...this.contractBorrowers.value];
    rows.splice(index, 1);

    this.contractBorrowers.patchValue(rows, { emitEvent: false });
    this.contractBorrowers.removeAt(this.contractBorrowers.length - 1);
    this.contractBorrowers.markAsDirty();
  }

  chkDupContractBorrowers() {
    let seen = new Set();
    var hasDuplicates = this.contractForm.value.contractBorrowers.some(function (item) {
      return seen.size === seen.add(item.CustomerCode).size;
    });
    return hasDuplicates;
  }

  addSecurities() {
    const customerCode = this.contractForm.controls.CustomerCode.value;
    if (customerCode) {
      this.contractSecuritiess.markAsDirty();
      this.contractSecuritiess.push(this.contractSecuritiesForm({} as ContractSecurities));
    } else {
      this.as.warning('', 'Message.STD00023', ['Label.LOTS04.ContractBorrowMain']);
      return;
    }
  }

  removeRowSecurities(index) {
    let detail = this.contractSecuritiess.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      // เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
      const deleting = this.contractHead.ContractSecurities.find((item) =>
        item.ContractSecuritiesId === detail.controls.ContractSecuritiesId.value
      );
      deleting.RowState = RowState.Delete;
    }


    let rows = [...this.contractSecuritiess.value];
    rows.splice(index, 1);

    this.contractSecuritiess.patchValue(rows, { emitEvent: false });
    this.contractSecuritiess.removeAt(this.contractSecuritiess.length - 1);
    this.contractSecuritiess.markAsDirty();

    if (this.contractSecuritiess.length === 0) {
      this.cateSecurities = null;
      this.contractForm.controls.TotalAmount.setValue(null)
    }

    if (this.contractSecuritiess.length > 0) {
      let priority = null;
      let categoryId = null;
      this.contractSecuritiess.value.forEach(element => {
        if (priority == null) {
          priority = element.Priority;
          categoryId = element.CategoryId;
        } else {
          if (priority > element.Priority) {
            priority = element.Priority
            categoryId = element.CategoryId
          }
        }
      });
      this.contractForm.controls.CategoryId.setValue(categoryId, { emitEvent: false });

      this.securitiesMatched = this.contractSecuritiess.value.filter(x => x.CategoryId == this.contractForm.controls.CategoryId.value)
        .map(row => row.loanLimitAmount == null ? 0 : row.loanLimitAmount)
        .reduce((res, cell) => res += cell, 0);

      this.securitiesUnmatched = this.contractSecuritiess.value.filter(x => x.CategoryId != this.contractForm.controls.CategoryId.value)
        .map(row => row.loanLimitAmount == null ? 0 : row.loanLimitAmount)
        .reduce((res, cell) => res += cell, 0);

        // this.contractForm.controls.LoanTypeCode.setValue(null);
        this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
        this.contractForm.controls.ReqTotalPeriod.setValue(null);
    } else {
      this.contractForm.controls.CategoryId.setValue(null, { emitEvent: false });
      this.LoanContractType = null;
      this.contractForm.controls.LoanTypeCode.setValue(null);
      this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
      this.contractForm.controls.ReqTotalPeriod.setValue(null);

      this.securitiesMatched = 0;
      this.securitiesUnmatched = 0;
    }
    this.getMaxLoanAmount();
  }

  chkDupContractSecurities() {
    let seen = new Set();
    var hasDuplicates = this.contractForm.value.contractSecuritiess.some(function (item) {
      return seen.size === seen.add(item.CustomerSecuritiesId).size;
    });
    return hasDuplicates;
  }

  summary() {
    if (this.contractSecuritiess.length > 0) {
      let total = this.contractSecuritiess.value.map(row => row.loanLimitAmount == null ? 0 : row.loanLimitAmount)
        .reduce((res, cell) => res += cell, 0);
      return total;
    }
  }

  addContractIncomeItem() {
    this.contractIncomeItems.markAsDirty();
    this.contractIncomeItems.push(this.ContractIncomeItemsForm({} as ContractItem));
  }

  removeRowContractIncomeItem(index) {
    let detail = this.contractIncomeItems.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      // เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
      const deleting = this.contractHead.ContractIncomeItem.find((item) =>
        item.ContractItemId === detail.controls.ContractItemId.value
      );
      deleting.RowState = RowState.Delete;
    }

    let rows = [...this.contractIncomeItems.value];
    rows.splice(index, 1);

    this.contractIncomeItems.patchValue(rows, { emitEvent: false });
    this.contractIncomeItems.removeAt(this.contractIncomeItems.length - 1);
    this.contractIncomeItems.markAsDirty();
  }

  chkDupIncomeItems() {
    let seen = new Set();
    var hasDuplicates = this.contractForm.value.contractIncomeItems.some(function (item) {
      return seen.size === seen.add(item.LoItemCode).size;
    });
    return hasDuplicates;
  }

  addContractPaymentItem() {
    this.contractPaymentItems.markAsDirty();
    this.contractPaymentItems.push(this.ContractPaymentItemsForm({} as ContractItem));
  }

  removeRowContractPaymentItem(index) {
    let detail = this.contractPaymentItems.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      // เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
      const deleting = this.contractHead.ContractPaymentItem.find((item) =>
        item.ContractItemId === detail.controls.ContractItemId.value
      );
      deleting.RowState = RowState.Delete;
    }

    let rows = [...this.contractPaymentItems.value];
    rows.splice(index, 1);

    this.contractPaymentItems.patchValue(rows, { emitEvent: false });
    this.contractPaymentItems.removeAt(this.contractPaymentItems.length - 1);
    this.contractPaymentItems.markAsDirty();
  }

  chkDupPaymentItem() {
    let seen = new Set();
    var hasDuplicates = this.contractForm.value.contractPaymentItems.some(function (item) {
      return seen.size === seen.add(item.LoItemCode).size;
    });
    return hasDuplicates;
  }

  processPeriod() {
    if (this.contractForm.controls.ApprovedDate.invalid
      || this.contractForm.controls.TransferDate.invalid
      || this.contractForm.controls.StartInterestDate.invalid
      || this.contractForm.controls.StartPaymentDate.invalid
      || this.contractForm.controls.AppLoanPrincipleAmount.invalid
      || this.contractForm.controls.AppLoanTotalPeriod.invalid
      || this.contractForm.controls.AppLoanInterestRate.invalid
      || this.contractForm.controls.AppLoanInterestAmount.invalid
      || this.contractForm.controls.AppLoanPeriodAmount.invalid
      || this.contractForm.controls.AppLoanAmountTotal.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.contractPeriods.length > 0) {
      while (this.contractPeriods.length !== 0) {
        this.contractPeriods.removeAt(0)
      }
    }
    this.getPeriod();
  }

  getPeriod() {
    this.clearPeriod();

    let InterestDate = this.contractForm.controls.StartInterestDate.value;
    let rate = this.contractForm.controls.AppLoanInterestRate.value;
    let principleAmount = this.contractForm.controls.AppLoanPrincipleAmount.value;
    let totalPeriod = this.contractForm.controls.AppLoanTotalPeriod.value;
    let startPaymentDate = this.contractForm.controls.StartPaymentDate.value;
    let reqGapPeriod = this.contractForm.controls.ReqGapPeriod.value;
    let mainLoanPrincipleAmount = this.contractForm.controls.MainLoanPrincipleAmount.value;
    let LoanType = this.contractForm.controls.LoanTypeCode.value;

    if ((this.ContractType == '2' || this.ContractType == '3' || this.ContractType == '4') && (this.contractForm.controls.AppLoanPeriodAmountDisplay.value == null)) {
      this.contractForm.controls.AppLoanPeriodAmountDisplay.setValue(0);
    }

    let AppLoanPeriodAmountDisplay = this.contractForm.controls.AppLoanPeriodAmountDisplay.value;

    if (rate && principleAmount && totalPeriod && startPaymentDate && reqGapPeriod) {
      this.lots04Service.getContractPeriodQuery(Object.assign({
        fixRate: rate,
        AppLoanPrincipleAmount: principleAmount,
        AppLoanTotalPeriod: totalPeriod,
        StartPaymentDate: startPaymentDate,
        ReqGapPeriod: reqGapPeriod,
        InterestDate: InterestDate,
        LoanType: LoanType,
        AppLoanPeriodAmountDisplay: AppLoanPeriodAmountDisplay,
        MainLoanPrincipleAmount: mainLoanPrincipleAmount
      })).subscribe(
        (res) => {
          if (res) {
            if (res.length <= 2) {
              let yearInterestRate = (res[res.length - 1].effectiveRate * 12)
              this.contractForm.controls.AppLoanPeriodAmount.setValue(res[res.length - 1].TotalAmount, { emitEvent: false })
              this.contractForm.controls.AppLoanEffectiveInterestRate.setValue(res[res.length - 1].effectiveRate, { emitEvent: false })
              this.contractForm.controls.AppLoanEffectiveInterestRatePlan.setValue(res[res.length - 1].effectiveRatePlan, { emitEvent: false })
              this.contractForm.controls.AppLoanEffectiveInterestRateYear.setValue(yearInterestRate, { emitEvent: false })
            } else {
              let yearInterestRate = (res[2].effectiveRate * 12)
              this.contractForm.controls.AppLoanPeriodAmount.setValue(res[2].TotalAmount, { emitEvent: false })
              this.contractForm.controls.AppLoanEffectiveInterestRate.setValue(res[2].effectiveRate, { emitEvent: false })
              this.contractForm.controls.AppLoanEffectiveInterestRatePlan.setValue(res[2].effectiveRatePlan, { emitEvent: false })
              this.contractForm.controls.AppLoanEffectiveInterestRateYear.setValue(yearInterestRate, { emitEvent: false })
            }

            this.lots04Service.getContractPeriodQuery(Object.assign({
              fixRate: rate,
              AppLoanPrincipleAmount: mainLoanPrincipleAmount,
              AppLoanTotalPeriod: totalPeriod,
              StartPaymentDate: startPaymentDate,
              ReqGapPeriod: reqGapPeriod,
              InterestDate: InterestDate,
              LoanType: LoanType,
              AppLoanPeriodAmountDisplay: AppLoanPeriodAmountDisplay,
              MainLoanPrincipleAmount: mainLoanPrincipleAmount
            })).subscribe(
              (res) => {
                if (res) {
                  var eirPercent = this.contractForm.controls.AppLoanEffectiveInterestRate.value / 100;
                  var interestOnlyPeriodAmount = 0;

                  if (this.ContractType == '3') {
                    interestOnlyPeriodAmount = Math.round(mainLoanPrincipleAmount * eirPercent);
                  }

                  if (this.ContractType == '4') {
                    interestOnlyPeriodAmount = Math.floor(mainLoanPrincipleAmount * eirPercent);
                  }

                  if ((this.ContractType == '2') && this.contractForm.controls.AppLoanPeriodAmountDisplay.value < res[1].RoundInterestAmount) {
                    this.RoundInterestAmount = res[1].RoundInterestAmount;
                    this.contractForm.controls.AppLoanPeriodAmountDisplay.setErrors({ 'min': true });
                    return;
                  } else if ((this.ContractType == '3' || this.ContractType == '4') && this.contractForm.controls.AppLoanPeriodAmountDisplay.value < interestOnlyPeriodAmount) {
                    this.RoundInterestAmount = interestOnlyPeriodAmount;
                    this.contractForm.controls.AppLoanPeriodAmountDisplay.setErrors({ 'min': true });
                    return;
                  }

                  res.every((element, index) => {
                    if (index == 2 && (this.ContractType != '2' && this.ContractType != '3')) {
                      this.contractForm.controls.AppLoanPeriodAmountDisplay.setValue(element.RoundTotalAmount, { emitEvent: false })
                    }

                    if (element.BalPrincipleAmount < 0) {
                      this.as.warning('', 'Message.LO00073');
                      this.mainLoanPeriodAmountComposeMsg = true;

                      if (this.contractPeriods.value.length > 0) {
                        while (this.contractPeriods.length !== 0) {
                          this.contractPeriods.removeAt(0)
                        }
                      }
                      return false;
                    } else {
                      this.contractPeriods.push(this.contractPeriodsForm(element));
                      this.contractPeriods.markAsDirty();
                      this.mainLoanPeriodAmountComposeMsg = false;
                      return true;
                    }
                  });
                } else {
                  this.contractForm.setControl('contractPeriods', this.fb.group({}));
                  this.contractForm.controls.AppLoanPeriodAmountDisplay.setValue(null, { emitEvent: false })
                }
              }, (error) => {
                console.log(error);
              });
          } else {
            this.contractForm.controls.AppLoanPeriodAmount.setValue(null, { emitEvent: false })
            this.contractForm.controls.AppLoanEffectiveInterestRate.setValue(null, { emitEvent: false })
            this.contractForm.controls.AppLoanEffectiveInterestRatePlan.setValue(null, { emitEvent: false })
            this.contractForm.controls.AppLoanEffectiveInterestRateYear.setValue(null, { emitEvent: false })
          }

        }, (error) => {
          console.log(error);
        });
    }
  }

  clearPeriod() {
    if (this.contractHead.ContractPeriod) {
      this.contractHead.ContractPeriod.forEach(item => {
        if (item.RowVersion)
          item.RowState = RowState.Delete
        else
          item.RowState = null
      })
    }

    if (this.contractPeriods.value.length > 0) {
      while (this.contractPeriods.length !== 0) {
        this.contractPeriods.removeAt(0)
      }
    }
  }

  summaryTotalAmount() {
    if (this.contractPeriods.length > 0) {
      let total = this.contractPeriods.value.map(row => row.TotalAmount == null ? 0 : row.TotalAmount)
        .reduce((res, cell) => {
          var a = numeral(res).value();
          var b = numeral(cell).value();
          return (a += b);
        }, 0);
      this.contractForm.controls.AppLoanAmountTotal.setValue(Math.round(total), { emitEvent: false })
      return Math.round(total);
    }
  }

  summaryPrincipleAmount() {
    if (this.contractPeriods.length > 0) {
      let totalPrincipleAmount = this.contractPeriods.value.map(row => row.PrincipleAmount == null ? 0 : row.PrincipleAmount)
        .reduce((res, cell) => {
          var a = numeral(res).value();
          var b = numeral(cell).value();
          return (a += b);
        }, 0);
      return Math.round(totalPrincipleAmount);
    }
  }

  summaryInterestAmount() {
    if (this.contractPeriods.length > 0) {
      let totalInterestAmount = this.contractPeriods.value.map(row => row.InterestAmount == null ? 0 : row.InterestAmount)
        .reduce((res, cell) => {
          var a = numeral(res).value();
          var b = numeral(cell).value();
          return (a += b);
        }, 0);
      this.contractForm.controls.AppLoanInterestAmount.setValue(Math.round(totalInterestAmount), { emitEvent: false })
      return Math.round(totalInterestAmount);
    }
  }

  prepareSave(values: Object) {

    Object.assign(this.contractHead, values);
    this.contractHead.IsDisableAttachment = false;
    const borrowers = this.contractBorrowers.getRawValue();
    //add
    const addingBorrowers = borrowers.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.contractHead.ContractBorrower.map(detail => {
      return Object.assign(detail, borrowers.filter(item => item.RowState == RowState.Edit).find((item) => {
        return detail.ContractBorrowerId == item.ContractBorrowerId
      }));
    })
    //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.contractHead.ContractBorrower = this.contractHead.ContractBorrower.filter(item => item.RowState !== RowState.Add).concat(addingBorrowers);

    const securities = this.contractSecuritiess.getRawValue();
    //add
    const addingSecurities = securities.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.contractHead.ContractSecurities.map(detail => {
      return Object.assign(detail, securities.filter(item => item.RowState == RowState.Edit).find((item) => {
        return detail.ContractSecuritiesId == item.ContractSecuritiesId
      }));
    })
    //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.contractHead.ContractSecurities = this.contractHead.ContractSecurities.filter(item => item.RowState !== RowState.Add).concat(addingSecurities);

    const IncomeItems = this.contractIncomeItems.getRawValue();
    //add
    const addingIncomeItems = IncomeItems.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.contractHead.ContractIncomeItem.map(detail => {
      return Object.assign(detail, IncomeItems.filter(item => item.RowState == RowState.Edit).find((item) => {
        return detail.ContractItemId == item.ContractItemId
      }));
    })
    //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.contractHead.ContractIncomeItem = this.contractHead.ContractIncomeItem.filter(item => item.RowState !== RowState.Add).concat(addingIncomeItems);

    const PaymentItems = this.contractPaymentItems.getRawValue();
    //add
    const addingPaymentItems = PaymentItems.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.contractHead.ContractPaymentItem.map(detail => {
      return Object.assign(detail, PaymentItems.filter(item => item.RowState == RowState.Edit).find((item) => {
        return detail.ContractItemId == item.ContractItemId
      }));
    })
    //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.contractHead.ContractPaymentItem = this.contractHead.ContractPaymentItem.filter(item => item.RowState !== RowState.Add).concat(addingPaymentItems);

    const items = this.contractHead.ContractIncomeItem.concat(this.contractHead.ContractPaymentItem);
    Object.assign(this.contractHead.ContractItem, items)

    const Informations = this.contractInformations.getRawValue();
    //add
    const addingInformations = Informations.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    this.contractHead.ContractInformation = this.contractHead.ContractInformation.filter(item => item.RowState !== RowState.Add && item.RowState !== null).concat(addingInformations);
    let data = this.contractHead.ContractInformation.filter(x => x.InformationId == 13)
    if (data && data.length > 0) {
      data[0].AddOn = this.contractForm.controls.AddOn.value;
    }

    const periods = this.contractPeriods.getRawValue();
    //add
    const addingPeriods = periods.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.contractHead.ContractPeriod.map(detail => {
      return Object.assign(detail, periods.filter(item => item.RowState == RowState.Edit).find((item) => {
        return detail.ContractPeriodId == item.ContractPeriodId
      }));
    })
    //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.contractHead.ContractPeriod = this.contractHead.ContractPeriod.filter(item => item.RowState !== RowState.Add).concat(addingPeriods);

    // Employee
    const getContractMgmEmployee = this.ContractMgmEmployee.getRawValue();
    this.contractHead.ContractMgmEmployee.map(conEmp => {
      return Object.assign(conEmp, getContractMgmEmployee.concat(this.ContractMgmEmployeeDeleting).find((o) => {
        return o.ContractMgmEmployeeId === conEmp.ContractMgmEmployeeId && o.CompanyCode === conEmp.CompanyCode && o.EmployeeCode === conEmp.EmployeeCode;
      }));
    });

    const ContractMgmEmployeeAdding = getContractMgmEmployee.filter(function (item) {
      return item.rowState === RowState.Add;
    });

    this.contractHead.ContractMgmEmployee = this.contractHead.ContractMgmEmployee.concat(ContractMgmEmployeeAdding);

    // Mgm
    const getContractMgm = this.ContractMgm.getRawValue();
    this.contractHead.ContractMgm.map(conEmp => {
      return Object.assign(conEmp, getContractMgm.concat(this.ContractMgmDeleting).find((o) => {
        return o.ContractMgmId === conEmp.ContractMgmId && o.MgmCode === conEmp.MgmCode;
      }));
    });

    const ContractMgmAdding = getContractMgm.filter(function (item) {
      return item.rowState === RowState.Add;
    });
    this.contractHead.ContractMgm = this.contractHead.ContractMgm.concat(ContractMgmAdding);
  }

  onSubmit() {
    this.submitted = true;

    if (this.contractForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const customerCode = this.contractForm.controls.CustomerCode.value;
    if (!customerCode) {
      this.as.warning('', 'Message.STD00023', ['Label.LOTS04.ContractBorrowMain']);
      return;
    }

    if (this.chkDupContractBorrowers()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.CustomerCodeBorrower"]);
    }

    if (this.chkDupContractSecurities()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.customerSecurities"]);
    }

    if (this.chkDupIncomeItems()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.income"]);
    }

    if (this.chkDupPaymentItem()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.cost"]);
    }

    if (this.contractSecuritiess.value.length === 0 && this.contractForm.controls.LoanTypeCode.value != this.loanTypeExitSecurities) {
      this.as.warning('', 'Message.STD00012', ['Label.LOTS04.customerSecuritiesCard']);
      return;
    }

    if (this.contractBorrowers.value.length > 6) {
      this.as.warning('', 'Message.LO00002', ['Label.LOTS04.CustomerCodeBorrower']);
      return;
    }

    if (this.contractForm.controls['OldContractNo'].value) {
      this.contractForm.controls['OldContractNo'].setValue(this.contractForm.controls['OldContractNo'].value.trim());
    }

    this.saving = true;
    this.prepareSave(this.contractForm.getRawValue());
    let oldContractNo = null;
    if (this.compose) {
      oldContractNo = this.contractReFinanceData.filter(x => x.Value == this.contractHead.OldContractId);
    }
    this.lots04Service.saveContract(this.contractHead).pipe(
      switchMap(() => this.lots04Service.getContractDetail()),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: ContractHead) => {
        this.contractHead = res;
        this.as.success('', 'Message.STD00006');
        this.createForm();
        this.rebuildForm();
        this.status = 1;
        window.scrollTo(0, 0);
      });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.contractForm.dirty) {
      return true;
    }
    return this.modal.confirm("Message.STD00002");
  }

  onTableEvent(event) {
    this.page = event;
    this.searchEmployeeModal();
  }

  searchEmployeeModal() {
    if (this.searchEmpForm.controls['EmployeeCode'].value) {
      this.searchEmpForm.controls['EmployeeCode'].setValue(this.searchEmpForm.controls['EmployeeCode'].value.trim());
    }

    if (this.searchEmpForm.controls['EmployeeName'].value) {
      this.searchEmpForm.controls['EmployeeName'].setValue(this.searchEmpForm.controls['EmployeeName'].value.trim());
    }

    this.lots04Service.getEmployeeTable(this.searchEmpForm.value, this.pageEmployee)
      .pipe(finalize(() => {
        this.attributeSelected = [];
      }))
      .subscribe(
        (res) => {
          this.getEmployeeList = res.Rows;
          this.pageEmployee.totalElements = res.Total;
        }
      )
  }

  addEmployee() {
    this.ContractMgmEmployee.push(this.createContractMgmEmployeeForm({} as ContractMgmEmployee));
    this.contractForm.markAsDirty();
  }

  addMgm() {
    this.ContractMgm.push(this.createContractMgmForm({} as ContractMgm));
    this.contractForm.markAsDirty();
  }

  genEmployee() {
    // for Selected to filter
    for (const item of this.attributeSelected) {
      //CheckDuplicate
      if (!this.checkDuplicateEmployee(item)) {
        // Gen
        this.ContractMgmEmployee.push(
          this.createContractMgmEmployeeForm(
            item as ContractMgmEmployee
          ));
      }
    }
    this.attributeSelected = [];
    this.closeMgmEmployeeModal(true);
  }

  genMgm() {
    for (const item of this.attributeSelected) {
      //CheckDuplicate
      if (!this.checkDuplicateMgm(item)) {
        // Gen
        this.ContractMgm.push(
          this.createContractMgmForm(
            item as ContractMgm
          ));
      }
    }

    this.attributeSelected = [];
    this.closeMgmModal(true);
  }

  removeRowEmployee(index) {
    const rows = [...this.ContractMgmEmployee.getRawValue()];
    rows.splice(index, 1);

    this.ContractMgmEmployee.patchValue(rows, { emitEvent: false });
    this.ContractMgmEmployee.removeAt(this.ContractMgmEmployee.length - 1);
    this.contractForm.markAsDirty();
  }

  removeRowMgm(index) {
    const rows = [...this.ContractMgm.getRawValue()];
    rows.splice(index, 1);

    this.ContractMgm.patchValue(rows, { emitEvent: false });
    this.ContractMgm.removeAt(this.ContractMgm.length - 1);
    this.contractForm.markAsDirty();
  }

  checkDuplicateEmployee(result) {
    for (const form of this.ContractMgmEmployee.getRawValue()) {
      if (form.CompanyCode === result.CompanyCode && form.EmployeeCode === result.EmployeeCode) {
        return true;
      }
    }
  }

  checkDuplicateMgm(result) {
    for (const form of this.ContractMgm.getRawValue()) {
      if (form.MgmCode === result.MgmCode) {
        return true;
      }
    }
  }

  get ContractMgmEmployee(): FormArray {
    return this.contractForm.get('ContractMgmEmployee') as FormArray;
  }

  get ContractMgm(): FormArray {
    return this.contractForm.get('ContractMgm') as FormArray;
  }

  openAddMgmEmployeeModal() {
    this.searchEmployeeModal();
    this.popupEmployee = this.modal.open(this.tplAddEmployeeModal, Size.large);
  }

  closeMgmEmployeeModal(flag) {
    if (flag) {
      this.popupEmployee.hide();
    }
  }

  validateEmployee() {
    let seen = new Set();
    let notRow = this.ContractMgmEmployee.getRawValue().some(function (item) {
      seen.add(item.EmployeeCode.toLowerCase()).size;
      return seen.size > 0 ? true : false;
    });
    return notRow;
  }

  // ------MGM-----
  onTableMgmEvent(event) {
    this.page = event;
    this.searchMgmModal();
  }

  searchMgmModal() {
    if (this.searchMgmForm.controls['MgmCode'].value) {
      this.searchMgmForm.controls['MgmCode'].setValue(this.searchMgmForm.controls['MgmCode'].value.trim());
    }

    if (this.searchMgmForm.controls['CustomerCode'].value) {
      this.searchMgmForm.controls['CustomerCode'].setValue(this.searchMgmForm.controls['CustomerCode'].value.trim());
    }

    if (this.searchMgmForm.controls['MgmName'].value) {
      this.searchMgmForm.controls['MgmName'].setValue(this.searchMgmForm.controls['MgmName'].value.trim());
    }

    this.lots04Service.getMgmTable(this.contractForm.controls.CustomerCode.value, this.searchMgmForm.value, this.pageMgm)
      .pipe(finalize(() => {
        this.attributeSelected = [];
      }))
      .subscribe(
        (res) => {
          this.getMgmList = res.Rows;
          this.pageMgm.totalElements = res.Total;
        }
      )
  }

  openAddMgmModal() {
    this.searchMgmModal();
    this.popupEmployee = this.modal.open(this.tplAddMgmModal, Size.large);
  }

  closeMgmModal(flag) {
    if (flag) {
      this.popupEmployee.hide();
    }
  }

  checkMainAmountSecruritiesKeyup(): void {
    this.subject.next();
  }

  // เช็คว่าลูกค้าคนนี้ติดสัญญาเตรียมรีไฟแนนซ์อยู่หรือปล่าว ?
  checkContractRefinanceByCustomer(customerCode) {
    if (customerCode) {
      this.lots04Service.checkContractRefinanceByCustomer({
        CustomerCode: customerCode
      }).subscribe(
        (res: boolean) => {
          this.isCustomerRefinance = res;
        }
      )
    }
  }

  onChange() {
    let a = this.contractInformations.getRawValue().filter(x => x.Active);
    if (a.filter(x => x.InformationId == 13).length > 0) {
      this.addOn = true;
      this.contractForm.controls.AddOn.enable();
    } else {
      this.addOn = false;
      this.contractForm.controls.AddOn.disable({ emitEvent: false });

    }
  }

  customerDetailOutput(customerDetail) {
    if (customerDetail != undefined) {
      if (customerDetail.FlagContract) {
        this.as.warning('', 'ลูกค้า 1 คนสามารถเป็นผู้กู้หลักได้แค่สัญญาเดียว');
        return;
      }
      this.contractForm.controls.CustomerCode.setValue(customerDetail.CustomerCode);
      this.filterSecuritiesCategories(customerDetail.CustomerCode);
      this.filterContractReFinance(customerDetail.CustomerCode);
      this.checkMaxLoanAmountByCustomer(customerDetail.CustomerCode);

      this.mainDebtAmount = customerDetail.DebtAmount;
      this.P36U = customerDetail.P36U;
      this.P28U = customerDetail.P28U;
      this.L15U = customerDetail.L15U;
      this.CustomerAge = customerDetail.Age;
      this.MortgageOnly = customerDetail.MortgageOnly;
    }
  }

  chkMainLoanPrincipleAmount() {
    if (!this.IsCompanyCapital && this.ContractType != '2') {
      if (this.contractForm.controls.CategoryId.value == 3 && this.contractForm.controls.MainLoanPrincipleAmount.value % 100 === 0) {
        return false;
      } else if (this.contractForm.controls.MainLoanPrincipleAmount.value % 1000 === 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  checkBorrowersRefinance() {
    const duplicate = this.contractBorrowers.getRawValue().some((row1) => {
      return this.refinanceBorrowers.some((row2) => {
        return row1.CustomerCode === row2.CustomerCode
      });
    });
    return duplicate;
  }

  // เช็คยอดภาระหนี้ผู้กู้(รีไฟแนนซ์)
  checkMainDebtAmountCustomer(customerCode) {
    if (customerCode) {
      this.lots04Service.checkMainDebtAmountCustomer({
        CustomerCode: customerCode
      }).subscribe(
        (res: any) => {
          this.mainDebtAmount = res.DebtAmount;
          this.P36U = res.P36U;
          this.P28U = res.P28U;
          this.L15U = res.L15U;
          this.CustomerAge = res.Age;
        }
      )
    }
  }

  checkCustomerCount(customerCode) {
    this.lots04Service.checkCustomerCount(customerCode).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res) => {
        if (res == 0) {
          this.contractForm.controls.MGMCheckbox.enable({ emitEvent: false });
        } else {
          this.contractForm.controls.MGMCheckbox.setValue(false, { emitEvent: false });
          this.contractForm.controls.MGMCheckbox.disable({ emitEvent: false });
        }

      });
  }

  onChangeLoanContractType(typeAmount) {
    this.contractForm.controls.LoanTypeCode.setValue(null, { emitEvent: false });
    if (this.contractSecuritiess.value.length == 0) {
      this.LoanContractType = null;
      this.as.warning('', 'กรุณาเลือกหลักทรัพย์ค้ำประกัน');
      return;
    }

    if (this.contractForm.controls.CategoryId.value == null) {
      this.LoanContractType = null;
      this.as.warning('', 'กรุณาระบุประเภทหลักทรัพย์');
      return;
    }

    this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
    this.contractForm.controls.ReqTotalPeriod.setValue(null);
    this.contractForm.controls.MainLoanPrincipleAmount.enable({ emitEvent: false });

    // if (this.LoanContractType == '1') {
    //   this.contractForm.controls.TotalAmount.setValue(this.typeAmount1);
    // } else if (this.LoanContractType == '2') {
    //   this.contractForm.controls.TotalAmount.setValue(this.typeAmount2);
    // } else if (this.LoanContractType == '3') {
    //   this.contractForm.controls.TotalAmount.setValue(this.typeAmount3);
    // } else if (this.LoanContractType == '4') {
    //   this.contractForm.controls.TotalAmount.setValue(this.typeAmount4);
    // } else if (this.LoanContractType == '5') {
    //   this.contractForm.controls.TotalAmount.setValue(this.typeAmount5);
    // }

    this.loanTypeData = [];

    if (typeAmount && typeAmount > 0) {
      this.contractForm.controls.TotalAmount.setValue(typeAmount);
      this.filterLoanType();
    } else {
      this.contractForm.controls.TotalAmount.setValue(0);
    }
  }

  filterLoanType() {
    this.lots04Service.getLoanType(this.contractForm.controls.CategoryId.value, this.contractForm.controls.CustomerCode.value, this.contractForm.controls.CompanyCode.value, this.closeRefinance, this.compose, this.LoanContractType, this.securitiesMatched, this.contractForm.controls.TypeOfPay.value, this.MortgageOnly, this.refinanceType, this.refinanceAmount, this.securitiesUnmatched).subscribe(
      (res) => {
        this.loanTypeData = res.loanTypes;
        const detail = this.contractHead;
        if (detail.LoanTypeCode) {
          this.loanTypeData = this.selectFilter.FilterActiveByValue(this.loanTypeData, detail.LoanTypeCode);
        }
        else {
          this.loanTypeData = this.selectFilter.FilterActive(this.loanTypeData);
        }
        this.selectFilter.SortByLang(this.loanTypeData);
        this.loanTypeData = [...this.loanTypeData];

        if (this.isRefinance && this.refinanceData != null) {
          var loanTypeMatch = res.loanTypes.filter(x => x.Value == this.refinanceData.LoanTypeCode);
          if (loanTypeMatch.length > 0) {
            this.contractForm.controls.LoanTypeCode.setValue(this.refinanceData.LoanTypeCode);
          }
          this.MainOldContractLoanPrincipleAmount = this.refinanceData.MainLoanPrincipleAmount;
          this.contractForm.controls.MainLoanPrincipleAmount.setValue(this.refinanceData.MainLoanPrincipleAmount);
          this.contractForm.controls.CloseRefinanceAmount.setValue(this.refinanceData.MainLoanPrincipleAmount);

          if (!this.IsCompanyCapital) {
            if (this.contractForm.controls.CategoryId.value == 3) {
              this.refinanceAmtMod1000 = numeral(this.MainOldContractLoanPrincipleAmount).add(numeral(100).subtract(this.MainOldContractLoanPrincipleAmount % 100).value()).value();
            } else {
              this.refinanceAmtMod1000 = numeral(this.MainOldContractLoanPrincipleAmount).add(numeral(1000).subtract(this.MainOldContractLoanPrincipleAmount % 1000).value()).value();
            }
          }

          if (this.refinanceData.ContractBorrowerRefinance.length > 0) {
            this.refinanceBorrowers = this.refinanceData.ContractBorrowerRefinance;

            let totalMainLoanAmount = 0;
            let amountLeft = 0;

            if (this.MaxLoanAmount) {
              totalMainLoanAmount = this.MaxLoanAmount - this.mainDebtAmount;
            } else {
              totalMainLoanAmount = 0;
            }

            if (this.contractForm.controls.ContractType.value == 'M' && this.contractForm.controls.MainLoanPrincipleAmount.value > totalMainLoanAmount) {
              amountLeft = this.contractForm.controls.MainLoanPrincipleAmount.value - totalMainLoanAmount;
            } else {
              amountLeft = 0;
            }

            this.refinanceData.ContractBorrowerRefinance.forEach(element => {
              if (this.maxLoanLimitAmount) {
                let data = this.maxLoanLimitAmount - element.DebtAmount;
                if (data >= this.maxLoanLimitAmount) {
                  if (amountLeft >= this.maxLoanLimitAmount) {
                    element.LoanAmount = this.maxLoanLimitAmount;

                    // หัก ยอดเงินที่กู้ออกจากยอดกู้ของผู้กู้ร่วม
                    amountLeft = amountLeft - this.maxLoanLimitAmount;
                  } else {

                    element.LoanAmount = amountLeft;

                    // หัก ยอดเงินที่กู้ออกจากยอดกู้ของผู้กู้ร่วม
                    amountLeft = amountLeft - amountLeft;
                  }
                } else {
                  if (data < amountLeft) {
                    element.LoanAmount = data
                  } else {
                    element.LoanAmount = amountLeft
                  }
                }
              }

              if (!this.contractBorrowers.getRawValue().some((item) => item.CustomerCode == element.CustomerCode)) {
                this.contractBorrowers.push(this.contractBorrowersForm(element));
                this.contractBorrowers.markAsDirty();
              }
            });
          }

          this.checkMainAmountSecrurities();
        }
      })
  }

  getMaxLoanAmount() {
    if (this.contractForm.controls.CategoryId.value) {
      this.lots04Service.getMaxLoanAmount(this.contractForm.controls.CategoryId.value, this.contractForm.controls.CustomerCode.value, this.contractForm.controls.CompanyCode.value, this.closeRefinance, this.compose, this.LoanContractType, this.securitiesMatched, this.contractForm.controls.TypeOfPay.value, this.MortgageOnly, this.refinanceType, this.refinanceAmount, this.securitiesUnmatched).subscribe(
        (res) => {
          this.typeAmount1 = res.Type1;
          this.typeAmount2 = res.Type2;
          this.typeAmount3 = res.Type3;
          this.typeAmount4 = res.Type4;
          this.typeAmount5 = res.Type5;
        })
    } else {
      this.typeAmount1 = 0;
      this.typeAmount2 = 0;
      this.typeAmount3 = 0;
      this.typeAmount4 = 0;
      this.typeAmount5 = 0;
    }
  }
}
