import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Ivts02Service } from '@app/feature/iv/ivts02/ivts02.service';
import { Page, ModalService, ModalRef, Size } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './ivts02.component.html'
})

export class Ivts02Component implements OnInit {

  remarkForm: FormGroup;
  popup: ModalRef;

  newLoan = [
    { code: '00', date: '10/01/2561', lastName: '000L61-0001', borrower: 'C005063' , name: 'สมชาย มาดี', amount: 30000, status: 'L', present: '' },
    { code: '00', date: '20/02/2561', lastName: '000L61-0002', borrower: 'C005063' , name: 'มานี จุมศรี', amount: 200000, status: 'L', present: '' },
    { code: '00', date: '24/01/2562', lastName: '000L62-0001', borrower: 'C005063' , name: 'ศรีสมาน เพ่งศรี', amount: 175000, status: 'NC', present: '' },
    { code: '00', date: '18/04/2562', lastName: '000L62-0002', borrower: 'C005063' , name: 'ศรีสมาน สิริกร', amount: 80000, status: '', present: '' },
    { code: '00', date: '25/06/2562', lastName: '000L62-0003', borrower: 'C005063' , name: 'หญิงลี แซ่เฮง', amount: 50000, status: '', present: 'L' },
  ];
  countNewLoant: Number = 5;
  pageNewLoant = new Page();
  loadingNewLoan: boolean;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ivts02Service: Ivts02Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.remarkForm = this.fb.group({
      remark: null
    });
  }

  ngOnInit() {

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {

  }

  onChangeStatus(data, editTypeTemplate) {
    this.popup = this.modal.open(editTypeTemplate, Size.medium);
  }

  close() {
    this.popup.hide();
  }

  closeContract() {
    this.router.navigate(['/iv/ivts02/detail', { flagClose: 1 }], { skipLocationChange: true });

  }

  pay() {
    this.router.navigate(['/iv/ivts02/detail', { flagClose: 0 }], { skipLocationChange: true });

  }

}
