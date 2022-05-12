import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp41Service } from './lorp41.service';
@Injectable()
export class Lorp41Resolver implements Resolve<any> {
  constructor(private js: Lorp41Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.js.getMaster();
    return master;

  }
}
