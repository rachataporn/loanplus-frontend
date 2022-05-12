import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranchCode: string;
  ToBranchCode: string;
  FromApprovedContractDate: Date;
  ToApprovedContractDate: Date;
  ReportName: string;
  ReportFormatName: string;
  ExportType: string;
  FromBranchText: string;
  ToBranchText: string;
  ContractStatus: string,
  ContractStatusText: string,

}
export interface ContractStatus {
  StatusValue: string,
  RowState: string,
  Active: boolean,
}

@Injectable()
export class Lorp36Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/senddocumentlate/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/senddocumentlate/getlorp36report', param, { responseType: 'text' });
  }
}
