import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Country {
  CountryCode:String;
  CountryNameTha:String;
  CountryNameEng:String;
  Active: boolean;
  CreatedProgram: String;
}


@Injectable()
export class Dbmt09Service {

  constructor(private http: HttpClient) { }

  getData(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/Country/getCountryList', { params: param });

  }

  getDetail(CountryCode) {
    return this.http.get<any>('system/Country/getCountryDetail', { params: { CountryCode: CountryCode } });
  }

  public saveCountry(data: Country) {
    if (data.CreatedProgram) {
      return this.http.put<Country>('system/Country/updateCountry', data);
    } else {
      return this.http.post<Country>('system/Country/createCountry', data);
    }
  }

  deleteCountry(CountryCode, RowVersion) {
    const param = {
      CountryCode: CountryCode,
      RowVersion: RowVersion
    };
    return this.http.delete<string>('system/Country/deleteCountry', { params: param });
  }

  CheckDuplicate(data: Country){
    return this.http.post<Country>('system/Country/checkduplicate', data);
  }



}
