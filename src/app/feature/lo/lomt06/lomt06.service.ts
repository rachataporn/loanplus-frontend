import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Group {
  GroupCode:string;
  GroupName:string;
  Active: boolean;
  CreatedProgram: string;
}


@Injectable()
export class Lomt06Service {

  constructor(private http: HttpClient) { }

  getData(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/Group/getGroupList', { params: param });

  }

  getDetail(GroupCode) {
    return this.http.get<any>('loan/Group/getGroupDetail', { params: { GroupCode: GroupCode } });
  }

  public saveGroup(data: Group) {
    if (data.CreatedProgram) {
      return this.http.put<Group>('loan/Group/updateGroup', data);
    } else {
      return this.http.post<Group>('loan/Group/createGroup', data);
    }
  }

  deleteGroup(GroupCode: string, RowVersion: any) {
    const param = {
      GroupCode: GroupCode,
      RowVersion: RowVersion
    };
    return this.http.delete<string>('loan/Group/deleteGroup', { params: param });
  }

  CheckDuplicate(data: Group){
    return this.http.post<Group>('loan/Group/checkduplicate', data);
  }

}
