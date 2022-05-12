import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Ivts07Service } from '@app/feature/iv/ivts07/ivts07.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './ivts07.component.html'
})

export class Ivts07Component implements OnInit {
  searchForm: FormGroup;
  A1 = [{ value: '0', text: 'เลือกทั้งหมด' }];

  menuList = [
    {
      id:'04',day:'11/01/2562',id2:'004L61-0004',
      id3:'004C000005',name:'นางสาว ปัทมา ฤทธิสนธิ์',sum:'12,330.00',status:'E'
    }
      , {
        id:'04',day:'11/03/2562',id2:'004L62-0046',
      id3:'004C62000080',name:'นางสาว นงนภา มณีกัลย์',sum:'9,585.00',status:'E'
       
    }
      , {
        id:'04',day:'13/03/2562',id2:'004L62-0048',
      id3:'004C62000083',name:'นางสาว ลัดดาวรรณ โค่นสังพะเนา',sum:'19,753.00',status:'E'
       }
       , {
        id:'01',day:'19/04/2562',id2:'01L61-0253',
      id3:'01C000668',name:'นาง พรรณทิพย์ ยิ่งนาม',sum:'5,774.00',status:'E'
    }
    , {
      id:'01',day:'11/01/2562',id2:'01L31-0432',
    id3:'01C000134',name:'นาย ชลอ เมฆหมอก',sum:'12,486.00',status:'E'
     
  }];

  count: Number = 4;
  selected = [];


  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ivts07Service: Ivts07Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
  }

  ngOnInit() {

  }
 
  
  createForm() {
    this.searchForm = this.fb.group({
      inputSearch: null
    });
  }
}
