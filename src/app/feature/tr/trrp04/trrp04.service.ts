import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  ProcessDate: Date;
  ProcessDateTo: Date;
  CompanyCodeFrom: string;
  CompanyCodeTo: string;
  ReportType: string;

}

@Injectable()
export class Trrp04Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('tracking/Trrp04report/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('tracking/Trrp04report/getreportTrrp04', param, { responseType: 'text' });
  }
}
