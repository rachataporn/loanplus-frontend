import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';


export interface SuProfileDTO {
  ProfileCode: String;
  ProfileDesc: String;
  Active: boolean;
  CreatedProgram: String;
  UpdatedProgram: String;
  RowVersion: string;
  MenuProfile: MenuProfile[];
}
export interface MenuProfile {
  ProfileCode: String;
  MenuCode: String;
  menuname: String;
  RowVersion: string;
  RowState: RowState;
}


@Injectable()
export class Sumt05Service {
  constructor(private http: HttpClient) { }

  getProfileList(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/SuPermission/getProfileList', { params: param });
  }


  deleteProfile(ProfileCode, RowVersion) {
    const param = {
      ProfileCode: ProfileCode,
      RowVersion: RowVersion
    };
    return this.http.delete<string>('system/SuPermission/deleteProfile', { params: param });
  }

  getProfileDetail(ProfileCode, Langcode): Observable<SuProfileDTO> {
    var langcode = '';
    if (Langcode == 'Tha') {
      langcode = 'TH';
    } else if (Langcode == 'Eng') {
      langcode = 'EN';
    }
    return this.http.get<SuProfileDTO>('system/SuPermission/getProfileDetail', { params: { ProfileCode: ProfileCode, Langcode: langcode } });
  }

  saveProfile(data: SuProfileDTO) {
    if (data.CreatedProgram != null && data.CreatedProgram != undefined && data.CreatedProgram != '') {
      data.UpdatedProgram = 'SUMT05';
      return this.http.put<SuProfileDTO>('system/SuPermission/updateProfile', data);
    } else {
      data.UpdatedProgram = 'SUMT05';
      return this.http.post<SuProfileDTO>('system/SuPermission/createProfile', data);
    }
  }

  getMenuList(search: any, page: any) {
    var langcode
    if (search.langcode == 'Tha') {
      langcode = 'TH'
    } else if (search.langcode == 'Eng') {
      langcode = 'EN'
    }
    const params = {
      keyword: search.keyword,
      langcode: langcode,
      sort: page.sort || '',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/SuPermissionMenu/getMenuList', { params: params });
  }
  CheckDuplicate2(data: SuProfileDTO) {
    return this.http.post<SuProfileDTO>('system/SuPermission/checkduplicate', data);
  }

}
