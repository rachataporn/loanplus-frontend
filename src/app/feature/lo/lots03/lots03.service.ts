import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState, FileService } from '@app/shared';

export interface ContractHead {
  ContractHeadId: number,
  CompanyCode: string,
  DocumentTypeCode: string,
  DocumentSubTypeCode: string,
  LoanTypeCode: string,
  ContractNo: string,
  ContractDate: Date,
  ContractStatus: string,
  Signature: boolean,
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
  PriorityPrinciple: number,
  ContractBorrower: ContractBorrower[],
  ContractSecurities: ContractSecurities[],
  ContractInformation: ContractInformation[],
  ContractIncomeItem: ContractItem[],
  ContractPaymentItem: ContractItem[],
  ContractPeriod: ContractPeriod[]
  ContractItem: ContractItem[],
  ContractAttachment: ContractAttachment[],
  ContractAttachmentCall: ContractAttachmentCall[],
  ContractAttachmentHome: ContractAttachmentCall[],
  ContractAttachmentNpl: ContractAttachmentCall[],
  ContractAttachmentLaw: ContractAttachmentCall[],
  ContractAttachmentOther: ContractAttachmentCall[],
  ContractMgmEmployee: ContractMgmEmployee[],
  ContractMgm: ContractMgm[],
  editStatus: string,
  minContractNo: string,
  maxContractNo: string,
  CanRefinance: boolean,
  MainContrctHeadId: number,
  CallTrackingStatus: string,
  HomeTrackingStatus: string,
  NplTrackingStatus: string,
  LawTrackingStatus: string,
  CallTrackingStatusDisplay: string,
  HomeTrackingStatusDisplay: string,
  NplTrackingStatusDisplay: string,
  LawTrackingStatusDisplay: string,
  CustomerName: string,
  IsDisableAttachment: boolean,
  MaximumInterestRateDisplay: number,
  MainType: string,
  SubType: string,
  TranNo: string,
  AppLoanEffectiveInterestRatePlan: number,
  PreRefinanceType: string,
  RejectContractBy: string,
  RejectContractDate: Date,
  CancelContractBy: string,
  CancelContractDate: Date,
  PaidContractBy: string,
  PaidContractDate: Date,
  LawTrackingStatusType: string
  RefinanceReqType: string,
  SignatureStatusTha: string,
  SignatureStatusEng: string,
  ReqType: string,
  ReqTypeTha: string,
  ReqTypeEng: string
  CanRefinanceByDate: string
  ReqNo: string,
  SignatureStatus: string,
  IsNotRefinance: boolean,
  IsApproveRefinanceLaw: boolean,
  AccruedBalanceOverNinetyAmount: number,
  ApprovePaymentOnlineStatus: string,
  ApprovePaymentOnlineDate: Date
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
  Active: boolean,
  RowVersion: string,
  RowState: RowState,
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

export interface ContractAttachment {
  ContractAttachmentId: number,
  ContractHeadId: number,
  AttachmentTypeCode: string,
  FilePath: string,
  FileName: string,
  Description: string,
  AttahmentId: number,
  RowState: RowState,
  IsDisableAttachment: boolean,
  IsSignature: boolean,
  CopyDocRefinance: boolean
}

export interface ContractAttachmentCall {
  TrackingAttachmentId: number,
  FileName: string,
  AttahmentId: number,
  Description: string,
  RowState: RowState,
  IsDisableAttachment: boolean,
  CreatedDate: Date,
  CreatedBy: string
}

export interface Report {
  ContractNo: string,
  ExportType: string
}

export interface ReportLorf10 {
  ContractHeadId: number
}

export interface ReportVoucher {
  ContractHeadId: number
}

export interface ReportParam {
  FromContractNo: string,
  ToContractNo: string,
  ReportName: string,
  ExportType: string,
  OldContractHeadId: number
  ContractHeadId: number
}

export interface ContractStatus {
  StatusValue: string,
  RowState: string,
  Active: boolean,
}

export interface ReportParamLorp15 {
  FromBranchCode: string;
  ToBranchCode: string;
  FromLoanType: string;
  ToLoanType: string;
  AsOfDate: Date;
  FromContractNo: string;
  ToContractNo: string;
  FromCustomerCode: string;
  ToCustomerCode: string;
  ReportFormat: string;
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

export interface ContractPolicy {
  ContractPolicyId: number,
  ContractHeadId: number,
  PolicyCode: string,
  PolicyDate: Date,
  PolicyRemark: string,
  PolicyPeriodCount: number
}

@Injectable()
export class Lots03Service {
  constructor(private http: HttpClient,
    private fs: FileService
  ) { }

