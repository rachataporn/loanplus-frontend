import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  ProcessDate: Date;
  ProvinceId: number;
  CompanyCodeFrom: string;
  CompanyCodeTo: string;
  MainContractType: string;
}

@Injectable()
export class Lorp45Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/lorp45report/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/lorp45report/getreportlorp45', param, { responseType: 'text' });
  }
}
