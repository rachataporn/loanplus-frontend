import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt05Service, CompanyAccount } from './lomt05.service';
@Injectable()
export class Lomt05Resolver implements Resolve<any> {
  constructor(private lomt05Service: Lomt05Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const CompanyAccountId = route.paramMap.get('CompanyAccountId');
    const CompanyAccountDetail = CompanyAccountId ? this.lomt05Service.getDetail(CompanyAccountId) : of({} as CompanyAccount);
    const DetailList = this.lomt05Service.getDetailList();

    return forkJoin(
      CompanyAccountDetail
      , DetailList

    ).pipe(map((result) => {
      const CompanyAccountDetail = result[0];
      const DetailList = result[1];

      return {
        CompanyAccountDetail
        , DetailList
      };
    }));
  }
}
