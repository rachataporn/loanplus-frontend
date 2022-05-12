import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranch: string,
  ToBranch: string,
  FromContractType: string,
  ToContractType: string,
  ContractDate: Date,
  NPL: string,
  ReportName: string,
  ExportType: string,
  FromBranchText: string,
  ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string
  
}
  // FromLoanTypeText: string,
	// ToLoanTypeText: string,


@Injectable()
export class Lorp20Service {
  constructor(private http: HttpClient) { }
  getMaster(): Observable<any> {
    return this.http.get<any>('loan/BadDebtAppraisalReport/master/true');
   }
   generateReport(param: ReportParam) {
    return this.http.post('loan/BadDebtAppraisalReport/getlorp20report', param, { responseType: 'text' });
  }
}
