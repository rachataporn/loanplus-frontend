import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ReceiveType {
  ReceiveTypeCode: string;
  ReceiveTypeNameTha: string;
  ReceiveTypeNameEng: string;
  ReceiveFormat: string;
  AccountCode: string;
  Active: boolean;
  ReceiveFlag: string;
  PaymentFlag: string;
  CustomerReceiveFlag: string;
  DefaultReceiptFlag: string;
  CreatedProgram: string;
}

@Injectable()
export class Lomt04Service {
  constructor(private http: HttpClient) { }

  getData(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort || 'ReceiveTypeCode ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/ReceiveType/getReceiveTypeList', { params: param });
  }

  getDetail(ReceiveTypeCode) {
    return this.http.get<any>('loan/ReceiveType/getReceiveTypeDetail', { params: { ReceiveTypeCode: ReceiveTypeCode } });
  }

  checkDuplicate(ReceiveTypeCode) {
    return this.http.post<any>('loan/ReceiveType/checkDupicate', { ReceiveTypeCode: ReceiveTypeCode });
  }

  checkefaultFlag(ReceiveTypeCode) {
    return this.http.post<any>('loan/ReceiveType/checkDefaultFlag', { ReceiveTypeCode: ReceiveTypeCode });
  }

  public saveReceiveType(data: ReceiveType) {
    if (data.CreatedProgram) {
      return this.http.put<ReceiveType>('loan/ReceiveType/updateReceiveType', data);
    } else {
      return this.http.post<ReceiveType>('loan/ReceiveType/createReceiveType', data);
    }
  }

  deleteReceiveType(ReceiveTypeCode: string, RowVersion: any) {
    const param = {
      ReceiveTypeCode: ReceiveTypeCode,
      RowVersion: RowVersion
    };
    return this.http.delete<string>('loan/ReceiveType/deleteReceiveType', { params: param });
  }

}
