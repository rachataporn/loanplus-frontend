import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt07Service, Information } from './lomt07.service';
@Injectable()
export class Lomt07Resolver implements Resolve<any> {
  constructor(private service: Lomt07Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const InformationId = route.paramMap.get('InformationId');
    const InformationDetail = InformationId ? this.service.getDetail(InformationId) : of({} as Information);
    return forkJoin(
      InformationDetail
    ).pipe(map((result) => {
      const informationDetailList = result[0];
      return {
        informationDetailList,
      };
    }));
  }
}
