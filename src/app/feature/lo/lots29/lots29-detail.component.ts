import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, AuthService, LangService } from '@app/core';
import { CashSubmitAttachment, CashSubmitDetail, CashSubmitHead, Lots29Service, ReportParam } from '@app/feature/lo/lots29/lots29.service';
import { Page, RowState } from '@app/shared';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category } from '@app/shared/service/configuration.service';
import * as moment from 'moment';
import * as numeral from 'numeral';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  templateUrl: './lots29-detail.component.html'
})

export class Lots29DetailComponent implements OnInit {
  CashSubmitForm: FormGroup;
  Companies = [];
  BankAccount = [];
  Hour = [
    { Value: '00', Text: '00', Active: true },
    { Value: '01', Text: '01', Active: true },
    { Value: '02', Text: '02', Active: true },
    { Value: '03', Text: '03', Active: true },
    { Value: '04', Text: '04', Active: true },
    { Value: '05', Text: '05', Active: true },
    { Value: '06', Text: '06', Active: true },
    { Value: '07', Text: '07', Active: true },
    { Value: '08', Text: '08', Active: true },
    { Value: '09', Text: '09', Active: true },
    { Value: '10', Text: '10', Active: true },
    { Value: '11', Text: '11', Active: true },
    { Value: '12', Text: '12', Active: true },
    { Value: '13', Text: '13', Active: true },
    { Value: '14', Text: '14', Active: true },
    { Value: '15', Text: '15', Active: true },
    { Value: '16', Text: '16', Active: true },
    { Value: '17', Text: '17', Active: true },
    { Value: '18', Text: '18', Active: true },
    { Value: '19', Text: '19', Active: true },
    { Value: '20', Text: '20', Active: true },
    { Value: '21', Text: '21', Active: true },
    { Value: '22', Text: '22', Active: true },
    { Value: '23', Text: '23', Active: true },
    { Value: '24', Text: '24', Active: true },
  ];
  Minute = [
    { Value: '00', Text: '00', Active: true },
    { Value: '01', Text: '01', Active: true },
    { Value: '02', Text: '02', Active: true },
    { Value: '03', Text: '03', Active: true },
    { Value: '04', Text: '04', Active: true },
    { Value: '05', Text: '05', Active: true },
    { Value: '06', Text: '06', Active: true },
    { Value: '07', Text: '07', Active: true },
    { Value: '08', Text: '08', Active: true },
    { Value: '09', Text: '09', Active: true },
    { Value: '10', Text: '10', Active: true },
    { Value: '11', Text: '11', Active: true },
    { Value: '12', Text: '12', Active: true },
    { Value: '13', Text: '13', Active: true },
    { Value: '14', Text: '14', Active: true },
    { Value: '15', Text: '15', Active: true },
    { Value: '16', Text: '16', Active: true },
    { Value: '17', Text: '17', Active: true },
    { Value: '18', Text: '18', Active: true },
    { Value: '19', Text: '19', Active: true },
    { Value: '20', Text: '20', Active: true },
    { Value: '21', Text: '21', Active: true },
    { Value: '22', Text: '22', Active: true },
    { Value: '23', Text: '23', Active: true },
    { Value: '24', Text: '24', Active: true },
    { Value: '25', Text: '25', Active: true },
    { Value: '26', Text: '26', Active: true },
    { Value: '27', Text: '27', Active: true },
    { Value: '28', Text: '28', Active: true },
    { Value: '29', Text: '29', Active: true },
    { Value: '30', Text: '30', Active: true },
    { Value: '31', Text: '31', Active: true },
    { Value: '32', Text: '32', Active: true },
    { Value: '33', Text: '33', Active: true },
    { Value: '34', Text: '34', Active: true },
    { Value: '35', Text: '35', Active: true },
    { Value: '36', Text: '36', Active: true },
    { Value: '37', Text: '37', Active: true },
    { Value: '38', Text: '38', Active: true },
    { Value: '39', Text: '39', Active: true },
    { Value: '40', Text: '40', Active: true },
    { Value: '41', Text: '41', Active: true },
    { Value: '42', Text: '42', Active: true },
    { Value: '43', Text: '43', Active: true },
    { Value: '44', Text: '44', Active: true },
    { Value: '45', Text: '45', Active: true },
    { Value: '46', Text: '46', Active: true },
    { Value: '47', Text: '47', Active: true },
    { Value: '48', Text: '48', Active: true },
    { Value: '49', Text: '49', Active: true },
    { Value: '50', Text: '50', Active: true },
    { Value: '51', Text: '51', Active: true },
    { Value: '52', Text: '52', Active: true },
    { Value: '53', Text: '53', Active: true },
    { Value: '54', Text: '54', Active: true },
    { Value: '55', Text: '55', Active: true },
    { Value: '56', Text: '56', Active: true },
    { Value: '57', Text: '57', Active: true },
    { Value: '58', Text: '58', Active: true },
    { Value: '59', Text: '59', Active: true },
  ];
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
  reportParam = {} as ReportParam
  now = new Date();

