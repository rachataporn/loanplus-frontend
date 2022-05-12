import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbmt09Service, Country } from './dbmt09.service';
@Injectable()
export class Dbmt09Resolver implements Resolve<any> {
  constructor(private dbmt09Service: Dbmt09Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const CountryCode = route.paramMap.get('CountryCode');
    const CountryDetail = CountryCode ? this.dbmt09Service.getDetail(CountryCode) : of({} as Country);
    
    return forkJoin(
      CountryDetail

      ).pipe(map((result) => {
      const CountryDetail = result[0];

      return {
        CountryDetail
      };
    }));
  }
}
