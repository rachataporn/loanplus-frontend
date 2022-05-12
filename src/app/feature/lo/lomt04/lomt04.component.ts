import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lomt04Service } from '@app/feature/lo/lomt04/lomt04.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lomt04.component.html'
})

export class Lomt04Component implements OnInit, OnDestroy {
  receiveTypeList = [];
  page = new Page();
  searchForm: FormGroup;
  statusPage = true;
  beforeSearch = '';

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lomt04Service: Lomt04Service,
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
      page: new Page(),
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LOMT04');
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

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lomt04') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOMT04');
    } else {
      this.saveData.delete('LOMT04');
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
    if (this.searchForm.controls['InputSearch'].value) {
      this.searchForm.controls['InputSearch'].setValue(this.searchForm.controls['InputSearch'].value.trim());
    }
    this.onSearch();
  }

  onSearch() {
    this.lomt04Service.getData(this.statusPage ? (this.searchForm.value) : this.beforeSearch,
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
          this.receiveTypeList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  add() {
    this.router.navigate(['/lo/lomt04/detail', { flagSearch: true }], { skipLocationChange: true });
  }

  edit(ReceiveTypeCode) {
    this.router.navigate(['/lo/lomt04/detail', { ReceiveTypeCode: ReceiveTypeCode }], { skipLocationChange: true });
  }

  remove(ReceiveTypeCode: string, RowVersion: any) {
    this.modal.confirm('Message.STD000030').subscribe(
      (res) => {
        if (res) {
          this.lomt04Service.deleteReceiveType(ReceiveTypeCode, RowVersion).subscribe(
            (response) => {
              this.as.success(' ', 'Message.STD00014');
              this.search();
            }, (error) => {
              console.log(error);
              this.as.error(' ', 'Message.STD000032');
            });
        }
      });
  }
}
