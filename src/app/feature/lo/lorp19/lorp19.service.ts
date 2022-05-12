import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  // systemCode: String,
  // menuCode: String,
  // mainMenu: String,
  // programCode: String,
  // active: boolean,
  // icon: String,
  // createdProgram: Date,
  // updatedProgram: Date
}

export interface ReportParam {
  Date: Date,
  FromBranchCode: string,
  ToBranchCode: string,
  FromLoanType: string,
  ToLoanType: string,
  ReportFormat: string,
  ReportName: string,
  ExportType: string,
  ContractStatus: string;
  ContractStatusText: string;
  FromBranchText: string,
  ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string,
  HeaderText: string,
  MounthText: string,
  YearText: string,
  DateMounth: Date,
  formDate: Date,
  toDate: Date,
  NaDate: Date
}

export interface ContractStatus {
  StatusValue: string,
  RowState: string,
  Active: boolean,
}

@Injectable()
export class Lorp19Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/LoanDueReport/master/true');
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
    return this.http.get<any>('loan/LoanDueReport/GetLoanType', { params: param });
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
    return this.http.get<any>('loan/LoanDueReport/GetCustomerCode', { params: param });
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/LoanDueReport/getlorp19report', param, { responseType: 'text' });
  }
}
