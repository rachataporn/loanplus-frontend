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
  RowVersion: string,
  CashSubmitDetail: CashSubmitDetail[],
  CashSubmitAttachment: CashSubmitAttachment[],
  FlagApprove: string,
  AmountCarried: number,
  RemarkBranch: string,
  RemarkAccount: string,
  SubmitTimeHour: string,
  SubmitTimeMinute: string,
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
  RowState: RowState,
  RowVersion: string,
  ReceiptDate : Date
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

@Injectable()
export class Lots30Service {
  constructor(private http: HttpClient,
    private ts: TableService) { }

  getCompany() {
    return this.http.get<any>('system/company/dashboard');
  }

  getMaster(isDetail): Observable<any> {
    return this.http.get<any>('loan/ApproveCashSubmit/master', { params: { isDetail: isDetail } });
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
    return this.http.get<any>('loan/ApproveCashSubmit/getCashSubmitList', { params: param });
  }

  getCashSubmitDetail(CashSubmitHeadId) {
    const param = {
      CashSubmitHeadId: CashSubmitHeadId
    };
    return this.http.get<any>('loan/ApproveCashSubmit/getCashSubmitDetail', { params: param });
  }

  saveCashSubmit(data: CashSubmitHead) {
    return this.http.unit().put<CashSubmitHead>('loan/ApproveCashSubmit/updateCashSubmit', data);
  }

  getCashSubmitListApprove(search: any, page: any) {
    const param = {
      cashSubmitNoApprove: search.cashSubmitNoApprove,
      fromBranchApprove: search.fromBranchApprove,
      toBranchApprove: search.toBranchApprove,
      fromDateApprove: search.fromDateApprove,
      toDateApprove: search.toDateApprove,
      cashSubmitStatusApprove: search.cashSubmitStatusApprove,
      sort: page.sort || 'CashSubmitDate DESC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/ApproveCashSubmit/getCashSubmitListApprove', { params: param });
  }
}
