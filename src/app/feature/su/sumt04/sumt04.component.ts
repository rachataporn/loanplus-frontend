import { Component, OnInit } from '@angular/core';
import { LangService, SaveDataService, AlertService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Page, ModalService, SelectFilterService, TableService, } from '@app/shared';
import { Sumt04Service } from './sumt04.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, RequiredValidator, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-sumt04',
  templateUrl: './sumt04.component.html',
})
export class Sumt04Component implements OnInit {
  page = new Page();
  searchForm: FormGroup;
  MenuList = [];

  beforeSearch = '';
  statusPage: boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private saveData: SaveDataService,
    private sumt04service: Sumt04Service,
    private as: AlertService,
    private fb: FormBuilder,
    private filter: SelectFilterService,
    private ts: TableService, ) { this.createForm(); }

  createForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page(),
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('SUMT04');
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

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    if (this.searchForm.controls.InputSearch.value) {
      this.searchForm.controls.InputSearch.setValue(this.searchForm.controls.InputSearch.value.trim());
    }
    this.onSearch();
  }

  onSearch() {
    this.sumt04service.getData(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
          this.MenuList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  add() {
    this.router.navigate(['/su/sumt04/detail'], { skipLocationChange: true });
  }

  edit(MenuCode) {
    this.router.navigate(['/su/sumt04/detail', { MenuCode: MenuCode }], { skipLocationChange: true });
  }

  remove(MenuCode: String, RowVersion: string) {
    this.modal.confirm('Message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.sumt04service.deleteMenu(MenuCode, RowVersion)
            .subscribe(response => {
              this.as.success('', 'Message.STD00014');
              this.page = this.ts.setPageIndex(this.page);
              this.search();
            });
        }
      });
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'sumt04') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'SUMT04');
    } else {
      this.saveData.delete('SUMT04');
    }
  }



}