  constructor(
    private fb: FormBuilder,
    private lots29: Lots29Service,
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
      OfferAmount: [{ value: null, disabled: true }],
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
      AmountCarried: [{ value: null, disabled: true }],
      RemarkAccount: [{ value: null, disabled: true }],
      RemarkBranch: null,
      SubmitTimeHour: [null, Validators.required],
      SubmitTimeMinute: [null, Validators.required],
      RowVersion: null,
      DepositType: [null, Validators.required],
      CashSubmitDetailForm: this.fb.array([]),
      CashSubmitAttachmentsForm: this.fb.array([]),
    });
    this.CashSubmitForm.controls.OfferAmount.valueChanges.subscribe(
      (value) => {
        if (value > 0) {
          this.summaryNetAmount();
        }
      }
    );

    this.CashSubmitForm.controls.AccountNo.valueChanges.subscribe(
      (value) => {
        if (value) {
          const Account = this.BankAccount.find((data) => {
            return data.AccountNo == value;
          }) || {};

          this.CashSubmitForm.controls.CompanyAccountId.setValue(Account.CompanyAccountId);
          this.CashSubmitForm.controls.BankCode.setValue(Account.BankCode);
          this.CashSubmitForm.controls.BankName.setValue(Account.Bank);
          this.CashSubmitForm.controls.BranchName.setValue(Account.Branch);
        } else {
          this.CashSubmitForm.controls.CompanyAccountId.setValue(null);
          this.CashSubmitForm.controls.BankCode.setValue(null);
          this.CashSubmitForm.controls.BankName.setValue(null);
          this.CashSubmitForm.controls.BranchName.setValue(null);
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
      SubmitAmount: [{ value: null }, [Validators.required, Validators.min(1), Validators.max(item.ReceiptAmount)]],
      IsSelectRow: null,
      FlagLastRow: null,
      RowState: RowState.Add,
      RowVersion: null,
      ReceiptDate: null,
      AmountCarried: null,
      FlagDate: null,
    });
    fg.patchValue(item, { emitEvent: false });

    fg.controls.SubmitAmount.valueChanges.subscribe(
      (value) => {
        if (value >= 0) {
          this.summaryNetAmount();

          if (value == fg.controls.ReceiptAmount.value) {
            fg.controls.IsSubmitFull.setValue(true);

            if (this.CashSubmitForm.controls.CashSubmitStatus.value != '1' && this.CashSubmitForm.controls.CashSubmitStatus.value != '4') {
              fg.controls.SubmitAmount.disable({ emitEvent: false });
            }
          }

          this.CashSubmitForm.controls.AmountCarried.setValue(this.summaryReceiptAmount() - this.summarySubmitAmount());
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
      this.Companies = data.lots29.company;
      this.cashSubmitStatus = data.lots29.master.CashSubmitStatus;
      this.BankAccount = data.lots29.master.BankAccount;
      this.CashSubmitHead = data.lots29.CashSubmitDetail;
      this.DepositTypeList = data.lots29.master.DepositType;

      this.rebuildForm();
    });
  }

  rebuildForm() {
    this.CashSubmitForm.markAsPristine();
    this.CashSubmitForm.patchValue(this.CashSubmitHead);

    if (!this.CashSubmitHead.RowVersion) {
      this.CashSubmitForm.controls.CompanyCode.setValue(this.auth.company);

      const Account = this.BankAccount.find((data) => {
        return data.CompanyCode == this.CashSubmitForm.controls.CompanyCode.value;
      }) || {};

      this.CashSubmitForm.controls.CompanyAccountId.setValue(Account.CompanyAccountId);
      this.CashSubmitForm.controls.AccountNo.setValue(Account.AccountNo);
      this.CashSubmitForm.controls.BankCode.setValue(Account.BankCode);
      this.CashSubmitForm.controls.BankName.setValue(Account.Bank);
      this.CashSubmitForm.controls.BranchName.setValue(Account.Branch);
      this.CashSubmitForm.controls.OfferAmount.setValue(1000);
    } else {
      this.CashSubmitForm.controls.CompanyAccountId.setValue(this.CashSubmitHead.CompanyAccountId != null ? this.CashSubmitHead.CompanyAccountId : null)

    }

    this.CashSubmitForm.controls.CompanyCode.disable({ emitEvent: false });

    this.CashSubmitForm.setControl('CashSubmitDetailForm', this.fb.array(this.CashSubmitHead.CashSubmitDetail.map((detail) => this.createCashSubmitDetailForm(detail))));

    setTimeout(() => {
      this.CashSubmitForm.setControl('CashSubmitAttachmentsForm', this.fb.array(this.CashSubmitHead.CashSubmitAttachment.map((detail) => this.createAttachmentForm(detail))))
      this.checkReceiptAttachment();
    }, 300);

    if (this.CashSubmitHead.CashSubmitStatus != '1' && this.CashSubmitHead.CashSubmitStatus != '4') {
      this.CashSubmitForm.disable({ emitEvent: false });
    } else {
      this.checkDisableCashSubmitDetail();
      this.checkDisableRow(this.CashSubmitHead.CashSubmitDetail.length - 1);
    }
  }

  get getCashSubmitStatus() {
    return this.cashSubmitStatus.find((item) => { return item.Value == this.CashSubmitForm.controls['CashSubmitStatus'].value });
  };

  checkDisableRow(index) {
    if (this.getCashSubmitDetails.length > 0) {
      let form = this.getCashSubmitDetails.controls[index] as FormGroup;
      if (form.controls.CashSubmitDetailId.value != 0 && !form.controls.IsSelectRow.value) {
        form.controls.RowState.setValue(RowState.Delete);
      } else if (form.controls.CashSubmitDetailId.value != 0 && form.controls.IsSelectRow.value) {
        form.controls.RowState.setValue(RowState.Edit);
      }

      form.controls.IsSubmitFull.enable({ emitEvent: false });
      form.controls.SubmitAmount.enable({ emitEvent: false });
      form.controls.FlagLastRow.setValue(true);
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

  onSubmit() {
    this.submitted = true;
    if (this.CashSubmitForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.getCashSubmitDetails.length <= 0) {
      this.as.warning('', 'ต้องมีรายการใบเสร็จรับเงินอย่างน้อย 1 รายการ');
      return;
    }

    if (this.CashSubmitForm.controls.CashSubmitStatus.value == '4') {
      this.saving = true;
      this.prepareSave(this.CashSubmitForm.getRawValue());
      this.lots29.saveCashSubmit(this.CashSubmitHead).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe((res: CashSubmitHead) => {
          this.CashSubmitHead = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        });
    } else {
      this.lots29.checkCreateCashSubmit()
        .pipe(finalize(() => {
        }))
        .subscribe(
          (res: any) => {
            if (res.CashSubmitNo) {
              this.as.warning('', 'มีรายการเลขที่เอกสาร ' + res.CashSubmitNo + ' ที่ข้อมูลไม่สมบูรณ์ กรุณาดำเนินการให้เรียบร้อยก่อน');
              return;
            } else {
              this.saving = true;
              this.prepareSave(this.CashSubmitForm.getRawValue());
              this.lots29.saveCashSubmit(this.CashSubmitHead).pipe(
                finalize(() => {
                  this.saving = false;
                  this.submitted = false;
                }))
                .subscribe((res: CashSubmitHead) => {
                  this.CashSubmitHead = res;
                  this.rebuildForm();
                  this.as.success('', 'Message.STD00006');
                });
            }
          });
    }
  }

  back() {
    this.router.navigate(['lo/lots29'], { skipLocationChange: true });
  }

  fileNameReturn(filename, index) {
    let form = this.getCashSubmitAttachments.controls[index] as FormGroup;
    form.controls.FileName.setValue(filename);
  }

  addAttachment() {
    if (this.getCashSubmitAttachments.length == 0) {
      this.getCashSubmitAttachments.markAsDirty();
      this.getCashSubmitAttachments.push(this.createAttachmentForm({} as CashSubmitAttachment));
    } else {
      this.as.warning('', 'มีเอกสารแนบได้ 1 รายการ');
    }
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

  onPrint() {
    this.submitted = true;

    this.reportParam.CashSubmitNo = this.CashSubmitForm.controls.CashSubmitNo.value;
    this.reportParam.CompanyCode = this.CashSubmitForm.controls.CompanyCode.value;

    this.lots29.generateReport(this.reportParam).pipe(
      finalize(() => { this.submitted = false; })
    ).subscribe((res) => {
      if (res) {
        this.OpenWindow(res, 'LORP47');
      }
    });
  }

  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + "xlsx" + ";base64," + data;
    doc.download = name + "_" + "Report-" + ((Number(moment(this.now).format('YYYY'))) + "-") + moment(this.now).format('MM-DD') + "." + "xlsx";
    doc.click();
  }
}
