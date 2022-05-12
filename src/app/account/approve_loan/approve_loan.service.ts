import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageFile } from '@app/shared/image/image-file-base64.model';
import { FileService } from '@app/shared';
declare var liff: any;

export interface ApproveLoan {
  PrefixId: number;
  LastName: string;
  FirstName: string;
  IdCard: string;
  MobileNo: string;
  UserLineId: string;
  Email: string;
  Career: string;
  LoanAmount: number;
  SecuritiesCategoryId: number;
  StatusContact: boolean;
  BirthDate: Date;
  Age: string;
  ImageAssetFile: string;
  ImageAssetDeleting: string;
  arrayImage: ArrayImage[]
}

export interface ArrayImage {
  Img: string
}

@Injectable()
export class ApproveLoanService {
  constructor(private http: HttpClient,
    private fs: FileService) { }

  saveApproveLoan(data, imageFile) {
    let FormData = this.fs.convertModelToFormData(data, { arrayImage: imageFile });
    return this.http.post<any>('loan/approveLoan', FormData);
  }

  initLineLiff() {
    return new Promise((resolve, reject) => {
      liff.init(data => {
        resolve(liff.getProfile())
      }, err => {
        reject(err)
      })
    })
  }

  getLineProfile() {
    return new Promise((resolve, reject) => {
      liff.getProfile(data => {
        resolve(data)
      }, err => {
        reject(err)
      })
    })
  }

  getLoanTypeDDL() {
    return this.http.get('loan/approveLoan/loanTypeDDL');
  }
}
