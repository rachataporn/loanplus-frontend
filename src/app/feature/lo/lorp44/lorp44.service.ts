import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranchCode: string,
  ToBranchCode: string,
  FromLoanType: string,
  ToLoanType: string,
  ReportType: string,
  ReportName: string,
  ExportType: string,
  Message : string,
  Date: Date;
}

@Injectable()
export class Lorp44Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/DebtReserveLorp44/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/DebtReserveLorp44/getlorp44report', param, { responseType: 'text' });
  }

}
