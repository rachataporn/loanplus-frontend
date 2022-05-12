import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '@app/shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Lots02Service } from './lots02.service';

@Component({
  templateUrl: './lots02-lookup.component.html'
})
export class Lots02LookupComponent implements OnInit {
  itemsLOV = [];
  page = new Page();
  result: Subject<any>;
  searchForm: FormGroup;
  keyword: string;
  assetTypeList = [];
  province = [];
  submitted: boolean;
  focusToggle: boolean;
  constructor(
    public bsModalRef: BsModalRef,
    public as: Lots02Service,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      CreditType: [null, Validators.required],
      Province: [null, Validators.required],
    });

    this.searchForm.controls.CreditType.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.searchForm.controls.Province.enable();
          this.searchForm.controls.Province.reset();
          this.searchProvince(value);
        } else {
          this.searchForm.controls.Province.disable();
          this.searchForm.controls.Province.reset();
        }
      })
  }

  ngOnInit() {
    this.searchForm.controls.Province.disable();
    this.searchCreditType();
  }

  onTableEvent() {
    this.search();
  }

  search() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.as.getLookUp(this.searchForm.value, this.page)
      .subscribe(
        (res: any) => {
          this.itemsLOV = res.Rows;
          this.page.totalElements = res.Total;
          this.submitted = false;
        });
  }

  searchCreditType() {
    this.as.getMaster()
      .subscribe(
        (res: any) => {
          this.assetTypeList = res.AssetList;
        });
  }

  searchProvince(SecuritiesCategoryId) {
    this.as.getSearchProvince(SecuritiesCategoryId)
      .subscribe(
        (res: any) => {
          this.province = res.Province;
        });
  }

  select(key: string): void {
    this.result.next(key);
    this.bsModalRef.hide();
  }

  close(): void {
    this.result.next(null);
    this.bsModalRef.hide();
  }
}

