import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '@app/shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Lots21Service } from './lots21.service';

@Component({
  templateUrl: './lots21-contract-lookup.component.html'
})
export class Lots21ContractLookupComponent implements OnInit {
  itemsLOV = [];
  page = new Page();
  result: Subject<any>;
  searchForm: FormGroup;
  keyword: string;
  attributeSelected = [];
  CompanyDestination : string;
  @Output() selected = new EventEmitter<any[]>();


  constructor(
    public bsModalRef: BsModalRef,
    public as: Lots21Service,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      CustomerCode: null,
      CustomerName: null,
      LoanNo: null,
      IdCard: null,
      CompanyDestination: null
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
    this.searchForm.controls.CompanyDestination.setValue(this.CompanyDestination);
    this.as.getContractLOV(this.searchForm.value, this.page)
    .pipe(finalize(() => {
        
      this.attributeSelected = [];
    }))
      .subscribe(
        (res: any) => {
          this.itemsLOV = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  select(): void {
    this.selected.next(this.attributeSelected);
    this.bsModalRef.hide();
  }

  close(): void {
    this.selected.next([]);
    this.bsModalRef.hide();
  }
}

