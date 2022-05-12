import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, RowState, SelectFilterService } from '@app/shared';
import { Lots07Service, LoInvoiceHead, LoInvoiceDetail, ReportDto } from './lots07.service';
import { Lots07LookupDetailComponent } from './lots07-lookup-detail.component';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
@Component({
    templateUrl: './lots07-detail.component.html'
})
export class Lots07DetailComponent implements OnInit {
    Lots07LookupDetailContent = Lots07LookupDetailComponent;
    loInvoiceHead: LoInvoiceHead = {} as LoInvoiceHead;
    loInvoiceDetail: LoInvoiceDetail[] = [];
    reportDto: ReportDto = {} as ReportDto;
    InvoiceForm: FormGroup;
    saving: boolean;
    focusToggle: boolean;
    submitted: boolean;
    invoiceData: any;
    invoiceStatusText: string;
    printStatusText: string;
    emailStatusText: string;
    lineStatusText: string;
    defultDataStatus: boolean;
    dataDefult: any;
    printStatus: boolean;
    modifyRowStatus: boolean;
    contractHeadId: number;
    modifyStatusBtn: boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private service: Lots07Service,
        private modal: ModalService,
        public lang: LangService,
        private selectFilter: SelectFilterService
    ) {
        this.createForm();
    }

    createForm() {
        const now = new Date();
        this.InvoiceForm = this.fb.group({
            ContractNo: [null, Validators.required],
            MainContractHeadId: [null, Validators.required],
            InvoiceNo: 'AUTO',
            InvoiceDate: [now, Validators.required],
            CreatedBy: [null, Validators.required],
            NameCreatedBy: null,
            InputDate: [now, Validators.required],
            CompanyCode: [null, Validators.required],
            CustomerCode: null,
            CustomerName: null,
            ContractPeriodId: null,
            MobileNo: null,
            Remark: null,
            CreditTermCode: null,
            DueDate: [null, Validators.required],
            InvoiceStatusText: null,
            Period: [null, Validators.required],
            PeriodAmount: null,
            FineAmount: null,
            TrackingAmount: null,
            AccruedAmount: null,
            TotalAmount: null,
            InvoiceListForm: this.fb.array([])
        });
    }

    createDetailForm(item: LoInvoiceDetail): FormGroup {
        const fg = this.fb.group({
            InvoiceDetailId: null,
            InvoiceHeadId: null,
            ContractHeadId: null,
            CustomerNameTha: null,
            CustomerNameEng: null,
            GuarantorNameTha: null,
            GuarantorNameEng: null,
            FineAmount: null,
            TrackingAmount: null,
            TotalAmount: null,
            ContractNo: null,
            DeleteStatus: false,
            RowVersion: null,
            RowState: RowState.Add
        });
        fg.patchValue(item, { emitEvent: false });
        if (this.loInvoiceHead.InvoiceNo == 'AUTO') {
            fg.controls.DeleteStatus.setValue(false, { emitEvent: false })
        } else {
            fg.controls.DeleteStatus.setValue(true, { emitEvent: false })
        }

        fg.valueChanges.subscribe(
            (control) => {
                if (control.RowState == RowState.Normal) {
                    fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                }
            }
        )
        return fg;
    }

    get getInvoiceList(): FormArray {
        return this.InvoiceForm.get('InvoiceListForm') as FormArray;
    };

    addRow() {
        this.getInvoiceList.push(this.createDetailForm({} as LoInvoiceDetail));
        this.getInvoiceList.markAsDirty();
    }

    sumTotalAmount() {
        let PeriodAmount: number = 0;
        let FineAmount: number = 0;
        let TrackingAmount: number = 0;
        let AccruedAmount: number = 0;
        let TotalAmount: number = 0;

        this.loInvoiceHead.InvoiceDetails.forEach(data => {
            PeriodAmount = PeriodAmount + data.PeriodAmount;
            FineAmount = FineAmount + data.FineAmount;
            TrackingAmount = TrackingAmount + data.TrackingAmount;
            AccruedAmount = AccruedAmount + data.AccruedAmount;
            TotalAmount = TotalAmount + data.TotalAmount;
        });

        this.InvoiceForm.controls.PeriodAmount.setValue(PeriodAmount); 
        this.InvoiceForm.controls.FineAmount.setValue(FineAmount);
        this.InvoiceForm.controls.TrackingAmount.setValue(TrackingAmount);
        this.InvoiceForm.controls.AccruedAmount.setValue(AccruedAmount);
        this.InvoiceForm.controls.TotalAmount.setValue(TotalAmount);
    }

    get getDetails(): FormArray {
        return this.InvoiceForm.get('InvoiceListForm') as FormArray;
    };

    getStatusAndCustomerNameByLang() {
        if (this.defultDataStatus == false) {
            this.lang.CURRENT == "Tha" ? this.invoiceStatusText = this.invoiceData.InvoiceStatusTha : this.invoiceStatusText = this.invoiceData.InvoiceStatusEng;
            this.lang.CURRENT == "Tha" ? this.printStatusText = this.invoiceData.PrintStatusTha : this.printStatusText = this.invoiceData.PrintStatusEng;
            this.lang.CURRENT == "Tha" ? this.emailStatusText = this.invoiceData.EmailStatusTha : this.emailStatusText = this.invoiceData.EmailStatusEng;
            this.lang.CURRENT == "Tha" ? this.lineStatusText = this.invoiceData.LineStatusTha : this.lineStatusText = this.invoiceData.LineStatusEng;
            this.lang.CURRENT == "Tha" ? this.InvoiceForm.controls.InvoiceStatusText.setValue(this.invoiceData.DocSourceTha) : this.InvoiceForm.controls.InvoiceStatusText.setValue(this.invoiceData.DocSourceEng);
            this.lang.CURRENT == "Tha" ? this.InvoiceForm.controls.CustomerName.setValue(this.invoiceData.CustomerNameTha) : this.InvoiceForm.controls.CustomerName.setValue(this.invoiceData.CustomerNameEng);
            this.lang.CURRENT == "Tha" ? this.InvoiceForm.controls.NameCreatedBy.setValue(this.invoiceData.EmployeeNameTha) : this.InvoiceForm.controls.NameCreatedBy.setValue(this.invoiceData.EmployeeNameEng);
        } else {
            this.lang.CURRENT == "Tha" ? this.invoiceStatusText = this.dataDefult.InvoiceStatus[0].TextTha : this.invoiceStatusText = this.dataDefult.InvoiceStatus[0].TextEng;
            this.lang.CURRENT == "Tha" ? this.printStatusText = this.dataDefult.PrintStatus[0].TextTha : this.printStatusText = this.dataDefult.PrintStatus[0].TextEng;
            this.lang.CURRENT == "Tha" ? this.emailStatusText = this.dataDefult.EmailStatus[0].TextTha : this.emailStatusText = this.dataDefult.EmailStatus[0].TextEng;
            this.lang.CURRENT == "Tha" ? this.lineStatusText = this.dataDefult.LineStatus[0].TextTha : this.lineStatusText = this.dataDefult.LineStatus[0].TextEng;
            this.InvoiceForm.controls.CreatedBy.setValue(this.dataDefult.UserName[0].CreatedBy);
            this.lang.CURRENT == "Tha" ? this.InvoiceForm.controls.NameCreatedBy.setValue(this.dataDefult.UserName[0].EmployeeNameTha) : this.InvoiceForm.controls.NameCreatedBy.setValue(this.dataDefult.UserName[0].EmployeeNameEng);
            this.lang.CURRENT == "Tha" ? this.InvoiceForm.controls.InvoiceStatusText.setValue(this.dataDefult.DocSourceStatus[0].TextTha) : this.InvoiceForm.controls.InvoiceStatusText.setValue(this.dataDefult.DocSourceStatus[0].TextEng);
        }

        if (this.invoiceData) {
            this.lang.CURRENT == "Tha" ? this.InvoiceForm.controls.CustomerName.setValue(this.invoiceData.CustomerNameTha) : this.InvoiceForm.controls.CustomerName.setValue(this.invoiceData.CustomerNameEng)
        }
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.InvoiceForm.controls.PeriodAmount.disable();
            this.InvoiceForm.controls.FineAmount.disable();
            this.InvoiceForm.controls.TrackingAmount.disable();
            this.InvoiceForm.controls.AccruedAmount.disable();
            this.InvoiceForm.controls.TotalAmount.disable();
            if (data.route.invoiceHead.CreatedBy != null) {
                this.invoiceData = data.route.invoiceHead;
                this.loInvoiceHead = data.route.invoiceHead;
                this.loInvoiceHead.InvoiceDetails = data.route.invoiceHead.Details;
                this.defultDataStatus = false;
                this.rebuildForm();
            } else {
                this.loInvoiceHead.EmailStatus = "1";
                this.loInvoiceHead.LineStatus = "1";
                this.loInvoiceHead.InvoiceStatus = "1";
                this.loInvoiceHead.PrintStatus = "1";
                this.dataDefult = data.route.dataDefult;
                this.defultDataStatus = true;
                this.modifyRowStatus = true;
                this.printStatus = true;
                this.saving = true;
                this.modifyStatusBtn = false;
                this.InvoiceForm.controls.Remark.disable();
                this.getStatusAndCustomerNameByLang();
            }
        });

        this.lang.onChange().subscribe(
            () =>
                this.getStatusAndCustomerNameByLang()
        );
    }

    rebuildForm() {
        this.InvoiceForm.markAsPristine();
        this.InvoiceForm.patchValue(this.loInvoiceHead);
        this.getStatusAndCustomerNameByLang();

        this.InvoiceForm.controls.PeriodAmount.disable();
        this.InvoiceForm.controls.FineAmount.disable();
        this.InvoiceForm.controls.TrackingAmount.disable();
        this.InvoiceForm.controls.AccruedAmount.disable();
        this.InvoiceForm.controls.TotalAmount.disable();
        this.InvoiceForm.setControl('InvoiceListForm', this.fb.array(
            this.loInvoiceHead.InvoiceDetails.map((detail) => this.createDetailForm(detail))
        ));

        if (this.loInvoiceHead.EmailStatus != "1" || this.loInvoiceHead.LineStatus != "1" || this.loInvoiceHead.InvoiceStatus != "1") {
            this.InvoiceForm.disable();
            this.modifyRowStatus = true;
            this.modifyStatusBtn = true;
            this.saving = true;
        } else {
            this.InvoiceForm.controls.ContractNo.disable();
            this.InvoiceForm.controls.ContractPeriodId.disable();
            this.modifyRowStatus = false;
            this.modifyStatusBtn = true;
        }
        if (this.loInvoiceHead.InvoiceStatus == "1" || this.loInvoiceHead.InvoiceStatus == "3") {
            this.printStatus = false;
        } else {
            this.printStatus = true;
        }

        this.sumTotalAmount();
    }

    rebuildFormAdd() {
        this.InvoiceForm.markAsPristine();
        this.InvoiceForm.patchValue(this.loInvoiceHead);
        this.InvoiceForm.setControl('InvoiceListForm', this.fb.array(
            this.loInvoiceHead.InvoiceDetails.map((detail) => this.createDetailForm(detail))
        ));
        this.InvoiceForm.controls.PeriodAmount.disable();
        this.InvoiceForm.controls.FineAmount.disable();
        this.InvoiceForm.controls.TrackingAmount.disable();
        this.InvoiceForm.controls.AccruedAmount.disable();
        this.InvoiceForm.controls.TotalAmount.disable();
        this.InvoiceForm.controls.ContractNo.enable();
        this.InvoiceForm.controls.InvoiceDate.enable();
        this.InvoiceForm.controls.Remark.enable();
        this.getStatusAndCustomerNameByLang();

        let PeriodAmount: number = 0;
        let FineAmount: number = 0;
        let TrackingAmount: number = 0;
        let AccruedAmount: number = 0;
        let TotalAmount: number = 0;

        this.loInvoiceHead.InvoiceDetails.forEach(data => {
            PeriodAmount = PeriodAmount + data.PeriodAmount;
            FineAmount = FineAmount + data.FineAmount;
            TrackingAmount = TrackingAmount + data.TrackingAmount;
            AccruedAmount = AccruedAmount + data.AccruedAmount;
            TotalAmount = TotalAmount + data.TotalAmount;
        });
        

        this.InvoiceForm.controls.PeriodAmount.setValue(PeriodAmount); 
        this.InvoiceForm.controls.FineAmount.setValue(FineAmount);
        this.InvoiceForm.controls.TrackingAmount.setValue(TrackingAmount);
        this.InvoiceForm.controls.AccruedAmount.setValue(AccruedAmount);
        this.InvoiceForm.controls.TotalAmount.setValue(TotalAmount);

        this.modifyRowStatus = false;
        this.saving = false;
    }

    resetToDefault() {
        const now = new Date();
        this.InvoiceForm.reset();
        this.InvoiceForm.controls.InvoiceNo.setValue('AUTO');
        this.InvoiceForm.controls.InvoiceDate.setValue(now);
        this.InvoiceForm.controls.InputDate.setValue(now);
        this.InvoiceForm.controls.DueDate.setValue(null);
        this.InvoiceForm.setControl('InvoiceListForm', this.fb.array([]));
        this.loInvoiceHead.EmailStatus = "1";
        this.loInvoiceHead.LineStatus = "1";
        this.loInvoiceHead.InvoiceStatus = "1";
        this.loInvoiceHead.PrintStatus = "1";
        this.defultDataStatus = true;
        this.modifyRowStatus = true;
        this.printStatus = true;
        this.saving = true;
        this.getStatusAndCustomerNameByLang();
        this.InvoiceForm.controls.CustomerName.setValue(null);
    }

    loanDetailOutput(loanDetail) {
        if (loanDetail != undefined) {
            this.resetToDefault();
            this.InvoiceForm.controls.Remark.disable();
            this.InvoiceForm.controls.ContractNo.setValue(loanDetail.ContractNo);
            this.InvoiceForm.controls.MainContractHeadId.setValue(loanDetail.ContractHeadId);
            this.InvoiceForm.controls.CustomerCode.setValue(loanDetail.CustomerCode);
            if (this.lang.CURRENT == "Tha") {
                this.InvoiceForm.controls.CustomerName.setValue(loanDetail.CustomerNameTha);
            } else {
                this.InvoiceForm.controls.CustomerName.setValue(loanDetail.CustomerNameEng);
            }
            this.InvoiceForm.controls.MobileNo.setValue(loanDetail.MobileNo);
            this.contractHeadId = loanDetail.ContractHeadId;
            this.service.getInvoicePeriod(loanDetail.ContractHeadId).pipe(
                finalize(() => { })
            ).subscribe(
                (res: any) => {
                    if (res.InvoicePeriod != undefined && res.InvoicePeriod.Details != null && res.InvoicePeriod.Details.length > 0) {
                        this.loInvoiceHead.InvoiceDetails = res.InvoicePeriod.Details;
                        this.InvoiceForm.controls.Period.setValue(res.InvoicePeriod.Period);
                        this.InvoiceForm.controls.ContractPeriodId.setValue(res.InvoicePeriod.ContractPeriodId);
                        this.InvoiceForm.controls.DueDate.setValue(new Date(res.InvoicePeriod.ReceiveDate));
                        this.InvoiceForm.controls.CompanyCode.setValue(res.InvoicePeriod.CompanyCode);
                        this.rebuildFormAdd();
                    } else {
                        this.resetToDefault();
                        this.as.warning('', 'Message.LO00014', [loanDetail.ContractNo]);
                    }
                }
            );
        }
    }

    printInvoice() {
        let data = [{ InvoiceHeadId: this.loInvoiceHead.InvoiceHeadId
                      , ContractHeadId: this.loInvoiceHead.MainContractHeadId
                      ,InvoiceNo: this.loInvoiceHead.InvoiceNo
                      ,CompanyCode: this.loInvoiceHead.CompanyCode }]
        this.reportDto.InvoiveHead = [];
        Object.assign(this.reportDto.InvoiveHead, data)
        this.service.printInvoice(this.reportDto)
            .pipe(finalize(() => { }))
            .subscribe(
                (res: any) => {
                    if (res.reports != undefined) {
                        if (res.reports.length > 0) {
                            res.reports.forEach(item => {
                                this.OpenWindow(item.data);
                            });
                        }
                    }
                });
    }

    async OpenWindow(data) {
        await window.open(data, '_blank');
    }

    prepareSave(values: Object) {
        Object.assign(this.loInvoiceHead, values);
        const invoiceDetail = this.getInvoiceList.getRawValue();
        const adding = invoiceDetail.filter(function (item) {
            return item.RowState == RowState.Add;
        });

        this.loInvoiceHead.InvoiceDetails.map(invoice => {
            return Object.assign(invoice, invoiceDetail.filter(item => item.RowState == RowState.Edit).find((item) => {
                return invoice.InvoiceDetailId == item.InvoiceDetailId
                    && invoice.InvoiceHeadId == item.InvoiceHeadId
            }));
        })

        this.loInvoiceHead.InvoiceDetails = this.loInvoiceHead.InvoiceDetails.filter(item => item.RowState !== RowState.Add).concat(adding);
    }

    onSave() {
        this.submitted = true;
        if (this.InvoiceForm.invalid) {
            this.focusToggle = !this.focusToggle;
            return;
        }
        this.saving = true;
        this.prepareSave(this.InvoiceForm.getRawValue());
        this.service.saveInvoice(this.loInvoiceHead).pipe(
            finalize(() => {
                this.saving = false;
                this.submitted = false;
                this.InvoiceForm.markAsPristine();
            }))
            .subscribe(
                (res: any) => {
                    if (res) {
                        this.invoiceData = res;
                        this.loInvoiceHead = res;
                        this.loInvoiceHead.InvoiceDetails = res.Details;
                        this.rebuildForm();
                        this.as.success('Message.STD00006', '');
                    }
                });
    }

    canDeactivate(): Observable<boolean> | boolean {
        if (!this.InvoiceForm.dirty) {
            return true;
        }
        return this.modal.confirm('Message.STD00002');
    }

    back() {
        this.router.navigate(['lo/lots07'], { skipLocationChange: true });
    }
}
