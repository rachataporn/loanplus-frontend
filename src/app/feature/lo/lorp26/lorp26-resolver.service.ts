import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp26Service } from './lorp26.service';
@Injectable()
export class Lorp26Resolver implements Resolve<any> {
  constructor(private js: Lorp26Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.js.getMaster();
    return forkJoin(
      master
    ).pipe(map((result) => {
      const master = result[0];
      return {
        master
      };
    }));

  }
}
