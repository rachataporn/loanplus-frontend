import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt03Service, PeriodMaster } from './lomt03.service';
@Injectable()
export class Lomt03Resolver implements Resolve<any> {
  constructor(private Lomt03Service: Lomt03Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const YearList = this.Lomt03Service.getYear();
    return forkJoin(
      YearList
      ).pipe(map((result) => {
      const YearList = result[0];
      return {
        YearList,
      };
    }));
  }
}
