import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableService, RowState } from '@app/shared';


export interface CashSubmitHead {
  CashSubmitHeadId: number,
  CashSubmitNo: string,
  CashSubmitDate: Date,
  CompanyCode: string,
  OfferAmount: number,
  NetAmount: number,
  CashSubmitStatus: string,
  CashSubmitRemark: string,
  CashSubmitVerifiedBy: string,
  CashSubmitVerifiedDate: Date,
  CompanyAccountId: number,
  AccountNo: string,
  SubmitTimeHour: string,
  SubmitTimeMinute: string,
  RemarkBranch: string,
  RemarkAccount: string,
  BankCode: string,
  AmountCarried: number,
  RowVersion: string,
  DepositType: string,
  CashSubmitDetail: CashSubmitDetail[],
  CashSubmitAttachment: CashSubmitAttachment[]
}

export interface CashSubmitDetail {
  CashSubmitDetailId: number,
  CashSubmitHeadId: number,
  ReceiptHeadId: number,
  ContractHeadId: number,
  ContractNo: boolean,
  ReceiptAmount: number,
  IsSubmitFull: boolean,
  SubmitAmount: number,
  FlagLastRow: boolean,
  RowState: RowState,
  RowVersion: string
  ReceiptDate: Date,
  AmountCarried: number,
  FlagDate: boolean,
}

export interface CashSubmitAttachment {
  CashSubmitAttachmentId: number,
  FilePath: string,
  FileName: string,
  Description: string,
  AttahmentId: number,
  RowState: RowState,
  IsDisableAttachment: boolean,
  RowVersion: string
}

export interface ReportParam {
  CashSubmitNo: string,
  CompanyCode: string
}

@Injectable()
export class Lots29Service {
  constructor(private http: HttpClient,
    private ts: TableService) { }

  getCompany() {
    return this.http.get<any>('system/company/dashboard');
  }

  getMaster(isDetail): Observable<any> {
    return this.http.get<any>('loan/CashSubmit/master', { params: { isDetail: isDetail } });
  }

  getCashSubmitList(search: any, page: any) {
    const param = {
      cashSubmitNo: search.cashSubmitNo,
      fromBranch: search.fromBranch,
      toBranch: search.toBranch,
      fromDate: search.fromDate,
      toDate: search.toDate,
      cashSubmitStatus: search.cashSubmitStatus,
      sort: page.sort || 'CashSubmitDate DESC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/CashSubmit/getCashSubmitList', { params: param });
  }

  getCashSubmitDetail(CashSubmitHeadId) {
    const param = {
      CashSubmitHeadId: CashSubmitHeadId
    };
    return this.http.get<any>('loan/CashSubmit/getCashSubmitDetail', { params: param });
  }

  saveCashSubmit(data: CashSubmitHead) {
    if (data.CashSubmitHeadId && data.CashSubmitHeadId >= 0) {
      return this.http.unit().put<CashSubmitHead>('loan/CashSubmit/updateCashSubmit', data);
    } else {
      return this.http.unit().post<CashSubmitHead>('loan/CashSubmit/insertCashSubmit', data);
    }
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/CashSubmit/getlorp47reportbyno', param, { responseType: 'text' });
  }

  checkCreateCashSubmit(): Observable<any> {
    return this.http.get<any>('loan/CashSubmit/checkCreateCashSubmit');
  }
}
