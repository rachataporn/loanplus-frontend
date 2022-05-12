import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromLogDate: Date;
  ToLogDate: Date;
  FromUserId: number;
  ToUserId: number;
  LogType: string;
  ExportType: string;
  IsContractDate: boolean;
  ReportName: string;
  ReportType: string;

}

@Injectable()
export class Lorp35Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/CustomerLogDetail/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/CustomerLogDetail/getlorp35report', param, { responseType: 'text' });
  }
}
