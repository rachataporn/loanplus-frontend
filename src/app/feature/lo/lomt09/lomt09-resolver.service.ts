import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt09Service, Attribute } from './lomt09.service';
@Injectable()
export class Lomt09Resolver implements Resolve<any> {
  constructor(private lomt09Service: Lomt09Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    const detail = id ? this.lomt09Service.getAttributeDetail(id) : of({} as Attribute);
    const ddl = this.lomt09Service.getDDL();

    return forkJoin(
      detail,
      ddl
    ).pipe(map((result) => {
      const detail = result[0];
      const ddl = result[1];
      return {
        detail,
        ddl
      };
    }));
  }
}
