import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbmt111Service, District } from './dbmt11-1.service';
@Injectable()
export class Dbmt111Resolver implements Resolve<any> {
  constructor(private dbmt111Service: Dbmt111Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const ProvinceId = route.paramMap.get('ProvinceId');
    const DistrictId = route.paramMap.get('DistrictId');
    const inPageOpen = route.paramMap.get('inPageOpen');
    
    const DistrictDetail = ProvinceId ? this.dbmt111Service.getInPageDistrictDetail(ProvinceId, DistrictId) : of({} as District);
    return forkJoin(
      DistrictDetail,
      ProvinceId,
      inPageOpen
    ).pipe(map((result) => {
      const DistrictDetail = result[0];
      return {
        DistrictDetail,
        ProvinceId,
        inPageOpen
      };
    }));
  }
}
