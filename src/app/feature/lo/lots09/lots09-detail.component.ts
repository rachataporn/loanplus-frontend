import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, ModelRef, Size, RowState, ImageFile, BrowserService } from '@app/shared';
import { Lots09Service, Loan, ReceiptDetails, ReceiptPayment, ReceiptAttachment, ReportDto, Cancel } from './lots09.service';
import { finalize, switchMap } from 'rxjs/operators';
import { ConfigurationService, ContentType, Category } from '@app/shared/service/configuration.service';
import { ImageDisplayService } from '@app/shared/image/image-display.service';
import { Observable } from 'rxjs';
import { ButtonsConfig, ButtonsStrategy, Image, PlainGalleryConfig, GridLayout, PlainGalleryStrategy, ButtonType, ButtonEvent, GalleryService } from '@ks89/angular-modal-gallery';
import * as numeral from 'numeral';
import { Attachment } from '@app/shared/attachment/attachment.model';

@Component({
    templateUrl: './lots09-detail.component.html'
})
export class Lots09DetailComponent implements OnInit {
    receiptDetail: Loan = {} as Loan;
    itemPrepay: ReceiptDetails = {} as ReceiptDetails;
    imageFile: ImageFile = new ImageFile();
    reportDto: ReportDto = {} as ReportDto;
    cancelDetail: Cancel = {} as Cancel;

    ReceiptForm: FormGroup;
    CancelForm: FormGroup;
    popupCancel: ModelRef;

