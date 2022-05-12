import { Component, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Lots24BService } from './lots24B.service';
import { LangService, SaveDataService, AlertService } from '@app/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './main-contract-lookup.component.html'
})
export class Lots24BMainContractLookupComponent {
  searchForm: FormGroup;
  company = [];
  loanType = [];
  loanTypeData = [];
  submitted: boolean;
  keyword: string;
  contracts = [];
  count: number = 0;
  page = new Page();

  result: Subject<any>;
  customerSelected = [];
  parameter: any = {};
  constructor(
    public modalRef: BsModalRef,
    public lots24: Lots24BService,
    private lang: LangService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    private saveData: SaveDataService,
    private as: AlertService,
    private selectFilter: SelectFilterService

  ) { }

  ngOnInit() {
    this.search();
  }

  bindDropdownlist() {
    this.selectFilter.SortByLang(this.company);
    this.company = [...this.company];
    this.filterLoanType(null);
  }

  filterLoanType(CompanyCode?: string) {
    if (CompanyCode) {
      this.loanTypeData = this.loanType.filter(item => { return item.CompanyCode == CompanyCode });
      this.selectFilter.SortByLang(this.loanTypeData);
      this.loanTypeData = [...this.loanTypeData];
    } else {
      this.loanTypeData = [];
      this.loanTypeData = [...this.loanTypeData];
    }
  }


  onTableEvent(event) {
    this.page = event;
    this.search();
  }

  search(reset?: boolean) {
    //
    if (reset) this.page.index = 0;
    this.lots24.getMainContractLookup(Object.assign(this.parameter, { keyword: this.keyword }), this.page)
      // .pipe(finalize(() => { }))
      .subscribe(
        (res) => {
          this.contracts = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  select(key: string): void {
    this.result.next(key);
    this.modalRef.hide();
  }

  close(): void {
    this.result.next(null);
    this.modalRef.hide();
  }
}