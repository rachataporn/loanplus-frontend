import value from '*.json';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService, AuthService } from '@app/core';
import { ModalService, RowState, Page, SelectFilterService, Size } from '@app/shared';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category } from '@app/shared/service/configuration.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lots23Service, SecuritiesOwner, SecuritiesOwnerDeadAttachment } from './lots23.service';
import { Lots23BorrowerLookupComponent } from './lots23-borrower-lookup.component';

@Component({
  templateUrl: './lots23-detail.component.html'
})
export class Lots23DetailComponent implements OnInit {

  DetailOwnerForm: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  loadingMasterCustomer: Boolean = false;
  attachmentFiles: Attachment[] = [];
  attachmentFiles2: Attachment[] = [];
  category = Category.TrackingDocument;
  detailOwnerList: SecuritiesOwner = {} as SecuritiesOwner;
  Lots23BorrowerLookupContent = Lots23BorrowerLookupComponent;
  statusReq = [];
  Companies = [];
  ContractNo: any[];
  contractNoList: any[];
  now = new Date();
  attachmentDeleting = [];
  isDisableAttachment: boolean = false;
  docStatusList = [];
  ContractAttachment = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private is: Lots23Service,
    public lang: LangService
  ) {
    this.createForm();
  }

  createForm() {
    this.DetailOwnerForm = this.fb.group({
      SecuritiesOwnerDeadId: null,
      MainContractHeadId: null,
      ReqCode: 'AUTO',
      ReqCreatedDate: null,
      ReqStatus: '1',
      Borrower: [null, Validators.required],
      MainContractNo: [null, Validators.required],
      OwnerDeadDate: [null, Validators.required],
      DocStatus: ['', Validators.required],
      CustomerCode: null,
      SecuritiesOwnerDeadAttachment: this.fb.array([]),
      DeadRemark: null,
      ContractAttachment: this.fb.array([])
    });
  }


  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.statusReq = data.Lots23.master.ReqStatus;
      this.docStatusList = data.Lots23.master.SearchDocStatusList;

      if (data.Lots23.securitiesOwnerDeadDetail.SecuritiesOwnerDead) {
        this.detailOwnerList = data.Lots23.securitiesOwnerDeadDetail.SecuritiesOwnerDead;
      }
      this.ContractAttachment = data.Lots23.securitiesOwnerDeadDetail.ContractAttachment ? data.Lots23.securitiesOwnerDeadDetail.ContractAttachment : [];

      // this.detailOwnerList = data.Lots23.securitiesOwnerDeadDetail;
    });

    if (this.detailOwnerList.SecuritiesOwnerDeadId) {
      this.loanDetailOutput(this.detailOwnerList.CustomerCode);
    }
    this.rebuildForm();

  }

  rebuildForm() {

    this.DetailOwnerForm.disable({ emitEvent: false })
    this.DetailOwnerForm.controls.ReqStatus.enable({ emitEvent: false })
    this.DetailOwnerForm.controls.Borrower.enable({ emitEvent: false })
    this.DetailOwnerForm.controls.MainContractNo.enable({ emitEvent: false })
    this.DetailOwnerForm.controls.OwnerDeadDate.enable({ emitEvent: false })
    this.DetailOwnerForm.controls.ReqCreatedDate.setValue(this.now);

    if (this.detailOwnerList.SecuritiesOwnerDeadId) {
      this.DetailOwnerForm.markAsPristine();
      this.DetailOwnerForm.patchValue(this.detailOwnerList);
      this.DetailOwnerForm.disable({ emitEvent: false })

      this.DetailOwnerForm.setControl('SecuritiesOwnerDeadAttachment', this.fb.array(this.detailOwnerList.SecuritiesOwnerDeadAttachment.map((detail) => this.contractAttachmentsForm(detail))))
      this.checkContractAttachment();

      this.DetailOwnerForm.setControl('ContractAttachment', this.fb.array(this.ContractAttachment.map((detail) => this.contractAttachmentsForm2(detail))))
      this.checkContractAttachment2();

      this.isDisableAttachment = true;
      if (this.DetailOwnerForm.controls.ReqStatus.value == '1') {
        this.DetailOwnerForm.controls.OwnerDeadDate.enable({ emitEvent: false })
        this.DetailOwnerForm.controls.DocStatus.enable({ emitEvent: false })
      }
    }
  }

  contractAttachmentsForm(item: SecuritiesOwnerDeadAttachment): FormGroup {
    let fg = this.fb.group({
      SecuritiesOwnerDeadAttachmentId: null,
      AttachmentId: [null, Validators.required],
      FileName: null,
      Remark: null,
      RowState: RowState.Add,
      IsDisableAttachment: null,
      RowVersion: null,
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

  contractAttachmentsForm2(item: SecuritiesOwnerDeadAttachment): FormGroup {
    let fg = this.fb.group({
      SecuritiesOwnerDeadAttachmentId: null,
      AttahmentId: [null, Validators.required],
      FileName: null,
      Description: null,
      RowState: RowState.Add,
      IsDisableAttachment: null,
      RowVersion: null,
    });
    fg.patchValue(item, { emitEvent: false });

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )
    this.attachmentFiles2.push(new Attachment());
    return fg;
  }

  get contractAttachments(): FormArray {
    return this.DetailOwnerForm.get('SecuritiesOwnerDeadAttachment') as FormArray;
  }

  get contractAttachments2(): FormArray {
    return this.DetailOwnerForm.get('ContractAttachment') as FormArray;
  }

  addAttachment() {
    this.contractAttachments.markAsDirty();
    this.contractAttachments.push(this.contractAttachmentsForm({} as SecuritiesOwnerDeadAttachment));
  }

  removeAttachment(index) {
    const attachment = this.contractAttachments.at(index) as FormGroup;
    if (attachment.controls.RowState.value !== RowState.Add) {
      attachment.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
      this.attachmentDeleting.push(attachment.getRawValue());
    }

    const rows = [...this.contractAttachments.getRawValue()];
    rows.splice(index, 1);

    this.contractAttachments.patchValue(rows, { emitEvent: false });
    this.contractAttachments.removeAt(this.contractAttachments.length - 1);
    this.DetailOwnerForm.markAsDirty();

    this.checkContractAttachment();
  }

  checkContractAttachment() {
    this.contractAttachments.enable();
    for (let i = 0; i < this.contractAttachments.length; i++) {
      let form = this.contractAttachments.controls[i] as FormGroup;
      if (form.controls.AttachmentId.value) {
        form.controls.AttachmentId.disable({ emitEvent: false });
        form.controls.Remark.disable({ emitEvent: false });
      }
    }
  }

  checkContractAttachment2() {
    this.contractAttachments2.enable();
    for (let i = 0; i < this.contractAttachments2.length; i++) {
      let form = this.contractAttachments2.controls[i] as FormGroup;
      if (form.controls.AttahmentId.value) {
        form.controls.AttahmentId.disable({ emitEvent: false });
        form.controls.Description.disable({ emitEvent: false });
      }
    }
  }

  fileNameReturn(filename, index) {
    let form = this.contractAttachments.controls[index] as FormGroup;
    form.controls.FileName.setValue(filename);
  }

  get getStatusReq() {
    return this.statusReq.find((item) => { return item.Value == this.DetailOwnerForm.controls['ReqStatus'].value });
  }

  loanDetailOutput(loanDetail) {
    this.loadingMasterCustomer = false;
    if (loanDetail != undefined) {
      this.is.getBorrowerDetail(loanDetail)
        .pipe(finalize(() => {
          this.loadingMasterCustomer = false;
        }))
        .subscribe(
          (res: any) => {
            this.DetailOwnerForm.controls.CustomerCode.setValue(res.CustomerCode);
            this.DetailOwnerForm.controls.Borrower.setValue(res.CustomerName);
            this.contractNoDetail(res.CustomerCode)
          });
    }
  }

  contractNoDetail(CustomerCode) {
    this.is.getContractNoDetail(CustomerCode)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.contractNoList = res.ContractNoCustomerDto;
        });
  }

  prepareSave(values) {
    Object.assign(this.detailOwnerList, values);
    // const attachments = this.contractAttachments.getRawValue();

    if (this.detailOwnerList.SecuritiesOwnerDeadAttachment != undefined) {
      const beforeAddPayName = this.detailOwnerList.SecuritiesOwnerDeadAttachment.filter((item) => {
        return item.RowState !== RowState.Add;
      });
      this.detailOwnerList.SecuritiesOwnerDeadAttachment = beforeAddPayName;
    }

    if (this.detailOwnerList.SecuritiesOwnerDeadAttachment) {
      const data = values.SecuritiesOwnerDeadAttachment.concat(this.attachmentDeleting);

      this.detailOwnerList.SecuritiesOwnerDeadAttachment.map(detail => {
        return Object.assign(detail, data.find((o) => {
          return o.AttachmentId === detail.AttachmentId;
        }));
      });

      this.add(values);
    } else {
      this.detailOwnerList.SecuritiesOwnerDeadAttachment = [];
      this.add(values);
    }
  }

  add(values) {
    const attachmentAdding = values.SecuritiesOwnerDeadAttachment.filter((item) => {
      return item.RowState === RowState.Add;
    });
    this.detailOwnerList.SecuritiesOwnerDeadAttachment = this.detailOwnerList.SecuritiesOwnerDeadAttachment.concat(attachmentAdding);
    this.detailOwnerList.SecuritiesOwnerDeadAttachment = this.detailOwnerList.SecuritiesOwnerDeadAttachment.concat(this.attachmentDeleting);
    this.attachmentDeleting = [];
  }

  onSubmit() {
    this.submitted = true;
    if (this.DetailOwnerForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.saving = true;
    this.onSave();
  }

  onSave() {
    this.saving = true;
    this.prepareSave(this.DetailOwnerForm.getRawValue());
    this.is.save(this.detailOwnerList, this.attachmentFiles).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: SecuritiesOwner) => {
          this.detailOwnerList = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        });
  }


  tabSelected(tabIndex) {
    // setTimeout(this.triggerResize.bind(this), 1);
  }

  back() {
    this.router.navigate(['lo/lots23'], { skipLocationChange: true });
  }


}
