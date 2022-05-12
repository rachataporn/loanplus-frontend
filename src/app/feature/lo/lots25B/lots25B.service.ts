import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState, FileService } from '@app/shared';

export interface ContractHead {
  ContractHeadId: number,
  Id: number,
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
  PriorityPrinciple: number,
  ContractBorrower: ContractBorrower[],
  ContractSecurities: ContractSecurities[],
  ContractInformation: ContractInformation[],
  ContractIncomeItem: ContractItem[],
  ContractPaymentItem: ContractItem[],
  ContractPeriod: ContractPeriod[]
  ContractItem: ContractItem[],
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
  IsDisableAttachment: boolean
  MaximumInterestRateDisplay: number
  MainType: string
  SubType: string
  TranNo: string
  AppLoanEffectiveInterestRatePlan: number,
  ContractGuarantor: ContractGuarantor[],
  LoantypesList: any[],
  OldContractId: number,
  TotalAllContractAmount: number,
  Activity: string,
  ContractNoti: ContractNoti[],
  RequestNumber: string,
  RequestDate: Date,
  RequestApproveDate: Date,
  RequestApproveBy: string,
  RequestStatus: string,
  RequestReview: string,
  RequestReviewName: string,
  ReqType: string,
  RequestType: string,
  VerifyBranch: VerifyBranch[],
  ReqNo: string,
  RequestAcceptStatus: string,
}

export interface VerifyBranch {
  TextTha: string,
  TextEng: string,
}

