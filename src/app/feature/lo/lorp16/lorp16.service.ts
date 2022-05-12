import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  Date: Date,
  FromBranchCode: string,
  ToBranchCode: string,
  FromLoanType: string,
  ToLoanType: string,
  FromCustomerCode: string,
  ToCustomerCode: string,
  ReportFormat: string,
  ReportName: string,
  ExportType: string,
  FromBranchText: string,
  ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string,
  FromCustomerCodeText: string,
  ToCustomerCodeText: string,
  ContractStatus: string,
  ContractStatusText: string,
  IsIgnorePagination: boolean
}

export interface ContractStatus {
  StatusValue: string,
  RowState: string,
  Active: boolean,
}

@Injectable()
export class Lorp16Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/LoanContractDebtorReport/master/true');
  }

  getLoanTypeLOV(searchForm: any, page: any) {
    const param = {
      LoanTypeCode: searchForm.LoanTypeCode,
      LoanTypeName: searchForm.LoanTypeName,
      FromLoanType: searchForm.FromLoanType,
      ToLoanType: searchForm.ToLoanType,
      LovStatus: searchForm.LovStatus,
      Sort: page.sort || 'LoanTypeCode asc',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/LoanContractDebtorReport/GetLoanType', { params: param });
  }

  GetCustomerCodeLOV(searchForm: any, page: any) {
    const param = {
      CustomerNo: searchForm.CustomerNo,
      CustomerName: searchForm.CustomerName,
      FromCustomer: searchForm.FromCustomer,
      ToCustomer: searchForm.ToCustomer,
      LovStatus: searchForm.LovStatus,
      Sort: page.sort || 'CustomerCode asc',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/LoanContractDebtorReport/GetCustomerCode', { params: param });
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/LoanContractDebtorReport/getlorp16report', param, { responseType: 'text' });
  }
}
