import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Dbmt09Service, Country } from './dbmt09.service';

@Component({
  templateUrl: './dbmt09-detail.component.html'
})
export class Dbmt09DetailComponent implements OnInit {

  CountryDetail: Country = {} as Country;
  CountryFrom: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  statusSave: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Dbmt09Service,
    private saveData: SaveDataService,
    private modal: ModalService,
    public lang: LangService
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.CountryFrom = this.fb.group({
      CountryCode: [null, Validators.required],
      CountryNameTha: [null, Validators.required],
      CountryNameEng: null,
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
    const saveData = this.saveData.retrive('DBMT09');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.CountryDetail = data.dbmt09.CountryDetail;
      this.rebuildForm();
      if (data.dbmt09.CountryDetail.CountryCode) {
        this.statusSave = false;
      }
    });
    this.searchForm.controls.flagSearch.setValue(false);
  }

  rebuildForm() {
    this.CountryFrom.markAsPristine();
    this.CountryFrom.patchValue(this.CountryDetail);
    if (this.CountryDetail.CountryCode) {
      this.CountryFrom.controls.CountryCode.disable();
      this.statusSave = false;
    } else {
      this.CountryFrom.controls.CountryCode.enable();
    }


  }

  prepareSave(values: Object) {
    Object.assign(this.CountryDetail, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.CountryFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    if (this.CountryFrom.controls.CountryCode.value || this.CountryFrom.controls.CountryNameTha.value) {
      this.CountryFrom.controls.CountryCode.setValue(this.CountryFrom.controls.CountryCode.value.trim());
      this.CountryFrom.controls.CountryNameTha.setValue(this.CountryFrom.controls.CountryNameTha.value.trim());
      if (this.CountryFrom.controls.CountryCode.value == null || this.CountryFrom.controls.CountryCode.value == '' || this.CountryFrom.controls.CountryNameTha.value == null || this.CountryFrom.controls.CountryNameTha.value == '') {
        return;
      }
    }
    this.prepareSave(this.CountryFrom.value);
    if (this.statusSave) {
      this.js.CheckDuplicate(this.CountryDetail).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe(
          (res) => {
            if (res) {
              this.onSave();
            } else {
              this.as.warning('', 'ข้อมูลประเทศ มีค่าซ้ำ');
            }
          }
        );
    } else {
      this.onSave();
    }
  }

  onSave() {
    this.js.saveCountry(this.CountryDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: Country) => {
          this.CountryDetail = res;
          this.rebuildForm();
          this.CountryFrom.controls.CountryCode.disable();
          this.as.success('', 'Message.STD000033');
        }
      );
  }


  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'dbmt09') {
      this.saveData.save(this.searchForm.value, 'DBMT09');
    } else {
      this.saveData.save(this.searchForm.value, 'DBMT09');
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.CountryFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back(flagSearch) {
    this.router.navigate(['/db/dbmt09', { flagSearch: flagSearch }], { skipLocationChange: true });
  }
}
