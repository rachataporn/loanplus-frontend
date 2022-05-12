import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '@app/shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Lots18Service } from './lots18.service';
import { LangService } from '@app/core';

@Component({
  templateUrl: './lots18-contract-lookup.component.html'
})
export class Lots18ContractLookupComponent implements OnInit {
  itemsLOV = [];
  page = new Page();
  result: Subject<any>;
  searchForm: FormGroup;
  keyword: string;

  constructor(
    public bsModalRef: BsModalRef,
    public as: Lots18Service,
    private fb: FormBuilder,
    public lang: LangService
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

  select(key: any): void {
    this.result.next(key);
    this.bsModalRef.hide();
  }

  close(): void {
    this.result.next(null);
    this.bsModalRef.hide();
  }
}

