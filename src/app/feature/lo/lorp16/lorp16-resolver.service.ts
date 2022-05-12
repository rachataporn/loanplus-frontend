import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp16Service } from './lorp16.service';
@Injectable()
export class Lorp16Resolver implements Resolve<any> {
  constructor(private js: Lorp16Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.js.getMaster();
    return master;
  }
}
