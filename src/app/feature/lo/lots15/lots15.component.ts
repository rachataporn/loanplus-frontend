import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots15Service } from '@app/feature/lo/lots15/lots15.service';
import { Page, ModalService, ModalRef, Size } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lots15ContractLookupComponent } from './lots15-contract-lookup.component';
import { Lots15ReceiptLookupComponent } from './lots15-receipt-lookup.component';

@Component({
  templateUrl: './lots15.component.html'
})

export class Lots15Component implements OnInit {
  lots15ContractLookupContent = Lots15ContractLookupComponent;
  lots15ReceiptLookupContent = Lots15ReceiptLookupComponent;
  searchForm: FormGroup;
  branchDDL = [];
  paidStatus = [];
  loanPaymentsList = [];
  page = new Page();

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lots09Service: Lots15Service,
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
      PaidStatus: ''
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('lots15');
    if (saveData) this.searchForm.patchValue(saveData);

    this.route.data.subscribe((data) => {
      this.branchDDL = data.Lots15.Branch;
      this.paidStatus = data.Lots15.PaidStatus;
    });
    this.search();
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'lots15');
  }

  onTableEvent(event) {
    this.page = event;
    this.search();
  }

  search() {
    this.lots09Service.getReceiptDetailList(this.searchForm.value,
      this.page)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.loanPaymentsList = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  onViewInformation(ReceiptHeadId) {
    this.router.navigate(['/lo/lots15/detail', { ReceiptHeadId: ReceiptHeadId }], {
      skipLocationChange: true
    });
  }
}
