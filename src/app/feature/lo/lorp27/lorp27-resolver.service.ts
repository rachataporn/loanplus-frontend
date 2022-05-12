import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp27Service } from './lorp27.service';

@Injectable()
export class Lorp27Resolver implements Resolve<any> {
  constructor(private js: Lorp27Service) { }

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
