import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt14Service, CarPrice } from './lomt14.service';
@Injectable()
export class Lomt14Resolver implements Resolve<any> {
  constructor(private lomt14Service: Lomt14Service) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const url: string = route.url.join('/');
    if (url.includes('detail')) {
      const master = this.lomt14Service.getMaster();
      const carId = route.paramMap.get('CarId');
      const detail = carId ? this.lomt14Service.getDetail(carId).pipe() : of({} as CarPrice);
      return forkJoin(
        detail
        , master
      ).pipe(map((result) => {
        const detail = result[0];
        const master = result[1];
        return {
          detail
          , master
        };
      }));

    } else {
      const master = this.lomt14Service.getMaster();
      return forkJoin(
        master
      ).pipe(map((result) => {
        const master = result[0];
        return {
          master
        };
      }));

    }

  }
}
