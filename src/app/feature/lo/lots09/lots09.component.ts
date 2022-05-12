import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots09Service } from '@app/feature/lo/lots09/lots09.service';
import { Page, ModalService, ModalRef, Size } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lots09ContractLookupComponent } from './lots09-contract-lookup.component';
import { Lots09ReceiptLookupComponent } from './lots09-receipt-lookup.component';

@Component({
  templateUrl: './lots09.component.html'
})

export class Lots09Component implements OnInit {
  Lots09ContractLookupContent = Lots09ContractLookupComponent;
  Lots09ReceiptLookupContent = Lots09ReceiptLookupComponent;
  searchForm: FormGroup;
  branchDDL = [];
  paidStatus = [];
  loanPaymentsList = [];
  page = new Page();

  beforeSearch = '';
  statusPage: boolean;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lots09Service: Lots09Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      Branch: null,
      ReceiptDateFrom: null,
      ReceiptDateTo: null,
      ContractNoFrom: null,
      ContractNoTo: null,
      ReceiptNoFrom: null,
      ReceiptNoTo: null,
      CustomerCode: null,
      PaidStatus: '',
      flagSearch: true,
      beforeSearch: null,
      page: new Page(),
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.branchDDL = data.receiptDetail.Branch;
      this.paidStatus = data.receiptDetail.PaidStatus;
    });
    const saveData = this.saveData.retrive('LOTS09');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.page = this.searchForm.controls.page.value;
    if (!this.searchForm.controls.flagSearch.value) {
      this.beforeSearch = this.searchForm.controls.beforeSearch.value;
      this.statusPage = this.searchForm.controls.flagSearch.value;
    } else {
      this.statusPage = true;
    }
    this.onSearch();
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    if (this.searchForm.controls.CustomerCode.value) {
      this.searchForm.controls.CustomerCode.setValue(this.searchForm.controls.CustomerCode.value.trim());
    }
    this.onSearch();
  }

  onSearch() {
    this.lots09Service.getReceiptDetailList(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
      .pipe(finalize(() => {
        if (this.statusPage) {
          this.beforeSearch = this.searchForm.value;
          this.searchForm.controls.beforeSearch.reset();
          this.searchForm.controls.page.setValue(this.page);
          this.searchForm.controls.beforeSearch.setValue(this.searchForm.value);
        }
      }))
      .subscribe(
        (res: any) => {
          this.loanPaymentsList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lots09') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOTS09');
    } else {
      this.saveData.delete('LOTS09');
    }
  }

  onViewInformation(ReceiptHeadId) {
    this.router.navigate(['/lo/lots09/detail', { ReceiptHeadId: ReceiptHeadId }], {
      skipLocationChange: true
    });
  }
}
