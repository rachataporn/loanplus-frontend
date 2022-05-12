import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService, RowState, FileService } from '@app/shared';

export interface Company {
  DocumentRequisitionCompanyId: number,
  CompanyCode: string,
  Requisition: string,
  RowVersion: string
}

export interface CompanySendRound {
  company: Company[],
}

@Injectable()
export class Lomt16Service {
  constructor(private http: HttpClient, private fs: FileService) { }  //เรียกใช้อะไรมาใส่ในนี้ อย่าเอาไปไว้ข้างนอก

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/DocumentRequisitionCompany/master/true');
  }
  getCompany(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/DocumentRequisitionCompany', { params: filter });
  }

  save(company) {
      return this.http.post<CompanySendRound>('loan/DocumentRequisitionCompany/insert', company);
  }

}