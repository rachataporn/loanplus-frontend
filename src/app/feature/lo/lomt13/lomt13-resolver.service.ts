import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt13Service, MotorcyclePrice } from './lomt13.service';
@Injectable()
export class Lomt13Resolver implements Resolve<any> {
  constructor(private lomt13Service: Lomt13Service) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const url: string = route.url.join('/');
    if (url.includes('detail')) {
      const motorcycleId = route.paramMap.get('MotorcycleId');
      const detail = motorcycleId ? this.lomt13Service.getDetail(motorcycleId).pipe() : of({} as MotorcyclePrice);
      return forkJoin(
        detail
      ).pipe(map((result) => {
        const detail = result[0];
        return {
          detail
        };
      }));

    } else {
      const master = this.lomt13Service.getMaster();
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
