import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, SaveDataService } from '@app/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Sumt06Service, PasswordPolicy } from './sumt06.service'
import { ModalService } from '@app/shared';

@Component({
  templateUrl: './sumt06-detail.component.html'
})
export class Sumt06DetailComponent implements OnInit {
  passwordPolicy: PasswordPolicy = {} as PasswordPolicy;
  passwordForm: FormGroup;
  submitted: boolean;
  focusToggle: boolean;
  saving: boolean;
  statusSave = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private modal: ModalService,
    private saveData: SaveDataService,
    private sumt06: Sumt06Service
  ) {
    this.createForm();
  }

  createForm() {
    this.passwordForm = this.fb.group({
      PasswordPolicyCode: [null, Validators.required],
      PasswordPolicyName: [null, Validators.required],
      PasswordPolicyDescription: null,
      FailTime: 0,
      PasswordAge: 0,
      MaxDupPassword: 0,
      PasswordMinimumLength: 0,
      PasswordMaximumLength: 0,
      UsingUppercase: false,
      UsingLowercase: false,
      UsingNumericChar: false,
      UsingSpecialChar: false,
      Active: true,
      CreatedProgram: null

    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.passwordPolicy = data.sumt06.PasswordPolicyDetail;
    });
    this.rebuildForm();
  }

  rebuildForm() {
    this.passwordForm.markAsPristine();
    this.passwordForm.patchValue(this.passwordPolicy);
    if (this.passwordPolicy.PasswordPolicyCode) {
      this.passwordForm.controls.PasswordPolicyCode.disable();
    } else {
      this.passwordForm.controls.PasswordPolicyCode.enable();
    }
  }

  prepareSave(values: Object) {
    Object.assign(this.passwordPolicy, values);
  }

  onSubmit() {
    this.submitted = true;
    this.passwordForm.controls.PasswordPolicyCode.setValue(this.passwordForm.controls.PasswordPolicyCode.value != null ? this.passwordForm.controls.PasswordPolicyCode.value.trim() : null, { eventEmit: false });
    this.passwordForm.controls.PasswordPolicyName.setValue(this.passwordForm.controls.PasswordPolicyName.value != null ? this.passwordForm.controls.PasswordPolicyName.value.trim() : null, { eventEmit: false });
    if (this.passwordForm.invalid) {
      this.focusToggle = !this.focusToggle;
      this.statusSave = '';
      return;
    }
    if (this.passwordForm.controls.FailTime.value == null || this.passwordForm.controls.FailTime.value == ' ' || this.passwordForm.controls.FailTime.value == undefined) {
      this.passwordForm.controls.FailTime.setValue("0");
    }
    if (this.passwordForm.controls.PasswordAge.value == null || this.passwordForm.controls.PasswordAge.value == ' ' || this.passwordForm.controls.PasswordAge.value == undefined) {
      this.passwordForm.controls.PasswordAge.setValue("0");
    }
    if (this.passwordForm.controls.MaxDupPassword.value == null || this.passwordForm.controls.MaxDupPassword.value == ' ' || this.passwordForm.controls.MaxDupPassword.value == undefined) {
      this.passwordForm.controls.MaxDupPassword.setValue("0");
    }
    if (this.passwordForm.controls.PasswordMinimumLength.value == null || this.passwordForm.controls.PasswordMinimumLength.value == ' ' || this.passwordForm.controls.PasswordMinimumLength.value == undefined) {
      this.passwordForm.controls.PasswordMinimumLength.setValue("0");
    }
    if (this.passwordForm.controls.PasswordMaximumLength.value == null || this.passwordForm.controls.PasswordMaximumLength.value == ' ' || this.passwordForm.controls.PasswordMaximumLength.value == undefined) {
      this.passwordForm.controls.PasswordMaximumLength.setValue("0");
    }
    this.prepareSave(this.passwordForm.value);
    if (!this.passwordPolicy.CreatedProgram) {
      this.sumt06.CheckDuplicate(this.passwordPolicy)
        .pipe(finalize(() => {
        }))
        .subscribe(
          (res: any) => {
            if (res) {
              this.passwordForm.controls.CreatedProgram.value
              this.onSave();
            } else {
              this.as.error('', 'Message.STD00004', ['Label.SUMT06.PolicyCode']);
            }
          }, (error) => {
            console.log(error);
          });
    } else {
      this.passwordForm.controls.CreatedProgram.value
      this.onSave();
    }
  }
  onSave() {
    this.sumt06.savePasswordPolicy(this.passwordPolicy).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: PasswordPolicy) => {
          this.passwordPolicy = res;
          this.rebuildForm();
          this.passwordForm.controls.PasswordPolicyCode.disable();
          this.as.success('', 'Message.STD00006');
        }
      );
  }


  canDeactivate(): Observable<boolean> | boolean {
    if (!this.passwordForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back(flagSearch) {
    this.router.navigate(['/su/sumt06', { flagSearch: flagSearch }], { skipLocationChange: true });
  }

}


