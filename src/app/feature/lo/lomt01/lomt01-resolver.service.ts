import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt01Service, SecuritiesCategory } from './lomt01.service';
@Injectable()
export class Lomt01Resolver implements Resolve<any> {
  constructor(private lomt01Service: Lomt01Service) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const categoryId = route.paramMap.get('CategoryId');
    const master = this.lomt01Service.getMaster();
    const SecuritiesCategory = categoryId ? this.lomt01Service.getSecuritiesCategoryDetail(categoryId) : of({ securitiesAttribute: [] } as SecuritiesCategory);

    return forkJoin(
      master,
      SecuritiesCategory
    ).pipe(map((result) => {
      const master = result[0];
      const SecuritiesCategory = result[1];
      return {
        master,
        SecuritiesCategory
      };
    }));
  }
}
