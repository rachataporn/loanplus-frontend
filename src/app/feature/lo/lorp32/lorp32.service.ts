import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranchCode: string;
  ToBranchCode: string;
  ReportName: string,
  ExportType: string,
  ReportType: string,
  CountYear: string,
}

@Injectable()
export class Lorp32Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/EstimateInterest/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/EstimateInterest/getlorp32report', param, { responseType: 'text' });
  }

  getReportList(search: any, page: any) {
    const param = {
      FromBranchCode: search.FromBranchCode,
      ToBranchCode: search.ToBranchCode,
      ReportType: search.ReportType,
      sort: page.sort || 'CreatedDate DESC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/EstimateInterest/getReportList', { params: param });
  }

}