export interface ContractBorrower {
  ContractBorrowerId: number,
  Id: number,
  ContractHeadId: number,
  CustomerCode: string,
  CustomerNameTha: string,
  CustomerNameEng: string,
  ContractBorrowMain: boolean,
  LoanAmount: number,
  BorrowSeq: number,
  DebtAmount: number,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractSecurities {
  Id: number,
  ContractHeadId: number,
  CustomerSecuritiesId: number,
  Description: string,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractInformation {
  ContractInformationId: number,
  Id: number,
  InformationId: number,
  ContractHeadId: number,
  AddOn: number,
  Active: boolean,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractItem {
  ContractItemId: number,
  Id: number,
  LoItemCode: string,
  LoItemSectionCode: string,
  LoImgPath: string,
  LoImgName: string,
  Amount: number,
  ContractHeadId: number,
  Description: string,
  RowVersion: string,
  RowState: RowState
}

export interface ContractNoti {
  Id: number,
  NotiDesc: string,
  NotiDate: Date,
  ContractHeadId: number,
  RowVersion: string,
  RowState: RowState
}

export interface ContractPeriod {
  Id: number,
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
  IsDisableAttachment: boolean
}

export interface Report {
  ContractNo: string,
  ExportType: string
}

export interface ReportLorf10 {
  ContractHeadId: number,
}

export interface ReportVoucher {
  ContractHeadId: number,
}

export interface ReportParam {
  FromContractNo: string,
  ToContractNo: string,
  ReportName: string,
  ExportType: string,
  OldContractHeadId: number
}

export interface ContractStatus {
  StatusValue: string,
  RowState: string,
  Active: boolean,
}

export interface RequestStatus {
  StatusValue: string,
  RowState: string,
  Active: boolean,
}

export interface AcceptStatus {
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
  Id: number,
  ContractHeadId: string,
  CompanyCode: string,
  EmployeeCode: string,
  EmployeeNameTha: null,
  EmployeeNameEng: null,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractMgm {
  Id: number,
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

export interface ContractAttachment {
  ContractAttachmentId: number,
  ContractHeadId: number,
  AttachmentTypeCode: string,
  FilePath: string,
  FileName: string,
  Description: string,
  AttahmentId: number,
  RowState: RowState,
  IsDisableAttachment: boolean
}

export interface LoContractHead {
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
  ContractBorrower: LoContractBorrower[],
  ContractSecurities: LoContractSecurities[],
  ContractInformation: LoContractInformation[],
  ContractGuarantor: ContractGuarantor[],
  ContractIncomeItem: LoContractItem[],
  ContractPaymentItem: LoContractItem[],
  ContractPeriod: LoContractPeriod[],
  ContractItem: LoContractItem[],
  ContractMgmEmployee: LoContractMgmEmployee[],
  ContractMgm: LoContractMgm[],
  LoantypesList: any[],
  CustomerName: string
  IsDisableAttachment: boolean,
  RequestNumber: string,
  ReqType: string,
  ReqNo: string,
}

export interface LoContractBorrower {
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

export interface LoContractSecurities {
  ContractSecuritiesId: number,
  ContractHeadId: number,
  CustomerSecuritiesId: number,
  Description: string,
  RowVersion: string,
  RowState: RowState,
}

export interface LoContractInformation {
  ContractInformationId: number,
  InformationId: number,
  ContractHeadId: number,
  AddOn: number,
  RowVersion: string,
  RowState: RowState,
}

export interface LoContractGuarantor {
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

export interface LoContractItem {
  ContractItemId: number,
  LoItemCode: string,
  LoItemSectionCode: string,
  Amount: number,
  ContractHeadId: number,
  Description: string,
  RowVersion: string,
  RowState: RowState
}

export interface LoContractPeriod {
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

export interface LoContractMgmEmployee {
  ContractMgmEmployeeId: number,
  ContractHeadId: number,
  CompanyCode: string,
  EmployeeCode: string,
  EmployeeNameTha: null,
  EmployeeNameEng: null,
  RowVersion: string,
  RowState: RowState,
}

export interface LoContractMgm {
  ContractMgmId: number,
  ContractHeadId: number,
  MgmCode: string,
  MgmNameTha: null,
  MgmNameEng: null,
  RowVersion: string,
  RowState: RowState,
}

@Injectable()
export class Lots25BService {
  constructor(private http: HttpClient,
    private fs: FileService
  ) { }

  getMaster(isDetail): Observable<any> {
    console.log(" into getMaster ")
    return this.http.get<any>('loan/LoanAgreement/master', { params: { isDetail: isDetail } });
  }

  getLoanAgreement(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/LoanAgreement/loanAgreement/search', { params: filter });
  }

  getLoanAgreementDetail(ContractHeadId?: any): Observable<any> {
    return this.http.get<any>('loan/LoanAgreement/detail', { params: { ContractHeadId: ContractHeadId } });
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

  saveLoanAgreement(data, attachments) {
    let contractFormData = this.fs.convertModelToFormData(data, { AttachmentDetailFiles: attachments });
    if (data.ContractNo) {
      return this.http.unit().put('loan/LoanAgreement/updateContract', contractFormData);
    } else {
      return this.http.unit().post('loan/LoanAgreement/insertContract', contractFormData);
    }
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
    return this.http.get<any>('loan/contract/getEmployeeList', { params: param });
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
    return this.http.get<any>('loan/contract/getMgmList', { params: param });
  }

  getLoanType(CategoryId: any, CustomerCode: any, CompanyCode: any, CloseRefinance: any) {
    return this.http.get<any>('loan/ContractManagement/getLoanType', { params: { CategoryId: CategoryId, CustomerCode: CustomerCode, CompanyCode: CompanyCode, CloseRefinance: CloseRefinance } });
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
    if (data.Id) {
      return this.http.unit().put<ContractHead>('loan/LoanAgreement/approveSecurityCustomer', data);
    }
  }

  printQrBar(data: Report) {
    return this.http.post('loan/LoanAgreement/printQrBar', data, { responseType: 'text' });
  }


  getContractManagement(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/ContractManagement/searchLots25B', { params: filter });
  }

  getContractManagementDetail(ContractHeadId?: any): Observable<any> {
    return this.http.get<any>('loan/ContractManagement/detail', { params: { ContractHeadId: ContractHeadId } });
  }

  getBorrowerLookup(search: any, page: any) {
   console.log(" into getBorrowerLookup")
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/contract/BorrowerLookup/search', { params: filter });
  }

  getMainContractDetailQuery(MainContractNo: any): Observable<any> {
    return this.http.get<any>('loan/contract/mainContractdetail', { params: { MainContractNo: MainContractNo } });
  }

  getCloseRefinanceContractdetailQuery(ContractHeadId: any, CustomerCode: any): Observable<any> {
    return this.http.get<any>('loan/contract/CloseRefinanceContractdetail', { params: { ContractHeadId: ContractHeadId, CustomerCode: CustomerCode } });
  }

  getMaxInterestRate(search: any) {
    const filter = Object.assign(search);
    return this.http.get('loan/contract/getMaxInterestRate', { params: filter, responseType: 'text' });
  }
  
  checkDebtAmountLimitCustomer(search: any) {
    const filter = Object.assign(search);
    return this.http.get('loan/contract/getDebtAmountLimitCustomer', { params: filter });
  }

  getCheckMaxLoanAmountByCustomerCompany(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/checkMaxLoanAmountByCustomerCompany', { params: filter });
  }

  checkBorrowerAddress(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/checkBorrowerAddress', { params: filter });
  }

  getContractPeriodQuery(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/processPeriod', { params: filter });
  }

  saveContract(data: LoContractHead) {
      return this.http.unit().post<LoContractHead>('loan/contract/insertContract', data);
  }

  saveContractAndSendNotification(data) {
   //let contractFormData = this.fs.convertModelToFormData(data, { AttachmentDetailFiles: attachments });
   console.log(" saveContractAndSendNotification ");
   if (data.RequestNumber) {
     return this.http.unit().put<ContractNoti>('loan/ContractManagement/updateContractAndSendNotification', data);
   } else{
     console.log(" data.RequestNumber is null ")
   }
  }
  

  saveContractManagementAndLoContract(data:ContractHead,lodata:LoContractHead) {
    console.log(" saveContractManagement ");
    var jsonData = {
        pcmLoContractHead : data,
        loContractHead : lodata
    }
    if (data.RequestNumber) {
      //this.http.unit().put<ContractHead>('loan/ContractManagement/updateContract', data);
      //return this.http.unit().post<LoContractHead>('loan/contract/insertContract', lodata);
      //return this.http.unit().put<LoContractHead>('loan/ContractManagement/updateEmptyData', data);
      return this.http.unit().post<any>('loan/ContractManagement/CreateLoContractHead', jsonData);
    } else{
      console.log(" data.ContractNo is null ")
    }
    
  }

  saveContractManagement(data:ContractHead) {
    console.log(" saveContractManagement ");
    if (data.RequestNumber) {
      return this.http.unit().put<ContractHead>('loan/ContractManagement/updateContract', data);
    } else{
      console.log(" data.ContractNo is null ")
    }
    
  }

  getContractDetail(ContractHeadId?: any, ContractNo?: any): Observable<any> {
    return this.http.get<any>('loan/contract/detail', { params: { ContractHeadId: ContractHeadId, ContractNo: ContractNo } });
  }

  checkContractRefinanceByCustomer(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/checkContractRefinanceByCustomer', { params: filter });
  }

  getContractManageMasterDetail(ContractHeadId?: any): Observable<any> {
    return this.http.get<any>('loan/ContractManagement/masterDetail', { params: { ContractHeadId: ContractHeadId } });
  }

  getContractManageGetDetail(ContractHeadId?: any, ContractNo?: any): Observable<any> {
    return this.http.get<any>('loan/ContractManagement/contractManagementDetail', { params: { ContractHeadId: ContractHeadId, ContractNo: ContractNo } });
  }

  getMainContractLookup(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/contract/mainContractlookup/search', { params: filter });
  }

  getCutomerLookup(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/contract/CustomerLookup/search', { params: filter });
  }

  checkUsedCustomerSecurities(data?:ContractHead,lodata?:LoContractHead){
    console.log(" checkOldContractStatus ");
    return this.http.unit().post<any>('loan/ContractManagement/checkUsedCustomerSecurities', data);
  }

  cancelRequestContract(data?:ContractHead){
    return this.http.unit().put<any>('loan/ContractManagement/cancelRequestContract', data);
  }

  checkApproverIsnotCustomer(employeeIdCard:any,customerCode:any){
    // console.log(" test into checkApproverIsnotCustomer service call")
    // console.log(" employeeIdCard : "+employeeIdCard);
    // console.log(" customerCode : "+customerCode);
    var json = {
      employeeIdCard : employeeIdCard,
      customerCode : customerCode
    }
    console.log(json);
    return this.http.unit().post<any>('loan/ContractManagement/checkApprover', json);
  }
  
}
