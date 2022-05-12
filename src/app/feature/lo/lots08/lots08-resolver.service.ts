import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots08Service, Receipt } from './lots08.service';
@Injectable()
export class Lots08Resolver implements Resolve<any> {
  constructor(private lots08Service: Lots08Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const url: string = route.url.join('/');
    if (url.includes('detail')) {
      const companyCode = route.paramMap.get('CompanyCode');
      localStorage.setItem('company', companyCode);
      
      const MainContractHeadID = route.paramMap.get('MainContractHeadID');
      let master = this.lots08Service.getMaster(true);
      const PaymentDetail = MainContractHeadID ? this.lots08Service.getLoanDetail(MainContractHeadID, false) : of({} as Receipt);

      return forkJoin(
        PaymentDetail,
        master,
      ).pipe(map((result) => {
        let PaymentDetail = result[0];
        let master = result[1];
        return {
          PaymentDetail,
          master
        };
      }));
    } else {
      let master = this.lots08Service.getMaster(false);
      return master;
    }
  }
}
