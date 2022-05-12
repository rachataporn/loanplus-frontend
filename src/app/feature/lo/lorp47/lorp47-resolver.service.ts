import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp47Service } from './lorp47.service';
@Injectable()
export class Lorp47Resolver implements Resolve<any> {
  constructor(private js: Lorp47Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.js.getMaster();
    return master;

  }
}
