import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tracking {
  TrackingId: number;
  ContractHeadId: number;
  TrackingNo: string;
  TrackingItemId: number;
  TrackingDate: Date;
  TrackingStatus: string;
  TrackingCost: number;
  Remark: string;
  TrackingStatusCurrent: string;
  PaymentDate: string;
  RowVersion: string;

  CountNumber: number;
  CustomerNameTha: string;
  CustomerNameEng: string;
  ContractNo: string;
  CustomerCode: string;
  MobileNo: string;
  DueDate: Date;
  PrincipleAmount: number;
  InterestAmount: number; 
  FineAmount: number;
  TrackingAmount: number;
  TotalAmount: number;
  ProfileImage: string;
}

export interface Report {
  TrackingNo: string,
  TrackingType: number
}


@Injectable()
export class Trts05Service {
  constructor(private http: HttpClient) { }

  getCompany() {
    return this.http.get<any>('tracking/TrackingNotice/getCompany');
  }

  getMaster(): Observable<any> {
    return this.http.get<any>('tracking/TrackingNotice/master');
  }

  getSearchEdit(TrackingId, TrackingNo) {
    return this.http.get<any>('tracking/TrackingNotice/getSearchEdit', { params: { TrackingId: TrackingId, TrackingNo: TrackingNo } });
  }

  getSearchMaster(search: any, page: any) {
    const param = {
      CompanyCode: search.CompanyCode,
      InputSearch: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('tracking/TrackingNotice/getSearchMaster', { params: param });
  }

  getSearchHistoryDetail(search: any, page: any) {
    const param = {
      CompanyCode: search.CompanyCode,
      CustomerCode: search.CustomerCode,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('tracking/trackingActivity/getSearchHistoryDetail', { params: param });
  }

  saveRequestRoan(data: Tracking) {
    return this.http.post<Tracking>('tracking/trackingActivity/saveTrakingQuery', data);
  }

  edit(TrackingId: number) {
    return this.http.post<Tracking>('tracking/trackingActivity/saveTrakingQuery', TrackingId);
  }

  getContractPeriodQuery(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/processPeriod', { params: filter });
  }

  getContractNoLOV(searchForm: any, page: any) {
    const param = {
      LoanNo: searchForm.LoanNo,
      CustomerCode: searchForm.CustomerCode,
      CustomerName: searchForm.CustomerName,
      LoanDate: searchForm.LoanDate,
      LoanStatus: searchForm.LoanStatus,
      LovStatus: searchForm.LovStatus,
      Sort: page.sort || 'ContractNo ContractDate Remark CustomerCode desc',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/invoice/contractNoLOV', { params: param });
  }
  getInvoiceStatusDDL(Status) {
    const param = {
      Status: Status
    };
    return this.http.get<any>('loan/invoice/invoiceStatusDDL', { params: param });
  }

  print(data: Report) {
    return this.http.post('tracking/TrackingNotice/print', data, { responseType: 'text' });
  }

}