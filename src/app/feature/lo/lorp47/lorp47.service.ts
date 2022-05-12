import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  BranchCode: string,
  MonthCode: string,
  ReportName: string
  Year: string
}

@Injectable()
export class Lorp47Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/CashSubmitReport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/CashSubmitReport/getlorp47report', param, { responseType: 'text' });
  }
}
