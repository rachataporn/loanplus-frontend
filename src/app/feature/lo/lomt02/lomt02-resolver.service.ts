import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt02Service, LoanAgreementType } from './lomt02.service';
@Injectable()
export class Lomt02Resolver implements Resolve<any> {
  constructor(private lomt02Service: Lomt02Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const LoanTypeCode = route.paramMap.get('LoanTypeCode');
    const LoanTypeDetail = LoanTypeCode ? this.lomt02Service.getDetail(LoanTypeCode) : of({} as LoanAgreementType);
    const Master = this.lomt02Service.getMaster();
    
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
