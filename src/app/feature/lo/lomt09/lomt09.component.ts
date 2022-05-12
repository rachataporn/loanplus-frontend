import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lomt09Service } from '@app/feature/lo/lomt09/lomt09.service';
import { Page, TableService, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lomt09.component.html'
})

export class Lomt09Component implements OnInit {

  attributes = [];
  page = new Page();
  beforeSearch = '';
  statusPage: boolean;
  searchForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modal: ModalService,
    private service: Lomt09Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
  ) { this.createForm(); }

  createForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page()
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LOMT09');
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
    if (this.router.url.split('/')[2] === 'lomt09') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOMT09');
    } else {
      this.saveData.delete('LOMT09');
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
    this.service.getAttributes(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
          this.attributes = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  add() {
    this.router.navigate(['/lo/lomt09/detail'], { skipLocationChange: true });
  }

  edit(id) {
    this.router.navigate(['/lo/lomt09/detail', { id: id }], { skipLocationChange: true });
  }

  remove(id: number, RowVersion) {
    this.modal.confirm('Message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.service.deleteAttribute(id, RowVersion).subscribe(
            (response) => {
              if (response) {
                this.as.success('', 'Message.STD00014');
                this.search();
              }
            });
        }
      });
  }

}
