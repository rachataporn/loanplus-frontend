import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { ResetService } from './reset.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['../account.scss']
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup;
  policy:any;
  loading:boolean;
  constructor( private route: ActivatedRoute, private fb: FormBuilder,private rs:ResetService) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.policy = data.reset;
      this.createForm();
    });
   
  }

  createForm(){
    this.resetForm = this.fb.group({
      Password: [null, Validators.required],
      ConfirmPassword: [null, Validators.required]
    });

    let validators:ValidatorFn[] = [];
    let pattern = '';
    
    if(this.policy.passwordMinimumLength > 0 ){
      validators.push(Validators.minLength(this.policy.passwordMinimumLength || 3));
    }
    if(this.policy.passwordMaximumLength > 0 ){
      validators.push(Validators.maxLength(this.policy.passwordMaximumLength || 5));     
    }
    if(this.policy){
      pattern += '^';
    }
    if(this.policy.usingNumericChar){
      pattern += '(?=.*[0-9])';
    }
    if(this.policy.usingUppercase){
      pattern += '(?=.*[A-Z])';
    }
    if(this.policy.usingLowercase){
      pattern += '(?=.*[a-z])';
    }
    if(this.policy.usingSpecialChar){
      pattern += '(?=.*[$@$!%*?&])';
    }
    if(this.policy){
      pattern += '[\\S]{1,}$'; //'[ก-๙a-z0-9$@$!%*?&]{1,}$';
    }
   
 
    if(pattern) {
      validators.push(Validators.pattern(pattern));
    }
    this.NewPassword.setValidators(validators);
    this.NewPassword.updateValueAndValidity();
  }

  get NewPassword(){
    return this.resetForm.controls.Password;
  }
  get ConfirmPassword(){
    return this.resetForm.controls.ConfirmPassword;
  }

  onSubmit(){
    if(this.resetForm.invalid){
      return false;
    }

    this.loading = true;
    this.rs.resetPassword(Object.assign(this.resetForm.value,{ Code : this.policy.Code,UserId:this.policy.UserId }))
    .pipe(finalize(()=>{
       this.loading = false;
    })).subscribe();
  }
}
