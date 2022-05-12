import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Ivts01Service } from '@app/feature/iv/ivts01/ivts01.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  templateUrl: './ivts01.component.html'
})

export class Ivts01Component implements OnInit {
  menuList = [{
    branchCode: '01', DueDate: '12/08/2562', Contractnumber: 'L60-1356-23'
    , Borrowercode: '326061', name: 'นาง ละมุน แก้วมงคล', Arrears: '134,456', tel: '086-959-9999'
  }
    , {
    branchCode: '02', DueDate: '02/03/2563', Contractnumber: '0L6-1356-23'
    , Borrowercode: '496230', name: 'นางสาว ยุพา บุพาไต', Arrears: '25,486', tel: '086-959-7777'
  }
    , {
    branchCode: '03', DueDate: '03/08/2565', Contractnumber: 'L51-1356-23'
    , Borrowercode: '561354', name: 'นาง น้อยนาค ประโคน', Arrears: '253,465', tel: '086-959-8888'
  }, {
    branchCode: '04', DueDate: '12/02/25623', Contractnumber: '0L6-1356-23'
    , Borrowercode: '615326', name: 'นาง รุ้งณธี มีมุข', Arrears: '253,466', tel: '086-959-4444'
  }, {
    branchCode: '00', DueDate: '19/09/2562', Contractnumber: 'L51-1356-23'
    , Borrowercode: '756323', name: 'นาย สามารถ สืบจะบก', Arrears: '243,586', tel: '086-959-5555'
  }, {
    branchCode: '01', DueDate: '23/05/2562', Contractnumber: '0L6-1356-23'
    , Borrowercode: '321687', name: 'นางสาว พิมพา นิคงรัมย์', Arrears: '433,456', tel: '086-959-6666'
  }, {
    branchCode: '01', DueDate: '25/0/2562', Contractnumber: '0L6-1356-23'
    , Borrowercode: '123456', name: 'นาย โกมล จ้านกันหา', Arrears: '253,456', tel: '086-959-3333'
  }, {
    branchCode: '03', DueDate: '02/08/2562', Contractnumber: 'L51-1356-23'
    , Borrowercode: '657841', name: 'นางสาว พิศมัย ปะโคสง', Arrears: '323,456', tel: '086-959-2222'
  }, {
    branchCode: '01', DueDate: '02/08/2562', Contractnumber: '0L6-1356-23'
    , Borrowercode: '253698', name: 'นาย เสนอ จอมเกาะ', Arrears: '453,456', tel: '086-959-1111'
  }, {
    branchCode: '01', DueDate: '30/10/2562', Contractnumber: 'L51-1356-23'
    , Borrowercode: '142536', name: 'นาย สมชาติ ฝ่ายธรรม', Arrears: '3,461', tel: '086-959-1122'
  }, {
    branchCode: '02', DueDate: '02/08/2562', Contractnumber: '0L6-1356-23'
    , Borrowercode: '788966', name: 'นางสาว วันเพ็ญ เสือซ่อนพงษ์', Arrears: '23,456', tel: '086-959-2233'
  }, {
    branchCode: '02', DueDate: '04/011/2562', Contractnumber: '0L6-1356-23'
    , Borrowercode: '456783', name: 'นาย สนธยา นิคงรัมย์', Arrears: '313,456', tel: '086-959-3364'
  }, ];

  menuForm: FormGroup;
  count: Number = 20;
  page = new Page();
  selected = [];
  statusPage: boolean;
  searchForm: FormGroup;
  mes : string;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ivts01Service: Ivts01Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      inputSearch: null
    });

    this.menuForm = this.fb.group({
      inputSearch: null
    });
  }

  ngOnInit() {
  }

  onTableEvent($event)
  {

  }
  
  ConfirmSmS() {
    this.modal.confirm('คุณกำลังจะส่ง SMS เพื่อแจ้งเตือนวันครบกำหนดชำระ?')
    


  }   
  
}
