import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp49Service } from './lorp49.service';
@Injectable()
export class Lorp49Resolver implements Resolve<any> {
  constructor(private ls: Lorp49Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
