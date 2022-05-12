import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface SubDistrict {
  ProvinceId: number;
  DistrictId: number;
  SubDistrictId: number;
  SubDistrictNameTha: string;
  SubDistrictNameEng: string;
  Active: boolean;
  CreatedProgram: string;
}


@Injectable()
export class Dbmt112Service {

  constructor(private http: HttpClient) { }

  getHeader(search: any) {
    const param = {
      ProvinceId: search.ProvinceId,
      DistrictId: search.DistrictId,
    };
    return this.http.get<any>('system/ManageSubDistrict/getHeaderSubDistrict', { params: param });
  }

  getData(search: any, page: any) {
    const param = {
      ProvinceId: search.ProvinceId,
      DistrictId: search.DistrictId,
      Keyword: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/ManageSubDistrict/getSubDistrictTableList', { params: param });
  }

  getInPageSubDistrictDetail(ProvinceId, DistrictId, SubDistrictId) {
    if (SubDistrictId == null) {
      SubDistrictId = -1
    }
    const param = {
      ProvinceId: ProvinceId,
      DistrictId: DistrictId,
      SubDistrictId: SubDistrictId
    };
    return this.http.get<any>('system/ManageSubDistrict/getInSubDistrictDetail', { params: param });
  }

  getDetail(ProvinceId) {
    return this.http.get<any>('system/ManageSubDistrict/getProvinceDetail', { params: { ProvinceId: ProvinceId } });
  }

  CheckDuplicate(data: SubDistrict){
    return this.http.post<SubDistrict>('system/ManageSubDistrict/checkduplicateSubDistrict', data);
  }

  public saveSubDistrict(data: SubDistrict) {
    if (data.CreatedProgram) {
      return this.http.post<SubDistrict>('system/ManageSubDistrict/updateSubDistrict', data);
    } else {
      return this.http.post<SubDistrict>('system/ManageSubDistrict/insertSubDistrict', data);
    }
  }

  deleteSubDistrict(data) {
    const param = {
      ProvinceId: data.province_id,
      DistrictId: data.district_id,
      SubDistrictId: data.sub_district_id,
      RowVersion: data.RowVersion
    };
    return this.http.delete<SubDistrict>('system/ManageSubDistrict/deleteSubDistrict', { params: param });
  }
}
