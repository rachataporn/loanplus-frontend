import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, AuthService, LangService, SaveDataService } from '@app/core';
import { ModalService, ModelRef, Page, RowState, SelectFilterService, Size } from '@app/shared';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category } from '@app/shared/service/configuration.service';
import { finalize } from 'rxjs/operators';
import { Lots20ContractLookupComponent } from './lots20-contract-lookup.component';
import { Lots20Service, Package, PackageDetail, TrackingDocumentAttachment } from './lots20.service';

@Component({
  templateUrl: './lots20-detail.component.html'
})
export class Lots20DetailComponent implements OnInit {

  DetaiTracking: FormGroup;
  TrackingDoc: PackageDetail[] = [];
  page = new Page();
  statusPage: boolean;
  popup: ModelRef;
  packageList: Package = {} as Package;
  packageDetail: PackageDetail = {} as PackageDetail;
  attachmentFiles: Attachment[] = [];
  category = Category.TrackingDocument;
  AttachmentDoc: TrackingDocumentAttachment[] = [];

  attachmentDeleting = [];
  contractHeadId: number;
  Lots20ContractLookupContent = Lots20ContractLookupComponent;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private is: Lots20Service,
    private modal: ModalService,
    public lang: LangService,
    private filter: SelectFilterService,
    private saveData: SaveDataService,
    private auth: AuthService,

  ) {
    this.createForm();
  }

  createForm() {
    this.DetaiTracking = this.fb.group({
      TrackingDocumentId: null,
      MainContractHeadId: null,
      CustomerCode: null,
      MainContractNo: null,
      ContractType: null,
      CustomerName: null,
      ContractStatusTH: null,
      ContractStatusCode: null,
      ReqCompanyDocument: null,
      ReqDocumentTypeCode: null,
      ReqDocumentDate: null,
      ReqReturnDocumentDate: null,
      ReqRemark: null,
      TrackingDocumentAttachment: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
    });
    this.onSearch();
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }


  onSearch() {
    this.is.getSearchTrackingDocList(this.route.snapshot.paramMap.get('ReqCompanyDocument'),this.route.snapshot.paramMap.get('ReqCompanyCreatedDocument'), this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.TrackingDoc = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  updateDetail() {
    this.is.updateDetail(this.packageDetail).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: PackageDetail) => {
          if (res) {
            this.router.navigate(['/lo/lots20/detail/package', { TrackingDocumentPackageId: this.packageDetail.TrackingDocumentPackageId }], { skipLocationChange: true });
          }
        });
  }

  addCreatePackage() {
    this.is.addCreatePackage(this.packageDetail).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: PackageDetail) => {
          if (res) {
            this.router.navigate(['/lo/lots20/detail/package', { TrackingDocumentPackageId: res.TrackingDocumentPackageId }], { skipLocationChange: true });
          }
        });
  }

  back() {
    this.router.navigate(['lo/lots20'], { skipLocationChange: true });
  }

  add(company, TrackingDocumentId, companyDes) {
    this.is.checkPackage(company, companyDes).pipe(
      finalize(() => {
      }))
      .subscribe((res: any) => {
        if (res > 0) {
          this.packageDetail.TrackingDocumentPackageId = res;
          this.packageDetail.TrackingDocumentId = TrackingDocumentId;
          this.modal.confirm("มีรายการเตรียมพัสดุของสาขานี้แล้ว ต้องการเพิ่มรายการลงในพัสดุหรือไม่?").subscribe(
            (res) => {
              if (res) {
                this.updateDetail();
              }
            })

        } else {
          this.packageList.CompanyDestination = company;
          this.packageDetail.TrackingDocumentId = TrackingDocumentId;
          this.addCreatePackage();
        }
      });
  }
  edit(TrackingDocumentPackageId) {
    this.router.navigate(['/lo/lots20/detail/package', { TrackingDocumentPackageId: TrackingDocumentPackageId }], { skipLocationChange: true });
  }
  linkContractDetail(id?: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots03' }], { skipLocationChange: true }));
    window.open(url, '_blank');
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
    return this.DetaiTracking.get('TrackingDocumentAttachment') as FormArray;
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
    this.DetaiTracking.markAsDirty();

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

  openModal(content, TrackingDocumentId) {
    this.is.getSearchTrackingAttachment(TrackingDocumentId).pipe(
      finalize(() => {
      }))
      .subscribe((res: Package) => {
        this.popup = this.modal.open(content, Size.large);
        this.packageList = res;
        this.DetaiTracking.markAsPristine();
        this.DetaiTracking.patchValue(this.packageList);
        this.DetaiTracking.setControl('TrackingDocumentAttachment', this.fb.array(this.packageList.TrackingDocumentAttachment.map((detail) => this.contractAttachmentsForm(detail))))
        this.checkContractAttachment();
      });
  }
  closeModal() {
    this.popup.hide();
  }
}
