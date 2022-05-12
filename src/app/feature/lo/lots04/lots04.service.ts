import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RowState } from '@app/shared';

export interface ContractHead {
  ContractHeadId: number,
  CompanyCode: string,
  DocumentTypeCode: string,
  DocumentSubTypeCode: string,
  LoanTypeCode: string,
  ContractNo: string,
  ContractDate: Date,
  ContractStatus: string,
  CustomerCode: string,
  LoanObjective: string,
  LoanDescription: string,
  SavingAccountNo: string,
  DocSource: string,
  PayType: string,
  ReqLoanAmount: number,
  ReqTotalPeriod: number,
  ReqGapPeriod: number,
  ReqTotalMonth: number,
  ApprovedDate: Date,
  TransferDate: Date,
  StartPaymentDate: Date,
  EndPaymentDate: Date,
  StartInterestDate: Date,
  AppLoanPrincipleAmount: number,
  AppLoanInterestRate: number,
  AppLoanInterestAmount: number,
  AppLoanTotalPeriod: number,
  AppLoanPeriodAmount: number,
  AppInterestType: string,
  AppLoanEffectiveInterestRate: number,
  AppFeeRate1: number,
  AppFeeRate2: number,
  AppFeeRate3: number,
  AppFeeAmount1: number,
  AppFeeAmount2: number,
  AppFeeAmount3: number,
  AppLastLoanPeriodAmount: number,
  AppLastLoanInterestAmount: number,
  AppLastLoanPrincipleAmount: number,
  LatePaymentDay: number,
  LatePaymentFeeRate: number,
  ApproveContractBy: string,
  ApproveContractDate: Date,
  ApprovePaymentBy: string,
  ApprovePaymentDate: Date,
  ApproveLossBy: string,
  ApproveLossDate: Date,
  PaymentTransferDate: Date,
  PaymentTypeCode: string,
  PaymentCompanyAccountId: number,
  CustomerReceiveTypeCode: string,
  CustomerAccountNo: string,
  CustomerAccountName: string,
  CustomerBankCode: string,
  CustomerBranchName: string,
  CustomerBankAccountTypeCode: string,
  CustomerAccountAuto: string,
  ReceiveTypeCode: string,
  ReceiveCompanyAccountId: number,
  Barcode: string,
  LoanFeeAmount: number,
  Remark: string,
  RowVersion: string,
  ApproveCloseBy: string,
  ApproveCloseDate: Date,
  AppproveLossDescription: string,
  MainContractNo: string,
  ContractType: string,
  MainLoanPrincipleAmount: number,
  CategoryId: number,
  MaximumInterestRate: number,
  MaximumInterestRateDisplay: number,
  PriorityPrinciple: number,
  OldContractId: number,
  Activity: string,
  ContractBorrower: ContractBorrower[],
  ContractSecurities: ContractSecurities[],
  ContractInformation: ContractInformation[],
  ContractGuarantor: ContractGuarantor[],
  ContractIncomeItem: ContractItem[],
  ContractPaymentItem: ContractItem[],
  ContractPeriod: ContractPeriod[]
  ContractItem: ContractItem[],
  ContractMgmEmployee: ContractMgmEmployee[],
  ContractMgm: ContractMgm[],
  LoantypesList: any[],
  CustomerName: string,
  IsDisableAttachment: boolean,
  ReqType: string
}

