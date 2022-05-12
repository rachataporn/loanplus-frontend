import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  ProcessDate: Date;
  ProvinceId: number;
  CompanyCodeFrom: string;
  CompanyCodeTo: string;
  MainContractType: boolean;
  ReportName: string;
}

@Injectable()
export class Lorp28Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/nplreport/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/nplreport/getnplreport', param, { responseType: 'text' });
  }
}
