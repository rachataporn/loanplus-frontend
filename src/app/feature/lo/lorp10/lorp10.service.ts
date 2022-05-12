import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranchCode: string,
  ToBranchCode: string,
  FromLoanType: string,
  ToLoanType: string,
  FromCustomerCode: string,
  ToCustomerCode: string,
  FromContractNo: string,
  ToContractNo: string,
  ReportFormat: string,
  ReportName: string,
  ExportType: string,
  FromBranchText: string,
  ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string,
  FromContractNoText: string,
  ToContractNoText: string,
  FromCustomerCodeText: string,
  ToCustomerCodeText: string,
  ConditionReport: string,
  FormDate: Date,
  ToDate: Date,
  ContractStatus: string,
  ContractStatusText: string,
}

export interface ContractStatus {
  StatusValue: string,
  RowState: string,
  Active: boolean,
}

@Injectable()
export class Lorp10Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/LoanSummaryPaymentReport/master/true');
  }

  getLoanTypeLOV(searchForm: any, page: any) {
    const param = {
      LoanTypeCode: searchForm.LoanTypeCode,
      LoanTypeName: searchForm.LoanTypeName,
      FromLoanType: searchForm.FromLoanType,
      ToLoanType: searchForm.ToLoanType,
      LovStatus: searchForm.LovStatus,
      Sort: page.sort || '',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/LoanSummaryPaymentReport/GetLoanType', { params: param });
  }

  GetLoanContractNoLOV(searchForm: any, page: any) {
    const param = {
      ContractNo: searchForm.ContractNo,
      ContractName: searchForm.ContractName,
      FromContract: searchForm.FromContract,
      ToContract: searchForm.ToContract,
      LovStatus: searchForm.LovStatus,
      Sort: page.sort || '',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/LoanSummaryPaymentReport/GetLoanContractNo', { params: param });
  }

  GetCustomerCodeLOV(searchForm: any, page: any) {
    const param = {
      CustomerNo: searchForm.CustomerNo,
      CustomerName: searchForm.CustomerName,
      FromCustomer: searchForm.FromCustomer,
      ToCustomer: searchForm.ToCustomer,
      LovStatus: searchForm.LovStatus,
      Sort: page.sort || '',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/LoanSummaryPaymentReport/GetCustomerCode', { params: param });
  }

  CheckgenerateReport(param: ReportParam) {
    return this.http.post('loan/LoanSummaryPaymentReport/CheckGenReport', param);
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/LoanSummaryPaymentReport/getlorp10report', param, { responseType: 'text' });
  }
}
