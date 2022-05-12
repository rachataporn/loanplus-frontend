import { Component, OnInit, ViewChild, TemplateRef, Version } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots25Service, ContractInformation, ContractHead, ContractBorrower, ContractSecurities, ContractItem, ContractGuarantor, ContractPeriod, ContractMgmEmployee, ContractMgm, ContractNoti, ContractAttachment, LoContractHead, LoContractBorrower, LoContractItem } from '@app/feature/lo/lots25/lots25.service';
import { Page, ModalService, RowState, SelectFilterService, Size, ModalRef, ImageFile } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lots25CustomerLookupComponent } from './customer-lookup.component';
import { Observable, Subject } from 'rxjs';
import { switchMap, debounceTime, tap, timeout, takeUntil, takeWhile } from 'rxjs/operators';
import * as numeral from 'numeral';
import { Lots25MainContractLookupComponent } from './main-contract-lookup.component';
import { Borrower25LookupComponent } from './borrower-lookup.component';
import value from '*.json';
import { ImageDisplayService } from '@app/shared/image/image-display.service';
import { LoadingService } from '@app/core/loading.service';
import { endOf } from 'ngx-bootstrap/chronos/utils/start-end-of';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category } from '@app/shared/service/configuration.service';
import { copyStyles } from '@angular/animations/browser/src/util';


@Component({
  templateUrl: './lots25-detail.component.html',
  styleUrls: ['./lots25-detail.component.scss'],
})

export class Lots25DetailComponent implements OnInit {
  @ViewChild('addMgmModal') tplAddMgmModal: TemplateRef<any>;
  @ViewChild('addEmployeeModal') tplAddEmployeeModal: TemplateRef<any>;
  @ViewChild('addNotiModal') tplAddNotiModal: TemplateRef<any>;
  @ViewChild('alertSaveModal') tplAlertSaveModal: TemplateRef<any>;
  status = 1;
  contractMgmEmployee = {} as ContractMgmEmployee;
  category = Category.Financial;
  mainContract = {} as ContractHead;
  contractHead = {} as ContractHead;
  loContractHead = {} as LoContractHead;
  attachmentFiles: Attachment[] = [];
  imageFile: ImageFile = new ImageFile();
  contractForm: FormGroup;
  loContractForm: FormGroup;
  searchEmpForm: FormGroup;
  searchMgmForm: FormGroup;
  searchNotiForm: FormGroup;
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
  CompanyList = [];
  customerslist = [];
  companyCode: string;
  CustomersAddress = [];
  MainContractLookupContent = Lots25MainContractLookupComponent;
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
  refinanceBorrowers = [];
  closeRefinance: boolean = false;
  categoryId: any;
  isRefinance: boolean = false;
  refinanceData: any;
  typeOfPay = [{ Value: '1', Text: 'ส่งเป็นงวด' }, { Value: '2', Text: 'ส่งแต่ดอกเบี้ย' }]
  typeAmount1: string;
  typeAmount2: string;
  typeAmount3: string;
  typeAmount4: string;
  typeAmount5: string;
  MortgageOnly: boolean = false;
  compose: boolean = false;
  mainLoanComposeMsg: boolean = false;
  mainLoanUnmatchLoanTypeMsg: boolean = false;

  flagAddMgmEmployee: boolean = false;
  page = new Page();
  pageMgm = new Page();
  pageEmployee = new Page();

  popupEmployee: ModalRef;
  popupNoti: ModalRef;
  popupSaveAlert: ModalRef;
  getEmployeeList = [];
  getMgmList = [];
  attributeSelected = [];
  ContractMgmEmployeeDeleting = [];
  ContractMgmDeleting = [];
  ContractNotiDeleting = [];
  ContractSecuritiesDeleting = [];

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
  OverLimitedLoanAmount = false;
  checkStatus = '';
  processing = false;

  CustomerLookupContent = Lots25CustomerLookupComponent;

  loanTypeExitSecurities: string;

  refinanceAmtMod1000: number = 0;

  requestReview: string;
  requestReviewText: string;
  loading: boolean = false;
  normalSaving : boolean = false;
  RoundInterestAmount = 0;
  mainLoanPeriodAmountComposeMsg: boolean = false;
  employeeIdCard: string;
  paymentId: string;
  LoanContractType = null;
  refinanceType: string;

  
  filterCustomerAddressCompany: [];
  CustomerAddressCompany= [];
  CustomerAddressCompanyTemp= {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    private lots04Service: Lots25Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private selectFilter: SelectFilterService,
    private ls: LoadingService,

  ) {
    this.createForm();
  }


  clickStepper(status) {
    if (!this.chkNextStep(this.status)) {//ต้องแก้คืน !this.chkNextStep(this.status)
      return;
    }
    window.scrollTo(0, 0);
    this.status = status;
  }

  onPrevious() {
    if (!this.chkNextStep(this.status)) {
      return;
    }
    
    if(this.status==2){
      this.clearPeriod();
    }

    window.scrollTo(0, 0);
    this.status = this.status - 1;

    if (this.status != 2) {
      this.contractForm.controls.MainLoanPrincipleAmount.enable({ emitEvent: false });
    }
  }

  onNext() {
    // console.log(" onNext() ")
    // console.log(this.status)
    // console.log(" chk result "+!this.chkNextStep(this.status))
    if(this.contractHead.RequestStatus != 'Y'){
      if (!this.chkNextStep(this.status)) {
        return;
      }
  
      if (this.contractForm.controls.MGMCheckbox.value) {
        if (!this.validateEmployee()) {
          this.as.warning('', 'Message.STD00012', ['MGM พนักงาน']);
          return;
        }
        if (this.contractForm.controls.Activity.invalid) {
          this.as.warning('', 'MGM  กรุณาระบุกิจกรรม', );
          return;
        }
      }


    }
   

    window.scrollTo(0, 0);
    this.status = this.status + 1;

    // if (this.status == 2) {
    //   console.log(" if (this.status == 2)  ")
    //   this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });
    //   this.processPeriod();
    // }
    if (this.status == 2) {
      this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });
      console.log(" ===================================:- : ",this.ContractType)
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

