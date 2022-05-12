import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
declare var liff: any;

export interface ContractCustomerLine {
  CustomerCode: string;
  MainContractHeadId: number;
  FlagAlertLine: boolean;
  FlagAlertEmail: boolean;
  ContractNo: string;
  LineUserId: string;
  RowVersion: number;
}

@Injectable()
export class SettingAlertService {
  constructor(private http: HttpClient) { }

  saveRegister(data: ContractCustomerLine) {
    console.log(data);
    return this.http.post<any>('loan/register', data);

  }

  initLineLiff() {
    return new Promise((resolve, reject) => {
      liff.init(data => {
        resolve(liff.getProfile())
      }, err => {
        reject(err)
      })
    })
  }

  getLineProfile() {
    return new Promise((resolve, reject) => {
      liff.getProfile(data => {
        resolve(data)
      }, err => {
        reject(err)
      })
    })
  }

  getSearch(LineUserId) {
    return this.http.get<any>('loan/alertLine/search', { params: { LineUserId: LineUserId } });
  }

  save(data){
    return this.http.put<any>('loan/alertLine/update', data);

  }
}
