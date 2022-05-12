import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FromBranchCode: string,
  ToBranchCode: string,
  FromBorrowerCode: string,
  ToBorrowerCode: string,
  FromGaruntorCode: string,
  ToGaruntorCode: string,
  ReportName: string,
  ExportType: string,
  FromBranchText: string,
  ToBranchText: string,
}

@Injectable()
export class Lorp04Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/CustomersAndGuarantorsForLoanAgreementsReport/master/true');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/CustomersAndGuarantorsForLoanAgreementsReport/getlorp04report', param, { responseType: 'text' });
  }
}
