import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableService, RowState } from '@app/shared';


export interface Contract {
  LoanAgreements: LoanAgreement[]
}

export interface LoanAgreement {
  ContractHeadId: number,
  CompanyCode: string,
  CustomerCode: string,
  CustomerNameTha: string,
  CustomerNameEng: string,
  ContractDate: Date,
  ContractNo: string,
  AppLoanPrincipleAmount: number,
  AppLoanInterestAmount: number,
  Amount: number,
  ApprovedDate: Date,
  TransferDate: Date,
  StartInterestDate: Date,
  StartPaymentDate: Date,
  ReqGapPeriod: number,
  ReqTotalMonth: number,
  RowVersion: string,
  AppLoanInterestRate: number,
  AppLoanTotalPeriod: number,
  Compose: boolean
}

@Injectable()
export class Lots28Service {
  constructor(private http: HttpClient,
    private ts: TableService) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/DemoContract/master');
  }

  getMaxLoanAmount(CategoryId: any, CloseRefinance: any, LoanContractType: any, LoanLimitAmount: any, TypeOfPay: any, Grade: any) {
    return this.http.get<any>('loan/DemoContract/getMaxLoanAmount', { params: { CategoryId: CategoryId, CloseRefinance: CloseRefinance, LoanContractType: LoanContractType, LoanLimitAmount: LoanLimitAmount, TypeOfPay: TypeOfPay, Grade: Grade } });
  }

  getLoanType(CategoryId: any, CloseRefinance: any, LoanContractType: any, LoanLimitAmount: any, TypeOfPay: any, Grade: any) {
    return this.http.get<any>('loan/DemoContract/getLoanType', { params: { CategoryId: CategoryId, CloseRefinance: CloseRefinance, LoanContractType: LoanContractType, LoanLimitAmount: LoanLimitAmount, TypeOfPay: TypeOfPay, Grade: Grade } });
  }

  getMinToPay(Period: any, Interest: any, LoanTotalAmount: any, TypeOfPay: any) {
    return this.http.get<any>('loan/DemoContract/getMinToPay', { params: { Period: Period, Interest: Interest, LoanTotalAmount: LoanTotalAmount, TypeOfPay: TypeOfPay } });
  }

}
