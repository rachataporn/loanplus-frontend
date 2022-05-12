import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Ivts03Service } from '@app/feature/iv/ivts03/ivts03.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './ivts03.component.html'
})

export class Ivts03Component implements OnInit {
  DDL = [{ value: '001', text: 'เลือกทั้งหมด', active: true }];
  dataList = [
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
    { column1: '00', column2: '31/01/2562', column3: '07/02/2562', column4: '00L61-0603', column5: 'C001845', column6: 'นางอัมพิกา พลเยี่ยม', column7: '146,764.00', column8: 'O', column9: ''},
  
  ];
  reportDDL = [{ value: '001', text: 'ติดตามแล้ว'}]
  page = new Page();
  count: Number = 50;
  statusPage: boolean;
  searchForm: FormGroup;
  reportForm: FormGroup;






  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ivts03Service: Ivts03Service,
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
      input3: null,
      // reportForm: []
    });

  }


  // createReportForm() {
  //   this.reportForm = this.fb.group({
  //     input3: null,
  //   });
  // }

  ngOnInit() {
  }

  openFolder() {
    this.router.navigate(['/iv/ivts03/detail'], { skipLocationChange: true });
  }

  onTableEvent(event) {

  }
}
