import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  Date: Date,
  FromBranchCode: string,
  ToBranchCode: string,
  FromLoanType: string,
  ToLoanType: string,
  ReportFormat: string,
  ReportName: string,
  ExportType: string,
  ContractStatus: string;
  ContractStatusText: string;
  FromBranchText: string,
  ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string,
  HeaderText: string,
  MounthText: string,
  YearText: string,
  DateMounth: Date,
  formDate: Date,
  toDate: Date,
  NaDate: Date,
  CustomerGrade: string,
  CloseAllContract: boolean
}

export interface ContractStatus {
  StatusValue: string,
  RowState: string,
  Active: boolean,
}

@Injectable()
export class Lorp41Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/CrmOldCustomerReport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/CrmOldCustomerReport/getlorp41report', param, { responseType: 'text' });
  }
}
