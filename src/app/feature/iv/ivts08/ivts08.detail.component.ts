import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Ivts08Service } from '@app/feature/iv/ivts08/ivts08.service';
import { Page, ModalService, ModalRef, Size } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './ivts08.detail.component.html'
})

export class Ivts08DetailComponent implements OnInit {

  remarkForm: FormGroup;
  popup: ModalRef;

  tell = [
    {time: "1" 
      ,date: "28/12/2561"
      ,remark: "กำหนดนัดชำระวันที่ 04/01/2562"
      ,follow: "M"}
  ]

  home =[
    {}
  ]

  nano =[
    {text: "---เลือกสถานะ---"}
  ]
  countNewLoant: Number = 5;
  pageNewLoant = new Page();
  loadingNewLoan: boolean = false;
  countLoanContacted: Number = 5;
  pageLoanContacted = new Page();
  loadingLoanContacted: boolean = false;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ivts08Service: Ivts08Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {

  }

  ngOnInit() {
  }



}
