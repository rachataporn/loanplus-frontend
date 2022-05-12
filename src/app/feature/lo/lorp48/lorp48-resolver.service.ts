import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp48Service } from './lorp48.service';
@Injectable()
export class Lorp48Resolver implements Resolve<any> {
  constructor(private ls: Lorp48Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
