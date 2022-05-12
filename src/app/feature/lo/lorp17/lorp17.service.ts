import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  Date: string;
  FromBranchCode: string;
  ToBranchCode: string;
  FromLoanType: string;
  ToLoanType: string;
  FromCustomerCode: string;
  ToCustomerCode: string;
  ReportFormat: string;
  ReportName: string;
  ExportType: string;
  FromBranchText: string;
  ToBranchText: string;
  FromLoanTypeText: string;
  ToLoanTypeText: string;
  FromCustomerCodeText: string;
  ToCustomerCodeText: string;
  MonthText: string;
  YearText: string;
}

@Injectable()
export class Lorp17Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loansummaryreport/master/true');
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
    return this.http.get<any>('loan/loansummaryreport/customerCodeLOV', { params: param });
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/loansummaryreport/getlorp17report', param, { responseType: 'text' });
  }

}
