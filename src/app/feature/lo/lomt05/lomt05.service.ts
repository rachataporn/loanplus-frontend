import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CompanyAccount {
  CompanyAccountId: number;
  CompanyCode: string;
  AccountNo: string;
  AccountName: string;
  AccountCode: string;
  ReceiveTypeCode: string;
  BankCode: string;
  BranchName: string;
  BranchCode: string;
  BankAccountTypeCode: string;
  Active: boolean;
  CreatedProgram: string;
  RowVersion: number;
}

@Injectable()
export class Lomt05Service {

  constructor(private http: HttpClient) { }

  getData(search: any, page: any) {
    const param = {
      CompanyCode: search.CompanyCode,
      ReceiveTypeCode: search.ReceiveTypeCode,
      BankCode: search.BankCode,
      BranchCode: search.BranchCode,
      AccountCode: search.AccountCode,
      BankAccountTypeCode: search.BankAccountTypeCode,
      AccountNo: search.AccountNo,
      AccountName: search.AccountName,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/CompanyAccount/getCompanyAccountList', { params: param });

  }

  getDetail(CompanyAccountId) {
    return this.http.get<any>('loan/CompanyAccount/getCompanyAccountDetail', { params: { CompanyAccountId: CompanyAccountId } });
  }

  getBranchList(BankCode): Observable<any> {
    return this.http.get<any>('loan/CompanyAccount/getBranchList', { params: { BankCode: BankCode } });
  }

  getDetailList(): Observable<any> {
    return this.http.get<any>('loan/CompanyAccount/getDetailList');
  }

  public saveCompanyAccount(data: CompanyAccount) {
    if (data.CreatedProgram) {
      return this.http.put<CompanyAccount>('loan/CompanyAccount/updateCompanyAccount', data);
    } else {
      return this.http.post<CompanyAccount>('loan/CompanyAccount/createCompanyAccount', data);
    }
  }

  deleteCompanyAccount(CompanyAccountId, RowVersion, AccountNo) {
    const param = {
      CompanyAccountId: CompanyAccountId,
      RowVersion: RowVersion,
      AccountNo: AccountNo
    };
    return this.http.delete<any>('loan/CompanyAccount/deleteCompanyAccount', { params: param });
  }

  usageCheck(CompanyAccountId) {
    return this.http.get<any>('loan/CompanyAccount/usageCheckCompanyAccount', { params: { CompanyAccountId: CompanyAccountId } });
  }

  checkDupCompanyAccount(data: any) {
    const param = {
      CompanyCode: data.CompanyCode,
      ReceiveTypeCode: data.ReceiveTypeCode,
      BankCode: data.BankCode,
      AccountNo: data.AccountNo,
      CompanyAccountId: data.CompanyAccountId,
    };
    return this.http.get<any>('loan/CompanyAccount/checkDupCompanyAccount', { params: param });
  }

}
