import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranchCode: string;
  ToBranchCode: string;
  FromLoanType: string;
  ToLoanType: string;
  // FromApprovedContractDate: Date;
  AsOfDate: Date;
  FromContractNo: string;
  ToContractNo: string;
  FromCustomerCode: string;
  ToCustomerCode: string;
  ReportFormat: string;
  // ContractStatus: string;
  ReportName: string;
  ExportType: string;
  FromBranchText: string;
  ToBranchText: string;
  FromLoanTypeText: string;
  ToLoanTypeText: string;
  FromCustomerCodeText: string;
  ToCustomerCodeText: string;
  FromContractCodeText: string;
  ToContractCodeText: string;
}

@Injectable()
export class Lorp15Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/loanoverduereceivablesreport/master/true');
  }

  getInvoiceStatusDDL(Status) {
    const param = {
        Status: Status
    };
    return this.http.get<any>('loan/LoanOverdueReceivablesReport/invoiceStatusDDL', { params: param });
  }

  getCustomerCodeLOV(searchForm: any, page: any) {
    const param = {
      CustomerCode: searchForm.CustomerCode,
      CustomerName: searchForm.CustomerName,
      IDCardNumber: searchForm.IDCardNumber,
      MobileNo: searchForm.MobileNo,
      Sort: page.sort || 'CustomerCode ASC',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/LoanOverdueReceivablesReport/customerCodeLOV', { params: param });
  }

  getContractNoLOV(searchForm: any, page: any) {
    const param = {
        LoanNo: searchForm.LoanNo,
        CustomerCode: searchForm.CustomerCode,
        CustomerName: searchForm.CustomerName,
        LoanDate: searchForm.LoanDate,
        LoanStatus: searchForm.LoanStatus,
        LovStatus: searchForm.LovStatus,
        Sort: page.sort || 'ContractNo ContractDate Remark CustomerCode desc',
        Index: page.index,
        Size: page.size
    };
    return this.http.get<any>('loan/LoanOverdueReceivablesReport/contractNoLOV', { params: param });
}


  generateReport(param: ReportParam) {
    return this.http.post('loan/loanoverduereceivablesreport/getlorp15report', param, { responseType: 'text' });
  }


  // getMaster(): Observable<any> {
  //   return this.http.get<any>('loan/loanpaymentreport/master/true');
  // }

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
