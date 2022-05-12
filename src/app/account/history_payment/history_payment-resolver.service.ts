import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { HistoryPaymentService, LinePay } from './history_payment.service';
@Injectable()
export class HistoryPaymentResolver implements Resolve<any> {
  constructor(private js: HistoryPaymentService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    // const lineUserId = 'U9e0df9712f8a5c329a6d2194674ba9c9';
    // const getLinePay = lineUserId ? this.js.getLinePay(lineUserId) : of({} as LinePay);
    // return forkJoin(
    //   getLinePay
    // ).pipe(map((result) => {
    //   const getLinePay = result[0];
    //   return {
    //     getLinePay
    //   };
    // }));
    return null;
  }
}
