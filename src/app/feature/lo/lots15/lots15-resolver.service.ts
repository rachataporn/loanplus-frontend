import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots15Service, Loan, PaymentFlag } from './lots15.service';
@Injectable()
export class Lots15Resolver implements Resolve<any> {
  constructor(private lots15Service: Lots15Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const url: string = route.url.join('/');
    if (url.includes('detail')) {
      const ReceiptHeadId = route.paramMap.get('ReceiptHeadId');
      let master = this.lots15Service.getMaster(true);
      const ReceiptDetail = ReceiptHeadId ? this.lots15Service.getReceiptDetail(ReceiptHeadId) : of({} as Loan);

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
      let master = this.lots15Service.getMaster(false);
      return  master ;
    }
  }
}
