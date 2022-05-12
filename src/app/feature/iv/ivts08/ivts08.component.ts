import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Ivts08Service } from '@app/feature/iv/ivts08/ivts08.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './ivts08.component.html'
})

export class Ivts08Component implements OnInit {
  remarkForm: FormGroup;

  newLoan = [
    { code: '00'
    , codename: "000L61-0001"
    , idname: "33221456987153"
    , name: "สมชาย มาดี"
    , followbefore: "N"
    , fowlownow: ""},

    { code: '00'
    , codename: "000L61-0002"
    , idname: "2698753012549"
    , name: "มานี จุมศรี"
    , followbefore: "LC"
    , fowlownow: ""},

    { code: '00'
    , codename: "000L62-0001"
    , idname: "3698521470123"
    , name: "ศรีสมาน เพ่งศรี"
    , followbefore: ""
    , fowlownow: ""},

    { code: '00'
    , codename: "000L62-0002"
    , idname: "3256987401402"
    , name: "ศรีสมาน สิริกร"
    , followbefore: ""
    , fowlownow: ""},

    { code: '00'
    , codename: "000L62-0003"
    , idname: "1503269870145"
    , name: "หญิงลี แซ่เฮง"
    , followbefore: "LC"
    , fowlownow: ""},
  ];

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

  go(){
    this.router.navigate(['/iv/ivts08/detail'], { skipLocationChange: true });
  }

}
