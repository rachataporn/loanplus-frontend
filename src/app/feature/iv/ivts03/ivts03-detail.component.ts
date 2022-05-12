import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Ivts03Service } from './ivts03.service';
// import { Lomt01Service, ContactPerson, Securities } from './lomt01.service';
// import { s } from '@angular/core/src/render3';

@Component({
  templateUrl: './ivts03-detail.component.html'
})

export class Ivts03DetailComponent implements OnInit {
  
  page = new Page();
  count: Number = 50;
  saving: Boolean;
  // submitted: Boolean;
  // focusToggle: boolean;

  dataHistory: FormGroup;
 
  statusDDL = [{ value: '001', text: 'เลือกทั้งหมด', active: true}];
  hisTelList =[{ column1:'12', column2:'18/03/2562', column3:'รีไฟแนนท์สองรอบแล้วค่ะลูกค้าไม่รับสายไปตามที่บ้าน บอกรอขายที่ยังไม่มีเงินจ่าย ส่งฟ้องหลังเลือกตั้งเสร็จค่ะ', column4:'O' },
  { column1:'11', column2:'16/03/2562', column3:'', column4:'NC' },
  { column1:'10', column2:'04/03/2562', column3:'กำหนดรับชำระวันที่ 15/03/2562', column4:'M' },
  { column1:'9', column2:'04/03/2562', column3:'โทรศัพท์ไม่รับสาย ไปตามที่บ้านไม่สนใจ refinance แล้ว 1 รอบ ส่งฟ้อง', column4:'O' },
  { column1:'8', column2:'1/02/2562', column3:'กำหนดรับชำระวันที่ 1/03/2562', column4:'M' },
  { column1:'7', column2:'29/01/2562', column3:'ลูกค้าไม่รับสาย ตามคนค้ำคนค้ำจะแจ้งให้มาจ่ายภายในวันที่ 5 ก.พ.', column4:'O' },
  { column1:'6', column2:'24/01/2562', column3:'กำหนดรับชำระวันที่ 26/01/2562', column4:'M' },
  { column1:'5', column2:'23/01/2562', column3:'', column4:'NC' },
  { column1:'4', column2:'22/01/2562', column3:'', column4:'NC' },
  { column1:'3', column2:'18/01/2562', column3:'กำหนดรับชำระวันที่ 21/01/2562', column4:'M' },
  { column1:'2', column2:'12/01/2562', column3:'กำหนดรับชำระวันที่ 17/01/2562', column4:'M' },
  { column1:'1', column2:'07/01/2562', column3:'กำหนดรับชำระวันที่ 11/01/2562', column4:'M' }
];

hisHomeList =[{ column1:'', column2:'', column3:'', column4:'', column5:''  }]


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private ivts03Service: Ivts03Service,
    private modal: ModalService,
    public lang: LangService
  ) {
    this.createForm();
  }

  createForm() {
    this.dataHistory = this.fb.group({
      input1: '1',
    });
  }


  ngOnInit() {
    
  }

  rebuildForm() {
   
  }


  prepareSave(values: Object) {
  
  }

  onTableEvent(event) {
    
  }

  delete() {
 
  }

  onSubmit() {
  
  }


  back() {
    this.router.navigate(['/iv/ivts03'], { skipLocationChange: true });
  }


}
