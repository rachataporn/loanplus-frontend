import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  ProcessDate: Date;
  ReportName: string;
  ReportFormatName: string;
  ExportType: string;
}

export interface ContractStatus {
  StatusValue: string;
  RowState: string;
  Active: boolean;
}

@Injectable()
export class Lorp31Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/picofinancesummaryreportfinal/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/picofinancesummaryreportfinal/getlorp31report', param, { responseType: 'text' });
  }
}
