import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp35Service } from './lorp35.service';
@Injectable()
export class Lorp35Resolver implements Resolve<any> {
  constructor(private ls: Lorp35Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
