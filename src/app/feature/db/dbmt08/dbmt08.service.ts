import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Prefix {
  PrefixId: number,
  PrefixNameTha: string,
  PrefixNameEng: string,
  SuffixNameTha: string,
  SuffixNameEng: string,
  PersonalityType: string,
  Active: boolean,
  Description: string,
  RowVersion: number,
}

@Injectable()
export class Dbmt08Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('system/prefix/masterPrefix');
}

  getPrefix(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('system/Prefix', { params: filter });
  }

  getPrefixDetail(prefixId) {
    return this.http.get<any>('system/prefix/detailPrefix', { params: { prefixId: prefixId } });
  }

  deletePrefix(prefixId, version) {
    return this.http.unit().delete('system/prefix/deletePrefix', { params: { prefixId : prefixId, RowVersion: version } });
  }

  CheckSensitiveCase(param: Prefix) {
    return this.http.post('system/prefix/CheckSensitiveCase', param);
  }

  savePrefix(prefix: Prefix) {
    if (prefix.RowVersion){
      return this.http.put<Prefix>('system/prefix/updatetPrefix', prefix);
    }else{ 
      return this.http.post<Prefix>('system/prefix/insertPrefix', prefix);
  }
  }
}