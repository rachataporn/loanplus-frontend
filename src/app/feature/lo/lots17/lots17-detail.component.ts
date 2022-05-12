import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { BrowserService, ImageFile, ModalRef, ModalService, ModelRef, RowState } from '@app/shared';
import { ImageDisplayService } from '@app/shared/image/image-display.service';
import { Category, ConfigurationService, ContentType } from '@app/shared/service/configuration.service';
import { ButtonEvent, ButtonsConfig, ButtonsStrategy, ButtonType, GalleryService, GridLayout, Image, PlainGalleryConfig, PlainGalleryStrategy } from '@ks89/angular-modal-gallery';
import * as numeral from 'numeral';
import { Observable, Subject } from 'rxjs';
import { debounceTime, finalize, switchMap } from 'rxjs/operators';
import { Lots17Service, Receipt, ReceiptAttachment, ReceiptDetails, ReceiptPayment, ReportDto } from './lots17.service';

@Component({
    templateUrl: './lots17-detail.component.html'
})
export class Lots17DetailComponent implements OnInit {
    receiptDetail: Receipt = {} as Receipt;
    itemPrepay: ReceiptDetails = {} as ReceiptDetails;
    imageFile: ImageFile = new ImageFile();
    ReceiptForm: FormGroup;
    payOffForm: FormGroup;
    saving: boolean;
    submitted: boolean;
    focusToggle: boolean;
    prepay: boolean = false;
    editMode: boolean = false;
    selected = [];
    recieptStatus = [];
    invoiceStatus = [];
    priorityList = [];
    receiveType = [];
    bankAccount = [];
    UserName: string;
    CompanyCode: string;
    MainCompanyCode: string;
    ReceiveTypeCash: string;
    popupPayOff: ModelRef;
    flagPayOff: string = '1';
    dataUrl: string;
    imagesOld: Image[] = []
    imagesNew: Image[] = []
    imagesNewTmp: Image[] = []
    reportDto: ReportDto = {} as ReportDto;
    subject: Subject<any> = new Subject();
    closeFlagAlertPopup: ModalRef;
    messegeAlertClosed: string = '';
    minDateTranfer = new Date();
    EnableReceiptDateFlag: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private service: Lots17Service,
        private modal: ModalService,
        public lang: LangService,
        private config: ConfigurationService,
        public image: ImageDisplayService,
        private browser: BrowserService,
        private galleryService: GalleryService
    ) {
        this.createForm();
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
            MainContractHeadID: null,
            CompanyCode: null,
            CustomerCode: null,
            ContractNo: null,
            LoanTotalAmount: [{ value: null, disabled: true }],
            LoanPeriodAmount: [{ value: null, disabled: true }],
            LoanPayDay: [{ value: null, disabled: true }],
            LoanInterestLate: [{ value: null, disabled: true }],
            LoanToalPeriod: null,
            LoanType: null,
            CustomerName: null,
            InvoiceNo: null,
            InvoiceDate: null,
            InvoiceBy: null,
            InvoiceStatus: null,
            ReceiptNo: null,
            ReceiptDate: [now, Validators.required],
            ReceiptBy: null,
            ReceiptStatus: null,
            ReceiptType: null,
            DocumentType: null,

            InvoiceTotalAmount: [{ value: 0, disabled: true }],
            ReceiptTotalAmount: [{ value: 0, disabled: true }],
            DifferenceTotalAmount: [{ value: 0, disabled: true }],
            BalancePrincipleAmount: [{ value: 0, disabled: true }],

            ArAdvanceAmount: null,
            ProcessDate: null,
            PrePaymentPeriod: null,
            AdvancePaymentAmount: [{ value: 0, disabled: true }],
            AdvancePaymentEstimateAmount: null,

            ReceiptDetailsForm: this.fb.array([]),
            PaymentForm: this.fb.array([]),
            AttachmentsForm: this.fb.array([])
        });

        this.ReceiptForm.controls.ReceiptDate.valueChanges.subscribe(
            (value) => {
                if (value && !this.editMode) {
                    this.calculateMoney();
                }
            }
        );
    }

    createDetailForm(item: ReceiptDetails): FormGroup {
        let fg = this.fb.group({
            guid: Math.random().toString(),//important for tracking change
            DescriptionTha: null,
            DescriptionEng: null,
            AmountToBePay: null,
            AmountPaid: null,
            AmountOfPayment: null
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
                    return data.ReceiveTypeCode === value &&
                        data.CompanyCode == this.CompanyCode;
                }) || {};

                const ToAccountMain = this.bankAccount.find((data) => {
                    return data.ReceiveTypeCode === value &&
                        data.CompanyCode == this.MainCompanyCode;
                }) || {};

                if (ToAccount.CompanyCode != null) {
                    fg.patchValue({
                        CompanyCode: ToAccount.CompanyCode,
                        CompanyAccountId: ToAccount.CompanyAccountId || 0,
                        BankCode: ToAccount.BankCode,
                        AccountNo: ToAccount.AccountNo,
                        AccountName: ToAccount.AccountName,
                        AccountCode: ToAccount.AccountCode,
                        BankName: ToAccount.Bank,
                        BranchName: ToAccount.Branch,
                    }, { emitEvent: false });
                } else {
                    fg.patchValue({
                        CompanyCode: ToAccountMain.CompanyCode,
                        CompanyAccountId: ToAccountMain.CompanyAccountId || 0,
                        BankCode: ToAccountMain.BankCode,
                        AccountNo: ToAccountMain.AccountNo,
                        AccountName: ToAccountMain.AccountName,
                        AccountCode: ToAccountMain.AccountCode,
                        BankName: ToAccountMain.Bank,
                        BranchName: ToAccountMain.Branch,
                    }, { emitEvent: false });
                }

                if (value == this.ReceiveTypeCash) {
                    fg.controls.ReceiveDate.setValue(now, { emitEvent: false })
                    fg.controls.ReceiveDate.disable({ emitEvent: false });
                } else {
                    fg.controls.ReceiveDate.enable({ emitEvent: false });

                    if (now.getDate() < 10) {
                        this.minDateTranfer.setDate(1);
                        this.minDateTranfer.setMonth(this.minDateTranfer.getMonth() - 1);
                    } else {
                        this.minDateTranfer.setDate(1);
                        this.minDateTranfer.setMonth(this.minDateTranfer.getMonth());
                    }
                }
            }
        );

        fg.controls.AccountNo.valueChanges.subscribe(
            (value) => {
                const ToAccount = this.bankAccount.find((data) => {
                    return data.AccountNo === value && data.ReceiveTypeCode === fg.controls.ReceiveTypeCode.value;
                }) || {};
                fg.patchValue({
                    BankName: ToAccount.Bank,
                    BranchName: ToAccount.Branch,
                }, { emitEvent: false });
            }
        );

        fg.controls.ReceiveDate.valueChanges.subscribe(
            (value) => {
                if (value) {
                    if (now.getDate() < 10) {
                        this.minDateTranfer.setDate(1);
                        this.minDateTranfer.setMonth(this.minDateTranfer.getMonth() - 1);
                    } else {
                        this.minDateTranfer.setDate(1);
                        this.minDateTranfer.setMonth(this.minDateTranfer.getMonth());
                    }
                }
            }
        );

        if (item.RowVersion) {
            fg.controls.ReceiveTypeCode.disable({ emitEvent: false });
            fg.controls.ReceiveDate.disable({ emitEvent: false });
            fg.controls.PaidAmount.disable({ emitEvent: false });
            fg.controls.AccountNo.disable({ emitEvent: false });
            this.editMode = true;
        } else {
            fg.controls.ReceiveTypeCode.setValue(this.ReceiveTypeCash, { emitEvent: true });
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

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.receiptDetail = data.Lots17 ? data.Lots17.PaymentDetail || {} as Receipt : {} as Receipt;
            this.recieptStatus = data.Lots17.master.ReceiptStatus;
            this.invoiceStatus = data.Lots17.master.InvoiceStatus;
            this.receiveType = data.Lots17.master.ReceiveType;
            this.bankAccount = data.Lots17.master.BankAccount;
            this.UserName = data.Lots17.master.UserName;
            this.CompanyCode = data.Lots17.master.CompanyCode;
            this.MainCompanyCode = data.Lots17.master.MainCompanyCode;
            this.ReceiveTypeCash = data.Lots17.master.ReceiveTypeCash;
            this.EnableReceiptDateFlag = data.Lots17.master.EnableReceiptDateFlag;
            this.rebuildForm();
        });

        this.subject
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.calculateMoney();
            }
            );
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
                className: 'fas fa-check white',
                type: ButtonType.CUSTOM,
                title: 'add',
                fontSize: '20px'
            },
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
                className: 'fas fa-trash white',
                type: ButtonType.DELETE,
                title: 'delete',
                fontSize: '20px'
            },
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

        this.ReceiptForm.markAsPristine();
        this.ReceiptForm.patchValue(this.receiptDetail);

        this.ReceiptForm.controls.LoanType.setValue(this.receiptDetail['LoanType' + this.lang.CURRENT], { emitEvent: false });
        this.ReceiptForm.controls.CustomerName.setValue(this.receiptDetail['CustomerName' + this.lang.CURRENT], { emitEvent: false });
        this.ReceiptForm.controls.InvoiceBy.setValue(this.receiptDetail['InvoiceBy' + this.lang.CURRENT], { emitEvent: false });
        this.ReceiptForm.controls.ReceiptBy.setValue(this.receiptDetail['ReceiptBy' + this.lang.CURRENT], { emitEvent: false });
        this.ReceiptForm.controls.ReceiptType.setValue(this.flagPayOff, { emitEvent: false });

        this.ReceiptForm.setControl('ReceiptDetailsForm', this.fb.array(this.receiptDetail.ReceiptDetails.map((detail) => this.createDetailForm(detail))));
        this.ReceiptForm.setControl('PaymentForm', this.fb.array(this.receiptDetail.ReceiptPayment.map((detail) => this.createPaymentForm(detail))));

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

        if (!this.editMode) {
            this.getPayments.push(this.createPaymentForm({} as ReceiptPayment));
        }

        // this.calculateMoney();
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

    calculateMoneyKeyUp(): void {
        this.subject.next();
    }

    calculateMoney() {
        this.ReceiptForm.setControl('ReceiptDetailsForm', this.fb.array([]));
        let ReceiptNetAmount = 0;
        let Difference = 0;
        let InvoiceTotalAmount = 0;

        this.getPayments.getRawValue().map(
            (data) => {
                ReceiptNetAmount = numeral(ReceiptNetAmount).add(data.PaidAmount ? data.PaidAmount : 0).value();
            }
        );

        if (ReceiptNetAmount > this.ReceiptForm.controls.AdvancePaymentEstimateAmount.value) {
            this.as.warning('', 'Message.LO00040');
            const detail = this.getPayments.at(0) as FormGroup;
            detail.controls.PaidAmount.setValue(0);
            return;
        }

        this.ReceiptForm.controls.ReceiptTotalAmount.setValue(ReceiptNetAmount, { emitEvent: false });

        if (this.editMode) {
            this.ReceiptForm.controls.ReceiptDate.disable({ emitEvent: false });
            ReceiptNetAmount = 0;
        }

        this.service.getCalculateProcess(this.ReceiptForm.controls.MainContractHeadID.value, this.ReceiptForm.controls.ReceiptDate.value, ReceiptNetAmount, this.flagPayOff).pipe(
            finalize(() => {
            }))
            .subscribe((res) => {
                var amountAdvance = 0;
                var amountNormal = 0;

                if (res.length > 1) {
                    amountAdvance = res[4].AmountOfPayment;
                    amountNormal = numeral(res[0].AmountOfPayment).add(res[1].AmountOfPayment).add(res[2].AmountOfPayment).add(res[3].AmountOfPayment).value();
                }

                if (this.ReceiptForm.controls.ReceiptType.value == '1' && amountAdvance > 0 && amountNormal == 0) {
                    this.ReceiptForm.controls.DocumentType.setValue('RV', { emitEvent: false });
                    this.ReceiptForm.controls.ArAdvanceAmount.setValue(ReceiptNetAmount, { emitEvent: false });
                } else {
                    this.ReceiptForm.controls.DocumentType.setValue('RC', { emitEvent: false });
                }

                this.ReceiptForm.setControl('ReceiptDetailsForm', this.fb.array(res.map((detail) => this.createDetailForm(detail))));
                InvoiceTotalAmount = numeral(this.sumTotalAmount()).subtract(this.sumRemainAmount()).value();
                this.ReceiptForm.controls.InvoiceTotalAmount.setValue(InvoiceTotalAmount, { emitEvent: false });

                Difference = numeral(this.ReceiptForm.controls.InvoiceTotalAmount.value == null ? 0 : this.ReceiptForm.controls.InvoiceTotalAmount.value).subtract(ReceiptNetAmount).value();
                this.ReceiptForm.controls.DifferenceTotalAmount.setValue(Difference, { emitEvent: false });
                if (Difference < 0) {
                    this.prepay = true;
                } else {
                    this.prepay = false;
                }
            });
    }

    sumTotalAmount() {
        return this.getDetails.getRawValue().map(row => row.AmountToBePay)
            .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }

    sumRemainAmount() {
        return this.getDetails.getRawValue().map(row => row.AmountPaid)
            .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }

    sumTotalPaymentAmount() {
        return this.getDetails.getRawValue().map(row => row.AmountOfPayment)
            .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }

    prepareSave(values: Object) {
        Object.assign(this.receiptDetail, values);

        const receiptDetails = this.getDetails.getRawValue();
        Object.assign(this.receiptDetail.ReceiptDetails, receiptDetails);

        this.receiptDetail.ReceiptPayment = [];
        const paymentDetails = this.getPayments.getRawValue();
        Object.assign(this.receiptDetail.ReceiptPayment, paymentDetails);

        this.receiptDetail.ReceiptAttachment = [];

        const imageNames = this.imagesNewTmp.filter(detail => {
            return this.imagesNew.find((o) => {
                return o.id === detail.id;
            });
        }).map((item) => {
            return {
                ImageName: item.modal.img
            }
        });

        Object.assign(this.receiptDetail.ReceiptAttachment, imageNames);

        delete this.receiptDetail['ReceiptDetailsForm'];
        delete this.receiptDetail['PaymentForm'];
        delete this.receiptDetail['AttachmentsForm'];
    }

    onSubmit() {
        this.submitted = true;
        if (this.ReceiptForm.invalid) {
            this.focusToggle = !this.focusToggle;
            return;
        }

        const now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
        if (this.ReceiptForm.controls.ReceiptDate.value.getTime() != now.getTime()) {
            if (this.EnableReceiptDateFlag == '1') {
                this.as.warning('', 'Message.LO00041');
                return;
            }
        }

        const fineAmount = this.getDetails.getRawValue().find((data) => {
            return data.DescriptionEng === 'Fine';
        }).AmountToBePay || 0;

        const debtCollectionAmount = this.getDetails.getRawValue().find((data) => {
            return data.DescriptionEng === 'Debt Collection';
        }).AmountToBePay || 0;

        if (this.ReceiptForm.controls.ReceiptTotalAmount.value < numeral(fineAmount).add(debtCollectionAmount).value()) {
            this.as.warning('', 'Message.LO00028');
            return;
        }

        if (this.ReceiptForm.controls.ReceiptType.value == '2' &&
            this.ReceiptForm.controls.InvoiceTotalAmount.value != this.ReceiptForm.controls.ReceiptTotalAmount.value) {
            this.as.warning('', 'Message.STD00021', ['Label.LOTS08.PaymentAmount', 'Label.LOTS08.AmountToBePaid']);
            return;
        }

        this.saving = true;
        this.prepareSave(this.ReceiptForm.getRawValue());
        this.service.saveReceipt(this.receiptDetail).pipe(
            switchMap(() => this.service.getPaymentAdvanceDetail(this.ReceiptForm.controls.MainContractHeadID.value, true)),
            finalize(() => {
                this.saving = false;
                this.submitted = false;
            }))
            .subscribe((res: Receipt) => {
                this.receiptDetail = res;
                this.editMode = true;
                this.rebuildForm();
                this.as.success('', 'Message.STD00006');
            });
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
        this.router.navigate(['lo/lots08'], { skipLocationChange: true });
    }

    onSelect(delay = 1) {
        setTimeout(this.resize.bind(this), delay);
    }

    async OpenWindow(data) {
        await window.open(data, '_blank');
    }

    onPrint() {
        this.reportDto.receiptNo = this.ReceiptForm.controls.ReceiptNo.value;
        this.reportDto.companyCode = this.ReceiptForm.controls.CompanyCode.value;
        this.reportDto.documentType = this.ReceiptForm.controls.DocumentType.value;
        this.service.printReceipt(this.reportDto)
            .pipe(finalize(() => { }))
            .subscribe(
                (res: any) => {
                    this.OpenWindow(res.reports);
                });
    }
}
