import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageFile } from '@app/shared/image/image-file-base64.model';
import { FileService } from '@app/shared';
declare var liff: any;

export interface LinePay {
  LineUserId: string;
  FirstName: string;
  Period: number;
  TotalAmount: number;
  ContractHeadId: number;
  DueDate: string;
  SlipImageFile: string;
  SlipImageDeleting: string;
  arrayImage: ArrayImage[]
}

export interface ArrayImage {
  Img: string
}

@Injectable()
export class LinePayService {
  // [x: string]: any;
  constructor(private http: HttpClient,
    private fs: FileService) { }

  saveLinePay(data, imageFile) {
    let FormData = this.fs.convertModelToFormData(data, { arrayImage: imageFile });
    return this.http.post<any>('loan/linePay/saveLinePay', FormData);
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

  getContractList(LineUserId) {
    return this.http.get<any>('loan/linePay/getContractHeadList', { params: { LineUserId: LineUserId } });
  }

  getLinePay(ContractHeadId) {
    return this.http.get<any>('loan/linePay/getLinePay', { params: { ContractHeadId: ContractHeadId } });
  }

}
