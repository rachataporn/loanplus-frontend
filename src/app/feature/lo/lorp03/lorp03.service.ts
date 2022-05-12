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
	FromContractNo: string,
	ToContractNo: string,
	FromCustomerCode: string,
  ToCustomerCode: string,
	ContractStatus: string,
  ReportName: string,
  ExportType: string,
  FromBranchText: string,
  ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string,
  ContractStatusText: string,
}

export interface ContractStatus {
  StatusValue: string,
  RowState: string,
  Active: boolean,
}

@Injectable()
export class Lorp03Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loancontractstatementreport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/loancontractstatementreport/getlorp03report',  param, { responseType: 'text' });
}

}
