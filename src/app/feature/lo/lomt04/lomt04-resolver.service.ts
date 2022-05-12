import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt04Service, ReceiveType } from './lomt04.service';
@Injectable()
export class Lomt04Resolver implements Resolve<any> {
  constructor(private service: Lomt04Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const ReceiveTypeCode = route.paramMap.get('ReceiveTypeCode');
    const ReceiveTypeDetail = ReceiveTypeCode ? this.service.getDetail(ReceiveTypeCode) : of({} as ReceiveType);
    return forkJoin(
      ReceiveTypeDetail
    ).pipe(map((result) => {
      const receiveTypeDetailList = result[0];
      return {
        receiveTypeDetailList,
      };
    }));
  }
}
