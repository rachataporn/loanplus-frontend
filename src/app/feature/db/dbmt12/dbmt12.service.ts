import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Position {
  PositionCode: number;
  PositionNameTha: string;
  PositionNameEng: string;
  Active: boolean;
  CompanyCode: string;
  CreatedProgram: string;
}

@Injectable()
export class Dbmt12Service {
  constructor(private http: HttpClient) { }

  getData(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/Position/getPositionList', { params: param });

  }

  getDetail(PositionCode) {
    return this.http.get<any>('system/Position/getPositionDetail', { params: { PositionCode: PositionCode } });
  }

  public savePosition(data: Position) {
    if (data.CreatedProgram) {
      return this.http.put<Position>('system/Position/updatePosition', data);
    } else {
      return this.http.post<Position>('system/Position/createPosition', data);
    }
  }

  deletePosition(PositionCode: string, RowVersion: any) {
    const param = {
      PositionCode: PositionCode,
      RowVersion: RowVersion
    };
    return this.http.delete<string>('system/Position/deletePosition', { params: param });
  }

  CheckDuplicate(data: Position){
    return this.http.post<Position>('system/Position/checkDuplicate', data);
  }

}
