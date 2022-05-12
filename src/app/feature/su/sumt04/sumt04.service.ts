import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableService, RowState } from '@app/shared';

export interface Menu {
  MenuCode: string,
  ProgramCode: string,
  SystemCode: string;
  MenuName: string,
  Icon: string;
  RowState: RowState;
  RowVersion: string,
  MainMenu: string,
  SuMenuLabels:MenuLabel[],
  CreatedProgram: string;
}

export interface MenuLabel {
  SystemCode: string;
  MenuCode: string,
  MenuName: string,
  LangCode: string,
  RowVersion: string;
  RowState: RowState;
}

@Injectable()
export class Sumt04Service {
  constructor(private http: HttpClient,
    private ts: TableService) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('system/SuMenu/master/true');
  }
  
  public saveMenu(data: Menu) {
  if (data.RowVersion) {
    return this.http.put<Menu>('system/SuMenu/updateSuMenu', data);
  } else {
    return this.http.post<Menu>('system/SuMenu/insertSuMenu', data);
  }
}

  getSystemList(): Observable<any> {
    return this.http.get<any>('system/SuMenu/getLangList');
  }
  
  getLangList(): Observable<any> {
    return this.http.get<any>('system/SuMenu/getLangList');
  }
  
  getMenuDetail(MenuCode) {
    return this.http.get<any>('system/SuMenu/detail', { params: { MenuCode: MenuCode } });
  }

  deleteMenu(MenuCode, RowVersion) {
    const param = {
      MenuCode: MenuCode,
      RowVersion: RowVersion
    };
    return this.http.delete<string>('system/SuMenu/deleteSuMenu', { params: param });
  }
  CheckDuplicate(data: Menu)
  {
    return this.http.post<Menu>('system/SuMenu/checkduplicateMenuCode', data);
  }

  getData(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort || 'MenuCode ASC NULLS LAST',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/SuMenu/getSuMenuList', { params: param });
  }
}
