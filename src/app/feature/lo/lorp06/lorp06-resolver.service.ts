import { Injectable } from "@angular/core";

import { Observable, forkJoin, of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Lorp06Service } from "./lorp06.service";


@Injectable()
export class Lorp06Resolver implements Resolve<any> {
  constructor(private Lorp06Service:  Lorp06Service) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.Lorp06Service.getMaster();
    return master;
  }
}