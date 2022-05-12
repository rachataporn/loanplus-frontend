import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots30Service } from '@app/feature/lo/lots30/lots30.service';
import { Page, ModalService, ModalRef, Size } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lots30.component.html'
})

export class Lots30Component implements OnInit {
  searchForm: FormGroup;
  searchFormApprove: FormGroup;
  branchDDL = [];
  loanPaymentsList = [];
  page = new Page();
  beforeSearch = '';
  statusPage: boolean;
  cashSubmitStatusList = [];
  pageApprove = new Page();
  statusPageApprove: boolean;
  loanPaymentsListApprove = [];

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lots30Service: Lots30Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      cashSubmitNo: null,
      fromBranch: null,
      toBranch: null,
      fromDate: null,
      toDate: null
    });
    this.searchFormApprove = this.fb.group({
      cashSubmitNoApprove: null,
      fromBranchApprove: null,
      toBranchApprove: null,
      fromDateApprove: null,
      toDateApprove: null
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.branchDDL = data.lots30.company;
      this.cashSubmitStatusList = data.lots30.master.CashSubmitStatus;
    });

    this.onSearch();
    this.onSearchApprove();
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    this.onSearch();
  }

  onSearch() {
    this.lots30Service.getCashSubmitList(this.searchForm.value, this.page)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.loanPaymentsList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  onTableEventApprove(event) {
    this.pageApprove = event;
    this.statusPageApprove = false;
    this.onSearchApprove();
  }

  searchApprove() {
    this.pageApprove = new Page();
    this.statusPageApprove = true;
    this.onSearchApprove();
  }

  onSearchApprove() {
    this.lots30Service.getCashSubmitListApprove(this.searchFormApprove.value, this.pageApprove)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.loanPaymentsListApprove = res.Rows;
          this.pageApprove.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lots30') {
      this.saveData.save(this.searchForm.value, 'LOTS30');
    } else {
      this.saveData.delete('LOTS30');
    }
  }

  add() {
    this.router.navigate(['/lo/lots30/detail'], { skipLocationChange: true });
  }

  edit(CashSubmitHeadId) {
    this.router.navigate(['/lo/lots30/detail', { CashSubmitHeadId: CashSubmitHeadId }], { skipLocationChange: true });
  }

  open(data) {
    this.OpenWindow(data)
  }

  async OpenWindow(data) {
    await window.open(data, '_blank');
  }
}
