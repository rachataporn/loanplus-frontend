import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Contract{
  ContractHeadId:number,
  ContractNo:string,
  EndPaymentDate:Date,
  CustomerCode:string,
  CustomerNameTha:string,
  CustomerNameEng:string,
  AppLoanPrincipleAmount:number,
  AppLoanInterestRate:number,
  BalancePrincipleAmount:number,
  InterestAmount:number,
  Total:number,
  Period:number,
  ApproveLossDescription:string,
  RowVersion:number
}

@Injectable()
export class Lots11Service {
  constructor(private http: HttpClient) { }

  getMaster(){
    return this.http.get<any>('loan/closecontract/master');
  }
  getDependency(param){
    return this.http.get<any>('loan/closecontract/dependency',{ params : param});
  }
  getContracts(search: any){
    return this.http.get<Contract[]>('loan/closecontract', { params: search });
  }
  processContract(contracts:Contract[],closeDate:Date){
    return this.http.post('loan/closecontract',{ Contracts : contracts,CloseDate:closeDate});
  }
}
