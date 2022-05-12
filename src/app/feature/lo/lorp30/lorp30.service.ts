import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromLoanType: any;
  FromLoanTypeText: any;
  ToLoanTypeText: any;
  ToLoanType: any;
  FromBranchCode: string;
  ToBranchCode: string;
  FromApprovedContractDate: Date;
  ToApprovedContractDate: Date;
  ReportName: string;
  ReportFormatName: string;
  ExportType: string;
  FromBranchText: string;
  ToBranchText: string;
}

export interface ContractStatus {
  StatusValue: string;
  RowState: string;
  Active: boolean;
}

@Injectable()
export class Lorp30Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loannewsummaryreport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/loannewsummaryreport/getlorp30report', param, { responseType: 'text' });
  }
}
