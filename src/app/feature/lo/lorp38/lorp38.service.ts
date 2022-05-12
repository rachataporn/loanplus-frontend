import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  ProcessDate: Date;
  Year: string;
  Month: string;
  ProvinceId: number;
  CompanyCodeFrom: string;
  CompanyCodeTo: string;
  MainContractType: boolean;
}

@Injectable()
export class Lorp38Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/nplreportaccounting/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/nplreportaccounting/getnplreportaccounting', param, { responseType: 'text' });
  }
}
