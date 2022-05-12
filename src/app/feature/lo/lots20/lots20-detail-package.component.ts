import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService, AuthService } from '@app/core';
import { ModalService, RowState, Page, SelectFilterService, Size, ModelRef } from '@app/shared';
import { finalize, switchMap } from 'rxjs/operators';
import { Lots20ContractLookupComponent } from './lots20-contract-lookup.component';
import { Lots20Service, PackageDetail, Package, TrackingDocumentAttachment, PackageDetailList } from './lots20.service';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category } from '@app/shared/service/configuration.service';

@Component({
  templateUrl: './lots20-detail-package.component.html'
})
export class Lots20DetailPackageComponent implements OnInit {
  popup: ModelRef;
  // DisbursementForm: FormGroup;
  PackageForm: FormGroup;
  packageList: Package = {} as Package;
  page = new Page();
  pageSearchAttachment = new Page();
  packageDetail: PackageDetail = {} as PackageDetail;
  packageDetailList: PackageDetailList = {} as PackageDetailList;
  attachmentFiles: Attachment[] = [];
  category = Category.TrackingDocument;
  AttachmentDoc: TrackingDocumentAttachment[] = [];

  // now = new Date();

  now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);

  attachmentDeleting = [];
  Companies = [];
  CompaniesDes = [];
  packageStatus = [];
  detailTracking = [];
  transport = [];
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  loadingMasterCustomer: boolean;
  contractHeadId: number;
  count = 0;
  deleting = [];
  disablePackageNo = true;
  isCheckCanEdit: boolean = true;
  companyDashBoard: string;

  lots20ContractLookupContent = Lots20ContractLookupComponent;

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
      MainContractNo: null,
      MainContractHeadId: null,
      ContractType: null,
      CustomerName: null,
      Status: null,
      DocumentStatus: null,
      ReqDocumentDate: null,
      ReqReturnDocumentDate: null,
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

  addTrackingDoc() {
    if (this.PackageForm.controls.CompanySource.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    const data = {
      CompanyDestination: this.PackageForm.controls['CompanyDestination'].value,
      CompanySource: this.PackageForm.controls['CompanySource'].value
    };
    this.modal.openComponent(this.lots20ContractLookupContent, Size.large, data).subscribe(
      (result) => {
        if (result.length > 0) {
          for (const item of result) {
            if (!this.checkDuplicateMenu(item)) {
              this.contractTrackingDocument.markAsDirty();
              this.contractTrackingDocument.push(
                this.contractTrackingDocumentForm(
                  item as PackageDetail));

              this.count += result.length;
            }
          }
        }
      });
  }

  addTrackingDocAuto() {
    if (this.PackageForm.controls.CompanyDestination.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    const data = {
      CompanyDestination: this.PackageForm.controls['CompanyDestination'].value
    };
    this.modal.openComponent(this.lots20ContractLookupContent, Size.large, data).subscribe(
      (result) => {
        if (result.length > 0) {
          for (const item of result) {
            if (!this.checkDuplicateMenu(item)) {
              this.contractTrackingDocument.markAsDirty();
              this.contractTrackingDocument.push(
                this.contractTrackingDocumentForm(
                  item as PackageDetail));

              this.count += result.length;
            }
          }
        }
      });
  }

  checkDuplicateMenu(result) {
    for (const form of this.contractTrackingDocument.value) {
      if (form.TrackingDocumentId === result.TrackingDocumentId) {
        return true;
      }
    }
  }

  remove(index) {
    const detail = this.contractTrackingDocument.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      detail.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
      this.deleting.push(detail.getRawValue());
    }

    const rows = [...this.contractTrackingDocument.getRawValue()];
    rows.splice(index, 1);

    this.contractTrackingDocument.patchValue(rows, { emitEvent: false });
    this.contractTrackingDocument.removeAt(this.contractTrackingDocument.length - 1);
    this.PackageForm.markAsDirty();
  }



  checkContractTrackingDocument() {
    this.contractTrackingDocument.enable();
    for (let i = 0; i < this.contractTrackingDocument.length; i++) {
      let form = this.contractTrackingDocument.controls[i] as FormGroup;
      if (form.controls.TrackingDocumentPackageDetailId.value) {
        if (this.packageList.PackageStatus == 'C' || this.packageList.PackageStatus == 'R') {
          form.controls.ReqReturnDocumentDate.disable({ emitEvent: false });
        } else {
          form.controls.ReqReturnDocumentDate.enable({ emitEvent: false });
        }
      }
    }
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
    this.companyDashBoard = this.route.snapshot.paramMap.get('Company');
    this.route.data.subscribe((data) => {
      this.packageList = data.Lots20.packageDetail;
      this.packageStatus = data.Lots20.master.StatusPackage;
      this.transport = data.Lots20.master.Transport;
    });

    this.getCompany();
    this.rebuildForm();
    this.getCompanyDes();
  }

  rebuildForm() {
    this.PackageForm.disable({ emitEvent: false });
    this.contractAttachments.disable();
    this.contractTrackingDocument.disable();
    this.PackageForm.controls.CompanySource.setValue(this.auth.company);
    if (this.packageList.TrackingDocumentPackageId) {
      this.PackageForm.markAsPristine();
      this.PackageForm.patchValue(this.packageList);

      if (this.packageList.PackageDetail.length > 0) {
        this.PackageForm.setControl('PackageDetail', this.fb.array(this.packageList.PackageDetail.map((detail) => this.contractTrackingDocumentForm(detail))))
      }

      if (this.packageList.TrackingDocumentAttachment.length > 0) {
        this.PackageForm.setControl('TrackingDocumentAttachment', this.fb.array(this.packageList.TrackingDocumentAttachment.map((detail) => this.contractAttachmentsForm(detail))))
      }

      if (this.packageList.PackageStatus == 'P') {
        this.PackageForm.controls.CompanyDestination.enable({ emitEvent: false });
        this.checkContractTrackingDocument();

      } else {
        this.checkContractTrackingDocument();
        this.checkContractAttachment();
      }

      this.disablePackageNo = false;
      if (this.PackageForm.controls.TransportCode.value) {
        const data = this.transport.find(data => data.Value == this.PackageForm.controls.TransportCode.value);
        this.PackageForm.controls.TransportName.setValue(data.TextTha);
      }

      this.IsCheckCanEdit();
    } else {
      this.PackageForm.controls.CompanyDestination.enable({ emitEvent: false });
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
    this.page.index
    this.is.getCompanyDes(this.PackageForm.controls.CompanySource.value, this.page).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.CompaniesDes = res.Rows;
        });
  }

  prepareSave(values) {
    Object.assign(this.packageList, values);
    if (this.packageList.PackageDetail != undefined) {
      const beforeAddPayName = this.packageList.PackageDetail.filter((item) => {
        return item.RowState !== RowState.Add;
      });
      this.packageList.PackageDetail = beforeAddPayName;
    }
    if (this.packageList.PackageDetail) {
      const data = values.PackageDetail.concat(this.deleting);

      this.packageList.PackageDetail.map(detail => {
        return Object.assign(detail, data.find((o) => {
          return o.TrackingDocumentId === detail.TrackingDocumentId && o.TrackingDocumentPackageDetailId === detail.TrackingDocumentPackageDetailId;
        }));
      });
      this.add(values);
    } else {
      this.packageList.PackageDetail = [];
      this.add(values);
    }


    if (this.packageList.TrackingDocumentAttachment != undefined) {
      const beforeAddPayName = this.packageList.TrackingDocumentAttachment.filter((item) => {
        return item.RowState !== RowState.Add;
      });
      this.packageList.TrackingDocumentAttachment = beforeAddPayName;
    }

    if (this.packageList.TrackingDocumentAttachment) {
      const data = values.TrackingDocumentAttachment.concat(this.attachmentDeleting);

      this.packageList.TrackingDocumentAttachment.map(detail => {
        return Object.assign(detail, data.find((o) => {
          return o.TrackingDocumentAttachmentId === detail.TrackingDocumentAttachmentId;
        }));
      });

      this.addDocument(values);
    } else {
      this.packageList.TrackingDocumentAttachment = [];
      this.addDocument(values);
    }


  }

  add(values) {
    const adding = values.PackageDetail.filter((item) => {
      return item.RowState === RowState.Add;
    });
    this.packageList.PackageDetail = this.packageList.PackageDetail.concat(adding);
    this.packageList.PackageDetail = this.packageList.PackageDetail.concat(this.deleting);
    this.deleting = [];
  }

  addDocument(values) {
    const attachmentAdding = values.TrackingDocumentAttachment.filter((item) => {
      return item.RowState === RowState.Add;
    });
    this.packageList.TrackingDocumentAttachment = this.packageList.TrackingDocumentAttachment.concat(attachmentAdding);
    this.packageList.TrackingDocumentAttachment = this.packageList.TrackingDocumentAttachment.concat(this.attachmentDeleting);
    this.attachmentDeleting = [];
  }

  onSubmit(flag) {
    this.submitted = true;
    if (this.PackageForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.saving = true;

    if (!flag) {
      if (this.contractTrackingDocument.length == 0) {
        this.is.checkPackageDetail(this.packageList.TrackingDocumentPackageId).pipe(
          finalize(() => {
            this.saving = false;
            this.submitted = false;
          }))
          .subscribe((res: any) => {
            if (res === 0) {
              this.PackageForm.controls.PackageStatus.setValue('CP');
              this.onSave();
            } else {
              this.as.error('', 'ไม่สามารถยกเลิกได้ เนื่องจากมีรายการเอกสารอยู่ กรุณาทำการบันทึกก่อนทำการยกเลิก');
            }
          });
      } else {
        this.saving = false;
        this.submitted = false;
        this.as.error('', 'ไม่สามารถยกเลิกได้ เนื่องจากมีรายการเอกสารอยู่');
      }
    } else {
      if (!this.packageList.TrackingDocumentPackageId) {
        this.is.checkPackage(this.PackageForm.controls.CompanySource.value, this.PackageForm.controls.CompanyDestination.value).pipe(
          finalize(() => {
            this.saving = false;
            this.submitted = false;
          }))
          .subscribe((res: any) => {
            if (res === 0) {
              this.onSave();
            } else {
              this.packageDetailList.PackageDetail = [];
              for (const item of this.contractTrackingDocument.getRawValue()) {
                let packages = {} as PackageDetail;
                packages.TrackingDocumentPackageId = res;
                packages.TrackingDocumentId = item.TrackingDocumentId;
                this.packageDetailList.PackageDetail.push(packages);
              }
              this.modal.confirm("มีรายการเตรียมพัสดุของสาขานี้แล้ว ต้องการเพิ่มรายการลงในพัสดุหรือไม่?").subscribe(
                (res) => {
                  if (res) {
                    this.updateDetailList();
                  }
                })
            }
          });
      } else {
        this.onSave();
      }
    }
  }

  onSave() {
    this.saving = true;
    this.prepareSave(this.PackageForm.getRawValue());
    this.is.save(this.packageList).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: Package) => {
          this.packageList = res;
          this.searchEdit();
        });
  }

  searchEdit() {
    this.is.getSearchEdit(this.packageList.TrackingDocumentPackageId).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: Package) => {
          this.packageList = res;
          this.PackageForm.reset();
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        });
  }

  back() {
    this.router.navigate(['lo/lots20'], { skipLocationChange: true });
  }


  get getPackageStatus() {
    return this.packageStatus.find((item) => { return item.Value == this.PackageForm.controls['PackageStatus'].value });
  }

  openModal(content) {
    this.is.checkPackageDetail(this.packageList.TrackingDocumentPackageId).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: any) => {
        if (res > 0) {
          this.popup = this.modal.open(content, Size.large);
          this.PackageForm.controls.TransportCodeModal.enable({ emitEvent: false });
          this.PackageForm.controls.PackageNoModal.enable({ emitEvent: false });
        } else {
          this.as.error('', 'ไม่สามารถใส่เลขพัสดุได้ เนื่องจากไม่มีรายการเอกสาร');
        }
      });
  }

  closeModal() {
    this.PackageForm.controls.TransportCodeModal.disable({ emitEvent: false });
    this.PackageForm.controls.PackageNoModal.disable({ emitEvent: false });
    this.popup.hide();
  }

  changeStatus() {
    if (this.PackageForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.PackageForm.controls.TransportCode.setValue(this.PackageForm.controls.TransportCodeModal.value);
    this.PackageForm.controls.PackageNo.setValue(this.PackageForm.controls.PackageNoModal.value);
    this.PackageForm.controls.PackageStatus.setValue('S');
    this.PackageForm.controls.PackageSendDate.setValue(new Date());
    this.closeModal();
  }

  linkContractDetail(id?: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots03' }], { skipLocationChange: true }));
    window.open(url, '_blank');
  }

  updateDetailList() {
    this.is.updateDetailList(this.packageDetailList).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: PackageDetail) => {
          this.packageList.TrackingDocumentPackageId = res.TrackingDocumentPackageId;
          this.searchEdit();
        });
  }

  IsCheckCanEdit() {
    this.is.isCheckCanEdit(this.packageList.TrackingDocumentPackageId, this.companyDashBoard).pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: boolean) => {
          if (!res) {
            this.PackageForm.disable({ emitEvent: false });
            this.isCheckCanEdit = res;
          }
        });
  }
}

