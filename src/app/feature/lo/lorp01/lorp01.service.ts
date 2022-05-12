import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranch: string,
  ToBranch: string,
  FromContractNo: string,
  ToContractNo: string,
  ReportName: string,
  ExportType: string,
}

@Injectable()
export class Lorp01Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loandetailsreport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/loandetailsreport/getlorp01report', param, { responseType: 'text' });
}

}
