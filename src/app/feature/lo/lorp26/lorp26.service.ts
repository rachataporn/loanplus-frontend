import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  StartDate: Date,
  EndDate: Date,
  FromBranch: string,
  ToBranch: string,
  Assessment: number,
  ReportName: string,
  ExportType: string,
}

@Injectable()
export class Lorp26Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/assessmentReport/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/assessmentReport/getlorp26report', param, { responseType: 'text' });
  }

}
