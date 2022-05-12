import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Country {
  CountryCode:String;
  CountryNameTha:String;
  CountryNameEng:String;
  Active: boolean;
  CreatedProgram: String;
}

export interface Banner {
  BannerCode:String;
  BannerName: String;
  BannerBase64: String;
  Active: boolean;
  CreatedProgram: String;
  BannerUrlName: String;
  FileBanner: File;
}


@Injectable()
export class Dbmt19Service {

  constructor(private http: HttpClient) { }



  getDataBanner(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/PCMBanner/getBannerList', { params: param });
  }

  getBannerDetail(Id) {
    return this.http.get<any>('system/PCMBanner/getBannerDetail', { params: { Id: Id } });
  }


  deleteCountry(Id, RowVersion) {
    const param = {
      Id: Id,
      RowVersion: RowVersion
    };
    return this.http.delete<string>('system/PCMBanner/deleteBanner', { params: param });
  }

  CheckDuplicateBanner(data: Banner){
    return this.http.post<Banner>('system/PCMBanner/checkduplicate', data);
  }

  public savePcmBanner(data: Banner) {

    if (data.CreatedProgram) {
      return this.http.put<Banner>('system/PCMBanner/updatePcmBanner', data);
    } else {

      return this.http.post<Banner>('system/PCMBanner/createPcmBanner', data);
    }
  }



}