      if(!this.checkDisableContractStatus()){
        
          // if(this.contractForm.controls.CustomerName.invalid) console.log(" this.contractForm.controls.CustomerName.invalid ");
          // if(this.contractForm.controls.LoanTypeCode.invalid) console.log(" this.contractForm.controls.LoanTypeCode.invalid ");
          // if(this.contractForm.controls.LoanObjective.invalid) console.log(" this.contractForm.controls.LoanObjective.invalid ");
          // if(this.contractForm.controls.PayType.invalid) console.log(" this.contractForm.controls.PayType.invalid ");
          // console.log(" ReqLoanAmount invalid is : "+this.contractForm.controls.ReqLoanAmount.invalid);
          // if(this.contractForm.controls.ReqLoanAmount.invalid) console.log(" this.contractForm.controls.ReqLoanAmount.invalid ");
          // console.log(" after check ReqLoanAmount : "+this.contractForm.controls.ReqLoanAmount.value);
          // if(this.contractForm.controls.TotalAmount.invalid) console.log(" this.contractForm.controls.TotalAmount.invalid ");
          // if(this.contractForm.controls.ReqTotalPeriod.invalid) console.log(" this.contractForm.controls.ReqTotalPeriod.invalid ");
          // if(this.contractForm.controls.ReqGapPeriod.invalid) console.log(" this.contractForm.controls.ReqGapPeriod.invalid ");
          // if(this.contractForm.controls.AddOn.invalid) console.log(" this.contractForm.controls.AddOn.invalid ");
          // if(this.contractForm.controls.ReqTotalMonth.invalid) console.log(" this.contractForm.controls.ReqTotalMonth.invalid ");


          if (this.contractForm.controls.ContractType.invalid
            || this.contractForm.controls.MainContractNo.invalid
            || this.contractForm.controls.MainLoanPrincipleAmount.invalid
            || this.contractForm.controls.ContractDate.invalid
            || this.contractForm.controls.CompanyCode.invalid
            || this.contractForm.controls.defaultCompany.invalid
            || this.contractForm.controls.CustomerName.invalid
            || this.contractForm.controls.LoanTypeCode.invalid
            || this.contractForm.controls.LoanObjective.invalid
            || this.contractForm.controls.PayType.invalid
            //|| this.contractForm.controls.ReqLoanAmount.invalid
            || this.contractForm.controls.TotalAmount.invalid
            || this.contractForm.controls.ReqTotalPeriod.invalid
            || this.contractForm.controls.ReqGapPeriod.invalid
            || this.contractForm.controls.AddOn.invalid
            || this.contractForm.controls.ReqTotalMonth.invalid) {
              //console.log(" have ploblam ")
            this.focusToggle = !this.focusToggle;
            this.nextStep = false;
          }

          //console.log(" after if1: "+this.nextStep)

          this.checkMaxLoanAmountByCustomer(this.contractForm.controls.CustomerCode.value)

          var activeInoformation = this.contractInformations.getRawValue().filter(x => x.Active);
          if (activeInoformation.length == 0 && !this.contractForm.controls.MGMCheckbox.value) {
            //console.log(" activeInoformation.length == 0 && !this.contractForm.controls.MGMCheckbox.value ");
            this.as.warning('', 'Message.STD00012', ['Label.LOTS04.informationCard']);
            this.nextStep = false;
          }

          //console.log(" after activeInoformation: "+this.nextStep)

          if (this.IsNeedBorrower) {
            //console.log(" this.IsNeedBorrower ");
            if (this.contractBorrowers.value.length === 0) {
              this.as.warning('', 'Message.STD00012', ['Label.LOTS04.GurranteeCode']);
              this.nextStep = false;
            }
          }
          //console.log(" after IsNeedBorrower: "+this.nextStep)

          if (this.IsAgeOverSixty) {
            //console.log(" this.IsAgeOverSixty ");
            var hasBorrower2Oversixty = this.contractBorrowers.getRawValue().some(function (item) {
              return item.Age < 60;
            });

            // let cus = this.customerslist.find(o => { return o.Value == this.contractForm.controls.CustomerCode.value });
            // if (cus) {
            if (this.CustomerAge > 60 && !hasBorrower2Oversixty) {
              //console.log(" this.CustomerAge > 60 && !hasBorrower2Oversixty ");
              this.as.warning('', 'Message.LO00057');
              this.nextStep = false;
            }
            // }
          }

          //console.log(" after IsAgeOverSixty: "+this.nextStep)

          if (this.contractForm.controls.MainLoanPrincipleAmount.value > this.LoanTypeMax) {
            //console.log(" this.contractForm.controls.MainLoanPrincipleAmount.value > this.LoanTypeMax ");
            this.as.warning('', 'Message.LO00061');
            this.nextStep = false;
          }

          //console.log(" after MainLoanPrincipleAmount: "+this.nextStep)


          //console.log(" ContractType  : "+this.ContractType);
          //console.log(" mainDebtAmount  : "+this.mainDebtAmount);
          //console.log(" maxLoanLimitAmount  : "+this.maxLoanLimitAmount);
          if (this.ContractType == '1' && this.mainDebtAmount > this.maxLoanLimitAmount) {
            //console.log(" this.ContractType == '1' && this.mainDebtAmount > this.maxLoanLimitAmount ");
            this.as.warning('', 'Message.LO00007');
            this.nextStep = false;
          }

          //console.log(" after this.ContractType == '1' : "+this.nextStep)

          if (this.chkRegLoanAmountForGenerate()) {
            //console.log(" this.chkRegLoanAmountForGenerate() ");
            this.as.warning('', 'Message.LO00021');
            this.nextStep = false;
          }

          //console.log(" after chkRegLoanAmountForGenerate : "+this.nextStep)
          //console.log(" this.AmountForBorrowers : "+this.AmountForBorrowers);
          if (this.summaryTotalLoanAmount() !== this.AmountForBorrowers) {
            //console.log(" this.summaryTotalLoanAmount() !== this.AmountForBorrowers ");
            this.as.warning('', 'Message.LO00022');
            this.nextStep = false;
          }

          //console.log(" after summaryTotalLoanAmount : "+this.nextStep)

          // if (this.GuaranteeAssetYN) {
          if (this.contractSecuritiess.value.length === 0 && this.contractForm.controls.LoanTypeCode.value != this.loanTypeExitSecurities) {
            //console.log(" this.contractSecuritiess.value.length === 0 && this.contractForm.controls.LoanTypeCode.value != this.loanTypeExitSecurities ");
            this.as.warning('', 'Message.STD00012', ['Label.LOTS04.customerSecuritiesCard']);
            this.nextStep = false;
          }

          //console.log(" after contractSecuritiess : "+this.nextStep)
          // }

          // this.checkMaxLoanAmount(this.contractForm.controls.ReqLoanAmount.value, this.contractForm.controls.TotalAmount.value)

          // if (this.checkMainLoanAmout(this.contractForm.controls.MainLoanPrincipleAmount.value,
          //   this.contractForm.controls.ReqLoanAmount.value)) {
          //   this.as.warning('', 'Message.LO00009');
          //   this.nextStep = false;
          // }

          if (this.contractBorrowers.value.length > this.maximumLoaner) {
            //console.log(" this.contractBorrowers.value.length > this.maximumLoaner ");
            this.as.warning('', 'Message.LO00002', ['Label.LOTS04.CustomerCodeBorrower']);
            return;
          }

          if (this.chkDupContractBorrowers()) {
            //console.log(" this.chkDupContractBorrowers() ");
            this.as.error("", "Message.STD00004", ["Label.LOTS04.CustomerCodeBorrower"]);
            this.nextStep = false;
          }

          //console.log(" after chkDupContractBorrowers : "+this.nextStep)

          if (this.chkDupContractSecurities()) {
            //console.log(" this.chkDupContractSecurities() ");
            this.as.error("", "Message.STD00004", ["Label.LOTS04.customerSecurities"]);
            this.nextStep = false;
          }
          
          //console.log(" after chkDupContractSecurities : "+this.nextStep)


          if (this.chkDupIncomeItems()) {
            //console.log(" this.chkDupIncomeItems() ");
            this.as.error("", "Message.STD00004", ["Label.LOTS04.income"]);
            this.nextStep = false;
          }

          //console.log(" after chkDupIncomeItems : "+this.nextStep)

          if (this.chkDupPaymentItem()) {
            //console.log(" this.chkDupPaymentItem() ");
            this.as.error("", "Message.STD00004", ["Label.LOTS04.cost"]);
            this.nextStep = false;
          }

          //console.log(" after chkDupPaymentItem : "+this.nextStep)

          this.checkMainAmountSecrurities();

          if (this.mainCusLoanMsg) {
            //console.log(" this.mainCusLoanMsg ");
            this.as.warning('', 'Message.LO00058');
            this.nextStep = false;
          }

          //console.log(" after mainCusLoanMsg : "+this.nextStep)

          if (this.mainLoanMsg) {
            //console.log(" this.mainLoanMsg ");
            this.as.warning('', 'Message.LO00008'); //test
            this.nextStep = false;
          }

          //console.log(" after mainLoanMsg : "+this.nextStep)


          if (this.overLoanTypeMax) {
            //console.log(" this.overLoanTypeMax ");
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

          //console.log(" after overLoanTypeMax : "+this.nextStep)

          if (this.mainLoanRefinanceMsg) {
            //console.log(" this.mainLoanRefinanceMsg ");
            this.as.warning('', 'Message.LO00060');
            this.nextStep = false;
          }

          //console.log(" after mainLoanRefinanceMsg : "+this.nextStep)

          if (this.mainLoanRefinanceAdditionalMsg) {
            console.log(" this.mainLoanRefinanceAdditionalMsg ");
            this.as.warning('', 'Message.LO00062', [this.refinanceAmtMod1000.toString()]);
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

          //console.log(" after mainLoanRefinanceAdditionalMsg : "+this.nextStep)

          if (this.chkMainLoanPrincipleAmount()) {
            //console.log(" this.chkMainLoanPrincipleAmount() ");
            if (this.contractForm.controls.CategoryId.value == 3) {
              //console.log(" this.contractForm.controls.CategoryId.value == 3 ");
              this.as.warning('', 'Message.LO00067');
            } else {
              //console.log(" else this.contractForm.controls.CategoryId.value == 3 ");
              this.as.warning('', 'Message.LO00066');
            }
            this.nextStep = false;
          }

          //console.log(" after chkMainLoanPrincipleAmount : "+this.nextStep)
          if (this.mainLoanUnmatchLoanTypeMsg) {
            this.as.warning('', 'ยอดเงินกู้ ไม่ตรงตามประเภทสัญญา');
            this.nextStep = false;
          }
      }


    } else if (statusValue === 2) {
      if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
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

          if (this.contractPeriods.value.length === 0) {
            this.as.warning('', 'Message.STD00012', ['Label.LOTS04.preriodCard']);
            this.nextStep = false;
          }

          if (this.checkLoanAmountAllContract()) {
            this.as.warning('', 'Message.LO00010');
            this.nextStep = false;
          }

          if (this.contractForm.controls.ReqLoanAmount.value != this.contractForm.controls.AppLoanPrincipleAmount.value) {
            this.as.warning('', 'Message.LO00010');
            this.nextStep = false;
          }
        }
    }
    return this.nextStep;
  }


  createForm() {
    this.contractForm = this.fb.group({
      CustomerCode: [null, Validators.required],
      CustomerName: [{ value: null, disabled: true }],
      CustomerNameTha: [{ value: null, disabled: true }],
      CustomerNameEng: [{ value: null, disabled: true }],
      RequestNumber: [{ value: null, disabled: true }],
      CategoryId: [{ value: null, disabled: true }],
      ContractType: ['M', Validators.required],
      MainContractNo: [{ value: null, disabled: true }, Validators.required],
      MainLoanPrincipleAmount: [{ value: null, disabled: false }, Validators.required],
      TotalAllContractAmount: [{ value: null, disabled: true }],
      ContractNo: null,
      ContractDate: [{ value: null, disabled: true }, Validators.required],
      CompanyCode: null,
      CompanyNameTha: [{ value: null, disabled: true }],
      CompanyNameEng: [{ value: null, disabled: true }],
      ContractStatusTha: null,
      ContractStatusEng: null,
      LoanTypeCode: [null, Validators.required],
      LoanObjective: [null, Validators.required],
      branchCompanyNameTha: [{ value: null, disabled: true }],
      branchCompanyNameEng: [{ value: null, disabled: true }],

      PayType: [{ value: null, disabled: true }, Validators.required],
      ReqLoanAmount: null,
      //ReqLoanAmount: [null, [Validators.required, Validators.min(1)]],
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
      CustomerAccountNo: null,
      CustomerAccountName: null,
      CustomerBankCode: null,
      CustomerBranchName: null,
      CustomerBankAccountTypeCode: null,
      CustomerAccountAuto: null,
      // ReceiveTypeCode:null,
      // ReceiveCompanyAccountId:null,
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

      contractBorrowers: this.fb.array([]),
      contractSecuritiess: this.fb.array([]),
      contractItems: this.fb.array([]),
      contractIncomeItems: this.fb.array([]),
      contractPaymentItems: this.fb.array([]),
      contractInformations: this.fb.array([]),
      contractPeriods: this.fb.array([]),
      ContractMgmEmployee: this.fb.array([]),
      ContractMgm: this.fb.array([]),
      contractNotis: this.fb.array([]),
      addNotiDescription: null,
      AddNotiDesc: null,
      contractAttachments: this.fb.array([]),
      PromtPlayCheckbox: false,
      PromtPlayNumber: null,
      BankCheckbox: false,
      defaultCompany: [null, Validators.required],
      RequestReview: null,
      reqType: null,
      RequestReviewText: null,
      DocumentTypeCode: null,
      DocumentSubTypeCode: null,
      DocSource: null,
      TypeOfPay: '1',
    });

    this.loContractForm = this.fb.group({
      ContractBorrower: this.fb.array([]),
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

    this.searchNotiForm = this.fb.group({
      NotiDesc: null,
      NotiDate: null,
      //CustomerCode: null
    });

    this.contractForm.controls.CompanyCode.valueChanges.subscribe(
      (val) => {
        ////console.log(" into  CompanyCode.valueChanges ",val)
        if (val) {
          //////console.log(" into  val have value ")
          // console.log(" Start this.company ")
          // console.log(this.company)
          // console.log(" End this.company ")
          let data = this.company.find(o => {
            //////console.log(" o.Value = ",o.Value)
            //////console.log(" val = ",val)
            return o.Value == val
          }) || {};
          ////console.log(" Start data ")
          ////console.log(data)
          ////console.log(" End data ")
          this.contractForm.controls.CompanyNameTha.setValue(data.TextTha);
          this.contractForm.controls.CompanyNameEng.setValue(data.TextEng);
          ////console.log(" this.contractForm.controls.CompanyNameTha = ",this.contractForm.controls.CompanyNameTha.value)
          ////console.log(" this.contractForm.controls.CompanyNameEng = ",this.contractForm.controls.CompanyNameEng.value)
          this.filterPaymentCompanyAccount(true);
          let paymentid = this.paymentCompanyAccount.find(o => {
            ////console.log(" o.CompanyCode = ",o.CompanyCode)
            ////console.log(" data.MainCompany = ",data.MainCompany)
            return o.CompanyCode == '999S'
            // return o.CompanyCode == data.MainCompany
          }) || {};
          console.log(" Start paymentid ")
          console.log(paymentid)
          console.log(" End paymentid ")
          //this.paymentId = paymentid.Value;
          this.contractForm.controls.PaymentCompanyAccountId.setValue(paymentid.Value);
          ////console.log(" this.contractForm.controls.PaymentCompanyAccountId = ",this.contractForm.controls.PaymentCompanyAccountId.value)
        }
      }
    )

    this.contractForm.controls.CustomerNameTha.valueChanges.subscribe(
         (val) => {
           if(val){
            //this.checkMaxLoanAmountByCustomer(val);
            this.lots04Service.getCutomerLookup(Object.assign({ keyword: this.contractForm.controls.CustomerCode.value }), this.page)
            .pipe(finalize(() => {   }))
            .subscribe(
                (res) => {
                    //this.customers = res.Rows;
                    //console.log(" res after CustomerCode ")
                    //console.log(res)
                    if(res.Rows.length>0){
                        this.customerDetailOutput(res.Rows[0])
                    }else{
                      //console.log(" not have return data.");
                    }
                   
                });
           }

         }
    )

    this.contractForm.controls.CustomerCode.valueChanges.subscribe(
      (val) => {
    
        this.contractForm.controls.CustomerReceiveTypeCode.setValue(this.tranfersType);

    
      }
    )

    // this.contractForm.controls.MainLoanPrincipleAmount.valueChanges.subscribe(
    //   (val) => {
    //     if (val) {
    //       if (this.ContractType == '0' || this.ContractType == '2' || this.ContractType == '3' || this.ContractType == '4') {
    //         this.contractForm.controls.ReqLoanAmount.setValue(val);
    //       }else {
    //         let data = this.maxLoanLimitAmount - this.mainDebtAmount
    //         if (data >= this.maxLoanAmount) {
    //           if (val >= this.maxLoanAmount) {
    //             this.contractForm.controls.ReqLoanAmount.setValue(this.maxLoanAmount);
    //           } else {
    //             this.contractForm.controls.ReqLoanAmount.setValue(val);
    //           }
    //         } else {
    //           if (data < val) {
    //             this.contractForm.controls.ReqLoanAmount.setValue(data);
    //           } else {
    //             this.contractForm.controls.ReqLoanAmount.setValue(val);
    //           }
    //         }
    //       }
    //       let AppFeeAmount3 = val * (this.MortgageFee / 100)
    //       if (AppFeeAmount3 > 0)
    //         this.contractForm.controls.AppFeeAmount3.setValue(AppFeeAmount3, { emitEvent: false })
    //     } else {
    //       this.contractForm.controls.ReqLoanAmount.setValue(null);
    //       this.contractForm.controls.AppFeeRate3.setValue(null, { emitEvent: false })
    //       this.contractForm.controls.AppFeeAmount3.setValue(null, { emitEvent: false })
    //     }
    //   }
    // )

    this.contractForm.controls.defaultCompany.valueChanges.subscribe(
      (val) => {
          //console.log(" defaultCompany.valueChanges : "+val);
          let newCompanyCode = val;
          //console.log(" newCompanyCode : "+newCompanyCode);
          this.contractForm.controls.CompanyCode.setValue(newCompanyCode);
          this.getMaxLoanAmount("defaultCompany-valueChanges");
          //this.filterLoanType(this.contractForm.controls.CategoryId.value, false, null, "defaultCompany  valueChanges");
      }
    );

    this.contractForm.controls.MainLoanPrincipleAmount.valueChanges.subscribe(
      (val) => {
        console.log(" into MainLoanPrincipleAmount : val : "+ val);
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
            this.contractForm.setControl('contractInformations', this.fb.array(this.contractHead.ContractInformation.map((detail) => this.contractInformationsForm(detail))))
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
          console.log(" find loanTypeCode ");
          console.log(val)
          console.log(this.loanTypeData)
                                                             //ยอดกู้ มากกว่า LoanMinimumAmount      ยอดกู้น้อยกว่ายอดจำกัด
          var loanTypeDataResult = this.loanTypeData.find(data => val >= data.LoanMinimumAmount && val <= data.LoanLimitAmount);

          if (loanTypeDataResult) {
            console.log(" set loanTypeCode ");
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

    // this.contractForm.controls.LoanTypeCode.valueChanges.subscribe(
    //   (val) => {
    //     //console.log(this.loanTypeData)
    //     //console.log(" into  LoanTypeCode.valueChanges ", val)
    //     if (val) {
    //       // console.log(" start show this.loanTypeData ")
    //       // console.log(this.loanTypeData)
    //       // console.log(" end show this.loanTypeData ")
    //       let type = this.loanTypeData.find(o => { return o.Value == val }) || {};
    //       // console.log(" ================= start type ")
    //       // console.log(type)
    //       // console.log(" ================= end type ")
    //       if (type) {
    //         // console.log(" ============ into type =================")
    //         // console.log(" ============ start set data from type =================")
    //         this.contractForm.controls.MainLoanPrincipleAmount.enable({ emitEvent: false });
    //         //if (this.checkStatus == 'Y'||this.checkStatus == 'CR') 
    //         if(this.checkDisableContractStatus()) this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });

    //         this.GuaranteeAssetYN = type.GuaranteeAssetYN;
    //         this.GuarantorYN = type.GuarantorYN;

    //         this.contractForm.controls.AppLoanInterestRate.setValue(type.InterestRate, { emitEvent: false });
    //         this.contractForm.controls.AppInterestType.setValue(type.InterestType, { emitEvent: false });
    //         this.contractForm.controls.AppFeeRate1.setValue(type.AccFee1, { emitEvent: false });
    //         this.contractForm.controls.AppFeeRate2.setValue(type.AccFee2, { emitEvent: false });

    //         // ค่าจดจำนอง
    //         this.MortgageFee = type.MortgageFee;
    //         let AppFeeAmount3 = this.contractForm.controls.MainLoanPrincipleAmount.value * (type.MortgageFee / 100)
    //         this.contractForm.controls.AppFeeRate3.setValue(type.MortgageFee)
    //         if (AppFeeAmount3 > 0) {
    //           this.contractForm.controls.AppFeeAmount3.setValue(AppFeeAmount3)
    //         }
    //         else {
    //           this.contractForm.controls.AppFeeAmount3.setValue(null)
    //         }

    //         if (type.SecuritiesPercent) {
    //           this.securitiesPer = type.SecuritiesPercent;
    //         }

    //         if (type.MaxLoanAmount) {
    //           this.LoanTypeMax = type.MaxLoanAmount;
    //         }

    //         if (type.MaxPeriod) {
    //           this.MaxPeriod = type.MaxPeriod;
    //         }

    //         if (type.MinPeriod) {
    //           this.MinPeriod = type.MinPeriod;
    //         }

    //         let reqTotal = this.getRegTotalMonth();
    //         this.contractForm.controls.ReqTotalMonth.setValue(reqTotal);
    //         this.contractForm.controls.AppLoanTotalPeriod.setValue(this.contractForm.controls.ReqTotalPeriod.value, { emitEvent: false });

    //         this.checkMainAmountSecrurities();

    //         if (type.IsNeedBorrower) {
    //           this.IsNeedBorrower = type.IsNeedBorrower;
    //         }
    //         //console.log(" type.ContractMaximumLimit = ", type.ContractMaximumLimit)
    //         this.MaxLoanAmount = type.ContractMaximumLimit;

    //         this.ContractMaximumLimitBorrower = type.ContractMaximumLimitBorrower;

    //         this.ContractType = type.ContractType;

    //         if (this.ContractType == '0' && this.closeRefinance) {
    //           this.contractForm.controls.MainLoanPrincipleAmount.setValue(this.contractForm.controls.MainLoanPrincipleAmount.value);
    //           this.checkMainAmountSecrurities();
    //         }

    //         this.checkMaxLoanAmountByCustomer(this.contractForm.controls.CustomerCode.value);

    //         // if (this.ContractType == '0') {
    //         //   this.contractForm.controls.CustomerName.setErrors(null);
    //         // }

    //         this.IsAgeOverSixty = type.IsAgeOverSixty;

    //         this.RefinanceAdditionalPayment = type.RefinanceAdditionalPayment;

    //         this.getInterestAllmax(this.contractForm.controls.AppLoanPrincipleAmount.value, val,'loanType');
    //         this.checkDebtAmountLimitCustomer();

    //         this.contractForm.controls.DescLoan.setValue(type.ContractDocument);

    //       } else {
    //         //this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
    //         //this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });

    //         this.contractForm.controls.DescLoan.setValue(null);
    //       }
    //       //console.log(" ============ end set data from type =================")
    //     } else {
    //       //console.log(" ============ type is null set null to relative fields =================")
    //       this.GuaranteeAssetYN = null;
    //       this.GuarantorYN = null;

    //       this.contractForm.controls.AppLoanInterestRate.setValue(null, { emitEvent: false });
    //       this.contractForm.controls.AppInterestType.setValue(null, { emitEvent: false });
    //       this.contractForm.controls.AppFeeRate1.setValue(null, { emitEvent: false });
    //       this.contractForm.controls.AppFeeRate2.setValue(null, { emitEvent: false });
    //       this.contractForm.controls.AppFeeRate3.setValue(null, { emitEvent: false });
    //       this.contractForm.controls.AppFeeAmount3.setValue(null, { emitEvent: false });

    //       this.contractForm.controls.DescLoan.setValue(null);

    //     }
    //   }
    // )

    //-------------------New UI Loan LoanTypeCode-----------------------
    this.contractForm.controls.LoanTypeCode.valueChanges.subscribe(
      (val) => {
        if (val) {
          let type = this.loanTypeData.find(o => { return o.Value == val }) || {};
          if (type) {
            // this.contractForm.controls.MainLoanPrincipleAmount.enable({ emitEvent: false });
            if(this.checkDisableContractStatus()) this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });

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
              console.log(" MaxPeriod : "+type.MaxPeriod);
              this.MaxPeriod = type.MaxPeriod;
            }

            if (type.MinPeriod) {
              console.log(" MinPeriod : "+type.MinPeriod);
              this.MinPeriod = type.MinPeriod;
            }

            this.contractForm.controls.ReqTotalPeriod.setValue(this.contractHead.ReqTotalPeriod);

            if (type.IsNeedBorrower) {
              this.IsNeedBorrower = type.IsNeedBorrower;
            }

            this.MaxLoanAmount = type.ContractMaximumLimit;

            this.ContractMaximumLimitBorrower = type.ContractMaximumLimitBorrower;

            this.ContractType = type.ContractType;

            if (this.ContractType == '0' && this.closeRefinance) {
              this.contractForm.controls.MainLoanPrincipleAmount.setValue(this.contractForm.controls.MainLoanPrincipleAmount.value);
              this.checkMainAmountSecrurities();
            }

            this.checkMaxLoanAmountByCustomer(this.contractForm.controls.CustomerCode.value);

            this.IsAgeOverSixty = type.IsAgeOverSixty;

            this.RefinanceAdditionalPayment = type.RefinanceAdditionalPayment;

            if (type.CanRefinance) {
              this.CanRefinance = type.CanRefinance;
            }

            this.getInterestAllmax(this.contractForm.controls.AppLoanPrincipleAmount.value, val,'LoanTypeCpdeValueChange');
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

          // this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
          // this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });

          this.contractForm.controls.DescLoan.setValue(null);
          this.contractForm.controls.TotalAmount.setValue(null);

          // this.resetSecurities();
          // this.resetBorrower();
        }
      }
    )
    //---------------------------End UI LoanTypeCode-------------------------


    this.contractForm.controls.ReqLoanAmount.valueChanges.subscribe(
      (val) => {
        //console.log(" into  ReqLoanAmount.valueChanges : "+val)
        if (val) {
          let reqTotal = this.contractForm.controls.TotalAmount.value;
          //console.log(" reqTotal : "+reqTotal);
          this.checkMaxLoanAmount(val, reqTotal);

          let mainAmount = this.contractForm.controls.MainLoanPrincipleAmount.value;
          this.checkMainLoanAmout(mainAmount, val)

          let custCode = this.contractForm.controls.CustomerCode.value;
          this.checkMaxLoanAmountByCustomer(custCode);
          //console.log(" req prepare set AppLoanPrincipleAmount : "+val)
          this.contractForm.controls.AppLoanPrincipleAmount.setValue(val)
          this.contractForm.controls.AppLoanPrincipleAmount.markAsDirty();

        } else {
          //console.log(" No req set AppLoanPrincipleAmount : "+val)
          this.contractForm.controls.AppLoanPrincipleAmount.setValue(null)
          this.contractForm.controls.AppLoanPrincipleAmount.markAsDirty();

        }
      }
    )

    this.contractForm.controls.ReqTotalPeriod.valueChanges.subscribe(
      (val) => {
        console.log(" into  ReqTotalPeriod.valueChanges :"+val)
        if (val) {
          console.log(" into  if val not null, val is :"+val)
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
        //console.log(" into  ReqGapPeriod.valueChanges ")
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
        //console.log(" into  ReqTotalMonth.valueChanges ")
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
        //console.log(" into  ApprovedDate.valueChanges "+ val);

        if (val) {
          //console.log(" start set "+ val +" to TransferDate and StartInterestDate");

          //console.log(" TransferDate ===== set 1 ");
          this.contractForm.controls.TransferDate.setValue(val);
          //console.log(" StartInterestDate ===== set 2 ");
          this.contractForm.controls.StartInterestDate.setValue(val);

          //console.log(" StartInterestDate : "+this.contractForm.controls.StartInterestDate.value);

    
          //console.log(" ---------- End Set TransferDate StartInterestDate --------------   ");
        } else {
          //console.log(" Set TransferDate StartInterestDate  StartPaymentDate EndPaymentDate to null ")
          this.contractForm.controls.TransferDate.setValue(null, { emitEvent: false });
          this.contractForm.controls.StartInterestDate.setValue(null, { emitEvent: false });
          this.contractForm.controls.StartPaymentDate.setValue(null, { emitEvent: false });
          this.contractForm.controls.EndPaymentDate.setValue(null, { emitEvent: false })
        }
        //console.log(" ---------- End Set data in  ApprovedDate.valueChanges --------------   ");
      }
    )

    this.contractForm.controls.TransferDate.valueChanges.subscribe(
      (val) => {
        //console.log(" into  TransferDate.valueChanges : "+val)
        if (val) {
          //console.log(" StartInterestDate ===== set 1.1 ");
          this.contractForm.controls.StartInterestDate.setValue(val);

          let interestDate: Date = new Date(val);
          let date = new Date(interestDate.setMonth(interestDate.getMonth() + 1));

          let startdate = this.getStartPaymentDate(date);
          //console.log(" StartPaymentDate ===== set 1.2 ");
          this.contractForm.controls.StartPaymentDate.setValue(startdate, { emitEvent: false });
          //console.log(" StartPaymentDate : "+this.contractForm.controls.StartPaymentDate.value);

          let end: Date = this.getEndPaymentDate(startdate, this.contractForm.controls.ReqTotalMonth.value);
          //console.log(" StartPaymentDate ===== set 1.3 ");
          this.contractForm.controls.EndPaymentDate.setValue(end, { emitEvent: false })

          //console.log(" ---------- End Set StartInterestDate StartPaymentDate EndPaymentDate --------------   ");
        } else {
          //console.log(" Set StartInterestDate  StartPaymentDate EndPaymentDate to null ")
          this.contractForm.controls.StartInterestDate.setValue(null, { emitEvent: false });
          this.contractForm.controls.StartPaymentDate.setValue(null, { emitEvent: false });
          this.contractForm.controls.EndPaymentDate.setValue(null, { emitEvent: false })
        }
        //console.log(" ---------- End Set data in  TransferDate.valueChanges --------------   ");
      }
    )

    this.contractForm.controls.StartInterestDate.valueChanges.subscribe(
      (val) => {
        //console.log(" into  StartInterestDate.valueChanges : "+val);
        if (val) {
          //console.log(" start set "+ val +" to startdate and enddate");
          let interestDate: Date = new Date(val);
          let date = new Date(interestDate.setMonth(interestDate.getMonth() + 1));

          let startdate = this.getStartPaymentDate(date);
          //console.log(" StartPaymentDate ===== set 1.1.1 ");
          this.contractForm.controls.StartPaymentDate.setValue(startdate, { emitEvent: false });

          let end: Date = this.getEndPaymentDate(startdate, this.contractForm.controls.ReqTotalMonth.value);
          //console.log(" StartPaymentDate ===== set 1.1.2 ");
          this.contractForm.controls.EndPaymentDate.setValue(end, { emitEvent: false })

          //console.log(" ---------- End Set StartPaymentDate EndPaymentDate --------------   ");
        } else {
          //console.log(" Set StartPaymentDate EndPaymentDate to null ")
          this.contractForm.controls.StartPaymentDate.setValue(null, { emitEvent: false });
          this.contractForm.controls.EndPaymentDate.setValue(null, { emitEvent: false })
        }
        //console.log(" ---------- End Set data in  StartInterestDate.valueChanges --------------   ");
      }
    )

    this.contractForm.controls.StartPaymentDate.valueChanges.subscribe(
      (val) => {
        //console.log(" into  StartPaymentDate.valueChanges ")
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
        //console.log(" into  AppLoanPrincipleAmount.valueChanges : "+val)
        if (val) {
          let reqAmount = this.contractForm.controls.ReqLoanAmount.value;
          if (reqAmount < val) {
            if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
              this.contractForm.controls.AppLoanPrincipleAmount.setErrors({ 'over': true });
            }
          } else {
            if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
              this.contractForm.controls.AppLoanPrincipleAmount.setErrors(null);
            }
          }
          this.getInterestAllmax(val, this.contractForm.controls.LoanTypeCode.value,'AppLoan')
        }
      }
    )


    this.contractForm.controls.CustomerReceiveTypeCode.valueChanges.subscribe(
      (val) => {
        ////console.log(" into  CustomerReceiveTypeCode.valueChanges ")
        this.contractForm.controls.CustomerAccountNo.setValue(null, { emitEvent: false })
        this.contractForm.controls.CustomerAccountName.setValue(null, { emitEvent: false })
        this.contractForm.controls.CustomerBankCode.setValue(null, { emitEvent: false })
        this.contractForm.controls.CustomerBranchName.setValue(null, { emitEvent: false })
        this.contractForm.controls.CustomerBankAccountTypeCode.setValue(null, { emitEvent: false })
        this.contractForm.controls.CustomerAccountAuto.setValue(null, { emitEvent: false })

        if (val == this.tranfersType) {
          // console.log('')
          // console.log('')
          // console.log('')
          // console.log('')
          // console.log('')
          // console.log(this.contractHead.ContractNo);
          // console.log('')
          // console.log('')
          // console.log('')
          // console.log('')
          if (this.contractHead.ContractNo == null
            && this.contractHead.CustomerAccountNo == null
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
          } else {
            this.contractForm.controls.CustomerAccountNo.setValue(this.contractHead.CustomerAccountNo, { emitEvent: false });
            this.contractForm.controls.CustomerAccountName.setValue(this.contractHead.CustomerAccountName, { emitEvent: false });
            this.contractForm.controls.CustomerBankCode.setValue(this.contractHead.CustomerBankCode, { emitEvent: false });
            this.contractForm.controls.CustomerBranchName.setValue(this.contractHead.CustomerBranchName, { emitEvent: false });
            this.contractForm.controls.CustomerBankAccountTypeCode.setValue(this.contractHead.CustomerBankAccountTypeCode, { emitEvent: false });
            this.contractForm.controls.CustomerAccountAuto.setValue(this.contractHead.CustomerAccountAuto, { emitEvent: false });
          }
        }
      }
    )

    this.contractForm.controls.AppLoanPrincipleAmount.valueChanges.subscribe(
      (val) => {
        //console.log(" into  AppLoanPrincipleAmount.valueChanges ")
        this.clearPeriod();
      }
    )

    this.contractForm.controls.AppLoanTotalPeriod.valueChanges.subscribe(
      (val) => {
        //console.log(" into  AppLoanTotalPeriod.valueChanges ")
        this.clearPeriod();
      }
    )

    this.contractForm.controls.AppLoanInterestRate.valueChanges.subscribe(
      (val) => {
        //console.log(" into  AppLoanInterestRate.valueChanges ")
        this.clearPeriod();
      }
    )

    this.contractForm.controls.MGMCheckbox.valueChanges.subscribe(value => {
      //console.log(" into  MGMCheckbox.valueChanges : "+value)
      if (value) {
        this.flagAddMgmEmployee = true;
        this.contractForm.controls.Activity.enable();
      } else {
        // console.log(" into  this.contractForm.controls.Activity.invalid  : "+this.contractForm.controls.Activity.invalid )
        // console.log(" into  this.ContractMgmEmployee.length > 0 : "+this.ContractMgmEmployee.length)
        // console.log(" into  this.ContractMgm.length > 0 : "+this.ContractMgm.length)

        if (!this.contractForm.controls.Activity.invalid || this.ContractMgmEmployee.length > 0 || this.ContractMgm.length > 0) {
          this.modal.confirm("ต้องการละทิ้ง MGM หรือไม่").subscribe(
            (res) => {
              if (res) {
                this.flagAddMgmEmployee = false;
                this.contractForm.controls.Activity.setValue(null);
                this.contractForm.controls.Activity.disable();

                if (this.ContractMgmEmployee.length > 0) {
                  this.ContractMgmEmployee.getRawValue().forEach((currentValue, index) => {
                    // console.log(" get index")
                    // console.log(index)
                    // console.log(" end get index")
                    this.removeRowEmployee(index);
                  });
                }

                if (this.ContractMgm.length > 0) {
                  this.ContractMgm.getRawValue().forEach((currentValue, index) => {
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
        console.log(" TypeOfPay change : "+val);
        if(val){
          console.log(" TypeOfPay change not null ");
        }else{
          console.log(" TypeOfPay change is null ");
          this.LoanContractType = null;
          this.contractForm.controls.LoanTypeCode.setValue(null, { emitEvent: false });
          this.contractForm.controls.MainLoanPrincipleAmount.setValue(null, { emitEvent: false });
          this.contractForm.controls.TotalAmount.setValue(null, { emitEvent: false });
        }

      }
    )

  }

  createContractMgmEmployeeForm(item: ContractMgmEmployee): FormGroup {
    const fg = this.fb.group({
      Id: null,
      ContractHeadId: 0,
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
      Id: null,
      ContractHeadId: 0,
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

  createContractNotiForm(item: ContractNoti): FormGroup {
    const fg = this.fb.group({
      Id: null,
      ContractHeadId: 0,
      NotiDesc: null,
      NotiDate: null,
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

  get ContractBorrower(): FormArray {
    return this.loContractForm.get('ContractBorrowers') as FormArray;
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

  get contractNotis(): FormArray {
    return this.contractForm.get('contractNotis') as FormArray;
  };

  get contractAttachments(): FormArray {
    return this.contractForm.get('contractAttachments') as FormArray;


  }

  contractBorrowersForm(item: ContractBorrower): FormGroup {
    //console.log(" into contractBorrowersForm ")
    //console.log(" Show item ")
    //console.log(item)
    //console.log(" End item ")
    let fg = this.fb.group({
      Id: null,
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
        console.log(" into  LoanAmount.valueChanges ")
        if (val) {
          // if (this.ContractMaximumLimitBorrower) {
          let amount = this.maxLoanLimitAmount - fg.controls.DebtAmount.value;
          if (val > amount) {
            if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
              fg.controls.LoanAmount.setErrors({ 'over': true });
              this.borowwerAmountOver = true;
            }
           
          } else {
            if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
              fg.controls.LoanAmount.setErrors(null);
              this.borowwerAmountMin = false;
            }
          
          }
        } else {
          if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
            this.borowwerAmountMin = true;
            this.borowwerAmountOver = false;
          }
        
        }
      }
    )
    return fg;
  }


  contractSecuritiesForm(item: ContractSecurities): FormGroup {
    // console.log(" into contractSecuritiesForm ")
    // console.log(" Start Check Item")
    // console.log(item)
    // console.log(" End Check Item")
    let fg = this.fb.group({
      ContractSecuritiesId: 0,
      Id: null,
      ContractHeadId: 0,
      CustomerSecuritiesId: [null, Validators.required],
      securitiesTha: null,
      securitiesEng: null,
      TypeNameTha: null,
      TypeNameEng: null,
      Description: null,
      SecuritiesDescription: null,
      loanLimitAmount: null,
      loanFileName: null,
      CategoryId: null,
      Priority: null,
      RowState: RowState.Add,
      RowVersion: 0,
    });
    fg.patchValue(item, { emitEvent: false });
    //console.log(" ==================== into  contractSecuritiesForm =======================")
    //fg.controls.Description.setValue(" test mock description", { emitEvent: false });
    this.filterCustomerSecurities(item.CustomerSecuritiesId)
    console.log(" item.CustomerSecuritiesId : "+item.CustomerSecuritiesId);

    fg.controls.CustomerSecuritiesId.setValue(item.CustomerSecuritiesId)
    fg.valueChanges.subscribe(
      (control) => {
        console.log(" ==================== into  contractSecuritiesForm fg.valueChanges.subscribe =======================")
        if (control.RowState !== RowState.Add) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
        console.log(" ==================== into  CustomerSecuritiesId =======================")
        console.log(fg.controls.CustomerSecuritiesId.value)
        console.log(" ==================== End  CustomerSecuritiesId =======================")
      }
    )

    // fg.controls.CustomerSecuritiesId.valueChanges.subscribe(
    //   (val) => {
    //     //console.log(" into  CustomerSecuritiesId.valueChanges ", val)
    //     if (val) {
    //       this.LoanContractType = null;
    //       let cust = this.customerSecurities.find(o => { return o.Value == val }) || {};
    //       this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
    //       if (cust) {
    //         fg.controls.TypeNameTha.setValue(cust.TypeNameTha, { emitEvent: false });
    //         fg.controls.TypeNameEng.setValue(cust.TypeNameEng, { emitEvent: false });   //Code เก่า
    //         fg.controls.loanFileName.setValue(cust.loanFileName, { emitEvent: false });
    //         fg.controls.loanLimitAmount.setValue(cust.loanLimitAmount, { emitEvent: false });
    //         fg.controls.Description.setValue(cust.description, { emitEvent: false });
    //       }
    //     }
    //     else {
    //       fg.controls.TypeNameTha.setValue(null, { emitEvent: false });
    //       fg.controls.TypeNameEng.setValue(null, { emitEvent: false });
    //       fg.controls.loanLimitAmount.setValue(null, { emitEvent: false });
    //       fg.controls.loanFileName.setValue(null, { emitEvent: false });
    //       fg.controls.Description.setValue(null, { emitEvent: false });
    //     }

    //     this.checkMainAmountSecrurities();
    //   }
    // )
    fg.controls.CustomerSecuritiesId.valueChanges.subscribe(
      (val) => {
        console.log(" CustomerSecuritiesId.valueChanges ");
        console.log(" val : "+val);
        if (val) {
          console.log(" if val : "+val);
          this.LoanContractType = null;
          this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
          let cust = this.customerSecurities.find(o => { return o.Value == val }) || {};
          console.log(" check cust ");
          console.log(cust);
          console.log(" end check cust ");
          if (cust) {
            fg.controls.TypeNameTha.setValue(cust.TypeNameTha, { emitEvent: false });
            fg.controls.TypeNameEng.setValue(cust.TypeNameEng, { emitEvent: false });
            fg.controls.loanFileName.setValue(cust.loanFileName, { emitEvent: false });
            fg.controls.loanLimitAmount.setValue(cust.loanLimitAmount, { emitEvent: false });
            fg.controls.Description.setValue(cust.description, { emitEvent: false });
            fg.controls.CategoryId.setValue(cust.CategoryId, { emitEvent: false });
            fg.controls.Priority.setValue(cust.Priority, { emitEvent: false });

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
          if(null!=this.contractForm.controls.CategoryId.value)this.getMaxLoanAmount('edit');
        }
        else {
          console.log(" els ");
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
      Id: null,
      InformationId: null,
      ContractHeadId: 0,
      TextTha: null,
      TextEng: null,
      AddOn: null,
      Active: false,
      RowState: RowState.Add,
      RowVersion: 0,
    });

    fg.patchValue(item, { emitEvent: false });

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )

    fg.controls.Active.valueChanges.subscribe((value) => { // ติ๊กเลือก
      console.log(" into  Active.valueChanges : "+value)
      if (value) {
        if (fg.controls.RowState.value == null || fg.controls.RowState.value == RowState.Add) {
          console.log(" into  set : add ")
          console.log(" TextTha : ",fg.controls.TextTha.value);
          fg.controls.RowState.setValue(RowState.Add, { emitEvent: false });
        } else if(fg.controls.ContractHeadId.value != 0 && null != fg.controls.ContractHeadId.value) {
          console.log(" into  set : edit ")
          console.log(" TextTha : ",fg.controls.TextTha.value);
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
      else { // ติ๊กออก
        if(null!=fg.controls.RowState.value){
          if (fg.controls.RowState.value == RowState.Add) {
            console.log(" have revert add to null information ");
            fg.controls.RowState.setValue(null, { emitEvent: false });
          } else {
            console.log(" TextTha is : ",fg.controls.TextTha.value);
            console.log(" RowState is : ",fg.controls.RowState.value);
            console.log(" have one set delete information ");
            fg.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
          }
  
          if (this.contractHead.ContractInformation.length > 0) {
            // เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
            //console.log(" into  set : delete ")
            const deleting = this.contractHead.ContractInformation.find((item) =>
              item.Id === fg.controls.Id.value 
            );
            if(null!=deleting)deleting.RowState = RowState.Delete;
          }
        }
      }
    })

    return fg;
  }

  ContractIncomeItemsForm(item: ContractItem): FormGroup {
    let fg = this.fb.group({
      Id: null,
      LoItemCode: [null, Validators.required],
      LoItemSectionCode: null,
      LoImgPath: null,
      LoImgName: null,
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
    this.attachmentFiles.push(new Attachment());
    return fg;
  }

  ContractPaymentItemsForm(item: ContractItem): FormGroup {
    let fg = this.fb.group({
      Id: null,
      LoItemCode: [null, Validators.required],
      LoItemSectionCode: null,
      LoImgPath: null,
      LoImgName: null,
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
    this.attachmentFiles.push(new Attachment());
    return fg;
  }

  contractPeriodsForm(item: ContractPeriod): FormGroup {
    let fg = this.fb.group({
      Id: null,
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

  contractAttachmentsForm(item: ContractAttachment): FormGroup {
    let fg = this.fb.group({
      ContractAttachmentId: 0,
      AttachmentTypeCode: [null, Validators.required],
      FileName: null,
      AttahmentId: [null, Validators.required],
      Description: null,
      RowState: RowState.Add,
      IsDisableAttachment: null
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

  loContractBorrowerForm(item: LoContractBorrower): FormGroup {
    let fg = this.fb.group({
      ContractBorrowerId: null,
      ContractHeadId: null,
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
      // console.log(" into set master and detail ")
      console.log(data);
      this.maxLoanAmount = data.lots25.master.MaximumLoanAmount;
      this.maxLoanLimitAmount = data.lots25.master.MaximumLoanLimitAmount
      this.maximumLoaner = data.lots25.master.MaximumLoaner;
      this.maximumGuarantor = data.lots25.master.MaximumGuarantor;
      this.payTypeMonth = data.lots25.master.PayTypeMonth;
      this.tranfersType = data.lots25.master.TranfersType;
      this.tranfersTypeT = data.lots25.master.TranfersTypeT;
      this.tranfersTypeM = data.lots25.master.TranfersTypeM;
      this.company = data.lots25.master.CompanyDetail;
      this.companyList = data.lots25.master.CompanysList;
      //console.log(this.companyList);
      this.loanType = data.lots25.master.loanTypes;
      this.pays = data.lots25.master.Pays;
      this.paymentCompanyAccount = data.lots25.master.CompanyAccounts;
      this.receiveCompanyAccount = data.lots25.master.CompanyAccounts;
      this.paymentType = data.lots25.master.ReceiveTypeList;
      this.customerReceiveType = data.lots25.master.ReceiveTypeList;
      this.receivePaymentType = data.lots25.master.ReceiveTypeList;
      this.bankAccountType = data.lots25.master.BankAccountTypeList;
      this.incomeLoan = data.lots25.master.IncomeLoanList;
      this.paymentLoan = data.lots25.master.PaymentLoanList;
      this.customerSecurities = data.lots25.master.CustomerSecuritiesList;
      this.informations = data.lots25.master.InformationList;
      this.appInterestTypes = data.lots25.master.AppInterestType;
      this.banklist = data.lots25.master.BankList;
      this.contractTypeList = data.lots25.master.ContractType;
      this.SecuritiesCategories = data.lots25.master.SecuritiesCategorys;
      this.customerslist = data.lots25.master.Customers;
      this.companyCode = data.lots25.master.CompanyCode;
      console.log(" ===================================== data.lots25.master.CompanyCode : ",data.lots25.master.CompanyCode);
      this.CustomersAddress = data.lots25.master.CustomersAddress;
      this.MortgageFee = data.lots25.master.MortgageFee;
      this.contractReFinance = data.lots25.master.ContractReFinance;
      this.IsSuperUser = data.lots25.master.IsSuperUser;
      this.IsCompanyCapital = data.lots25.master.IsCompanyCapital;
      this.loanTypeExitSecurities = data.lots25.master.LoanTypeExitSecurities;
      this.requestReview = data.lots25.master.RequestSecuritiesById;
      this.requestReviewText = data.lots25.master.RequestSecuritiesByTha;
      this.employeeIdCard = data.lots25.master.EmployeeIdCard;

      this.contractHead = data.lots25.detail;
      //this.loanTypeData = this.loanType;
      this.lots04Service.getDefaultCompany(this.contractHead.CustomerCode).subscribe(
        (res: any) => {
          console.log(" customerCompany: ",res);
          //this.companyCode = res.finalData;
          //this.companyCode = this.contractHead.CompanyCode
          //this.contractForm.controls.CompanyCode.setValue(this.companyCode);
          //this.contractForm.controls.CompanyCode.setValue(this.contractHead.CompanyCode);
          console.log(" customerCompany: ",this.contractForm.controls.CompanyCode.value);
          //this.contractForm.controls.defaultCompany.setValue(this.companyCode);
          this.lots04Service.getAddressCompany(this.contractHead.CustomerCode).subscribe(
            (res: any) => {
              console.log(" Company List : ",res);
              this.filterCustomerAddressCompany = null;
              this.filterCustomerAddressCompany = res;
              this.rebuildForm('firstSet');
            }
          )
        }
      )

      //this.rebuildForm('firstSet');
    })

    this.subject
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.checkMainAmountSecrurities();
      }
      );
  }

  rebuildForm(steps) {
    console.log(" ==================--------------------- this.ContractType :",this.ContractType);
    console.log(" ==================--------------------- ",this.contractHead);
    // console.log(' contract head ------- AppLoanPrincipleAmount : ' + this.contractHead.AppLoanPrincipleAmount);
    // console.log(' contract head ------- ReqLoanAmount : ' + this.contractHead.ReqLoanAmount);
    this.lots04Service.checkApproverIsnotCustomer(this.employeeIdCard,this.contractHead.CustomerCode).subscribe(
      (res: any) => {
        console.log(res);
      }
    )

    console.log(" this.paymentId : "+this.paymentId);
    //this.contractForm.controls.CustomerSecuritiesId.setValue(this.contractHead.ContractSecurities.filter(item => { return item.Value != null }) );
    this.contractForm.controls.CategoryId.setValue(null, { emitEvent: false });
    //this.contractForm.controls.PaymentCompanyAccountId.setValue(this.paymentId);
    
    this.companyList = this.companyList.filter(item => { return item.Value.substr(0,1) != 9 });
    this.CustomerAddressCompany = [];
    for(let i = 0;i<this.filterCustomerAddressCompany.length;i++){
      this.CustomerAddressCompanyTemp = this.companyList.filter(item => { return item.Value == this.filterCustomerAddressCompany[i] })[0];
      if(undefined!=this.CustomerAddressCompanyTemp&&null!=this.CustomerAddressCompanyTemp)this.CustomerAddressCompany.push(this.CustomerAddressCompanyTemp);
    }
    console.log(" old this.CompanyListsData : ",this.companyList);
    this.companyList = this.CustomerAddressCompany;
    console.log(" this.CompanyListsData : ",this.companyList);
    console.log(this.companyList);

    //this.contractForm.controls.AppLoanPrincipleAmount.setValue(this.contractHead.AppLoanPrincipleAmount);
    this.attachmentFiles = [];
    this.contractForm.controls.AddOn.disable({ emitEvent: false });
    this.contractHead.ReqGapPeriod = 1 ;
    this.contractForm.markAsPristine();
    //console.log(" Before patch value ")
    this.contractHead.ReqGapPeriod = 1; //บังคับเป็น1เสมอ
    this.contractForm.patchValue(this.contractHead);
    //console.log(" After patch value ")
    
    // console.log(' contract form ------- AppLoanPrincipleAmount : ' + this.contractForm.controls.AppLoanPrincipleAmount.value);
    // console.log(' contract form ------- ReqLoanAmount : ' + this.contractForm.controls.ReqLoanAmount.value);

    if(this.contractHead.TransferDate == null || this.contractHead.StartInterestDate == null || this.contractHead.StartPaymentDate == null ){
      this.contractForm.controls.ApprovedDate.setValue(this.contractHead.ApprovedDate)
    }else{

    }
    // console.log(" check  contractForm OldContractId value ")
    // console.log(this.contractForm.controls.OldContractId.value);
   

    this.contractForm.controls.RequestNumber.setValue(this.contractHead.RequestNumber);
    //this.contractForm.controls.defaultCompany.setValue(this.contractHead.CompanyCode);
    // console.log(" Show  this.contractForm.controls ")
    // console.log(this.contractForm.controls)
    // console.log(" End this.contractForm.controls ")
    // console.log(" Show  contractHead ")
    // console.log(this.contractHead)
    // console.log(" End contractHead ")
    if(null==this.contractHead.RequestReview){
      this.contractForm.controls.RequestReview.setValue(this.requestReview, { emitEvent: false })
      this.contractForm.controls.RequestReviewText.setValue(null, { emitEvent: false })
    }else{
      this.contractForm.controls.RequestReview.setValue(this.contractHead.RequestReview, { emitEvent: false })
      this.contractForm.controls.RequestReviewText.setValue(this.contractHead.RequestReviewName, { emitEvent: false })
    }
    
    this.contractForm.controls.LoanTypeCode.disable({ emitEvent: false })
    this.contractForm.controls.RequestReviewText.disable({ emitEvent: false })
    this.contractForm.controls.PayType.setValue(this.payTypeMonth, { emitEvent: false })
    //this.contractForm.controls.CompanyCode.setValue(this.companyCode); // sethere
    this.contractForm.controls.PaymentTypeCode.setValue(this.tranfersType);
    this.contractForm.controls.PaymentTypeCode.disable({ emitEvent: false });
    this.contractForm.controls.CustomerReceiveTypeCode.disable({ emitEvent: false });
    this.contractForm.controls.CategoryId.disable({ emitEvent: true });
    this.contractForm.controls.DescLoan.disable({ emitEvent: false });
    this.contractForm.controls.Activity.setValue(this.contractHead.Activity);
    this.contractForm.controls.branchCompanyNameTha.setValue(this.contractHead.VerifyBranch[0].TextTha)
    this.contractForm.controls.branchCompanyNameEng.setValue(this.contractHead.VerifyBranch[0].TextEng)
    // this.contractForm.controls.MainLoanPrincipleAmount.setValue(this.contractHead.MainLoanPrincipleAmount)
    this.contractForm.controls.TotalAllContractAmount.setValue(this.contractHead.TotalAllContractAmount)//null
    // this.contractForm.controls.ContractNo.setValue(this.contractHead.ContractNo)
    this.contractForm.controls.LoanObjective.setValue(this.contractHead.LoanObjective)

    //this.contractForm.controls.ReqTotalPeriod.setValue(this.contractHead.ReqTotalPeriod)
    // this.contractForm.controls.ReqTotalMonth.setValue(this.contractHead.ReqTotalMonth)
    this.contractForm.controls.MaximumInterestRate.setValue(this.contractHead.MaximumInterestRate)
    this.CompanyList = this.companyList;
    //this.contractForm.controls.defaultCompany.setValue(this.contractHead.CompanyCode)
    this.SecuritiesCategoriesData = this.SecuritiesCategories.filter(item => { return item.CustomerCode == this.contractHead.CustomerCode });
    this.contractForm.controls.CategoryId.setValue(this.contractHead.CategoryId)
    let customerShowName = this.customerslist.find(o => { return o.Value == this.contractHead.CustomerCode }) || {};
    this.contractForm.controls.CustomerNameTha.setValue(customerShowName.TextTha);
    this.contractForm.controls.CustomerNameEng.setValue(customerShowName.TexEng);
    this.checkMaxLoanAmountByCustomer(this.contractForm.controls.CustomerCode.value);
    this.contractForm.controls.CustomerName.disable({ emitEvent: false });

    // console.log(this.contractForm.controls.CustomerName.value)
    // console.log(this.contractForm.controls.MainLoanPrincipleAmount.value)
    this.contractForm.setControl('contractSecuritiess', this.fb.array(this.contractHead.ContractSecurities.map((detail) => this.contractSecuritiesForm(detail))))
    this.contractForm.setControl('contractBorrowers', this.fb.array(this.contractHead.ContractBorrower.map((detail) => this.contractBorrowersForm(detail))))

    //this.contractForm.controls.MGMCheckbox.value ? this.contractForm.controls.Activity.enable() : this.contractForm.controls.Activity.disable();
    if (this.contractForm.controls.Activity.value != null && this.contractForm.controls.Activity.value != '') {
      this.contractForm.controls.MGMCheckbox.setValue(true);
      this.contractForm.setControl('ContractMgmEmployee', this.fb.array(this.contractHead.ContractMgmEmployee.map((detail) => this.createContractMgmEmployeeForm(detail))));
      this.contractForm.setControl('ContractMgm', this.fb.array(this.contractHead.ContractMgm.map((detail) => this.createContractMgmForm(detail))));
    } else {
      this.contractForm.controls.Activity.disable();
    }
    this.contractForm.setControl('contractNotis', this.fb.array(this.contractHead.ContractNoti.map((detail) => this.createContractNotiForm(detail))));
    this.filterLoanType(this.contractHead.CategoryId, false, null, "rebuildForm");
    // console.log(" Show After filter this.loanTypeData ")
    // console.log(this.loanTypeData)
    // console.log(" End Show After filter this.loanTypeData ") 
    //this.contractForm.controls.LoanTypeCode.setValue(this.contractHead.LoanTypeCode);
    this.contractForm.setControl('contractInformations', this.fb.array(this.contractHead.ContractInformation.map((detail) => this.contractInformationsForm(detail))))
    this.contractForm.setControl('contractIncomeItems', this.fb.array(this.contractHead.ContractIncomeItem.map((detail) => this.ContractIncomeItemsForm(detail))))
    this.contractForm.setControl('contractPaymentItems', this.fb.array(this.contractHead.ContractPaymentItem.map((detail) => this.ContractPaymentItemsForm(detail))))
    //this.contractForm.controls.CustomerSecuritiesId.setValue(this.contractHead.C);
    // console.log(" Start check all contractIncomeItems ")
    // console.log(this.contractForm.controls.contractIncomeItems.value)
    // console.log(" end check all contractIncomeItems ")
    // console.log(" Start check contractIncomeItems ")
    for (var i = 0; i < this.contractHead.ContractIncomeItem.length; i++) {
      //console.log(this.contractHead.ContractIncomeItem[i].LoImgName)
    }
    //console.log(" End check contractIncomeItems ")

    this.onChange();
    //this.getMaxLoanAmount('init');
    this.contractForm.controls.defaultCompany.setValue(this.contractHead.CompanyCode);
    this.contractForm.controls.TypeOfPay.setValue(this.contractHead.PeriodType);
    
    

    this.bindDropDownList();
    //this.checkDropDown();

    if(this.checkDisableContractStatus()){
      this.contractForm.controls.MainLoanPrincipleAmount.disable({ emitEvent: false });
      this.contractForm.disable({ emitEvent: false });
      
      this.checkStatus = this.contractHead.RequestStatus;
    }
  }

  checkDisableContractStatus(){
    this.checkStatus = this.contractHead.RequestStatus;
    let result = false;
    if(this.checkStatus=="Y" || this.checkStatus=="CR" || this.checkStatus=="UAC" || this.checkStatus=="WB"){
      result = true;
    }
    return result;
  }

  filterShowSecuritiesCategories(filter?: boolean) {
    //console.log(" filterShowSecuritiesCategories filter : ", filter)
    if (filter) {
      const detail = this.contractHead;
      if (detail.CategoryId) {
        this.SecuritiesCategories = this.selectFilter.FilterActiveByValue(this.SecuritiesCategories, detail.CategoryId);
      }
      else {
        this.SecuritiesCategories = this.selectFilter.FilterActive(this.SecuritiesCategories);
      }
    }
    this.selectFilter.SortByLang(this.SecuritiesCategories);
    this.SecuritiesCategories = [...this.SecuritiesCategories];
  }

  addAttachment() {
    this.contractAttachments.markAsDirty();
    this.contractAttachments.push(this.contractAttachmentsForm({} as ContractAttachment));
  }

  fileNameReturn(filename, index) {
    //console.log(" into fileNameReturn ")
    console.log(filename)
    let form = this.contractIncomeItems.controls[index] as FormGroup;
    form.controls.LoImgName.setValue(filename);
  }

  fileNameReturnPay(filename, index) {
    // console.log(" into fileNameReturn ")
    // console.log(filename)
    let form = this.contractPaymentItems.controls[index] as FormGroup;
    form.controls.LoImgName.setValue(filename);
  }

  checkContractAttachment() {
    this.contractAttachments.enable();
    for (let i = 0; i < this.contractAttachments.length; i++) {
      let form = this.contractAttachments.controls[i] as FormGroup;
      if (form.controls.ContractAttachmentId.value != 0) {
        form.controls.AttachmentTypeCode.disable({ emitEvent: false });
        form.controls.AttahmentId.disable({ emitEvent: false });
        form.controls.Description.disable({ emitEvent: false });
      }
    }
  }
  bindDropDownList() {
    this.selectFilter.SortByLang(this.incomeLoan);
    this.incomeLoan = [...this.incomeLoan];

    this.selectFilter.SortByLang(this.paymentLoan);
    this.paymentLoan = [...this.paymentLoan];


    // this.filterCustomer(true);
    this.filterShowSecuritiesCategories(true)
    this.filterSecuritiesCategories(true);
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
    // this.SecuritiesCategoriesData = this.SecuritiesCategories.filter(item => { return item.CustomerCode == CustormerCode });
    // this.selectFilter.SortByLang(this.SecuritiesCategoriesData);
    // this.SecuritiesCategoriesData = [...this.SecuritiesCategoriesData];
  }

  filterLoanType(categoryId, isRefinance, refinanceData, callBy) {
    // console.log(" Start filterLoanType(categoryId, isRefinance, refinanceData) call by function :", callBy)
    // console.log(" categoryId, :", categoryId)
    // console.log(" isRefinance, :", isRefinance)
    // console.log(" refinanceData, :", refinanceData)
    this.lots04Service.getLoanTypeC16(this.contractForm.controls.CategoryId.value, this.contractForm.controls.CustomerCode.value, this.contractForm.controls.CompanyCode.value, this.closeRefinance, this.compose, this.LoanContractType, this.summary() ? this.summary() : 0, this.contractForm.controls.TypeOfPay.value, this.MortgageOnly, this.refinanceType, this.refinanceAmount).subscribe(
      (res) => { 
        // console.log(" filterLoanType(categoryId, isRefinance, refinanceData) == res == ", callBy)
        // console.log(" into res ", callBy)
        // console.log(res)
        // console.log(" End res ", callBy)
        this.loanTypeData = res.loanTypes;
        const detail = this.contractHead;
        // console.log(" start detail.LoanTypeCode ", callBy)
        // console.log(detail.LoanTypeCode)
        // console.log(" end detail.LoanTypeCode ", callBy)
        if (detail.LoanTypeCode) {
          this.loanTypeData = this.selectFilter.FilterActiveByValue(this.loanTypeData, detail.LoanTypeCode);
        }
        else {
          this.loanTypeData = this.selectFilter.FilterActive(this.loanTypeData);
        }
        //this.loanTypeData = this.selectFilter.FilterActive(this.loanTypeData);
        this.selectFilter.SortByLang(this.loanTypeData);
        this.loanTypeData = [...this.loanTypeData];
        if(null!=this.contractHead.LoanTypeCode)this.contractForm.controls.LoanTypeCode.setValue(this.contractHead.LoanTypeCode);
        // console.log(" Show in Process this.loanTypeData ", callBy)
        // console.log(this.loanTypeData)
        // console.log(" End in Process this.loanTypeData ", callBy)

        if (isRefinance && refinanceData != null) {
          // console.log(" if (isRefinance && refinanceData != null) ", callBy)
          // console.log(" Show refinanceData "), callBy
          // console.log(refinanceData.MainLoanPrincipleAmount)
          // console.log(" End refinanceData ", callBy)
          this.contractForm.controls.LoanTypeCode.setValue(refinanceData.LoanTypeCode);
          this.contractForm.controls.MainLoanPrincipleAmount.setValue(refinanceData.MainLoanPrincipleAmount);
          this.MainOldContractLoanPrincipleAmount = refinanceData.MainLoanPrincipleAmount;

          if (!this.IsCompanyCapital) {
            if (this.contractForm.controls.CategoryId.value == 3) {
              this.refinanceAmtMod1000 = numeral(this.MainOldContractLoanPrincipleAmount).add(numeral(100).subtract(this.MainOldContractLoanPrincipleAmount % 100).value()).value();
            } else {
              this.refinanceAmtMod1000 = numeral(this.MainOldContractLoanPrincipleAmount).add(numeral(1000).subtract(this.MainOldContractLoanPrincipleAmount % 1000).value()).value();
            }
          }

          if (refinanceData.ContractBorrowerRefinance.length > 0) {
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

            refinanceData.ContractBorrowerRefinance.forEach(element => {
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
            });
          }

          this.checkMainAmountSecrurities();
          //console.log(" End if (isRefinance && refinanceData != null) ", callBy)
        }
        //console.log(" End  filterLoanType(categoryId, isRefinance, refinanceData) res ", callBy)
      })

  }

  filterPaymentCompanyAccount(filter?: boolean) {
    //console.log(" into filterPaymentCompanyAccount with : ", filter)
    if (filter) {
      //console.log(" into  is true ")
      const detail = this.contractHead;
      //coconsole.log(" Start detail ")
      //coconsole.log(detail)
      //coconsole.log(" End detail ")
      if (detail.PaymentCompanyAccountId) {
        //coconsole.log(" detail.PaymentCompanyAccountId not null ")
        //coconsole.log(" Start this.paymentCompanyAccount ")
        //coconsole.log(this.paymentCompanyAccount)
        //coconsole.log(" End this.paymentCompanyAccount ")
        //coconsole.log(" Start detail.PaymentCompanyAccountId ")
        //coconsole.log(detail.PaymentCompanyAccountId)
        //coconsole.log(" End detail.PaymentCompanyAccountId ")
        this.paymentCompanyAccount = this.selectFilter.FilterActiveByValue(this.paymentCompanyAccount, detail.PaymentCompanyAccountId);
        //coconsole.log(" Start After filter this.paymentCompanyAccount ")
        //coconsole.log(this.paymentCompanyAccount)
        //coconsole.log(" End After filter this.paymentCompanyAccount ")
      }
      else {
        //coconsole.log(" detail.PaymentCompanyAccountId null ")
        //coconsole.log(" Start this.paymentCompanyAccount ")
        //coconsole.log(this.paymentCompanyAccount)
        //coconsole.log(" End this.paymentCompanyAccount ")
        this.paymentCompanyAccount = this.selectFilter.FilterActive(this.paymentCompanyAccount);
        //coconsole.log(" Start After filter this.paymentCompanyAccount ")
        //coconsole.log(this.paymentCompanyAccount)
        //coconsole.log(" End After filter this.paymentCompanyAccount ")
      }
    }
    this.selectFilter.SortByLang(this.paymentCompanyAccount);
    this.paymentCompanyAccount = [...this.paymentCompanyAccount];
    // console.log(" Start End sorting this.paymentCompanyAccount ")
    // console.log(this.paymentCompanyAccount)
    // console.log(" End End sorting this.paymentCompanyAccount ")
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
    //console.log(" Show this.customerReceiveTypeData ");
    // console.log(this.customerReceiveTypeData);
    // console.log(" End this.customerReceiveTypeData ");
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
    //console.log(" into  filterCustomerSecurities(contractSecuritiesId)  customercode : ",customercode)
    //console.log(" into  filterCustomerSecurities(contractSecuritiesId)  cateId : ",cateId)
    if (customercode) {
      //console.log(" if (customercode) ")
      //console.log(" Show contractSecuritiesId  ")
      //console.log(contractSecuritiesId)
      //console.log(" End  contractSecuritiesId  ")
      //console.log(" Show contractSecuritiesId  ")
      //console.log(this.contractHead.ContractSecurities)
      //console.log(" End  contractSecuritiesId  ")
      const baseValue = this.contractHead.ContractSecurities.find((item) => {
        return item.Id === contractSecuritiesId
      });
      // console.log(" Show After find baseValue  ")
      // console.log(baseValue)
      // console.log(" End  After find baseValue  ")

      if (baseValue != null) {
        console.log(" if (baseValue != null)  ")
        this.customerSecuritiesData = this.customerSecurities.filter(o => {
          //return o.CustomerCode == customercode && o.SecuritiesCategoryId == cateId
          return o.CustomerCode == customercode
        })
        this.customerSecuritiesData = this.selectFilter.FilterActiveByValue(this.customerSecuritiesData, baseValue.Id);
        console.log(" Show After find this.customerSecuritiesData  ")
        console.log(this.customerSecuritiesData)
        console.log(" End  After find this.customerSecuritiesData  ")
      }
      else {
        this.customerSecuritiesData = this.customerSecurities.filter(o => {
         
          //return o.CustomerCode == customercode && o.SecuritiesCategoryId == cateId // && o.refs == true
          return o.CustomerCode == customercode
        })
        this.customerSecuritiesData = this.selectFilter.FilterActive(this.customerSecuritiesData);
        console.log(" Show After find this.customerSecuritiesData  ")
        console.log(this.customerSecuritiesData)
        console.log(" End  After find this.customerSecuritiesData  ")
      }

      this.selectFilter.SortByLang(this.customerSecuritiesData);
      this.customerSecuritiesData = [...this.customerSecuritiesData];
      console.log(" Show After final customerSecuritiesData  ")
      console.log(this.customerSecuritiesData)
      console.log(" End  After final customerSecuritiesData  ")
      
    }


  }

  filterIncomeLoan(ContractItemId) {
    const baseValue = this.contractHead.ContractIncomeItem.find((item) => {
      return item.Id === ContractItemId
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
      return item.Id === ContractItemId
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
      //this.contractForm.controls.LoanTypeCode.setValue(null);
      this.contractForm.controls.LoanTypeCode.disable();
    }
  }

  // คำนวณจำนวนงวดทั้งหมด
  getRegTotalMonth() {
    console.log(" into getRegTotalMonth ");
    console.log(" ReqTotalPeriod : "+this.contractForm.controls.ReqTotalPeriod.value);
    console.log(" this.MinPeriod : "+this.MinPeriod);
    console.log(" this.MaxPeriod : "+this.MaxPeriod);

    if (this.contractForm.controls.ReqTotalPeriod.value < this.MinPeriod) {
      console.log(" value < this.MinPeriod ");
      this.contractForm.controls.ReqTotalPeriod.setErrors({ 'minPeriod': true })
      return;
    } else if (this.contractForm.controls.ReqTotalPeriod.value > this.MaxPeriod) {
      console.log(" value > this.MaxPeriod ");
      this.contractForm.controls.ReqTotalPeriod.setErrors({ 'maxPeriod': true })
      return;
    } else {
      console.log(" getRegTotalMonth start calculate "+this.contractForm.controls.ReqTotalPeriod.value+" x "+this.contractForm.controls.ReqGapPeriod.value);
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
  getInterestAllmax(ApproveAmount, loantypecode, callBy) {
    //console.log(" into getInterestAllmax(ApproveAmount "+ ApproveAmount + "loantypecode) ",loantypecode+" CallBy : "+callBy)
    this.lots04Service.getMaxInterestRate({
      CustomerCode: this.contractForm.controls.CustomerCode.value,
      ContractType: this.contractForm.controls.ContractType.value,
      MainContractNo: (this.contractForm.controls.MainContractNo.value || null),
      LoanAmount: ApproveAmount
    }).subscribe(
      (res) => {
        //console.log(" start res ")
        //console.log(res)
        //console.log(" end res ")
        //console.log(" start this.loanTypeData ")
        //console.log(this.loanTypeData)
        //console.log(" end this.loanTypeData ")
        let type = this.loanTypeData.find(o => { return o.Value == loantypecode }) || {};
        //console.log(" start type ")
        //console.log(type) //query บนmaster ไม่มี loanTypeData  ของIlo7 
        //console.log(" end type ") //ไม่เจอ Ilo7
        if (res == 'B') {
          this.contractForm.controls.MaximumInterestRate.setValue(type.InterestAllMax2)
          this.contractForm.controls.MaximumInterestRateDisplay.setValue(type.InterestAllMax2Display)
        } else {
          this.contractForm.controls.MaximumInterestRate.setValue(type.InterestAllMax)
          this.contractForm.controls.MaximumInterestRateDisplay.setValue(type.InterestAllMaxDisplay)
        }
        //console.log(" end getInterestAllmax(ApproveAmount, loantypecode) ")
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
    //console.log(" into resetSecrurities ------====")
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
      // console.log(" set total amount ")
      this.contractForm.controls.TotalAmount.setValue(null);
    }
  }

  // เช็คยอดเงินกู้ไม่เกินความสามารถในการกู้
  checkMainLoanAmout(mainLoanamout, reqLoanAmount) {
    //console.log(" into checkMainLoanAmout  ");
    if ((reqLoanAmount > 0) && (mainLoanamout > 0)) {
      //console.log(" (reqLoanAmount > 0) && (mainLoanamout > 0)  ");
      if (reqLoanAmount > mainLoanamout) {
        //console.log(" reqLoanAmount > mainLoanamout  ");
        this.maxLoanMsg = true;
        this.contractForm.controls.ReqLoanAmount.setErrors({ 'over': true });
        //console.log(" ReqLoanAmount valid : "+this.contractForm.controls.ReqLoanAmount.invalid);
      } else {
        //console.log(" !(reqLoanAmount > mainLoanamout)  ");
        this.maxLoanMsg = false;
        this.contractForm.controls.ReqLoanAmount.setErrors(null);
        //console.log(" ReqLoanAmount valid : "+this.contractForm.controls.ReqLoanAmount.invalid);
      }
      return this.maxLoanMsg
    }
    return null;
  }

  // เช็คยอดเงินกู้ไม่เกินความสามารถในการกู้ กับ ยอดรวมหลักทรัพย์
  // checkMainAmountSecrurities() {
  //   //console.log(" into checkMainAmountSecrurities ------====")
  //   let mainAmount = this.contractForm.controls.MainLoanPrincipleAmount.value;
  //   let total = this.summary() ? this.summary() : 0; //this.contractForm.controls.TotalAmount.value;
  //   let maxAmount = this.securitiesPer ? total * this.securitiesPer / 100 : total;
  //   this.mainLoanRefinanceAdditionalMsg = false;
  //   this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);

  //   if (mainAmount == null) {
  //     if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y'&& this.checkStatus!='CR' ) {
  //       this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'required': true });
  //     }
    
  //   } else if (this.closeRefinance) {
  //     if (mainAmount < this.MainOldContractLoanPrincipleAmount) {
  //       if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y'  && this.checkStatus!='CR'){
  //         this.mainLoanRefinanceMsg = true;
  //         this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'lessthanLoanCloseRefinance': true });
  //       }
  //     } else if (!this.RefinanceAdditionalPayment) {
  //       if (!this.IsCompanyCapital) {
  //         if (this.contractForm.controls.CategoryId.value == 3) {
  //           if ((mainAmount > numeral(this.MainOldContractLoanPrincipleAmount).add(numeral(100).subtract(this.MainOldContractLoanPrincipleAmount % 100).value()).value())) {
  //             if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //               this.mainLoanRefinanceAdditionalMsg = true;
  //               console.log("this.mainLoanRefinanceAdditionalMsg = true");
  //               this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'refinanceAdditionalPayment': true });
  //             }
  //           } else{
  //             if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //               this.mainLoanRefinanceAdditionalMsg = false;
  //               this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
  //             }
  //           }
  //         } else {
  //           if (!this.RefinanceAdditionalPayment && (mainAmount > numeral(this.MainOldContractLoanPrincipleAmount).add(numeral(1000).subtract(this.MainOldContractLoanPrincipleAmount % 1000).value()).value())) {
  //             if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //               this.mainLoanRefinanceAdditionalMsg = true;
  //               console.log("this.mainLoanRefinanceAdditionalMsg = true");
  //               this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'refinanceAdditionalPayment': true });
  //             }
  //           }else{
  //             if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //               this.mainLoanRefinanceAdditionalMsg = false;
  //               this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
  //             }
  //           }
  //         }
  //       }
  //     } else {
  //       if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //         this.mainLoanRefinanceMsg = false;
  //         this.mainLoanRefinanceAdditionalMsg = false;
  //         this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
  //       }
  //     }

  //     if ((maxAmount >= 0) && mainAmount > maxAmount) {
  //       if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //         this.overLoanTypeMax = true;
  //         this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'overLoanTypeMax': true });
  //       }
  //     } else {
  //       if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //         this.overLoanTypeMax = false;
  //         this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
  //       }
  //     }
  //   } else if (this.LoanTypeMax) {
  //     if ((maxAmount >= 0) && maxAmount <= this.LoanTypeMax) {
  //       if ((mainAmount > 0) && mainAmount > maxAmount) {
  //         if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //           this.mainLoanMsg = true;
  //           this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'over': true });
  //         }
        
  //       } else {
  //         if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //           this.mainLoanMsg = false;
  //           this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
  //         }
    
  //       }
  //     } else {
  //       if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //         this.mainLoanMsg = false;
  //         this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);

  //         if ((mainAmount > 0) && mainAmount > this.LoanTypeMax) {
  //           this.overLoanTypeMax = true;
  //           this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'overLoanTypeMax': true });
  //         } else {
  //           this.overLoanTypeMax = false;
  //           this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
  //         }
  //       }
        
  //     }
  //   } else if (this.ContractMaximumLimitBorrower == 0) {
  //     let maxmimumCusMainLoanAmount = 0;
  //     if (this.MaxLoanAmount) {
  //       maxmimumCusMainLoanAmount = numeral(this.MaxLoanAmount).subtract(this.P36U).subtract(this.P28U).value();
  //     } else {
  //       maxmimumCusMainLoanAmount = numeral(this.P36U).subtract(this.P28U).value();
  //     }

  //     if (this.contractForm.controls.MainLoanPrincipleAmount.value > maxmimumCusMainLoanAmount) {
  //       if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //         this.mainCusLoanMsg = true;
  //         this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'overLoanCusAmount': true });
  //       }
        
  //     } else {
  //       if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //         this.mainCusLoanMsg = false;
  //         this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
  //       }
      
  //     }
  //   } else {
  //     if ((maxAmount >= 0) && mainAmount > maxAmount) {
  //       if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //         this.overLoanTypeMax = true;
  //         this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'overLoanTypeMax': true });
  //       }
      
  //     } else {
  //       if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //         this.overLoanTypeMax = false;
  //         this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
  //       }
  //     }
  //   }

  //   if (this.LoanTypeMax < maxAmount) {
  //     //console.log(" set total amount ")
  //     if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //       this.contractForm.controls.TotalAmount.setValue(this.LoanTypeMax, { emitEvent: false });
  //     }
      
  //   } else {
  //     //console.log(" set total amount ")
  //     if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //       this.contractForm.controls.TotalAmount.setValue(maxAmount, { emitEvent: false });
  //     }
      
  //   }
  // }

  //----------------------------Copy------------------------------
  // เช็คยอดเงินกู้ไม่เกินความสามารถในการกู้ กับ ยอดรวมหลักทรัพย์
  checkMainAmountSecrurities() {
    let mainAmount = this.contractForm.controls.MainLoanPrincipleAmount.value;
    let total = this.summary() ? this.summary() : 0; //this.contractForm.controls.TotalAmount.value;
    // let maxAmount = this.securitiesPer ? total * this.securitiesPer / 100 : total;
    let maxAmount = total < this.contractForm.controls.TotalAmount.value ? this.contractForm.controls.TotalAmount.value : total;
    this.mainLoanRefinanceAdditionalMsg = false;
    this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);

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
              if(!this.checkDisableContractStatus()){
                this.mainLoanRefinanceAdditionalMsg = true;
                this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'refinanceAdditionalPayment': true });
              }
            }
          } else {
            if(!this.checkDisableContractStatus()){
              if (!this.RefinanceAdditionalPayment && (mainAmount > numeral(this.MainOldContractLoanPrincipleAmount).add(numeral(1000).subtract(this.MainOldContractLoanPrincipleAmount % 1000).value()).value())) {
                this.mainLoanRefinanceAdditionalMsg = true;
                this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'refinanceAdditionalPayment': true });
              }
            }
          }
        }
      } else {
        if(!this.checkDisableContractStatus()){
          this.mainLoanRefinanceAdditionalMsg = false;
          this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
        }
      }

      if ((maxAmount >= 0) && mainAmount > maxAmount) {
        if(!this.checkDisableContractStatus()){
          this.overLoanTypeMax = true;
          this.contractForm.controls.MainLoanPrincipleAmount.setErrors({ 'overLoanTypeMax': true });
        }
      } else {
        if(!this.checkDisableContractStatus()){
          this.overLoanTypeMax = false;
          this.contractForm.controls.MainLoanPrincipleAmount.setErrors(null);
        }
      }
    } else if (this.compose) {
      if(!this.checkDisableContractStatus()){
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
      }
    } else if (this.LoanTypeMax) {
      if(!this.checkDisableContractStatus()){
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
      }
    } else if (this.ContractMaximumLimitBorrower == 0) {
      if(!this.checkDisableContractStatus()){
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
      }
    } else {
      if(!this.checkDisableContractStatus()){
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
  }
  //----------------------------End Copy---------------------------

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

 
  // // เช็คยอดเงินกู้ไม่เกินตามผู้กู้หลักในแต่ละสาขา
  // checkMaxLoanAmountByCustomer(customerCode) {
  //   if (customerCode) {
  //     this.lots04Service.getCheckMaxLoanAmountByCustomerCompany({
  //       CustomerCode: customerCode,
  //       LoanAmount: (this.contractForm.controls.ReqLoanAmount.value || 0),
  //       RefinanceAmount: this.refinanceAmount,
  //       ProgramCode: "LOTS04",
  //       ContractNo: "Z",
  //     }).subscribe(
  //       (res) => {
  //         if (!res) {
  //           if (this.ContractType == '0') {
  //             //console.log("set on this 0")
  //             this.contractForm.controls.CustomerNameTha.setErrors(null);
  //             this.contractForm.controls.CustomerNameEng.setErrors(null);
  //           } else if (this.ContractType == '2') {
  //             //console.log("set on this 2")
  //             this.contractForm.controls.CustomerNameTha.setErrors(null);
  //             this.contractForm.controls.CustomerNameEng.setErrors(null);
  //           } else if (this.ContractType == '3') {
  //             //console.log("set on this 3")
  //             this.contractForm.controls.CustomerNameTha.setErrors(null);
  //             this.contractForm.controls.CustomerNameEng.setErrors(null);
  //           } else {
  //             //console.log("set on this ")
  //             // this.contractForm.controls.CustomerNameTha.setErrors({ 'invalid': true });
  //             // this.contractForm.controls.CustomerNameEng.setErrors({ 'invalid': true });
  //             //console.log("CustomerNameTha invalid :  "+this.contractForm.controls.CustomerNameTha.invalid);
  //             if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //               this.contractForm.controls.CustomerNameTha.setErrors({ 'maxLoanAmount': true });
  //               this.contractForm.controls.CustomerNameEng.setErrors({ 'maxLoanAmount': true });
  //               //console.log("CustomerNameTha maxLoanAmount :  "+this.contractForm.controls.CustomerNameTha.errors.maxLoanAmount)
  //               if(this.contractForm.controls.CustomerNameTha.errors.maxLoanAmount) this.OverLimitedLoanAmount = true;
  //               //console.log("this.OverLimitedLoanAmount :  "+this.OverLimitedLoanAmount)
  //             }
  //           }
  //         }
  //       }
  //     )
  //   }
  // }
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
              if(!this.checkDisableContractStatus()){
                this.contractForm.controls.CustomerName.setErrors(null);
              }
            } else {
              if(!this.checkDisableContractStatus()){
                this.contractForm.controls.CustomerName.setErrors({ 'maxLoanAmount': true });
              }
            }
          }
        }
      )
    }
  }

  // เช็คยอดเงินกู้ไม่เกินตามผู้กู้หลักของสัญญา
  // checkMaxLoanAmount(reqLoanAmount, reqTotal) {
  //   //console.log(" let check MaxLoanAmount ");
  //   if (this.contractForm.controls.CustomerCode.value) {
  //     this.lots04Service.getCheckMaxLoanAmount({
  //       CustomerCode: this.contractForm.controls.CustomerCode.value,
  //       LoanAmount: (this.contractForm.controls.ReqLoanAmount.value || 0),
  //       RefinanceAmount: this.refinanceAmount,
  //       ProgramCode: "LOTS25",
  //       ContractNo: "Z",
  //     }).subscribe(
  //       (res) => {
  //         // console.log(" response checkMaxLoanAmount ");
  //         // console.log(" reqLoanAmount : "+reqLoanAmount);
  //         // console.log(" this.maxLoanAmount : "+this.maxLoanAmount);
  //         // console.log(" res : "+res);
  //         // console.log(" result : "+(reqLoanAmount > 0 && reqLoanAmount <= this.maxLoanAmount  && res == true));
  //         if (reqLoanAmount > 0
  //           && reqLoanAmount <= this.maxLoanAmount
  //           && res == true) {
  //           //console.log(" reqLoanAmount > 0 && reqLoanAmount <= this.maxLoanAmount  && res == true ");
      
  //           if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //             this.maxLoanMsg = false;
  //             this.contractForm.controls.ReqLoanAmount.setErrors(null);
  //           }
  //           //console.log(" ReqLoanAmount valid : "+this.contractForm.controls.ReqLoanAmount.invalid);
  //         } else if (this.ContractType == '0') {
  //           //console.log(" this.ContractType == '0' ");
            
  //           if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //             this.maxLoanMsg = false;
  //             this.contractForm.controls.ReqLoanAmount.setErrors(null);
  //           }
  //           //console.log(" ReqLoanAmount valid : "+this.contractForm.controls.ReqLoanAmount.invalid);
  //         } else {
  //           //console.log(" else ");
            
  //           if(!this.checkDisableContractStatus()){//if(this.checkStatus!='Y' && this.checkStatus!='CR'){
  //             this.maxLoanMsg = true;
  //             this.contractForm.controls.ReqLoanAmount.setErrors({ 'invalid': true });
  //           }
  //           //console.log(" ReqLoanAmount valid : "+this.contractForm.controls.ReqLoanAmount.invalid);
  //         }
  //       }
  //     )
  //   }
  // }

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
            if(!this.checkDisableContractStatus()){
              this.maxLoanMsg = false;
              this.contractForm.controls.ReqLoanAmount.setErrors(null);
            }
          } else if (this.ContractType == '0' || this.ContractType == '2' || this.ContractType == '3' || this.ContractType == '4') {
            if(!this.checkDisableContractStatus()){
              this.maxLoanMsg = false;
              this.contractForm.controls.ReqLoanAmount.setErrors(null);
            }
          } else {
            if(!this.checkDisableContractStatus()){
              this.maxLoanMsg = true;
              this.contractForm.controls.ReqLoanAmount.setErrors({ 'invalid': true });
            }
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
    //console.log(" into summaryTotalLoanAmount()  ")
    if (this.contractForm.controls.ContractType.value == 'M') {
      // console.log(" if (this.contractForm.controls.ContractType.value == 'M') ");
      // console.log(this.contractBorrowers);
      let total = this.contractBorrowers.value.map(row => row.LoanAmount == null ? 0 : row.LoanAmount)
        .reduce((res, cell) => res += cell, 0);

      this.TotalBorrowersLoanAmount = total;
      // console.log(" this.TotalBorrowersLoanAmount : "+this.TotalBorrowersLoanAmount)
      // console.log(" total : "+total)
      return total;
    }
  }

  summaryDeptLeft() {
    // console.log(" into summaryDeptLeft ");
    // console.log(" this.MaxLoanAmount :  "+this.MaxLoanAmount);
    // console.log(" this.mainDebtAmount :  "+this.mainDebtAmount);
    if (this.MaxLoanAmount) {
      this.TotalMainLoanAmount = this.MaxLoanAmount - this.mainDebtAmount;
    } else {
      this.TotalMainLoanAmount = 0;
    }
    //console.log(" Final this.TotalMainLoanAmount : "+this.TotalMainLoanAmount);
    return this.TotalMainLoanAmount
  }

  summaryAmountForBorrowers() {
    // console.log(" into summaryAmountForBorrowers ");
    // console.log(" ContractType : "+this.contractForm.controls.ContractType.value);
    // console.log(" MainLoanPrincipleAmount : "+this.contractForm.controls.MainLoanPrincipleAmount.value);
    // console.log(" TotalMainLoanAmount : "+this.TotalMainLoanAmount);
    if (this.contractForm.controls.ContractType.value == 'M' && this.contractForm.controls.MainLoanPrincipleAmount.value > this.TotalMainLoanAmount) {
      this.AmountForBorrowers = this.contractForm.controls.MainLoanPrincipleAmount.value - this.TotalMainLoanAmount;
      //console.log(" return this.AmountForBorrowers : "+this.AmountForBorrowers);
      return this.AmountForBorrowers;
    }
    this.AmountForBorrowers = 0;
    //console.log(" return this.AmountForBorrowers : "+this.AmountForBorrowers);
    return 0
  }

  findPerson() {
    if (this.AmountForBorrowers)
      return Math.ceil(this.AmountForBorrowers / this.maxLoanLimitAmount);
    else
      return 0;
  }

  addBorrower() {
    //console.log(" into addBorrower() ")
    if (this.contractForm.controls.CustomerCode.value == null)
      return this.as.warning('', 'Message.STD00023', ['Label.LOTS04.CustomerCode']);

    if (!this.contractForm.controls.MainLoanPrincipleAmount.value)
      return this.as.warning('', 'Message.LO00002', ['Label.LOTS04.MainLoanPrincipleAmount']);

    let amountLeft = this.AmountForBorrowers;
    // let maxmimumCusMainLoanAmount = numeral(this.MaxLoanAmount).subtract(this.P36U).subtract(this.P28U).subtract(this.L15U).value();
    //console.log(" this.contractForm.controls.CustomerCode.value Is : ", this.contractForm.controls.CustomerCode.value)
    this.modal.openComponent(Borrower25LookupComponent, Size.large, { CustomerMain: this.contractForm.controls.CustomerCode.value }).subscribe(
      (result) => {
        //console.log(" into modal openComponent ")
        result.forEach(element => {

          // let maxmimumBorrowerLoanAmount = numeral(this.ContractMaximumLimitBorrower).subtract(element.P36U).subtract(element.P28U).subtract(element.L15U).value();
          // if (numeral(this.contractForm.controls.MainLoanPrincipleAmount.value).subtract(maxmimumCusMainLoanAmount).value() > maxmimumBorrowerLoanAmount) {
          //   return this.as.warning('', 'Message.LO00055');
          // }

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
        item.Id === detail.controls.Id.value
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
    //console.log(" into removeRowSecurities ------====")
    let detail = this.contractSecuritiess.at(index) as FormGroup;
  
    if (detail.controls.RowState.value !== RowState.Add) {
      detail.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
      this.ContractSecuritiesDeleting.push(detail.getRawValue());
    }


    let rows = [...this.contractSecuritiess.value];
    rows.splice(index, 1);

    this.contractSecuritiess.patchValue(rows, { emitEvent: false });
    this.contractSecuritiess.removeAt(this.contractSecuritiess.length - 1);
    this.contractSecuritiess.markAsDirty();

    if (this.contractSecuritiess.length === 0) {
      this.cateSecurities = null;
      //console.log(" set total amount ")
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
    } else {
      //this.contractForm.controls.CategoryId.setValue(null, { emitEvent: false });
      this.LoanContractType = null;
      this.contractForm.controls.LoanTypeCode.setValue(null);
      this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
      this.contractForm.controls.ReqTotalPeriod.setValue(null);
    }
  }
  //------------New Remove Row Securities-----------------
  // removeRowSecurities(index) {
  //   let detail = this.contractSecuritiess.at(index) as FormGroup;
  //   if (detail.controls.RowState.value !== RowState.Add) {
  //     // เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
  //     const deleting = this.contractHead.ContractSecurities.find((item) =>
  //       item.Id === detail.controls.ContractSecuritiesId.value
  //     );
  //     deleting.RowState = RowState.Delete;
  //   }


  //   let rows = [...this.contractSecuritiess.value];
  //   rows.splice(index, 1);

  //   this.contractSecuritiess.patchValue(rows, { emitEvent: false });
  //   this.contractSecuritiess.removeAt(this.contractSecuritiess.length - 1);
  //   this.contractSecuritiess.markAsDirty();

  //   if (this.contractSecuritiess.length === 0) {
  //     this.cateSecurities = null;
  //     this.contractForm.controls.TotalAmount.setValue(null)
  //   }

  //   if (this.contractSecuritiess.length > 0) {
  //     let priority = null;
  //     let categoryId = null;
  //     this.contractSecuritiess.value.forEach(element => {
  //       if (priority == null) {
  //         priority = element.Priority;
  //         categoryId = element.CategoryId;
  //       } else {
  //         if (priority > element.Priority) {
  //           priority = element.Priority
  //           categoryId = element.CategoryId
  //         }
  //       }
  //     });
  //     this.contractForm.controls.CategoryId.setValue(categoryId, { emitEvent: false });
  //   } else {
  //     this.contractForm.controls.CategoryId.setValue(null, { emitEvent: false });
  //     this.LoanContractType = null;
  //     this.contractForm.controls.LoanTypeCode.setValue(null);
  //     this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
  //     this.contractForm.controls.ReqTotalPeriod.setValue(null);
  //   }
  // }
  //-----------------End Remove-------------------------------

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
        item.Id === detail.controls.Id.value
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
        item.Id === detail.controls.Id.value
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
    // console.log(" into processPeriod()  ")
    // console.log(" this.contractForm.controls.ApprovedDate :  ", this.contractForm.controls.ApprovedDate.value)
    // console.log(" this.contractForm.controls.TransferDate :  ", this.contractForm.controls.TransferDate.value)
    // console.log(" this.contractForm.controls.StartInterestDate :  ", this.contractForm.controls.StartInterestDate.value)
    // console.log(" this.contractForm.controls.StartPaymentDate :  ", this.contractForm.controls.StartPaymentDate.value)
    // console.log(" this.contractForm.controls.AppLoanPrincipleAmount :  ", this.contractForm.controls.AppLoanPrincipleAmount.value)
    // console.log(" this.contractForm.controls.AppLoanTotalPeriod :  ", this.contractForm.controls.AppLoanTotalPeriod.value)
    // console.log(" this.contractForm.controls.AppLoanInterestRate :  ", this.contractForm.controls.AppLoanInterestRate.value)
    // console.log(" this.contractForm.controls.AppLoanInterestAmount :  ", this.contractForm.controls.AppLoanInterestAmount.value)
    // console.log(" this.contractForm.controls.AppLoanPeriodAmount :  ", this.contractForm.controls.AppLoanPeriodAmount.value)
    // console.log(" this.contractForm.controls.AppLoanAmountTotal :  ", this.contractForm.controls.AppLoanAmountTotal.value)


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
      //console.log(" data is not enough!!  End process  ")
      return;
    }

    // console.log(this.contractPeriods);
    // console.log(typeof this.contractPeriods);
    if (this.contractPeriods.length > 0) {
      while (this.contractPeriods.length !== 0) {
        this.contractPeriods.removeAt(0)
      }
    }
    this.getPeriod();
    //   }
    //   return;
    // });
  }

  onCancelRequestReFinance() {
    return this.modal.confirm("Message.LO00074").subscribe(
        (val) => {
            if (val) {
                this.cancelRequestContract();
            }
            else {
                return;
            }
        }
    )

  }

  cancelRequestContract(){
    this.processing = true;
    this.saving = true;
    var checkError = true;
    this.lots04Service.checkApproverIsnotCustomer(this.employeeIdCard,this.contractHead.CustomerCode).subscribe((res0: any) => { 

      if (!res0){
        //this.as.warning('', 'ไม่สามารถทำรายการได้เนื่องจากข้อมูลพนักงานและข้อมูลลูกค้าเป็นบุคคลเดียวกัน', );
        this.processing = false;
        this.saving = false;
        this,checkError = false;
        throw this.as.error('', 'ไม่สามารถทำรายการได้เนื่องจากข้อมูลพนักงานและข้อมูลลูกค้าเป็นบุคคลเดียวกัน');
      }
          this.lots04Service.cancelRequestContract(this.contractHead).pipe(
            tap(res => {
              if(res.response!="success"){
                if(res.response=="error"){
                  this.processing = false;
                  this.saving = false;
                  this,checkError = false;
                  this.lots04Service.getContractManageGetDetail(this.contractHead.Id,null).subscribe((res)=>{
                    this.contractHead = res;
                    this.rebuildForm('AfterSave');
                })
                  throw this.as.error('', 'ยกเลิกเอกสารไม่สำเร็จ');
                }else {
                  this.processing = false;
                  this.saving = false;
                  this,checkError = false;
                  this.lots04Service.getContractManageGetDetail(this.contractHead.Id,null).subscribe((res)=>{
                      this.contractHead = res;
                      this.rebuildForm('AfterSave');
                  })
                  throw this.as.error('', 'ไม่สามารถยกเลิกเอกสารได้');
                }
              }
            }),
            switchMap((id) => this.lots04Service.getContractManageGetDetail(this.contractHead.Id || id,null)),
            ).subscribe(
              (res:any)=>{
                this,checkError = false;
                console.log(res);
                this.processing = false;
                this.saving = false;
                this.contractHead = res;
                this.as.success('', 'Message.STD00006');
                this.rebuildForm('AfterSave');
                this.status = 1;
                window.scrollTo(0, 0);
                this.ContractMgmEmployeeDeleting = [];
                this.ContractMgmDeleting = [];
                this.ContractNotiDeleting = [];
                this.ContractSecuritiesDeleting = [];
              },
              error=>{

              },
              () => {
                if(this,checkError){
                  this.processing = false;
                  this.saving = false;
                  
                }
              }
          )
      });
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
      //if(this.checkDisableContractStatus()) this.contractForm.controls.AppLoanAmountTotal.disable();
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
    console.log(" ========================== values : ",values);
    Object.assign(this.contractHead, values);
    this.contractHead.IsDisableAttachment = false;
    this.contractHead.ReqType = 'M';
    this.contractHead.RequestStatus = 'I';
    if(this.contractHead.OldContractId == 0) this.contractHead.OldContractId = null;
    const borrowers = this.contractBorrowers.getRawValue();
    console.log(" ========================== companyCode : ",this.contractHead.CompanyCode);
    //add
    const addingBorrowers = borrowers.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.contractHead.ContractBorrower.map(detail => {
      return Object.assign(detail, borrowers.filter(item => item.RowState == RowState.Edit).find((item) => {
        return detail.Id == item.Id
      }));
    })
    //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.contractHead.ContractBorrower = this.contractHead.ContractBorrower.filter(item => item.RowState !== RowState.Add).concat(addingBorrowers);

    const getContractSecurities = this.contractSecuritiess.getRawValue();
    const ContractSecuritiesAdding = getContractSecurities.filter(function (item) {
      return item.rowState === RowState.Add;
    });
    this.contractHead.ContractSecurities = getContractSecurities;
    this.contractHead.ContractSecurities.map(conSecu => {
      return Object.assign(conSecu, getContractSecurities.concat(this.ContractSecuritiesDeleting).find((o) => {
        return o.Id === conSecu.Id;
      }));
    });
    this.contractHead.ContractSecurities = this.contractHead.ContractSecurities.concat(ContractSecuritiesAdding);
    this.contractHead.ContractSecurities = this.contractHead.ContractSecurities.concat(this.ContractSecuritiesDeleting);

    const IncomeItems = this.contractIncomeItems.getRawValue();
    //add
    const addingIncomeItems = IncomeItems.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.contractHead.ContractIncomeItem.map(detail => {
      return Object.assign(detail, IncomeItems.filter(item => item.RowState == RowState.Edit).find((item) => {
        return detail.Id == item.Id
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
        return detail.Id == item.Id
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
    
    //this.contractHead.ContractInformation = this.contractHead.ContractInformation.filter(item => item.RowState !== RowState.Add && item.RowState !== null).concat(addingInformations);
    //remove ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.contractHead.ContractInformation.map(info => {
        return Object.assign(info, Informations.filter(item => item.RowState == RowState.Edit || item.RowState == RowState.Delete).find((item) => {
          if(info.ContractHeadId !=0 && null != info.ContractHeadId) item.ContractHeadId = info.ContractHeadId ;
          return info.InformationId == item.InformationId
        }));
      })
    
    //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.contractHead.ContractInformation = this.contractHead.ContractInformation.filter(item => item.RowState !== RowState.Add && item.RowState !== null).concat(addingInformations);
    
    let data = this.contractHead.ContractInformation.filter(x => x.InformationId == 13)
    if (data && data.length > 0) {
      data[0].AddOn = this.contractForm.controls.AddOn.value;
      if(data[0].RowState==0)data[0].RowState = RowState.Edit;
      if(data[0].RowState==3)this.contractForm.controls.AddOn.setValue(null);
    }
    // const guarantors = this.contractGuarantors.getRawValue();
    // //add
    // const addingGuarantors = guarantors.filter(function (item) {
    //   return item.RowState == RowState.Add;
    // });
    // //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    // this.contractHead.ContractGuarantor.map(detail => {
    //   return Object.assign(detail, guarantors.filter(item => item.RowState == RowState.Edit).find((item) => {
    //     return detail.ContractGuarantorId == item.ContractGuarantorId
    //   }));
    // })
    // //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    // this.contractHead.ContractGuarantor = this.contractHead.ContractGuarantor.filter(item => item.RowState !== RowState.Add).concat(addingGuarantors);


    const periods = this.contractPeriods.getRawValue();
    //add
    const addingPeriods = periods.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.contractHead.ContractPeriod.map(detail => {
      return Object.assign(detail, periods.filter(item => item.RowState == RowState.Edit).find((item) => {
        return detail.Id == item.Id
      }));
    })
    //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.contractHead.ContractPeriod = this.contractHead.ContractPeriod.filter(item => item.RowState !== RowState.Add).concat(addingPeriods);

    // Employee
    const getContractMgmEmployee = this.ContractMgmEmployee.getRawValue();
    this.contractHead.ContractMgmEmployee.map(conEmp => {
      return Object.assign(conEmp, getContractMgmEmployee.concat(this.ContractMgmEmployeeDeleting).find((o) => {
        return o.Id === conEmp.Id && o.CompanyCode === conEmp.CompanyCode && o.EmployeeCode === conEmp.EmployeeCode;
      }));
    });

    const ContractMgmEmployeeAdding = getContractMgmEmployee.filter(function (item) {
      return item.rowState === RowState.Add;
    });

    this.contractHead.ContractMgmEmployee = this.contractHead.ContractMgmEmployee.concat(ContractMgmEmployeeAdding);
    this.contractHead.ContractMgmEmployee = this.contractHead.ContractMgmEmployee.concat(this.ContractMgmEmployeeDeleting);

    //  // -----------------------------------------------------contractAttachments--------------------------------------------------------
    //  const attachments = this.contractAttachments.getRawValue();
    //  //add
    //  const adding = attachments.filter(function (item) {
    //      return item.RowState == RowState.Add;
    //  });
    //  //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    //  this.contractHead.ContractAttachment.map(attach => {
    //      return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).find((item) => {
    //          return attach.ContractAttachmentId == item.ContractAttachmentId
    //      }));
    //  })
    //  this.contractHead.ContractAttachment = this.contractHead.ContractAttachment.filter(item => item.RowState !== RowState.Normal && item.RowState !== RowState.Add).concat(adding);

    // Mgm
    const getContractMgm = this.ContractMgm.getRawValue();
    const ContractMgmAdding = getContractMgm.filter(function (item) {
      return item.rowState === RowState.Add;
    });

    this.contractHead.ContractMgm.map(conEmp => {
      return Object.assign(conEmp, getContractMgm.concat(this.ContractMgmDeleting).find((o) => {
        return o.Id === conEmp.Id && o.MgmCode === conEmp.MgmCode;
      }));
    });
    this.contractHead.ContractMgm = this.contractHead.ContractMgm.concat(ContractMgmAdding);
    this.contractHead.ContractMgm = this.contractHead.ContractMgm.concat(this.ContractMgmDeleting);

  }

  prepareSaveToConfirmTable(values: object) {

    Object.assign(this.loContractHead, values);
    console.log(" show this.loContractHead ");
    this.loContractHead.ContractHeadId = 0;
    this.loContractHead.ContractNo = null;
    this.loContractHead.ContractStatus = 'N';
    this.loContractHead.ReqType = 'M';
    this.loContractHead.ReqNo = this.loContractHead.RequestNumber;
    if(this.loContractHead.OldContractId==0) this.loContractHead.OldContractId = null;
    //if(this.contractHead.OldContractId==0) this.contractHead.OldContractId = null;
   
    console.log(this.loContractHead);
    console.log(" end this.loContractHead ");

    //this.contractHead.IsDisableAttachment = false;
    const borrowers = this.contractBorrowers.getRawValue();
    this.loContractHead.ContractBorrower = borrowers;
  
    for (var i = 0; i < this.loContractHead.ContractBorrower.length; i++) {
      this.loContractHead.ContractBorrower[i].RowState = RowState.Add;
      this.loContractHead.ContractBorrower[i].ContractBorrowerId = 0;
      this.loContractHead.ContractBorrower[i].ContractHeadId = 0;
    }
    //this.loContractHead.ContractBorrower.push(this.loContractBorrowerForm(this.loContractHead.ContractBorrower[i] as LoContractBorrower));
    // console.log(" show this.loContractHead.ContractBorrower ");
    // console.log(this.loContractHead.ContractBorrower);
    // console.log(" end this.loContractHead.ContractBorrower ");


    const getContractSecurities = this.contractSecuritiess.getRawValue();
    this.loContractHead.ContractSecurities = getContractSecurities;
    for (var i = 0; i < this.loContractHead.ContractSecurities.length; i++) {
      this.loContractHead.ContractSecurities[i].RowState = RowState.Add;
      this.loContractHead.ContractSecurities[i].ContractSecuritiesId = 0;
      this.loContractHead.ContractSecurities[i].ContractHeadId = 0;
    }
    //this.loContractHead.ContractBorrower.push(this.loContractBorrowerForm(this.loContractHead.ContractBorrower[i] as LoContractBorrower));
    // console.log(" show this.loContractHead.ContractSecurities ");
    // console.log(this.loContractHead.ContractSecurities);
    // console.log(" end this.loContractHead.ContractSecurities ");

  

    const IncomeItems = this.contractIncomeItems.getRawValue();
    //add
    const addingIncomeItems = IncomeItems.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.contractHead.ContractIncomeItem.map(detail => {
      return Object.assign(detail, IncomeItems.filter(item => item.RowState == RowState.Edit).find((item) => {
        return detail.Id == item.Id
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
        return detail.Id == item.Id
      }));
    })
    //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.contractHead.ContractPaymentItem = this.contractHead.ContractPaymentItem.filter(item => item.RowState !== RowState.Add).concat(addingPaymentItems);

    const items = this.contractHead.ContractIncomeItem.concat(this.contractHead.ContractPaymentItem);

    //var contracts: LoContractItem[] = [];

    // items.map((o) => {
    //   var contract: LoContractItem;
      
    //   contracts.push(contract);
    // })

    Object.assign(this.contractHead.ContractItem, items)
    
    this.loContractHead.ContractIncomeItem = this.contractHead.ContractIncomeItem;
    this.loContractHead.ContractPaymentItem = this.contractHead.ContractPaymentItem;
    this.loContractHead.ContractItem = this.contractHead.ContractItem;


    const Informations = this.contractInformations.getRawValue();
    //add
    const addingInformations = Informations.filter(function (item) {
      item.ContractHeadId = 0;
      return item.RowState == RowState.Add;
    });
        //remove ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.contractHead.ContractInformation.map(info => {
        return Object.assign(info, Informations.filter(item => item.RowState == RowState.Edit || item.RowState == RowState.Delete).find((item) => {
          if(info.ContractHeadId !=0 && null != info.ContractHeadId) item.ContractHeadId = info.ContractHeadId ;   
          return info.InformationId == item.InformationId
        }));
    })
    
    //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.contractHead.ContractInformation = this.contractHead.ContractInformation.filter(item => item.RowState !== RowState.Add && item.RowState !== null).concat(addingInformations);
    
    let data = this.contractHead.ContractInformation.filter(x => x.InformationId == 13)
    if (data && data.length > 0) {
      data[0].AddOn = this.contractForm.controls.AddOn.value;
      if(data[0].RowState==0)data[0].RowState = RowState.Edit;
      if(data[0].RowState==3)this.contractForm.controls.AddOn.setValue(null);
    }
    this.loContractHead.ContractInformation = this.contractHead.ContractInformation;


    //this.loContractHead.ContractBorrower.push(this.loContractBorrowerForm(this.loContractHead.ContractBorrower[i] as LoContractBorrower));
    // console.log(" show this.loContractHead.ContractInformation ");
    // console.log(this.loContractHead.ContractInformation);
    // console.log(" end this.loContractHead.ContractInformation ");
    // //add


    const periods = this.contractPeriods.getRawValue();
    this.loContractHead.ContractPeriod = periods;
    for (var i = 0; i < this.loContractHead.ContractPeriod.length; i++) {
      this.loContractHead.ContractPeriod[i].RowState = RowState.Add;
      this.loContractHead.ContractPeriod[i].ContractPeriodId = 0;
      this.loContractHead.ContractPeriod[i].ContractHeadId = 0;
    }
    //this.loContractHead.ContractBorrower.push(this.loContractBorrowerForm(this.loContractHead.ContractBorrower[i] as LoContractBorrower));
    // console.log(" show this.loContractHead.ContractPeriod ");
    // console.log(this.loContractHead.ContractPeriod);
    // console.log(" end this.loContractHead.ContractPeriod ");
    
    // Employee
    const getContractMgmEmployee = this.ContractMgmEmployee.getRawValue();
    this.loContractHead.ContractMgmEmployee = getContractMgmEmployee;
    for (var i = 0; i < this.loContractHead.ContractMgmEmployee.length; i++) {
      this.loContractHead.ContractMgmEmployee[i].RowState = RowState.Add;
      this.loContractHead.ContractMgmEmployee[i].ContractMgmEmployeeId = null;
      this.loContractHead.ContractMgmEmployee[i].ContractHeadId = null;
    }
    //this.loContractHead.ContractBorrower.push(this.loContractBorrowerForm(this.loContractHead.ContractBorrower[i] as LoContractBorrower));
    // console.log(" show this.loContractHead.ContractMgmEmployee ");
    // console.log(this.loContractHead.ContractMgmEmployee);
    // console.log(" end this.loContractHead.ContractMgmEmployee ");
    
    // Mgm
    const getContractMgm = this.ContractMgm.getRawValue();
    
    this.loContractHead.ContractMgm = getContractMgm;
    for (var i = 0; i < this.loContractHead.ContractMgm.length; i++) {
      this.loContractHead.ContractMgm[i].RowState = RowState.Add;
      this.loContractHead.ContractMgm[i].ContractMgmId = null;
      this.loContractHead.ContractMgm[i].ContractHeadId = null;
    }
    //this.loContractHead.ContractBorrower.push(this.loContractBorrowerForm(this.loContractHead.ContractBorrower[i] as LoContractBorrower));
    // console.log(" show this.loContractHead.ContractMgm ");
    // console.log(this.loContractHead.ContractMgm);
    // console.log(" end this.loContractHead.ContractMgm ");

  }

  alertConfirmMassage(){
      return this.modal.confirm("Message.LO00075").subscribe(
        (val) => {
            if (val) {
                this.finalSubmit();
            }
            else {
                return;
            }
        }
    )
  }

  finalSubmit(){
    this.submitted = true;

    if (this.contractForm.invalid&&!this.contractForm.controls.ReqLoanAmount.invalid) {
      this.focusToggle = !this.focusToggle;
      console.log(" We have problem");
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

    // if (this.chkDupContractGuarantor()) {
    //   return this.as.error("", "Message.STD00004", ["Label.LOTS04.CustomerCodeGuarantor"]);
    // }

    if (this.chkDupContractSecurities()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.customerSecurities"]);
    }

    // if (this.checkSecuritiesCanSave().length == 0) {
    //   return this.as.error("", "Message.STD00004", ["หลักทรัพย์ได้ถูกนำไปสร้างสัญญาแล้วไม่สามารถดำเนินการต่อได้"] );
    // }

    if (this.chkDupIncomeItems()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.income"]);
    }

    if (this.chkDupPaymentItem()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.cost"]);
    }

    // if(this.chkDupBorrowerGuarantor()){
    //   return this.as.error("", "Message.STD00004", ["Label.LOTS04.BorrowerGuarantor"]);
    // }

    // if (this.contractBorrowers.value.length === 0) {
    //   this.as.warning('', 'Message.STD00012', ['Label.LOTS04.customerCard']);
    //   return;
    // }

    // if (this.GuaranteeAssetYN) {
    if (this.contractSecuritiess.value.length === 0 && this.contractForm.controls.LoanTypeCode.value != this.loanTypeExitSecurities) {
      this.as.warning('', 'Message.STD00012', ['Label.LOTS04.customerSecuritiesCard']);
      return;
    }
    // }

    // if(this.GuarantorYN){
    //   if (this.contractBorrowers.value.length === 0) {
    //     this.as.warning('', 'Message.STD00012', ['Label.LOTS04.guarantorCard']);
    //     return;
    //   }
    // }

    if (this.contractBorrowers.value.length > 6) {
      this.as.warning('', 'Message.LO00002', ['Label.LOTS04.CustomerCodeBorrower']);
      return;
    }

    // if (this.contractGuarantors.value.length > 5) {
    //   this.as.warning('', 'Message.LO00002',['Label.LOTS04.GurranteeCode']);
    //   return;
    // }

    if (this.contractForm.controls['OldContractNo'].value) {
      this.contractForm.controls['OldContractNo'].setValue(this.contractForm.controls['OldContractNo'].value.trim());
    }

    if (this.contractForm.invalid&&!this.contractForm.controls.ReqLoanAmount.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.saving = true;
    //this.normalSaving = true;
    this.prepareSave(this.contractForm.getRawValue());
    this.prepareSaveToConfirmTable(this.contractForm.getRawValue());
    //this.lots04Service.saveContractManagement(this.contractHead, this.attachmentFiles).pipe(
    //this.contractHead.CallService = "saveToLoContractHead";
    // console.log(" Start this.contractHead ")
    // console.log(this.contractHead)
    // console.log(this.loContractHead)
    // console.log(" End this.contractHead ")
    // this.saving = false;
    // this.submitted = false;
    this.lots04Service.checkApproverIsnotCustomer(this.employeeIdCard,this.contractHead.CustomerCode).subscribe((res0: any) => { 

      if (!res0){
        this.as.warning('', 'ไม่สามารถทำรายการได้เนื่องจากข้อมูลพนักงานและข้อมูลลูกค้าเป็นบุคคลเดียวกัน', );
        this.saving = false;
        this.submitted = false;
        return;
      }

        this.lots04Service.checkUsedCustomerSecurities(this.contractHead,null).pipe().subscribe((res1: any) => { 
            console.log("Show res1 :"+res1);
            if (!res1){
              this.as.warning('', 'หลักทรัพย์ถูกใช้สร้างสัญญาไปแล้ว', );
              this.saving = false;
              this.submitted = false;
              return;
            }
            this.lots04Service.saveContractManagementAndLoContract(this.contractHead,this.loContractHead).pipe(
              switchMap((id) => this.lots04Service.getContractManageGetDetail(this.contractHead.Id || id,null)),
              finalize(() => {
                this.saving = false;
                this.submitted = false;
              
              }))
              .subscribe((res: ContractHead) => {
                this.contractHead = res;
                this.as.success('', 'Message.STD00006');
                this.rebuildForm('AfterSave');
                this.status = 1;
                window.scrollTo(0, 0);
                this.ContractMgmEmployeeDeleting = [];
                this.ContractMgmDeleting = [];
                this.ContractNotiDeleting = [];
                this.ContractSecuritiesDeleting = [];
              });
        });
    });
    
  }

  onSubmit() {
    this.submitted = true;

    if (this.contractForm.invalid&&!this.contractForm.controls.ReqLoanAmount.invalid) {
      this.focusToggle = !this.focusToggle;
      //console.log(" We have problem");
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

    // if (this.chkDupContractGuarantor()) {
    //   return this.as.error("", "Message.STD00004", ["Label.LOTS04.CustomerCodeGuarantor"]);
    // }

    if (this.chkDupContractSecurities()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.customerSecurities"]);
    }

    // if (this.checkSecuritiesCanSave().length == 0) {
    //   return this.as.error("", "Message.STD00004", ["หลักทรัพย์ได้ถูกนำไปสร้างสัญญาแล้วไม่สามารถดำเนินการต่อได้"] );
    // }

    if (this.chkDupIncomeItems()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.income"]);
    }

    if (this.chkDupPaymentItem()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.cost"]);
    }


    // if (this.GuaranteeAssetYN) {
    if (this.contractSecuritiess.value.length === 0 && this.contractForm.controls.LoanTypeCode.value != this.loanTypeExitSecurities) {
      this.as.warning('', 'Message.STD00012', ['Label.LOTS04.customerSecuritiesCard']);
      return;
    }
    // }

    // if(this.GuarantorYN){
    //   if (this.contractBorrowers.value.length === 0) {
    //     this.as.warning('', 'Message.STD00012', ['Label.LOTS04.guarantorCard']);
    //     return;
    //   }
    // }

    if (this.contractBorrowers.value.length > 6) {
      this.as.warning('', 'Message.LO00002', ['Label.LOTS04.CustomerCodeBorrower']);
      return;
    }

    // if (this.contractGuarantors.value.length > 5) {
    //   this.as.warning('', 'Message.LO00002',['Label.LOTS04.GurranteeCode']);
    //   return;
    // }

    if (this.contractForm.controls['OldContractNo'].value) {
      this.contractForm.controls['OldContractNo'].setValue(this.contractForm.controls['OldContractNo'].value.trim());
    }

    this.normalSaving  = true;
    console.log(" this.contractForm.getRawValue : ",this.contractForm.getRawValue());
    this.prepareSave(this.contractForm.getRawValue());
    // this.lots04Service.saveContractManagement(this.contractHead, this.attachmentFiles).pipe(
    this.lots04Service.checkApproverIsnotCustomer(this.employeeIdCard,this.contractHead.CustomerCode).subscribe((res0: any) => { 

          if (!res0){
            this.as.warning('', 'ไม่สามารถทำรายการได้เนื่องจากข้อมูลพนักงานและข้อมูลลูกค้าเป็นบุคคลเดียวกัน', );
            this.normalSaving = false;
            this.submitted = false;
            return;
          }


      this.lots04Service.checkUsedCustomerSecurities(this.contractHead,null).subscribe((res1: any) => { 
          //console.log("Show res1 :"+res1);
        
          if (!res1){
            this.as.warning('', 'หลักทรัพย์ถูกใช้สร้างสัญญาไปแล้ว', );
            this.normalSaving = false;
            this.submitted = false;
            return;
          }
        this.lots04Service.saveContractManagement(this.contractHead).pipe(
          //switchMap(() => this.lots04Service.getContractDetail()),
          switchMap((id) => this.lots04Service.getContractManageGetDetail(this.contractHead.Id || id,null)),
          finalize(() => {
            this.normalSaving  = false;
            this.submitted = false;
          }))
          .subscribe((res: ContractHead) => {
            // console.log(" Start ==================== >>>   res ");
            // console.log(res)
            // console.log(" End ==================== >>>   res ");
            
            // console.log(' res ------- AppLoanPrincipleAmount : ' + res.AppLoanPrincipleAmount);
            // console.log(' res ------- ReqLoanAmount : ' + res.ReqLoanAmount);

            this.as.success('', 'Message.STD00006');
            window.scrollTo(0, 0);
            this.status = 1;
            this.contractHead = res;
            this.ContractMgmEmployeeDeleting = [];
            this.ContractMgmDeleting = [];
            this.ContractNotiDeleting = [];
            this.ContractSecuritiesDeleting = [];
            // console.log(' contract head ------- AppLoanPrincipleAmount : ' + this.contractHead.AppLoanPrincipleAmount);
            // console.log(' contract head ------- ReqLoanAmount : ' + this.contractHead.ReqLoanAmount);

            this.rebuildForm('AfterSave');
          });
      });
    });
  }

  onSubmitToConfirm() {
    this.submitted = true;

    if (this.contractForm.invalid&&!this.contractForm.controls.ReqLoanAmount.invalid) {
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

    // if (this.chkDupContractGuarantor()) {
    //   return this.as.error("", "Message.STD00004", ["Label.LOTS04.CustomerCodeGuarantor"]);
    // }

    if (this.chkDupContractSecurities()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.customerSecurities"]);
    }

    if (this.checkSecuritiesCanSave().length == 0) {
      return this.as.error("", "Message.STD00004", ["หลักทรัพย์ได้ถูกนำไปสร้างสัญญาแล้วไม่สามารถดำเนินการต่อได้"] );
    } //แก้กลับมาด้วย

    if (this.chkDupIncomeItems()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.income"]);
    }

    if (this.chkDupPaymentItem()) {
      return this.as.error("", "Message.STD00004", ["Label.LOTS04.cost"]);
    }

    // if (this.GuaranteeAssetYN) {
    if (this.contractSecuritiess.value.length === 0 && this.contractForm.controls.LoanTypeCode.value != this.loanTypeExitSecurities) {
      this.as.warning('', 'Message.STD00012', ['Label.LOTS04.customerSecuritiesCard']);
      return;
    }
    // }


    if (this.contractBorrowers.value.length > 6) {
      this.as.warning('', 'Message.LO00002', ['Label.LOTS04.CustomerCodeBorrower']);
      return;
    }


    if (this.contractForm.controls['OldContractNo'].value) {
      this.contractForm.controls['OldContractNo'].setValue(this.contractForm.controls['OldContractNo'].value.trim());
    }

    //this.saving = true;
    this.prepareSaveToConfirmTable(this.contractForm.getRawValue());
    // console.log(" show this.loContractHead ")
    // console.log(this.loContractHead)
    // console.log(" end this.loContractHead ")
    this.lots04Service.saveContract(this.loContractHead).pipe(
      //switchMap(() => this.lots04Service.getContractDetail()),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: LoContractHead) => {
        this.loContractHead = res;
        this.as.success('', 'Message.STD00006');
        this.createForm();
        this.rebuildForm('AfterSave');
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
    // this.statusPage = false;
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

  genNoti() {
    // for Selected to filter
    //console.log(" into genNoti() ")

    var json = {
      ContractHeadId: this.contractHead.Id,
      CustomerCode : this.contractHead.CustomerCode,
      RequestNumber : this.contractHead.RequestNumber,
      RequestType : this.contractHead.RequestType,
      NotiDesc: this.searchNotiForm.controls.NotiDesc.value,
      NotiDate: new Date,
      RowState: 1,
      RowVersion:0
    }

    this.lots04Service.saveContractAndSendNotification(
      json
    ).subscribe((res: ContractNoti) => {
      //console.log(res);

      this.contractNotis.push(
        this.createContractNotiForm(
          res as ContractNoti
      ));


      this.searchNotiForm.controls.NotiDate.setValue(null);
      this.searchNotiForm.controls.NotiDesc.setValue("");
      //this.contractHead = res;
    });
   
    this.closeAddNotiModal(true);
    //this.sendNoti();
  }

  sendNoti() {
    Object.assign(this.contractHead, this.contractForm.getRawValue());
    var json = {
          ContractHeadId: this.contractHead.Id,
          CustomerCode : this.contractHead.CustomerCode,
          RequestNumber : this.contractHead.RequestNumber,
          RequestType : this.contractHead.RequestType,
          NotiDesc: this.searchNotiForm.controls.NotiDesc.value,
          NotiDate: this.searchNotiForm.controls.NotiDate.value,
          RowState: 1,
          RowVersion:0
        }

    this.lots04Service.saveContractAndSendNotification(
      json
    ).subscribe((res) => {
      console.log(res);
      this.searchNotiForm.controls.NotiDate.setValue(null);
      this.searchNotiForm.controls.NotiDesc.setValue("");
      //this.contractHead = res;
    });
  }

  checkSecuritiesCanSave(){
    //console.log(" into checkSecuritiesCanSave() ");
    const customercode = this.contractForm.controls.CustomerCode.value;
    const cateId = this.contractForm.controls.CategoryId.value;
    if (customercode) {
      //console.log(" if (customercode) ")
      //console.log(" Show contractSecuritiesId  ")
      //console.log(contractSecuritiesId)
      //console.log(" End  contractSecuritiesId  ")
      //console.log(" Show contractSecuritiesId  ")
      //console.log(this.contractHead.ContractSecurities)
      //console.log(" End  contractSecuritiesId  ")
      this.customerSecuritiesData = this.customerSecurities.filter(o => {
        // console.log(" o.CustomerCode : "+o.CustomerCode+" customercode : "+customercode);
        // console.log(" o.SecuritiesCategoryId : "+o.SecuritiesCategoryId+" cateId : "+cateId);
        return o.CustomerCode == customercode && o.SecuritiesCategoryId == cateId // && o.refs == true
      })
      console.log(this.customerSecuritiesData)
      return this.customerSecuritiesData;
    }
  }

  cancelAddNoti() {
    // for Selected to filter
    this.searchNotiForm.controls.NotiDate.setValue(null);
    this.searchNotiForm.controls.NotiDesc.setValue("");
    this.closeAddNotiModal(true);
  }

  genMgm() {
    // console.log(" into genMgm() ")
    // console.log(this.attributeSelected)
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
    // console.log(" index : ")
    // console.log(index)
    // console.log(" ==== Show this.ContractMgmEmployee ==== ");
    // console.log(this.ContractMgmEmployee);
    // console.log(" ==== end this.ContractMgmEmployee ==== ");

    const getContractMgmEmployee = this.ContractMgmEmployee.at(index) as FormGroup;

    
    // console.log(" ==== getContractMgmEmployee==== ");
    // console.log(getContractMgmEmployee);
    // console.log(" ==== end getContractMgmEmployee==== ");
   
    if (getContractMgmEmployee.controls.RowState.value !== RowState.Add) {
      // console.log(" ==== getContractMgmEmployee that not Add ==== ");
      // console.log(getContractMgmEmployee);
      // console.log(" ==== end getContractMgmEmployee  that not Add ==== ");
      getContractMgmEmployee.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
      // console.log(" ==== getContractMgmEmployee that set delete ==== ");
      // console.log(getContractMgmEmployee);
      // console.log(" ==== end getContractMgmEmployee  that set delete ==== ");
      this.ContractMgmEmployeeDeleting.push(getContractMgmEmployee.getRawValue());
    }
    const rows = [...this.ContractMgmEmployee.getRawValue()];
    rows.splice(index, 1);

    this.ContractMgmEmployee.patchValue(rows, { emitEvent: false });
    this.ContractMgmEmployee.removeAt(this.ContractMgmEmployee.length - 1);
    this.contractForm.markAsDirty();
  }

  removeRowNoti(index) {
    const getContractNoti = this.contractNotis.at(index) as FormGroup;
    //console.log(getContractNoti.value)
    // if (getContractNoti.controls.RowState.value !== RowState.Add) {
    //   getContractNoti.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
    //   this.ContractNotiDeleting.push(getContractNoti.getRawValue());
    var json = {
          ContractHeadId: this.contractHead.Id,
          CustomerCode : this.contractHead.CustomerCode,
          RequestNumber : this.contractHead.RequestNumber,
          RequestType : this.contractHead.RequestType,
          Id:getContractNoti.value.Id,
          NotiDesc: getContractNoti.value.NotiDesc,
          NotiDate: getContractNoti.value.NotiDate,
          RowState: 3,
          RowVersion:getContractNoti.value.RowVersion
        }

    this.lots04Service.saveContractAndSendNotification(
      json
    ).subscribe((res) => {
      //console.log(res);
      this.searchNotiForm.controls.NotiDate.setValue(null);
      this.searchNotiForm.controls.NotiDesc.setValue("");
      //this.contractHead = res;
    });
    // }

    const rows = [...this.contractNotis.getRawValue()];
    rows.splice(index, 1);

    this.contractNotis.patchValue(rows, { emitEvent: false });
    this.contractNotis.removeAt(this.contractNotis.length - 1);
    this.contractForm.markAsDirty();

    
     
  }

  removeRowMgm(index) {
    // console.log(" into removeRowMgm ")
    // console.log(index)
    // console.log(" end removeRowMgm ")
    const getContractMgm = this.ContractMgm.at(index) as FormGroup;
    if (getContractMgm.controls.RowState.value !== RowState.Add) {
      getContractMgm.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
      this.ContractMgmDeleting.push(getContractMgm.getRawValue());
    }

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
    // console.log(" into checkDuplicateMgm() ")
    // console.log(result)
    // console.log(" ------------------------ ")
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

  openAddNotiModal() {
    this.searchNotiModal();
    this.popupNoti = this.modal.open(this.tplAddNotiModal, Size.large);
  }

  closeMgmEmployeeModal(flag) {
    if (flag) {
      this.popupEmployee.hide();
    }
  }

  closeAddNotiModal(flag) {
    if (flag) {
      this.popupNoti.hide();
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
    // this.statusPage = false;
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

    this.lots04Service.getMgmTable(this.searchMgmForm.value, this.pageMgm)
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

  searchNotiModal() {
    if (this.searchNotiForm.controls['NotiDesc'].value) {
      this.searchNotiForm.controls['NotiDesc'].setValue(this.searchNotiForm.controls['NotiDesc'].value.trim());
    }
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
          if (res && this.contractForm.controls.OldContractId.value == null) {
            this.as.warning('', 'Message.LO00059');
            this.nextStep = false;
          }
        }
      )
    }
  }

  onChange() {
    let a = this.contractInformations.getRawValue().filter(x => x.Active);
    // console.log(" Show Add On ");
    // console.log(a);
    if (a.filter(x => x.InformationId == 13).length > 0) {
      const addon = a.find((o) => o.InformationId == 13);
      this.addOn = true;
      this.contractForm.controls.AddOn.enable();
      //if(this.checkStatus == "Y"|| this.checkStatus == "CR") 
      if(this.checkDisableContractStatus()) this.contractForm.controls.AddOn.disable({ emitEvent: false });
      if (addon.AddOn) {
        //console.log(addon.AddOn);
        this.contractForm.controls.AddOn.setValue(addon.AddOn);
      }
    } else {
      //console.log(" Into else set null ");
      this.addOn = false;
      this.contractForm.controls.AddOn.disable({ emitEvent: false });

    }
  }

  customerDetailOutput(customerDetail) {
    // console.log(" into customerDetailOutput() ")
    // console.log(customerDetail[0])
    if (customerDetail != undefined) {
      this.contractForm.controls.CustomerCode.setValue(customerDetail.CustomerCode);

      this.filterSecuritiesCategories(customerDetail.CustomerCode);
      this.filterContractReFinance(customerDetail.CustomerCode);
      this.checkMaxLoanAmountByCustomer(customerDetail.CustomerCode);
    
      this.mainDebtAmount = customerDetail.DebtAmount;
      //console.log("mainDebtAmount : "+this.mainDebtAmount);
      this.P36U = customerDetail.P36U;
      this.P28U = customerDetail.P28U;
      this.L15U = customerDetail.L15U;
      this.CustomerAge = customerDetail.Age;
    }
  }

  chkMainLoanPrincipleAmount() {
    if (!this.IsCompanyCapital) {
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

  onChangeLoanContractType(typeAmount,method) {
    console.log(" check typeAmount : "+typeAmount);
    console.log(" check new value : "+this.LoanContractType);
    this.contractHead.LoanType = this.LoanContractType;
  
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
    if(method=='init'|| method=='defaultCompany-valueChanges'){
      this.contractForm.controls.MainLoanPrincipleAmount.setValue(this.contractHead.MainLoanPrincipleAmount);
      this.contractForm.controls.ReqTotalPeriod.setValue(this.contractHead.ReqTotalPeriod);
    }else{
      this.contractForm.controls.MainLoanPrincipleAmount.setValue(null);
      this.contractForm.controls.ReqTotalPeriod.setValue(null);
    }
    
    
    console.log(this.LoanContractType);
    this.contractForm.controls.MainLoanPrincipleAmount.enable({ emitEvent: false });
    if (this.LoanContractType == '1') { //100000
      this.contractForm.controls.TotalAmount.setValue(this.typeAmount1); //100000
    } else if (this.LoanContractType == '2') {
      this.contractForm.controls.TotalAmount.setValue(this.typeAmount2);
    } else if (this.LoanContractType == '3') {
      this.contractForm.controls.TotalAmount.setValue(this.typeAmount3);
    } else if (this.LoanContractType == '4') {
      this.contractForm.controls.TotalAmount.setValue(this.typeAmount4);
    } else if (this.LoanContractType == '5') {
      this.contractForm.controls.TotalAmount.setValue(this.typeAmount5);
    }

    if (typeAmount && typeAmount > 0) {
      this.filterLoanTypeC16(method);
    }
  }

  filterLoanTypeC16(method) {
    console.log(" into  filterLoanTypeC16 : ");
    this.lots04Service.getLoanTypeC16(this.contractForm.controls.CategoryId.value, this.contractForm.controls.CustomerCode.value, this.contractForm.controls.CompanyCode.value, this.closeRefinance, this.compose, this.LoanContractType, this.summary() ? this.summary() : 0, this.contractForm.controls.TypeOfPay.value, this.MortgageOnly, this.refinanceType, this.refinanceAmount).subscribe(
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
        console.log(this.loanTypeData);

        if(method=='init'||method=='defaultCompany-valueChanges') this.contractForm.controls.MainLoanPrincipleAmount.setValue(this.contractHead.MainLoanPrincipleAmount);

        if (this.isRefinance && this.refinanceData != null) {
          var loanTypeMatch = res.loanTypes.filter(x => x.Value == this.refinanceData.LoanTypeCode);
          if (loanTypeMatch.length > 0) {
            this.contractForm.controls.LoanTypeCode.setValue(this.refinanceData.LoanTypeCode);
          }
          this.MainOldContractLoanPrincipleAmount = this.refinanceData.MainLoanPrincipleAmount;
          this.contractForm.controls.MainLoanPrincipleAmount.setValue(this.refinanceData.MainLoanPrincipleAmount);

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
              this.contractBorrowers.push(this.contractBorrowersForm(element));
              this.contractBorrowers.markAsDirty();
            });
          }

          this.checkMainAmountSecrurities();
        }
      })
  }

  getMaxLoanAmount(method) {
    this.refinanceType = "";
    this.lots04Service.getMaxLoanAmount(this.contractForm.controls.CategoryId.value, this.contractForm.controls.CustomerCode.value, this.contractForm.controls.CompanyCode.value, this.closeRefinance, this.compose, this.LoanContractType, this.summary() ? this.summary() : 0, this.contractForm.controls.TypeOfPay.value, this.MortgageOnly, this.refinanceType, this.refinanceAmount).subscribe(
      (res) => {
        console.log(" method : ",method);

        console.log(" res ",res);

        console.log(" res1 ",res.Type1);
        console.log(" res2 ",res.Type2);
        console.log(" res3 ",res.Type3);
        console.log(" res4 ",res.Type4);
        console.log(" res5 ",res.Type5);


        this.typeAmount1 = res.Type1;
        this.typeAmount2 = res.Type2;
        this.typeAmount3 = res.Type3;
        this.typeAmount4 = res.Type4;
        this.typeAmount5 = res.Type5;

        

        if(method=='init'||method=='defaultCompany-valueChanges'){
          this.LoanContractType = this.contractHead.LoanType;
          if(this.LoanContractType==1){
            console.log(" this.LoanContractType==1 ");
            console.log(" this.typeAmount1 = "+this.typeAmount1);
            this.onChangeLoanContractType(this.typeAmount1,method)
          }else if(this.LoanContractType==2){
            console.log(" this.LoanContractType==2 ");
            console.log(" this.typeAmount2 = "+this.typeAmount2);
            this.onChangeLoanContractType(this.typeAmount2,method)
          }else if(this.LoanContractType==3){
            console.log(" this.LoanContractType==3 ");
            console.log(" this.typeAmount3 = "+this.typeAmount3);
            this.onChangeLoanContractType(this.typeAmount3,method)
          }else if(this.LoanContractType==4){
            console.log(" this.LoanContractType==4 ");
            console.log(" this.typeAmount4 = "+this.typeAmount4);
            this.onChangeLoanContractType(this.typeAmount4,method)
          }else if(this.LoanContractType==5){
            console.log(" this.LoanContractType==5 ");
            console.log(" this.typeAmount5 = "+this.typeAmount5);
            this.onChangeLoanContractType(this.typeAmount5,method)
          }
        }

      })
  }

  checkBorrowersRefinance() {
    const duplicate = this.contractBorrowers.getRawValue().some((row1) => {
      return this.refinanceBorrowers.some((row2) => {
        return row1.CustomerCode === row2.CustomerCode
      });
    });
    return duplicate;
  }

}
