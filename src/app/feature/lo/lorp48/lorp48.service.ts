import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromCompanyCode: string;
  ToCompanyCode: string;
  Year: string;
  Month: string;
}

@Injectable()
export class Lorp48Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loanMonthlyClosingReport/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/loanMonthlyClosingReport/getreportlorp50', param, { responseType: 'text' });
  }
}
