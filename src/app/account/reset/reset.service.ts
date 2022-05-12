import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@env/environment';
import { tap, catchError } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { Router } from '@angular/router';

import { AlertService } from '@app/core';
interface ResetPassword {
  UserId:string,
  Code: string,
  Password: string,
  ConfirmPassword: string,
}

@Injectable()
export class ResetService {

  constructor(private http: HttpClient,private router: Router,private as:AlertService) { }

  getPolicy(id:string) {
    return this.http.disableApiPrefix().get<any>(`${environment.authUrl}/api/account/policy/${id}`);
  }

  resetPassword(reset:ResetPassword){
    return this.http.disableApiPrefix().skipErrorHandler().post<any>(`${environment.authUrl}/api/account/resetpassword`, reset)
    .pipe(
      tap(result=>{
        this.router.navigate(['/resetcomplete',{ complete : true }]);
      }),
      catchError((err)=>{
        console.log(err);
        let model = err.error;
        if(model.invalid){
           this.as.apiError(model.invalid[0]);
           return EMPTY;
        }
        else{
          this.router.navigate(['/resetcomplete',{ complete : false }]);
          return EMPTY;
        }
      })
    )
  }
}
