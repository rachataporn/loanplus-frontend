import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '@app/shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Lots09Service } from './lots09.service';

@Component({
  templateUrl: './lots09-contract-lookup.component.html'
})
export class Lots09ContractLookupComponent implements OnInit {
  itemsLOV = [];
  page = new Page();
  result: Subject<any>;
  searchForm: FormGroup;
  keyword: string;

  constructor(
    public bsModalRef: BsModalRef,
    public as: Lots09Service,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      CustomerCode: null,
      CustomerName: null,
      LoanNo: null,
      IdCard: null
    });
  }

  ngOnInit() {
    this.searchForm.controls.LoanNo.setValue(this.keyword);
    this.search();
  }

  onTableEvent() {
    this.search();
  }

  search() {
    this.as.getContractLOV(this.searchForm.value, this.page)
      .subscribe(
        (res: any) => {
          this.itemsLOV = res.Rows;
          this.page.totalElements = res.Total;
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

