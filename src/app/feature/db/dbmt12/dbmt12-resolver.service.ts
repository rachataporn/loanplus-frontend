import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbmt12Service, Position } from './dbmt12.service';
@Injectable()
export class Dbmt12Resolver implements Resolve<any> {
  constructor(private service: Dbmt12Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const PositionCode = route.paramMap.get('PositionCode');
    const PositionDetail = PositionCode ? this.service.getDetail(PositionCode) : of({} as Position);
    return forkJoin(
      PositionDetail
      ).pipe(map((result) => {
      const positionDetailList = result[0];
      return {
        positionDetailList,
      };
    }));
  }
}
