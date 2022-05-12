import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageFile } from '../../../shared/image/image-file.model';
import { FileService } from '../../../shared/service/file.service';

export interface Country {
  CountryCode:String;
  CountryNameTha:String;
  CountryNameEng:String;
  Active: boolean;
  CreatedProgram: String;
}

export interface PcmContractInfo {
  Id:number,
  telNumber:String;
  officeLine:String;
  officeEmail:String;
  officeHour:String;
  officeImgPath:String;
  officeImgName:String;
  CreatedProgram: String;
}

export interface Attachment {
  AttahmentName: string;
  Image: ImageFile;
}

@Injectable()
export class Dbmt17Service {

  // constructor(private http: HttpClient) { }
  Attahment: Attachment = {} as Attachment;
  constructor(private http: HttpClient, private fs: FileService) { }

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

  public savePcmContract(data: PcmContractInfo) {
    if (data.Id) {
      return this.http.put<PcmContractInfo>('system/PCMContractInfo/updatePcmContractInfo', data);
    } else {
      return this.http.post<PcmContractInfo>('system/PCMContractInfo/createPcmContractInfo', data);
    }
    return this.http.post<PcmContractInfo>('system/Country/createCountry', data);
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

  getPcmContractDetail() {
    return this.http.get<any>('system/PCMContractInfo/getContractDetail', { params: { } });
  }

  uploadImgAuto(imgUpload: ImageFile) {
    this.Attahment.AttahmentName = imgUpload.Name;
    let formData = this.fs.convertModelToFormData(this.Attahment, {Image: imgUpload });
    return this.http.post<number>('loan/requestSecurities/saveImgAutoUploadSecurities', formData).toPromise();;
  }

}
