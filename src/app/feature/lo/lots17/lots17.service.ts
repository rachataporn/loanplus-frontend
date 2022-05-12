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
  ProcessDate: Date;
  PrePaymentPeriod: string;
  AdvancePaymentAmount: number;
  AdvancePaymentEstimateAmount: number;
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
  ImageName: string;
  ImageFlag: boolean;
  RowState: RowState;
}

export interface PaymentFlag {
  IsPayOff: boolean
}

export interface ReportDto {
  receiptNo: string
  documentType: string;
  companyCode: string;
}


@Injectable()
export class Lots17Service {
  constructor(private http: HttpClient) { }

  getMaster(isDetail): Observable<any> {
    return this.http.get<any>('loan/payment/master', { params: { isDetail: isDetail } });
  }

  getPaymentAdvanceDetail(MainContractHeadID, IsUpdate) {
    const param = {
      MainContractHeadID: MainContractHeadID,
      IsUpdate: IsUpdate
    };
    return this.http.get<any>('loan/payment/getPaymentAdvanceDetail', { params: param });
  }

  saveReceipt(data: Receipt) {
    return this.http.unit().post<Receipt>('loan/payment/insertReceipt', data);
  }

  printReceipt(data: ReportDto) {
    return this.http.post<any>('loan/payment/printReceipt', data);
  }

  getCalculateProcess(MainContractHeadID, ReceiptDate, Amount, FlagPayOff) {
    const data = {
      MainContractHeadID: MainContractHeadID,
      ReceiptDate: ReceiptDate,
      Amount: Amount,
      FlagPayOff: FlagPayOff
    };
    return this.http.post<any>('loan/payment/getCalculateProcess', data);
  }
}
