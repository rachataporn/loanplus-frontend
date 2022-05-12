import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page, SelectFilterService } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Dbmt10Service, Province } from './dbmt10.service';

@Component({
  templateUrl: './dbmt10-detail.component.html'
})
export class Dbmt10DetailComponent implements OnInit {

  ProvinceDetail: Province = {} as Province;
  ProvinceFrom: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  statusSave: boolean = true;
  CountryList = [];
  flag = '';
  CountryData = [];
  temp: any[];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Dbmt10Service,
    private modal: ModalService,
    private saveData: SaveDataService,
    public lang: LangService,
    private selectFilter: SelectFilterService
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.ProvinceFrom = this.fb.group({
      ProvinceId: null,
      ProvinceNameTha: [null, Validators.required],
      ProvinceNameEng: null,
      CountryCode: [null, Validators.required],
      Active: true,
    });

  }

  createBackSearchForm() {
    this.searchForm = this.fb.group({
      Province: null,
      InputSearch: null,
      flagSearch: false,
      beforeSearch: null
    });
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    const saveData = this.saveData.retrive('DBMT10');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.statusSave = true;
      this.ProvinceDetail = data.dbmt10.ProvinceDetail;
      this.CountryList = data.dbmt10.CountryList.CountryList;
      if (data.dbmt10.ProvinceDetail.CountryCode) {
        this.statusSave = false;
      }
      this.rebuildForm();
    });
    this.searchForm.controls.flagSearch.setValue(false);
    this.filterCountryCode();
  }

  bindDropDownList() {
    this.selectFilter.SortByLang(this.CountryList);
    this.CountryList = [...this.CountryList];
  }

  rebuildForm() {
    this.ProvinceFrom.markAsPristine();
    this.ProvinceFrom.patchValue(this.ProvinceDetail);
  }

  filterCountryCode() {
    this.CountryData = this.CountryList.filter(item => item.active === false);
    this.CountryData = this.selectFilter.FilterActive(this.CountryData);
    this.selectFilter.SortByLang(this.CountryData);
    this.CountryData = [...this.CountryData];
  }

  prepareSave(values: Object) {
    Object.assign(this.ProvinceDetail, values);
  }

  onSubmit() {
    if (this.ProvinceFrom.invalid) {
      this.submitted = true;
      this.focusToggle = !this.focusToggle;
      return;
    }
    if (this.ProvinceFrom.controls.ProvinceNameTha.value) {
      this.ProvinceFrom.controls.ProvinceNameTha.setValue(this.ProvinceFrom.controls.ProvinceNameTha.value.trim());
      if (this.ProvinceFrom.controls.ProvinceNameTha.value == null || this.ProvinceFrom.controls.ProvinceNameTha.value == '') {
        return;
      }
    }
    this.prepareSave(this.ProvinceFrom.getRawValue());
    // if (this.statusSave) {
    this.js.CheckDuplicate(this.ProvinceDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res) => {
          if (res) {
            this.onSave();
          } else {
            this.as.warning('', 'Label.DBMT10.DuplicateProvince');
          }
        }
      );
    // } else {
    //   this.onSave();
    // }
  }

  onSave() {
    this.js.saveProvince(this.ProvinceDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res) => {
          this.ProvinceDetail = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD000033');
        }
      );
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'dbmt10') {
      this.saveData.save(this.searchForm.value, 'DBMT10');
    } else {
      this.saveData.save(this.searchForm.value, 'DBMT10');
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.ProvinceFrom.dirty) {
      return true;
    }

    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/db/dbmt10'], { skipLocationChange: true });
  }
}
