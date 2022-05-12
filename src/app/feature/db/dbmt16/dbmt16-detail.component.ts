import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Dbmt16Service, DocumentType, DocumentSubType } from './dbmt16.service';

@Component({
  templateUrl: './dbmt16-detail.component.html'
})
export class Dbmt16DetailComponent implements OnInit, OnDestroy {
  documentTypeDetail: DocumentType = {} as DocumentType;
  documentTypeFrom: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  systemList = [];
  firstCreate = '';
  contactDocumentTypeDeleting: DocumentSubType[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Dbmt16Service,
    private modal: ModalService,
    public lang: LangService,
    private saveData: SaveDataService,
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.documentTypeFrom = this.fb.group({
      DocumentTypeCode: [null, Validators.required],
      DocumentTypeName: [null, Validators.required],
      SystemCode: [null, Validators.required],
      Active: true,
      DocumentSubTypeForm: this.fb.array([])
    });
  }

  createBackSearchForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      System: null,
      flagSearch: null,
      beforeSearch: null
    });
  }

  createSubTypeForm(item: DocumentSubType): FormGroup {
    const fg = this.fb.group({
      guid: Math.random().toString(), // important for tracking change
      DocumentTypeCode: this.documentTypeFrom.controls.DocumentTypeCode.value,
      DocumentSubTypeCode: [null, Validators.required],
      DocumentSubTypeName: [null, Validators.required],
      Active: true,
      RowVersion: null,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });
    if (item.RowVersion) {
      fg.controls.DocumentSubTypeCode.disable();
    }
    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState === RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    );

    fg.controls.DocumentSubTypeCode.valueChanges.subscribe(value => {
      fg.controls.DocumentSubTypeCode.setValue(fg.controls.DocumentSubTypeCode.value.trim(), { emitEvent: false });
    });

    fg.controls.DocumentSubTypeName.valueChanges.subscribe(value => {
      fg.controls.DocumentSubTypeName.setValue(fg.controls.DocumentSubTypeName.value.trim(), { emitEvent: false });
    });
    
    return fg;
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('DBMT16');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.searchForm.controls.flagSearch.setValue(false);
    this.route.data.subscribe((data) => {
      this.documentTypeDetail = data.dbmt16.documentTypeDetailList;
      this.systemList = data.dbmt16.systemList.SystemList;
      this.rebuildForm();
    });
  }

  ngOnDestroy() {
    // this.saveData.save(this.searchForm.value, 'DBMT16');
  }

  rebuildForm() {
    this.documentTypeFrom.markAsPristine();
    this.documentTypeFrom.patchValue(this.documentTypeDetail);
    if (this.documentTypeDetail.RowVersion) {
      this.firstCreate = this.documentTypeDetail.RowVersion;
      this.documentTypeFrom.setControl('DocumentSubTypeForm', this.fb.array([]));
      setTimeout(() => {
        this.documentTypeFrom.setControl('DocumentSubTypeForm',
          this.fb.array(this.documentTypeDetail.DocumentSubTypes.map(
            (detail) => this.createSubTypeForm(detail))));
        this.documentTypeFrom.controls.DocumentTypeCode.disable();
      }, 50);
    } else {
      this.documentTypeFrom.controls.DocumentTypeCode.enable();
    }
  }

  get getDocumentSubType(): FormArray {
    return this.documentTypeFrom.get('DocumentSubTypeForm') as FormArray;
  }

  addRow() {
    this.getDocumentSubType.push(this.createSubTypeForm({} as DocumentSubType));
    this.getDocumentSubType.markAsDirty();
  }
  removeRow(index) {
    const detail = this.getDocumentSubType.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      const deleting = this.documentTypeDetail.DocumentSubTypes.find(item =>
        item.DocumentTypeCode === detail.controls.DocumentTypeCode.value
        && item.DocumentSubTypeCode === detail.controls.DocumentSubTypeCode.value
      );
      deleting.RowState = RowState.Delete;
    }
    this.getDocumentSubType.removeAt(index);
    this.getDocumentSubType.markAsDirty();
  }

  validateSubType() {
    const seen = new Set();
    const hasDuplicates = this.getDocumentSubType.getRawValue().some(function (item) {
      return seen.size === seen.add(item.DocumentSubTypeCode).size;
    });
    return hasDuplicates;
  }

  prepareSave(values: Object) {
    Object.assign(this.documentTypeDetail, values);
    const documentSubType = this.getDocumentSubType.getRawValue();
    const adding = documentSubType.filter(function (item) {
      return item.RowState === RowState.Add;
    });
    if (!this.firstCreate) {
      this.documentTypeDetail.DocumentSubTypes = adding;
    }
    this.documentTypeDetail.DocumentSubTypes.map(label => {
      return Object.assign(label, documentSubType.filter(item => item.RowState === RowState.Edit).find((item) => {
        return label.DocumentTypeCode === item.DocumentTypeCode
          && label.DocumentSubTypeCode === item.DocumentSubTypeCode;
      }));
    });
    this.documentTypeDetail.DocumentSubTypes = this.documentTypeDetail.DocumentSubTypes.filter(
      item => item.RowState !== RowState.Add).concat(adding);
  }

  onSubmit() {
    if (this.documentTypeFrom.invalid) {
      this.submitted = true;
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.documentTypeFrom.controls.DocumentTypeCode.value || this.documentTypeFrom.controls.DocumentTypeName.value) {
      if (this.documentTypeFrom.controls.DocumentTypeCode.value) {
        this.documentTypeFrom.controls.DocumentTypeCode.setValue(this.documentTypeFrom.controls.DocumentTypeCode.value.trim());
      }

      if (this.documentTypeFrom.controls.DocumentTypeName.value) {
        this.documentTypeFrom.controls.DocumentTypeName.setValue(this.documentTypeFrom.controls.DocumentTypeName.value.trim());
      }

      if ((this.documentTypeFrom.controls.DocumentTypeCode.value == null || this.documentTypeFrom.controls.DocumentTypeCode.value == '') || this.documentTypeFrom.controls.DocumentTypeName.value == null || this.documentTypeFrom.controls.DocumentTypeName.value == '') {
        return;
      }
    }

    if (!this.firstCreate) {
      this.js.checkDuplicate(this.documentTypeFrom.controls['DocumentTypeCode'].value).pipe(
        finalize(() => {
        }))
        .subscribe(
          (res: any) => {
            if (res) {
              this.onSave();
            } else {
              this.as.warning('', 'Message.STD00004', ['Label.DBMT16.DocumentTypeCode']);
            }
          }
        );
    } else { this.onSave(); }
  }

  onSave() {
    if (this.getDocumentSubType.value.length === 0) {
      this.as.warning('', 'Message.STD00012', ['Label.DBMT16.DocumentSubType']);
      return;
    }
    if (this.validateSubType()) {
      this.as.warning('', 'Message.STD00004', ['Label.DBMT16.DocumentSubTypeCode']);
      return;
    }
    this.prepareSave(this.documentTypeFrom.getRawValue());
    this.submitted = true;
    this.saving = true;
    this.js.saveDocumentType(this.documentTypeDetail).pipe(
      switchMap(() => this.js.getDetail(this.documentTypeDetail.DocumentTypeCode)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: DocumentType) => {
          this.documentTypeDetail = res;
          this.rebuildForm();
          this.as.success(' ', 'Message.STD00006');
        }
      );
  }


  canDeactivate(): Observable<boolean> | boolean {
    if (!this.documentTypeFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back(flagSearch) {
    this.router.navigate(['/db/dbmt16', { flagSearch: flagSearch }], { skipLocationChange: true });
  }
}
