import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  Pidate: Date,
  FromContractNo: string,
  ToContractNo: string,
  FromBranchCode: string,
  ToBranchCode: string,
  FromLoanType: string,
  ToLoanType: string,
  ReportFormat: string,
  ReportName: string,
  ExportType: string,
  FromContractNoText: string,
  ToContractNoText: string,
  FromBranchText: string,
  ToBranchText: string,
  FromLoanTypeText: string,
  ToLoanTypeText: string,
  ReportType: string,
  StartDate: Date,
  RemainPay: string,
  DueDate: Date,
}



@Injectable()
export class Trrp01Service {
  constructor(private http: HttpClient) { }

  GetLoanContractNoLOV(searchForm: any, page: any) {
    const param = {
      ContractNo: searchForm.ContractNo,
      LovStatus: searchForm.LovStatus,
      Sort: page.sort || '',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('tracking/debtcollectionletterReport/contractNoLOV', { params: param });
  }

  generateReport(param: ReportParam) {
    return this.http.post('tracking/debtcollectionletterReport/getReport', param, { responseType: 'text' });
  }

  getMaster(): Observable<any> {
    return this.http.get<any>('tracking/debtcollectionletterReport/master/true');
  }

}