  getMaster(isDetail): Observable<any> {
    return this.http.get<any>('loan/LoanAgreement/master', { params: { isDetail: isDetail } });
  }

  getLoanAgreement(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/LoanAgreement/loanAgreement/search', { params: filter });
  }

  getLoanAgreementDetail(ContractHeadId?: any): Observable<any> {
    return this.http.get<any>('loan/LoanAgreement/detail', { params: { ContractHeadId: ContractHeadId } });
  }

  getCutomerLookup(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/LoanAgreement/CustomerLookup/search', { params: filter });
  }

  getCheckMaxLoanAmount(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/LoanAgreement/checkMaxLoanAmount', { params: filter });
  }

  getCustomerBankAccount(customerCode: any): Observable<any> {
    return this.http.get<any>('loan/LoanAgreement/CustomerBankAccount', { params: { CustomerCode: customerCode } });
  }

  getContractPeriod(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/LoanAgreement/ContractPeriod', { params: filter });
  }

  getContractReceivePeriod(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/LoanAgreement/ContractReceivePeriod', { params: filter });
  }

  getAllAccuredBalanceEnding(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/LoanAgreement/AllAccuredBalanceEnding', { params: filter });
  }

  getAccuredBalanceEnding(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/LoanAgreement/AccuredBalanceEnding', { params: filter });
  }

  saveLoanAgreement(data) {
    return this.http.unit().put('loan/LoanAgreement/updateContract', data);
  }

  cancelContract(data: ContractHead) {
    if (data.ContractNo) {
      return this.http.unit().put<ContractHead>('loan/LoanAgreement/updateContractStatus', data);
    }
  }

  reFinanceContract(data: ContractHead) {
    if (data.ContractNo) {
      return this.http.unit().put<ContractHead>('loan/LoanAgreement/reFinance', data);
    }
  }

  getAllContractPeriod(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/LoanAgreement/AllContractPeriod', { params: filter });
  }

  getAllContractReceivePeriod(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/LoanAgreement/AllContractReceivePeriod', { params: filter });
  }

  print(data: Report) {
    return this.http.post('loan/LoanPeriodTable/print', data, { responseType: 'text' });
  }

  printCertificateAddress(data: ReportLorf10) {
    return this.http.post('loan/LoanAgreement/printCertificateAddress', data, { responseType: 'text' });
  }

  printPaymentVoucher(data: ReportVoucher) {
    return this.http.post('loan/loanorderreport/printPaymentVoucher', data);
  }

  printReceiptVoucher(data: ReportVoucher) {
    return this.http.post('loan/loanorderreport/printReceiptVoucher', data);
  }

  printConsent(data: ReportVoucher) {
    return this.http.post('loan/loanorderreport/printConsent', data, { responseType: 'text' });
  }

  generateReportRf06(param: ReportParam) {
    return this.http.post('loan/loanorderreport/getlorf06report', param, { responseType: 'text' });
  }

  generateReportRf02(param: ReportParam) {
    return this.http.post('loan/loanagreementreport/getlorf02report', param, { responseType: 'text' });
  }

