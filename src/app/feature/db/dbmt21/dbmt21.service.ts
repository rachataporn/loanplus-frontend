import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState, TableService } from '@app/shared';
import { environment } from '@env/environment';

export interface DbDepartmentNew {
  Active: boolean,
  DepartmentNameTha: string,
  DepartmentNameEng: string,
  DepartmentCode: string,
  DepartmentParent: string,
  RowVersion: number;
  DepartmentAbbreviation: string,
  DbDepartmentCompany: DbDepartmentCompany[],
}
export interface DbDepartmentCompany {
  DepartmentCode: String,
  CompanyCode: String,
  RowVersion: number;
  RowState: RowState;
}

@Injectable()
export class Dbmt21Service {
  constructor(private http: HttpClient,
    private ts: TableService) { }

  getDepartments(search: any, page: any) {
    // const filter = Object.assign({ keyword: search }, page);
    const filter = Object.assign(search, page);
    console.log(filter);
    filter.sort = page.sort || 'DepartmentCode'
    return this.http.get<any>('system/DbDepartment/List', { params: filter });
  }

  getDepartment(DepartmentCode) {
    return this.http.get<any>('system/DbDepartment/getDetail', { params: { DepartmentCode: DepartmentCode } });
  }

  getMaster(): Observable<any> {
    return this.http.get<any>('system/DbDepartment/master');
  }

  saveDepartment(DepartmentCode: DbDepartmentNew) {
    console.log(DepartmentCode);

    if (!DepartmentCode.RowVersion) {
      return this.http.post<DbDepartmentNew>('system/DbDepartment/Create', DepartmentCode);
    } else {
      return this.http.put<DbDepartmentNew>('system/DbDepartment/Update', DepartmentCode);
    }
  }

  delete(DepartmentCode, version) {
    return this.http.delete('system/DbDepartment', {
       params: {
        DepartmentCode: DepartmentCode,
          RowVersion: version
          }
        });
  }
  
}
