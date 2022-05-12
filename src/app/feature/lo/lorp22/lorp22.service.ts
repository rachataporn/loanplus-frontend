import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromCustomerCode: string;
  ToCustomerCode: string;
  ReportFormat: string;
  ReportName: string;
  ExportType: string;
  FromCustomerCodeText: string;
  ToCustomerCodeText: string;
  GroupOfCareer: string;
  GroupOfCareerText: string;
}

export interface SaveL {
  LogSystem: string;
  LogDiscription: string;
  LogItemGroupCode: string;
  LogItemCode: string;
  LogProgram: string;
}

@Injectable()
export class Lorp22Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/clientlistreport/master/true');
  }

  getCustomerCodeLOV(searchForm: any, page: any) {
    const param = {
      CustomerCode: searchForm.CustomerCode,
      CustomerName: searchForm.CustomerName,
      IDCardNumber: searchForm.IDCardNumber,
      Sort: page.sort || 'CustomerCode ASC',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/clientlistreport/customerCodeLOV', { params: param });
  }

  saveLog(param: SaveL) {
    return this.http.post('system/Log/saveLog', param);
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/clientlistreport/getlorp22report', param, { responseType: 'text' });
  }

}
