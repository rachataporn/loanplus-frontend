import { Component, OnInit } from '@angular/core';
import { LangService, SaveDataService, AlertService } from '@app/core';
import { Router } from '@angular/router';
import { Page, ModalService, TableService, } from '@app/shared';
import { Sumt06Service } from './sumt06.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({ templateUrl: './sumt06.component.html' })

export class Sumt06Component implements OnInit {
  searchForm: FormGroup;
  passwordPolicy = [];
  page = new Page();

  statusPage: boolean;
  beforeSearch = '';
  constructor(
    private router: Router,
    private modal: ModalService,
    private saveData: SaveDataService,
    private as: AlertService,
    private fb: FormBuilder,
    private sumt06: Sumt06Service,
    private ts: TableService, ) { this.createForm() }

  createForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page(),
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('SUMT06');
    if (saveData) { this.searchForm.patchValue(saveData); }
    const pageData = this.saveData.retrive('SUMT06Page');
    if (pageData) { this.page = pageData; }

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
    this.sumt06.getPasswordPolicy(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
          this.passwordPolicy = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }


  add() {
    this.router.navigate(['/su/sumt06/detail'], { skipLocationChange: true });
  }

  edit(PasswordPolicyCode) {
    this.router.navigate(['/su/sumt06/detail', { PasswordPolicyCode: PasswordPolicyCode, }], { skipLocationChange: true });
  }

  remove(PasswordPolicyCode: string, RowVersion: any) {
    this.modal.confirm('Message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.sumt06.delete(PasswordPolicyCode, RowVersion)
            .subscribe(response => {
              this.as.success('', 'Message.STD00014');
              this.page = this.ts.setPageIndex(this.page);
              this.search();
            });
        }
      });
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'SUMT06');
    this.saveData.save(this.page,'SUMT06Page');
  }
}
