import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface LoanAgreementType {
  LoanTypeCode: string;
  LoanTypeNameTha: string;
  LoanTypeNameEng: string;
  LoanNameSignin: string;
  InterestRate: number;
  Active: boolean;
  FeeRate1: number;
  FeeRate2: number;
  InterestAllMax: number;
  InterestAllMax2: number;
  GuaranteeRate: number;
  GuarantorYn: boolean;
  GuaranteeAssetYn: boolean;
  InterestType: string;
  FineType: string;
  FineMonth: number;
  FineRate: number;
  InterestDiscountRate: number;
  AccDebtor: string;
  AccInterest: string;
  AccFine: string;
  AccCash: number;
  AccFee1: string;
  AccFee2: string;
  AccFee3: string;
  AccClose: string;
  AccAccrueInterest: string;
  AccCashTemporary: string;
  BotLoanType: string;
  FpoLoanType: string;
  CreatedProgram: string;
  CategoryId: number;
  MortgageFee: number;
  SecuritiesPercent: number;
  MaxLoanAmount: number;
  Company: LoanCompany[];
}

export interface LoanCompany {
  LoanTypeDivId: number;
  LoanTypeCode: string;
  CompanyNameTha: string;
  CompanyNameEng: string;
  CompanyCode: string;
  Active: boolean;
  RowState: RowState;
  RowVersion: number
}

@Injectable()
export class Lomt02Service {
  constructor(private http: HttpClient) { }

  getLoanList(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort || 'LoanTypeCode ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreementType/getLoanAgeementTypeList', { params: param });
  }

  getDetail(LoanTypeCode) {
    return this.http.get<any>('loan/LoanAgreementType/getLoanAgeementTypeDetail', { params: { LoanTypeCode: LoanTypeCode } });
  }

  checkDuplicate(LoanTypeCode) {
    return this.http.get<any>('loan/LoanAgreementType/checkDuplicate', { params: { LoanTypeCode: LoanTypeCode } });
  }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/LoanAgreementType/master');
  }
  getCompanyModal(search: any, page: any) {
    const param = {
      keyword: search.CompanyCode,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreementType/getCompanyModal', { params: param });
  }

  public saveLoan(data: LoanAgreementType, statusSave: string) {
    if (statusSave == 'update') {
      return this.http.put<LoanAgreementType>('loan/LoanAgreementType/UpdateLoanAgreementType', data);
    } else {
      return this.http.post<LoanAgreementType>('loan/LoanAgreementType/CreateLoanAgreementType', data);
    }
  }

  delete(LoanTypeCode, RowVersion) {
    return this.http.delete('loan/LoanAgreementType/DeleteLoanAgreementType', { params: { LoanTypeCode: LoanTypeCode, RowVersion: RowVersion } })
  }
}
