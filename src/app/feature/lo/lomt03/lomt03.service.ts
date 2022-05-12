import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PeriodMaster {
  CompanyCode: string;
  Year: number;
  Period: number;
  StartDate: Date;
  EndDate: Date;
  ClosedDate: Date;
  CreatedProgram: string;
}

@Injectable()
export class Lomt03Service {
  constructor(private http: HttpClient) { }

  getYear() {
    return this.http.get('loan/PeriodPay/getYearList');
  }

  getPeriod(search: any, page: any) {
    const filter = {
      Keyword: search.keysearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/PeriodPay/getPeriodPayTableList', { params: filter });
  }

  editStatus(Periods, search, page: any) {
    const filter = {
      rcPeriod: Periods,
      periodSearch: search,
      sort: page.sort || 'Year DESC, Period',
      index: page.index,
      size: page.size
    };
    return this.http.put<any>('loan/PeriodPay/edit', filter);
  }

  insertPeriod(data, search, page: any) {
    const filter = {
      Year: data.year,
      StartDate: data.startDate
    };
    return this.http.post<any>('loan/PeriodPay/insertPeriodPay', filter);
  }

  checkDuplicate(data) {
    const filter = {
      Year: data.year,
      StartDate: data.startDate
    };
    return this.http.post<any>('loan/PeriodPay/dupicatePeriod', filter);
  }

  // dupicatePeriod(data) {
  //   const filter = {
  //     Year: data.year,
  //     StartDate: data.startDate
  //   };
  //   return this.http.get<any>('loan/PeriodPay/dupicatePeriod', { params: filter });
  // }

  // savePeriodPay(modal: PeriodMaster) {
  //   if (modal.CreatedProgram) {
  //     return this.http.post<PeriodMaster>('loan/PeriodPay/updatePeriodPay', modal);
  //   } else {
  //     return this.http.post<PeriodMaster>('loan/PeriodPay/insertPeriodPay', modal);
  //   }
  // }

  // deletePeriodPay(company_code, Year, Period, RowVersion) {
  //   const param = {
  //     CompanyCode: company_code,
  //     Year: Year,
  //     Period: Period,
  //     RowVersion: RowVersion
  //   };
  //   return this.http.delete<PeriodMaster>('loan/PeriodPay/deletePeriodPay', { params: param });
  // }
}
