import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Dbmt111Service, District } from './dbmt11-1.service';

@Component({
  templateUrl: './dbmt11-1-detail.component.html'
})
export class Dbmt111DetailComponent implements OnInit {

  DistrictDetail: District = {} as District;
  DistrictFrom: FormGroup;
  MasterForm: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  statusSave: boolean = true;
  ChangeValue: boolean = false;
  ProvinceId = '';
  tempapp: any[];
  temp = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Dbmt111Service,
    private modal: ModalService,
    private saveData: SaveDataService,
    public lang: LangService
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createMasterForm() {
    this.MasterForm = this.fb.group({
      ProvinceId: null,
      ProvinceNameTha: null,
      ProvinceNameEng: null,
    });
  }

  createForm() {
    this.DistrictFrom = this.fb.group({
      ProvinceId: null,
      DistrictId: null,
      DistrictNameTha: [null, Validators.required],
      DistrictNameEng: null,
      Active: true,
    });

    this.DistrictFrom.controls.DistrictNameEng.valueChanges.subscribe(
      (control) => {
        this.ChangeValue = true
      }
    );
    this.DistrictFrom.controls.DistrictNameTha.valueChanges.subscribe(
      (control) => {
        this.ChangeValue = true
      }
    );
  }

  createBackSearchForm() {
    this.searchForm = this.fb.group({
      ProvinceId: null,
      InputSearch: null,
      flagSearch: false,
      beforeSearch: null
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('DBMT111');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.statusSave = true;
      if (data.dbmt111.DistrictDetail != -1) {
        this.DistrictDetail = data.dbmt111.DistrictDetail.Rows[0];
        this.temp = this.DistrictDetail.CreatedProgram;
        this.statusSave = false;
      }
      this.ProvinceId = data.dbmt111.ProvinceId;
      this.rebuildForm();
    });
    this.searchForm.controls.flagSearch.setValue(false);
  }

  rebuildForm() {
    this.DistrictFrom.markAsPristine();
    this.DistrictFrom.patchValue(this.DistrictDetail);
    this.DistrictFrom.controls.ProvinceId.setValue(this.ProvinceId);
    // this.DistrictDetail.CreatedProgram = this.temp;
  }

  prepareSave(values: Object) {
    Object.assign(this.DistrictDetail, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.DistrictFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      // this.statusSave = '';
      return;
    }
    if (this.DistrictFrom.controls.DistrictNameTha.value) {
      this.DistrictFrom.controls.DistrictNameTha.setValue(this.DistrictFrom.controls.DistrictNameTha.value.trim());
      if (this.DistrictFrom.controls.DistrictNameTha.value == null || this.DistrictFrom.controls.DistrictNameTha.value == '') {
        return;
      }
    }
    this.prepareSave(this.DistrictFrom.getRawValue());
    // if (this.statusSave) {
    this.js.CheckDuplicate(this.DistrictDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res) => {
          if (res) {
            this.onSave();
          } else {
            this.as.error('', 'ข้อมูลอำเภอ มีค่าซ้ำ');
          }
        }
      );
    // } else {
    //   this.onSave();
    // }
  }

  onSave() {
    this.js.saveDistrict(this.DistrictDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
        this.ChangeValue = false;
      }))
      .subscribe(
        (res: any) => {
          this.DistrictDetail = res.Rows[0];
          this.rebuildForm();
          this.as.success('', 'Message.STD000033');
        }
      );
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'DBMT111');
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.DistrictFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/db/dbmt11-1', { ProvinceId: this.ProvinceId, inPageOpen: false }], { skipLocationChange: true });
  }
}
