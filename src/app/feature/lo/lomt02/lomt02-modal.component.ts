import { Component, Output, EventEmitter } from '@angular/core';
import { LangService } from '@app/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lomt02Service } from './lomt02.service';
import { Page } from '../../../shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './lomt02-modal.component.html'
})
export class Lomt02ModalComponent {

  modalList = [];
  page = new Page();
  searchForm: FormGroup;

  LoanTypeCode: String;
  keyword: string;

  @Output() selected = new EventEmitter<any[]>();
  subject: Subject<any>;
  companySelected = [];

  constructor(
    public modalRef: BsModalRef,
    public lomt02Service: Lomt02Service,
    public lang: LangService,
    private fb: FormBuilder,

  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      CompanyCode: null,
      LoanTypeCode: null,
    });
  }

  ngOnInit() {
    this.searchForm.controls.CompanyCode.setValue(this.keyword);
    this.search();
  }

  onTableEvent(event) {
    this.page = event;
    this.search();
  }

  search(reset?: boolean) {
    if (reset) { this.page.index = 0; }
    this.lomt02Service.getCompanyModal(this.searchForm.value, this.page)
      .pipe(finalize(() => {
        // this.companySelected = [];
      }))
      .subscribe(
        (res: any) => {
          this.modalList = res.Rows
          this.page.totalElements = res.Total;
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
