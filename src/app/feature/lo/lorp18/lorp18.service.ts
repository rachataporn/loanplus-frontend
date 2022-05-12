import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  Pidate: Date,
  FromContractNo: string,
  ToContractNo: string,
  FromBranchCode: string,
  ToBranchCode: string,
  FromLoanType: string,
  ToLoanType: string,
  ReportFormat: string,
  ReportName: string,
  ExportType: string,
  FromContractNoText: string,
  ToContractNoText: string,
  FromBranchText: string,
  ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string,
}



@Injectable()
export class Lorp18Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loaninvoicereport/master/true');
  }

  // getContractNoLOV(searchForm: any, page: any) {
  //   const param = {
  //     LoanNo: searchForm.LoanNo,
  //     CustomerCode: searchForm.CustomerCode,
  //     CustomerName: searchForm.CustomerName,
  //     LoanDate: searchForm.LoanDate,
  //     LoanStatus: searchForm.LoanStatus,
  //     LovStatus: searchForm.LovStatus,
  //     Sort: page.sort || 'ContractNo ContractDate Remark CustomerCode desc',
  //     Index: page.index,
  //     Size: page.size
  //   };
  //   return this.http.get<any>('loan/loaninvoicereport/contractNoLOV', { params: param });
  // }

  // getInvoiceNoLOV(searchForm: any, page: any) {
  //     const param = {
  //         CustomerCode: searchForm.CustomerCode,
  //         CustomerName: searchForm.CustomerName,
  //         InvoiceDate: searchForm.InvoiceDate,
  //         InvoiceNo: searchForm.InvoiceNo,
  //         LoanStatus: searchForm.LoanStatus,
  //         Sort: page.sort || 'InvoiceNo InvoiceDate CustomerCode desc',
  //         Index: page.index,
  //         Size: page.size
  //     };
  //     return this.http.get<any>('loan/invoice/invoiceNoLOV', { params: param });
  // }

  GetLoanContractNoLOV(searchForm: any, page: any) {
    const param = {
      ContractNo: searchForm.ContractNo,
      ContractName: searchForm.ContractName,
      LovStatus: searchForm.LovStatus,
      Sort: page.sort || '',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/loaninvoicereport/contractNoLOV', { params: param });
  }

  getInvoiceStatusDDL(Status) {
    const param = {
      Status: Status
    };
    return this.http.get<any>('loan/loaninvoicereport/invoiceStatusDDL', { params: param });
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/loaninvoicereport/getlorp18report', param, { responseType: 'text' });
  }
  // getSystemCombobox() {
  //   return this.http.get('lomt01/systemCodeDDL');
  // }

  // getMainMenuCombobox(systemCode) {
  //   return this.http.get('lomt01/mainMenuDDL', { params: { systemCode: systemCode } });
  // }

  // getProgramCodeCombobox() {
  //   return this.http.get('lomt01/programCodeDDL');
  // }

  // getLanguageCombobox() {
  //   return this.http.get('lomt01/langCodeDDL');
  // }

  // getMenuDetail(systemCode, menuCode): Observable<any> {
  //   return this.http.get<Menu>('lomt01/searchEdit', { params: { systemCode: systemCode, menuCode: menuCode } });
  // }

  // getMenuList(search: any, page: any) {
  //   const params = {
  //     programSearch: search,
  //     sort: page.sort || 'menuCode',
  //     direction: page.direction || 'asc',
  //     index: page.index,
  //     size: page.size
  //   };
  //   return this.http.get<any>('lomt01/search', { params: params });
  // }

  // checkDetailBeforeDelate(menuCode, systemCode) {
  //   return this.http.get<any>('lomt01/checkDetailBeforeDelate', { params: { menuCode: menuCode, systemCode: systemCode } });
  // }

  // deleteMenu(menuCode, systemCode) {
  //   const param = {
  //     menuCode: menuCode,
  //     systemCode: systemCode
  //   };
  //   return this.http.delete('lomt01/delete', { params: param });
  // }

  // saveMenu(data: Menu) {
  //   if (data.createdProgram) {
  //     return this.http.put<Menu>('lomt01/edit', data);
  //   } else {
  //     return this.http.post<Menu>('lomt01/save', data);
  //   }
  // }
}
