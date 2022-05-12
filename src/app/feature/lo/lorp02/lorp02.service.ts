import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
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
  ReportFormat: string,
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
export class Lorp02Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loancontractreport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/loancontractreport/getlorp02report', param, { responseType: 'text' });
  }

}
