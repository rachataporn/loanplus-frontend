import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots02Service, RequestLoan } from './lots02.service';
@Injectable()
export class Lots02Resolver implements Resolve<any> {
  constructor(private lots02Service: Lots02Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const CustomerCode = route.paramMap.get('CustomerCode');
    let master = this.lots02Service.getMaster();
    const RequestRoanDetail = CustomerCode ? this.lots02Service.getSearchEdit(CustomerCode) : of({} as RequestLoan);

    return forkJoin(
      RequestRoanDetail,
      master
    ).pipe(map((result) => {
      let RequestRoanDetail = result[0];
      let master = result[1];
      return {
        RequestRoanDetail,
        master
      };
    }));
  }
}
