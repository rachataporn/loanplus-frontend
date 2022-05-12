import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReportParam {
  ReportName: string;
  FromCompany: string,
  ToCompany: string,
  FromContractType: string,
  ToContractType: string,
  FromOwnerDeadDate: Date,
  ToOwnerDeadDate: Date,
  DocStatus: string,
  ContractStatus: string,
  ExportType: 'pdf',
  IsContractDate: true,
}


export interface ContractStatus {
  StatusValue: string,
  RowState: string,
  Active: boolean,
}

@Injectable()
export class Lorp39Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/SecuritiesOwnerDeadReport/master/true');
  }

  getCompany() {
    return this.http.get<any>('system/company/dashboard');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/SecuritiesOwnerDeadReport/getlorp40report', param, { responseType: 'text' });
  }
}
