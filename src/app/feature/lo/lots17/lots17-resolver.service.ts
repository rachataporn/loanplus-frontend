import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots17Service, Receipt } from './lots17.service';
@Injectable()
export class Lots17Resolver implements Resolve<any> {
  constructor(private lots17Service: Lots17Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const MainContractHeadID = route.paramMap.get('MainContractHeadID');
    let master = this.lots17Service.getMaster(true);
    const PaymentDetail = MainContractHeadID ? this.lots17Service.getPaymentAdvanceDetail(MainContractHeadID, false) : of({} as Receipt);

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
  }
}
