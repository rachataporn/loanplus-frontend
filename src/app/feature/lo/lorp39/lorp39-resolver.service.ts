import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp39Service } from './lorp39.service';
@Injectable()
export class Lorp39Resolver implements Resolve<any> {
  constructor(private ls: Lorp39Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
