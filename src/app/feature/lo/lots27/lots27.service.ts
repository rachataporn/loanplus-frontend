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
  CustomerName: string;
  PhoneNumber: string;
  Description: string;
  RefRegisterId: number;
  Remark: string;
  RowVersion: string;
  RowState: RowState;
  IsSupperUser: boolean;
  SecuritiesAttribute: SecuritiesAttribute[];
  SecuritiesImages: SecuritiesImage[];
  ReqSecuritiesBy: string;
  ReqSecuritiesByTha: string;
  ReqSecuritiesByEng: string;
  SecuritiesSource: string;
  ProvinceOutOfBound: number;
  EndNotTransferDate: Date;
  EndTransferInheritanceDate: Date;
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
  FileDeleting: number;
  RowVersion: string;
  RowState: RowState;
  ImageId: number;
  RegisterId: number;
  AttahmentId: number;
}

export interface SecuritiesRegisterRef {
  RegisterId: number;
  SecuritiesCategoryId: number;
  RegisterName: string;
  RegisterDate: Date;
  RegisterChannelTha: string;
  RegisterChannelEng: string;
}

@Injectable()
export class Lots27Service {
  constructor(private http: HttpClient,
    private fs: FileService) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/requestSecuritiesMobile/master');
  }

  getSearchEdit(SecuritiesCode) {
    return this.http.get<Securities>('loan/requestSecuritiesMobile/getSearchEdit', { params: { SecuritiesCode: SecuritiesCode } });
  }

  getProvinceDDLQuery() {
    return this.http.get<any>('loan/requestSecuritiesMobile/getProvinceDDL');
  }

  getBrandDDLQuery() {
    return this.http.get<any>('loan/requestSecuritiesMobile/getBrandDDL');
  }

  getBrandMotorcycleDDLQuery() {
    return this.http.get<any>('loan/requestSecuritiesMobile/getBrandMotorcycleDDL');
  }

  saveRequestSecurities(data, imageFile) {
    let FormData = this.fs.convertModelToFormData(data, { arrayImage: imageFile });
    if (data.RowVersion) {
      return this.http.unit().put('loan/requestSecuritiesMobile/updateRequestSecurities', FormData, { responseType: 'text' });
    } else {
      return this.http.unit().post('loan/requestSecuritiesMobile/saveRequestSecurities', FormData, { responseType: 'text' });
    }
  }

  reApproveSecurities(data) {
    return this.http.unit().put('loan/requestSecuritiesMobile/reRequestSecurities', data, { responseType: 'text' });
  }

  getCheckEstimateAmount(Brand, Gen, Mould, Year): Observable<any> {
    const param = {
      Brand: Brand,
      Gen: Gen,
      Mould: Mould,
      Year: Year
    };
    return this.http.get<any>('loan/requestSecuritiesMobile/getCheckEstimateAmount', { params: param });
  }

  getCheckEstimateAmountMotorycle(Brand, Gen, BodyNumber, EngineCode, CarModelCode, Year): Observable<any> {
    const param = {
      Brand: Brand,
      Gen: Gen,
      BodyNumber: BodyNumber,
      EngineNumber: EngineCode,
      CarModelCode: CarModelCode,
      Year: Year
    };
    return this.http.get<any>('loan/requestSecuritiesMobile/getCheckEstimateAmountMotorcycle', { params: param });
  }

  getSecuritiesAttributes(SecuritiesType, SecuritiesCode) {
    return this.http.get<any>('loan/requestSecuritiesMobile/getSecuritiesAttribute', { params: { SecuritiesType: SecuritiesType, SecuritiesCode: SecuritiesCode } });
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
    return this.http.get<any>('loan/requestSecuritiesMobile/getGeneration', { params: param });
  }

  getGenerationMotorcycleDDL(brand): Observable<any> {
    const param = {
      brand: brand
    };
    return this.http.get<any>('loan/requestSecuritiesMobile/getGenerationMotorcycleDDL', { params: param });
  }

  getMould(generation): Observable<any> {
    const param = {
      generation: generation
    };
    return this.http.get<any>('loan/requestSecuritiesMobile/getMould', { params: param });
  }

  getBodyNumber(generation): Observable<any> {
    const param = {
      generation: generation
    };
    return this.http.get<any>('loan/requestSecuritiesMobile/getBodyNumber', { params: param });
  }


  getEngineNumber(modelName, bodyNumber): Observable<any> {
    const param = {
      modelName: modelName,
      bodyNumber: bodyNumber
    };
    return this.http.get<any>('loan/requestSecuritiesMobile/getEngineNumber', { params: param });
  }

  getImageDetails(TemplateViewID, SecuritiesCode) {
    return this.http.get<SecuritiesImage[]>('loan/requestSecuritiesMobile/getImageDetails', { params: { TemplateViewID: TemplateViewID, SecuritiesCode: SecuritiesCode } });
  }

  getSearch(search: any, page: any) {
    const param = {
      SecuritiesType: search.SecuritiesType,
      DateFrom: search.DateFrom,
      DateTo: search.DateTo,
      Securities: search.Securities,
      DocStatus: search.DocStatus,
      sort: page.sort || 'SecuritiesCode',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/requestSecuritiesMobile/getSearch', { params: param });
  }

  getRegisRef(RegisRefId) {
    return this.http.get<SecuritiesRegisterRef>('loan/requestSecuritiesMobile/getRegisRef', { params: { RegisRefId: RegisRefId } });
  }

  getVerify(search: any, page: any) {
    const filter = {
      securitiesCode: search,
      sort: page.sort || 'CreatedDate DESC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/requestSecuritiesMobile/getVerify', { params: filter });
  }

  checkDuplicate(Description, SecuritiesCode) {
    return this.http.post<any>('loan/requestSecuritiesMobile/checkDupicate', { Description: Description, SecuritiesCode: SecuritiesCode });
  }

  convertSecuritiesStatus(SecuritiesCode) {
    return this.http.unit().put('loan/requestSecuritiesMobile/convertSecuritiesStatus', { SecuritiesCode: SecuritiesCode }, { responseType: 'text' });
  }

  getHistoryContract(search: any, page: any) {
    const filter = {
      securitiesCode: search,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/requestSecuritiesMobile/getHistoryContract', { params: filter });
  }
}


