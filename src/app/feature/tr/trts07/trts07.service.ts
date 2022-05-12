import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileService } from '@app/shared';

export interface FileUpload {
  FileName: string;
}

export interface CreateFileUploadReturn {
  ErrorLog: string;
}

@Injectable()
export class Trts07Service {
  constructor(private http: HttpClient, private fs: FileService) { }

  getCustomerBlackList(page: any) {
    const filter = Object.assign(page);
    filter.sort = page.sort || 'CustomerName'
    return this.http.get<any>('tracking/TrackingBlackList/customerBlackList', { params: filter });
  }

  getSecuritiesBlackList(page: any) {
    const filter = Object.assign(page);
    filter.sort = page.sort || 'CustomerName'
    return this.http.get<any>('tracking/TrackingBlackList/securitiesBlackList', { params: filter });
  }

  checkFileUpload(FileName, attachment) {
    let fileExcel = this.fs.convertModelToFormData(FileName, { fileExcel: attachment });
    return this.http.post<CreateFileUploadReturn>('tracking/TrackingBlackList/checkFileUploadExcel', fileExcel);
  }

  upload(FileName, attachment) {
    let fileExcel = this.fs.convertModelToFormData(FileName, { fileExcel: attachment });
    return this.http.post<CreateFileUploadReturn>('tracking/TrackingBlackList/uploadExcel', fileExcel);
  }
}