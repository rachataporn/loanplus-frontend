import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp50Service } from './lorp50.service';
@Injectable()
export class Lorp50Resolver implements Resolve<any> {
  constructor(private ls: Lorp50Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
