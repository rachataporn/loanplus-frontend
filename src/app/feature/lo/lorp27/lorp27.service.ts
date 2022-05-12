import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReportParam {
  ApprovedDate: Date;
  ToApprovedDate: Date,
  FromBranch: string,
  ToBranch: string,
  SecuritiesType: string;
  SecuritiesStatus: string;
  ReportName: string;
  ExportType: string;
  SecuritiesStatusText: string;
  SecuritiesTypeText: string;
}

export interface SecuritiesType {
  StatusValue: string;
  RowState: string;
  Active: boolean;
}

export interface SecuritiesStatus {
  StatusValue: string;
  RowState: string;
  Active: boolean;
}


@Injectable()
export class Lorp27Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/securitiesHistoriesReport/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/securitiesHistoriesReport/getlorp27report', param, { responseType: 'text' });
  }
 
}
