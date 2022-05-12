import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbmt10Service, Province } from './dbmt10.service';
@Injectable()
export class Dbmt10Resolver implements Resolve<any> {
  constructor(private dbmt10Service: Dbmt10Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const ProvinceId = route.paramMap.get('ProvinceId');
    const ProvinceDetail = ProvinceId ? this.dbmt10Service.getDetail(ProvinceId) : of({} as Province);
    const CountryList = this.dbmt10Service.getCountryList();
    return forkJoin(
      ProvinceDetail,
      CountryList,
      ).pipe(map((result) => {
      const ProvinceDetail = result[0];
      const CountryList = result[1];
      return {
        ProvinceDetail,
        CountryList,
      };
    }));
  }
}
