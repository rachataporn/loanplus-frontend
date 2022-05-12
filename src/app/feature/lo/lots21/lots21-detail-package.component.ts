import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService, AuthService } from '@app/core';
import { ModalService, RowState, Page, SelectFilterService, Size, ModelRef } from '@app/shared';
import { Category } from '@app/shared/service/configuration.service';
import { finalize, switchMap } from 'rxjs/operators';
import { Lots21Service, PackageDetail, Package, TrackingDocumentAttachment } from './lots21.service';
import { Attachment } from '@app/shared/attachment/attachment.model';
@Component({
  templateUrl: './lots21-detail-package.component.html'
})
export class Lots21DetailPackageComponent implements OnInit {
  popup: ModelRef;
  DisbursementForm: FormGroup;
  PackageForm: FormGroup;
  TrackingDoc: PackageDetail[] = [];
  packageList: Package = {} as Package;
  page = new Page();
  AttachmentDoc: TrackingDocumentAttachment[] = [];
  attachmentFiles: Attachment[] = [];
  attachmentDeleting = [];
  category = Category.TrackingDocument;
  Companies = [];
  CompaniesDes = [];
  packageStatus = [];
  transport = [];
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  loadingMasterCustomer: boolean;
  contractHeadId: number;
  count = 0;
  deleting = [];
  disablePackageNo = true;

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
    this.PackageForm = this.fb.group({
      TrackingDocumentPackageId: null,
      TransportCode: [null, Validators.required],
      PackageNo: [null, Validators.required],
      TransportCodeModal: [null, Validators.required],
      TransportName: null,
      PackageNoModal: [null, Validators.required],
      CompanySource: null,
      CompanyDestination: [null, Validators.required],
      PackageStatus: 'P',
      PackagePrepareDate: new Date(),
      PackageSendDate: null,
      PackageReceiveDate: null,
      MainContractNo: null,
      MainContractHeadId: null,
      RefNo: 'AUTO',
      PackageDetail: this.fb.array([]),
      TrackingDocumentAttachment: this.fb.array([]),
    });
  }


  contractTrackingDocumentForm(item: PackageDetail): FormGroup {
    let fg = this.fb.group({
      TrackingDocumentPackageDetailId: null,
      TrackingDocumentPackageId: null,
      TrackingDocumentId: null,
      MainContractHeadId: null,
      MainContractNo: null,
      ContractType: null,
      CustomerName: null,
      Status: null,
      ReqDoumentStatus: null,
      ReqDocumentDate: null,
      RowState: RowState.Add,
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
    return fg;
  }

  get contractTrackingDocument(): FormArray {
    return this.PackageForm.get('PackageDetail') as FormArray;
  }

  contractAttachmentsForm(item: TrackingDocumentAttachment): FormGroup {
    let fg = this.fb.group({
      TrackingDocumentAttachmentId: null,
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

  get contractAttachments(): FormArray {
    return this.PackageForm.get('TrackingDocumentAttachment') as FormArray;
  }

  addAttachment() {
    this.contractAttachments.markAsDirty();
    this.contractAttachments.push(this.contractAttachmentsForm({} as TrackingDocumentAttachment));
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
    this.PackageForm.markAsDirty();

    this.checkContractAttachment();
  }

  checkContractAttachment() {
    this.contractAttachments.enable();
    for (let i = 0; i < this.contractAttachments.length; i++) {
      let form = this.contractAttachments.controls[i] as FormGroup;
      if (form.controls.TrackingDocumentAttachmentId.value) {
        form.controls.AttachmentId.disable({ emitEvent: false });
        form.controls.Remark.disable({ emitEvent: false });
      }
    }
  }

  fileNameReturn(filename, index) {
    let form = this.contractAttachments.controls[index] as FormGroup;
    form.controls.FileName.setValue(filename);
  }


  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.packageList = data.Lots21.packageDetail;
      this.packageStatus = data.Lots21.master.StatusPackage;
      this.transport = data.Lots21.master.Transport;
    });

    this.getCompany();
    this.rebuildForm();
    this.getCompanyDes();
  }

  rebuildForm() {
    this.PackageForm.controls.CompanySource.setValue(this.auth.company);
    if (this.packageList.TrackingDocumentPackageId) {
      this.PackageForm.disable({ emitEvent: false });
      this.PackageForm.markAsPristine();
      this.PackageForm.patchValue(this.packageList);
      this.PackageForm.setControl('PackageDetail', this.fb.array(this.packageList.PackageDetail.map((detail) => this.contractTrackingDocumentForm(detail))))
      this.PackageForm.setControl('TrackingDocumentAttachment', this.fb.array(this.packageList.TrackingDocumentAttachment.map((detail) => this.contractAttachmentsForm(detail))))
      this.disablePackageNo = false;
      if (this.PackageForm.controls.TransportCode.value) {
        const data = this.transport.find(data => data.Value == this.PackageForm.controls.TransportCode.value);
        this.PackageForm.controls.TransportName.setValue(data.TextTha);
      }
      this.checkContractAttachment();
    } else {
      this.PackageForm.controls.CompanyDestination.enable({ emitEvent: false });
      this.PackageForm.controls.PackageReceiveDate.enable({ emitEvent: false });
    }
  }

  getCompany() {
    this.is.getCompany().pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.Companies = res;
        });
  }

  getCompanyDes() {
    this.is.getCompanyDes(this.PackageForm.controls.CompanySource.value, this.page).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.CompaniesDes = res.Rows;
        });
  }

  loanDetailOutput(loanDetail) {
    this.loadingMasterCustomer = false;
    if (loanDetail != undefined) {
      this.is.getDisContractDetail(loanDetail)
        .pipe(finalize(() => {
          this.loadingMasterCustomer = false;
        }))
        .subscribe(
          (res: any) => {
            this.contractTrackingDocument.value();
          });
    }
  }

  edit(id, TrackingDocumentId) {
    this.router.navigate(['/lo/lots21/detail/document', { id: id, TrackingDocumentId: TrackingDocumentId, backToPage: '/lo/lots21' }], { skipLocationChange: true });
  }

  back() {
    this.router.navigate(['lo/lots21'], { skipLocationChange: true });
  }


  get getPackageStatus() {
    return this.packageStatus.find((item) => { return item.Value == this.PackageForm.controls['PackageStatus'].value });
  }

  linkContractDetail(id?: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots03' }], { skipLocationChange: true }));
    window.open(url, '_blank');
  }

  openModal(content) {
    this.popup = this.modal.open(content, Size.large);
  }

  closeModal() {
    this.popup.hide();
  }
}
