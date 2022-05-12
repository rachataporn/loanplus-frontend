import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lomt12Service } from '@app/feature/lo/lomt12/lomt12.service';
import { Page, TableService, ModalService, Size } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lomt12ModalComponent } from './lomt12-modal.component';

@Component({
  templateUrl: './lomt12.component.html'
})

export class Lomt12Component implements OnInit {

  loanList = [];
  menuForm: FormGroup;
  // count: Number = 5;
  page = new Page();
  beforeSearch = '';
  statusPage: boolean;
  searchForm: FormGroup;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lomt12Service: Lomt12Service,
    private lang: LangService,
    private ts: TableService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page()
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LOMT12');
    if (saveData) { this.searchForm.patchValue(saveData); }

    if (!this.searchForm.controls.flagSearch.value) {
      this.beforeSearch = this.searchForm.controls.beforeSearch.value;
      this.statusPage = this.searchForm.controls.flagSearch.value;
    } else {
      this.statusPage = true;
    }

    this.onSearch();
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lomt12') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOMT12');
    } else {
      this.saveData.delete('LOMT12');
    }
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
    if (this.searchForm.controls['InputSearch'].value) {
      this.searchForm.controls['InputSearch'].setValue(this.searchForm.controls['InputSearch'].value.trim());
    }
    this.lomt12Service.getLoanList(this.statusPage ? (this.searchForm.value) : this.beforeSearch,
      this.page)
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
          this.loanList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  add() {
    this.modal.openComponent(Lomt12ModalComponent, Size.large);
  }

  // edit(LoanTypeCode) {
  //   this.router.navigate(['/lo/lomt12/detail', { LoanTypeCode: LoanTypeCode }], { skipLocationChange: true });
  // }

  edit(LoanTypeCode) {
    this.lomt12Service.checkLoanTypeBorrowerDeatil(LoanTypeCode)
      .subscribe(
        (res: any) => {
          this.router.navigate(['/lo/lomt12/detail', { LoanTypeCode: LoanTypeCode }], { skipLocationChange: true });
        });
  }

  remove(LoanTypeCode, RowVersion) {
    this.modal.confirm("Message.STD000030").subscribe(
      (res) => {
        if (res) {
          this.lomt12Service.delete(LoanTypeCode, RowVersion)
            .subscribe(() => {
              this.as.success("", "Message.STD00014");
              this.page = this.ts.setPageIndex(this.page);
              this.search();
            });
        }
      })
  }

}
