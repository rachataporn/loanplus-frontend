import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt15Service, Transport } from './lomt15.service';
@Injectable()
export class Lomt15Resolver implements Resolve<any> {
  constructor(private lomt15Service: Lomt15Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    const detail = id ? this.lomt15Service.getSearchDetail(id) : of({} as Transport);
    const ddl = this.lomt15Service.getDDL();

    return forkJoin(
      detail
      ,ddl
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
