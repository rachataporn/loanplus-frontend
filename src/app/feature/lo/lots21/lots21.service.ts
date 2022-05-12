import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState, TableService, FileService } from '@app/shared';

export interface PackageDetail {
  TrackingDocumentPackageDetailId: number,
  TrackingDocumentPackageId: number,
  TrackingDocumentId: number, //key หลัก
  MainContractNo: string,
  MainContractHeadId: string,
  ContractHeadId: string,
  ContractType: string,
  CustomerName: string,
  Status: string,
  ReqCompanyCode: string,
  ReqDocumentDate: Date,
  ReqDocumentStatus: string,
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
  ReqDocumentStatus: string;
}

export interface ContractHead {
  TrackingDocumentId21: number,
  MainContractHeadId: number,
  TrackingDocumentStatus: string,
  ContractHeadId: number,
  CompanyCode: string,
  CheckDocStatus: string,
  LoanTypeCode: string,
  ContractNo: string,
  ContractDate: Date,
  ContractStatus: string,
  CustomerCode: string,
  LoanObjective: string,
  PayType: string,
  ReqLoanAmount: number,
  ReqTotalPeriod: number,
  ReqGapPeriod: number,
  ReqTotalMonth: number,
  AppLoanEffectiveInterestRate: number,
  Remark: string,
  AppproveLossDescription: string,
  MainContractNo: string,
  ContractType: string,
  MainLoanPrincipleAmount: number,
  CategoryId: number,
  ContractSecurities: ContractSecurities[],
  ContractInformation: ContractInformation[],
  ContractIncomeItem: ContractItem[],
  ContractPaymentItem: ContractItem[],
  ContractItem: ContractItem[],
  ContractAttachment: ContractAttachment[],
  ContractMgmEmployee: ContractMgmEmployee[],
  ContractBorrower: ContractBorrower[],
  ContractMgm: ContractMgm[],
  editStatus: string,
  CustomerName: string,
  IsDisableAttachment: boolean,
  TrackingDocumentPackageId: number,
}

export interface ContractSecurities {
  ContractSecuritiesId: number,
  ContractHeadId: number,
  CustomerSecuritiesId: number,
  Description: string,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractInformation {
  ContractInformationId: number,
  InformationId: number,
  ContractHeadId: number,
  AddOn: number,
  Active: boolean,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractItem {
  ContractItemId: number,
  LoItemCode: string,
  LoItemSectionCode: string,
  Amount: number,
  ContractHeadId: number,
  Description: string,
  RowVersion: string,
  RowState: RowState
}

export interface ContractAttachment {
  ContractAttachmentId: number,
  ContractHeadId: number,
  AttachmentTypeCode: string,
  FilePath: string,
  FileName: string,
  Description: string,
  AttahmentId: number,
  RowState: RowState,
  IsDisableAttachment: boolean
}

export interface ContractMgmEmployee {
  ContractMgmEmployeeId: number,
  ContractHeadId: string,
  CompanyCode: string,
  EmployeeCode: string,
  EmployeeNameTha: null,
  EmployeeNameEng: null,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractMgm {
  ContractMgmId: number,
  ContractHeadId: string,
  MgmCode: string,
  MgmNameTha: null,
  MgmNameEng: null,
  RowVersion: string,
  RowState: RowState,
}

export interface ContractBorrower {
  ContractBorrowerId: number,
  ContractHeadId: number,
  CustomerCode: string,
  CustomerNameTha: string,
  CustomerNameEng: string,
  ContractBorrowMain: boolean,
  LoanAmount: number,
  BorrowSeq: number,
  RowVersion: string,
  RowState: RowState,
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
export class Lots21Service {

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
    return this.http.get<any>('loan/ReceiveAndCheckDocument/getCompanyDes', { params: param });
  }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/ReceiveAndCheckDocument/master');
  }

  getContractLOV(search: any, page: any) {
    const param = {
      CustomerCode: search.CustomerCode,
      CustomerName: search.CustomerName,
      LoanNo: search.LoanNo,
      IdCard: search.IdCard,
      CompanyDestination: search.CompanyDestination,
      sort: page.sort || 'MainContractNo ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/ReceiveAndCheckDocument/getContractLOV', { params: param });
  }


  getDisContractDetail(ContractHeadId) {
    const param = {
      ContractHeadId: ContractHeadId
    };
    return this.http.get<any>('loan/ReceiveAndCheckDocument/getDisContractDetail', { params: param });
  }

  saveReceivePacakage(data: Package) {
    // return this.http.put<Package>('loan/ReceiveAndCheckDocument/saveReceivePacakage');
    return this.http.put<any>('loan/ReceiveAndCheckDocument/saveReceivePacakage', data);
  }

  checkDocStatus(data: ContractHead) {
    return this.http.put<any>('loan/ReceiveAndCheckDocument/checkDocStatus', data);
  }

  onSearchCheckDoc(page) {
    const filter = {
      sort: page.sort || '',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/ReceiveAndCheckDocument/getSearchCheckDoc', { params: filter });
  }

  onSearchReceivePackage(page) {
    const filter = {
      sort: page.sort || '',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/ReceiveAndCheckDocument/getSearchReceivePackage', { params: filter });
  }

  getSearchEdit(TrackingDocumentPackageId) {
    return this.http.get<Package>('loan/ReceiveAndCheckDocument/getSearchEdit', { params: { TrackingDocumentPackageId: TrackingDocumentPackageId } });
  }

  getLoanType(CategoryId: any, CustomerCode: any, CompanyCode: any, CloseRefinance: any) {
    return this.http.get<any>('loan/contract/getLoanType', { params: { CategoryId: CategoryId, CustomerCode: CustomerCode, CompanyCode: CompanyCode, CloseRefinance: CloseRefinance } });
  }

  getCheckMaxLoanAmount(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/LoanAgreement/checkMaxLoanAmount', { params: filter });
  }

  getLoanAgreementDetail(ContractHeadId?: any): Observable<any> {
    return this.http.get<any>('loan/ReceiveAndCheckDocument/detail', { params: { ContractHeadId: ContractHeadId } });
  }

  getCheckStatus(TrackingDocumentId) {
    return this.http.get<any>('loan/ReceiveAndCheckDocument/checkstatus', { params: { TrackingDocumentId: TrackingDocumentId } });
  }
}
