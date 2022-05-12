import { Component, OnInit } from '@angular/core';
import { LangService, SaveDataService, AlertService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Page, ModalService, SelectFilterService, TableService, } from '@app/shared';
import { Sumt08Service } from './sumt08.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, RequiredValidator, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-sumt08',
  templateUrl: './sumt08.component.html',
  // styleUrls: ['./sumt08.component.scss']
})
export class Sumt08Component implements OnInit {

  searchForm: FormGroup;
  parameterGroupCodeDDL: [];
  system: [];
  Parameterlist: [];

  statusPage: boolean;
  beforeSearch = '';
  page = new Page();
  constructor(private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private sumt08service: Sumt08Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private fb: FormBuilder,
    private filter: SelectFilterService,

    private ts: TableService, ) { this.createForm(); }

  createForm() {
    this.searchForm = this.fb.group({
      ParameterGroupCodeSearch: null,
      InputSearch: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page(),
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('SUMT08');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.page = this.searchForm.controls.page.value;
    if (!this.searchForm.controls.flagSearch.value) {
      this.beforeSearch = this.searchForm.controls.beforeSearch.value;
      this.statusPage = this.searchForm.controls.flagSearch.value;
    } else {
      this.statusPage = true;
    }
    this.route.data.subscribe((data) => {
      this.parameterGroupCodeDDL = data.sumt08.groupParameter.ParameterGroupCodeList;
    });
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
    this.sumt08service.getData(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
          this.Parameterlist = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  edit(ParameterGroupCode, ParameterCode) {
    this.router.navigate(['/su/sumt08/detail', { ParameterGroupCode: ParameterGroupCode, ParameterCode: ParameterCode }], { skipLocationChange: true });
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'sumt08') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'SUMT08');
    } else {
      this.saveData.delete('SUMT08');
    }
  }
}
