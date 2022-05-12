import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  MonthCode: string,
  YearCode: string,
  FromBranchCode: string,
  ToBranchCode: string,
  FromLoanType: string,
  ToLoanType: string,
  ReportName: string,
  ExportType: string,
  FromBranchText: string,
  ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string,
  MonthText: string,
  YearText: string,
}

@Injectable()
export class Lorp11Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/monthlyloanpaymentreport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/monthlyloanpaymentreport/getlorp11report', param, { responseType: 'text' });
  }

}
