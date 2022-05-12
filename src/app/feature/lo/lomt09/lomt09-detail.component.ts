import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page, SelectFilterService, Size } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lomt09Service, Attribute } from './lomt09.service';

@Component({
  templateUrl: './lomt09-detail.component.html'
})
export class Lomt09DetailComponent implements OnInit {

  attribute: Attribute = {} as Attribute;
  master: { attributeType: any[] };
  attributeType = [];
  AttributeType = [];
  AttributesForm: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private is: Lomt09Service,
    private modal: ModalService,
    public lang: LangService,
    private filter: SelectFilterService,
    private saveData: SaveDataService,
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.AttributesForm = this.fb.group({
      AttributeId: null,
      AttributeNameTha: [null, Validators.required],
      AttributeNameEng: null,
      AttributeType: null,
      Active: true,
    });
  }

  createBackSearchForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      flagSearch: null,
      beforeSearch: null
    });
  }
  ngOnInit() {
    this.lang.onChange().subscribe(
      () => this.bindDropDownList()
    );

    const saveData = this.saveData.retrive('LOMT09');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.searchForm.controls.flagSearch.setValue(false);
    this.route.data.subscribe((data) => {
      this.attribute = data.Lomt09.detail;
      this.AttributeType = data.Lomt09.ddl.LoanTypesDto;
    });
    this.rebuildForm();
  }

  bindDropDownList() {
    this.filter.SortByLang(this.attributeType);
    this.attributeType = [...this.AttributeType];
  }

  rebuildForm() {
    this.AttributesForm.markAsPristine();
    if (this.attribute.AttributeId) {
      this.AttributesForm.patchValue(this.attribute);
      this.AttributesForm.controls.AttributeType.disable({ emitEvent: false });
    }
    this.bindDropDownList();
  }

  prepareSave(values: Object) {
    Object.assign(this.attribute, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.AttributesForm.controls.AttributeNameTha.value) {
      this.AttributesForm.controls.AttributeNameTha.setValue(this.AttributesForm.controls.AttributeNameTha.value.trim(), { eventEmit: false });
    }
    if (this.AttributesForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.saving = true;
    this.is.checkduplicate(this.AttributesForm.getRawValue()).pipe(
      finalize(() => { }))
      .subscribe(
        (res) => {
          if (res) {
            this.onSave();
          } else {
            this.saving = false;
            this.as.error('', 'Message.STD00004', ['Label.LOMT09.PlaceHolder']);
          }
        });
  }

  onSave() {
    this.prepareSave(this.AttributesForm.value);
    this.is.saveAttribute(this.attribute).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
        this.AttributesForm.enable();
        if (this.attribute.AttributeId != null) {
          this.AttributesForm.controls.AttributeType.disable({ emitEvent: false });
        }
      }))
      .subscribe(
        (res: Attribute) => {
          this.attribute = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        });
  }

  back() {
    this.router.navigate(['/lo/lomt09'], { skipLocationChange: true });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.AttributesForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] == 'lomt09') {
      this.saveData.save(this.searchForm.value, 'LOMT09');
    } else {
      this.saveData.save(this.searchForm.value, 'LOMT09');
    }
  }
}
