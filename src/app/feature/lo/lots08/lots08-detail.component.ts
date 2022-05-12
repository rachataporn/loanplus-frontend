import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { BrowserService, ImageFile, ModalRef, ModalService, ModelRef, RowState, Size } from '@app/shared';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category, ConfigurationService, ContentType } from '@app/shared/service/configuration.service';
import { ButtonEvent, ButtonsConfig, ButtonsStrategy, ButtonType, GalleryService, GridLayout, Image, PlainGalleryConfig, PlainGalleryStrategy } from '@ks89/angular-modal-gallery';
import * as numeral from 'numeral';
import { Observable, Subject } from 'rxjs';
import { debounceTime, finalize, switchMap } from 'rxjs/operators';
import { Lots08Service, Receipt, ReceiptAttachment, ReceiptDetails, ReceiptPayment, ReportDto, DefaultPrepay } from './lots08.service';

@Component({
    templateUrl: './lots08-detail.component.html'
})
export class Lots08DetailComponent implements OnInit {
    @ViewChild('closeFlagAlert') closeFlagAlert: TemplateRef<any>;

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
    ReceiveTypeCash: string;
    popupPayOff: ModelRef;
    flagPayOff: string;
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
    PrePayFlag = [];
    ContractPolicyMessege: string = '';
    IsRequireAccountNo: boolean = false;
    confirmPopup: ModalRef;
    IsPermissionWaive: boolean;
    attachmentFiles: Attachment[] = [];
    category = Category.ReceiptAttachment;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private service: Lots08Service,
        private modal: ModalService,
        public lang: LangService,
        private config: ConfigurationService,
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
            ReceiptStatus: 'N',
            ReceiptType: null,
            DocumentType: null,
            ReceiptTotalAmount: null,
            AccuredInterestAmount: [{ value: 0, disabled: true }],
            AccuredPrincipleAmount: [{ value: 0, disabled: true }],
            BalancePrincipleAmount: [{ value: 0, disabled: true }],
            LastCurrentPaymentPeriod: [{ value: 0, disabled: true }],
            ArAdvanceAmount: null,
            ReceiptDetailsForm: this.fb.array([]),
            PaymentForm: this.fb.array([]),
            AttachmentsForm: this.fb.array([]),
            PrepayFlag: '0',
            AdjustFineAmount: 0,
            AdjustDebtCollectionAmount: 0
        });

        this.ReceiptForm.controls.ReceiptDate.valueChanges.subscribe(
            (value) => {
                if (value && !this.editMode) {
                    this.calculateMoney();
                }
                this.checkDefaultPrepayFlag();
            }
        );

        this.ReceiptForm.controls.PrepayFlag.valueChanges.subscribe(
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
            // AmountToBePay: null,
            AmountToBePay: [null, [Validators.required, Validators.max(item.BaseAmountToBePay)]],
            AmountPaid: null,
            AmountOfPayment: null,
            BaseAmountToBePay: null,
            AccuredPrincipleAmount: null,
            AccuredInterestAmount: null,
            BalancePrincipleAmount: null,
            LastCurrentPaymentPeriod: null
        });
        fg.patchValue(item, { emitEvent: false });

        if (item.AmountToBePay == 0 && item.AmountToBePay != item.BaseAmountToBePay && !this.editMode) {
            fg.controls.AmountToBePay.enable({ emitEvent: false });
        } else if (item.AmountToBePay == 0 && !this.editMode) {
            fg.controls.AmountToBePay.disable({ emitEvent: false });
        } else if (item.AmountToBePay == item.AmountPaid && !this.editMode) {
            fg.controls.AmountToBePay.disable({ emitEvent: false });
        } else if (this.editMode) {
            fg.controls.AmountToBePay.disable({ emitEvent: false });
        }

        fg.controls.AmountToBePay.valueChanges.subscribe(
            (value) => {
                if (value >= 0 && value <= item.BaseAmountToBePay) {
                    this.calculateMoneyKeyUp();
                }
            }
        );
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
            // AccountNo: [null, Validators.required],
            AccountNo: [{ value: null, disabled: true }],
            AccountName: [{ value: null, disabled: true }],
            AccountCode: [{ value: null, disabled: true }],
            BankName: [{ value: null, disabled: true }],
            BranchName: [{ value: null, disabled: true }],
            ReceiveDate: [now, Validators.required],
            PaidAmount: [null, Validators.required],
            RowState: RowState.Normal
        });
        fg.patchValue(item, { emitEvent: false });

        fg.controls.ReceiveTypeCode.valueChanges.subscribe(
            (value) => {
                const ToAccount = this.bankAccount.find((data) => {
                    return data.ReceiveTypeCode === value &&
                        data.CompanyCode == this.receiptDetail.CompanyCode;
                }) || {};

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

                if (value == this.ReceiveTypeCash) {
                    fg.controls.ReceiveDate.setValue(now, { emitEvent: false })
                    fg.controls.ReceiveDate.disable({ emitEvent: false });
                    fg.controls.AccountNo.disable({ emitEvent: false });

                    this.IsRequireAccountNo = false;
                } else {
                    fg.controls.ReceiveDate.enable({ emitEvent: false });
                    fg.controls.AccountNo.enable({ emitEvent: false });

                    if (now.getDate() < 10) {
                        this.minDateTranfer.setDate(1);
                        this.minDateTranfer.setMonth(this.minDateTranfer.getMonth() - 1);
                    } else {
                        this.minDateTranfer.setDate(1);
                        this.minDateTranfer.setMonth(this.minDateTranfer.getMonth());
                    }
                    this.IsRequireAccountNo = true;
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

    ngOnInit() {
        this.flagPayOff = this.route.snapshot.params.FlagPayOff;
        this.route.data.subscribe((data) => {
            this.receiptDetail = data.payment ? data.payment.PaymentDetail || {} as Receipt : {} as Receipt;
            this.recieptStatus = data.payment.master.ReceiptStatus;
            this.invoiceStatus = data.payment.master.InvoiceStatus;
            this.receiveType = data.payment.master.ReceiveType;
            this.bankAccount = data.payment.master.BankAccount;
            this.UserName = data.payment.master.UserName;
            this.ReceiveTypeCash = data.payment.master.ReceiveTypeCash;
            this.EnableReceiptDateFlag = data.payment.master.EnableReceiptDateFlag;
            this.PrePayFlag = data.payment.master.PrePayFlag;
            this.IsPermissionWaive = data.payment.master.IsPermissionWaive;
            this.rebuildForm();
        });

        this.subject
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.calculateMoney();
            }
            );
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

        setTimeout(() => {
            this.ReceiptForm.setControl('AttachmentsForm', this.fb.array(this.receiptDetail.ReceiptAttachment.map((detail) => this.createAttachmentForm(detail))))
            this.checkReceiptAttachment();
        }, 300);

        if (this.editMode) {
            this.ReceiptForm.controls.ReceiptDate.disable({ emitEvent: false });
        }

        this.ReceiptForm.controls.BalancePrincipleAmount.setValue(this.sumBalancePrincipleAmount(), { emitEvent: false });
        this.ReceiptForm.controls.LastCurrentPaymentPeriod.setValue(this.sumLastCurrentPaymentPeriod(), { emitEvent: false });

        if (!this.editMode) {
            this.getPayments.push(this.createPaymentForm({} as ReceiptPayment));
        }
        this.checkDefaultPrepayFlag();
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
        var PlanFineAmount = 0;
        var PlanDebtCollectionAmount = 0;

        if (this.getDetails.getRawValue().length > 0) {
            var AmountToBePayFine = this.getDetails.getRawValue().find((x) => { return x.DescriptionEng == 'Fine' }).AmountToBePay;
            var AmountToBePayDebtCollection = this.getDetails.getRawValue().find((x) => { return x.DescriptionEng == 'Debt Collection' }).AmountToBePay;

            var BaseAmountToBePayFine = this.getDetails.getRawValue().find((x) => { return x.DescriptionEng == 'Fine' }).BaseAmountToBePay;
            var BaseAmountToBePayDebtCollection = this.getDetails.getRawValue().find((x) => { return x.DescriptionEng == 'Debt Collection' }).BaseAmountToBePay;

            if (AmountToBePayFine == null || AmountToBePayDebtCollection == null) {
                return;
            }

            if (AmountToBePayFine != BaseAmountToBePayFine) {
                if (AmountToBePayFine <= BaseAmountToBePayFine) {
                    PlanFineAmount = numeral(numeral(AmountToBePayFine).value()).subtract(numeral(BaseAmountToBePayFine).value()).value();
                } else {
                    return;
                }
            }

            if (AmountToBePayDebtCollection != BaseAmountToBePayDebtCollection) {
                if (AmountToBePayDebtCollection <= BaseAmountToBePayDebtCollection) {
                    PlanDebtCollectionAmount = numeral(numeral(AmountToBePayDebtCollection).value()).subtract(numeral(BaseAmountToBePayDebtCollection).value()).value();
                } else {
                    return;
                }
            }
        }

        this.ReceiptForm.setControl('ReceiptDetailsForm', this.fb.array([]));
        let ReceiptNetAmount = 0;
        this.getPayments.getRawValue().map(
            (data) => {
                ReceiptNetAmount = numeral(ReceiptNetAmount).add(data.PaidAmount ? data.PaidAmount : 0).value();
            }
        );
        this.ReceiptForm.controls.ReceiptTotalAmount.setValue(ReceiptNetAmount, { emitEvent: false });

        this.ReceiptForm.controls.AdjustFineAmount.setValue(PlanFineAmount, { emitEvent: false });
        this.ReceiptForm.controls.AdjustDebtCollectionAmount.setValue(PlanDebtCollectionAmount, { emitEvent: false });

        if (this.editMode) {
            this.ReceiptForm.controls.ReceiptDate.disable({ emitEvent: false });
            ReceiptNetAmount = 0;
        }

        this.service.getCalculateProcess(this.ReceiptForm.controls.MainContractHeadID.value, this.ReceiptForm.controls.ReceiptDate.value, ReceiptNetAmount, this.flagPayOff, this.ReceiptForm.controls.PrepayFlag.value, PlanFineAmount, PlanDebtCollectionAmount).pipe(
            finalize(() => {
            }))
            .subscribe((res) => {
                this.ReceiptForm.controls.DocumentType.setValue('RC', { emitEvent: false });

                if (res[0].AlertClosedContract) {
                    this.messegeAlertClosed = res[0].DescriptionTha;
                    this.closeFlagAlertPopup = this.modal.open(this.closeFlagAlert, Size.medium);
                } else {
                    this.ReceiptForm.setControl('ReceiptDetailsForm', this.fb.array(res.map((detail) => this.createDetailForm(detail))));

                    this.ReceiptForm.controls.AccuredPrincipleAmount.setValue(this.sumAccuredPrincipleAmount(), { emitEvent: false });
                    this.ReceiptForm.controls.AccuredInterestAmount.setValue(this.sumAccuredInterestAmount(), { emitEvent: false });
                    this.ReceiptForm.controls.BalancePrincipleAmount.setValue(this.sumBalancePrincipleAmount(), { emitEvent: false });
                    this.ReceiptForm.controls.LastCurrentPaymentPeriod.setValue(this.sumLastCurrentPaymentPeriod(), { emitEvent: false });
                }
            });
    }

    sumTotalAmount() {
        return this.getDetails.getRawValue().map(row => row.AmountToBePay)
            .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }

    // sumRemainAmount() {
    //     return this.getDetails.getRawValue().filter((row) => row.DescriptionEng != 'Advance').map(row => row.AmountPaid)
    //         .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    // }

    sumTotalPaymentAmount() {
        return this.getDetails.getRawValue().map(row => row.AmountOfPayment)
            .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }

    sumAccuredPrincipleAmount() {
        return this.getDetails.getRawValue().map(row => row.AccuredPrincipleAmount)
            .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }

    sumAccuredInterestAmount() {
        return this.getDetails.getRawValue().map(row => row.AccuredInterestAmount)
            .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }

    sumBalancePrincipleAmount() {
        return this.getDetails.getRawValue().map(row => row.BalancePrincipleAmount)
            .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }

    sumLastCurrentPaymentPeriod() {
        return this.getDetails.getRawValue().map(row => row.LastCurrentPaymentPeriod)
            .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
    }

    prepareSave(values: Object) {
        Object.assign(this.receiptDetail, values);

        const receiptDetails = this.getDetails.getRawValue();
        Object.assign(this.receiptDetail.ReceiptDetails, receiptDetails);

        this.receiptDetail.ReceiptPayment = [];
        const paymentDetails = this.getPayments.getRawValue();
        Object.assign(this.receiptDetail.ReceiptPayment, paymentDetails);

        // -----------------------------------------------------receiptAttachments--------------------------------------------------------
        this.receiptDetail.ReceiptAttachment = [];
        const attachments = this.getAttachments.getRawValue();
        //add
        const adding = attachments.filter(function (item) {
            return item.RowState == RowState.Add;
        });
        //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
        this.receiptDetail.ReceiptAttachment.map(attach => {
            return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).find((item) => {
                return attach.ReceiptAttachmentId == item.ReceiptAttachmentId
            }));
        })
        this.receiptDetail.ReceiptAttachment = this.receiptDetail.ReceiptAttachment.filter(item => item.RowState !== RowState.Normal && item.RowState !== RowState.Add).concat(adding);

        delete this.receiptDetail['ReceiptDetailsForm'];
        delete this.receiptDetail['PaymentForm'];
        delete this.receiptDetail['AttachmentsForm'];
    }

    onSubmit() {
        this.saving = true;
        this.prepareSave(this.ReceiptForm.getRawValue());
        this.service.saveReceipt(this.receiptDetail).pipe(
            switchMap(() => this.service.generateContractPeriod(this.ReceiptForm.controls.MainContractHeadID.value)),
            switchMap(() => this.service.getLoanDetail(this.ReceiptForm.controls.MainContractHeadID.value, true)),
            finalize(() => {
                this.saving = false;
                this.submitted = false;
            }))
            .subscribe((res: Receipt) => {
                this.receiptDetail = res;
                this.editMode = true;
                this.rebuildForm();
                this.closeConfirm();
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

    confirmPayOff() {
        this.closeModalFlagAlert();
        this.ReceiptForm.markAsPristine();
        this.flagPayOff = '2';

        this.router.navigate(['/lo/lots08/detail', { MainContractHeadID: this.ReceiptForm.controls.MainContractHeadID.value, FlagPayOff: this.flagPayOff }], {
            skipLocationChange: true
        });
    }

    closeModalFlagAlert() {
        this.getPayments.removeAt(0);
        this.getPayments.push(this.createPaymentForm({} as ReceiptPayment));
        this.closeFlagAlertPopup.hide();
    }

    checkDefaultPrepayFlag() {
        this.service.CheckDefaultPrepayFlag(this.ReceiptForm.controls.MainContractHeadID.value, this.ReceiptForm.controls.ReceiptDate.value).pipe(
            finalize(() => {
            }))
            .subscribe(
                (res: DefaultPrepay) => {
                    if (res.ContractPolicy != '') {
                        this.ContractPolicyMessege = res.ContractPolicy;
                    }
                }
            );
    }

    openConfirmPopup(content) {
        this.submitted = true;
        if (this.ReceiptForm.invalid) {
            this.focusToggle = !this.focusToggle;
            return;
        }

        const now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
        if (this.ReceiptForm.controls.ReceiptDate.value.getTime() != now.getTime()) {
            if (this.EnableReceiptDateFlag == '1') {
                this.as.warning('', 'Message.LO00051');
                return;
            }
        }

        if (this.ReceiptForm.controls.ReceiptType.value == '2' &&
            this.sumTotalAmount() != this.ReceiptForm.controls.ReceiptTotalAmount.value) {
            this.as.warning('', 'Message.STD00021', ['Label.LOTS08.PaymentAmount', 'Label.LOTS08.AmountToBePaid']);
            return;
        }

        if (this.ReceiptForm.controls.ReceiptType.value == '2') {
            this.ReceiptForm.controls.PrepayFlag.setValue('1', { emitEvent: false });
        }

        this.confirmPopup = this.modal.open(content, Size.large);
    }

    closeConfirm() {
        this.confirmPopup.hide();
    }

    addAttachment() {
        this.getAttachments.markAsDirty();
        this.getAttachments.push(this.createAttachmentForm({} as ReceiptAttachment));
    }

    removeAttachment(index) {
        this.attachmentFiles.splice(index, 1);
        let detail = this.getAttachments.at(index) as FormGroup;
        if (detail.controls.RowState.value !== RowState.Add) {
            //เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete 
            const deleting = this.receiptDetail.ReceiptAttachment.find(item =>
                item.ReceiptAttachmentId == detail.controls.ReceiptAttachmentId.value
            )
            deleting.RowState = RowState.Delete;
        }

        const rows = [...this.getAttachments.getRawValue()];
        rows.splice(index, 1);

        //--ลบข้อมูลrecordนี้ออกจาก formarray
        this.getAttachments.patchValue(rows, { emitEvent: false });
        this.getAttachments.removeAt(this.getAttachments.length - 1);
        this.getAttachments.markAsDirty();
        //---------------------------------
        this.checkReceiptAttachment();
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

    fileNameReturn(filename, index) {
        let form = this.getAttachments.controls[index] as FormGroup;
        form.controls.FileName.setValue(filename);
    }
}
