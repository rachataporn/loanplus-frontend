import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AuthService, AlertService } from '@app/core';
import { LoginService } from './login.service';
import { ModalRef, ModalService, Size } from '@app/shared';
import { environment } from '@env/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    styleUrls: ['../account.scss'],
    templateUrl: 'login.component.html',

})
export class LoginComponent implements OnInit {
    version = environment.version;
    envProd = environment.production;
    loginForm: FormGroup;
    changePasswordForm: FormGroup;
    resetPasswordForm: FormGroup;
    changePopup: ModalRef;
    resetPopup: ModalRef;
    loading = false;
    loadingChange = false;
    loadingReset = false;
    submitted = false;
    policy = {};
    @ViewChild('changePassword') changePassword: TemplateRef<any>;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private modal: ModalService,
        private ls: LoginService,
        private as: AlertService,
        private authService: AuthService) {

    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: [null, Validators.required],
            password: [null, Validators.required]
        });
        this.changePasswordForm = this.formBuilder.group({
            NewPassword: [null, Validators.required],
            ConfirmPassword: [null, Validators.required]
        });
        this.resetPasswordForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]]
        })
        // reset login status
        this.authService.signout();
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.loginForm.disable();
        this.ls.signIn(this.loginForm.value)
            .then(() => {
                this.loading = false;
                this.loginForm.enable();
                let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/';
                this.router.navigate([redirect]);
            })
            .catch((errorResponse: HttpErrorResponse) => {
                this.loading = false;
                this.loginForm.enable();
                this.as.error("", errorResponse.error.error_description);
                if (errorResponse.error.error_description === 'Message.SU00008') {
                    this.forceChange();
                }
            })
    }
    forceChange() {
        this.ls.getUserPolicy(this.loginForm.controls.username.value).subscribe(
            (policy) => {
                this.policy = policy;
                this.openChangePopup(this.changePassword, policy)
            }
        )
    }
    openChangePopup(content, policy) {
        let validators: ValidatorFn[] = [];
        let pattern = '';

        if (policy.passwordMinimumLength > 0) {
            validators.push(Validators.minLength(policy.passwordMinimumLength || 3));
        }
        if (policy.passwordMaximumLength > 0) {
            validators.push(Validators.maxLength(policy.passwordMaximumLength || 5));
        }
        if (policy) {
            pattern += '^';
        }
        if (policy.usingNumericChar) {
            pattern += '(?=.*[0-9])';
        }
        if (policy.usingUppercase) {
            pattern += '(?=.*[A-Z])';
        }
        if (policy.usingLowercase) {
            pattern += '(?=.*[a-z])';
        }
        if (policy.usingSpecialChar) {
            pattern += '(?=.*[$@$!%*?&])';
        }
        if (policy) {
            pattern += '[\\S]{1,}$'; //'[ก-๙a-z0-9$@$!%*?&]{1,}$';
        }


        if (pattern) {
            validators.push(Validators.pattern(pattern));
        }
        this.NewPassword.setValidators(validators);
        this.NewPassword.updateValueAndValidity();
        this.changePopup = this.modal.open(content, Size.medium);
    }

    onChangePassword() {
        if (this.changePasswordForm.invalid) {
            return;
        }
        this.loadingChange = true;
        let parameter = Object.assign(this.changePasswordForm.value, { UserName: this.loginForm.controls.username.value, OldPassword: this.loginForm.controls.password.value });
        this.ls.changePassword(parameter)
            .pipe(
                finalize(() => {
                    this.loadingChange = false;
                    this.changePasswordForm.enable();
                })
            ).subscribe(
                () => {
                    this.loginForm.controls.password.setValue(this.changePasswordForm.controls.NewPassword.value);
                    this.closeChange();
                    this.onSubmit();
                }
            )
    }
    closeChange() {
        this.changePopup.hide();
        this.changePasswordForm.reset();
        this.changePasswordForm.markAsPristine();
    }
    get NewPassword() {
        return this.changePasswordForm.controls.NewPassword;
    }
    get ConfirmPassword() {
        return this.changePasswordForm.controls.ConfirmPassword;
    }
    openForgetPopup(content) {
        this.resetPopup = this.modal.open(content, Size.medium);
    }
    closeReset() {
        this.resetPopup.hide();
        this.resetPasswordForm.reset();
        this.resetPasswordForm.markAsPristine();
    }
    get Email() {
        return this.resetPasswordForm.controls.email;
    }
    onForgetPassword() {
        if (this.resetPasswordForm.invalid) {
            return;
        }
        this.loadingReset = true;
        this.ls.forgetPassword(this.resetPasswordForm.controls.email.value)
            .pipe(finalize(() => {
                this.loadingReset = false;
            }))
            .subscribe(
                (res: any) => {
                    this.closeReset();
                    if (res == 1) {
                        this.as.success("", "Message.SU00019");
                    } else{
                        this.as.warning("", "Message.SU00036");
                    }
                }
            )
    }
}
