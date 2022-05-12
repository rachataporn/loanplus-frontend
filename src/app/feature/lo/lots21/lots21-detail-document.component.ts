import value from '*.json';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService, AuthService } from '@app/core';
import { ModalService, RowState, Page, SelectFilterService, Size, ModelRef } from '@app/shared';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category } from '@app/shared/service/configuration.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lots21Service, PackageDetail, Package, ContractHead, ContractInformation, ContractMgm, ContractMgmEmployee, ContractSecurities, ContractItem, ContractAttachment } from './lots21.service';

@Component({
    templateUrl: './lots21-detail-document.component.html'
})
export class Lots21DetailDocumentComponent implements OnInit {

    loanAgreementForm: FormGroup;
    searchEmpForm: FormGroup;
    searchMgmForm: FormGroup;
    packageCheckDoc: FormGroup;
    packageList = {} as Package;
    packageDetailList: PackageDetail = {} as PackageDetail;
    contractHead = {} as ContractHead
    attachmentFiles: Attachment[] = [];
    page = new Page();
    statusPage: boolean; cancelRefinance: boolean;
    IsSuperUser: boolean;
    IsCompanyCapital: boolean;
    GuaranteeAssetYN: boolean;
    cancelContractCapital: boolean;
    popup: ModelRef;
    saving: boolean;
    submitted: boolean;
    focusToggle: boolean;
    company = [];
    loanType = [];
    loanTypeData = [];
    contractReFinance = [];
    contractReFinanceData = [];
    SecuritiesCategories = [];
    contractTypeList = [];
    informations = [];
    incomeLoan = [];
    pays = [];
    AllContractPeriods = [];
    periods = [];
    paymentLoan = [];
    contractBorrowers = [];
    attachmentTypes = [];

    cateSecurities: string;

    maxLoanMsg: boolean = false;
    maxLoanAmount: number = 0;
    securitiesPer: number;
    contractHeadId: number;
    category = Category.ContractAttachment;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private is: Lots21Service,
        private modal: ModalService,
        public lang: LangService,
        private filter: SelectFilterService,
        private saveData: SaveDataService,
        private auth: AuthService,

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

