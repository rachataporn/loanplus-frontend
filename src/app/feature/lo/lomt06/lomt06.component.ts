import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lomt06Service } from '@app/feature/lo/lomt06/lomt06.service';
import { Page, ModalService, TableService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lomt06.component.html'
})

export class Lomt06Component implements OnInit {
  groupList = [];
  count = 0;
  page = new Page();
  searchForm: FormGroup;
  statusPage: boolean;
  beforeSearch = '';

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lomt06Service: Lomt06Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private ts: TableService,
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
    const saveData = this.saveData.retrive('LOMT06');
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
    if (this.router.url.split('/')[2] === 'lomt06') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOMT06');
    } else {
      this.saveData.delete('LOMT06');
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
    this.lomt06Service.getData(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
          this.groupList = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  add() {
    this.router.navigate(['/lo/lomt06/detail', { flagSearch: true }], { skipLocationChange: true });
  }

  edit(GroupCode) {
    this.router.navigate(['/lo/lomt06/detail', { GroupCode: GroupCode }], { skipLocationChange: true });
  }

  remove(GroupCode: string, RowVersion: any) {
    this.modal.confirm('Message.STD000030').subscribe(
      (res) => {
        if (res) {
          this.lomt06Service.deleteGroup(GroupCode, RowVersion).subscribe(
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
