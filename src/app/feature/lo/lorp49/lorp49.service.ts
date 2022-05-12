import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromCompanyCode: string;
  ToCompanyCode: string;
  FromDate: Date;
  ToDate: Date;
}

@Injectable()
export class Lorp49Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loanRequestingDocumentsReport/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/loanRequestingDocumentsReport/getreportlorp52', param, { responseType: 'text' });
  }
}
