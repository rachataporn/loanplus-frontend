import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { SettingAlertService, ContractCustomerLine } from './setting-alert.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
declare var liff: any;

@Component({
  templateUrl: './setting-alert.component.html'
})

export class SettingAlertComponent implements OnInit {

  alertForm: FormGroup;
  contractCustomerLine: ContractCustomerLine = {} as ContractCustomerLine;
  line: string;
  userId: string;
  bbb: string;
  data: any;
  saving: Boolean;
  userProfile: any;
  focusToggle: boolean;
  submitted: boolean;
  items = [];

  constructor(
    private fb: FormBuilder,
    private registerService: SettingAlertService,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute
  ) {
    this.createForm();
    this.initLineLiff();
  }

  async initLineLiff() {
    try {
      this.data = await this.registerService.initLineLiff();
      this.userProfile = await liff.getProfile();
      this.userId = this.userProfile.userId;
    } catch (err) {
      alert(err)
    }
  }

  createForm() {
    this.alertForm = this.fb.group({
      IdCard: [null, Validators.required],
      ContractNo: null,
      // ContractNo: [null, Validators.required],
      LineUserId: null
      // IdCard: '1639900255626',
      // LineUserId: 'Ue074ef16e3ea59a852268d4fd1d50f1b',
    });
  }

  async ngOnInit() {
    this.search();
    await this.initLineLiff();
    this.alertForm.controls.LineUserId.setValue(this.userId);
  }

  prepareSave(values, alertFlag) {
    this.contractCustomerLine.ContractNo = values.ContractNo;
    this.contractCustomerLine.CustomerCode = values.CustomerCode;
    this.contractCustomerLine.MainContractHeadId = values.MainContractHeadId;
    this.contractCustomerLine.RowVersion = values.RowVersion;
    this.contractCustomerLine.LineUserId = values.LineUserId;

    if (alertFlag) {
      this.contractCustomerLine.FlagAlertLine = !values.FlagAlertLine;
      this.contractCustomerLine.FlagAlertEmail = values.FlagAlertEmail;
    }
    else {
      this.contractCustomerLine.FlagAlertEmail = !values.FlagAlertEmail;
      this.contractCustomerLine.FlagAlertLine = values.FlagAlertLine;
    }

  }

  onSubmit(value, alertFlag) {
    this.prepareSave(value, alertFlag);
    this.registerService.save(this.contractCustomerLine).pipe(
      finalize(() => {
        this.search();
      }))
      .subscribe(
        (res: any) => {

          this.as.success('บันทึกข้อมูลสำเร็จ', 'สำเร็จ');
        });
  }

  search() {
    this.registerService.getSearch('Ue074ef16e3ea59a852268d4fd1d50f1b').pipe(
      finalize(() => {
      }))
      .subscribe((res: any) => {
        this.items = res;

      });
  }

}
