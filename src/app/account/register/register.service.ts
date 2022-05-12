import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
declare var liff: any;

export interface Register {
  IdCard: string;
  SecurityCode: string;
  LineUserId: string;
}

@Injectable()
export class RegisterService {
  constructor(private http: HttpClient) { }

  saveRegister(data: Register) {
    console.log(data);
    return this.http.post<any>('loan/register', data);
  }

  initLineLiff() {
    return new Promise((resolve, reject) => {
      liff.init(data => {
        resolve(liff.getProfile())
      }, err=>{
        reject(err)
      })
    })
  }

  getLineProfile() {
    return new Promise((resolve, reject) => {
      liff.getProfile(data => {
        resolve(data)
      }, err=>{
        reject(err)
      })
    })
  }

}
