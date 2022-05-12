import { Component, OnInit } from '@angular/core';
import { LangService } from '@app/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page, SelectFilterService } from '@app/shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Lots07Service } from './lots07.service';

@Component({
  templateUrl: './lots07-lookup-detail.component.html'
})
export class Lots07LookupDetailComponent implements OnInit {
  itemsLOV = [];
  count = 0;
  page = new Page();
  
  result: Subject<any>;
  searchForm: FormGroup;
  invoiceStatusList = [];
  contractListSelect = [];
  keyword: string;

  constructor(
      public bsModalRef: BsModalRef,
      public as: Lots07Service,
      private fb: FormBuilder,
      public lang: LangService,
      private selectFilter: SelectFilterService
  ) {
      this.createForm();
  }

  createForm() {
      this.searchForm = this.fb.group({
          LoanNo: null,
          CustomerCode: null,
          CustomerName: null,
          LoanDate: null,
          LoanStatus: null,
          LovStatus: "detail"
      });
  }

  ngOnInit() {
      this.searchForm.controls.LoanNo.setValue(this.keyword);
      this.as.getInvoiceStatusDDL("detail").subscribe(
          (res) => {
              this.invoiceStatusList = res.InvoiceStatusList;
              this.selectFilter.SortByLang(this.invoiceStatusList);
              this.invoiceStatusList = [...this.invoiceStatusList];
          }
      );
      this.search();
  }

  onTableEvent(event) {
      this.page = event;
      this.search();
  }

  search(reset?: boolean) {
      if (reset) this.page.index = 0;
      this.as.getContractNoLOV(this.searchForm.value, this.page)
          .pipe(finalize(() => {
          }))
          .subscribe(
              (res: any) => {
                  this.itemsLOV = res.Rows ? res.Rows : [];
                  this.page.totalElements = res.Total;
              });
  }

  select(key): void {
      this.result.next(key);
      this.bsModalRef.hide();
  }

  close(): void {
      const value = { value: null }
      this.result.next(null);
      this.bsModalRef.hide();
  }
}

