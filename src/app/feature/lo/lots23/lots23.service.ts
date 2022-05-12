import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState, TableService, FileService } from '@app/shared';

export interface SecuritiesOwner {
  SecuritiesOwnerDeadId: number;
  MainContractHeadId: number;
  ReqCode: string;
  CreateDateReq: Date;
  ReqStatus: string;
  MainContractNo: string;
  OwnerDeadDate: string;
  CustomerCode: string;
  RowVersion: string;
  RowState: RowState;
  SecuritiesOwnerDeadAttachment: SecuritiesOwnerDeadAttachment[];
  DeadRemark: string;
}
export interface SecuritiesOwnerDeadAttachment {
  SecuritiesOwnerDeadAttachmentId: number,
  AttachmentId: number,
  FileName: string,
  Remark: string,
  RowVersion: string,
  RowState: RowState,
  IsDisableAttachment: boolean
}
export interface ContractStatus {
  StatusValue: string,
  RowState: string,
  Active: boolean,
}


@Injectable()
export class Lots23Service {

  constructor(private http: HttpClient,
    private fs: FileService
  ) { }


  getCompany() {
    return this.http.get<any>('system/company/dashboard');
  }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/SecuritiesOwnerDeadApproved/master/true');
  }

  getBorrowerLOV(search: any, page: any) {
    const param = {
      CustomerCode: search.CustomerCode,
      CustomerName: search.CustomerName,
      IdCard: search.IdCard,
      sort: page.sort ,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/SecuritiesOwnerDeadApproved/getBorrowerLOV', { params: param });
  }

  getBorrowerDetail(CustomerCode) {
    const param = {
      CustomerCode: CustomerCode
    };
    return this.http.get<any>('loan/SecuritiesOwnerDeadApproved/getBorrowerDetail', { params: param });
  }

  getContractNoDetail(CustomerCode){
    const param = {
      CustomerCode: CustomerCode
    };
    return this.http.get<any>('loan/SecuritiesOwnerDeadApproved/getContractNoDetail', { params: param });
  }

  getSearchDataSecuritiesOwnerDeadApporoved(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/SecuritiesOwnerDeadApproved/getSearchSecuritiesOwnerDeadApproved', { params: filter });
  }
  
  save(data: SecuritiesOwner,attachments) {
    let formData = this.fs.convertModelToFormData(data, { AttachmentDetailFiles: attachments });
    if (data.SecuritiesOwnerDeadId) {
      return this.http.put<SecuritiesOwner>('loan/SecuritiesOwnerDeadApproved/Update', formData);
    }
  }

  getSearchEdit(SecuritiesOwnerDeadId) {
    return this.http.get<SecuritiesOwner>('loan/SecuritiesOwnerDeadApproved/getSearchEdit', { params: { SecuritiesOwnerDeadId: SecuritiesOwnerDeadId } });
  }
}
