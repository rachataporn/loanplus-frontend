import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranchCode: string,
  ToBranchCode: string,
  FromApprovedContractDate: Date,
  ToApprovedContractDate: Date,
  FromContractNo: string,
  ToContractNo: string
}

@Injectable()
export class Lorp40Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loanpersoninformationreport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/loanpersoninformationreport/getlorp40report', param, { responseType: 'text' });
  }

}
