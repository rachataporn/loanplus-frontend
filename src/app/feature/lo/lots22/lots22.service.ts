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
export class Lots22Service {

  constructor(private http: HttpClient,
    private fs: FileService
  ) { }


  getCompany() {
    return this.http.get<any>('system/company/dashboard');
  }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/SecuritiesOwnerDead/master/true');
  }

  getSearchSecuritiesOwnerDead(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/SecuritiesOwnerDead/getSearchSecuritiesOwnerDead', { params: filter });
  }

  getBorrowerLOV(search: any, page: any) {
    const param = {
      CustomerCode: search.CustomerCode,
      CustomerName: search.CustomerName,
      IdCard: search.IdCard,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/SecuritiesOwnerDead/getBorrowerLOV', { params: param });
  }

  getBorrowerDetail(CustomerCode) {
    const param = {
      CustomerCode: CustomerCode
    };
    return this.http.get<any>('loan/SecuritiesOwnerDead/getBorrowerDetail', { params: param });
  }

  getContractNoDetail(CustomerCode, SecuritiesOwnerDeadId) {
    const param = {
      CustomerCode: CustomerCode,
      SecuritiesOwnerDeadId: SecuritiesOwnerDeadId
    };
    return this.http.get<any>('loan/SecuritiesOwnerDead/getContractNoDetail', { params: param });
  }

  save(data: SecuritiesOwner, attachments) {
    let formData = this.fs.convertModelToFormData(data, { AttachmentDetailFiles: attachments });
    if (data.SecuritiesOwnerDeadId) {
      return this.http.put<SecuritiesOwner>('loan/SecuritiesOwnerDead/Update', formData);
    } else {
      return this.http.post<SecuritiesOwner>('loan/SecuritiesOwnerDead/Create', formData);
    }
  }

  getSearchEdit(SecuritiesOwnerDeadId) {
    return this.http.get<SecuritiesOwner>('loan/SecuritiesOwnerDead/getSearchEdit', { params: { SecuritiesOwnerDeadId: SecuritiesOwnerDeadId } });
  }

  getContractAttachment(MainContractHeadId) {
    const param = {
      MainContractHeadId: MainContractHeadId
    };
    return this.http.get<any>('loan/SecuritiesOwnerDead/getContractAttachment', { params: param });
  }
}
