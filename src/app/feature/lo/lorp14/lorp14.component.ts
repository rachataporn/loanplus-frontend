import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp14Service } from '@app/feature/lo/lorp14/lorp14.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lorp14.component.html'
})

export class Lorp14Component implements OnInit {
  branch = [{ value: '001', text: 'เลือกทั้งหมด', active: true }];
  report = [{ value: '001', text: 'สรุปทั้งหมด', active: true }];

  menuForm: FormGroup;
  count: Number = 3;
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lorp14Service: Lorp14Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      inputSearch: null,
      input1: '0.00'
    });

    this.menuForm = this.fb.group({
      inputSearch: null
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onTableEvent(event) {
  }

  search() {
  }

  add() {
  }

  edit(data) {
  }

  remove(menuCode: string, systemCode: string) {
  }
}
