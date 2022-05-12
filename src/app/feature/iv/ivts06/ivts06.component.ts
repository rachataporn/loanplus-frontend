import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Ivts06Service } from '@app/feature/iv/ivts06/ivts06.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './ivts06.component.html'
})

export class Ivts06Component implements OnInit {
  DDL = [{ value: '001', text: 'เลือกทั้งหมด', active: true }];

  dataList = [
    { column1: '01', column2: '25/03/2561', column3: '01L61-0299', column4: '01C000287', column5: 'นาย ชุติพนธ์ รอดอารีย์' },
    { column1: '02', column2: '26/07/2562', column3: '01L61-0300', column4: '01C000288', column5: 'นาย ใจดี ดีใจ' },
    { column1: '03', column2: '27/08/2562', column3: '01L61-0301', column4: '01C000289', column5: 'นาย มานะ พากเพียร' },
    { column1: '04', column2: '27/08/2562', column3: '01L61-0301', column4: '01C000290', column5: 'นาย คนดี ใจดี' },
    { column1: '05', column2: '27/08/2562', column3: '01L61-0301', column4: '01C000291', column5: 'นาย มานี ปรีชา' },
    { column1: '06', column2: '27/08/2562', column3: '01L61-0301', column4: '01C000292', column5: 'นาย มโน ธรรม' },
    { column1: '07', column2: '27/08/2562', column3: '01L61-0301', column4: '01C000293', column5: 'นาย ใจเย็น เย็นใจ' },
    { column1: '08', column2: '27/08/2562', column3: '01L61-0301', column4: '01C000294', column5: 'นาย คนดี มีมาก' },
    { column1: '09', column2: '27/08/2562', column3: '01L61-0301', column4: '01C000295', column5: 'นาย โชคดี ยากจน' },
    { column1: '10', column2: '27/08/2562', column3: '01L61-0301', column4: '01C000296', column5: 'นาย คนจน ไม่มี' }
  
  ];

  page = new Page();
  count: Number = 50;
  statusPage: boolean;
  searchForm: FormGroup;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ivts06Service: Ivts06Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      input1: null,
      input2: null,
    });

  }

  ngOnInit() {
  }

  onViewInformation(row) {
  }
  
  onTableEvent(event) {

  }
}
