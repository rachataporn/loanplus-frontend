import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { Page, ModalService, RowState, SelectFilterService, Size, BrowserService, ModalRef } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Lots03Service, ContractSecurities, ContractInformation, ContractItem, ContractHead, ContractAttachment, Report, ReportParam, ReportLorf10, ContractMgmEmployee, ContractMgm, ContractPolicy, ReportVoucher, ContractAttachmentCall } from './lots03.service';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category } from '@app/shared/service/configuration.service';
import { environment } from '@env/environment';
import * as numeral from 'numeral';

@Component({
    templateUrl: './lots03-detail.component.html'
})
export class Lots03DetailComponent implements OnInit {
    envProd = environment.production;
    envName = environment.name;
    saving: boolean;
    submitted: boolean;
    focusToggle: boolean;
    page = new Page();

    @ViewChild('addMgmModal') tplAddMgmModal: TemplateRef<any>;
    @ViewChild('addEmployeeModal') tplAddEmployeeModal: TemplateRef<any>;
    loanAgreementForm: FormGroup;
    searchEmpForm: FormGroup;
    searchMgmForm: FormGroup
    signatureForm: FormGroup;
    //mainContract = {} as ContractHead;
    contractHead = {} as ContractHead
    attachmentFiles: Attachment[] = [];
    attachmentFilesCall: Attachment[] = [];
    attachmentFilesHome: Attachment[] = [];
    attachmentFilesNpl: Attachment[] = [];
    attachmentFilesLaw: Attachment[] = [];
    attachmentFilesOther: Attachment[] = [];
    category = Category.ContractAttachment;
    categoryTracking = Category.TrackingAttachment;
    maxLoanAmount: number = 0;
    maxLoanMsg: boolean = false;
    company = [];
    loanType = [];
    loanTypeData = [];
    pays = [];
    informations = [];
    incomeLoan = [];
    paymentLoan = [];
    customerSecurities = [];
    customerSecuritiesData = [];
    securitiesType = [];
    attachmentTypes = [];
    deletingBorrowers = [];
    deletingSecurities = [];
    deletingIncomeItems = [];
    deletingPaymentItems = [];
    deletingGuarantor = [];
    cateSecurities: string;
    paymentCompanyAccount = [];
    receiveCompanyAccount = [];
    paymentType = [];
    paymentTypeData = [];
    customerReceiveType = [];
    customerReceiveTypeData = [];
    receivePaymentType = [];
    receivePaymentTypeData = [];
    bankAccountType = [];
    banklist = [];
    contractTypeList = [];
    GuaranteeAssetYN: boolean;
    GuarantorYN: boolean;
    tranfersType: string;
    SecuritiesCategories = [];
    customerslist = [];
    companyCode: string;
    AllAccuredBalanceEnding = [];
    AccuredBalanceEnding = [];
    periods = [];
    contractReceivePeriod = []
    pagePeriods = new Page();
    cancelStatus: boolean;
    contractBorrowers = [];
    contractReFinance = [];
    contractReFinanceData = [];
    reFinanceStatus: boolean = false;
    AllContractPeriods = [];
    AllContractReceivePeriod = [];
    Signature = [];
    SignatureDocuments = [];
    selected = [];
    report: Report = {} as Report;
    srcResult: string;
    backToPage: string = null;
    reportParam = {} as ReportParam
    reportLorf10 = {} as ReportLorf10
    reportVoucher = {} as ReportVoucher
    tranfersTypeT: any;
    tranfersTypeM: any;
    popup: ModalRef;
    pageContracPolicy = new Page();
    contractPolicy = {} as ContractPolicy
    contractPolicys = [];
    PolicyPeriodList = [];
    policyPeriodForm: FormGroup;
    ContractPolicyList = [];
    flagAddMgmEmployee: boolean = false;
    pageMgm = new Page();
    pageEmployee = new Page();
    popupEmployee: ModalRef;
    getEmployeeList = [];
    getMgmList = [];
    attributeSelected = [];
    ContractMgmEmployeeDeleting = [];
    ContractMgmDeleting = [];
    pageCall = new Page();
    pageCom = new Page();
    pageNpl = new Page();
    pageLaw = new Page();
    pageSms = new Page();
    callHis = [];
    comHis = [];
    nplHis = [];
    lawHis = [];
    cancelRefinance: boolean;
    IsSuperUser: boolean;
    IsCompanyCapital: boolean;
    cancelContractCapital: boolean;
    MainContractHeadID: number;
    nowDate = new Date(new Date().setDate(new Date().getDate() + 1));
    contractProcessLists = [];
    pageContractProcess = new Page();
    removeContractProcessForm: FormGroup;
    removeContractProcessPopup: ModalRef;
    loadingContractProcess = false;
    username: string;
    currentDate = new Date();
    addOn = false;
    securitiesPer: number;
    ContractType: string;
    CanRefinance: boolean;
    IsAccountingUser: boolean;
    pageSign = new Page();
    IsDisableWaitSign: boolean = false;
    IsCancelReceiptUser: boolean;
    IsApproveRefinanceLaw: boolean = false;
    contractCustomerAccount = [];
    categoryCustomer = Category.Example;
    smsHis = [];
    isDisableAttachment: boolean = false;
    trackingAttachmentCall = [];
    pageTrackingAttachmentCall = new Page();
    trackingAttachmentHome = [];
    pageTrackingAttachmentHome = new Page();
    trackingAttachmentNpl = [];
    pageTrackingAttachmentNpl = new Page();
    trackingAttachmentLaw = [];
    pageTrackingAttachmentLaw = new Page();
    trackingAttachmentOther = [];
    pageTrackingAttachmentOther = new Page();
    debtCollectionExpenses: ModalRef;
    debtCollectionExpensesForm: FormGroup;
    statusTracking = [];
    pageDebtCollectionExpenses = new Page();
    debtCollectionExpensesList = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private lots03Service: Lots03Service,
        private modal: ModalService,
        public lang: LangService,
        private selectFilter: SelectFilterService,
        private browser: BrowserService,

    ) {
        this.createForm();
    }


    createForm() {
        this.loanAgreementForm = this.fb.group({
            CustomerCode: [{ value: null, disabled: true }, Validators.required],
            CategoryId: [{ value: null, disabled: true }, Validators.required],

            ContractType: [{ value: null, disabled: true }, Validators.required],
            MainContractNo: [{ value: null, disabled: true }, Validators.required],
            MainLoanPrincipleAmount: [{ value: null, disabled: true }, Validators.required],

            TotalAllContractAmount: [{ value: null, disabled: true }],
            ContractNo: null,
            ContractDate: [{ value: new Date(), disabled: true }, Validators.required],
            CompanyCode: null,
            CompanyNameTha: [{ value: null, disabled: true }],
            CompanyNameEng: [{ value: null, disabled: true }],
            OldContractId: [{ value: null, disabled: true }],
            ContractStatus: null,
            ContractStatusTha: null,
            ContractStatusEng: null,

            LoanTypeCode: [{ value: null, disabled: true }, Validators.required],
            LoanObjective: null,

            contractBorrowers: this.fb.array([]),
            contractSecuritiess: this.fb.array([]),
            contractItems: this.fb.array([]),

            PayType: [{ value: null, disabled: true }, Validators.required],
            ReqLoanAmount: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]],
            TotalAmount: [{ value: null, disabled: true }],
            ReqTotalPeriod: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]],
            ReqGapPeriod: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]],
            ReqTotalMonth: [{ value: null, disabled: true }],
            contractInformations: this.fb.array([]),
            ApprovedDate: [{ value: null, disabled: true }, Validators.required],
            TransferDate: [{ value: null, disabled: true }, Validators.required],
            StartInterestDate: [{ value: null, disabled: true }, Validators.required],
            StartPaymentDate: [{ value: null, disabled: true }, Validators.required],
            EndPaymentDate: [{ value: null, disabled: true }, Validators.required],
            AppLoanPrincipleAmount: [{ value: null, disabled: true }, Validators.required],
            AppLoanTotalPeriod: [{ value: null, disabled: true }, Validators.required],
            AppLoanInterestRate: [{ value: null, disabled: true }, Validators.required],
            AppLoanInterestAmount: [{ value: null, disabled: true }, Validators.required],
            AppLoanPeriodAmount: [{ value: null, disabled: true }],
            AppLoanAmountTotal: [{ value: null, disabled: true }],
            AppInterestType: [{ value: null, disabled: true }],
            AppLoanEffectiveInterestRate: [{ value: null, disabled: true }],
            AppLoanEffectiveInterestRateYear: [{ value: null, disabled: true }],
            AppFeeRate1: [{ value: null, disabled: true }],
            AppFeeRate2: [{ value: null, disabled: true }],
            AppFeeRate3: [{ value: null, disabled: true }],
            AppFeeAmount1: [{ value: null, disabled: true }],
            AppFeeAmount2: [{ value: null, disabled: true }],
            AppFeeAmount3: [{ value: null, disabled: true }],
            LatePaymentDay: [{ value: null, disabled: true }],
            LatePaymentFeeRate: [{ value: null, disabled: true }],
            PaymentTypeCode: [{ value: null, disabled: true }],
            PaymentCompanyAccountId: [{ value: null, disabled: true }],
            CustomerReceiveTypeCode: [{ value: null, disabled: true }],
            CustomerAccountNo: null,
            CustomerAccountName: null,
            CustomerBankCode: null,
            CustomerBranchName: null,
            CustomerBankAccountTypeCode: null,
            CustomerAccountAuto: null,
            ReceiveTypeCode: null,
            ReceiveCompanyAccountId: null,
            Barcode: null,
            LoanFeeAmount: null,
            Remark: null,
            MaximumInterestRate: [{ value: null, disabled: true }],
            contractIncomeItems: this.fb.array([]),
            contractPaymentItems: this.fb.array([]),
            contractAttachments: this.fb.array([]),
            contractAttachmentsCall: this.fb.array([]),
            contractAttachmentsHome: this.fb.array([]),
            contractAttachmentsNpl: this.fb.array([]),
            contractAttachmentsLaw: this.fb.array([]),
            contractAttachmentsOther: this.fb.array([]),
            ContractMgmEmployee: this.fb.array([]),
            ContractMgm: this.fb.array([]),
            editStatus: null,
            minContractNo: null,
            maxContractNo: null,
            MGMCheckbox: false,
            Activity: [null, Validators.required],
            CanRefinance: false,
            CallTrackingStatus: null,
            HomeTrackingStatus: null,
            NplTrackingStatus: null,
            LawTrackingStatus: null,
            CallTrackingStatusDisplay: null,
            HomeTrackingStatusDisplay: null,
            NplTrackingStatusDisplay: null,
            LawTrackingStatusDisplay: null,
            DescLoan: null,
            AddOn: [null, Validators.required],
            OldContractNo: [{ value: null, disabled: true }],
            CustomerName: [{ value: null, disabled: true }],
            IsDisableAttachment: null,
            EmployeeNameContract: null,
            IsNotRefinance: false,
            IsApproveRefinanceLaw: false,
            AccruedBalanceOverNinetyAmount: null,
            ApprovePaymentOnlineStatus: null,
            ApprovePaymentOnlineDate: null,
        });

        this.searchEmpForm = this.fb.group({
            EmployeeCode: null,
            EmployeeName: null
        });

        this.searchMgmForm = this.fb.group({
            MgmCode: null,
            MgmName: null
        });

        this.signatureForm = this.fb.group({
            Remark: null
        })

        this.loanAgreementForm.controls.CompanyCode.valueChanges.subscribe(
            (val) => {
                if (val) {
                    let data = this.company.find(o => { return o.Value == val }) || {};
                    this.loanAgreementForm.controls.CompanyNameTha.setValue(data.TextTha);
                    this.loanAgreementForm.controls.CompanyNameEng.setValue(data.TextEng);
                }
            }
        )

        // this.loanAgreementForm.controls.CategoryId.valueChanges.subscribe(
        //     (val) => {
        //         if (val) {
        //             var isRefinance = false;
        //             if (this.loanAgreementForm.controls.OldContractId.value) {
        //                 isRefinance = true;
        //             }
        //             this.filterLoanType(val, isRefinance);
        //         }
        //     }
        // )


        this.loanAgreementForm.controls.CustomerCode.valueChanges.subscribe(
            (val) => {
                if (val) {
                    this.filterContractReFinance(val);
                } else {
                    this.filterContractReFinance(null);
                }
            }
        )


        this.loanAgreementForm.controls.AppLoanEffectiveInterestRate.valueChanges.subscribe(
            (val) => {
                let yearInterestRate = val * 12;
                this.loanAgreementForm.controls.AppLoanEffectiveInterestRateYear.setValue(yearInterestRate);
            }
        )

        this.loanAgreementForm.controls.CustomerReceiveTypeCode.valueChanges.subscribe(
            (val) => {
                this.loanAgreementForm.controls.CustomerAccountNo.setValue(null, { emitEvent: false })
                this.loanAgreementForm.controls.CustomerAccountName.setValue(null, { emitEvent: false })
                this.loanAgreementForm.controls.CustomerBankCode.setValue(null, { emitEvent: false })
                this.loanAgreementForm.controls.CustomerBranchName.setValue(null, { emitEvent: false })
                this.loanAgreementForm.controls.CustomerBankAccountTypeCode.setValue(null, { emitEvent: false })
                this.loanAgreementForm.controls.CustomerAccountAuto.setValue(null, { emitEvent: false })

                if (val == this.tranfersType) {
                    if (this.contractHead.CustomerAccountNo == null
                        && this.contractHead.CustomerAccountName == null
                        && this.contractHead.CustomerBankCode == null
                        && this.contractHead.CustomerBranchName == null) {
                        this.lots03Service.getCustomerBankAccount(this.loanAgreementForm.controls.CustomerCode.value).subscribe(
                            (result) => {
                                if (result) {
                                    this.loanAgreementForm.controls.CustomerAccountNo.setValue(result.AccountNo, { emitEvent: false })
                                    this.loanAgreementForm.controls.CustomerAccountName.setValue(result.AccountName, { emitEvent: false })
                                    this.loanAgreementForm.controls.CustomerBankCode.setValue(result.BankCode, { emitEvent: false })
                                    this.loanAgreementForm.controls.CustomerBranchName.setValue(result.BankBranch, { emitEvent: false })
                                } else {
                                    this.loanAgreementForm.controls.CustomerAccountNo.setValue(null, { emitEvent: false })
                                    this.loanAgreementForm.controls.CustomerAccountName.setValue(null, { emitEvent: false })
                                    this.loanAgreementForm.controls.CustomerBankCode.setValue(null, { emitEvent: false })
                                    this.loanAgreementForm.controls.CustomerBranchName.setValue(null, { emitEvent: false })
                                }
                            }
                        )
                    }
                }
            }
        )

        this.loanAgreementForm.controls.LoanTypeCode.valueChanges.subscribe(
            (val) => {
                if (val) {
                    const loantype = this.loanType.find(x => x.Value == val);
                    this.loanAgreementForm.controls.DescLoan.setValue(loantype.ContractDocument);
                    this.ContractType = loantype.ContractType;
                    this.CanRefinance = loantype.CanRefinance;
                } else {
                    this.loanAgreementForm.controls.DescLoan.setValue(null);
                }
            }
        )

        this.loanAgreementForm.controls.Activity.disable();
        this.loanAgreementForm.controls.MGMCheckbox.disable();

        const now = new Date();
        this.policyPeriodForm = this.fb.group({
            ContractPolicyId: null,
            ContractHeadId: null,
            PolicyDate: [{ value: now, disabled: true }, Validators.required],
            PolicyCode: [{ value: '1', disabled: true }],
            PolicyRemark: null,
            PolicyPeriodCount: [null, Validators.required]
        });

        this.loanAgreementForm.controls.AddOn.valueChanges.subscribe(
            (val) => {
                if (val) {
                    this.loanAgreementForm.markAsPristine();
                }
            }
        )

        this.debtCollectionExpensesForm = this.fb.group({
            MainContractHeadId: null,
            TrackingDate: [{ value: new Date(), disabled: true }],
            Status: [null, Validators.required],
            MoveRefinanceAmount: [{ value: null, disabled: true }, Validators.required],
            Remark: null,
            TrackingHistoryId: null,
        })


        this.debtCollectionExpensesForm.controls.Status.valueChanges.subscribe(
            (val) => {
                if (val == 'MF') {
                    this.debtCollectionExpensesForm.controls.MoveRefinanceAmount.enable();
                } else {
                    this.debtCollectionExpensesForm.controls.MoveRefinanceAmount.disable();
                }
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
        return this.loanAgreementForm.controls.CustomerReceiveTypeCode;
    }

    get contractSecuritiess(): FormArray {
        return this.loanAgreementForm.get('contractSecuritiess') as FormArray;
    }

    get contractInformations(): FormArray {
        return this.loanAgreementForm.get('contractInformations') as FormArray;
    };

    get contractIncomeItems(): FormArray {
        return this.loanAgreementForm.get('contractIncomeItems') as FormArray;
    };

    get contractPaymentItems(): FormArray {
        return this.loanAgreementForm.get('contractPaymentItems') as FormArray;
    };

    get contractAttachments(): FormArray {
        return this.loanAgreementForm.get('contractAttachments') as FormArray;
    }

    get contractAttachmentsCall(): FormArray {
        return this.loanAgreementForm.get('contractAttachmentsCall') as FormArray;
    }

    get contractAttachmentsHome(): FormArray {
        return this.loanAgreementForm.get('contractAttachmentsHome') as FormArray;
    }

    get contractAttachmentsNpl(): FormArray {
        return this.loanAgreementForm.get('contractAttachmentsNpl') as FormArray;
    }

    get contractAttachmentsLaw(): FormArray {
        return this.loanAgreementForm.get('contractAttachmentsLaw') as FormArray;
    }

    get contractAttachmentsOther(): FormArray {
        return this.loanAgreementForm.get('contractAttachmentsOther') as FormArray;
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
            loanFileName: null,
            RowState: null
        });
        fg.patchValue(item, { emitEvent: false });

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

                if (this.contractHead.ContractInformation) {
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
            Amount: [null, Validators.required],
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
            Amount: [null, Validators.required],
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

    contractAttachmentsForm(item: ContractAttachment): FormGroup {
        let fg = this.fb.group({
            ContractAttachmentId: null,
            AttachmentTypeCode: [null, Validators.required],
            FileName: null,
            AttahmentId: [null, Validators.required],
            Description: null,
            RowState: RowState.Add,
            IsDisableAttachment: null,
            IsSignature: false,
            CopyDocRefinance: false
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

    contractAttachmentsCallForm(item: ContractAttachmentCall): FormGroup {
        let fg = this.fb.group({
            TrackingAttachmentId: null,
            FileName: null,
            AttahmentId: [null, Validators.required],
            Description: null,
            RowState: RowState.Add,
            IsDisableAttachment: null,
            CreatedDate: null,
            CreatedBy: null
        });
        fg.patchValue(item, { emitEvent: false });

        fg.valueChanges.subscribe(
            (control) => {
                if (control.RowState == RowState.Normal) {
                    fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                }
            }
        )
        this.attachmentFilesCall.push(new Attachment());
        return fg;

    }

    contractAttachmentsHomeForm(item: ContractAttachmentCall): FormGroup {
        let fg = this.fb.group({
            TrackingAttachmentId: null,
            FileName: null,
            AttahmentId: [null, Validators.required],
            Description: null,
            RowState: RowState.Add,
            IsDisableAttachment: null,
            CreatedDate: null,
            CreatedBy: null
        });
        fg.patchValue(item, { emitEvent: false });

        fg.valueChanges.subscribe(
            (control) => {
                if (control.RowState == RowState.Normal) {
                    fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                }
            }
        )
        this.attachmentFilesHome.push(new Attachment());
        return fg;

    }

    contractAttachmentsNplForm(item: ContractAttachmentCall): FormGroup {
        let fg = this.fb.group({
            TrackingAttachmentId: null,
            FileName: null,
            AttahmentId: [null, Validators.required],
            Description: null,
            RowState: RowState.Add,
            IsDisableAttachment: null,
            CreatedDate: null,
            CreatedBy: null
        });
        fg.patchValue(item, { emitEvent: false });

        fg.valueChanges.subscribe(
            (control) => {
                if (control.RowState == RowState.Normal) {
                    fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                }
            }
        )
        this.attachmentFilesNpl.push(new Attachment());
        return fg;

    }

    contractAttachmentsLawForm(item: ContractAttachmentCall): FormGroup {
        let fg = this.fb.group({
            TrackingAttachmentId: null,
            FileName: null,
            AttahmentId: [null, Validators.required],
            Description: null,
            RowState: RowState.Add,
            IsDisableAttachment: null,
            CreatedDate: null,
            CreatedBy: null
        });
        fg.patchValue(item, { emitEvent: false });

        fg.valueChanges.subscribe(
            (control) => {
                if (control.RowState == RowState.Normal) {
                    fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                }
            }
        )
        this.attachmentFilesLaw.push(new Attachment());
        return fg;

    }

    contractAttachmentsOtherForm(item: ContractAttachmentCall): FormGroup {
        let fg = this.fb.group({
            TrackingAttachmentId: null,
            FileName: null,
            AttahmentId: [null, Validators.required],
            Description: null,
            RowState: RowState.Add,
            IsDisableAttachment: null,
            CreatedDate: null,
            CreatedBy: null
        });
        fg.patchValue(item, { emitEvent: false });

        fg.valueChanges.subscribe(
            (control) => {
                if (control.RowState == RowState.Normal) {
                    fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                }
            }
        )
        this.attachmentFilesOther.push(new Attachment());
        return fg;

    }

    ngOnInit() {
        this.removeContractProcessForm = this.fb.group({
            MainContractHeadId: null,
            ReceiptHeadId: null,
            ProcessDate: null,
            CancelRemark: null,
            IsDueDate: null,
            BillPaymentDetailId: null,
            IsBillPayment: null
        })

        this.lang.onChange().subscribe(() => {
            this.bindDropDownList();
        });

        this.route.data.subscribe((data) => {
            this.maxLoanAmount = data.lots03.master.MaximumLoanAmount;
            this.tranfersType = data.lots03.master.TranfersType;
            this.company = data.lots03.master.Companys;
            this.loanType = data.lots03.master.loanTypes;
            this.pays = data.lots03.master.Pays;
            this.paymentCompanyAccount = data.lots03.master.CompanyAccounts;
            this.receiveCompanyAccount = data.lots03.master.CompanyAccounts;
            this.paymentType = data.lots03.master.ReceiveTypeList;
            this.customerReceiveType = data.lots03.master.ReceiveTypeList;
            this.receivePaymentType = data.lots03.master.ReceiveTypeList;
            this.bankAccountType = data.lots03.master.BankAccountTypeList;
            this.incomeLoan = data.lots03.master.IncomeLoanList;
            this.paymentLoan = data.lots03.master.PaymentLoanList;
            this.informations = data.lots03.master.InformationList;
            this.banklist = data.lots03.master.BankList;
            this.attachmentTypes = data.lots03.master.AttachmentTypes;
            this.contractTypeList = data.lots03.master.ContractType
            this.SecuritiesCategories = data.lots03.master.SecuritiesCategorys;
            this.contractReFinance = data.lots03.master.ContractReFinance;
            this.tranfersTypeT = data.lots03.master.TranfersTypeT;
            this.tranfersTypeM = data.lots03.master.TranfersTypeM;
            this.PolicyPeriodList = data.lots03.master.PolicyPeriod;
            this.ContractPolicyList = data.lots03.master.ContractPolicy;
            this.IsSuperUser = data.lots03.master.IsSuperUser;
            this.IsCompanyCapital = data.lots03.master.IsCompanyCapital;
            this.username = data.lots03.master.Username;
            this.addOn = data.lots03.master.AddOn
            this.backToPage = data.lots03.ofBackToPage.backToPage;
            this.contractHead = data.lots03.detail;
            this.IsAccountingUser = data.lots03.master.IsAccountingUser;
            this.SignatureDocuments = data.lots03.master.SignatureDocuments;
            this.IsCancelReceiptUser = data.lots03.master.IsCancelReceiptUser;
            this.statusTracking = data.lots03.master.StatusTracking;

            this.rebuildForm();
        })

    }

    rebuildForm() {
        this.attachmentFiles = [];
        this.attachmentFilesCall = [];
        this.attachmentFilesHome = [];
        this.attachmentFilesNpl = [];
        this.attachmentFilesLaw = [];
        this.attachmentFilesOther = [];
        this.loanAgreementForm.markAsPristine();
        if (this.contractHead.ContractNo != null) {
            this.loanAgreementForm.patchValue(this.contractHead);
            this.loanAgreementForm.setControl('contractInformations', this.fb.array(this.contractHead.ContractInformation.map((detail) => this.contractInformationsForm(detail))));
            this.loanAgreementForm.controls.AddOn.disable({ emitEvent: false });

            if (this.contractHead.ContractType == 'S') {
                this.contractInformations.disable({ emitEvent: false });
            }

            if (this.loanAgreementForm.controls.Activity.value != null) {
                this.loanAgreementForm.controls.MGMCheckbox.setValue(true);
                this.loanAgreementForm.setControl('ContractMgmEmployee', this.fb.array(this.contractHead.ContractMgmEmployee.map((detail) => this.createContractMgmEmployeeForm(detail))));
                this.loanAgreementForm.setControl('ContractMgm', this.fb.array(this.contractHead.ContractMgm.map((detail) => this.createContractMgmForm(detail))));
            } else {
                this.loanAgreementForm.controls.MGMCheckbox.setValue(false);
                this.loanAgreementForm.controls.Activity.disable();
            }
        } else {
            this.loanAgreementForm.setControl('contractInformations', this.fb.array(this.informations.map((detail) => this.contractInformationsForm(detail))))
        }

        this.loanAgreementForm.controls.DescLoan.disable({ emitEvent: false });
        this.contractBorrowers = this.contractHead.ContractBorrower;
        this.loanAgreementForm.setControl('contractIncomeItems', this.fb.array(this.contractHead.ContractIncomeItem.map((detail) => this.ContractIncomeItemsForm(detail))))
        this.loanAgreementForm.setControl('contractPaymentItems', this.fb.array(this.contractHead.ContractPaymentItem.map((detail) => this.ContractPaymentItemsForm(detail))))
        this.loanAgreementForm.setControl('contractSecuritiess', this.fb.array(this.contractHead.ContractSecurities.map((detail) => this.contractSecuritiesForm(detail))))
        setTimeout(() => {
            this.loanAgreementForm.setControl('contractAttachments', this.fb.array(this.contractHead.ContractAttachment.map((detail) => this.contractAttachmentsForm(detail))))
            this.checkContractAttachment();
        }, 300);

        setTimeout(() => {
            this.loanAgreementForm.setControl('contractAttachmentsCall', this.fb.array(this.contractHead.ContractAttachmentCall.map((detail) => this.contractAttachmentsCallForm(detail))))
            this.checkContractAttachmentCall();
        }, 300);

        setTimeout(() => {
            this.loanAgreementForm.setControl('contractAttachmentsHome', this.fb.array(this.contractHead.ContractAttachmentHome.map((detail) => this.contractAttachmentsHomeForm(detail))))
            this.checkContractAttachmentHome();
        }, 300);

        setTimeout(() => {
            this.loanAgreementForm.setControl('contractAttachmentsNpl', this.fb.array(this.contractHead.ContractAttachmentNpl.map((detail) => this.contractAttachmentsNplForm(detail))))
            this.checkContractAttachmentNpl();
        }, 300);

        setTimeout(() => {
            this.loanAgreementForm.setControl('contractAttachmentsLaw', this.fb.array(this.contractHead.ContractAttachmentLaw.map((detail) => this.contractAttachmentsLawForm(detail))))
            this.checkContractAttachmentLaw();
        }, 300);

        setTimeout(() => {
            this.loanAgreementForm.setControl('contractAttachmentsOther', this.fb.array(this.contractHead.ContractAttachmentOther.map((detail) => this.contractAttachmentsOtherForm(detail))))
            this.checkContractAttachmentOther();
        }, 300);

        // สาขาภายใต้ 9999 เพิ่มสัญญาจากระบบเก่าเข้าระบบใหม่
        if (this.IsCompanyCapital) {
            this.loanAgreementForm.controls.OldContractNo.enable({ emitEvent: false });
        }

        this.MainContractHeadID = this.contractHead.MainContrctHeadId;

        this.bindDropDownList();
        this.checkContractEditForm();

        this.searchAllContractPeriod();
        this.searchAllContractReceivePeriod();

        this.onChange();

        var isRefinance = false;
        if (this.loanAgreementForm.controls.OldContractId.value) {
            isRefinance = true;
        }
        this.filterLoanType(this.loanAgreementForm.controls.CategoryId.value, isRefinance);

        this.searchContractCustomerAccount();
    }

    checkContractEditForm() {
        if (this.contractHead.editStatus == '1') {
            this.contractIncomeItems.disable({ emitEvent: false });
            this.contractPaymentItems.disable({ emitEvent: false })
            this.contractInformations.disable({ emitEvent: false });
            this.contractAttachments.disable({ emitEvent: false });
            this.contractAttachmentsCall.disable({ emitEvent: false });
            this.contractAttachmentsHome.disable({ emitEvent: false });
            this.contractAttachmentsNpl.disable({ emitEvent: false });
            this.contractAttachmentsLaw.disable({ emitEvent: false });
            this.contractAttachmentsOther.disable({ emitEvent: false });
            this.loanAgreementForm.controls.LoanObjective.disable({ emitEvent: false });
            this.loanAgreementForm.controls.PaymentTypeCode.disable({ emitEvent: false });
            this.loanAgreementForm.controls.PaymentCompanyAccountId.disable({ emitEvent: false });
            this.loanAgreementForm.controls.CustomerReceiveTypeCode.disable({ emitEvent: false });
            this.loanAgreementForm.controls.CustomerAccountNo.disable({ emitEvent: false });
            this.loanAgreementForm.controls.CustomerAccountName.disable({ emitEvent: false });
            this.loanAgreementForm.controls.CustomerBankCode.disable({ emitEvent: false });
            this.loanAgreementForm.controls.CustomerBranchName.disable({ emitEvent: false });
            this.loanAgreementForm.controls.CustomerBankAccountTypeCode.disable({ emitEvent: false });
            this.loanAgreementForm.controls.CustomerAccountAuto.disable({ emitEvent: false });
            this.loanAgreementForm.controls.OldContractNo.disable({ emitEvent: false });
        } else if (this.contractHead.editStatus == '2') {

        }
    }

    filterLoanType(categoryId, isRefinance) {
        this.lots03Service.getLoanType(categoryId, this.loanAgreementForm.controls.CustomerCode.value, this.loanAgreementForm.controls.CompanyCode.value, isRefinance).subscribe(
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

                let type = this.loanTypeData.find(o => { return o.Value == this.loanAgreementForm.controls.LoanTypeCode.value }) || {};

                if (type.SecuritiesPercent) {
                    this.securitiesPer = type.SecuritiesPercent;
                }
            })
    }

    searchPeriodPeriod() {
        this.lots03Service.getContractPeriod(Object.assign({
            ContractHeadId: this.contractHead.ContractHeadId
        }))
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.periods = res.Rows;
                });
    }


    searchContractReceivePeriod() {
        this.lots03Service.getContractReceivePeriod(Object.assign({
            ContractHeadId: this.contractHead.ContractHeadId
        }))
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.contractReceivePeriod = res.Rows;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    onTableAllAccuredBalanceEndingEvent($event) {
        this.searchAllAccuredBalanceEnding();
    }

    searchAllAccuredBalanceEnding() {
        this.lots03Service.getAllAccuredBalanceEnding(Object.assign({
            ContractHeadId: this.contractHead.ContractHeadId
        }), this.page)
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.AllAccuredBalanceEnding = res.Rows;
                });
    }

    searchAccuredBalanceEnding() {
        this.lots03Service.getAccuredBalanceEnding(Object.assign({
            ContractHeadId: this.contractHead.ContractHeadId
        }), this.page)
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.AccuredBalanceEnding = res.Rows;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }


    searchAllContractPeriod() {
        this.lots03Service.getAllContractPeriod(Object.assign({
            ContractHeadId: this.contractHead.ContractHeadId
        }))
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.AllContractPeriods = res.Rows;
                });
    }

    searchAllContractReceivePeriod() {
        this.lots03Service.getAllContractReceivePeriod(Object.assign({
            ContractHeadId: this.contractHead.ContractHeadId
        }))
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.AllContractReceivePeriod = res.Rows;
                    let balanceAdvance = 0;
                    this.AllContractReceivePeriod.forEach(element => {
                        balanceAdvance = numeral(balanceAdvance).add(element.ReceiptAdvanceAmount).value();
                        element.BalanceReceiptAdvanceAmount = balanceAdvance;
                    });

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    bindDropDownList() {
        this.selectFilter.SortByLang(this.company);
        this.company = [...this.company];

        this.selectFilter.SortByLang(this.incomeLoan);
        this.incomeLoan = [...this.incomeLoan];

        this.selectFilter.SortByLang(this.paymentLoan);
        this.paymentLoan = [...this.paymentLoan];

        // this.filterCustomer(true);
        this.filterSecuritiesCategories(true);
        this.filterPaymentType(true);
        this.filterCustomerReceiveType(true);
        this.filterReceiveTypeCode(true);
        this.filterPaymentCompanyAccount(true);
        this.filterReceiveCompanyAccount(true);
        this.filterBankAccountType(true);
        //this.filterCustomerSecurities(null);
        this.filterBank(true);
    }

    // filterCustomer(filter?: boolean) {
    //     if (filter) {
    //         const detail = this.contractHead;
    //         if (detail.CustomerCode) {
    //             this.customerslist = this.selectFilter.FilterActiveByValue(this.customerslist, detail.CustomerCode);
    //         }
    //         else {
    //             this.customerslist = this.selectFilter.FilterActive(this.customerslist);
    //         }
    //     }
    //     this.selectFilter.SortByLang(this.customerslist);
    //     this.customerslist = [...this.customerslist];
    // }

    filterContractReFinance(CustormerCode) {
        if (this.contractReFinance) {
            this.contractReFinanceData = this.contractReFinance.filter(item => { return item.CustomerCode == CustormerCode });
            this.contractReFinanceData = [...this.contractReFinanceData];
        }
    }

    filterSecuritiesCategories(filter?: boolean) {
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
        const customercode = this.loanAgreementForm.controls.CustomerCode.value;
        const cateId = this.loanAgreementForm.controls.CategoryId.value;

        if (customercode) {

            const baseValue = this.contractHead.ContractSecurities.find((item) => {
                return item.ContractSecuritiesId === contractSecuritiesId
            });

            if (baseValue != null) {
                this.customerSecuritiesData = this.customerSecurities.filter(o => {
                    return o.CustomerCode == customercode && o.SecuritiesCategoryId == cateId
                })
                this.customerSecuritiesData = this.selectFilter.FilterActiveByValue(this.customerSecuritiesData, baseValue.ContractSecuritiesId);
            }
            else {
                this.customerSecuritiesData = this.customerSecurities.filter(o => {
                    return o.CustomerCode == customercode && o.SecuritiesCategoryId == cateId && o.refs == true
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

    filterAttachmentTypes(ContractAttachmentId) {
        const baseValue = this.contractHead.ContractAttachment.find((item) => {
            return item.ContractAttachmentId === ContractAttachmentId
        });
        if (baseValue) {
            this.attachmentTypes = this.selectFilter.FilterActiveByValue(this.attachmentTypes, baseValue.AttachmentTypeCode);
        }
        else {
            this.attachmentTypes = this.selectFilter.FilterActive(this.attachmentTypes);
        }
        this.attachmentTypes = [...this.attachmentTypes];
    }


    getRegTotalMonth() {
        return (this.loanAgreementForm.controls.ReqTotalPeriod.value * this.loanAgreementForm.controls.ReqGapPeriod.value)
    }

    getEndPaymentDate(StartDate, ReqTotalMonth) {
        if (ReqTotalMonth) {
            let endDate = new Date(StartDate);
            return new Date(endDate.setMonth(endDate.getMonth() + ReqTotalMonth));
        }
    }

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
        }
    }

    checkMaxLoanAmount(reqLoanAmount, reqTotal) {
        if (this.loanAgreementForm.controls.CustomerCode.value) {
            this.lots03Service.getCheckMaxLoanAmount({
                CustomerCode: this.loanAgreementForm.controls.CustomerCode.value,
                LoanAmount: (this.loanAgreementForm.controls.ReqLoanAmount.value || 0),
                ProgramCode: "LOTS04",
                ContractNo: "Z",
            }).subscribe(
                (res) => {
                    if (this.GuaranteeAssetYN) {
                        if (reqLoanAmount > 0
                            && reqLoanAmount <= reqTotal
                            && reqLoanAmount <= this.maxLoanAmount
                            && res == true) {
                            this.maxLoanMsg = false;
                            this.loanAgreementForm.controls.ReqLoanAmount.setErrors(null);
                        } else {
                            this.maxLoanMsg = true;
                            this.loanAgreementForm.controls.ReqLoanAmount.setErrors({ 'invalid': true });
                        }
                    } else {
                        if (reqLoanAmount > 0
                            && reqLoanAmount <= this.maxLoanAmount
                            && res == true) {
                            this.maxLoanMsg = false;
                            this.loanAgreementForm.controls.ReqLoanAmount.setErrors(null);
                        } else {
                            this.maxLoanMsg = true;
                            this.loanAgreementForm.controls.ReqLoanAmount.setErrors({ 'invalid': true });
                        }
                    }
                }
            )
        }
    }

    addSecurities() {
        const customerCode = this.loanAgreementForm.controls.CustomerCode.value;
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
            this.loanAgreementForm.controls.TotalAmount.setValue(null, { emitEvent: false })
        }
    }

    chkDupContractSecurities() {
        let seen = new Set();
        var hasDuplicates = this.loanAgreementForm.value.contractSecuritiess.some(function (item) {
            return seen.size === seen.add(item.CustomerSecuritiesId).size;
        });
        return hasDuplicates;
    }

    summary() {
        if (this.contractSecuritiess.length > 0) {
            let total = this.contractSecuritiess.value.map(row => row.loanLimitAmount == null ? 0 : row.loanLimitAmount)
                .reduce((res, cell) => res += cell, 0);
            let maxAmount = this.securitiesPer ? total * this.securitiesPer / 100 : total;

            this.loanAgreementForm.controls.TotalAmount.setValue(maxAmount, { emitEvent: false })
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
        var hasDuplicates = this.loanAgreementForm.value.contractIncomeItems.some(function (item) {
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
        var hasDuplicates = this.loanAgreementForm.value.contractPaymentItems.some(function (item) {
            return seen.size === seen.add(item.LoItemCode).size;
        });
        return hasDuplicates;
    }

    summaryAllReceiptAmount() {
        if (this.AllContractReceivePeriod.length > 0) {
            let total = this.AllContractReceivePeriod.filter(item => { return item.ReceiptTotalAmount == null ? 0 : item.ReceiptTotalAmount })
                .map((item) => parseFloat(item.ReceiptTotalAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryAllApplyAmount() {
        if (this.AllContractReceivePeriod.length > 0) {
            let total = this.AllContractReceivePeriod.filter(item => { return item.ApplyAmount == null ? 0 : item.ApplyAmount })
                .map((item) => parseFloat(item.ApplyAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryAllActualAmount() {
        if (this.AllContractReceivePeriod.length > 0) {
            let total = this.AllContractReceivePeriod.filter(item => { return item.ActualAmount == null ? 0 : item.ActualAmount })
                .map((item) => parseFloat(item.ActualAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryAllApplyPrincipleAmount() {
        if (this.AllContractReceivePeriod.length > 0) {
            let totalPrincipleAmount = this.AllContractReceivePeriod.filter(item => { return item.ApplyPrincipleAmount == null ? 0 : item.ApplyPrincipleAmount })
                .map((item) => parseFloat(item.ApplyPrincipleAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalPrincipleAmount);
        }
    }

    summaryAllApplyInterestAmount() {
        if (this.AllContractReceivePeriod.length > 0) {
            const totalInterestAmount = this.AllContractReceivePeriod.filter(item => { return item.ApplyInterestAmount == null ? 0 : item.ApplyInterestAmount })
                .map((item) => parseFloat(item.ApplyInterestAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryAllApplyFineAmount() {
        if (this.AllContractReceivePeriod.length > 0) {
            const totalInterestAmount = this.AllContractReceivePeriod.filter(item => { return item.ApplyFineAmount == null ? 0 : item.ApplyFineAmount })
                .map((item) => parseFloat(item.ApplyFineAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryAllApplyDebtCollectionAmount() {
        if (this.AllContractReceivePeriod.length > 0) {
            const totalInterestAmount = this.AllContractReceivePeriod.filter(item => { return item.ApplyDebtCollectionAmount == null ? 0 : item.ApplyDebtCollectionAmount })
                .map((item) => parseFloat(item.ApplyDebtCollectionAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryAllReceiptAdvanceAmount() {
        if (this.AllContractReceivePeriod.length > 0) {
            const totalInterestAmount = this.AllContractReceivePeriod.filter(item => { return item.ReceiptAdvanceAmount == null ? 0 : item.ReceiptAdvanceAmount })
                .map((item) => parseFloat(item.ReceiptAdvanceAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryAllApplySequesterAmt() {
        if (this.AllContractReceivePeriod.length > 0) {
            const totalInterestAmount = this.AllContractReceivePeriod.filter(item => { return item.ApplySequesterAmt == null ? 0 : item.ApplySequesterAmt })
                .map((item) => parseFloat(item.ApplySequesterAmt))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryAllApplyMoveRefinAmt() {
        if (this.AllContractReceivePeriod.length > 0) {
            const totalInterestAmount = this.AllContractReceivePeriod.filter(item => { return item.ApplyMoveRefinAmt == null ? 0 : item.ApplyMoveRefinAmt })
                .map((item) => parseFloat(item.ApplyMoveRefinAmt))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryAllBalanceReceiptAdvanceAmount() {
        if (this.AllContractReceivePeriod.length > 0) {
            const totalInterestAmount = this.AllContractReceivePeriod.filter(item => { return item.BalanceReceiptAdvanceAmount == null ? 0 : item.BalanceReceiptAdvanceAmount })
                .map((item) => parseFloat(item.BalanceReceiptAdvanceAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryAllTotalAmount() {
        if (this.periods.length > 0) {
            let total = this.AllContractPeriods.filter(row => { return row.TotalAmount == null ? 0 : row.TotalAmount })
                .map((item) => parseFloat(item.TotalAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryAllPrincipleAmount() {
        if (this.periods.length > 0) {
            let totalPrincipleAmount = this.AllContractPeriods.filter(row => { return row.PrincipleAmount == null ? 0 : row.PrincipleAmount })
                .map((item) => parseFloat(item.PrincipleAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalPrincipleAmount);
        }
    }

    summaryAllInterestAmount() {
        if (this.periods.length > 0) {
            const totalInterestAmount = this.AllContractPeriods.filter(row => { return row.InterestAmount == null ? 0 : row.InterestAmount })
                .map((item) => parseFloat(item.InterestAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryReceiptTotalAmount() {
        if (this.contractReceivePeriod.length > 0) {
            let total = this.contractReceivePeriod.filter(item => { return item.ReceiptTotalAmount == null ? 0 : item.ReceiptTotalAmount })
                .map((item) => parseFloat(item.ReceiptTotalAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryApplyAmount() {
        if (this.contractReceivePeriod.length > 0) {
            let totalPrincipleAmount = this.contractReceivePeriod.filter(item => { return item.ApplyAmount == null ? 0 : item.ApplyAmount })
                .map((item) => parseFloat(item.ApplyAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalPrincipleAmount);
        }
    }

    summaryApplyPrincipleAmount() {
        if (this.contractReceivePeriod.length > 0) {
            let totalPrincipleAmount = this.contractReceivePeriod.filter(item => { return item.ApplyPrincipleAmount == null ? 0 : item.ApplyPrincipleAmount })
                .map((item) => parseFloat(item.ApplyPrincipleAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalPrincipleAmount);
        }
    }

    summaryApplyInterestAmount() {
        if (this.contractReceivePeriod.length > 0) {
            const totalInterestAmount = this.contractReceivePeriod.filter(item => { return item.ApplyInterestAmount == null ? 0 : item.ApplyInterestAmount })
                .map((item) => parseFloat(item.ApplyInterestAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryApplyFineAmount() {
        if (this.contractReceivePeriod.length > 0) {
            const totalInterestAmount = this.contractReceivePeriod.filter(item => { return item.ApplyFineAmount == null ? 0 : item.ApplyFineAmount })
                .map((item) => parseFloat(item.ApplyFineAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryApplyDebtCollectionAmount() {
        if (this.contractReceivePeriod.length > 0) {
            const totalInterestAmount = this.contractReceivePeriod.filter(item => { return item.ApplyDebtCollectionAmount == null ? 0 : item.ApplyDebtCollectionAmount })
                .map((item) => parseFloat(item.ApplyDebtCollectionAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryApplySequesterAmt() {
        if (this.contractReceivePeriod.length > 0) {
            const totalInterestAmount = this.contractReceivePeriod.filter(item => { return item.ApplySequesterAmt == null ? 0 : item.ApplySequesterAmt })
                .map((item) => parseFloat(item.ApplySequesterAmt))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryApplyMoveRefinAmt() {
        if (this.contractReceivePeriod.length > 0) {
            const totalInterestAmount = this.contractReceivePeriod.filter(item => { return item.ApplyMoveRefinAmt == null ? 0 : item.ApplyMoveRefinAmt })
                .map((item) => parseFloat(item.ApplyMoveRefinAmt))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryTotalAmount() {
        if (this.periods.length > 0) {
            let total = this.periods.filter(row => { return row.TotalAmount == null ? 0 : row.TotalAmount })
                .map((item) => parseFloat(item.TotalAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryPrincipleAmount() {
        if (this.periods.length > 0) {
            let totalPrincipleAmount = this.periods.filter(row => { return row.PrincipleAmount == null ? 0 : row.PrincipleAmount })
                .map((item) => parseFloat(item.PrincipleAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalPrincipleAmount);
        }
    }

    summaryInterestAmount() {
        if (this.periods.length > 0) {
            const totalInterestAmount = this.periods.filter(row => { return row.InterestAmount == null ? 0 : row.InterestAmount })
                .map((item) => parseFloat(item.InterestAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(totalInterestAmount);
        }
    }

    summaryAllAccuredBalance() {
        if (this.AllAccuredBalanceEnding.length > 0) {
            let total = this.AllAccuredBalanceEnding.filter(row => { return row.SummaryAccured == null ? 0 : row.SummaryAccured })
                .map((item) => parseFloat(item.SummaryAccured))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryAllAccuredBalanceEndingPrinciple() {
        if (this.AllAccuredBalanceEnding.length > 0) {
            let total = this.AllAccuredBalanceEnding.filter(row => { return row.AccuredBalanceEndingPrinciple == null ? 0 : row.AccuredBalanceEndingPrinciple })
                .map((item) => parseFloat(item.AccuredBalanceEndingPrinciple))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryAllAccuredBalanceEndingInterest() {
        if (this.AllAccuredBalanceEnding.length > 0) {
            let total = this.AllAccuredBalanceEnding.filter(row => { return row.AccuredBalanceEndingInterest == null ? 0 : row.AccuredBalanceEndingInterest })
                .map((item) => parseFloat(item.AccuredBalanceEndingInterest))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryAllBalanceFineAmount() {
        if (this.AllAccuredBalanceEnding.length > 0) {
            let total = this.AllAccuredBalanceEnding.filter(row => { return row.BalanceFineAmount == null ? 0 : row.BalanceFineAmount })
                .map((item) => parseFloat(item.BalanceFineAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryAllBalanceDebtCollectionAmount() {
        if (this.AllAccuredBalanceEnding.length > 0) {
            let total = this.AllAccuredBalanceEnding.filter(row => { return row.BalanceDebtCollectionAmount == null ? 0 : row.BalanceDebtCollectionAmount })
                .map((item) => parseFloat(item.BalanceDebtCollectionAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryAccuredBalance() {
        if (this.AccuredBalanceEnding.length > 0) {
            let total = this.AccuredBalanceEnding.filter(row => { return row.SummaryAccured == null ? 0 : row.SummaryAccured })
                .map((item) => parseFloat(item.SummaryAccured))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryAccuredBalanceEndingPrinciple() {
        if (this.AccuredBalanceEnding.length > 0) {
            let total = this.AccuredBalanceEnding.filter(row => { return row.AccuredBalanceEndingPrinciple == null ? 0 : row.AccuredBalanceEndingPrinciple })
                .map((item) => parseFloat(item.AccuredBalanceEndingPrinciple))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryAccuredBalanceEndingInterest() {
        if (this.AccuredBalanceEnding.length > 0) {
            let total = this.AccuredBalanceEnding.filter(row => { return row.AccuredBalanceEndingInterest == null ? 0 : row.AccuredBalanceEndingInterest })
                .map((item) => parseFloat(item.AccuredBalanceEndingInterest))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryBalanceFineAmount() {
        if (this.AccuredBalanceEnding.length > 0) {
            let total = this.AccuredBalanceEnding.filter(row => { return row.BalanceFineAmount == null ? 0 : row.BalanceFineAmount })
                .map((item) => parseFloat(item.BalanceFineAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    summaryBalanceDebtCollectionAmount() {
        if (this.AccuredBalanceEnding.length > 0) {
            let total = this.AccuredBalanceEnding.filter(row => { return row.BalanceDebtCollectionAmount == null ? 0 : row.BalanceDebtCollectionAmount })
                .map((item) => parseFloat(item.BalanceDebtCollectionAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
    }

    addAttachment() {
        this.contractAttachments.markAsDirty();
        this.contractAttachments.push(this.contractAttachmentsForm({} as ContractAttachment));
    }

    addAttachmentCall() {
        this.contractAttachmentsCall.markAsDirty();
        this.contractAttachmentsCall.push(this.contractAttachmentsCallForm({} as ContractAttachmentCall));
    }

    addAttachmentHome() {
        this.contractAttachmentsHome.markAsDirty();
        this.contractAttachmentsHome.push(this.contractAttachmentsHomeForm({} as ContractAttachmentCall));
    }

    addAttachmentNpl() {
        this.contractAttachmentsNpl.markAsDirty();
        this.contractAttachmentsNpl.push(this.contractAttachmentsNplForm({} as ContractAttachmentCall));
    }

    addAttachmentLaw() {
        this.contractAttachmentsLaw.markAsDirty();
        this.contractAttachmentsLaw.push(this.contractAttachmentsLawForm({} as ContractAttachmentCall));
    }

    addAttachmentOther() {
        this.contractAttachmentsOther.markAsDirty();
        this.contractAttachmentsOther.push(this.contractAttachmentsOtherForm({} as ContractAttachmentCall));
    }

    removeAttachment(index) {
        this.attachmentFiles.splice(index, 1);
        let detail = this.contractAttachments.at(index) as FormGroup;
        if (detail.controls.RowState.value !== RowState.Add) {
            //เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
            const deleting = this.contractHead.ContractAttachment.find(item =>
                item.ContractAttachmentId == detail.controls.ContractAttachmentId.value
            )
            deleting.RowState = RowState.Delete;
        }

        const rows = [...this.contractAttachments.getRawValue()];
        rows.splice(index, 1);

        //--ลบข้อมูลrecordนี้ออกจาก formarray
        this.contractAttachments.patchValue(rows, { emitEvent: false });
        this.contractAttachments.removeAt(this.contractAttachments.length - 1);
        this.contractAttachments.markAsDirty();
        //---------------------------------
        this.checkContractAttachment();
    }

    removeAttachmentCall(index) {
        this.attachmentFilesCall.splice(index, 1);
        let detail = this.contractAttachmentsCall.at(index) as FormGroup;
        if (detail.controls.RowState.value !== RowState.Add) {
            //เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
            const deleting = this.contractHead.ContractAttachmentCall.find(item =>
                item.TrackingAttachmentId == detail.controls.TrackingAttachmentId.value
            )
            deleting.RowState = RowState.Delete;
        }

        const rows = [...this.contractAttachmentsCall.getRawValue()];
        rows.splice(index, 1);

        //--ลบข้อมูลrecordนี้ออกจาก formarray
        this.contractAttachmentsCall.patchValue(rows, { emitEvent: false });
        this.contractAttachmentsCall.removeAt(this.contractAttachmentsCall.length - 1);
        this.contractAttachmentsCall.markAsDirty();
        //---------------------------------
        this.checkContractAttachmentCall();
    }

    removeAttachmentHome(index) {
        this.attachmentFilesHome.splice(index, 1);
        let detail = this.contractAttachmentsHome.at(index) as FormGroup;
        if (detail.controls.RowState.value !== RowState.Add) {
            //เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
            const deleting = this.contractHead.ContractAttachmentHome.find(item =>
                item.TrackingAttachmentId == detail.controls.TrackingAttachmentId.value
            )
            deleting.RowState = RowState.Delete;
        }

        const rows = [...this.contractAttachmentsHome.getRawValue()];
        rows.splice(index, 1);

        //--ลบข้อมูลrecordนี้ออกจาก formarray
        this.contractAttachmentsHome.patchValue(rows, { emitEvent: false });
        this.contractAttachmentsHome.removeAt(this.contractAttachmentsHome.length - 1);
        this.contractAttachmentsHome.markAsDirty();
        //---------------------------------
        this.checkContractAttachmentHome();
    }

    removeAttachmentNpl(index) {
        this.attachmentFilesNpl.splice(index, 1);
        let detail = this.contractAttachmentsNpl.at(index) as FormGroup;
        if (detail.controls.RowState.value !== RowState.Add) {
            //เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
            const deleting = this.contractHead.ContractAttachmentNpl.find(item =>
                item.TrackingAttachmentId == detail.controls.TrackingAttachmentId.value
            )
            deleting.RowState = RowState.Delete;
        }

        const rows = [...this.contractAttachmentsNpl.getRawValue()];
        rows.splice(index, 1);

        //--ลบข้อมูลrecordนี้ออกจาก formarray
        this.contractAttachmentsNpl.patchValue(rows, { emitEvent: false });
        this.contractAttachmentsNpl.removeAt(this.contractAttachmentsNpl.length - 1);
        this.contractAttachmentsNpl.markAsDirty();
        //---------------------------------
        this.checkContractAttachmentNpl();
    }

    removeAttachmentLaw(index) {
        this.attachmentFilesLaw.splice(index, 1);
        let detail = this.contractAttachmentsLaw.at(index) as FormGroup;
        if (detail.controls.RowState.value !== RowState.Add) {
            //เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
            const deleting = this.contractHead.ContractAttachmentLaw.find(item =>
                item.TrackingAttachmentId == detail.controls.TrackingAttachmentId.value
            )
            deleting.RowState = RowState.Delete;
        }

        const rows = [...this.contractAttachmentsLaw.getRawValue()];
        rows.splice(index, 1);

        //--ลบข้อมูลrecordนี้ออกจาก formarray
        this.contractAttachmentsLaw.patchValue(rows, { emitEvent: false });
        this.contractAttachmentsLaw.removeAt(this.contractAttachmentsLaw.length - 1);
        this.contractAttachmentsLaw.markAsDirty();
        //---------------------------------
        this.checkContractAttachmentLaw();
    }

    removeAttachmentOther(index) {
        this.attachmentFilesOther.splice(index, 1);
        let detail = this.contractAttachmentsOther.at(index) as FormGroup;
        if (detail.controls.RowState.value !== RowState.Add) {
            //เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
            const deleting = this.contractHead.ContractAttachmentOther.find(item =>
                item.TrackingAttachmentId == detail.controls.TrackingAttachmentId.value
            )
            deleting.RowState = RowState.Delete;
        }

        const rows = [...this.contractAttachmentsOther.getRawValue()];
        rows.splice(index, 1);

        //--ลบข้อมูลrecordนี้ออกจาก formarray
        this.contractAttachmentsOther.patchValue(rows, { emitEvent: false });
        this.contractAttachmentsOther.removeAt(this.contractAttachmentsOther.length - 1);
        this.contractAttachmentsOther.markAsDirty();
        //---------------------------------
        this.checkContractAttachmentOther();
    }

    prepareSave(values: Object) {
        Object.assign(this.contractHead, values);

        // -----------------------------------------------------ContractIncomeItem--------------------------------------------------------
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

        const items = this.contractHead.ContractIncomeItem.concat(this.contractHead.ContractPaymentItem);
        if (!this.contractHead.ContractItem) {
            this.contractHead.ContractItem = [];
        }
        Object.assign(this.contractHead.ContractItem, items)

        // -----------------------------------------------------contractPaymentItems--------------------------------------------------------
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

        // -----------------------------------------------------contractInformations--------------------------------------------------------
        const Informations = this.contractInformations.getRawValue();
        //add
        const addingInformations = Informations.filter(function (item) {
            return item.RowState == RowState.Add;
        });

        //remove ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
        this.contractHead.ContractInformation.map(info => {
            return Object.assign(info, Informations.filter(item => item.RowState == RowState.Edit || item.RowState == RowState.Delete).find((item) => {
                return info.InformationId == item.InformationId
            }));
        })

        //เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
        this.contractHead.ContractInformation = this.contractHead.ContractInformation.filter(item => item.RowState !== RowState.Add && item.RowState !== null).concat(addingInformations);

        let data = this.contractHead.ContractInformation.filter(x => x.InformationId == 13)
        if (data && data.length > 0 && data[0].Active) {
            if (data[0].AddOn != this.loanAgreementForm.controls.AddOn.value && data[0].ContractInformationId > 0) {
                data[0].RowState = RowState.Edit;
            }

            data[0].AddOn = this.loanAgreementForm.controls.AddOn.value;
            this.contractHead.ContractInformation.filter(x => x.InformationId == 13).map(info => {
                return Object.assign(info, data[0]);
            })
        };

        // -----------------------------------------------------contractAttachments--------------------------------------------------------
        const attachments = this.contractAttachments.getRawValue();
        //add
        const adding = attachments.filter(function (item) {
            return item.RowState == RowState.Add;
        });
        //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
        this.contractHead.ContractAttachment.map(attach => {
            return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).find((item) => {
                return attach.ContractAttachmentId == item.ContractAttachmentId && attach.FileName == item.FileName
            }));
        })
        this.contractHead.ContractAttachment = this.contractHead.ContractAttachment.filter(item => item.RowState !== RowState.Normal && item.RowState !== RowState.Add).concat(adding);

        // -----------------------------------------------------contractAttachmentsCall--------------------------------------------------------
        const attachmentsCall = this.contractAttachmentsCall.getRawValue();
        //add
        const addingCall = attachmentsCall.filter(function (item) {
            return item.RowState == RowState.Add;
        });
        //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
        if (!this.contractHead.ContractAttachmentCall) {
            this.contractHead.ContractAttachmentCall = [];
        }
        this.contractHead.ContractAttachmentCall.map(attach => {
            return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).find((item) => {
                return attach.TrackingAttachmentId == item.TrackingAttachmentId && attach.FileName == item.FileName
            }));
        })
        this.contractHead.ContractAttachmentCall = this.contractHead.ContractAttachmentCall.filter(item => item.RowState !== RowState.Normal && item.RowState !== RowState.Add).concat(addingCall);

        // -----------------------------------------------------contractAttachmentsHome--------------------------------------------------------
        const attachmentsHome = this.contractAttachmentsHome.getRawValue();
        //add
        const addingHome = attachmentsHome.filter(function (item) {
            return item.RowState == RowState.Add;
        });
        //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
        if (!this.contractHead.ContractAttachmentHome) {
            this.contractHead.ContractAttachmentHome = [];
        }
        this.contractHead.ContractAttachmentHome.map(attach => {
            return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).find((item) => {
                return attach.TrackingAttachmentId == item.TrackingAttachmentId && attach.FileName == item.FileName
            }));
        })
        this.contractHead.ContractAttachmentHome = this.contractHead.ContractAttachmentHome.filter(item => item.RowState !== RowState.Normal && item.RowState !== RowState.Add).concat(addingHome);

        // -----------------------------------------------------contractAttachmentsNpl--------------------------------------------------------
        const attachmentsNpl = this.contractAttachmentsNpl.getRawValue();
        //add
        const addingNpl = attachmentsNpl.filter(function (item) {
            return item.RowState == RowState.Add;
        });
        //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
        if (!this.contractHead.ContractAttachmentNpl) {
            this.contractHead.ContractAttachmentNpl = [];
        }
        this.contractHead.ContractAttachmentNpl.map(attach => {
            return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).find((item) => {
                return attach.TrackingAttachmentId == item.TrackingAttachmentId && attach.FileName == item.FileName
            }));
        })
        this.contractHead.ContractAttachmentNpl = this.contractHead.ContractAttachmentNpl.filter(item => item.RowState !== RowState.Normal && item.RowState !== RowState.Add).concat(addingNpl);

        // -----------------------------------------------------contractAttachmentsLaw--------------------------------------------------------
        const attachmentsLaw = this.contractAttachmentsLaw.getRawValue();
        //add
        const addingLaw = attachmentsLaw.filter(function (item) {
            return item.RowState == RowState.Add;
        });
        //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
        if (!this.contractHead.ContractAttachmentLaw) {
            this.contractHead.ContractAttachmentLaw = [];
        }
        this.contractHead.ContractAttachmentLaw.map(attach => {
            return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).find((item) => {
                return attach.TrackingAttachmentId == item.TrackingAttachmentId && attach.FileName == item.FileName
            }));
        })
        this.contractHead.ContractAttachmentLaw = this.contractHead.ContractAttachmentLaw.filter(item => item.RowState !== RowState.Normal && item.RowState !== RowState.Add).concat(addingLaw);

        // -----------------------------------------------------contractAttachmentsOther--------------------------------------------------------
        const attachmentsOther = this.contractAttachmentsOther.getRawValue();
        //add
        const addingOther = attachmentsOther.filter(function (item) {
            return item.RowState == RowState.Add;
        });
        //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
        if (!this.contractHead.ContractAttachmentOther) {
            this.contractHead.ContractAttachmentOther = [];
        }
        this.contractHead.ContractAttachmentOther.map(attach => {
            return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).find((item) => {
                return attach.TrackingAttachmentId == item.TrackingAttachmentId && attach.FileName == item.FileName
            }));
        })
        this.contractHead.ContractAttachmentOther = this.contractHead.ContractAttachmentOther.filter(item => item.RowState !== RowState.Normal && item.RowState !== RowState.Add).concat(addingOther);


        // -----------------------------------------------------ContractMgmEmployee--------------------------------------------------------
        const getContractMgmEmployee = this.ContractMgmEmployee.getRawValue();
        const ContractMgmEmployeeAdding = getContractMgmEmployee.filter(function (item) {
            return item.rowState === RowState.Add;
        });

        this.contractHead.ContractMgmEmployee.map(conEmp => {
            return Object.assign(conEmp, getContractMgmEmployee.concat(this.ContractMgmEmployeeDeleting).find((o) => {
                return o.ContractMgmEmployeeId === conEmp.ContractMgmEmployeeId && o.CompanyCode === conEmp.CompanyCode && o.EmployeeCode === conEmp.EmployeeCode;
            }));
        });
        this.contractHead.ContractMgmEmployee = this.contractHead.ContractMgmEmployee.concat(ContractMgmEmployeeAdding);
        this.contractHead.ContractMgmEmployee = this.contractHead.ContractMgmEmployee.concat(this.ContractMgmEmployeeDeleting);

        // -----------------------------------------------------ContractMgm--------------------------------------------------------
        const getContractMgm = this.ContractMgm.getRawValue();
        const ContractMgmAdding = getContractMgm.filter(function (item) {
            return item.rowState === RowState.Add;
        });

        this.contractHead.ContractMgm.map(conEmp => {
            return Object.assign(conEmp, getContractMgm.concat(this.ContractMgmDeleting).find((o) => {
                return o.ContractMgmId === conEmp.ContractMgmId && o.MgmCode === conEmp.MgmCode;
            }));
        });
        this.contractHead.ContractMgm = this.contractHead.ContractMgm.concat(ContractMgmAdding);
        this.contractHead.ContractMgm = this.contractHead.ContractMgm.concat(this.ContractMgmDeleting);

    }

    onSubmit() {
        this.submitted = true;

        if (this.loanAgreementForm.invalid) {
            this.focusToggle = !this.focusToggle;

            let data = this.contractInformations.getRawValue().filter(x => x.InformationId == 13)
            if (data && data.length > 0 && data[0].Active) {
                if (this.loanAgreementForm.controls.AddOn.value == null) {
                    this.as.warning(' ', 'กรุณากรอกยอดเงินขอกู้เพิ่ม กรณีเลือกลูกค้าเก่า(กู้เงินเพิ่ม)');
                }
            };
            return;
        }

        if (this.loanAgreementForm.controls.ContractStatus.value != 'S') {
            if (this.chkDupIncomeItems()) {
                return this.as.error("", "Message.STD00004", ["Label.LOTS04.income"]);
            }

            if (this.chkDupPaymentItem()) {
                return this.as.error("", "Message.STD00004", ["Label.LOTS04.cost"]);
            }
        }

        if (this.loanAgreementForm.controls['OldContractNo'].value) {
            this.loanAgreementForm.controls['OldContractNo'].setValue(this.loanAgreementForm.controls['OldContractNo'].value.trim());
        }

        var activeInoformation = this.contractInformations.getRawValue().filter(x => x.Active);
        if (activeInoformation.length == 0 && !this.loanAgreementForm.controls.MGMCheckbox.value) {
            return this.as.warning('', 'Message.STD00012', ['Label.LOTS04.informationCard']);
        }

        this.saving = true;
        this.prepareSave(this.loanAgreementForm.getRawValue());
        this.lots03Service.saveLoanAgreement(this.contractHead).pipe(
            switchMap((id) => this.lots03Service.getLoanAgreementDetail(this.contractHead.ContractHeadId || id)),
            finalize(() => {
                this.saving = false;
                this.submitted = false;
            }))
            .subscribe((res: ContractHead) => {
                this.contractHead = res;
                this.rebuildForm();
                this.as.success('', 'Message.STD00006');
            });
    }

    CloseReFinance(refinanceType: any) {
        this.submitted = true;

        this.reFinanceStatus = true;

        if (refinanceType == '1') {
            this.contractHead.PreRefinanceType = '0';
        } else {
            this.contractHead.PreRefinanceType = '2';
        }

        this.lots03Service.reFinanceContract(this.contractHead).pipe(
            switchMap((id) => this.lots03Service.getLoanAgreementDetail(this.contractHead.ContractHeadId || id)),
            finalize(() => {
                this.reFinanceStatus = false;
                this.submitted = false;
            }))
            .subscribe((res: ContractHead) => {
                this.contractHead = res;
                if (res.ContractType == 'M')
                    this.router.navigate(['/lo/lots04', { ContractNo: res.ContractNo, CloseRefinance: true }], { skipLocationChange: true });
                else this.router.navigate(['/lo/lots04', { ContractNo: res.MainContractNo, CloseRefinance: true }], { skipLocationChange: true });
            });
    }

    onCloseReFinance(refinanceType: any) {
        // if (!this.contractHead.CanRefinanceByDate) {
        //     this.as.warning('', 'ไม่สามารถ Refinace ได้เป็นระยะเวลา 30 วัน');
        //     return;
        // }

        if (!this.loanAgreementForm.controls.CanRefinance.value) {
            this.as.warning('', 'Message.LO00033');
            return;
        }

        if (this.contractHead.IsNotRefinance) {
            this.as.warning('', 'Message.LO00077');
            return;
        }

        if (this.loanAgreementForm.invalid) {
            this.focusToggle = !this.focusToggle;

            let data = this.contractInformations.getRawValue().filter(x => x.InformationId == 13)
            if (data && data.length > 0 && data[0].Active) {
                if (this.loanAgreementForm.controls.AddOn.value == null) {
                    this.as.warning(' ', 'กรุณากรอกยอดเงินขอกู้เพิ่ม กรณีเลือกลูกค้าเก่า(กู้เงินเพิ่ม)');
                }
            };
            return;
        }

        if (this.loanAgreementForm.dirty) {
            return;
        }
        return this.modal.confirm("Message.LO00025").subscribe(
            (val) => {
                if (val) {
                    this.CloseReFinance(refinanceType);
                }
                else {
                    return;
                }
            }
        )
    }

    CancelStatus() {
        this.submitted = true;
        this.cancelStatus = true;
        this.lots03Service.cancelContract(this.contractHead).pipe(
            switchMap((id) => this.lots03Service.getLoanAgreementDetail(this.contractHead.ContractHeadId || id)),
            finalize(() => {
                this.cancelStatus = false;
                this.submitted = false;
            }))
            .subscribe((res: ContractHead) => {
                this.contractHead = res;
                this.rebuildForm();
                this.as.success('', 'Message.STD00006');
            });
    }

    onCancel() {
        if (this.loanAgreementForm.invalid) {
            this.focusToggle = !this.focusToggle;

            let data = this.contractInformations.getRawValue().filter(x => x.InformationId == 13)
            if (data && data.length > 0 && data[0].Active && this.loanAgreementForm.controls.AddOn.value == null) {
                this.as.warning(' ', 'กรุณากรอกยอดเงินขอกู้เพิ่ม กรณีเลือกลูกค้าเก่า(กู้เงินเพิ่ม)');
                return;
            };
            return;
        };

        if (this.loanAgreementForm.dirty) {
            return;
        }
        return this.modal.confirm("Message.LO00024").subscribe(
            (val) => {
                if (val) {

                    this.CancelStatus();

                }
                else {
                    return;
                }
            }
        )
    }

    canDeactivate(): Observable<boolean> | boolean {
        if (!this.loanAgreementForm.dirty) {
            return true;
        }
        return this.modal.confirm('Message.STD00002');
    }

    back() {
        this.router.navigate([this.backToPage], { skipLocationChange: true });
    }

    onPrintRf06() {
        if (this.loanAgreementForm.controls.ContractType.value == 'M') {
            this.reportParam.FromContractNo = this.loanAgreementForm.controls.ContractNo.value;
            this.reportParam.ToContractNo = this.loanAgreementForm.controls.maxContractNo.value;
            this.reportParam.OldContractHeadId = this.loanAgreementForm.controls.OldContractId.value;
        }
        else {
            this.reportParam.FromContractNo = this.loanAgreementForm.controls.MainContractNo.value;
            this.reportParam.ToContractNo = this.loanAgreementForm.controls.maxContractNo.value;
            this.reportParam.OldContractHeadId = this.loanAgreementForm.controls.OldContractId.value;
        }

        this.reportParam.ReportName = 'LORF06_New';
        this.reportParam.ExportType = 'pdf';

        this.lots03Service.generateReportRf06(this.reportParam).pipe(
            finalize(() => {
            })
        )
            .subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');
                }
            });
    }

    onPrintRf02() {
        if (this.loanAgreementForm.controls.ContractType.value == 'M') {
            this.reportParam.FromContractNo = this.loanAgreementForm.controls.ContractNo.value;
            this.reportParam.ToContractNo = this.loanAgreementForm.controls.maxContractNo.value;
        }
        else {
            this.reportParam.FromContractNo = this.loanAgreementForm.controls.MainContractNo.value;
            this.reportParam.ToContractNo = this.loanAgreementForm.controls.maxContractNo.value;
        }

        this.reportParam.ReportName = 'LORF02_New';
        this.reportParam.ExportType = 'pdf';

        this.lots03Service.generateReportRf02(this.reportParam).pipe(
            finalize(() => {
            })
        )
            .subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');
                }
            });
    }

    onPrintRf09() {
        if (this.loanAgreementForm.controls.ContractType.value == 'M') {
            this.reportParam.FromContractNo = this.loanAgreementForm.controls.ContractNo.value;
            this.reportParam.ToContractNo = this.loanAgreementForm.controls.maxContractNo.value;
        }
        else {
            this.reportParam.FromContractNo = this.loanAgreementForm.controls.MainContractNo.value;
            this.reportParam.ToContractNo = this.loanAgreementForm.controls.maxContractNo.value;
        }

        this.reportParam.ReportName = 'LORF09';
        this.reportParam.ExportType = 'pdf';

        this.lots03Service.generateReportRf09(this.reportParam).pipe(
            finalize(() => {
            })
        )
            .subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');
                }
            });
    }

    onPrintLoanPeriodTable(exportType) {
        this.report.ContractNo = this.contractHead.ContractNo;
        this.report.ExportType = exportType;
        this.lots03Service.print(this.report)
            .pipe(
                finalize(() => { })
            ).subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, exportType);

                }
            });
    }

    onPrintCertificateAddress() {
        this.reportLorf10.ContractHeadId = this.contractHead.ContractHeadId;
        this.lots03Service.printCertificateAddress(this.reportLorf10)
            .pipe(
                finalize(() => { })
            ).subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');

                }
            });
    }

    onPrintPaymentVoucher() {
        this.reportVoucher.ContractHeadId = this.contractHead.ContractHeadId;
        this.lots03Service.printPaymentVoucher(this.reportVoucher)
            .pipe(
                finalize(() => { })
            ).subscribe((res: any) => {
                if (res) {
                    this.OpenWindow(res.reports);

                }
            });
    }

    onPrintReceiptVoucher() {
        this.reportVoucher.ContractHeadId = this.contractHead.ContractHeadId;
        this.lots03Service.printReceiptVoucher(this.reportVoucher)
            .pipe(
                finalize(() => { })
            ).subscribe((res: any) => {
                if (res) {
                    this.OpenWindow(res.reports);
                }
            });
    }

    async OpenWindow(data) {
        await window.open(data, '_blank');
    }

    onPrintConsent() {
        this.reportVoucher.ContractHeadId = this.contractHead.ContractHeadId;
        this.lots03Service.printConsent(this.reportVoucher)
            .pipe(
                finalize(() => { })
            ).subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');

                }
            });
    }

    async DownLoadFile(data, exportType) {
        let doc = document.createElement("a");
        doc.href = "data:application/" + exportType + ";base64," + data;
        doc.download = this.contractHead.ContractNo + "." + exportType;
        doc.click();
    }

    // MGMEmployee
    get ContractMgmEmployee(): FormArray {
        return this.loanAgreementForm.get('ContractMgmEmployee') as FormArray;
    }

    get ContractMgm(): FormArray {
        return this.loanAgreementForm.get('ContractMgm') as FormArray;
    }

    removeRowEmployee(index) {
        const getContractMgmEmployee = this.ContractMgmEmployee.at(index) as FormGroup;
        if (getContractMgmEmployee.controls.RowState.value !== RowState.Add) {
            getContractMgmEmployee.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
            this.ContractMgmEmployeeDeleting.push(getContractMgmEmployee.getRawValue());
        }

        const rows = [...this.ContractMgmEmployee.getRawValue()];
        rows.splice(index, 1);

        this.ContractMgmEmployee.patchValue(rows, { emitEvent: false });
        this.ContractMgmEmployee.removeAt(this.ContractMgmEmployee.length - 1);
        this.loanAgreementForm.markAsDirty();
    }

    removeRowMgm(index) {
        const getContractMgm = this.ContractMgm.at(index) as FormGroup;
        if (getContractMgm.controls.RowState.value !== RowState.Add) {
            getContractMgm.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
            this.ContractMgmDeleting.push(getContractMgm.getRawValue());
        }

        const rows = [...this.ContractMgm.getRawValue()];
        rows.splice(index, 1);

        this.ContractMgm.patchValue(rows, { emitEvent: false });
        this.ContractMgm.removeAt(this.ContractMgm.length - 1);
        this.loanAgreementForm.markAsDirty();
    }

    searchEmployeeModal() {
        this.lots03Service.getEmployeeTable(this.searchEmpForm.value, this.pageEmployee)
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

    searchMgmModal() {
        this.lots03Service.getMgmTable(this.searchMgmForm.value, this.pageMgm)
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

    openAddMgmEmployeeModal() {
        this.searchEmployeeModal();
        this.popupEmployee = this.modal.open(this.tplAddEmployeeModal, Size.large);
    }

    closeMgmEmployeeModal(flag) {
        if (flag) {
            this.popupEmployee.hide();
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

    onTableEvent(event) {
        this.pageEmployee = event;
        this.searchEmployeeModal();
    }

    onTableMgmEvent(event) {
        this.pageMgm = event;
        this.searchMgmModal();
    }

    linkCustomerDetail(CustomerCode?: any) {
        const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots01/detail', { CustomerCode: CustomerCode ? CustomerCode : this.loanAgreementForm.controls.CustomerCode.value }], { skipLocationChange: true }));
        window.open(url, '_blank');
    }

    onTableEventComHis(event) {
        this.pageCom = event;
        this.searchHistoryCompany();
    }

    onTableEventNplHis(event) {
        this.pageNpl = event;
        this.searchHistoryHome();
    }

    onTableEventCallHis(event) {
        this.pageCall = event;
        this.searchHistoryCall();
    }

    onTableEventLawHis(event) {
        this.pageLaw = event;
        this.searchHistoryLaw();
    }

    onTableEventSmsHis(event) {
        this.pageSms = event;
        this.searchHistorySms();
    }

    onTableEventTrackingAttachmentCall(event) {
        this.pageTrackingAttachmentCall = event;
        this.searchTrackingAttachmentCall();
    }

    onTableEventTrackingAttachmentHome(event) {
        this.pageTrackingAttachmentHome = event;
        this.searchTrackingAttachmentHome();
    }

    onTableEventTrackingAttachmentNpl(event) {
        this.pageTrackingAttachmentNpl = event;
        this.searchTrackingAttachmentNpl();
    }

    onTableEventTrackingAttachmentLaw(event) {
        this.pageTrackingAttachmentLaw = event;
        this.searchTrackingAttachmentLaw();
    }

    searchHistoryCall() {
        this.lots03Service.getSearchHistoryCall(this.contractHead.MainContrctHeadId, this.pageCall)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.callHis = res.Rows;
                    this.pageCall.totalElements = res.Rows.length ? res.Total : 0;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    searchAttachmentCall() {

    }

    searchHistoryCompany() {
        this.lots03Service.getSearchHistoryCompany(this.contractHead.MainContrctHeadId, this.pageCom)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.comHis = res.Rows;
                    this.pageCom.totalElements = res.Rows.length ? res.Total : 0;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    searchHistoryHome() {
        this.lots03Service.getSearchHistoryHome(this.contractHead.MainContrctHeadId, this.pageNpl)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.nplHis = res.Rows;
                    this.pageNpl.totalElements = res.Rows.length ? res.Total : 0;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    searchHistoryLaw() {
        this.lots03Service.getSearchHistoryLaw(this.contractHead.MainContrctHeadId, this.pageLaw)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.lawHis = res.Rows;
                    this.pageLaw.totalElements = res.Rows.length ? res.Total : 0;
                    console.log(this.comHis.length);

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    searchHistorySms() {
        this.lots03Service.getSearchHistorySms(this.contractHead.MainContrctHeadId, this.pageSms)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.smsHis = res.Rows;
                    this.pageSms.totalElements = res.Rows.length ? res.Total : 0;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    searchTrackingAttachmentCall() {
        this.lots03Service.getSearchTrackingAttachmentCall(this.contractHead.MainContrctHeadId, this.pageTrackingAttachmentCall)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.trackingAttachmentCall = res.Rows;
                    this.pageTrackingAttachmentCall.totalElements = res.Rows.length ? res.Total : 0;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    searchTrackingAttachmentHome() {
        this.lots03Service.getSearchTrackingAttachmentHome(this.contractHead.MainContrctHeadId, this.pageTrackingAttachmentHome)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.trackingAttachmentHome = res.Rows;
                    this.pageTrackingAttachmentHome.totalElements = res.Rows.length ? res.Total : 0;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    searchTrackingAttachmentNpl() {
        this.lots03Service.getSearchTrackingAttachmentNpl(this.contractHead.MainContrctHeadId, this.pageTrackingAttachmentNpl)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.trackingAttachmentNpl = res.Rows;
                    this.pageTrackingAttachmentNpl.totalElements = res.Rows.length ? res.Total : 0;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    searchTrackingAttachmentLaw() {
        this.lots03Service.getSearchTrackingAttachmentLaw(this.contractHead.MainContrctHeadId, this.pageTrackingAttachmentLaw)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.trackingAttachmentLaw = res.Rows;
                    this.pageTrackingAttachmentLaw.totalElements = res.Rows.length ? res.Total : 0;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    checkContractAttachment() {
        this.contractAttachments.enable();
        for (let i = 0; i < this.contractAttachments.length; i++) {
            let form = this.contractAttachments.controls[i] as FormGroup;
            if (form.controls.ContractAttachmentId.value != 0 || form.controls.IsSignature.value) {
                form.controls.AttachmentTypeCode.disable({ emitEvent: false });
                form.controls.AttahmentId.disable({ emitEvent: false });
                form.controls.Description.disable({ emitEvent: false });
            }
        }
    }

    checkContractAttachmentCall() {
        this.contractAttachmentsCall.enable();
        for (let i = 0; i < this.contractAttachmentsCall.length; i++) {
            let form = this.contractAttachmentsCall.controls[i] as FormGroup;
            if (form.controls.TrackingAttachmentId.value != 0) {
                form.controls.AttahmentId.disable({ emitEvent: false });
                form.controls.Description.disable({ emitEvent: false });
            }
        }
    }

    checkContractAttachmentHome() {
        this.contractAttachmentsHome.enable();
        for (let i = 0; i < this.contractAttachmentsHome.length; i++) {
            let form = this.contractAttachmentsHome.controls[i] as FormGroup;
            if (form.controls.TrackingAttachmentId.value != 0) {
                form.controls.AttahmentId.disable({ emitEvent: false });
                form.controls.Description.disable({ emitEvent: false });
            }
        }
    }

    checkContractAttachmentNpl() {
        this.contractAttachmentsNpl.enable();
        for (let i = 0; i < this.contractAttachmentsNpl.length; i++) {
            let form = this.contractAttachmentsNpl.controls[i] as FormGroup;
            if (form.controls.TrackingAttachmentId.value != 0) {
                form.controls.AttahmentId.disable({ emitEvent: false });
                form.controls.Description.disable({ emitEvent: false });
            }
        }
    }

    checkContractAttachmentLaw() {
        this.contractAttachmentsLaw.enable();
        for (let i = 0; i < this.contractAttachmentsLaw.length; i++) {
            let form = this.contractAttachmentsLaw.controls[i] as FormGroup;
            if (form.controls.TrackingAttachmentId.value != 0) {
                form.controls.AttahmentId.disable({ emitEvent: false });
                form.controls.Description.disable({ emitEvent: false });
            }
        }
    }

    checkContractAttachmentOther() {
        this.contractAttachmentsOther.enable();
        for (let i = 0; i < this.contractAttachmentsOther.length; i++) {
            let form = this.contractAttachmentsOther.controls[i] as FormGroup;
            if (form.controls.TrackingAttachmentId.value != 0) {
                form.controls.AttahmentId.disable({ emitEvent: false });
                form.controls.Description.disable({ emitEvent: false });
            }
        }
    }

    fileNameReturn(filename, index) {
        let form = this.contractAttachments.controls[index] as FormGroup;
        form.controls.FileName.setValue(filename);
    }

    fileNameReturnCall(filename, index) {
        let form = this.contractAttachmentsCall.controls[index] as FormGroup;
        form.controls.FileName.setValue(filename);
    }

    fileNameReturnHome(filename, index) {
        let form = this.contractAttachmentsHome.controls[index] as FormGroup;
        form.controls.FileName.setValue(filename);
    }

    fileNameReturnNpl(filename, index) {
        let form = this.contractAttachmentsNpl.controls[index] as FormGroup;
        form.controls.FileName.setValue(filename);
    }

    fileNameReturnLaw(filename, index) {
        let form = this.contractAttachmentsLaw.controls[index] as FormGroup;
        form.controls.FileName.setValue(filename);
    }

    fileNameReturnOther(filename, index) {
        let form = this.contractAttachmentsOther.controls[index] as FormGroup;
        form.controls.FileName.setValue(filename);
    }

    onTableEventContractPolicys(event) {
        this.pagePeriods = event;
        this.onSearchContractPolicy();
    }

    addPolicy(row, content) {
        this.rebuildFormContractPolicy(row);
        this.popup = this.modal.open(content, Size.large);
    }

    close() {
        this.popup.hide();
    }

    prepareSavePolicyPeriod(values: Object) {
        Object.assign(this.contractPolicy, values);
    }

    onSearchContractPolicy() {
        this.lots03Service.getLoanAgreementPolicyDetail(Object.assign({
            ContractHeadId: this.contractHead.ContractHeadId
        }), this.pageContracPolicy)
            .subscribe(
                (res: any) => {
                    this.contractPolicys = res.Rows;
                    this.pageContracPolicy.totalElements = res.Total;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    onSubmitContractPolicy() {
        this.submitted = true;
        if (this.policyPeriodForm.invalid) {
            this.focusToggle = !this.focusToggle;
            return;
        }

        this.policyPeriodForm.controls.ContractHeadId.setValue(this.contractHead.ContractHeadId);
        this.saving = true;
        this.prepareSavePolicyPeriod(this.policyPeriodForm.getRawValue());
        this.lots03Service.saveLoanAgreementPolicy(this.contractPolicy).pipe(
            finalize(() => {
                this.saving = false;
                this.submitted = false;
            }))
            .subscribe((res: any) => {
                this.close();
                this.onSearchContractPolicy();
                this.as.success('', 'Message.STD00006');
            });
    }

    rebuildFormContractPolicy(row) {
        this.policyPeriodForm.markAsPristine();
        if (row != null) {
            this.policyPeriodForm.patchValue(row);
            this.policyPeriodForm.controls.PolicyPeriodCount.disable({ emitEvent: false })
        } else {
            this.policyPeriodForm.controls.PolicyPeriodCount.enable({ emitEvent: false })
            this.policyPeriodForm.reset();
            this.policyPeriodForm.controls.PolicyCode.setValue('1', { emitEvent: false })
            this.policyPeriodForm.controls.PolicyDate.setValue(this.nowDate, { emitEvent: false })
        }

        // Super User สาารถแก้ไขวันที่ได้
        if (this.IsSuperUser) {
            this.policyPeriodForm.controls.PolicyDate.enable({ emitEvent: false })
        }
    }

    removeContractPolicy(row) {
        this.modal.confirm('Message.STD000030').subscribe(
            (res) => {
                if (res) {
                    this.lots03Service.removeContractPolicy(row).subscribe(
                        (response) => {
                            this.as.success(' ', 'Message.STD00014');
                            this.onSearchContractPolicy();
                        }, (error) => {
                            this.as.error(' ', 'Message.STD000032');
                        });
                }
            });
    }

    linkReceiptDetail(ReceiptHeadId?: any, DocumentType?: any) {
        if (DocumentType == 'RC') {
            const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots09/detail', { ReceiptHeadId: ReceiptHeadId }], { skipLocationChange: true }));
            window.open(url, '_blank');
        } else {
            const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots15/detail', { ReceiptHeadId: ReceiptHeadId }], { skipLocationChange: true }));
            window.open(url, '_blank');
        }
    }

    onCancelRefinance() {
        this.lots03Service.isCheckCancelRefinance(this.contractHead.ContractHeadId).pipe(
            finalize(() => {
            }))
            .subscribe(
                (res: boolean) => {
                    if (res) {
                        this.as.warning(' ', 'ไม่สามารถยกเลิกเตรียมรีไฟแนนซ์ได้เนื่องจากมีการบันทึกสัญญาแล่ว');
                    } else {
                        this.submitted = true;
                        this.cancelRefinance = true;
                        this.lots03Service.cancelReFinanceContract(this.contractHead).pipe(
                            switchMap((id) => this.lots03Service.getLoanAgreementDetail(this.contractHead.ContractHeadId || id)),
                            finalize(() => {
                                this.cancelRefinance = false;
                                this.submitted = false;
                            }))
                            .subscribe((res: ContractHead) => {
                                this.contractHead = res;
                                this.rebuildForm();
                                this.as.success('', 'Message.STD00006');
                            });
                    }
                });
    }

    onCancelContractCapital() {
        this.submitted = true;
        this.cancelContractCapital = true;
        this.lots03Service.cancelContractCapital(this.contractHead).pipe(
            switchMap((id) => this.lots03Service.getLoanAgreementDetail(this.contractHead.ContractHeadId || id)),
            finalize(() => {
                this.cancelContractCapital = false;
                this.submitted = false;
            }))
            .subscribe((res: ContractHead) => {
                this.contractHead = res;
                this.rebuildForm();
                this.as.success('', 'Message.STD00006');
            });
    }

    linkPayment(MainContractHeadID?: any, FlagPayOff?: any) {
        const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots08/detail', { MainContractHeadID: MainContractHeadID, FlagPayOff: FlagPayOff, CompanyCode: localStorage.getItem('company') }], { skipLocationChange: true }));
        window.open(url, '_blank');
    }

    onSearchContractProcess() {
        this.lots03Service.getContractProcessLists(Object.assign({
            ContractHeadId: this.contractHead.ContractHeadId
        }), this.pageContractProcess)
            .subscribe(
                (res: any) => {
                    this.contractProcessLists = res.Rows;
                    this.pageContractProcess.totalElements = res.Total;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    openRemoveContractProcessPopup(content, row) {
        this.removeContractProcessForm.controls.MainContractHeadId.setValue(row.MainContractHeadId);
        this.removeContractProcessForm.controls.ReceiptHeadId.setValue(row.ReceiptHeadId);
        this.removeContractProcessForm.controls.ProcessDate.setValue(row.MainContractTransactionDate);
        this.removeContractProcessForm.controls.IsDueDate.setValue(row.IsDueDate);
        this.removeContractProcessForm.controls.BillPaymentDetailId.setValue(row.BillPaymentDetailId);
        this.removeContractProcessForm.controls.IsBillPayment.setValue(row.IsBillPayment);

        this.removeContractProcessPopup = this.modal.open(content, Size.medium);
    }

    onRemoveContractProcess() {
        if (this.removeContractProcessForm.invalid) {
            return;
        }
        this.loadingContractProcess = true;
        this.lots03Service.removeContractProcess(this.removeContractProcessForm.getRawValue())
            .pipe(finalize(() => {
                this.loadingContractProcess = false;
            }))
            .subscribe(
                (res: any) => {
                    this.closeRemoveContractProcess();
                    this.as.success(' ', 'Message.STD00014');
                    this.onSearchContractProcess();
                }, (error) => {
                    this.as.error(' ', 'Message.STD000032');
                });
    }

    closeRemoveContractProcess() {
        this.removeContractProcessPopup.hide();
        this.removeContractProcessForm.reset();
        this.removeContractProcessForm.markAsPristine();
    }

    duedateProcess() {
        this.modal.confirm('ต้องการ Run Duedate ใช่หรือไม่ ?').subscribe(
            (res) => {
                if (res) {
                    this.lots03Service.duedateProcess(Object.assign({
                        ContractHeadId: this.contractHead.ContractHeadId
                    }))
                        .subscribe(
                            (res: any) => {
                                this.onSearchContractProcess();
                            });
                }
            });
    }

    initialProcess() {
        this.modal.confirm('ต้องการ Run Initail Process ใช่หรือไม่ ?').subscribe(
            (res) => {
                if (res) {
                    this.lots03Service.initialProcess(Object.assign({
                        ContractHeadId: this.contractHead.ContractHeadId
                    }))
                        .subscribe(
                            (res: any) => {
                                this.onSearchContractProcess();
                            });
                }
            });
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

    tabSelected(tabIndex) {
        if (tabIndex == 1) {
            setTimeout(this.triggerResize.bind(this), 1);
        } else if (tabIndex == 3) {
            this.searchAllContractPeriod();
            this.searchAllContractReceivePeriod();
        } else if (tabIndex == 4) {
            this.searchPeriodPeriod();
            this.searchContractReceivePeriod();
        } else if (tabIndex == 5) {
            this.searchAllAccuredBalanceEnding();
            this.searchAccuredBalanceEnding();
        } else if (tabIndex == 6) {
            setTimeout(this.triggerResize.bind(this), 1);
        } else if (tabIndex == 92) {
            this.searchHistoryCall();
            this.searchTrackingAttachmentCall();
        } else if (tabIndex == 93) {
            this.searchHistoryCompany();
            this.searchTrackingAttachmentHome();
        } else if (tabIndex == 94) {
            this.searchHistoryHome();
            this.searchTrackingAttachmentNpl();
        } else if (tabIndex == 11) {
            this.onSearchContractPolicy();
        } else if (tabIndex == 12) {
            this.onSearchContractProcess();
        } else if (tabIndex == 95) {
            this.searchHistoryLaw();
            this.searchTrackingAttachmentLaw();
        } else if (tabIndex == 91 || tabIndex == 9) {
            this.searchHistorySms();
        } else if (tabIndex == 96) {
            this.searchDebtCollectionExpenses();
        }

    }

    onApproveSecurityCustomer() {
        this.submitted = true;
        this.saving = true;
        this.lots03Service.approveSecurityCustomer(this.contractHead).pipe(
            switchMap((id) => this.lots03Service.getLoanAgreementDetail(this.contractHead.ContractHeadId || id)),
            finalize(() => {
                this.saving = false;
                this.submitted = false;
            }))
            .subscribe((res: ContractHead) => {
                this.contractHead = res;
                this.loanAgreementForm.setControl('contractAttachments', this.fb.array([]));
                this.rebuildForm();
                this.as.success('', 'Message.STD00006');
            });
    }

    onPrintQrBar(exportType) {
        this.report.ContractNo = this.contractHead.ContractNo;
        this.report.ExportType = exportType;
        this.lots03Service.printQrBar(this.report)
            .pipe(
                finalize(() => { })
            ).subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, exportType);

                }
            });
    }

    onChange() {
        let a = this.contractInformations.getRawValue().filter(x => x.Active);
        if (a.filter(x => x.InformationId == 13).length > 0) {
            const addOnSum = a.filter(x => x.InformationId == 13);
            this.addOn = true;
            this.loanAgreementForm.controls.AddOn.enable({ emitEvent: false });

            if (addOnSum[0].AddOn) {
                this.loanAgreementForm.controls.AddOn.setValue(addOnSum[0].AddOn);
            }

        } else {
            this.addOn = false;
            this.loanAgreementForm.controls.AddOn.disable({ emitEvent: false });
        }
    }

    onPrintRf12() {
        this.reportParam.ReportName = 'LORF12';
        this.reportParam.ExportType = 'pdf';

        this.lots03Service.generateReportRf12(this.reportParam).pipe(
            finalize(() => {
            })
        )
            .subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');
                }
            });
    }

    onPrintRf13() {
        this.reportParam.ReportName = 'LORF13';
        this.reportParam.ExportType = 'pdf';

        this.lots03Service.generateReportRf13(this.reportParam).pipe(
            finalize(() => {
            })
        )
            .subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');
                }
            });
    }

    onPrintRf14() {
        this.reportParam.ReportName = 'LORF14';
        this.reportParam.ExportType = 'pdf';

        this.lots03Service.generateReportRf14(this.reportParam).pipe(
            finalize(() => {
            })
        )
            .subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');
                }
            });
    }

    onPrintRf15() {
        this.reportParam.ReportName = 'LORF15';
        this.reportParam.ExportType = 'pdf';

        this.lots03Service.generateReportRf15(this.reportParam).pipe(
            finalize(() => {
            })
        )
            .subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');
                }
            });
    }

    onPrintRf16() {
        if (this.loanAgreementForm.controls.ContractType.value == 'M') {
            this.reportParam.ContractHeadId = this.contractHead.ContractHeadId
        }
        else {
            this.reportParam.ContractHeadId = this.contractHead.ContractHeadId;
        }

        this.reportParam.ReportName = 'LORF16';
        this.reportParam.ExportType = 'pdf';

        this.lots03Service.generateReportRf16(this.reportParam).pipe(
            finalize(() => {
            })
        )
            .subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');
                }
            });
    }


    onPrintRf17() {
        this.reportParam.ReportName = 'LORF17';
        this.reportParam.ExportType = 'pdf';

        this.lots03Service.generateReportRf17(this.reportParam).pipe(
            finalize(() => {
            })
        )
            .subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');
                }
            });
    }

    onPrintRf18() {
        this.reportParam.ReportName = 'LORF18';
        this.reportParam.ExportType = 'pdf';

        this.lots03Service.generateReportRf18(this.reportParam).pipe(
            finalize(() => {
            })
        )
            .subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');
                }
            });
    }

    onPrintRf19() {
        this.reportParam.ReportName = 'LORF19';
        this.reportParam.ExportType = 'pdf';
        this.reportParam.ContractHeadId = this.contractHead.ContractHeadId;

        this.lots03Service.generateReportLORF19(this.reportParam).pipe(
            finalize(() => {
            })
        )
            .subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');
                }
            });
    }

    onPrintApplicationFormInsurance() {
        if (this.loanAgreementForm.controls.ContractType.value == 'M') {
            this.reportParam.FromContractNo = this.loanAgreementForm.controls.ContractNo.value;
        }
        else {
            this.reportParam.FromContractNo = this.loanAgreementForm.controls.MainContractNo.value;
        }

        this.reportParam.ReportName = 'ApplicationFormInsurance';
        this.reportParam.ExportType = 'pdf';
        this.lots03Service.generateReportRf19(this.reportParam)
            .pipe(
                finalize(() => { })
            ).subscribe((res) => {
                if (res) {
                    this.DownLoadFile(res, 'pdf');

                }
            });
    }

    onCompose() {
        return this.modal.confirm('Message.LO00071').subscribe(
            (val) => {
                if (val) {
                    this.submitted = true;
                    this.reFinanceStatus = true;
                    this.contractHead.PreRefinanceType = '1';
                    this.lots03Service.reFinanceContract(this.contractHead).pipe(
                        switchMap((id) => this.lots03Service.getLoanAgreementDetail(this.contractHead.ContractHeadId || id)),
                        finalize(() => {
                            this.reFinanceStatus = false;
                            this.submitted = false;
                        }))
                        .subscribe((res: ContractHead) => {
                            this.contractHead = res;
                            this.router.navigate(['/lo/lots04', { ContractNo: this.contractHead.ContractNo, Compose: true }], { skipLocationChange: true });
                        });
                }
                else {
                    return;
                }
            }
        )
    }

    onApproveRefinanceLaw() {
        this.submitted = true;
        this.saving = true;
        this.lots03Service.approveRefinanceLaw(this.contractHead).pipe(
            switchMap((id) => this.lots03Service.getLoanAgreementDetail(this.contractHead.ContractHeadId || id)),
            finalize(() => {
                this.saving = false;
                this.submitted = false;
            }))
            .subscribe((res: ContractHead) => {
                this.contractHead = res;
                this.rebuildForm();
                this.as.success('', 'Message.STD00006');
            });
    }

    searchContractCustomerAccount() {
        this.lots03Service.getContractCustomerAccount(Object.assign({
            MainContractHeadID: this.MainContractHeadID
        }))
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.contractCustomerAccount = res.Rows;
                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

    openDebtCollectionExpenses(content, data) {
        this.debtCollectionExpensesForm.reset();
        this.debtCollectionExpensesForm.markAsPristine();

        if (data != null) {
            this.debtCollectionExpensesForm.patchValue(data);
            this.debtCollectionExpensesForm.controls.Status.disable();
        } else {
            this.debtCollectionExpensesForm.controls.TrackingDate.setValue(new Date());
            this.debtCollectionExpensesForm.controls.Status.enable();
        }
        this.debtCollectionExpenses = this.modal.open(content, Size.medium);
    }

    closeDebtCollectionExpenses() {
        this.debtCollectionExpenses.hide();
        this.debtCollectionExpensesForm.reset();
        this.debtCollectionExpensesForm.markAsPristine();
    }

    onDebtCollectionExpensesProcess() {
        this.submitted = true;

        this.debtCollectionExpensesForm.controls.MainContractHeadId.setValue(this.contractHead.ContractHeadId);
        if (this.debtCollectionExpensesForm.invalid) {
            this.focusToggle = !this.focusToggle;
            return;
        }

        if (!this.debtCollectionExpensesForm.controls.TrackingHistoryId.value) {
            let count = this.debtCollectionExpensesList.filter(o => {
                return o.Status == this.debtCollectionExpensesForm.controls.Status.value;
            })

            if (count.length > 0) {
                this.as.warning(' ', 'ประเภทค่าใช้จ่ายมีค่าซ้ำ');
                return;
            }
        }

        this.lots03Service.debtCollectionExpensesProcess(this.debtCollectionExpensesForm.getRawValue())
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.closeDebtCollectionExpenses();
                    this.as.success(' ', 'Message.STD00006');
                    this.searchDebtCollectionExpenses();
                }, (error) => {
                    this.as.error(' ', 'Message.STD000032');
                });
    }

    onTableEventDebtCollectionExpenses(event) {
        this.pageDebtCollectionExpenses = event;
        this.searchDebtCollectionExpenses();
    }

    searchDebtCollectionExpenses() {
        this.lots03Service.getDebtCollectionExpensesLists(Object.assign({
            MainContrctHeadId: this.contractHead.ContractHeadId
        }), this.pageDebtCollectionExpenses)
            .subscribe(
                (res: any) => {
                    this.debtCollectionExpensesList = res.Rows;
                    this.pageDebtCollectionExpenses.totalElements = res.Total;

                    setTimeout(this.triggerResize.bind(this), 1);
                });
    }

}
