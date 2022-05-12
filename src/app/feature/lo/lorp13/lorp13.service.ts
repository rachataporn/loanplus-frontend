import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranchCode: string;
  ToBranchCode: string;
  FromLoanType: string;
  ToLoanType: string;
  FromApprovedContractDate: Date;
  ToApprovedContractDate: Date;
  FromContractNo: string;
  ToContractNo: string;
  FromCustomerCode: string;
  ToCustomerCode: string;
  UserNo1: string;
  UserNo2: string;
  ReportFormat: string;
  ContractStatus: string;
  ReportName: string;
  ExportType: string;
  FromBranchText: string;
  ToBranchText: string;
  FromLoanTypeText: string;
  ToLoanTypeText: string;
  ContractStatusText: string;
  FromCustomerCodeText: string;
  ToCustomerCodeText: string;
  UserNo1Text: string;
  UserNo2Text: string;
}

export interface ContractStatus {
  StatusValue: string;
  RowState: string;
  Active: boolean;
}

@Injectable()
export class Lorp13Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/customerandmemberloanpaymentsummaryreport/master/true');
  }

  getInvoiceStatusDDL() {
    return this.http.get<any>('loan/customerandmemberloanpaymentsummaryreport/invoiceStatusDDL');
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
    return this.http.get<any>('loan/customerandmemberloanpaymentsummaryreport/customerCodeLOV', { params: param });
  }

  getContractNoLOV(searchForm: any, page: any) {
    const param = {
      LoanNo: searchForm.LoanNo,
      CustomerCode: searchForm.CustomerCode,
      CustomerName: searchForm.CustomerName,
      LoanDate: searchForm.LoanDate,
      LoanStatus: searchForm.LoanStatus,
      Sort: page.sort || 'ContractNo ContractDate CustomerCode ASC',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/customerandmemberloanpaymentsummaryreport/contractNoLOV', { params: param });
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/customerandmemberloanpaymentsummaryreport/getlorp13report', param, { responseType: 'text' });
  }

}
