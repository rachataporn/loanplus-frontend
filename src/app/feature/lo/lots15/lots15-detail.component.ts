import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, ModelRef, Size, RowState, ImageFile, BrowserService } from '@app/shared';
import { Lots15Service, Loan, ReceiptDetails, ReceiptPayment, ReceiptAttachment, ReportDto, Cancel } from './lots15.service';
import { finalize, switchMap } from 'rxjs/operators';
import { ConfigurationService, ContentType, Category } from '@app/shared/service/configuration.service';
import { ImageDisplayService } from '@app/shared/image/image-display.service';
import { Observable } from 'rxjs';
import { ButtonsConfig, ButtonsStrategy, Image, PlainGalleryConfig, GridLayout, PlainGalleryStrategy, ButtonType, ButtonEvent, GalleryService } from '@ks89/angular-modal-gallery';
import * as numeral from 'numeral';

@Component({
    templateUrl: './lots15-detail.component.html'
})
export class Lots15DetailComponent implements OnInit {
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
    imagesOld: Image[] = []
    imagesNew: Image[] = []
    imagesNewTmp: Image[] = []

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private service: Lots15Service,
        private modal: ModalService,
        public lang: LangService,
        private config: ConfigurationService,
        public image: ImageDisplayService,
        private browser: BrowserService,
        private galleryService: GalleryService
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
            ImageName: null,
            RowState: RowState.Normal
        });
        fg.patchValue(item, { emitEvent: false });
        return fg;
    }

    createCancelForm() {
        this.CancelForm = this.fb.group({
            Remark: [null, Validators.required]
        });
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.receiptDetail = data.Lots15 ? data.Lots15.ReceiptDetail || {} as Loan : {} as Loan;
            this.recieptStatus = data.Lots15.master.ReceiptStatus;
            this.invoiceStatus = data.Lots15.master.InvoiceStatus;
            this.receiveType = data.Lots15.master.ReceiveType;
            this.bankAccount = data.Lots15.master.BankAccount;
            this.UserName = data.Lots15.master.UserName;
            this.ReceiveTypeCash = data.Lots15.master.ReceiveTypeCash;
            this.rebuildForm();
        });

        this.lang.onChange().subscribe(() => {
            this.rebuildForm();
        });
    }

    plainGalleryGrid: PlainGalleryConfig = {
        strategy: PlainGalleryStrategy.GRID,
        layout: new GridLayout({ width: '80px', height: '80px' }, { length: 4, wrap: true })
    };

    customButtonsOldConfig: ButtonsConfig = {
        visible: true,
        strategy: ButtonsStrategy.CUSTOM,
        buttons: [
            {
                className: 'fas fa-times white',
                type: ButtonType.CLOSE,
                title: 'close',
                fontSize: '20px'
            }
        ]
    };

    customButtonsNewConfig: ButtonsConfig = {
        visible: true,
        strategy: ButtonsStrategy.CUSTOM,
        buttons: [
            {
                className: 'fas fa-times white',
                type: ButtonType.CLOSE,
                title: 'close',
                fontSize: '20px'
            }
        ]
    };

    onCustomButtonAfterHook(event: ButtonEvent, galleryId: number | undefined) {
        if (!event || !event.button) {
            return;
        }

        if (event.button.type === ButtonType.DELETE) {
            this.addImageOld(event.image);
            const imageRemoveNew = this.imagesNew.filter((val: Image) => event.image && val.id !== event.image.id);

            this.imagesNew = [];
            Object.assign(this.imagesNew, imageRemoveNew);

            if (this.imagesNew.length == 0) {
                setTimeout(() => {
                    this.galleryService.closeGallery(galleryId);
                }, 100);
            }
        }

        if (event.button.type === ButtonType.CUSTOM) {
            if (event.image.id != this.imagesOld.length - 1) {
                this.galleryService.navigateGallery(galleryId, event.image.id + 1);
            } else {
                if (event.image.id != 0) {
                    this.galleryService.navigateGallery(galleryId, event.image.id - 1);
                } else {
                    this.galleryService.closeGallery(galleryId);
                }
            }

            this.addImageNew(event.image);
            const imageRemove = this.imagesOld.filter((val: Image) => event.image && val.id !== event.image.id);

            this.imagesOld = [];
            Object.assign(this.imagesOld, imageRemove);

            if (this.imagesOld.length == 0) {
                setTimeout(() => {
                    this.galleryService.closeGallery(galleryId);
                }, 100);
            }
        }
    }

    addImageOld(image) {
        const duplicateID = this.imagesOld.some(function (imageOld) {
            return imageOld.id === image.id;
        });

        if (!duplicateID) {
            const newImage: Image[] = this.imagesNew.filter((val: Image) => {
                return image && val.id === image.id;
            });
            this.imagesOld = [...this.imagesOld, newImage[0]];
        }
    }

    addImageNew(image) {
        const duplicateID = this.imagesNew.some(function (imageNew) {
            return imageNew.id === image.id;
        });

        if (!duplicateID) {
            const newImage: Image[] = this.imagesOld.filter((val: Image) => {
                return image && val.id === image.id;
            });
            this.imagesNew = [...this.imagesNew, newImage[0]];
        }
    }

    rebuildForm() {
        this.imagesNew = [];
        this.imagesOld = [];
        this.imagesNewTmp = [];

        if (this.receiptDetail.ReceiptStatus == '2') {
            this.statusCancel = true;
        }

        this.ReceiptForm.markAsPristine();
        this.ReceiptForm.patchValue(this.receiptDetail);
        this.ReceiptForm.controls.LoanType.setValue(this.receiptDetail['LoanType' + this.lang.CURRENT], { emitEvent: false });
        this.ReceiptForm.controls.CustomerName.setValue(this.receiptDetail['CustomerName' + this.lang.CURRENT], { emitEvent: false });
        this.ReceiptForm.controls.InvoiceBy.setValue(this.receiptDetail['InvoiceBy' + this.lang.CURRENT], { emitEvent: false });
        this.ReceiptForm.controls.ReceiptBy.setValue(this.receiptDetail['ReceiptBy' + this.lang.CURRENT], { emitEvent: false });

        setTimeout(() => {
            this.ReceiptForm.setControl('ReceiptDetailsForm', this.fb.array(this.receiptDetail.ReceiptDetails.map((detail) => this.createDetailForm(detail))));
        }, 1);

        setTimeout(() => {
            this.ReceiptForm.setControl('PaymentForm', this.fb.array(this.receiptDetail.ReceiptPayment.map((detail) => this.createPaymentForm(detail))));
            this.calculateMoney();
        }, 1);

        var i = 0;
        this.receiptDetail.ReceiptAttachment.forEach(element => {
            this.config.configChanged().subscribe(config => {
                this.dataUrl = `${config.DisplayPath}/${ContentType.Image}/${Category.Receive}/${element.ImageName}`;
            })

            if (element.ImageFlag) {
                this.imagesNew.push(new Image(
                    i,
                    {
                        img: this.dataUrl,
                    }
                ))
            } else {
                this.imagesOld.push(new Image(
                    i,
                    {
                        img: this.dataUrl,
                    }
                ))

                this.imagesNewTmp.push(new Image(
                    i,
                    {
                        img: element.ImageName,
                    }
                ))
            }
            i++;
        });
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
        this.router.navigate(['lo/lots15'], { skipLocationChange: true });
    }

    onSelect(delay = 1) {
        setTimeout(this.resize.bind(this), delay);
    }

    async OpenWindow(data) {
        await window.open(data, '_blank');
    }

    onPrint() {
        this.reportDto.receiptNo = this.receiptDetail.ReceiptNo;
        this.reportDto.companyCode = this.receiptDetail.CompanyCode;
        this.reportDto.documentType = this.receiptDetail.ReceiptType;
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
}
