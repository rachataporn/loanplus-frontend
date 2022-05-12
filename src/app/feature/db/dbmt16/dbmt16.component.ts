import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Dbmt16Service } from '@app/feature/db/dbmt16/dbmt16.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './dbmt16.component.html'
})

export class Dbmt16Component implements OnInit, OnDestroy {
  documentTypeList = [];
  page = new Page();
  searchForm: FormGroup;
  statusPage = true;
  beforeSearch = '';
  systemList = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    private dbmt16Service: Dbmt16Service,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      System: null,
      flagSearch: true,
      beforeSearch: null
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.systemList = data.dbmt16.systemList.SystemList;
    });

    const saveData = this.saveData.retrive('DBMT16');
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
    this.saveData.save(this.searchForm.value, 'DBMT16');
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
    this.dbmt16Service.getData(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
      .pipe(finalize(() => {
        if (this.statusPage) {
          this.beforeSearch = this.searchForm.value;
          this.searchForm.controls.beforeSearch.setValue(this.beforeSearch);
        }
      }))
      .subscribe(
        (res: any) => {
          this.documentTypeList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  add() {
    this.router.navigate(['/db/dbmt16/detail', { flagSearch: true }], { skipLocationChange: true });
  }

  edit(DocumentTypeCode) {
    this.router.navigate(['/db/dbmt16/detail', { DocumentTypeCode: DocumentTypeCode }], { skipLocationChange: true });
  }

  remove(row) {
    this.modal.confirm('Message.STD000030').subscribe(
      (res) => {
        if (res) {
          this.dbmt16Service.deleteDocumentType(row.DocumentTypeCode, row.RowVersion).subscribe(
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
