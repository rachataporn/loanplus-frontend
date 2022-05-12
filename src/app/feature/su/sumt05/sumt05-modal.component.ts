import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LangService } from '@app/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Sumt05Service } from './sumt05.service';
import { Page } from '../../../shared';

@Component({
  templateUrl: './sumt05-modal.component.html'
})
export class Sumt05ModalComponent implements OnInit {
  getMenuLists = [];
  count: Number = 0;
  page = new Page();
  
  MenuCode: String;
  statusPage: boolean;
  parameter: any = {};
  keyword: string = "";
  beforeSearch = '';
  attributeSelected = [];
  @Output() selected = new EventEmitter<any[]>();
  subject: Subject<any>;

  constructor(
    public bsModalRef: BsModalRef,
    public sumt05Service: Sumt05Service,
    public lang: LangService
  ) { }

  ngOnInit() {
    this.searchModal();
    this.statusPage = false;
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.searchModal();
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    this.searchModal();
  }



  searchModal() {
    
    this.sumt05Service.getMenuList(Object.assign(this.parameter, { keyword: this.keyword, langcode: this.lang.CURRENT }), this.page)
      .pipe(finalize(() => {
        
        this.attributeSelected = [];
      }))
      .subscribe(
        (res: any) => {
          this.getMenuLists = res.Rows;
          this.page.totalElements = res.Total;
        });
  }


  select(): void {
    this.selected.next(this.attributeSelected);
    this.bsModalRef.hide();
  }

  close(): void {
    this.selected.next([]);
    this.bsModalRef.hide();
  }
}
