import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
  ReportName: string,
  ExportReport: string,
  TypeReport: number,
  Province: number,
  District: number,
  SubDistrict: number,
  Date: Date;
}

@Injectable()
export class Lorp43Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/reportlorp43/master/true');
  }

  getDistrict(ProvinceId): Observable<any> {
    const param = {
      ProvinceId: ProvinceId
    };
    return this.http.get<any>('loan/reportlorp43/getDistrict', { params: param });
  }

  getSubDistrict(DistrictId): Observable<any> {
    const param = {
      DistrictId: DistrictId
    };
    return this.http.get<any>('loan/reportlorp43/getSubDistrict', { params: param });
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/reportlorp43/getlorp43report', param, { responseType: 'text' });
  }

}
