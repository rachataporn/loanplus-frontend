import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Information {
  InformationId: number;
  InformationName: string;
  Active: boolean;
  CreatedProgram: string;
}

@Injectable()
export class Lomt07Service {
  constructor(private http: HttpClient) { }

  getData(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort || 'InformationName ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/Information/getInformationList', { params: param });
  }

  getDetail(InformationId) {
    return this.http.get<any>('loan/Information/getInformationDetail', { params: { InformationId: InformationId } });
  }

  public saveInformation(data: Information) {
    if (data.CreatedProgram) {
      return this.http.put<Information>('loan/Information/updateInformation', data);
    } else {
      return this.http.post<Information>('loan/Information/createInformation', data);
    }
  }

  deleteInformation(InformationId, RowVersion) {
    const param = {
      InformationId: InformationId,
      RowVersion: RowVersion
    };
    return this.http.delete<string>('loan/Information/deleteInformation', { params: param });
  }

  checkDupInformationName(data: any) {
    const param = {
      InformationName: data.InformationName,
      InformationId: data.InformationId
    };
    return this.http.get<any>('loan/Information/checkDupInformationName', { params: param });
  }
}
