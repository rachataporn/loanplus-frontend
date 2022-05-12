import { Component, Output, EventEmitter } from '@angular/core';
import { LangService } from '@app/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lots01Service } from './lots01.service';
import { Page } from '../../../shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectFilterService} from '@app/shared';
@Component({
  templateUrl: './lots01-modal.component.html'
})
export class Lots01ModalComponent {
  assetTypeList = [];
  assetType = [];
  assetTypeData = [];
  modalList = [];
  count: Number = 0;
  page = new Page();
  CustomerCode: String;
  keyword: String = '';
  @Output() selected = new EventEmitter<any[]>();
  subject: Subject<any>;
  companySelected = [];
  searchForm: FormGroup;
  constructor(
    public modalRef: BsModalRef,
    public lots01Service: Lots01Service,
    public lang: LangService,
    private fb: FormBuilder,
    private filter: SelectFilterService,
  ) {  this.createForm(); }

  createForm() {
    this.searchForm = this.fb.group({
      SecuritiesType: null,
      DateFrom: null,
      DateTo: null,
      Keyword: null,
    });
    this.searchForm.valueChanges.subscribe(
      (value) => {
        this.search();
      }
    );
  }

  ngOnInit() {
    this.securitiesCategory();
    this.search();
  }

  onTableEvent(event) {
    this.page = event;
    this.search();
  }

  securitiesCategory() {
    this.lots01Service.getSecuritiesCategory()
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          
          this.assetTypeData = res.SecuritiesCategoryList;
          this.bindDropDownsecuritiesCategory(true);
        });
  }

  bindDropDownsecuritiesCategory(filter?: boolean) {
    if (filter) {
      if (this.searchForm.controls.SecuritiesType.value) {
        this.assetType = this.filter.FilterActiveByValue(this.assetTypeData, this.searchForm.controls.Religion.value);
      } else {
        this.assetType = this.filter.FilterActive(this.assetTypeData);
      }
    }
    this.filter.SortByLang(this.assetType);
    this.assetTypeList = [...this.assetType];
    return;
  }

  search() {
    this.lots01Service.getModalSecurities(this.searchForm.value, this.page, this.CustomerCode)
      .pipe(finalize(() => {
        this.companySelected = [];
      }))
      .subscribe(
        (res: any) => {
          this.modalList = res.Rows;
          this.count = res.Rows.length ? res.Total : 0;
        });
  }

  select(): void {
    this.selected.next(this.companySelected);
    this.modalRef.hide();
  }

  close(): void {
    this.selected.next([]);
    this.modalRef.hide();
  }
}
