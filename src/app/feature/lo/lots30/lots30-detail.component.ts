import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, AuthService, LangService } from '@app/core';
import { CashSubmitAttachment, CashSubmitDetail, CashSubmitHead, Lots30Service } from '@app/feature/lo/lots30/lots30.service';
import { Page, RowState } from '@app/shared';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category } from '@app/shared/service/configuration.service';
import * as numeral from 'numeral';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  templateUrl: './lots30-detail.component.html'
})

export class Lots30DetailComponent implements OnInit {
  CashSubmitForm: FormGroup;
  Companies = [];
  BankAccount = [];
  submitted: boolean;
  focusToggle: boolean;
  saving: boolean;
  isSuperUser: boolean;
  statusPage: boolean;
  checkFullAmount: false;
  checkSelect: boolean;
  page = new Page();
  subject: Subject<any> = new Subject();
  CashSubmitHead: CashSubmitHead = {} as CashSubmitHead;
  attachmentFiles: Attachment[] = [];
  cashSubmitStatus = [];
  category = Category.CashSubmitAttachment;
  cashSubmitAttachmentDeleting: CashSubmitAttachment[] = [];
  DepositTypeList = [];

  constructor(
    private fb: FormBuilder,
    private lots30: Lots30Service,
    public lang: LangService,
    private as: AlertService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.CashSubmitForm = this.fb.group({
      CashSubmitHeadId: null,
      CashSubmitNo: [{ value: 'AUTO', disabled: true }],
      CashSubmitDate: [{ value: new Date(), disabled: true }],
      CompanyCode: [{ value: null, disabled: true }],
      OfferAmount: null,
      NetAmount: [{ value: null, disabled: true }],
      CashSubmitStatus: null,
      CashSubmitRemark: null,
      CashSubmitVerifiedBy: null,
      CashSubmitVerifiedDate: null,
      CompanyAccountId: null,
      AccountNo: [null, Validators.required],
      BankCode: null,
      BankName: [{ value: null, disabled: true }],
      BranchName: [{ value: null, disabled: true }],
      RowVersion: null,
      AmountCarried: [{ value: null, disabled: true }],
      CashSubmitDetailForm: this.fb.array([]),
      CashSubmitAttachmentsForm: this.fb.array([]),
      DepositType: [null, Validators.required],
      RemarkBranch: [{ value: null, disabled: true }],
      RemarkAccount: null,
      SubmitTime: [{ value: null, disabled: true }],
    });

    this.CashSubmitForm.controls.OfferAmount.valueChanges.subscribe(
      (value) => {
        if (value > 0) {
          this.summaryNetAmount();
        }
      }
    );
  }

