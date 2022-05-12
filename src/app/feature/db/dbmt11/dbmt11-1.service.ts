import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface District {
  ProvinceId: number;
  DistrictId: number;
  ProvinceNameTha: string;
  ProvinceNameEng: string;
  DistrictNameTha: string;
  DistrictNameEng: string;
  Active: boolean;
  CreatedProgram: string;
}


@Injectable()
export class Dbmt111Service {

  constructor(private http: HttpClient) { }

  getCountryList() {
    return this.http.get<any>('system/ManageDistrict/getCountryLists');
  }

  getProvinceList() {
    return this.http.get<any>('system/ManageDistrict/getProvinceLists');
  }

  getHeader(search: any) {
    const param = {
      ProvinceId: search.ProvinceId,
    };
    return this.http.get<any>('system/ManageDistrict/getHeaderDistrict', { params: param });
  }
  
  getData(search: any, page: any) {
    const param = {
      ProvinceId: search.ProvinceId,
      Keyword: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/ManageDistrict/getDistrictTableList', { params: param });
  }

  CheckDuplicate(data: District){
    return this.http.post<District>('system/ManageDistrict/checkduplicateDistrict', data);
  }

  public saveDistrict(data: District) {
    if (data.CreatedProgram) {
      return this.http.post<District>('system/ManageDistrict/updateDistrict', data);
    } else {
      return this.http.post<District>('system/ManageDistrict/insertDistrict', data);
    }
  }

  getInPageDistrictDetail(ProvinceId, DistrictId) {
    if (DistrictId == null) {
      DistrictId = -1
    }
    const param = {
      ProvinceId: ProvinceId,
      DistrictId: DistrictId,
    };
    return this.http.get<any>('system/ManageDistrict/getInDistrictDetail', { params: param });
  }

  getDistrictDetailEdit(DistrictId) {
    return this.http.get<any>('system/ManageDistrict/getDistrictDetail', { params: { DistrictId: DistrictId } });
  }

  deleteDistrict(data) {
    const param = {
      ProvinceId: data.province_id,
      DistrictId: data.district_id,
      // SubDistrictId: data.sub_district_id,
      RowVersion: data.RowVersion
    };
    return this.http.delete<District>('system/ManageDistrict/deleteDistrict', { params: param });
  }
}
