import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  ThisDate: Date,
	FromBranchCode: string,
	ToBranchCode: string,
	FromLoanType: string,
	ToLoanType: string,
	FromApprovedContractDate: Date,
	ToApprovedContractDate: Date,
	FromCustomerCode: string,
  ToCustomerCode: string,
  ReportName: string,
  ExportType: string,
  FromBranchText: string,
  ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string,
}


@Injectable()
export class Lorp07Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loanextensionreport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/loanextensionreport/getlorp07report',  param, { responseType: 'text' });
}

}