  generateReportRf09(param: ReportParam) {
    return this.http.post('loan/guaranteesreport/getlorf09report', param, { responseType: 'text' });
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
    return this.http.get<any>('loan/LoanAgreement/getEmployeeList', { params: param });
  }

  getMgmTable(search: any, page: any) {
    const param = {
      MgmCode: search.MgmCode,
      MgmName: search.MgmName,
      sort: page.sort || '',
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      index: page.index,
      size: page.size
    }
    return this.http.get<any>('loan/LoanAgreement/getMgmList', { params: param });
  }

  getLoanType(CategoryId: any, CustomerCode: any, CompanyCode: any, CloseRefinance: any) {
    return this.http.get<any>('loan/LoanAgreement/getLoanType', { params: { CategoryId: CategoryId, CustomerCode: CustomerCode, CompanyCode: CompanyCode, CloseRefinance: CloseRefinance } });
  }

  getSearchHistoryCall(MainContrctHeadId: any, page: any) {
    const param = {
      MainContrctHeadId: MainContrctHeadId,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreement/getSearchHistoryCall', { params: param });
  }

  getSearchHistoryCompany(MainContrctHeadId: any, page: any) {
    const param = {
      MainContrctHeadId: MainContrctHeadId,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreement/getSearchHistoryCompany', { params: param });
  }

  getSearchHistoryHome(MainContrctHeadId: any, page: any) {
    const param = {
      MainContrctHeadId: MainContrctHeadId,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreement/getSearchHistoryHome', { params: param });
  }

  getSearchHistoryLaw(MainContrctHeadId: any, page: any) {
    const param = {
      MainContrctHeadId: MainContrctHeadId,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreement/getSearchHistoryLaw', { params: param });
  }

  getSearchHistorySms(MainContrctHeadId: any, page: any) {
    const param = {
      MainContrctHeadId: MainContrctHeadId,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreement/getSearchHistorySms', { params: param });
  }

  saveLoanAgreementPolicy(data: ContractPolicy) {
    if (data.ContractPolicyId) {
      return this.http.unit().put('loan/LoanAgreement/updateContractPolicy', data);
    } else {
      return this.http.unit().post('loan/LoanAgreement/insertContractPolicy', data);
    }
  }

  getLoanAgreementPolicyDetail(search: any, page: any): Observable<any> {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/LoanAgreement/policyDetail', { params: filter });
  }

  removeContractPolicy(data) {
    const param = {
      ContractPolicyId: data.ContractPolicyId,
      ContractHeadId: data.ContractHeadId,
      RowVersion: data.RowVersion
    };
    return this.http.delete<any>('loan/LoanAgreement/deleteContractPolicy', { params: param });
  }

  cancelReFinanceContract(data: ContractHead) {
    if (data.ContractNo) {
      return this.http.unit().put<ContractHead>('loan/LoanAgreement/cancelReFinance', data);
    }
  }

  cancelContractCapital(data: ContractHead) {
    if (data.ContractNo) {
      return this.http.unit().put<ContractHead>('loan/LoanAgreement/cancelContractCapital', data);
    }
  }

  getContractProcessLists(search: any, page: any): Observable<any> {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/LoanAgreement/contractProcessLists', { params: filter });
  }

  removeContractProcess(data) {
    const param = {
      MainContractHeadId: data.MainContractHeadId,
      ReceiptHeadId: data.ReceiptHeadId,
      ProcessDate: data.ProcessDate,
      CancelRemark: data.CancelRemark,
      IsDueDate: data.IsDueDate,
      BillPaymentDetailId: data.BillPaymentDetailId,
      IsBillPayment: data.IsBillPayment
    };
    return this.http.delete<any>('loan/LoanAgreement/deleteContractProcess', { params: param });
  }

  duedateProcess(data) {
    return this.http.unit().post('loan/LoanAgreement/duedateProcess', data);
  }

  initialProcess(data) {
    return this.http.unit().post('loan/LoanAgreement/initialProcess', data);
  }

  approveSecurityCustomer(data: ContractHead) {
    if (data.ContractHeadId) {
      return this.http.unit().put<ContractHead>('loan/LoanAgreement/approveSecurityCustomer', data);
    }
  }

  printQrBar(data: Report) {
    return this.http.post('loan/LoanAgreement/printQrBar', data, { responseType: 'text' });
  }

  generateReportRf12(param: ReportParam) {
    return this.http.post('loan/loanagreementreport/getlorf12report', param, { responseType: 'text' });
  }

  generateReportRf13(param: ReportParam) {
    return this.http.post('loan/loanagreementreport/getlorf13report', param, { responseType: 'text' });
  }

  generateReportRf14(param: ReportParam) {
    return this.http.post('loan/loanagreementreport/getlorf14report', param, { responseType: 'text' });
  }

  generateReportRf15(param: ReportParam) {
    return this.http.post('loan/loanagreementreport/getlorf15report', param, { responseType: 'text' });
  }

  generateReportRf16(param: ReportParam) {
    return this.http.post('loan/loanagreementreport/getlorf16report', param, { responseType: 'text' });
  }

  generateReportRf17(param: ReportParam) {
    return this.http.post('loan/loanagreementreport/getlorf17report', param, { responseType: 'text' });
  }

  generateReportRf18(param: ReportParam) {
    return this.http.post('loan/loanagreementreport/getlorf18report', param, { responseType: 'text' });
  }

  generateReportRf19(param: ReportParam) {
    return this.http.post('loan/loanagreementreport/getlorf19report', param, { responseType: 'text' });
  }

  generateReportLORF19(param: ReportParam) {
    return this.http.post('loan/loanagreementreport/getreportlorf19', param, { responseType: 'text' });
  }

  isCheckCancelRefinance(ContractHeadId) {
    return this.http.get<boolean>('loan/LoanAgreement/isCheckCancelRefinance', { params: { ContractHeadId: ContractHeadId } });
  }

  approveRefinanceLaw(data: ContractHead) {
    if (data.ContractHeadId) {
      return this.http.unit().put<ContractHead>('loan/LoanAgreement/approveRefinanceLaw', data);
    }
  }

  getContractCustomerAccount(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/LoanAgreement/getContractCustomerAccount', { params: filter });
  }

  getSearchTrackingAttachmentCall(MainContrctHeadId: any, page: any) {
    const param = {
      MainContrctHeadId: MainContrctHeadId,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreement/getSearchTrackingAttachmentCall', { params: param });
  }

  getSearchTrackingAttachmentHome(MainContrctHeadId: any, page: any) {
    const param = {
      MainContrctHeadId: MainContrctHeadId,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreement/getSearchTrackingAttachmentHome', { params: param });
  }

  getSearchTrackingAttachmentNpl(MainContrctHeadId: any, page: any) {
    const param = {
      MainContrctHeadId: MainContrctHeadId,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreement/getSearchTrackingAttachmentNpl', { params: param });
  }

  getSearchTrackingAttachmentLaw(MainContrctHeadId: any, page: any) {
    const param = {
      MainContrctHeadId: MainContrctHeadId,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreement/getSearchTrackingAttachmentLaw', { params: param });
  }



  debtCollectionExpensesProcess(data) {
    const param = {
      MainContractHeadId: data.MainContractHeadId,
      TrackingDate: data.TrackingDate,
      Status: data.Status,
      MoveRefinanceAmount: data.MoveRefinanceAmount,
      Remark: data.Remark,
      TrackingHistoryId: data.TrackingHistoryId,
    };
    return this.http.get<any>('loan/LoanAgreement/debtCollectionExpensesProcess', { params: param });
  }

  getDebtCollectionExpensesLists(search: any, page: any): Observable<any> {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/LoanAgreement/debtCollectionExpensesLists', { params: filter });
  }
}
