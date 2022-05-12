import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contract {
  NewContractDate: Date,
  NumberOfNewPeriods: number,
  PaymentByInstallments: number,
  Refinances: Refinance[]
}
export interface Refinance {
  Period: number,
  ReceiveNo: string,
  ContractNo: string,
  EndPaymentDate: Date,
  CustomerNameTha: string,
  CustomerNameEng: string,
  AppLoanPrincipleAmount: number,
  BalancePrincipleAmount: number,
  BalanceInterestAmount: number,
  SumLoanBalance: number,
  OldSumLoanBalance: number,
  AppLoanInterestRate: number,
  NewContractNo: string,
  ContractHeadId: number,
  ReqTotalMonth: number,
  AppLoanTotalPeriod: number,
  ReqGapPeriod: number,
  NewInterestAmount: number,
  RowVersion: string,
}

@Injectable()
export class Lots10Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/refinance/master/true');
  }

  getContractNoDetail(ContractNo: any): Observable<any> {
    return this.http.get<any>('loan/refinance/getContractNoDetail', { params: { ContractNo: ContractNo } });
  }


  getRefinance(search: any): Observable<any> {
    const filter = {
      BranchSearch: search.BranchSearch,
      RefinanceRadio: search.RefinanceRadio,
      LoanTypeSearch: search.LoanTypeSearch,
      DueMonthSearch: search.DueMonthSearch,
      DueYearSearch: search.DueYearSearch,
      FromBorrowerCodeSearch: search.FromBorrowerCodeSearch,
      ToBorrowerCodeSearch: search.ToBorrowerCodeSearch,
      ContractNoSearch: search.ContractNoSearch,
      NewContractDate: search.NewContractDate,
      NumberOfNewPeriods: search.NumberOfNewPeriods,
      PaymenByInstallments: search.PaymenByInstallments,
    };
    return this.http.get<any>('loan/refinance/getRefinanceList', { params: filter });
  }

  updateRefinance(data: Contract, filter: string) {
    if(filter == 'N'){
      return this.http.unit().put<Contract>('loan/refinance/updateRefinanceNoDate', data);
    }else{
      return this.http.unit().put<Contract>('loan/refinance/updateRefinanceHaveDate', data);
    }
    
  }

  calculatePeriodAmount(search:any){
    const filter = Object.assign(search);
        return this.http.get<any>('loan/refinance/calculatePeriodAmount', { params: filter });
  }

  calculateInterest(data:any){
    const filter = Object.assign(data);
        return this.http.get<any>('loan/refinance/calculateInterest', { params: filter });
  }

}
