import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface ReportParam {
  AkornAttachmentHeadId: number,
  BranchCode: string;
  Month: string,
  Year: string,
  ReportName: string,
  ExportType: string,
  SdPeriod: string,
  AkornAttachmentDetail: AkornAttachment[];
}

export interface AkornAttachment {
  AkornAttachmentDetailId: number,
  FilePath: string,
  FileName: string,
  Description: string,
  AttahmentId: number,
  RowState: RowState,
  IsDisableAttachment: boolean
}

@Injectable()
export class Lorf11Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/SbtArkornReport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/SbtArkornReport/getlorf11report', param, { responseType: 'text' });
  }

  saveAttachment(data: ReportParam) {
    return this.http.unit().put<any>('loan/SbtArkornReport/insertAttachment', data);
  }

  getReportDetail(data: ReportParam) {
    const param = {
      BranchCode: data.BranchCode,
      Month: data.Month,
      Year: data.Year,
      ExportType: data.ExportType,
      ReportName: data.ReportName,
      SdPeriod: data.SdPeriod
    };
    return this.http.get<any>('loan/SbtArkornReport/getReportDetail', { params: param });
  }
}