export interface ContractBorrower {
  ContractBorrowerId: number,
  ContractHeadId: number,
  CustomerCode: string,
  CustomerNameTha: string,
  CustomerNameEng: string,
  ContractBorrowMain: boolean,
  LoanAmount: number,
  BorrowSeq: number,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractSecurities {
  ContractSecuritiesId: number,
  ContractHeadId: number,
  CustomerSecuritiesId: number,
  Description: string,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractInformation {
  ContractInformationId: number,
  InformationId: number,
  ContractHeadId: number,
  AddOn: number,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractGuarantor {
  ContractGuarantorId: number,
  ContractHeadId: number,
  CustomerCode: string,
  CustomerNameTha: string,
  CustomerNameEng: string,
  idCard: string,
  LoanAmount: number,
  RowVersion: string,
  RowState: RowState
}

export interface ContractItem {
  ContractItemId: number,
  LoItemCode: string,
  LoItemSectionCode: string,
  Amount: number,
  ContractHeadId: number,
  Description: string,
  RowVersion: string,
  RowState: RowState
}

export interface ContractPeriod {
  ContractPeriodId: number,
  ContractHeadId: number,
  Period: number,
  ReceiveDate: Date,
  PaymentYear: number,
  PaymentPeriod: number,
  PrincipleAmount: number,
  InterestAmount: number,
  TotalAmount: number,
  BalPrincipleAmount: number,
  ReceiveNo: string,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractMgmEmployee {
  ContractMgmEmployeeId: number,
  ContractHeadId: string,
  CompanyCode: string,
  EmployeeCode: string,
  EmployeeNameTha: null,
  EmployeeNameEng: null,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractMgm {
  ContractMgmId: number,
  ContractHeadId: string,
  MgmCode: string,
  MgmNameTha: null,
  MgmNameEng: null,
  RowVersion: string,
  RowState: RowState,
}

@Injectable()
export class Lots04Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/contract/master');
  }

  getCutomerLookup(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/contract/CustomerLookup/search', { params: filter });
  }

  getBorrowerLookup(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/contract/BorrowerLookup/search', { params: filter });
  }

  getMainContractLookup(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/contract/mainContractlookup/search', { params: filter });
  }

  getCheckMaxLoanAmount(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/checkMaxLoanAmount', { params: filter });
  }

  getCheckMaxLoanAmountByCustomerCompany(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/checkMaxLoanAmountByCustomerCompany', { params: filter });
  }

  getMaxInterestRate(search: any) {
    const filter = Object.assign(search);
    return this.http.get('loan/contract/getMaxInterestRate', { params: filter, responseType: 'text' });
  }

  getContractDetail(ContractHeadId?: any, ContractNo?: any): Observable<any> {
    return this.http.get<any>('loan/contract/detail', { params: { ContractHeadId: ContractHeadId, ContractNo: ContractNo } });
  }

  getContractPeriodQuery(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/processPeriod', { params: filter });
  }

  getCustomerBankAccount(customerCode: any): Observable<any> {
    return this.http.get<any>('loan/contract/CustomerBankAccount', { params: { CustomerCode: customerCode } });
  }

  getMainContractDetailQuery(MainContractNo: any): Observable<any> {
    return this.http.get<any>('loan/contract/mainContractdetail', { params: { MainContractNo: MainContractNo } });
  }

  getCloseRefinanceContractdetailQuery(ContractHeadId: any, CustomerCode: any): Observable<any> {
    return this.http.get<any>('loan/contract/CloseRefinanceContractdetail', { params: { ContractHeadId: ContractHeadId, CustomerCode: CustomerCode } });
  }

  getLoanType(CategoryId: any, CustomerCode: any, CompanyCode: any, CloseRefinance: any, Compose: any, LoanContractType: any, LoanLimitAmount: any, TypeOfPay: any, MortgageOnly: any, RefinanceType: any, RefinanceAmount: any, SecuritiesUnmatched: any) {
    return this.http.get<any>('loan/contract/getLoanType', { params: { CategoryId: CategoryId, CustomerCode: CustomerCode, CompanyCode: CompanyCode, CloseRefinance: CloseRefinance, Compose: Compose, LoanContractType: LoanContractType, LoanLimitAmount: LoanLimitAmount, TypeOfPay: TypeOfPay, MortgageOnly: MortgageOnly, RefinanceType: RefinanceType, RefinanceAmount: RefinanceAmount, SecuritiesUnmatched: SecuritiesUnmatched } });
  }

  getEmployeeTable(search: any, page: any) {
    const param = {
      EmployeeCode: search.EmployeeCode,
      EmployeeName: search.EmployeeName,
      sort: page.sort || '',
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      index: page.index,
      size: page.size
    }
    return this.http.get<any>('loan/contract/getEmployeeList', { params: param });
  }

  getMgmTable(customerMain: any, search: any, page: any) {
    const param = {
      CustomerMain: customerMain,
      MgmCode: search.MgmCode,
      MgmName: search.MgmName,
      CustomerCode: search.CustomerCode,
      sort: page.sort || '',
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      index: page.index,
      size: page.size
    }
    return this.http.get<any>('loan/contract/getMgmList', { params: param });
  }

  saveContract(data: ContractHead) {
    if (data.ContractNo) {
      return this.http.unit().put<ContractHead>('loan/contract/updateContract', data);
    } else {
      return this.http.unit().post<ContractHead>('loan/contract/insertContract', data);
    }
  }

  checkBorrowerAddress(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/checkBorrowerAddress', { params: filter });
  }

  checkDebtAmountLimitCustomer(search: any) {
    const filter = Object.assign(search);
    return this.http.get('loan/contract/getDebtAmountLimitCustomer', { params: filter });
  }

  checkContractRefinanceByCustomer(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/checkContractRefinanceByCustomer', { params: filter });
  }

  checkMainDebtAmountCustomer(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/checkMainDebtAmountCustomer', { params: filter });
  }

  checkCustomerCount(data) {
    const param = {
      CustomerCode: data,
    }
    return this.http.get<any>('loan/contract/checkCustomerCount', { params: param });
  }

  getMaxLoanAmount(CategoryId: any, CustomerCode: any, CompanyCode: any, CloseRefinance: any, Compose: any, LoanContractType: any, LoanLimitAmount: any, TypeOfPay: any, MortgageOnly: any, RefinanceType: any, RefinanceAmount: any, SecuritiesUnmatched: any) {
    return this.http.get<any>('loan/contract/getMaxLoanAmount', { params: { CategoryId: CategoryId, CustomerCode: CustomerCode, CompanyCode: CompanyCode, CloseRefinance: CloseRefinance, Compose: Compose, LoanContractType: LoanContractType, LoanLimitAmount: LoanLimitAmount, TypeOfPay: TypeOfPay, MortgageOnly: MortgageOnly, RefinanceType: RefinanceType, RefinanceAmount: RefinanceAmount, SecuritiesUnmatched: SecuritiesUnmatched } });
  }
}
