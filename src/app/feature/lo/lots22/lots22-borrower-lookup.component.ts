import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '@app/shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Lots22Service } from './lots22.service';

@Component({
  templateUrl: './lots22-borrower-lookup.component.html'
})
export class Lots22BorrowerLookupComponent implements OnInit {
  itemsLOV = [];
  page = new Page();
  result: Subject<any>;
  searchForm: FormGroup;
  keyword: string;

  constructor(
    public bsModalRef: BsModalRef,
    public as: Lots22Service,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      CustomerCode: null,
      CustomerName: null,
      IdCard: null
    });
  }

  ngOnInit() {
    this.searchForm.controls.CustomerCode.setValue(this.keyword);
    this.search();
  }

  onTableEvent() {
    this.search();
  }

  search() {
    this.as.getBorrowerLOV(this.searchForm.value, this.page)
      .subscribe(
        (res: any) => {
          this.itemsLOV = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  select(key: number): void {
    this.result.next(key);
    this.bsModalRef.hide();
  }

  close(): void {
    this.result.next(null);
    this.bsModalRef.hide();
  }
}

