import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ReportParam {
  FromBranchCode: string;
  ToBranchCode: string;
  FromMount: string;
  ToMount: string;
  FromYear: string;
  ToYear: string;
  StartDate: Date;
  StartDateString: string;
  EndDateString: string;
  EndDate: Date;
  ReportName: string;
  ExportType: string;
}

export interface ContractStatus {
  StatusValue: string;
  RowState: string;
  Active: boolean;
}

@Injectable()
export class Lorp33Service {
  constructor(private http: HttpClient) { }

  generateReport(param: ReportParam) {
    return this.http.post('loan/AccuredInteresReport/getlorp33report', param, { responseType: 'text' });
  }

  getCompany() {
    return this.http.get<any>('system/company/dashboard');
  }

  getReportList(search: any, page: any, reportType: any) {
    const param = {
      FromBranchCode: search.FromBranchCode,
      ToBranchCode: search.ToBranchCode,
      StartDate: search.StartDate,
      EndDate: search.EndDate,
      FromMount: search.FromMount,
      ToMount: search.ToMount,
      FromYear: search.FromYear,
      ToYear: search.ToYear,
      ExportType: reportType,
      sort: page.sort || 'CreatedDate DESC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/AccuredInteresReport/getReportList', { params: param });
  }

}
