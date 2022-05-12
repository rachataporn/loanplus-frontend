import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ListItem {
  ListItemGroupCode: string,
  SystemCode: string,
  ListItemCode: string,
  ListItemNameTha: string,
  ListItemNameEng: string,
  Sequence: number,
  Remark: string,
  Active: boolean,
  RowVersion: number
}

@Injectable()
export class Dbmt04Service {

  constructor(private http: HttpClient) { }

  getMaster(isDetail) {
    return this.http.get<any>(`system/listitem/master/${isDetail}`);
  }
  getListItems(search: any, page: any) {
    page.sort = page.sort || "ListItemGroupCode,SystemCode,CodeOrder"
    const filter = Object.assign(search, page);
    return this.http.get<any>('system/listitem', { params: filter });
  }
  getListItem(listItemGroupCode, listItemCode) {
    return this.http.get<any>('system/listitem/detail', { params: { listItemGroupCode: listItemGroupCode, listItemCode: listItemCode } });
  }
  saveListItem(listItem: ListItem) {
    if (listItem.RowVersion)
      return this.http.put<ListItem>('system/listitem', listItem);
    else return this.http.post<ListItem>('system/listitem', listItem);
  }
  deleteListItem(listItemGroupCode, listItemCode,version){
    return this.http.delete('system/listitem', { params: { listItemGroupCode: listItemGroupCode, listItemCode: listItemCode, rowVersion: version } })
  }
}
