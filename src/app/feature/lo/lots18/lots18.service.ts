import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState, FileService } from '@app/shared';

export interface ReportParam {
  Keyword: string,
  ProvinceId: number,
  CompanyCodeFrom: string,
  CompanyCodeTo: string,
  ProcessDateFrom: Date,
  ProcessDateTo: Date,
  PayDate: Date,
  ReportName: string
}

export interface BillPayment {
  BillPaymentDetailId: number,
  ReferenceNo1New: string,
  ReferenceNo2New: string,
  AccCode: string,
  OverAmount: number,
  ExpCode: string
}

export interface InqKkp {
  BillerID: string,
  BillReference1: string,
  BillReference2: string,
  TxnDateFrom: Date,
  TxnDateTo: Date
}

@Injectable()
export class Lots18Service {
  constructor(private http: HttpClient,
    private fs: FileService
  ) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/BillPayment/master');
  }

  getBillPaymentList(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/BillPayment/search', { params: filter });
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/BillPayment/getlots18report', param, { responseType: 'text' });
  }

  getCutomerLookup(search: any, page: any) {
    const param = {
      Keyword: search.keyword,
      IdCard: search.IdCard,
      sort: page.sort || 'CustomerCode ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/BillPayment/getCustomerLOV', { params: param });
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
    return this.http.get<any>('loan/BillPayment/getContractLOV', { params: param });
  }

  saveUnmatchedBillPaymentBAY(data: BillPayment) {
    return this.http.put('loan/BillPayment/updateUnmatchedBillPaymentBAY', data);
  }

  saveUnmatchedBillPaymentKKP(data: BillPayment) {
    return this.http.put('loan/BillPayment/updateUnmatchedBillPaymentKKP', data);
  }

  saveUnmatchedBillPaymentCS(data: BillPayment) {
    return this.http.put('loan/BillPayment/updateUnmatchedBillPaymentCS', data);
  }

  getAccCode(companyCode) {
    const param = {
      CompanyCode: companyCode
    };
    return this.http.get<any>('loan/BillPayment/getAccCodeList', { params: param });
  }

  getCheckKkpPayment(data, billReference1, billReference2) {
    const param = {
      BillerReferenceNo: null,
      PaymentDate: data.PaymentDate,
      PaymentAmount: data.PaymentAmount,
      BillReference1: billReference1,
      BillReference2: billReference2
    };
    return this.http.get<any>('loan/BillPayment/getCheckKkpPayment', { params: param });
  }

  inqKkp(data: InqKkp) {
    return this.http.post('loan/BillPayment/inqKkp', data);
  }

  payKkp(data) {
    return this.http.post('loan/BillPayment/payByKkp', data);
  }

}