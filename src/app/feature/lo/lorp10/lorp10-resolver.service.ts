import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp10Service } from './lorp10.service';
@Injectable()
export class Lorp10Resolver implements Resolve<any> {
  constructor(private js: Lorp10Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.js.getMaster();
    return master;
  }
}
