import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots09Service, Loan, PaymentFlag } from './lots09.service';
@Injectable()
export class Lots09Resolver implements Resolve<any> {
  constructor(private lots09Service: Lots09Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const url: string = route.url.join('/');
    if (url.includes('detail')) {
      const ReceiptHeadId = route.paramMap.get('ReceiptHeadId');
      let master = this.lots09Service.getMaster(true);
      const ReceiptDetail = ReceiptHeadId ? this.lots09Service.getReceiptDetail(ReceiptHeadId) : of({} as Loan);

      return forkJoin(
        ReceiptDetail,
        master,
      ).pipe(map((result) => {
        let ReceiptDetail = result[0];
        let master = result[1];
        return {
          ReceiptDetail,
          master
        };
      }));
    } else {
      let master = this.lots09Service.getMaster(false);
      return  master ;
    }
  }
}
