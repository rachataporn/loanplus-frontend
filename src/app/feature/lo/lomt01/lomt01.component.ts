import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page, ModalService, TableService } from '@app/shared';
import { Lomt01Service } from './lomt01.service';
import { AlertService, SaveDataService, LangService } from '@app/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
@Component({
  templateUrl: './lomt01.component.html'
})

export class Lomt01Component implements OnInit {
  securitiesLists = [];
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;
  beforeSearch = '';

  constructor(
    private router: Router,
    private modal: ModalService,
    private Lomt01Service: Lomt01Service,
    public lang: LangService,
    private fb: FormBuilder,
    private saveData: SaveDataService,
    private as: AlertService,
    private ts: TableService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      keywords: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page()
    });
  }

  ngOnInit() {
    let saveData = this.saveData.retrive("LOMT01");
    if (saveData) {
      this.searchForm.patchValue(saveData);
    }

    this.page = this.searchForm.controls.page.value;
    if (!this.searchForm.controls.flagSearch.value) {
      this.beforeSearch = this.searchForm.controls.beforeSearch.value;
      this.statusPage = this.searchForm.controls.flagSearch.value;
    } else {
      this.statusPage = true;
    }
    this.search();
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lomt01') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOMT01');
    } else {
      this.saveData.delete('LOMT01');
    }
  }

  add() {
    this.router.navigate(['/lo/lomt01/detail'], { skipLocationChange: true });
  }

  edit(CategoryId) {
    this.router.navigate(['/lo/lomt01/detail', { CategoryId: CategoryId }], { skipLocationChange: true });
  }

  remove(id: number, version: string) {
    this.modal.confirm("Message.STD00003").subscribe(
      (res) => {
        if (res) {
          this.Lomt01Service.deleteCategory(id, version)
            .subscribe(response => {
              this.as.success("", "Message.STD00014");
              this.page = this.ts.setPageIndex(this.page);
              this.search();
            });
        }
      })
  }

  templatview(templateViewID, templateName) {
    this.saveData.save('LOTS01Page', 'LOTS01Page');
    this.router.navigate(['/lo/lomt10-2', { templateViewID: templateViewID, templateName: templateName, programCode: 'lomt01' }], { skipLocationChange: true });
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.search();
  }

  onSearch() {
    this.page = new Page();
    this.statusPage = true;
    this.search();
  }

  search() {
    if (this.searchForm.controls.keywords.value) {
      this.searchForm.controls.keywords.setValue(this.searchForm.controls.keywords.value.trim());
    }
    this.Lomt01Service.getSecuritiesLists(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
          this.securitiesLists = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

}
