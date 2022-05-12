import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService, RowState } from '@app/shared';

export interface Program {
  ProgramCode: String;
  ProgramName: String;
  ProgramPath: String;
  ApiFileName: String;
  RowVersion: string;
  ProgramLabels: ProgramLabel[];
  ProgramLabelsTh: ProgramLabel[];
  ProgramLabelsEn: ProgramLabel[];
}

export interface ProgramLabel {
  SystemCode: String;
  ProgramCode: String;
  FieldName: String;
  LangCode: String;
  LabelName: String;
  RowVersion: string;
  RowState: RowState;
}

@Injectable()
export class Sumt03Service {
  constructor(private http: HttpClient,
    private ts: TableService) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('system/program/master/true');
  }

  getProgram(search: any, page: any) {
    const filter = {
      InputSearch: search.inputSearch || '',
      sort: page.sort || 'ProgramCode ASC',
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      index: page.index,
      size: page.size
    };
    // const filter = Object.assign(search, page);
    return this.http.get<any>('system/program/getProgramList', { params: filter });
  }

  getLang(page: any) {
    const filter = Object.assign(page);
    return this.http.get<any>('system/program/getLangList', { params: filter });
  }

  getProgramDetail(programCode: any, langCode: string): Observable<any> {
    return this.http.get<any>('system/program/detail', { params: { ProgramCode: programCode, LangCode: langCode} });
  }

  saveProgram(data: Program) {
    if (data.RowVersion) {
      return this.http.unit().put<Program>('system/program/updateProgram', data);
    } else {
      return this.http.unit().post<Program>('system/program/insertProgram', data);
    }
  }

  copyProgramLabel(data: Program) {
    return this.http.unit().post<Program>('system/program/copyProgramLabel', data);
  }

  deleteProgram(programCode, version) {
    return this.http.unit().delete('system/program/deleteProgram', { params: { ProgramCode: programCode, RowVersion: version } });
  }

}
