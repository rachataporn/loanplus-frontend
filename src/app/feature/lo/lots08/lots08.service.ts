import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface Receipt {
  ContractHeadID: number;
  CompanyCode: string;
  CustomerCode: string;
  ContractNo: string;
  LoanTotalAmount: number;
  LoanPeriodAmount: string;
  LoanPayDay: number;
  LoanInterestLate: number;
  LoanToalPeriod: number;
  LoanType: string;
  LoanTypeTha: string;
  LoanTypeEng: string;
  CustomerName: string;
  CustomerNameTha: string;
  CustomerNameEng: string;
  InvoiceNo: string;
  InvoiceDate: Date;
  InvoiceBy: string;
  InvoiceStatus: string;
  ReceiptType: string;
  DocumentType: string;
  ArAdvanceAmount: number;
  BalancePrincipleAmount: number;
  AdjustFineAmount: number;
  AdjustDebtCollectionAmount: number;
  ReceiptDetails: ReceiptDetails[];
  ReceiptAttachment: ReceiptAttachment[];
  ReceiptPayment: ReceiptPayment[];
}

export interface ReceiptDetails {
  DescriptionTha: string;
  DescriptionEng: string;
  AmountToBePay: number;
  AmountPaid: number;
  AmountOfPayment: number;
  BaseAmountToBePay: number;
  AccuredPrincipleAmount: number;
  AccuredInterestAmount: number;
  BalancePrincipleAmount: number;
}

export interface ReceiptPayment {
  ReceiptPaymentId: number;
  ReceiptHeadId: number;
  CompanyCode: string;
  ReceiveTypeCode: string;
  CompanyAccountId: number;
  BankCode: string;
  AccountNo: string;
  ReceiveDate: Date;
  PaidAmount: number;
  BankName: string;
  BranchName: string;
  RowVersion: string;
  RowState: RowState;
}

export interface ReceiptAttachment {
  ReceiptAttachmentId: number,
  FilePath: string,
  FileName: string,
  Description: string,
  AttahmentId: number,
  RowState: RowState,
  IsDisableAttachment: boolean
}

export interface PaymentFlag {
  IsPayOff: boolean
}

export interface ReportDto {
  receiptNo: string
  documentType: string;
  companyCode: string;
}

export interface DefaultPrepay {
  ContractDefaultFlag: boolean;
  ContractPolicy: string;
}

@Injectable()
export class Lots08Service {
  constructor(private http: HttpClient) { }

  getMaster(isDetail): Observable<any> {
    return this.http.get<any>('loan/payment/master', { params: { isDetail: isDetail } });
  }

  getPaymentList(search: any, page: any) {
    const param = {
      // ContractNoFrom: search.ContractNoFrom,
      // ContractNoTo: search.ContractNoTo,
      Keyword: search.Keyword,
      ContractDateFrom: search.ContractDateFrom,
      ContractDateTo: search.ContractDateTo,
      InvoiceNoFrom: search.InvoiceNoFrom,
      InvoiceNoTo: search.InvoiceNoTo,
      InvoiceDateFrom: search.InvoiceDateFrom,
      InvoiceDateTo: search.InvoiceDateTo,
      StartDueDate: search.StartDueDate,
      EndDueDate: search.EndDueDate,
      // CustomerCode: search.CustomerCode,
      InvoiceStatus: search.InvoiceStatus,
      PaidStatus: search.PaidStatus,
      sort: page.sort || 'DueDate DESC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/payment/getPaymentList', { params: param });
  }

  getContractLOV(search: any, page: any) {
    const param = {
      CustomerCode: search.CustomerCode,
      CustomerName: search.CustomerName,
      LoanNo: search.LoanNo,
      IdCard: search.IdCard,
      sort: page.sort || 'LoanNo ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/payment/getContractLOV', { params: param });
  }

  getInvoiceLOV(search: any, page: any) {
    const param = {
      CustomerCode: search.CustomerCode,
      CustomerName: search.CustomerName,
      InvoiceDate: search.InvoiceDate,
      InvoiceNo: search.InvoiceNo,
      sort: page.sort || 'InvoiceNo ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/payment/getInvoiceLOV', { params: param });
  }

  getLoanDetail(MainContractHeadID, IsUpdate) {
    const param = {
      MainContractHeadID: MainContractHeadID,
      IsUpdate: IsUpdate
    };
    return this.http.get<any>('loan/payment/getPaymentDetail', { params: param });
  }

  saveReceipt(data: Receipt) {
    return this.http.unit().post<Receipt>('loan/payment/insertReceiptNew', data);
  }

  printReceipt(data: ReportDto) {
    return this.http.post<any>('loan/payment/printReceipt', data);
  }

  getCalculateProcess(MainContractHeadID, ReceiptDate, Amount, FlagPayOff, PrepayFlag, PlanFineAmount, PlanDebtCollectionAmount) {
    const data = {
      MainContractHeadID: MainContractHeadID,
      ReceiptDate: ReceiptDate,
      Amount: Amount,
      FlagPayOff: FlagPayOff,
      PrepayFlag: PrepayFlag,
      PlanFineAmount: PlanFineAmount,
      PlanDebtCollectionAmount: PlanDebtCollectionAmount
    };
    return this.http.post<any>('loan/payment/getCalculateProcessNew', data);
  }

  CheckDefaultPrepayFlag(MainContractHeadID, ReceiptDate) {
    const filter = {
      MainContractHeadID: MainContractHeadID,
      ReceiptDate: ReceiptDate
    };
    return this.http.post<DefaultPrepay>('loan/payment/checkDefaultPrepayFlag', filter);
  }

  generateContractPeriod(MainContractHeadID) {
    const param = {
      MainContractHeadID: MainContractHeadID
    };
    return this.http.get<any>('loan/payment/generateContractPeriod', { params: param });
  }
}
