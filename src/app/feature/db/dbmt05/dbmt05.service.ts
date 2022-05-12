import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';


export interface Bank {
  BankCode: string;
  BankNameTha: string;
  BankNameEng: string;
  Active: boolean;
  Description: string;
  RowVersion: string;
  BankBranchs: BankBranch[];
  TransferBankCode: string;
}

export interface BankBranch {
  BankCode: string;
  BranchCode: string;
  BranchNameTha: string;
  BranchNameEng: string;
  Active: boolean;
  RowVersion: string;
  RowState: RowState;
}

@Injectable()
export class Dbmt05Service {
  constructor(private http: HttpClient) { }

  getBank(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('system/bank', { params: filter });
  }
  getBankDetail(BankCode: string): Observable<any> {
    return this.http.get<any>('system/bank/detail', { params: { BankCode: BankCode } });
  }
  deleteBank(BankCode, version) {
    return this.http.unit().delete('system/bank/deleteBank', { params: { BankCode: BankCode, RowVersion: version } });
  }
  saveBank(bank: Bank) {
    if (bank.RowVersion) {
      return this.http.put<Bank>('system/bank/updatetBank', bank);
    } else {
      return this.http.post<Bank>('system/bank/insertBank', bank);
    }
  }
}
