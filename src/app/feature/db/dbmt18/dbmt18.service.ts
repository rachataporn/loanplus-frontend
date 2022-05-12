import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Country {
  CountryCode:String;
  CountryNameTha:String;
  CountryNameEng:String;
  Active: boolean;
  CreatedProgram: String;
}

export interface Faq {
  FaqCode:String;
  FaqDescription:String;
  FaqTopic:String;
  Active: boolean;
  CreatedProgram: String;
}


@Injectable()
export class Dbmt18Service {

  constructor(private http: HttpClient) { }



  getDataFaq(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/PCMFaq/getFaqList', { params: param });
  }

  getFaqDetail(Id) {
    return this.http.get<any>('system/PCMFaq/getFaqDetail', { params: { Id: Id } });
  }


  deleteCountry(Id, RowVersion) {
    const param = {
      Id: Id,
      RowVersion: RowVersion
    };
    return this.http.delete<string>('system/PCMFaq/deleteCountry', { params: param });
  }

  CheckDuplicateFaq(data: Faq){
    return this.http.post<Faq>('system/PCMFaq/checkduplicate', data);
  }

  public savePcmFaq(data: Faq) {
    if (data.CreatedProgram) {
      return this.http.put<Faq>('system/PCMFaq/updateFaq', data);
    } else {
      return this.http.post<Faq>('system/PCMFaq/createFaq', data);
    }
  }



}
