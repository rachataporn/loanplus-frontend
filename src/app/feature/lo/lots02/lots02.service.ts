import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RequestLoan {
  RegisterId: string
  Name: string
  Career: string,
  CreatedBy: string,
  CreatedDate: string,
  CreatedProgram: string,
  SecuritiesCategoryId: string,
  FirstName: string,
  ImageName: string,
  LastName: string,
  LoanAmount: string,
  MobileNo: string,
  RowVersion: string,
  StatusContact: boolean,
  UpdatedBy: string,
  UpdatedDate: string,
  UpdatedProgram: string,
  UserLineId: string,
  Status: string,
  RegisterChannel: string,
  CType: string,
  Carea: string,
  ApproveAmount: number,
  approve: boolean
  FlagApprove: number,
  AppLoanPeriodAmount: number
  remark: string,
  ApproveLoanImages: ApproveLoanImages[];
}

export interface ApproveLoanImages {
  ImageId: number;
  RegisterId: string;
  imageName: string;
}

@Injectable()
export class Lots02Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/requestloan/master');
  }

  getSearchProvince(SecuritiesCategoryId) {
    return this.http.get<any>('loan/requestloan/getSearchProvince', { params: { SecuritiesCategoryId: SecuritiesCategoryId } });

  }

  getSearchEdit(CustomerCode) {
    return this.http.get<any>('loan/requestloan/getSearchEdit', { params: { CustomerCode: CustomerCode } });
  }

  getSearchMaster(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      status: search.status,
      StartDate: search.StartDate,
      EndDate: search.EndDate,
      requestWait: search.requestWait,
      assetType: search.assetType,
      flagApprove: search.flagApprove,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/requestloan/getSearchMaster', { params: param });
  }

  getLookUp(search, page: any) {
    const param = {
      Id: search,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/requestloan/getLookUp', { params: param });
  }

  saveRequestRoan(data: RequestLoan) {
    return this.http.post<RequestLoan>('loan/requestloan/updateRequestLoan', data);
  }

  getContractPeriodQuery(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/contract/processPeriod', { params: filter });
  }
}




