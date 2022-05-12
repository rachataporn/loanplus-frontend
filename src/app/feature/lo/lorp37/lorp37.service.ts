import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranchCode: string;
  ToBranchCode: string;
  FromApprovedContractDate: Date;
  ReportName: string;
  ReportFormatName: string;
  ExportType: string;
  FromBranchText: string;
  ToBranchText: string;
  ReqDocumentStatus: string;
  ReqDocumentStatusText: string;
  FromContractNo: string;
  ToContractNo: string;
}

export interface ReqDocumentStatus {
  StatusValue: string;
  RowState: string;
  Active: boolean;
}

@Injectable()
export class Lorp37Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/controldocument/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/controldocument/getlorp37report', param, { responseType: 'text' });
  }
}
