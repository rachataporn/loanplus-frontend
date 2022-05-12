import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState, TableService, FileService } from '@app/shared';

export interface Disbursement {
  TrackingDocumentId: number,
  MainContractHeadId: number,
  MainContractNo: string,
  ContractType: string,
  CustomerCode: string,
  CustomerName: string,
  ContractStatusTH: string,
  ContractStatusCode: string,
  ReqCompanyDocument: string,
  ReqCompanyCreateDocument: string,
  ReqDocumentTypeCode: string,
  ReqDocumentDate: Date,
  ReqReturnDocumentDate: Date,
  ReqRemark: string,
  ReqDocumentStatus: string,
  IsAutoReq: Boolean,
  CreatedProgram: string,
  RowVersion: string,
  TrackingDocumentId21: number,
  TrackingDocumentStatus: string,
  TrackingDocumentAttachment: TrackingDocumentAttachment[]
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
export class Lots19Service {

  constructor(private http: HttpClient,
    private fs: FileService
  ) { }


  getCompany() {
    return this.http.get<any>('system/company/dashboard');
  }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/TrackingDocument/master/true');
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
    return this.http.get<any>('loan/TrackingDocument/getContractLOV', { params: param });
  }


  getDisContractDetail(ContractHeadId) {
    const param = {
      ContractHeadId: ContractHeadId
    };
    return this.http.get<any>('loan/TrackingDocument/getDisContractDetail', { params: param });
  }

  getNewContractDetail(TrackingDocumentId21) {
    const param = {
      TrackingDocumentId21: TrackingDocumentId21
    };
    return this.http.get<any>('loan/TrackingDocument/getNewContractDetail', { params: param });
  }

  save(data: Disbursement, attachments) {
    let formData = this.fs.convertModelToFormData(data, { AttachmentDetailFiles: attachments });
    if (data.TrackingDocumentId) {
      return this.http.put<Disbursement>('loan/TrackingDocument/Update', formData);
    } else {
      return this.http.post<Disbursement>('loan/TrackingDocument/Create', formData);
    }
  }

  getSearchTrackingDoc(search: any, page: any) {
    const filter = {
      Keyword: search.Keyword,
      CompanyCode: search.CompanyCode,
      IsCompany: search.IsCompany,
      sort: page.sort || '',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/TrackingDocument/getSearchTrackingDoc', { params: filter });
  }

  getSearchEdit(TrackingDocumentId) {
    return this.http.get<Disbursement>('loan/TrackingDocument/getSearchEdit', { params: { TrackingDocumentId: TrackingDocumentId } });
  }

  deleteTracking(data) {
    const param = {
      TrackingDocumentId: data.TrackingDocumentId,
      RowVersion: data.RowVersion
    };
    return this.http.delete<Disbursement>('loan/TrackingDocument/delete', { params: param });
  }


  getSearchReqDocDate(value) {
    const param = {
      ReqCompanyCreateDocument: value
    };
    return this.http.get<any>('loan/TrackingDocument/getSearchReqDocDate', { params: param });
  }

  checkPreparePackage(trackingDocumentId) {
    const param = {
      trackingDocumentId: trackingDocumentId
    };
    return this.http.get<any>('loan/TrackingDocument/checkPreparePackage', { params: param });
  }
}
