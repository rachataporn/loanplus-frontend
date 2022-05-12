import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lomt11Service } from '@app/feature/lo/lomt11/lomt11.service';
import { Page,TableService, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lomt11.component.html'
})

export class Lomt11Component implements OnInit {

  invoiceList = [];
  menuForm: FormGroup;
  count: Number = 5;
  page = new Page();
  beforeSearch = '';
  statusPage: boolean;
  searchForm: FormGroup;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private Lomt11Service: Lomt11Service,
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
      beforeSearch: null
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LOMT04');
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
    this.saveData.save(this.searchForm.value, 'LOMT04');
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
    this.Lomt11Service.getInvoice(this.statusPage ? (this.searchForm.value) : this.beforeSearch,
      this.page)
      .pipe(finalize(() => {
        if (this.statusPage) {
          this.beforeSearch = this.searchForm.value;
          this.searchForm.controls.beforeSearch.setValue(this.beforeSearch);
        }
      }))
      .subscribe(
        (res: any) => {
          this.invoiceList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  add() {
    this.router.navigate(['/lo/lomt08/detail', { flagSearch: true }], { skipLocationChange: true });
  }

  edit(InvoiceItemCode) {
    this.router.navigate(['/lo/lomt08/detail', {InvoiceItemCode:InvoiceItemCode }], { skipLocationChange: true });
  }

  remove(InvoiceItemCode,RowVersion) {
    this.modal.confirm("Message.STD000030").subscribe(
      (res) => {
        if (res) {
          this.Lomt11Service.delete(InvoiceItemCode,RowVersion)
            .subscribe(() => {
                this.as.success("", "Message.STD00014");
                this.page = this.ts.setPageIndex(this.page);
                this.search();
            });
        }
      })
  }

}
