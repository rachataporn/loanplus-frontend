import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface BankAccountType {
  BankAccountTypeCode: string,
  BankAccountTypeDescription: string,
  Active: boolean,
  RowVersion: number
  //Banks: banks[]
}

@Injectable()
export class Dbmt06Service {
  constructor(private http: HttpClient) { }

  getBankAccountType(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('system/bankAccountType', { params: filter });
  }
  getBankAccountTypeDetail(BankAccountTypeCode:any): Observable<any> {
    return this.http.get<any>('system/bankAccountType/detail', { params: { BankAccountTypeCode: BankAccountTypeCode} });
  }
  deleteBankAccountType(BankAccountTypeCode, version) {
    return this.http.unit().delete('system/bankAccountType/deleteBankAccountType', { params: { BankAccountTypeCode: BankAccountTypeCode, RowVersion: version } });
  }
  saveBankAccountType(bankAccountType: BankAccountType) {
    if (bankAccountType.RowVersion){
      return this.http.put<BankAccountType>('system/bankAccountType/updatetBankAccountType', bankAccountType);
    }else{ 
      return this.http.post<BankAccountType>('system/bankAccountType/insertBankAccountType', bankAccountType);
  }
  }
}