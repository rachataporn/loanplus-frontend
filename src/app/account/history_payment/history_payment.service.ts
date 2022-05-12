import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  arrayImage: ArrayImage[];
}

export interface ArrayImage {
  Img: string;
}

@Injectable()
export class HistoryPaymentService {
  [x: string]: any;
  constructor(private http: HttpClient,
    private fs: FileService) { }

  initLineLiff() {
    return new Promise((resolve, reject) => {
      liff.init(data => {
        resolve(liff.getProfile());
      }, err => {
        reject(err);
      });
    });
  }

  getLineProfile() {
    return new Promise((resolve, reject) => {
      liff.getProfile(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  getContractList(LineUserId) {
    return this.http.get<any>('loan/historyPayment/getContractHeadList', { params: { LineUserId: LineUserId } });
  }

  getHistoryPayment(ContractHeadId) {
    return this.http.get<any>('loan/historyPayment/getHistoryPaymentList', { params: { ContractHeadId: ContractHeadId } });
  }

}