  createCashSubmitDetailForm(item: CashSubmitDetail): FormGroup {
    let fg = this.fb.group({
      guid: Math.random().toString(),//important for tracking change
      CashSubmitDetailId: null,
      CashSubmitHeadId: null,
      ContractHeadId: null,
      ContractNo: null,
      ReceiptHeadId: null,
      ReceiptNo: null,
      ReceiptAmount: null,
      IsSubmitFull: [{ value: null, disabled: true }],
      SubmitAmount: [{ value: null, disabled: true }, [Validators.required, Validators.min(1), Validators.max(item.ReceiptAmount)]],
      IsSelectRow: null,
      AmountCarried: null,
      RowState: RowState.Add,
      RowVersion: null,
      ReceiptDate : null,
      FlagDate : null
    });
    fg.patchValue(item, { emitEvent: false });

    fg.controls.SubmitAmount.valueChanges.subscribe(
      (value) => {
        if (value >= 0) {
          this.summaryNetAmount();

          if (value == fg.controls.ReceiptAmount.value) {
            fg.controls.IsSubmitFull.setValue(true);
            fg.controls.SubmitAmount.disable({ emitEvent: false });
          }
        }
      }
    );

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )
    return fg;
  }

  createAttachmentForm(item: CashSubmitAttachment): FormGroup {
    let fg = this.fb.group({
      guid: Math.random().toString(),//important for tracking change
      CashSubmitAttachmentId: 0,
      FileName: null,
      AttachmentId: [null, Validators.required],
      Description: null,
      RowState: RowState.Add,
      IsDisableAttachment: null,
      RowVersion: null
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

  get getCashSubmitDetails(): FormArray {
    return this.CashSubmitForm.get('CashSubmitDetailForm') as FormArray;
  }

  get getCashSubmitAttachments(): FormArray {
    return this.CashSubmitForm.get('CashSubmitAttachmentsForm') as FormArray;
  };

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.Companies = data.lots30.company;
      this.cashSubmitStatus = data.lots30.master.CashSubmitStatus;
      this.BankAccount = data.lots30.master.BankAccount;
      this.CashSubmitHead = data.lots30.CashSubmitDetail;
      this.DepositTypeList = data.lots30.master.DepositType;
      this.rebuildForm();
    });
  }

  rebuildForm() {
    this.CashSubmitForm.markAsPristine();
    this.CashSubmitForm.patchValue(this.CashSubmitHead);

    this.CashSubmitForm.setControl('CashSubmitDetailForm', this.fb.array(this.CashSubmitHead.CashSubmitDetail.map((detail) => this.createCashSubmitDetailForm(detail))));

    if (this.CashSubmitForm.controls.CashSubmitStatus.value == '1') {
      this.checkDisableCashSubmitDetail();
    }

    setTimeout(() => {
      this.CashSubmitForm.setControl('CashSubmitAttachmentsForm', this.fb.array(this.CashSubmitHead.CashSubmitAttachment.map((detail) => this.createAttachmentForm(detail))))
      this.checkReceiptAttachment();
    }, 300);

    this.CashSubmitForm.disable({ emitEvent: false });
    if (this.CashSubmitForm.controls.CashSubmitStatus.value == '1') {
      this.CashSubmitForm.controls.RemarkAccount.enable({ emitEvent: false });
    }
  }

  get getCashSubmitStatus() {
    return this.cashSubmitStatus.find((item) => { return item.Value == this.CashSubmitForm.controls['CashSubmitStatus'].value });
  };

  checkDisableRow(index) {
    let form = this.getCashSubmitDetails.controls[index] as FormGroup;
    if (form.controls.CashSubmitDetailId.value != 0 && !form.controls.IsSelectRow.value) {
      form.controls.RowState.setValue(RowState.Delete);
    } else if (form.controls.CashSubmitDetailId.value != 0 && form.controls.IsSelectRow.value) {
      form.controls.RowState.setValue(RowState.Edit);
    }

    if (form.controls.IsSelectRow.value) {
      form.controls.IsSubmitFull.enable({ emitEvent: false });
      form.controls.SubmitAmount.enable({ emitEvent: false });
    } else {
      form.controls.IsSubmitFull.setValue(false);
      form.controls.IsSubmitFull.disable({ emitEvent: false });
      form.controls.SubmitAmount.setValue(0);
      form.controls.SubmitAmount.disable({ emitEvent: false });
    }
  }

  checkIsSubmitFull(row, index) {
    let form = this.getCashSubmitDetails.controls[index] as FormGroup;
    if (form.controls.IsSubmitFull.value) {
      form.controls.SubmitAmount.setValue(row.ReceiptAmount);
      form.controls.SubmitAmount.disable({ emitEvent: false });
    } else {
      form.controls.SubmitAmount.setValue(0);
      form.controls.SubmitAmount.enable({ emitEvent: false });
    }
  }

  checkDisableCashSubmitDetail() {
    this.getCashSubmitDetails.enable();
    for (let i = 0; i < this.getCashSubmitDetails.length; i++) {
      let form = this.getCashSubmitDetails.controls[i] as FormGroup;
      if (form.controls.CashSubmitDetailId.value != 0 && form.controls.IsSelectRow.value) {
        if (form.controls.IsSubmitFull.value) {
          form.controls.SubmitAmount.disable({ emitEvent: false });
        } else {
          form.controls.IsSubmitFull.enable({ emitEvent: false });
          form.controls.SubmitAmount.enable({ emitEvent: false });
        }
      } else {
        form.controls.IsSubmitFull.disable({ emitEvent: false });
        form.controls.SubmitAmount.disable({ emitEvent: false });
      }
    }
  }

  summaryReceiptAmount() {
    return this.getCashSubmitDetails.getRawValue().map(row => row.ReceiptAmount)
      .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
  }

  summarySubmitAmount() {
    return this.getCashSubmitDetails.getRawValue().map(row => row.SubmitAmount)
      .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
  }

  summaryAmountCarried() {
    return this.getCashSubmitDetails.getRawValue().map(row => row.AmountCarried)
      .reduce((res, cell) => res = numeral(Number(res)).add(Number(cell)).value(), 0);
  }

  summaryNetAmount() {
    var OfferAmount = 0;
    if (this.CashSubmitForm.controls.OfferAmount.value && this.CashSubmitForm.controls.OfferAmount.value > 0) {
      OfferAmount = this.CashSubmitForm.controls.OfferAmount.value;
    }
    var netAmount = numeral(this.summarySubmitAmount()).add(OfferAmount).value();
    this.CashSubmitForm.controls.NetAmount.setValue(netAmount);
  }

  prepareSave(values: Object) {
    Object.assign(this.CashSubmitHead, values);

    this.CashSubmitHead.CashSubmitDetail = [];
    const cashSubmitDetail = this.getCashSubmitDetails.getRawValue().filter(x => x.IsSelectRow == true || (x.CashSubmitDetailId > 0 && x.IsSelectRow == false));
    Object.assign(this.CashSubmitHead.CashSubmitDetail, cashSubmitDetail);

    // -----------------------------------------------------receiptAttachments--------------------------------------------------------
    this.CashSubmitHead.CashSubmitAttachment = [];
    const attachments = this.getCashSubmitAttachments.getRawValue();
    //add
    const adding = attachments.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.CashSubmitHead.CashSubmitAttachment.map(attach => {
      return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).find((item) => {
        return attach.CashSubmitAttachmentId == item.CashSubmitAttachmentId
      }));
    })
    this.CashSubmitHead.CashSubmitAttachment = this.CashSubmitHead.CashSubmitAttachment.filter(item => item.RowState !== RowState.Add).concat(adding);
    this.CashSubmitHead.CashSubmitAttachment = this.CashSubmitHead.CashSubmitAttachment.concat(this.cashSubmitAttachmentDeleting);

    delete this.CashSubmitHead['CashSubmitDetailForm'];
    delete this.CashSubmitHead['CashSubmitAttachmentsForm'];
    this.cashSubmitAttachmentDeleting = [];
  }

  onSubmit(flagApprove) {
    this.submitted = true;
    if (this.CashSubmitForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.CashSubmitHead.FlagApprove = flagApprove;

    this.saving = true;
    this.prepareSave(this.CashSubmitForm.getRawValue());
    this.lots30.saveCashSubmit(this.CashSubmitHead).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: CashSubmitHead) => {
        console.log(res);

        this.CashSubmitHead = res;
        this.rebuildForm();
        this.as.success('', 'Message.STD00006');
      });
  }

  back() {
    this.router.navigate(['lo/lots30'], { skipLocationChange: true });
  }

  fileNameReturn(filename, index) {
    let form = this.getCashSubmitAttachments.controls[index] as FormGroup;
    form.controls.FileName.setValue(filename);
  }

  addAttachment() {
    this.getCashSubmitAttachments.markAsDirty();
    this.getCashSubmitAttachments.push(this.createAttachmentForm({} as CashSubmitAttachment));
  }

  removeAttachment(index) {
    this.attachmentFiles.splice(index, 1);

    const detail = this.getCashSubmitAttachments.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      detail.controls.RowState.setValue(RowState.Delete, { emitEvent: false })
      this.cashSubmitAttachmentDeleting.push(detail.getRawValue());
    }

    const rows = [...this.getCashSubmitAttachments.getRawValue()];
    rows.splice(index, 1);

    this.getCashSubmitAttachments.patchValue(rows, { emitEvent: false });
    this.getCashSubmitAttachments.removeAt(this.getCashSubmitAttachments.length - 1);
    this.getCashSubmitAttachments.markAsDirty();

    this.checkReceiptAttachment();
  }

  checkReceiptAttachment() {
    this.getCashSubmitAttachments.enable();
    for (let i = 0; i < this.getCashSubmitAttachments.length; i++) {
      let form = this.getCashSubmitAttachments.controls[i] as FormGroup;
      if (form.controls.CashSubmitAttachmentId.value != 0) {
        form.controls.AttachmentId.disable({ emitEvent: false });
        form.controls.Description.disable({ emitEvent: false });
      }
    }
  }
}
