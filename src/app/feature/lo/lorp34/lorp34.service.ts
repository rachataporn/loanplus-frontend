import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  CompanyCode: string;
  FromBranchCode: string;
  ToBranchCode: string;
  FromContractNo: string;
  ToContractNo: string;
  CustomerCode: string;
}

@Injectable()
export class Lorp34Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loanletterforaudit/master');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/loanletterforaudit/getlorp34report', param, { responseType: 'text' });
  }

  getInvoiceStatusDDL() {
    return this.http.get<any>('loan/loanpaymentreport/invoiceStatusDDL');
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
    return this.http.get<any>('loan/loanletterforaudit/customerCodeLOV', { params: param });
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
    return this.http.get<any>('loan/loanletterforaudit/contractNoLOV', { params: param });
  }

}
