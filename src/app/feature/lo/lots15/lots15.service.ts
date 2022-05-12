import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface Loan {
  ContractHeadID: number;
  ContractPeriodID: number;
  ReceiptHeadId: number;
  ReceiptNo: string;
  ReceiptDate: Date;
  ReceiptBy: string;
  ReceiptByTha: string;
  ReceiptByEng: string;
  ReceiptStatus: string;
  RefInvoiceHeadId: number;
  InvoiceNo: string;
  InvoiceDate: Date;
  InvoiceBy: string;
  InvoiceByTha: string;
  InvoiceByEng: string;
  LoanNo: string;
  CustomerName: string;
  CustomerNameTha: string;
  CustomerNameEng: string;
  CustomerCode: string;
  IdCard: string;
  LoanType: string;
  LoanTypeTha: string;
  LoanTypeEng: string;
  LoanTotalAmount: number;
  LoanPayDay: number;
  LoanInterestLate: number;
  LoanPeriodAmount: number;
  InvoiceTotalAmount: number;
  ReceiptTotalAmount: number;
  ReceiptType: string;
  CompanyCode: string;
  RowVersion: string,
  ReceiptDetails: ReceiptDetails[];
  ReceiptAttachment: ReceiptAttachment[];
  ReceiptPayment: ReceiptPayment[];
  CreateDateString: string;
}

export interface ReceiptDetails {
  RefInvoiceDetailId: number;
  ReceiptDescriptionTha: string;
  ReceiptDescriptionEng: string;
  InvoiceAmount: number;
  ReceiptAmount: number;
  RemainAmount: number;
  InvoiceType: string;
  Priority: number;
  Sequence: number;
  Period: number;
  PrepayFlag: boolean;
  RowVersion: string,
  RowState: RowState;
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
  RowVersion: string;
  RowState: RowState;
}

export interface ReceiptAttachment {
  ImageName: string;
  ImageFlag: boolean;
  RowState: RowState;
}

export interface PaymentFlag {
  IsPayOff: boolean
}

export interface ReportDto {
  receiptNo: string;
  companyCode: string;
  documentType: string;
}

export interface Cancel {
  ReceiptHeadId: number;
  Remark: string
}

@Injectable()
export class Lots15Service {
  constructor(private http: HttpClient) { }

  getMaster(isDetail): Observable<any> {
    return this.http.get<any>('loan/advanceDetail/master', { params: { isDetail: isDetail } });
  }

  getReceiptDetailList(search: any, page: any) {
    const param = {
      Branch: search.Branch,
      ReceiptDateFrom: search.ReceiptDateFrom,
      ReceiptDateTo: search.ReceiptDateTo,
      ContractNoFrom: search.ContractNoFrom,
      ContractNoTo: search.ContractNoTo,
      ReceiptNoFrom: search.ReceiptNoFrom,
      ReceiptNoTo: search.ReceiptNoTo,
      CustomerCode: search.CustomerCode,
      PaidStatus: search.PaidStatus,
      sort: page.sort || 'ReceiptDate DESC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/advanceDetail/getAdvanceDetailList', { params: param });
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
    return this.http.get<any>('loan/advanceDetail/getContractLOV', { params: param });
  }

  getReceiptLOV(search: any, page: any) {
    const param = {
      CustomerCode: search.CustomerCode,
      CustomerName: search.CustomerName,
      ReceiptNo: search.ReceiptNo,
      sort: page.sort || 'ReceiptNo ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/advanceDetail/getReceiptLOV', { params: param });
  }

  getReceiptDetail(ReceiptHeadId) {
    const param = {
      ReceiptHeadId: ReceiptHeadId
    };
    return this.http.get<any>('loan/advanceDetail/getAdvanceDetail', { params: param });
  }

  printInvoice(data: ReportDto) {
    return this.http.post<any>('loan/advanceDetail/printAdvance', data);
  }

  saveCancelReceipt(data: Cancel) {
    return this.http.put<any>('loan/advanceDetail/cancelAdvance', data);
  }
}
