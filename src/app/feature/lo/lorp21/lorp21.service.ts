import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  // FinanceCode: string,
  MonthCode: string,
  YearCode: string,
  ProvinceCode: string,
  // FromBranchCode: string,
  // ToBranchCode: string,
  FromLoanType: string,
  ToLoanType: string,
  ReportName: string,
  ExportType: string,
  ProvinceText: string,
  // ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string,
  Date: Date;
  MonthText: string,
}

@Injectable()
export class Lorp21Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/exportreport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/exportreport/getlorp21report', param, { responseType: 'text' });
  }

}
