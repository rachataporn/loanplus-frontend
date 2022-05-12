import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Ivts04Service } from '@app/feature/iv/ivts04/ivts04.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './ivts04.component.html'
})

export class Ivts04Component implements OnInit {
  remarkForm: FormGroup;

  newLoan = [
    { code: '00', date: "10/01/2561", codename: "000L61-0001", idname: "33221456987153", name: "สมชาย มาดี"},
    { code: '00', date: "20/02/2561", codename: "000L61-0002", idname: "2698753012549", name: "มานี จุมศรี"},
    { code: '00', date: "24/01/2562", codename: "000L62-0001", idname: "3698521470123", name: "ศรีสมาน เพ่งศรี"},
    { code: '00', date: "18/04/2562", codename: "000L62-0002", idname: "3256987401402", name: "ศรีสมาน สิริกร"},
    { code: '00', date: "25/06/2562", codename: "000L62-0003", idname: "1503269870145", name: "หญิงลี แซ่เฮง"},
  ];
 
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
    private ivts04Service: Ivts04Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
  }

  ngOnInit() {
  }

}