    saving: boolean;
    submitted: boolean;
    focusToggle: boolean;
    prepay: boolean = false;
    editMode: boolean = false;
    statusCancel: boolean = false;
    selected = [];
    recieptStatus = [];
    invoiceStatus = [];
    priorityList = [];
    receiveType = [];
    bankAccount = [];
    UserName: string;
    dataUrl: string;
    ReceiveTypeCash: string;
    attachmentFiles: Attachment[] = [];
    category = Category.ReceiptAttachment;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private service: Lots09Service,
        private modal: ModalService,
        public lang: LangService,
        public image: ImageDisplayService,
        private browser: BrowserService
    ) {
        this.createForm();
        this.createCancelForm();
    }

    private resize() {
        if (this.browser.isIE) {
            var evt = document.createEvent('UIEvents');
            evt.initEvent('resize', true, false);
            window.dispatchEvent(evt);
        } else {
            window.dispatchEvent(new Event('resize'));
        }
    }

    createForm() {
        const now = new Date();

        this.ReceiptForm = this.fb.group({
            ContractHeadID: null,
            ContractPeriodID: null,
            CompanyCode: null,
            ReceiptNo: 'Auto',
            ReceiptDate: now,
            ReceiptBy: null,
            ReceiptStatus: '1',
            RefInvoiceHeadId: null,
            InvoiceNo: null,
            InvoiceDate: null,
            InvoiceBy: null,
            InvoiceStatus: null,
            LoanNo: null,
            CustomerName: null,
            CustomerCode: null,
            LoanType: null,
            LoanTotalAmount: [{ value: null, disabled: true }],
            LoanPayDay: [{ value: null, disabled: true }],
            LoanInterestLate: [{ value: null, disabled: true }],
            LoanToalPeriod: null,
            LoanPeriodAmount: [{ value: null, disabled: true }],
            InvoiceTotalAmount: [{ value: 0, disabled: true }],
            ReceiptTotalAmount: [{ value: null, disabled: true }],
            DifferenceTotalAmount: [{ value: 0, disabled: true }],
            ReceiptDetailsForm: this.fb.array([]),
            PaymentForm: this.fb.array([]),
            AttachmentsForm: this.fb.array([]),
            CreateDateString: null
        });
    }

    createDetailForm(item: ReceiptDetails): FormGroup {
        let fg = this.fb.group({
            guid: Math.random().toString(),//important for tracking change
            RefInvoiceDetailId: null,
            DescriptionTha: null,
            DescriptionEng: null,
            InvoiceAmount: null,
            ReceiptAmount: [{ value: null, disabled: true }],
            RemainAmount: null,
            InvoiceType: null,
            Priority: null,
            Sequence: null,
            Period: null,
            PrepayFlag: null,
            RowVersion: null,
            RowState: RowState.Normal
        });
        fg.patchValue(item, { emitEvent: false });
        return fg;
    }

    createPaymentForm(item: ReceiptPayment): FormGroup {
        const now = new Date();

        const fg = this.fb.group({
            guid: Math.random().toString(), // important for tracking change
            CompanyCode: null,
            ReceiveTypeCode: [null, Validators.required],
            CompanyAccountId: null,
            BankCode: null,
            AccountNo: null,
            AccountName: null,
            AccountCode: null,
            BankName: null,
            BranchName: null,
            ReceiveDate: [now, Validators.required],
            PaidAmount: [null, Validators.required],
            RowState: RowState.Normal
        });
        fg.patchValue(item, { emitEvent: false });

        fg.controls.ReceiveTypeCode.valueChanges.subscribe(
            (value) => {
                const ToAccount = this.bankAccount.find((data) => {
                    return data.ReceiveTypeCode === value;
                }) || {};
                fg.patchValue({
                    CompanyCode: ToAccount.CompanyCode || '',
                    CompanyAccountId: ToAccount.CompanyAccountId || 0,
                    BankCode: ToAccount.BankCode || '',
                    AccountNo: ToAccount.AccountNo || '',
                    AccountName: ToAccount.AccountName || '',
                    AccountCode: ToAccount.AccountCode || '',
                    BankName: ToAccount.Bank || '',
                    BranchName: ToAccount.Branch || '',

                }, { emitEvent: false });
            }
        );

        fg.controls.AccountNo.valueChanges.subscribe(
            (value) => {
                const ToAccount = this.bankAccount.find((data) => {
                    return data.AccountNo === value && data.ReceiveTypeCode === fg.controls.ReceiveTypeCode.value;
                }) || {};
                fg.patchValue({
                    BankName: ToAccount.Bank || '',
                    BranchName: ToAccount.Branch || '',
                }, { emitEvent: false });
            }
        );

        if (item.RowVersion) {
            fg.controls.ReceiveTypeCode.disable({ emitEvent: false });
            fg.controls.ReceiveDate.disable({ emitEvent: false });
            fg.controls.PaidAmount.disable({ emitEvent: false });
            fg.controls.AccountNo.disable({ emitEvent: false });
            this.editMode = true;
        }
        return fg;
    }

    createAttachmentForm(item: ReceiptAttachment): FormGroup {
        let fg = this.fb.group({
            guid: Math.random().toString(),//important for tracking change
            ReceiptAttachmentId: 0,
            FileName: null,
            AttachmentId: [null, Validators.required],
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

    createCancelForm() {
        this.CancelForm = this.fb.group({
            Remark: [null, Validators.required]
        });
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.receiptDetail = data.receiptDetail ? data.receiptDetail.ReceiptDetail || {} as Loan : {} as Loan;
            this.recieptStatus = data.receiptDetail.master.ReceiptStatus;
            this.invoiceStatus = data.receiptDetail.master.InvoiceStatus;
            this.receiveType = data.receiptDetail.master.ReceiveType;
            this.bankAccount = data.receiptDetail.master.BankAccount;
            this.UserName = data.receiptDetail.master.UserName;
            this.ReceiveTypeCash = data.receiptDetail.master.ReceiveTypeCash;
            this.rebuildForm();
        });

        this.lang.onChange().subscribe(() => {
            this.rebuildForm();
        });
    }

    rebuildForm() {
        if (this.receiptDetail.ReceiptStatus == '2') {
            this.statusCancel = true;
        }

        this.ReceiptForm.markAsPristine();
        this.ReceiptForm.patchValue(this.receiptDetail);
        this.ReceiptForm.controls.LoanType.setValue(this.receiptDetail['LoanType' + this.lang.CURRENT], { emitEvent: false });
        this.ReceiptForm.controls.CustomerName.setValue(this.receiptDetail['CustomerName' + this.lang.CURRENT], { emitEvent: false });
        this.ReceiptForm.controls.InvoiceBy.setValue(this.receiptDetail['InvoiceBy' + this.lang.CURRENT], { emitEvent: false });
        this.ReceiptForm.controls.ReceiptBy.setValue(this.receiptDetail['ReceiptBy' + this.lang.CURRENT], { emitEvent: false });

        // setTimeout(() => {
        this.ReceiptForm.setControl('ReceiptDetailsForm', this.fb.array(this.receiptDetail.ReceiptDetails.map((detail) => this.createDetailForm(detail))));
        // }, 1);

        // setTimeout(() => {
        this.ReceiptForm.setControl('PaymentForm', this.fb.array(this.receiptDetail.ReceiptPayment.map((detail) => this.createPaymentForm(detail))));
        // this.calculateMoney();
        // }, 1);

        setTimeout(() => {
            this.ReceiptForm.setControl('AttachmentsForm', this.fb.array(this.receiptDetail.ReceiptAttachment.map((detail) => this.createAttachmentForm(detail))))
            this.checkReceiptAttachment();
        }, 300);
    }

    get getDetails(): FormArray {
        return this.ReceiptForm.get('ReceiptDetailsForm') as FormArray;
    };

    get getPayments(): FormArray {
        return this.ReceiptForm.get('PaymentForm') as FormArray;
    };

    get getAttachments(): FormArray {
        return this.ReceiptForm.get('AttachmentsForm') as FormArray;
    };

    get getReceiptStatus() {
        return this.recieptStatus.find((item) => { return item.Value == this.ReceiptForm.controls['ReceiptStatus'].value });
    };

    get getInvoiceStatus() {
        return this.invoiceStatus.find((item) => { return item.Value == this.ReceiptForm.controls['InvoiceStatus'].value });
    };

    removeRow(index) {
        // --ลบข้อมูลrecordนี้ออกจาก formarray
        this.getPayments.removeAt(index);
        this.getPayments.markAsDirty();
        // ---------------------------------

        this.calculateMoney();
    }

    calculateMoney() {
        this.priorityList = [];
        let ReceiptNetAmount = 0;
        let Difference = 0;
        let InvoiceTotalAmount = 0;

        InvoiceTotalAmount = this.sumTotalAmount();
        this.ReceiptForm.controls.InvoiceTotalAmount.setValue(InvoiceTotalAmount);
        this.getPayments.getRawValue().map(
            (data) => {
                ReceiptNetAmount = numeral(ReceiptNetAmount).add(data.PaidAmount ? data.PaidAmount : 0).value();
            }
        );

        Difference = numeral(this.ReceiptForm.controls.InvoiceTotalAmount.value == null ? 0 : this.ReceiptForm.controls.InvoiceTotalAmount.value).subtract(ReceiptNetAmount).value();
        this.ReceiptForm.controls.DifferenceTotalAmount.setValue(Difference);
        ReceiptNetAmount = 0;
        this.getPayments.getRawValue().map(
            (data) => {
                ReceiptNetAmount = numeral(ReceiptNetAmount).add(data.PaidAmount ? data.PaidAmount : 0).value();
            }
        );

        this.ReceiptForm.controls.ReceiptTotalAmount.setValue(ReceiptNetAmount)
        let amount = this.ReceiptForm.controls.ReceiptTotalAmount.value ? this.ReceiptForm.controls.ReceiptTotalAmount.value : 0;
        let lastAmount = 0;
        let paymentAmountCal = 0;

        this.priorityList = this.getDetails.controls.map((x) => {
            return {
                Period: x.value.Period,
                Priority: x.value.Priority,
                controls: x
            }
        });

        this.priorityList.sort(function (a, b) {
            if (a.Period != b.Period) {
                return a.Period - b.Period;
            }
            return a.Priority - b.Priority;
        });

        lastAmount = amount;
        this.priorityList.forEach(priority => {

            if ((numeral(priority.controls.value.InvoiceAmount).subtract(priority.controls.value.RemainAmount).value() == 0)) {
                const ReceiptAmount = { ReceiptAmount: 0 }
                priority.controls.patchValue(ReceiptAmount, { emitEvent: false });
                return;
            }

            paymentAmountCal = numeral(lastAmount).subtract(priority.controls.value.InvoiceType == 'AdvancePayment' ? 0 : numeral(priority.controls.value.InvoiceAmount).subtract(priority.controls.value.RemainAmount).value()).value();

            if (lastAmount > 0) {
                if (paymentAmountCal > 0) {
                    const ReceiptAmount = { ReceiptAmount: priority.controls.value.InvoiceType == 'AdvancePayment' ? priority.controls.getRawValue().ReceiptAmount : numeral(priority.controls.value.InvoiceAmount).subtract(priority.controls.value.RemainAmount).value() }
                    priority.controls.patchValue(ReceiptAmount, { emitEvent: false });
                } else {
                    const ReceiptAmount = { ReceiptAmount: lastAmount }
                    priority.controls.patchValue(ReceiptAmount, { emitEvent: false });
                }
            } else {
                const ReceiptAmount = { ReceiptAmount: 0 }
                priority.controls.patchValue(ReceiptAmount, { emitEvent: false });
            }
            lastAmount = paymentAmountCal;

            if (priority.controls.value.InvoiceType == 'AdvancePayment') {
                const ReceiptAmount = { ReceiptAmount: lastAmount }
                priority.controls.patchValue(ReceiptAmount, { emitEvent: false });
            }
        });
    }

    sumTotalAmount() {
        return this.getDetails.value.map(row => row.InvoiceAmount)
            .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }

    sumRemainAmount() {
        return this.getDetails.getRawValue().map(row => row.RemainAmount)
            .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }

    indentity(row) {
        return row.guid;
    }

    canDeactivate(): Observable<boolean> | boolean {
        if (!this.ReceiptForm.dirty) {
            return true;
        }
        return this.modal.confirm('Message.STD00002');
    }

    back() {
        this.router.navigate(['lo/lots09'], { skipLocationChange: true });
    }

    onSelect(delay = 1) {
        setTimeout(this.resize.bind(this), delay);
    }

    async OpenWindow(data) {
        await window.open(data, '_blank');
    }

    onPrint() {
        this.reportDto.receiptNo = this.receiptDetail.ReceiptNo;
        this.reportDto.documentType = this.receiptDetail.DocumentType;
        this.reportDto.companyCode = this.receiptDetail.CompanyCode;
        this.service.printInvoice(this.reportDto)
            .pipe(finalize(() => { }))
            .subscribe(
                (res: any) => {
                    this.OpenWindow(res.reports);
                });
    }

    onCancel(content) {
        this.popupCancel = this.modal.open(content, Size.medium);
    }

    closeCancelModal() {
        this.popupCancel.hide();
    }

    onSubmitCancel() {
        this.submitted = true;
        if (this.CancelForm.invalid) {
            this.focusToggle = !this.focusToggle;
            return;
        }

        this.saving = true;
        this.cancelDetail.ReceiptHeadId = this.receiptDetail.ReceiptHeadId;
        Object.assign(this.cancelDetail, this.CancelForm.value);
        this.service.saveCancelReceipt(this.cancelDetail).pipe(
            switchMap(() => this.service.getReceiptDetail(this.receiptDetail.ReceiptHeadId)),
            finalize(() => {
                this.saving = false;
                this.submitted = false;
            }))
            .subscribe((res: Loan) => {
                this.receiptDetail = res;
                this.rebuildForm();
                this.closeCancelModal();
                this.as.success('', 'Message.STD00006');
            });
    }

    checkReceiptAttachment() {
        this.getAttachments.enable();
        for (let i = 0; i < this.getAttachments.length; i++) {
            let form = this.getAttachments.controls[i] as FormGroup;
            if (form.controls.ReceiptAttachmentId.value != 0) {
                form.controls.AttachmentId.disable({ emitEvent: false });
                form.controls.Description.disable({ emitEvent: false });
            }
        }
    }
}
