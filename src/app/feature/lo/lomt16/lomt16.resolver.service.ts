import { Injectable } from "@angular/core";

import { Observable, forkJoin, of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Lomt16Service, Company } from "./lomt16.service";

@Injectable()
export class Lomt16Resolver implements Resolve<any> {
  constructor(private Lomt16Service:  Lomt16Service) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.Lomt16Service.getMaster();
    return forkJoin(
      master
  ).pipe(map((result) => {
      let master = result[0];
      return { master} //detail }
  }))
  }
}