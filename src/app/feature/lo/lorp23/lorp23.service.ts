import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  ContractNo: string;
  ReportType: string;
  ReportName: string;
  ExportType: string;
}

@Injectable()
export class Lorp23Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/paymentunderloanagreementreport/master/true');
  }

  GetLoanContractNoLOV(searchForm: any, page: any) {
    const param = {
      ContractNo: searchForm.ContractNo,
      ContractName: searchForm.ContractName,
      LovStatus: searchForm.LovStatus,
      Sort: page.sort || '',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/paymentunderloanagreementreport/GetLoanContractNo', { params: param });
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/paymentunderloanagreementreport/getlorp23report', param, { responseType: 'text' });
  }

}
