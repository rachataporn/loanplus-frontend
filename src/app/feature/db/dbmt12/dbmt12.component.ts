import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Dbmt12Service } from '@app/feature/db/dbmt12/dbmt12.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './dbmt12.component.html'
})

export class Dbmt12Component implements OnInit, OnDestroy {
  positionList = [];
  page = new Page();
  searchForm: FormGroup;
  statusPage: boolean;
  beforeSearch = '';

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private dbmt12Service: Dbmt12Service,
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
    const saveData = this.saveData.retrive('DBMT12');
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
    if (this.router.url.split('/')[2] == "dbmt12") {
      this.saveData.save(this.searchForm.value, 'DBMT12');
    } else {
      this.saveData.delete('DBMT12');
    };
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
    if (this.searchForm.controls.InputSearch.value) {
      this.searchForm.controls['InputSearch'].setValue(this.searchForm.controls['InputSearch'].value);
    }
    this.dbmt12Service.getData(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
          this.positionList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  add() {
    this.router.navigate(['/db/dbmt12/detail'], { skipLocationChange: true });
  }

  edit(PositionCode) {
    this.router.navigate(['/db/dbmt12/detail', { PositionCode: PositionCode }], { skipLocationChange: true });
  }

  remove(PositionCode: string, RowVersion: any) {
    this.modal.confirm('Message.STD000030').subscribe(
      (res) => {
        if (res) {
          this.dbmt12Service.deletePosition(PositionCode, RowVersion).subscribe(
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
