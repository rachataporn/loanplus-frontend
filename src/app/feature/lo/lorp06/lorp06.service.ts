import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface ReportParam {
  FromBranch: string,
  ToBranch: string,
  FromContractType: string,
  ToContractType: string,
  FromTheContractDate: Date,
  ToTheContractDate: Date,
  ReportName: string,
  ExportType: string,
  FromBranchText: string,
  ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string
}

@Injectable()
export class Lorp06Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loanApprovedReport/master/true');
   }
   generateReport(param: ReportParam) {
    return this.http.post('loan/loanApprovedReport/getlorp06report', param, { responseType: 'text' });
  }
}
