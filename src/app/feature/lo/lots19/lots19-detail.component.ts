import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, AuthService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, SelectFilterService } from '@app/shared';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { Category } from '@app/shared/service/configuration.service';
import { finalize } from 'rxjs/operators';
import { Lots19ContractLookupComponent } from './lots19-contract-lookup.component';
import { Disbursement, Lots19Service, TrackingDocumentAttachment } from './lots19.service';

@Component({
  templateUrl: './lots19-detail.component.html'
})
export class Lots19DetailComponent implements OnInit {

  master: { disbursementType: any[] }
  DisbursementForm: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  loadingMasterCustomer: Boolean = false;
  disbursement: Disbursement = {} as Disbursement;
  newTracking: Disbursement = {} as Disbursement;
  attachmentFiles: Attachment[] = [];
  category = Category.TrackingDocument;
  disType = [];
  Companies = [];
  CompaniesDash = [];
  now = new Date();
  attachmentDeleting = [];
  isDisableAttachment: boolean = false;
  contractHeadId: number;
  Lots19ContractLookupContent = Lots19ContractLookupComponent;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private is: Lots19Service,
    private modal: ModalService,
    public lang: LangService,
    private filter: SelectFilterService,
    private saveData: SaveDataService,
    private auth: AuthService,

  ) {
    this.createForm();
  }

  createForm() {
    this.DisbursementForm = this.fb.group({
      TrackingDocumentId: null,
      MainContractHeadId: null,
      CustomerCode: null,
      MainContractNo: [null, Validators.required],
      ContractType: null,
      CustomerName: null,
      ContractStatusTH: null,
      ContractStatusCode: null,
      ReqCompanyDocument: [null, Validators.required],
      ReqCompanyCreateDocument: null,
      ReqDocumentTypeCode: null,
      ReqDocumentDate: [null, Validators.required],
      ReqReturnDocumentDate: null,
      ReqRemark: null,
      IsAutoReq: false,
      TrackingDocumentAttachment: this.fb.array([]),
    });
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
    return this.DisbursementForm.get('TrackingDocumentAttachment') as FormArray;
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
    this.DisbursementForm.markAsDirty();

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
      this.disbursement = data.Lots19.disDetail;
      this.newTracking = data.Lots19.newTracking;
      this.disType = data.Lots19.master.Distype;
      this.Companies = data.Lots19.master.CompanyDepartment;
    });

    if (this.disbursement.MainContractHeadId != null) {
      this.loanDetailOutput(this.disbursement.MainContractHeadId);
    }

    if (this.newTracking.TrackingDocumentId21 != null) {
      if (this.auth.isCompanyTracking) {
        this.DisbursementForm.controls.ReqReturnDocumentDate.disable({ emitEvent: false });
      } else {
        if (this.newTracking.ContractStatusCode != 'S') {
          this.DisbursementForm.controls.ReqReturnDocumentDate.enable({ emitEvent: false });
        }
      }
      this.loanDetailOutputNew(this.newTracking.TrackingDocumentId21);
    }

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.bindDropDownList();
    this.rebuildForm();
  }

  rebuildForm() {
    this.attachmentFiles = [];
    this.DisbursementForm.disable({ emitEvent: false });
    this.DisbursementForm.controls.MainContractNo.enable();
    this.DisbursementForm.controls.ReqCompanyCreateDocument.setValue(this.auth.company);

    if (this.newTracking.TrackingDocumentId21 != null) {
      if (this.newTracking.ContractStatusCode != 'S') {
        this.DisbursementForm.controls.ReqReturnDocumentDate.enable({ emitEvent: false });
      }
    }
    if (this.disbursement.TrackingDocumentId) {
      this.DisbursementForm.markAsPristine();
      this.DisbursementForm.patchValue(this.disbursement);
      this.DisbursementForm.controls.MainContractNo.disable({ emitEvent: false });
      this.DisbursementForm.setControl('TrackingDocumentAttachment', this.fb.array(this.disbursement.TrackingDocumentAttachment.map((detail) => this.contractAttachmentsForm(detail))))
      this.checkContractAttachment();
      this.is.checkPreparePackage(this.disbursement.TrackingDocumentId).pipe(finalize(() => {
      })).subscribe(
        (res: any) => {
          if (res.RefNo) {
            this.DisbursementForm.disable({ emitEvent: false });
            this.isDisableAttachment = true;
            if (res.PackageStatus == 'P') {
              this.DisbursementForm.disable({ emitEvent: false });
            }
          } else {
            if (this.disbursement.IsAutoReq == true) {
              this.DisbursementForm.disable({ emitEvent: false });
            } else {
              this.DisbursementForm.disable({ emitEvent: false });
              this.DisbursementForm.controls.ReqDocumentTypeCode.enable({ emitEvent: false });

              if (this.DisbursementForm.controls.ContractStatusCode.value != 'S') {
                this.DisbursementForm.controls.ReqReturnDocumentDate.enable({ emitEvent: false });
              }

              this.DisbursementForm.controls.ReqRemark.enable({ emitEvent: false });

              if (this.auth.isCompanyTracking) {
                this.DisbursementForm.disable({ emitEvent: false });
                this.DisbursementForm.controls.ReqDocumentTypeCode.enable({ emitEvent: false });
                this.DisbursementForm.controls.ReqDocumentDate.enable({ emitEvent: false });
                this.DisbursementForm.controls.ReqReturnDocumentDate.disable({ emitEvent: false });
                this.DisbursementForm.controls.ReqRemark.enable({ emitEvent: false });

                if (this.DisbursementForm.controls.ReqDocumentTypeCode.value == "1") {
                  this.DisbursementForm.controls.ReqDocumentTypeCode.enable({ emitEvent: false });
                } else {
                  this.DisbursementForm.controls.ReqDocumentTypeCode.enable({ emitEvent: false });
                  this.DisbursementForm.controls.ReqDocumentDate.enable({ emitEvent: false });
                }

              } else {
                if (this.DisbursementForm.controls.ReqDocumentTypeCode.value == "1") {
                  this.DisbursementForm.controls.ReqDocumentTypeCode.enable({ emitEvent: false });
                } else {
                  this.DisbursementForm.controls.ReqDocumentTypeCode.enable({ emitEvent: false });
                  this.DisbursementForm.controls.ReqDocumentDate.enable({ emitEvent: false });
                }
              }
            }
          }
        }
      );
    }
  }

  bindDropDownList() {
    this.filterDisbursementType(true);
  }

  filterDisbursementType(filter?: boolean) {
    if (filter) {
      const detail = this.DisbursementForm.value;
      if (detail) {
        this.disType = this.filter.FilterActiveByValue(this.disType, detail.ReqDocumentTypeCode);
      }
      else {
        this.disType = this.filter.FilterActive(this.disType);
      }
    }
    this.disType = [...this.disType];
  }

  prepareSave(values) {
    Object.assign(this.disbursement, values);
    if (this.disbursement.TrackingDocumentAttachment != undefined) {
      const beforeAddPayName = this.disbursement.TrackingDocumentAttachment.filter((item) => {
        return item.RowState !== RowState.Add;
      });
      this.disbursement.TrackingDocumentAttachment = beforeAddPayName;
    }

    if (this.disbursement.TrackingDocumentAttachment) {
      const data = values.TrackingDocumentAttachment.concat(this.attachmentDeleting);

      this.disbursement.TrackingDocumentAttachment.map(detail => {
        return Object.assign(detail, data.find((o) => {
          return o.TrackingDocumentAttachmentId === detail.TrackingDocumentAttachmentId;
        }));
      });

      this.add(values);
    } else {
      this.disbursement.TrackingDocumentAttachment = [];
      this.add(values);
    }
  }

  add(values) {
    const attachmentAdding = values.TrackingDocumentAttachment.filter((item) => {
      return item.RowState === RowState.Add;
    });
    this.disbursement.TrackingDocumentAttachment = this.disbursement.TrackingDocumentAttachment.concat(attachmentAdding);
    this.disbursement.TrackingDocumentAttachment = this.disbursement.TrackingDocumentAttachment.concat(this.attachmentDeleting);
    this.attachmentDeleting = [];
  }

  onSubmit() {
    this.submitted = true;
    if (this.DisbursementForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.saving = true;
    if (this.DisbursementForm.controls.ReqCompanyDocument.value == this.auth.company) {
      this.as.warning('', 'ไม่สามารถขอเบิกเอกสารของสัญญานี้ได้ เนื่องจากตำแหน่งเอกสารอยู่ทีสาขานี้แล้ว');
    } else {
      this.onSave();
    }
  }

  onSave() {
    this.saving = true;
    this.prepareSave(this.DisbursementForm.getRawValue());
    this.disbursement.TrackingDocumentId21 = this.newTracking.TrackingDocumentId21;
    this.disbursement.TrackingDocumentStatus = this.newTracking.TrackingDocumentStatus;
    this.is.save(this.disbursement, this.attachmentFiles).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: Disbursement) => {
          this.disbursement = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
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
            if (res.MainContractNo != null) {
              this.DisbursementForm.controls.MainContractNo.setValue(res.MainContractNo);
              this.DisbursementForm.controls.ContractType.setValue(res.ContractType);
              this.DisbursementForm.controls.CustomerName.setValue(res.CustomerName);
              this.DisbursementForm.controls.ContractStatusTH.setValue(res.ContractStatusTH);
              this.DisbursementForm.controls.ContractStatusCode.setValue(res.ContractStatusCode);
              this.DisbursementForm.controls.MainContractHeadId.setValue(res.MainContractHeadId);

              if (res.ReqCompanyDocument == this.auth.company) {
                this.as.warning('', 'ไม่สามารถขอเบิกเอกสารของสัญญานี้ได้ เนื่องจากตำแหน่งเอกสารอยู่ทีสาขานี้แล้ว');
              } else {
                this.DisbursementForm.controls.ReqCompanyDocument.setValue(res.ReqCompanyDocument);
              }

              if (!this.disbursement.TrackingDocumentId) {
                this.filterCompany(this.DisbursementForm.controls.ReqCompanyDocument.value);

                if (!this.auth.isCompanyTracking) {
                  if (this.DisbursementForm.controls.ContractStatusCode.value != 'S') {
                    this.DisbursementForm.controls.ReqReturnDocumentDate.enable({ emitEvent: false });
                  }
                } else {
                  this.DisbursementForm.controls.ReqReturnDocumentDate.disable({ emitEvent: false });
                }
                this.DisbursementForm.controls.ReqDocumentTypeCode.enable({ emitEvent: false });
                this.DisbursementForm.controls.ReqCompanyDocument.enable({ emitEvent: false });
                this.DisbursementForm.controls.ReqDocumentDate.enable({ emitEvent: false });
                this.DisbursementForm.controls.ReqRemark.enable({ emitEvent: false });
                this.DisbursementForm.controls.ReqReturnDocumentDate.setErrors({ 'required': true });
              } else {

                if (res.ContractStatusCode == "S" || this.auth.isCompanyTracking) {
                  this.DisbursementForm.controls.ReqReturnDocumentDate.setErrors(null);
                } else {
                  this.DisbursementForm.controls.ReqReturnDocumentDate.setErrors({ 'required': true });
                }
              }
            }
          });
    }
  }

  loanDetailOutputNew(loanDetail) {
    this.loadingMasterCustomer = false;
    if (loanDetail != undefined) {
      this.is.getNewContractDetail(loanDetail)
        .pipe(finalize(() => {
          this.loadingMasterCustomer = false;
        }))
        .subscribe(
          (res: any) => {
            if (res.MainContractNo != null) {
              this.DisbursementForm.controls.MainContractNo.setValue(res.MainContractNo);
              this.DisbursementForm.controls.ContractType.setValue(res.ContractType);
              this.DisbursementForm.controls.CustomerName.setValue(res.CustomerName);
              this.DisbursementForm.controls.ContractStatusTH.setValue(res.ContractStatusTH);
              this.DisbursementForm.controls.ContractStatusCode.setValue(res.ContractStatusCode);
              this.DisbursementForm.controls.MainContractHeadId.setValue(res.MainContractHeadId);
              this.DisbursementForm.controls.ReqCompanyDocument.setValue(res.ReqCompanyDocument);
              this.DisbursementForm.controls.ReqDocumentTypeCode.setValue(res.ReqDocumentTypeCode);
              this.DisbursementForm.controls.ReqDocumentDate.setValue(res.ReqDocumentDate);
              this.DisbursementForm.controls.ReqReturnDocumentDate.setValue(res.ReqReturnDocumentDate);
              this.DisbursementForm.controls.ReqRemark.setValue(res.ReqRemark);
              this.DisbursementForm.setControl('TrackingDocumentAttachment', this.fb.array(res.TrackingDocumentAttachment.map((detail) => this.contractAttachmentsForm(detail))))

              this.DisbursementForm.controls.ReqDocumentTypeCode.enable({ emitEvent: false });
              this.DisbursementForm.controls.ReqCompanyDocument.enable({ emitEvent: false });
              this.DisbursementForm.controls.ReqDocumentDate.enable({ emitEvent: false });
              this.DisbursementForm.controls.ReqRemark.enable({ emitEvent: false });

              if (res.ContractStatusCode == "S" || this.auth.isCompanyTracking) {
                this.DisbursementForm.controls.ReqReturnDocumentDate.setErrors(null);
              } else {
                if (this.DisbursementForm.controls.ReqReturnDocumentDate == null) {
                  this.DisbursementForm.controls.ReqReturnDocumentDate.setErrors({ 'required': true });
                }
              }
            }
          });
    }
  }

  back() {
    this.router.navigate(['lo/lots19'], { skipLocationChange: true });
  }

  get currentCompany() {
    return (this.CompaniesDash.find(com => com.CompanyCode == this.auth.company) || {});
  }

  getCompany() {
    this.is.getCompany().pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.CompaniesDash = res;
        });
  }

  disValue() {
    if (!this.disbursement.TrackingDocumentId) {
      if (this.DisbursementForm.controls.ReqDocumentTypeCode.value == "1") {
        if (this.DisbursementForm.controls.ReqCompanyDocument.value) {
          this.is.getSearchReqDocDate(this.DisbursementForm.controls.ReqCompanyDocument.value)
            .pipe(finalize(() => {
              this.loadingMasterCustomer = false;
            }))
            .subscribe(
              (res: any) => {
                this.DisbursementForm.controls.ReqDocumentDate.setValue(new Date(res), { emitEvent: false });
                this.DisbursementForm.controls.ReqDocumentDate.disable({ emitEvent: false });
                if (this.auth.isCompanyTracking) {
                  this.DisbursementForm.controls.ReqReturnDocumentDate.disable({ emitEvent: false });
                } else {
                  if (this.DisbursementForm.controls.ContractStatusCode.value != 'S') {
                    this.DisbursementForm.controls.ReqReturnDocumentDate.enable({ emitEvent: false });
                  }
                  if (this.DisbursementForm.controls.ContractStatusCode.value == 'S') {
                    this.DisbursementForm.controls.ReqReturnDocumentDate.setErrors(null);
                  } else {
                    this.DisbursementForm.controls.ReqReturnDocumentDate.setErrors({ 'required': true });
                  }
                }
              }
            );
        }
      } else {
        this.DisbursementForm.controls.ReqDocumentDate.setValue(new Date(), { emitEvent: false });
        this.DisbursementForm.controls.ReqDocumentDate.enable({ emitEvent: false });
        if (this.auth.isCompanyTracking) {
          this.DisbursementForm.controls.ReqReturnDocumentDate.disable({ emitEvent: false });
        } else {
          if (this.DisbursementForm.controls.ContractStatusCode.value != 'S') {
            this.DisbursementForm.controls.ReqReturnDocumentDate.enable({ emitEvent: false });
          }
          if (this.DisbursementForm.controls.ContractStatusCode.value == 'S') {
            this.DisbursementForm.controls.ReqReturnDocumentDate.setErrors(null);
          } else {
            this.DisbursementForm.controls.ReqReturnDocumentDate.setErrors({ 'required': true });
          }
        }
      }
    } else {
      if (this.DisbursementForm.controls.ReqDocumentTypeCode.value == "1") {
        if (this.DisbursementForm.controls.ReqCompanyCreateDocument.value) {
          this.is.getSearchReqDocDate(this.DisbursementForm.controls.ReqCompanyCreateDocument.value)
            .pipe(finalize(() => {
              this.loadingMasterCustomer = false;
            }))
            .subscribe(
              (res: any) => {
                this.DisbursementForm.controls.ReqDocumentDate.setValue(new Date(res), { emitEvent: false });
                this.DisbursementForm.controls.ReqDocumentDate.disable({ emitEvent: false });
                if (this.auth.isCompanyTracking) {
                  this.DisbursementForm.controls.ReqReturnDocumentDate.disable({ emitEvent: false });
                } else {
                  if (this.DisbursementForm.controls.ContractStatusCode.value != 'S') {
                    this.DisbursementForm.controls.ReqReturnDocumentDate.enable({ emitEvent: false });
                  }
                }
              }
            );
        }
      } else {
        this.DisbursementForm.controls.ReqDocumentDate.setValue(new Date(), { emitEvent: false });
        this.DisbursementForm.controls.ReqDocumentDate.enable({ emitEvent: false });

        if (this.auth.isCompanyTracking) {
          this.DisbursementForm.controls.ReqReturnDocumentDate.disable({ emitEvent: false });
        } else {
          if (this.DisbursementForm.controls.ContractStatusCode.value != 'S') {
            this.DisbursementForm.controls.ReqReturnDocumentDate.enable({ emitEvent: false });
          }
        }
      }
    }
  }

  filterCompany(companyCode: string) {
    this.Companies = this.Companies.filter(x => x.Value == companyCode && x.Value != this.auth.company);
  }


}
