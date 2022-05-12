import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState, TableService, FileService } from '@app/shared';

export interface PackageDetail {
  TrackingDocumentPackageDetailId: number,
  TrackingDocumentPackageId: number,
  TrackingDocumentId: number,
  MainContractNo: string,
  MainContractHeadId: number,
  ContractType: string,
  CustomerName: string,
  Status: string,
  DocumentStatus: string,
  ReqCompanyCode: string,
  ReqDocumentDate: Date,
  ReqReturnDocumentDate: Date,
  RowVersion: string,
  RowState: RowState,
}
export interface Package {
  TrackingDocumentPackageId: number,
  TracnsportCode: string,
  PackageNo: number,
  CompanySource: string,
  CompanyDestination: string,
  PackageStatus: string,
  PackagePrepareDate: Date,
  PackageSendDate: Date,
  PackageReceiveDate: Date,
  RefNo: string,
  RowVersion: string
  PackageDetail: PackageDetail[]
  TrackingDocumentAttachment: TrackingDocumentAttachment[]

}

export interface TrackingDoc {
  TrackingDocumentId: number,
  CompanyContract: string,
  CompanySource: string,
}

export interface PackageDetailList {
  PackageDetail: PackageDetail[]
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
export class Lots20Service {

  constructor(private http: HttpClient,
    private fs: FileService
  ) { }

  getCompany() {
    return this.http.get<any>('system/company/dashboard');
  }

  getCompanyDes(companySource: any, page: any) {
    const param = {
      CompanySource: companySource,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/SendDocument/getCompanyDes', { params: param });
  }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/SendDocument/master/true');
  }

  getContractLOV(search: any, page: any) {
    const param = {
      CustomerCode: search.CustomerCode,
      CustomerName: search.CustomerName,
      LoanNo: search.LoanNo,
      IdCard: search.IdCard,
      CompanyDestination: search.CompanyDestination,
      CompanySource: search.CompanySource,
      sort: page.sort || 'MainContractNo ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/SendDocument/getContractLOV', { params: param });
  }


  getDisContractDetail(ContractHeadId) {
    const param = {
      ContractHeadId: ContractHeadId
    };
    return this.http.get<any>('loan/SendDocument/getDisContractDetail', { params: param });
  }

  save(data: Package) {
    let formData = this.fs.convertModelToFormData(data);
    if (data.TrackingDocumentPackageId) {
      return this.http.put<Package>('loan/SendDocument/Update', formData);
    } else {
      return this.http.post<Package>('loan/SendDocument/Create', formData);
    }
  }

  getSearchSendDoc(page) {
    const filter = {
      sort: page.sort || '',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/SendDocument/getSearchSendDoc', { params: filter });
  }

  getSearchPackage(page) {
    const filter = {
      sort: page.sort || '',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/SendDocument/getSearchPackage', { params: filter });
  }

  getSearchEdit(TrackingDocumentPackageId) {
    return this.http.get<Package>('loan/SendDocument/getSearchEdit', { params: { TrackingDocumentPackageId: TrackingDocumentPackageId } });
  }

  getSearchTrackingDocList(ReqCompanyDocument, ReqCompanyCreatedDocument, page: any) {
    const filter = {
      ReqCompanyDocument: ReqCompanyDocument,
      ReqCompanyCreatedDocument: ReqCompanyCreatedDocument,
      sort: page.sort || '',
      index: page.index,
      size: page.size
    };
    return this.http.get<PackageDetail>('loan/SendDocument/getSearchTrackingDocList', { params: filter });
  }

  checkPackage(CompanySource, CompanyDes) {
    const param = {
      CompanySource: CompanySource,
      CompanyDes: CompanyDes
    };
    return this.http.get<any>('loan/SendDocument/checkPackage', { params: param });
  }

  checkPackageDetail(TrackingDocumentPackageId) {
    const param = {
      TrackingDocumentPackageId: TrackingDocumentPackageId
    };
    return this.http.get<any>('loan/SendDocument/checkPackageDetail', { params: param });
  }

  updateDetail(data: PackageDetail) {
    if (data.TrackingDocumentPackageId) {
      return this.http.post<PackageDetail>('loan/SendDocument/UpdateDetail', data);
    }
  }

  getCreatePackage(Company?: any): Observable<any> {
    return this.http.get<any>('loan/SendDocument/createPackage', { params: { Company: Company } });
  }

  addCreatePackage(data: PackageDetail) {
    return this.http.post<PackageDetail>('loan/SendDocument/addCreatePackage', data);

  }

  updateDetailList(data: PackageDetailList) {
    return this.http.post<any>('loan/SendDocument/UpdateDetailList', data);
  }
  getSearchTrackingAttachment(TrackingDocumentId) {
    const param = {
      TrackingDocumentId: TrackingDocumentId
    };
    return this.http.get<Package>('loan/SendDocument/getSearchTrackingAttachment', { params: param });
  }

  isCheckCanEdit(TrackingDocumentPackageId, CompanyDashBoard) {
    return this.http.get<boolean>('loan/SendDocument/isCheckCanEdit', { params: { TrackingDocumentPackageId: TrackingDocumentPackageId, CompanyDashBoard: CompanyDashBoard } });
  }
}
