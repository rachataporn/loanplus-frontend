import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbmt18Service, Country, Faq } from './dbmt18.service';
@Injectable()
export class Dbmt18Resolver implements Resolve<any> {
  constructor(private dbmt18Service: Dbmt18Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const Id = route.paramMap.get('Id');
    const FaqDetail = Id ? this.dbmt18Service.getFaqDetail(Id) : of({} as Faq);

    return forkJoin(
      FaqDetail

    ).pipe(map((result) => {
      const FaqDetail = result[0];

      return {
        FaqDetail
      };
    }));
  }
}