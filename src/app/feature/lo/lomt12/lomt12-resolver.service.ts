import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt12Service, LoanAgreementType } from './lomt12.service';
@Injectable()
export class Lomt12Resolver implements Resolve<any> {
  constructor(private lomt12Service: Lomt12Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const LoanTypeCode = route.paramMap.get('LoanTypeCode');
    const LoanTypeDetail = LoanTypeCode ? this.lomt12Service.getDetail(LoanTypeCode) : of({} as LoanAgreementType);
    const Master = this.lomt12Service.getMaster();
    
    return forkJoin(
      LoanTypeDetail,Master
      ).pipe(map((result) => {
      const LoanTypeDetail = result[0];
      const master = result[1];
      return {
        LoanTypeDetail,master
      };
    }));
  }
}
