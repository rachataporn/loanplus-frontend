import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranch: string,
  ToBranch: string,
  FromCustomerCode: string,
  ToCustomerCode: string,
  FromContractDate: Date,
  ToContractDate: Date,
  FromContractNo: string,
  ToContractNo: string,
  ReportName: string,
  ExportType: string,
}

@Injectable()
export class Lorf03Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/carpurchaseagreementreport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/carpurchaseagreementreport/getlorf03report', param, { responseType: 'text' });
}

}
