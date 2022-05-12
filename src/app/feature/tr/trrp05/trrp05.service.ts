import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromDate: Date;
  ToDate: Date;
  CompanyCode: string;
  ReportName: string;
  Message: string;
  ReportCode: string;
}

@Injectable()
export class Trrp05Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('tracking/trackingMoreThreeMonthsReport/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('tracking/trackingMoreThreeMonthsReport/getreportTrrp05', param, { responseType: 'text' });
  }

  generateReportTRRP05(param: ReportParam) {
    return this.http.post('tracking/trackingMoreThreeMonthsReport/getreportTrrp05Export', param, { responseType: 'text' });
  }
}
