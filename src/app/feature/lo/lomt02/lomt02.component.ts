import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lomt02Service } from '@app/feature/lo/lomt02/lomt02.service';
import { Page,TableService, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lomt02.component.html'
})

export class Lomt02Component implements OnInit {

  loanList= [];
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
    private lomt02Service: Lomt02Service,
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
    const saveData = this.saveData.retrive('LOMT02');
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
    if (this.router.url.split('/')[2] === 'lomt02') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOMT02');
    } else {
      this.saveData.delete('LOMT02');
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
    this.lomt02Service.getLoanList(this.statusPage ? (this.searchForm.value) : this.beforeSearch,
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
    this.router.navigate(['/lo/lomt02/detail', { flagSearch: true}], { skipLocationChange: true });
  }

  edit(LoanTypeCode) {
    this.router.navigate(['/lo/lomt02/detail', {LoanTypeCode:LoanTypeCode }], { skipLocationChange: true });
  }

  look() {
    this.router.navigate(['/lo/lomt02/detail', { }], { skipLocationChange: true });
  }

  remove(LoanTypeCode,RowVersion) {
    this.modal.confirm("Message.STD000030").subscribe(
      (res) => {
        if (res) {
          this.lomt02Service.delete(LoanTypeCode,RowVersion)
            .subscribe(() => {
                this.as.success("", "Message.STD00014");
                this.page = this.ts.setPageIndex(this.page);
                this.search();
            });
        }
      })
  }

}
