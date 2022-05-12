import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots18Service, ReportParam, BillPayment, InqKkp } from '@app/feature/lo/lots18/lots18.service';
import { Page, ModalService, ModalRef, Size, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lots18ContractLookupComponent } from './lots18-contract-lookup.component';
import { Lots18CustomerLookupComponent } from './lots18-customer-lookup.component';
import { NullAstVisitor } from '@angular/compiler';
import { LoadingService } from '@app/core/loading.service';

@Component({
    templateUrl: './lots18.component.html'
})

export class Lots18Component implements OnInit {
    Lots18ContractLookupContent = Lots18ContractLookupComponent;
    Lots18CustomerLookupContent = Lots18CustomerLookupComponent;
    searchForm: FormGroup;
    unmatchedForm: FormGroup;
    kkpForm: FormGroup;
    popup: ModalRef;
    page = new Page();
    pageKKP = new Page();
    pageKKPInq = new Page();
    pageCS = new Page();
    company = [];
    province = [];
    billPaymentList = [];
    billPaymentListKKP = [];
    billPaymentListCS = [];
    saving: boolean;
    submitted: boolean;
    submitted2: boolean;
    submitted3: boolean;
    submitted4: boolean;
    submitted5: boolean;
    dataRow: any;
    reportParam = {} as ReportParam
    srcResult = null;
    focusToggle: boolean;
    focusToggle2: boolean;
    focusToggle3: boolean;
    focusToggle4: boolean;
    focusToggle5: boolean;
    billPayment = {} as BillPayment
    IsSuperUser: boolean;
    IsDiffCompany: boolean = false;
    bankAccount = [];
    IsDiffCloseAmount: boolean = false;
    accCodeList = [];
    inqKkpModel = {} as InqKkp;
    flagPayKKP: boolean = null;
    dataForPaymentKKP: any;
    SuccessInqKKP: any;
    dataForPaymentKKPList: any;
    dataForPaymentKKPListTotal: any;
    reportTypeList = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private modal: ModalService,
        private fb: FormBuilder,
        private lots18Service: Lots18Service,
        public lang: LangService,
        private saveData: SaveDataService,
        private as: AlertService,
        private selectFilter: SelectFilterService,
        private ls: LoadingService
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            Keyword: null,
            ProvinceId: null,
            CompanyCodeFrom: null,
            CompanyCodeTo: null,
            ProcessDateFrom: null,
            ProcessDateTo: null,
            PayDate: null,
            ReportType: [null, Validators.required]
        });

        this.unmatchedForm = this.fb.group({
            BillPaymentDetailId: null,
            CompanyCode: null,
            ReferenceNo1: [{ value: null, disabled: true }],
            ReferenceNo2: [{ value: null, disabled: true }],
            PayDateTime: [{ value: null, disabled: true }],
            Amount: [{ value: null, disabled: true }],
            UnmatchedStatus: null,
            ReferenceNo1New: [{ value: null, disabled: true }, Validators.required],
            ReferenceNo2New: [{ value: null, disabled: true }, Validators.required],
            PayDateTimeText: [{ value: null, disabled: true }],
            CompanyContract: null,
            CompanyAccountId: [{ value: 0, disabled: true }, Validators.required],
            BankName: [{ value: null, disabled: true }],
            BranchName: [{ value: null, disabled: true }],
            ExpCode: [{ value: null, disabled: true }, Validators.required],
            OverAmount: [{ value: null, disabled: true }],
            AccCode: [{ value: null, disabled: true }]
        });

        this.kkpForm = this.fb.group({
            BillerID: null,
            BillReference1: [null, Validators.required],
            BillReference2: [null, Validators.required],
            TxnDateFrom: null,
            TxnDateTo: null
        });


        this.unmatchedForm.controls.CompanyAccountId.valueChanges.subscribe(
            (value) => {
                const ToAccount = this.bankAccount.find((data) => {
                    return data.CompanyAccountId === value;
                }) || {};

                this.unmatchedForm.controls.BankName.setValue(ToAccount.Bank, { emitEvent: false });
                this.unmatchedForm.controls.BranchName.setValue(ToAccount.Branch, { emitEvent: false });
            }
        );

        this.unmatchedForm.controls.ExpCode.valueChanges.subscribe(
            (value) => {
                const accCode = this.accCodeList.find((data) => {
                    return data.expCode === value;
                }) || {};

                this.unmatchedForm.controls.AccCode.setValue(accCode.accCode, { emitEvent: false });
            }
        );
    }

    ngOnInit() {
        let saveData = this.saveData.retrive("LOTS18");
        if (saveData) this.searchForm.patchValue(saveData);

        this.lang.onChange().subscribe(() => {
            this.bindDropdownlist();
        });

        this.route.data.subscribe((data) => {
            this.province = data.lots18.master.Province;
            this.company = data.lots18.master.Companys;
            this.IsSuperUser = data.lots18.master.IsSuperUser;
            this.bankAccount = data.lots18.master.AccountNo;
            this.SuccessInqKKP = data.lots18.master.SuccessInqKKP;
            this.reportTypeList = data.lots18.master.ReportTypeList;
        })
        this.bindDropdownlist();
        this.search();
        this.searchKKP();
        this.searchCS();
    }

    bindDropdownlist() {
        this.selectFilter.SortByLang(this.company);
        this.company = [...this.company];
    }

    ngOnDestroy() {
        this.saveData.save(this.searchForm.value, "LOTS18");
    }

    onTableEvent(event) {
        this.search();
    }

    onTableEventKKP(event) {
        this.searchKKP();
    }

    search() {
        this.lots18Service.getBillPaymentList(Object.assign({
            Keyword: this.searchForm.controls.Keyword.value,
            ProvinceId: this.searchForm.controls.ProvinceId.value,
            CompanyCodeFrom: this.searchForm.controls.CompanyCodeFrom.value,
            CompanyCodeTo: this.searchForm.controls.CompanyCodeTo.value,
            PayDate: this.searchForm.controls.PayDate.value,
            flag: '0'
        }), this.page)
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.billPaymentList = res.Rows;
                    this.page.totalElements = res.Total;
                });
    }

    print() {
        this.submitted = true;

        if (this.searchForm.invalid) {
            this.focusToggle = !this.focusToggle;
            return;
        }

        this.reportParam.Keyword = this.searchForm.controls.Keyword.value;
        this.reportParam.ProvinceId = this.searchForm.controls.ProvinceId.value;
        this.reportParam.CompanyCodeFrom = this.searchForm.controls.CompanyCodeFrom.value;
        this.reportParam.CompanyCodeTo = this.searchForm.controls.CompanyCodeTo.value;
        this.reportParam.ProcessDateFrom = this.searchForm.controls.ProcessDateFrom.value;
        this.reportParam.ProcessDateTo = this.searchForm.controls.ProcessDateTo.value;
        this.reportParam.PayDate = this.searchForm.controls.PayDate.value;

        var fileName = '';
        if (this.searchForm.controls.ReportType.value == '1') {
            this.reportParam.ReportName = 'LOTS18';
            fileName = 'BillPaymentReport_BAY';
        } else if (this.searchForm.controls.ReportType.value == '2') {
            this.reportParam.ReportName = 'LOTS18_01';
            fileName = 'CS_PaymentReport';
        } else {
            this.reportParam.ReportName = 'LOTS18_02';
            fileName = 'BillPaymentReport_KKP';
        }

        this.lots18Service.generateReport(this.reportParam).pipe(
            finalize(() => {
                this.submitted = false;
            })
        ).subscribe((res) => {
            if (res) {
                this.OpenWindow(res, fileName);
            }
        });
    }

    async OpenWindow(data, name) {
        let doc = document.createElement("a");
        doc.href = "data:application/;base64," + data;
        doc.download = name + ".xlsx"
        doc.click();
    }

    linkCustomerDetail(CustomerCode?: any) {
        const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots01/detail', { CustomerCode: CustomerCode }], { skipLocationChange: true }));
        window.open(url, '_blank');
    }

    linkContractDetail(ContractHeadId?: any) {
        const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: ContractHeadId, backToPage: '/lo/lots18' }], { skipLocationChange: true }));
        window.open(url, '_blank');
    }

    editUnmatched(row, content) {
        this.rebuildFormUnmatched(row);
        this.popup = this.modal.open(content, Size.large);
    }

    modalSearchDataKKP(content) {
        this.popup = this.modal.open(content, Size.large);
    }

    rebuildFormUnmatched(row) {
        this.unmatchedForm.markAsPristine();
        this.unmatchedForm.patchValue(row);

        if (row.IsDiffCloseAmount) {
            this.IsDiffCloseAmount = row.IsDiffCloseAmount;
            this.unmatchedForm.controls.ReferenceNo1New.setValue(row.ReferenceNo1);
            this.unmatchedForm.controls.ReferenceNo2New.setValue(row.ReferenceNo2);
            this.unmatchedForm.controls.ReferenceNo1New.disable({ emitEvent: false });
            this.unmatchedForm.controls.ReferenceNo2New.disable({ emitEvent: false });
            this.searchAccCode(row.CompanyCode);
            this.unmatchedForm.controls.ExpCode.enable({ emitEvent: false });
            this.unmatchedForm.controls.OverAmount.setValue(row.DiffCloseAmount);
        } else {
            this.IsDiffCloseAmount = false;
            this.unmatchedForm.controls.ReferenceNo1New.enable({ emitEvent: false });
            this.unmatchedForm.controls.ReferenceNo2New.enable({ emitEvent: false });
        }
    }

    close() {
        this.unmatchedForm.reset();
        this.popup.hide();
        this.flagPayKKP = null;
        this.kkpForm.reset();
    }

    prepareSave(values: Object) {
        Object.assign(this.billPayment, values);
    }

    onSubmitUnmatchBillPaymentBAY() {
        this.submitted2 = true;
        if (this.unmatchedForm.invalid) {
            this.focusToggle2 = !this.focusToggle2;
            return;
        }

        this.saving = true;
        this.prepareSave(this.unmatchedForm.getRawValue());
        this.lots18Service.saveUnmatchedBillPaymentBAY(this.billPayment).pipe(
            finalize(() => {
                this.saving = false;
                this.submitted2 = false;
            }))
            .subscribe((res: any) => {
                this.close();
                this.search();
                this.as.success('', 'Message.STD00006');
            });
    }

    onSubmitUnmatchBillPaymentKKP() {
        this.submitted4 = true;
        if (this.unmatchedForm.invalid) {
            this.focusToggle4 = !this.focusToggle4;
            return;
        }

        this.saving = true;
        this.prepareSave(this.unmatchedForm.getRawValue());
        this.lots18Service.saveUnmatchedBillPaymentKKP(this.billPayment).pipe(
            finalize(() => {
                this.saving = false;
                this.submitted4 = false;
            }))
            .subscribe((res: any) => {
                this.close();
                this.searchKKP();
                this.as.success('', 'Message.STD00006');
            });
    }

    contractDetailOutputBay(contract) {
        this.unmatchedForm.controls.ReferenceNo1New.setValue(contract.LoanNo);
        this.unmatchedForm.controls.CompanyContract.setValue(contract.CompanyCode);

        if (this.unmatchedForm.controls.CompanyContract.value != this.unmatchedForm.controls.CompanyCode.value) {
            this.IsDiffCompany = true;
            this.bankAccount = this.bankAccount.filter((item) => {
                return item.CompanyCode == this.unmatchedForm.controls.CompanyContract.value
            })
            this.unmatchedForm.controls.CompanyAccountId.enable({ emitEvent: false });
        } else {
            this.IsDiffCompany = false;
            this.unmatchedForm.controls.CompanyAccountId.setValue(0, { emitEvent: false });
            this.unmatchedForm.controls.BankName.setValue(null, { emitEvent: false });
            this.unmatchedForm.controls.BranchName.setValue(null, { emitEvent: false });
            this.unmatchedForm.controls.CompanyAccountId.disable({ emitEvent: false });
        }
    }

    contractDetailOutputKkp(contract) {
        this.unmatchedForm.controls.ReferenceNo1New.setValue(contract.LoanNo);
        this.unmatchedForm.controls.CompanyContract.setValue(contract.CompanyCode);
        this.unmatchedForm.controls.CompanyAccountId.setValue(0, { emitEvent: false });
        this.unmatchedForm.controls.BankName.setValue(null, { emitEvent: false });
        this.unmatchedForm.controls.BranchName.setValue(null, { emitEvent: false });
        this.unmatchedForm.controls.CompanyAccountId.disable({ emitEvent: false });
    }

    searchAccCode(companyCode) {
        this.lots18Service.getAccCode(companyCode)
            .subscribe((res: any) => {
                this.accCodeList = res.AccCodeList;
            });
    }

    inqKkp() {
        this.submitted3 = true;
        if (this.kkpForm.invalid) {
            this.focusToggle3 = !this.focusToggle3;
            return;
        }
        Object.assign(this.inqKkpModel, this.kkpForm.getRawValue());
        this.lots18Service.inqKkp(this.inqKkpModel).pipe(
            finalize(() => {
                this.saving = false;
                this.submitted3 = false;
            }))
            .subscribe((res: any) => {
                if (res.ResponseStatus.ResponseCode == this.SuccessInqKKP) {
                    this.flagPayKKP = true;
                    this.dataForPaymentKKP = res;
                    this.dataForPaymentKKPList = this.dataForPaymentKKP.Data.ResultList;
                    this.pageKKPInq.totalElements = this.dataForPaymentKKP.Data.ResultList.length;
                } else {
                    this.flagPayKKP = false;
                }
            });
    }

    payByKKP(data) {
        this.ls.show();
        this.lots18Service.getCheckKkpPayment(data, this.kkpForm.controls.BillReference1.value, this.kkpForm.controls.BillReference2.value).pipe(
            finalize(() => {
                this.saving = false;
                this.submitted = false;
            }))
            .subscribe(
                (res) => {
                    if (res == 0) {
                        let dataPay = this.dataForPaymentKKP;
                        dataPay.Data.ResultList = [];
                        dataPay.Data.ResultList.push(data)
                        this.lots18Service.payKkp(dataPay).pipe(
                            finalize(() => {
                                this.saving = false;
                                this.submitted3 = false;
                                this.ls.hide();
                            }))
                            .subscribe((res: any) => {
                                this.as.success('', 'Message.STD00006');
                                this.dataForPaymentKKPList = this.dataForPaymentKKPList.filter(x => x.BillerReferenceNo != data.BillerReferenceNo);
                                this.pageKKPInq.totalElements = this.dataForPaymentKKPList.length;
                            });
                    } else {
                        this.as.warning('', 'รายการนี้มีการรับชำระแล้ว หรือ อยู่ในรายการ Unmatched KKP กรุณาตรวจสอบข้อมูลอีกครั้ง');
                        this.ls.hide();
                    }
                }
            );
    };

    searchKKP() {
        this.lots18Service.getBillPaymentList(Object.assign({
            Keyword: this.searchForm.controls.Keyword.value,
            ProvinceId: this.searchForm.controls.ProvinceId.value,
            CompanyCodeFrom: this.searchForm.controls.CompanyCodeFrom.value,
            CompanyCodeTo: this.searchForm.controls.CompanyCodeTo.value,
            PayDate: this.searchForm.controls.PayDate.value,
            flag: '1'
        }), this.pageKKP)
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.billPaymentListKKP = res.Rows;
                    this.pageKKP.totalElements = res.Total;
                });
    }

    getDate(date) {
        var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        return new Date(date.replace(pattern, '$1/$2/$3 $4:$5:$6')).toString();
    }


    searchCS() {
        this.lots18Service.getBillPaymentList(Object.assign({
            Keyword: this.searchForm.controls.Keyword.value,
            ProvinceId: this.searchForm.controls.ProvinceId.value,
            CompanyCodeFrom: this.searchForm.controls.CompanyCodeFrom.value,
            CompanyCodeTo: this.searchForm.controls.CompanyCodeTo.value,
            PayDate: this.searchForm.controls.PayDate.value,
            flag: '2'
        }), this.pageCS)
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.billPaymentListCS = res.Rows;
                    this.pageCS.totalElements = res.Total;
                });
    }

    onTableEventCS(event) {
        this.searchCS();
    }

    onSubmitUnmatchBillPaymentCS() {
        this.submitted5 = true;
        if (this.unmatchedForm.invalid) {
            this.focusToggle5 = !this.focusToggle5;
            return;
        }

        this.saving = true;
        this.prepareSave(this.unmatchedForm.getRawValue());
        this.lots18Service.saveUnmatchedBillPaymentCS(this.billPayment).pipe(
            finalize(() => {
                this.saving = false;
                this.submitted5 = false;
            }))
            .subscribe((res: any) => {
                this.close();
                this.searchCS();
                this.as.success('', 'Message.STD00006');
            });
    }
}
