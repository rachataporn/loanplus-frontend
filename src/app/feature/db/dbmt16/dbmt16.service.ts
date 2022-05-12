import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface DocumentType {
  DocumentTypeCode: string;
  DocumentTypeName: string;
  SystemCode: string;
  Active: boolean;
  RowVersion: string;
  DocumentSubTypes: DocumentSubType[];
}

export interface DocumentSubType {
  DocumentTypeCode: string;
  DocumentSubTypeCode: string;
  DocumentSubTypeName: string;
  Active: boolean;
  RowVersion: string;
  RowState: RowState;
}

@Injectable()
export class Dbmt16Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('system/documentType/system');
  }

  getData(search: any, page: any) {
    const param = {
      System: search.System,
      Keyword: search.InputSearch,
      sort: page.sort || 'DocumentTypeCode ASC',
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/documentType/getDocumentTypeList', { params: param });
  }

  getDetail(DocumentTypeCode: any): Observable<any> {
    return this.http.get<any>('system/documentType/getDocumentTypeDetail', { params: { DocumentTypeCode: DocumentTypeCode } });
  }

  checkDuplicate(DocumentTypeCode) {
    return this.http.post<any>('system/documentType/checkDupicate', { DocumentTypeCode: DocumentTypeCode });
  }

  saveDocumentType(data: DocumentType) {
    if (data.RowVersion) {
      return this.http.put<DocumentType>('system/documentType/updateDocumentType', data);
    } else {
      return this.http.post<DocumentType>('system/documentType/createDocumentType', data);
    }
  }

  deleteDocumentType(DocumentTypeCode, RowVersion) {
    const param = {
      DocumentTypeCode: DocumentTypeCode,
      RowVersion: RowVersion
    };
    return this.http.delete<string>('system/documentType/deleteDocumentType', { params: param });
  }
}
