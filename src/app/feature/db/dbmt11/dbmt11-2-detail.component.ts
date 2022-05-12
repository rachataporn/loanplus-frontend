import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Dbmt112Service, SubDistrict } from './dbmt11-2.service';

@Component({
  templateUrl: './dbmt11-2-detail.component.html'
})
export class Dbmt112DetailComponent implements OnInit {

  SubDistrictDetail: SubDistrict = {} as SubDistrict;
  SubDistrictFrom: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  statusSave: boolean = true;
  ChangeValue: boolean = false;
  CountryList = [];
  ProvinceId = [];
  DistrictId = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Dbmt112Service,
    private modal: ModalService,
    private saveData: SaveDataService,
    public lang: LangService
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.SubDistrictFrom = this.fb.group({
      ProvinceId: null,
      DistrictId: null,
      SubDistrictId: null,
      SubDistrictNameTha: [null, Validators.required],
      SubDistrictNameEng: null,
      Active: true,
    });
    this.SubDistrictFrom.controls.SubDistrictNameEng.valueChanges.subscribe(
      (control) => {
        this.ChangeValue = true
      }
    );
    this.SubDistrictFrom.controls.SubDistrictNameTha.valueChanges.subscribe(
      (control) => {
        this.ChangeValue = true
      }
    );
  }

  createBackSearchForm() {
    this.searchForm = this.fb.group({
      ProvinceId: null,
      DistrictId: null,
      InputSearch: null,
      flagSearch: false,
      beforeSearch: null
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('DBMT112');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.statusSave = true;
      if (data.dbmt112.SubDistrictDetail != -1) {
        this.SubDistrictDetail = data.dbmt112.SubDistrictDetail.Rows[0];
        this.statusSave = false;
      }
      this.ProvinceId = data.dbmt112.ProvinceId;
      this.DistrictId = data.dbmt112.DistrictId;
      this.rebuildForm();
    });
    this.searchForm.controls.flagSearch.setValue(false);
  }

  rebuildForm() {
    this.SubDistrictFrom.markAsPristine();
    this.SubDistrictFrom.patchValue(this.SubDistrictDetail);
    this.SubDistrictFrom.controls.ProvinceId.setValue(this.ProvinceId);
    this.SubDistrictFrom.controls.DistrictId.setValue(this.DistrictId);
  }

  prepareSave(values: Object) {
    Object.assign(this.SubDistrictDetail, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.SubDistrictFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      // this.statusSave = '';
      return;
    }
    if (this.SubDistrictFrom.controls.SubDistrictNameTha.value) {
      this.SubDistrictFrom.controls.SubDistrictNameTha.setValue(this.SubDistrictFrom.controls.SubDistrictNameTha.value.trim());
      if (this.SubDistrictFrom.controls.SubDistrictNameTha.value == null || this.SubDistrictFrom.controls.SubDistrictNameTha.value == '') {
        return;
      }
    }

    this.prepareSave(this.SubDistrictFrom.value);
    // if (this.statusSave) {
    this.js.CheckDuplicate(this.SubDistrictDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res) => {
          if (res) {
            this.onSave();
          } else {
            this.as.error('', 'ข้อมูลตำบล มีค่าซ้ำ');
          }
        }
      );
    // } else {
    //   this.onSave();
    // }
  }

  onSave() {
    this.js.saveSubDistrict(this.SubDistrictDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
        this.statusSave = false;
        this.ChangeValue = false;
      }))
      .subscribe(
        (res: any) => {
          this.SubDistrictDetail = res.Rows[0];
          this.rebuildForm();
          // this.CountryFrom.controls.CountryCode.disable();
          this.as.success('', 'Message.STD000033');
        }
      );
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'DBMT112');
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.SubDistrictFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/db/dbmt11-2', { ProvinceId: this.ProvinceId, DistrictId: this.DistrictId, inPageOpen: false }], { skipLocationChange: true });
  }
}
