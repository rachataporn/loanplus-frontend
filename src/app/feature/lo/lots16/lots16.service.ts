import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState, FileService } from '@app/shared';

export interface Mgm {
  MgmCode: string;
  CustomerCode: string;
  PrefixId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Birthday: Date;
  IdCard: string;
  DateIssue: Date;
  DateExpiry: Date;
  Race: string;
  Nationality: string;
  Religio: string;
  Gender: string;
  MaritalStatus: string;
  GroupOfCareer: string;
  Career: string;
  IncomeRange: string;
  CreatedProgram: string;
  RowVersion: string;
  MgmAddress: MgmAddressIdCard[];
  MgmMobile: MgmMobile[];
  MgmAttachment: MgmAttachment[];
  PhoneNumber: MgmMobile[];
}

export interface MgmAddressIdCard {
  AddressId: number;
  MgmCode: string;
  AddressType: string;
  BuildingName: string;
  BuildingNo: string;
  VillageNo: string;
  Alley: string;
  Street: string;
  SubDistrictId: number;
  DistrictId: number;
  ProvinceId: number;
  ZipCode: number;
  Replaces: boolean;
  RowVersion: string;
}

export interface MgmAddressCurrent {
  AddressId: number;
  MgmCode: string;
  AddressType: string;
  BuildingName: string;
  BuildingNo: string;
  VillageNo: string;
  Alley: string;
  Street: string;
  SubDistrictId: number;
  DistrictId: number;
  ProvinceId: number;
  ZipCode: number;
  Replaces: boolean;
  RowVersion: string;
}

export interface MgmAddressWork {
  AddressId: number;
  MgmCode: string;
  AddressType: string;
  BuildingName: string;
  BuildingNo: string;
  VillageNo: string;
  Alley: string;
  Street: string;
  SubDistrictId: number;
  DistrictId: number;
  ProvinceId: number;
  ZipCode: number;
  Replaces: boolean;
  RowVersion: string;
}

export interface MgmMobile {
  MobileId: number;
  MgmCode: string;
  MobileNumber: string;
  MobileDescription: string;
  Default: boolean;
  RowState: RowState
}

export interface MgmAttachment {
  MgmAttachmentId: number,
  ContractHeadId: number,
  AttachmentTypeCode: string,
  FilePath: string,
  FileName: string,
  Description: string,
  AttahmentId: number,
  RowState: RowState
}

export interface SaveL {
  LogSystem: string;
  LogDiscription: string;
  LogItemGroupCode: string;
  LogItemCode: string;
  LogProgram: string;
  MgmCode: string;
  CustomerName: string;
  ContractHeadId: number;
}

@Injectable()
export class Lots16Service {
  constructor(private http: HttpClient,
    private fs: FileService
  ) { }

  getMaster(isDetail): Observable<any> {
    return this.http.get<any>('loan/Mgm/master', { params: { isDetail: isDetail } });
  }

  getMasterQueryList(search: any, page: any) {
    const param = {
      MgmCode: search.MgmCode,
      CustomerName: search.CustomerName,
      sort: page.sort || 'MgmCode DESC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/Mgm/getMgmList', { params: param });
  }

  getCustomerLOV(search: any, page: any) {
    const param = {
      CustomerCode: search.CustomerCode,
      CustomerName: search.CustomerName,
      sort: page.sort || 'CustomerCode ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/Mgm/getCustomerLOV', { params: param });
  }

  getDistrict(ProvinceId): Observable<any> {
    const param = {
      ProvinceId: ProvinceId
    };
    return this.http.get<any>('loan/Mgm/getDistrict', { params: param });
  }

  getSubDistrict(DistrictId): Observable<any> {
    const param = {
      DistrictId: DistrictId
    };
    return this.http.get<any>('loan/Mgm/getSubDistrict', { params: param });
  }

  getZipcode(ProvinceId): Observable<any> {
    const param = {
      SubDistrictId: ProvinceId
    };
    return this.http.get<any>('loan/Mgm/getZipcode', { params: param });
  }

  getPhone(mgmCode: string, page: any) {
    const param = {
      mgmCode: mgmCode,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/Mgm/getPhone', { params: param });
  }

  getMgmCustomerDetail(CustomerCode) {
    const param = {
      CustomerCode: CustomerCode
    };
    return this.http.get<any>('loan/Mgm/getCustomerDetail', { params: param });
  }

  getMgmDetail(MgmCode) {
    const param = {
      MgmCode: MgmCode
    };
    return this.http.get<any>('loan/Mgm/getMgmDetail', { params: param });
  }

  save(data: Mgm, attachments) {
    let mgmFormData = this.fs.convertModelToFormData(data, { AttachmentDetailFiles: attachments });
    if (data.CreatedProgram) {
      return this.http.put<Mgm>('loan/Mgm/updateMgm', mgmFormData);
    } else {
      return this.http.post<Mgm>('loan/Mgm/createMgm', mgmFormData);
    }
  }

  delete(MgmCode, version) {
    return this.http.delete('loan/Mgm/deleteMgm', { params: { MgmCode: MgmCode, RowVersion: version } })
  }

  saveLog(param: SaveL) {
    return this.http.post('system/Log/saveLog', param);
  }
}
