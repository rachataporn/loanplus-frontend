import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageFile, FileService, RowState } from '@app/shared';

export interface Securities {
  CompanyCode: string;
  SecuritiesCode: string;
  SecuritiesDate: string;
  SecuritiesCategoryId: string;
  SecuritiesStatus: string;
  EstimateAmount: number;
  LoanLimitAmount: number;
  Description: string;
  RefRegisterId: number;
  Remark: string;
  RowVersion: string;
  RowState: RowState;
  SecuritiesAttribute: SecuritiesAttribute[];
  SecuritiesImages: SecuritiesImage[];
  ReqSecuritiesBy: string;
  ReqSecuritiesByTha: string;
  ReqSecuritiesByEng: string;
  MortgageAmount: number;
  PcmUserId: number;
  SecuritiesSource: string;
}

export interface SecuritiesAttribute {
  SecuritiesAttributeId: number;
  SecuritiesCode: string;
  CategoryAttributeId: number;
  AttributeValueId: number;
  AttributeValue: string;
  RowVersion: string;
  RowState: RowState;
}

export interface SecuritiesImage {
  SecuritiesImageId: number;
  SecuritiesCode: string;
  ViewID: number;
  ImageName: string;
  TemplateViewID: number;
  ViewNameTha: string;
  ViewNameEng: string;
  ViewSeq: number;
  File: ImageFile;
  FileDeleting: string;
  RowVersion: string;
  RowState: RowState;
  ImageId: number;
  RegisterId: number;
}

export interface SecuritiesRegisterRef {
  RegisterId: number;
  SecuritiesCategoryId: number;
  RegisterName: string;
  RegisterDate: Date;
  RegisterChannelTha: string;
  RegisterChannelEng: string;
}

export interface SecuritiesVerifyHistory {
  VerifyID: number;
  SecuritiesCode: string;
  SecuritiesStatus: string;
  ReasonCode: string;
  Remark: string;
  EstimateAmount: number;
  LoanLimitAmount: number;
  RowVersion: string;
  RowVersionSecurities: string;
  ProvinceOutOfBound: number;
  EndNotTransferDate: Date;
  EndTransferInheritanceDate: Date;
}

@Injectable()
export class Lots14Service {
  constructor(private http: HttpClient,
    private fs: FileService) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/securitiesVerify/master');
  }

  getSearchEdit(SecuritiesCode) {
    return this.http.get<Securities>('loan/securitiesVerify/getSearchEdit', { params: { SecuritiesCode: SecuritiesCode } });
  }

  getProvinceDDLQuery() {
    return this.http.get<any>('loan/securitiesVerify/getProvinceDDL');
  }

  getBrandDDLQuery() {
    return this.http.get<any>('loan/requestSecurities/getBrandDDL');
  }

  getBrandMotorcycleDDLQuery() {
    return this.http.get<any>('loan/requestSecurities/getBrandMotorcycleDDL');
  }

  getSecuritiesAttributes(SecuritiesType, SecuritiesCode) {
    return this.http.get<any>('loan/securitiesVerify/getSecuritiesAttribute', { params: { SecuritiesType: SecuritiesType, SecuritiesCode: SecuritiesCode } });
  }

  getImageDetails(TemplateViewID, SecuritiesCode) {
    return this.http.get<SecuritiesImage[]>('loan/securitiesVerify/getImageDetails', { params: { TemplateViewID: TemplateViewID, SecuritiesCode: SecuritiesCode } });
  }

  getSearch(search: any, page: any) {
    const param = {
      CompanyCode: search.CompanyCode,
      SecuritiesType: search.SecuritiesType,
      DateFrom: search.DateFrom,
      DateTo: search.DateTo,
      Securities: search.Securities,
      sort: page.sort || 'SecuritiesCode',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/securitiesVerify/getSearch', { params: param });
  }

  getRegisRef(RegisRefId) {
    return this.http.get<SecuritiesRegisterRef>('loan/securitiesVerify/getRegisRef', { params: { RegisRefId: RegisRefId } });
  }

  getVerify(search: any, page: any) {
    const filter = {
      securitiesCode: search,
      sort: page.sort || 'CreatedDate DESC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/securitiesVerify/getVerify', { params: filter });
  }

  saveVerify(verify: SecuritiesVerifyHistory) {
    return this.http.post<SecuritiesVerifyHistory>('loan/securitiesVerify/saveVerify', verify);
  }

  public update(data: Securities) {
    return this.http.put<Securities>('loan/securitiesVerify/update', data);
  }

  getDistrict(ProvinceId): Observable<any> {
    const param = {
      ProvinceId: ProvinceId
    };
    return this.http.get<any>('loan/customer/getDistrict', { params: param });
  }

  getSubDistrict(DistrictId): Observable<any> {
    const param = {
      DistrictId: DistrictId
    };
    return this.http.get<any>('loan/customer/getSubDistrict', { params: param });
  }

  getGeneration(brand): Observable<any> {
    const param = {
      brand: brand
    };
    return this.http.get<any>('loan/requestSecurities/getGeneration', { params: param });
  }

  getGenerationMotorcycleDDL(brand): Observable<any> {
    const param = {
      brand: brand
    };
    return this.http.get<any>('loan/requestSecurities/getGenerationMotorcycleDDL', { params: param });
  }

  getMould(generation): Observable<any> {
    const param = {
      generation: generation
    };
    return this.http.get<any>('loan/requestSecurities/getMould', { params: param });
  }

  getBodyNumber(generation): Observable<any> {
    const param = {
      generation: generation
    };
    return this.http.get<any>('loan/requestSecurities/getBodyNumber', { params: param });
  }


  getEngineNumber(modelName, bodyNumber): Observable<any> {
    const param = {
      modelName: modelName,
      bodyNumber: bodyNumber
    };
    return this.http.get<any>('loan/requestSecurities/getEngineNumber', { params: param });
  }
}


