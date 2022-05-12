import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  ProcessDate: Date;
  ProvinceId: number;
  CompanyCodeFrom: string;
  CompanyCodeTo: string;
  MainContractType: boolean;
}

@Injectable()
export class Lorp29Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/nplreportemployee/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/nplreportemployee/getnplreport', param, { responseType: 'text' });
  }
}
