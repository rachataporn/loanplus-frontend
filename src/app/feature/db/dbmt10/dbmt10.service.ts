import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Province {
  ProvinceId: number;
  ProvinceNameTha: string;
  ProvinceNameEng: string;
  CountryCode: number;
  CountryName:string;
  Active: boolean;
  CreatedProgram: string;
}


@Injectable()
export class Dbmt10Service {

  constructor(private http: HttpClient) { }

  getCountryList() {
    return this.http.get<any>('system/ManageProvince/getCountryLists');
  }

  getProvinceList() {
    return this.http.get<any>('system/ManageProvince/getProvinceLists');
  }

  getData(search: any, page: any) {
    const param = {
      InputSearchDropdown: search.Province,
      Keyword: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/ManageProvince/getProvinceTableList', { params: param });
  }

  getDetail(ProvinceId) {
    return this.http.get<any>('system/ManageProvince/getProvinceDetail', { params: { ProvinceId: ProvinceId } });
  }

  CheckDuplicate(data: Province){
    return this.http.post<Province>('system/ManageProvince/checkduplicateProvince', data);
  }

  public saveProvince(data: Province) {
    if (data.CreatedProgram) {
      return this.http.post<Province>('system/ManageProvince/updateProvince', data);
    } else {
      return this.http.post<Province>('system/ManageProvince/insertProvince', data);
    }
  }

  deleteProvince(data) {
    const param = {
      ProvinceId: data.province_id,
      // DistrictId: data.district_id,
      // SubDistrictId: data.sub_district_id,
      RowVersion: data.RowVersion
    };
    return this.http.delete<Province>('system/ManageProvince/deleteProvince', { params: param });
  }
}
