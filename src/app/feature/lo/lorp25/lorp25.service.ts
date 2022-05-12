import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  FormContract: string,
  ToContract: string,
  FormCompany: string,
  ToCompany: string,
  Month: string,
  Year: string,
  ReportName: string,
  ExportType: string,
}

@Injectable()
export class Lorp25Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/mgmMonthlyReport/master');
  }

  getContractNoLOV(searchForm: any, page: any) {
    const param = {
      ContractNo: searchForm.ContractNo,
      CustomerName: searchForm.CustomerName,
      Sort: page.sort || 'ContractNo ContractDate CustomerCode ASC',
      Index: page.index,
      Size: page.size
    };
    return this.http.get<any>('loan/mgmMonthlyReport/contractNoLOV', { params: param });
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/mgmMonthlyReport/getlorp25report', param, { responseType: 'text' });
  }

}
