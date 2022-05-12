import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  // systemCode: String,
  // menuCode: String,
  // mainMenu: String,
  // programCode: String,
  // active: boolean,
  // icon: String,
  // createdProgram: Date,
  // updatedProgram: Date
}

@Injectable()
export class Lorp14Service {
  constructor(private http: HttpClient) { }

  // getSystemCombobox() {
  //   return this.http.get('lomt01/systemCodeDDL');
  // }

  // getMainMenuCombobox(systemCode) {
  //   return this.http.get('lomt01/mainMenuDDL', { params: { systemCode: systemCode } });
  // }

  // getProgramCodeCombobox() {
  //   return this.http.get('lomt01/programCodeDDL');
  // }

  // getLanguageCombobox() {
  //   return this.http.get('lomt01/langCodeDDL');
  // }

  // getMenuDetail(systemCode, menuCode): Observable<any> {
  //   return this.http.get<Menu>('lomt01/searchEdit', { params: { systemCode: systemCode, menuCode: menuCode } });
  // }

  // getMenuList(search: any, page: any) {
  //   const params = {
  //     programSearch: search,
  //     sort: page.sort || 'menuCode',
  //     direction: page.direction || 'asc',
  //     index: page.index,
  //     size: page.size
  //   };
  //   return this.http.get<any>('lomt01/search', { params: params });
  // }

  // checkDetailBeforeDelate(menuCode, systemCode) {
  //   return this.http.get<any>('lomt01/checkDetailBeforeDelate', { params: { menuCode: menuCode, systemCode: systemCode } });
  // }

  // deleteMenu(menuCode, systemCode) {
  //   const param = {
  //     menuCode: menuCode,
  //     systemCode: systemCode
  //   };
  //   return this.http.delete('lomt01/delete', { params: param });
  // }

  // saveMenu(data: Menu) {
  //   if (data.createdProgram) {
  //     return this.http.put<Menu>('lomt01/edit', data);
  //   } else {
  //     return this.http.post<Menu>('lomt01/save', data);
  //   }
  // }
}
