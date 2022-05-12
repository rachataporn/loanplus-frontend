import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileService, RowState } from '@app/shared';

export interface ApprovePermission {
  ApproveContract: boolean,
  ApprovePayment: boolean
}

export interface ContractForm {
  ContractNo: string,
  CustomerName: string,
  ContractRefinance: string,
  CloseContract: string,
  TrackingDocumentId: number,
  TrackingDocumentControlId: string,
  ReqDocumentStatus: string,
  CheckCloseContract: string,
  PackageStatus: string,
  MainContractHeadId: number,
  TrackingDocumentAttachment: TrackingDocumentAttachment[],
  LocationCode: string,
}

export interface TrackingDocumentAttachment {
  TrackingDocumentAttachmentId: number,
  AttachmentId: number,
  FileName: string,
  Remark: string,
  RowVersion: string,
  RowState: RowState,
  IsDisableAttachment: boolean
}

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient, private fs: FileService) { }

  getCompany() {
    return this.http.get<any>('system/company/dashboard');
  }

  getMaster(search: any): Observable<any> {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/dashboard/master', { params: filter });
  }

  getCreateContractQuery(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/dashboard/contractData', { params: filter });
  }

  getApproveContractQuery(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/dashboard/ApproveContractData', { params: filter });
  }

  getApproveTransferContractQuery(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/dashboard/ApproveTransferContractData', { params: filter });
  }

  getApproveWeb(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/dashboard/ApproveWebData', { params: filter });
  }

  getApprovePermission() {
    return this.http.get<any>('loan/dashboard/GetPermission');
  }

  getTrackingDocWeb(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/dashboard/TrackingDocument', { params: filter });
  }

  getHistoryContract(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/dashboard/HistoryContract', { params: filter });
  }

  getSearchContract(TrackingDocumentId, controlId) {
    return this.http.get<any>('loan/dashboard/Contract', { params: { TrackingDocumentId: TrackingDocumentId, controlId: controlId } });
  }

  saveReturnDocument(data: ContractForm) {
    return this.http.put<ContractForm>('loan/dashboard/saveReturnDocument', data);
  }

  getSearchTrackingDoc(search: any, page: any) {
    const filter = {
      Keyword: search.Keyword,
      CompanyCode: search.CompanyCode,
      sort: page.sort || '',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/dashboard/getSearchTrackingDoc', { params: filter });
  }

  getSearchTrackingAttachment(TrackingDocumentControlId) {
    const param = {
      TrackingDocumentControlId: TrackingDocumentControlId
    };
    return this.http.get<ContractForm>('loan/dashboard/getSearchTrackingAttachment', { params: param });
  }

  searchLoanAgreement(page: any) {
    const filter = page
    return this.http.get<any>('loan/dashboard/searchLoanAgreement', { params: filter });
  }

  getContractManagement(page: any) {
    const filter = page;
    return this.http.get<any>('loan/dashboard/searchRefinance', { params: filter });
  }

  getLoanWait(page: any) {
    const filter = page;
    return this.http.get<any>('loan/dashboard/searchWait', { params: filter });
  }

}
