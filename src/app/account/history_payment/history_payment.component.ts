import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { HistoryPaymentService } from './history_payment.service';
import { LoadingService } from '@app/core/loading.service';
import * as Buffer from 'buffer';

//For line application.
declare var liff: any;

@Component({
  templateUrl: './history_payment.component.html'
})
export class HistoryPaymentComponent implements OnInit {

  @ViewChild('gallery') gallery;
  line: string;
  userId: string;
  data: any;
  srcImg: any;
  submitted: boolean;
  saving: boolean;
  show: boolean = false;
  userProfile: any;
  isDisable: boolean = false;
  focusToggle: boolean;
  getHistoryPayment = [];
  getConreactDDL = [];
  historypaymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private historyPaymentService: HistoryPaymentService,
    private ls: LoadingService,
    private route: ActivatedRoute,
  ) {
    this.createForm();
    this.initLineLiff();
  }

  createForm() {
    this.historypaymentForm = this.fb.group({
      LineUserId: null,
      ContractHeadId: null,
      // LineUserId: 'Ue074ef16e3ea59a852268d4fd1d50f1b'
    });
  }

  async initLineLiff() {
    try {
      this.data = await this.historyPaymentService.initLineLiff();
      this.userProfile = await liff.getProfile();
      this.userId = this.userProfile.userId;
    } catch (err) {
      alert(err);
    }
  }

  async ngOnInit() {
    await this.initLineLiff();
    this.historypaymentForm.controls.LineUserId.setValue(this.userId);
    if (this.userId) {
      this.searchContract();
    }
  }

  searchContract() {
    this.historyPaymentService.getContractList(this.historypaymentForm.controls.LineUserId.value).pipe(
      finalize(() => {
        this.submitted = false;
      }))
      .subscribe(
        (res: any) => {
          this.getConreactDDL = res.ContractHeadList;
        }, (error) => {
          console.log(error);
        });
  }


  searchLinePay() {
    this.getHistoryPayment = [];
    if (this.historypaymentForm.controls.ContractHeadId.value) {
      this.historyPaymentService.getHistoryPayment(this.historypaymentForm.controls.ContractHeadId.value).pipe(
        finalize(() => {
          this.submitted = false;
        }))
        .subscribe(
          (res: any) => {
            this.getHistoryPayment = res.Rows;
          }, (error) => {
            console.log(error);
          });
    }
  }

  getContent(file): Promise<any> {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = (event: any) => {
        const buffer = event.target.result;
        const byte = Buffer.Buffer.from(buffer);
        resolve(byte);
      };
      fileReader.readAsArrayBuffer(file);
    });
  }
}