            LoanTypeCode: [{ value: null, disabled: true }, Validators.required],//**
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
            AppLoanEffectiveInterestRate: [{ value: null, disabled: true }],
            AppLoanEffectiveInterestRateYear: [{ value: null, disabled: true }],
            Remark: null,
            contractIncomeItems: this.fb.array([]),
            contractPaymentItems: this.fb.array([]),
            contractAttachments: this.fb.array([]),
            ContractMgmEmployee: this.fb.array([]),
            ContractMgm: this.fb.array([]),
            editStatus: null,
            MGMCheckbox: false,
            Activity: [null, Validators.required],
            DescLoan: null,
            AddOn: [null, Validators.required],
            OldContractNo: [{ value: null, disabled: true }],
            CustomerName: [{ value: null, disabled: true }],
            IsDisableAttachment: null,
            CheckDoc: null,
        });

        this.packageCheckDoc = this.fb.group({
            TrackingDocumentPackageId: null,
            MainContractNo: null,
            MainContractHeadId: null,
        });

        this.searchEmpForm = this.fb.group({
            EmployeeCode: null,
            EmployeeName: null
        });

        this.searchMgmForm = this.fb.group({
            MgmCode: null,
            MgmName: null
        });

        this.loanAgreementForm.controls.CompanyCode.valueChanges.subscribe(
            (val) => {
                if (val) {
                    let data = this.company.find(o => { return o.Value == val }) || {};
                    this.loanAgreementForm.controls.CompanyNameTha.setValue(data.TextTha);
                    this.loanAgreementForm.controls.CompanyNameEng.setValue(data.TextEng);
                }
            }
        )

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

        this.loanAgreementForm.controls.LoanTypeCode.valueChanges.subscribe(
            (val) => {
                if (val) {
                    const ContractDocument = this.loanType.find(x => x.Value == val).ContractDocument;
                    this.loanAgreementForm.controls.DescLoan.setValue(ContractDocument);
                } else {
                    this.loanAgreementForm.controls.DescLoan.setValue(null);
                }
            }
        )

        this.loanAgreementForm.controls.Activity.disable();
        this.loanAgreementForm.controls.MGMCheckbox.disable();

    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.maxLoanAmount = data.Lots21.master.MaximumLoanAmount;
            this.company = data.Lots21.master.Companys;
            this.loanType = data.Lots21.master.loanTypes;
            this.pays = data.Lots21.master.Pays;
            this.incomeLoan = data.Lots21.master.IncomeLoanList;
            this.paymentLoan = data.Lots21.master.PaymentLoanList;
            this.informations = data.Lots21.master.InformationList;
            this.attachmentTypes = data.Lots21.master.AttachmentTypes;
            this.contractTypeList = data.Lots21.master.ContractType
            this.SecuritiesCategories = data.Lots21.master.SecuritiesCategorys;
            this.contractReFinance = data.Lots21.master.ContractReFinance;
            this.IsSuperUser = data.Lots21.master.IsSuperUser;
            this.IsCompanyCapital = data.Lots21.master.IsCompanyCapital;
            this.contractHead = data.Lots21.detail;
            this.packageList = data.Lots21.status;

            this.rebuildForm();
        })
        this.onSearch();
        this.rebuildForm();
    }

    rebuildForm() {
        this.attachmentFiles = [];
        this.packageCheckDoc.patchValue(this.packageList);


        this.loanAgreementForm.markAsPristine()
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

        //สาขาภายใต้ 9999 เพิ่มสัญญาจากระบบเก่าเข้าระบบใหม่
        if (this.IsCompanyCapital) {
            this.loanAgreementForm.controls.OldContractNo.enable({ emitEvent: false });
        }

        var isRefinance = false;
        if (this.loanAgreementForm.controls.OldContractId.value) {
            isRefinance = true;
        }
        this.filterLoanType(this.loanAgreementForm.controls.CategoryId.value, isRefinance);
    }

    onTableEvent(event) {
        this.page = event;
        this.statusPage = false;
        this.onSearch();
    }


    onSearch() {
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

    linkCustomerDetail(CustomerCode?: any) {
        const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots01/detail', { CustomerCode: CustomerCode ? CustomerCode : this.loanAgreementForm.controls.CustomerCode.value }], { skipLocationChange: true }));
        window.open(url, '_blank');
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

    getRegTotalMonth() {
        return (this.loanAgreementForm.controls.ReqTotalPeriod.value * this.loanAgreementForm.controls.ReqGapPeriod.value)
    }
    getEndPaymentDate(StartDate, ReqTotalMonth) {
        if (ReqTotalMonth) {
            let endDate = new Date(StartDate);
            return new Date(endDate.setMonth(endDate.getMonth() + ReqTotalMonth));
        }
    }

    bindDropDownList() {
        this.filter.SortByLang(this.company);
        this.company = [...this.company];

        this.filter.SortByLang(this.incomeLoan);
        this.incomeLoan = [...this.incomeLoan];

        this.filterSecuritiesCategories(true);
    }

    filterIncomeLoan(ContractItemId) {
        const baseValue = this.contractHead.ContractIncomeItem.find((item) => {
            return item.ContractItemId === ContractItemId
        });
        if (baseValue) {
            this.incomeLoan = this.filter.FilterActiveByValue(this.incomeLoan, baseValue.LoItemCode);
        }
        else {
            this.incomeLoan = this.filter.FilterActive(this.incomeLoan);
        }
        this.filter.SortByLang(this.incomeLoan);
        this.incomeLoan = [...this.incomeLoan];
    }

    filterPaymentLoan(ContractItemId) {
        const baseValue = this.contractHead.ContractPaymentItem.find((item) => {
            return item.ContractItemId === ContractItemId
        });
        if (baseValue) {
            this.paymentLoan = this.filter.FilterActiveByValue(this.paymentLoan, baseValue.LoItemCode);
        }
        else {
            this.paymentLoan = this.filter.FilterActive(this.paymentLoan);
        }
        this.filter.SortByLang(this.paymentLoan);
        this.paymentLoan = [...this.paymentLoan];
    }

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
                this.SecuritiesCategories = this.filter.FilterActiveByValue(this.SecuritiesCategories, detail.CategoryId);
            }
            else {
                this.SecuritiesCategories = this.filter.FilterActive(this.SecuritiesCategories);
            }
        }
        this.filter.SortByLang(this.SecuritiesCategories);
        this.SecuritiesCategories = [...this.SecuritiesCategories];
    }

    filterLoanType(categoryId, isRefinance) {
        this.is.getLoanType(categoryId, this.loanAgreementForm.controls.CustomerCode.value, this.loanAgreementForm.controls.CompanyCode.value, isRefinance).subscribe(
            (res) => {
                this.loanTypeData = res.loanTypes;
                const detail = this.contractHead;
                if (detail.LoanTypeCode) {
                    this.loanTypeData = this.filter.FilterActiveByValue(this.loanTypeData, detail.LoanTypeCode);
                }
                else {
                    this.loanTypeData = this.filter.FilterActive(this.loanTypeData);
                }
                this.filter.SortByLang(this.loanTypeData);
                this.loanTypeData = [...this.loanTypeData];

                let type = this.loanTypeData.find(o => { return o.Value == this.loanAgreementForm.controls.LoanTypeCode.value }) || {};

                if (type.SecuritiesPercent) {
                    this.securitiesPer = type.SecuritiesPercent;
                }
            })
    }

    filterAttachmentTypes(ContractAttachmentId) {
        const baseValue = this.contractHead.ContractAttachment.find((item) => {
            return item.ContractAttachmentId === ContractAttachmentId
        });
        if (baseValue) {
            this.attachmentTypes = this.filter.FilterActiveByValue(this.attachmentTypes, baseValue.AttachmentTypeCode);
        }
        else {
            this.attachmentTypes = this.filter.FilterActive(this.attachmentTypes);
        }
        this.attachmentTypes = [...this.attachmentTypes];
    }

    checkContractEditForm() {
        if (this.contractHead.editStatus == '1') {
            this.contractIncomeItems.disable({ emitEvent: false });
            this.contractPaymentItems.disable({ emitEvent: false })
            this.contractInformations.disable({ emitEvent: false });
            this.contractAttachments.disable({ emitEvent: false });
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

    checkMaxLoanAmount(reqLoanAmount, reqTotal) {
        if (this.loanAgreementForm.controls.CustomerCode.value) {
            this.is.getCheckMaxLoanAmount({
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

    summaryAllTotalAmount() {
        if (this.periods.length > 0) {
            let total = this.AllContractPeriods.filter(row => { return row.TotalAmount == null ? 0 : row.TotalAmount })
                .map((item) => parseFloat(item.TotalAmount))
                .reduce((sum, current) => sum + current, 0);
            return Math.round(total);
        }
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
            ContractAttachmentId: 0,
            AttachmentTypeCode: [null, Validators.required],
            FileName: null,
            AttahmentId: [null, Validators.required],
            Description: null,
            RowState: RowState.Add,
            IsSignature: false,
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

    addAttachment() {
        this.contractAttachments.markAsDirty();
        this.contractAttachments.push(this.contractAttachmentsForm({} as ContractAttachment));
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
        // this.checkContractAttachment();
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

    prepareSave(values: Object) {
        Object.assign(this.contractHead, values);
    }

    onSubmit(flag) {
        if (!flag) {
            this.contractHead.CheckDocStatus = 'F';
        } else {
            this.contractHead.CheckDocStatus = 'C';
        }
        this.contractHead.Remark = this.loanAgreementForm.controls.Remark.value;

        this.contractHead.TrackingDocumentPackageId = this.packageList.TrackingDocumentPackageId;
        this.is.checkDocStatus(this.contractHead).pipe(
            finalize(() => {
                this.saving = false;
                this.submitted = false;
            }))
            .subscribe((res: ContractHead) => {
                this.contractHead = res;
                // this.rebuildForm();
                this.as.success('', 'Message.STD00006');
                if (this.contractHead.CheckDocStatus == 'C') {
                    this.backDetailPackage(this.packageList.TrackingDocumentPackageId);
                } else {
                    this.newTrackingDocumnt(res.TrackingDocumentId21, res.TrackingDocumentStatus);
                }
            });
    }

    tabSelected(tabIndex) {
        // setTimeout(this.triggerResize.bind(this), 1);
    }

    openModal(content) {
        this.popup = this.modal.open(content, Size.large);
    }

    newTrackingDocumnt(TrackingDocumentId21, TrackingDocumentStatus) {
        this.router.navigate(['/lo/lots19/detail', { TrackingDocumentId21: TrackingDocumentId21, TrackingDocumentStatus: TrackingDocumentStatus }], { skipLocationChange: true });
    }

    closeModal() {
        this.popup.hide();
    }

    backDetailPackage(TrackingDocumentPackageId) {
        this.router.navigate(['/lo/lots21/detail/package', { TrackingDocumentPackageId: TrackingDocumentPackageId }], { skipLocationChange: true });
    }

    back() {
        this.router.navigate(['/lo/lots21/detail/package', { TrackingDocumentPackageId: this.packageList.TrackingDocumentPackageId }], { skipLocationChange: true });
    }

}