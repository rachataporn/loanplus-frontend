import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService, RowState } from '@app/shared';

export interface Parameter {
  ParameterGroupCode: string;
  ParameterCode: string;
  ParameterValue: string;
  Remark: string;
  Active: boolean;
  CreatedProgram: string;
}

@Injectable()
export class Sumt08Service {
  constructor(private http: HttpClient,
    private ts: TableService) { }

  getGroupParameter(): Observable<any> {
    return this.http.get<any>('system/Parameter/groupParameter');
  }

  getData(search: any, page: any) {
    const param = {
      ParameterGroupCodeSearch: search.ParameterGroupCodeSearch,
      InputSearch: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/Parameter/getParameterList', { params: param });
  }

  getProgramDetail(ParameterGroupCode, ParameterCode): Observable<any> {
    // const param = {
    //   ParameterGroupCode: ParameterGroupCode ,
    //   ParameterCode: ParameterCode
    // };
    return this.http.get<any>('system/Parameter/getParameterDetail', { params: { ParameterGroupCode: ParameterGroupCode,  ParameterCode: ParameterCode} });
  }

  saveParameter(data: Parameter) {
      return this.http.unit().put<Parameter>('system/Parameter/updateParameter', data);
  }

}