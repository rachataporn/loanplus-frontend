import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignatureSelect {
  MainContractHeadId: number;
}

@Injectable()
export class Lots26Service {
  constructor(private http: HttpClient
  ) { }

  getMaster(isDetail): Observable<any> {
    return this.http.get<any>('loan/LoanAgreementSignature/master', { params: { isDetail: isDetail } });
  }

  getLoanAgreement(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/LoanAgreementSignature/search', { params: filter });
  }

  getSignature(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/LoanAgreementSignature/Signature', { params: filter });
  }

  updateSignature(data: SignatureSelect) {
    return this.http.unit().put<any>('loan/LoanAgreementSignature/UpdateSignature', data);
  }

  checkContractSign(search: any) {
    const filter = Object.assign(search);
    return this.http.get<boolean>('loan/LoanAgreementSignature/checkContractSign', { params: filter });
  }

  updateConfirmSignature(data: SignatureSelect) {
    return this.http.unit().put<any>('loan/LoanAgreementSignature/updateConfirmSignature', data);
  }

  checkWaitSign(search: any) {
    const filter = Object.assign(search);
    return this.http.get<boolean>('loan/LoanAgreementSignature/checkWaitSign', { params: filter });
  }

  checkSignStatus(search: any) {
    const filter = Object.assign(search);
    return this.http.get<boolean>('loan/LoanAgreementSignature/checkSignStatus', { params: filter });
  }
}
