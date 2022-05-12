import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { RegisterService, Register } from './register.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
declare var liff: any;

@Component({
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  register: Register = {} as Register;
  line: string;
  userId: string;
  data: any;
  saving: Boolean;
  userProfile: any;
  focusToggle: boolean;
  submitted: boolean;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private as: AlertService,
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
    this.registerForm = this.fb.group({
      IdCard: [null, Validators.required],
      SecurityCode: null,
      // ContractNo: [null, Validators.required],
      LineUserId: null
      // IdCard: '1639900255626',
      // LineUserId: 'Ue074ef16e3ea59a852268d4fd1d50f1b',
    });
  }

  async ngOnInit() {
    await this.initLineLiff();
    this.registerForm.controls.LineUserId.setValue(this.userId);
  }

  prepareSave(values: Object) {
    Object.assign(this.register, values);
  }

  onSave() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.as.error('กรุณากรอกข้อมูลให้ถูกต้อง', 'ข้อมูลไม่ถูกต้อง');
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.registerForm.controls.IdCard.value.length > 13) {
      this.as.warning('กรุณากรอกข้อมูลให้ถูกต้อง', 'ข้อมูลไม่ถูกต้อง');
      return;
    }

    this.registerForm.disable();
    this.prepareSave(this.registerForm.value);
    this.saving = true;
    this.registerService.saveRegister(this.register).pipe(
      finalize(() => {
        this.registerForm.enable();
        this.saving = false;
        this.submitted = false;

      }))
      .subscribe((res: any) => {
        if (res) {
          this.as.success('บันทึกข้อมูลสำเร็จ', 'สำเร็จ');
          liff.closeWindow();
        } else {
          this.as.error('ไม่มีข้อมูลในระบบ', 'ผิดพลาด');
        }
      });
  }

}
