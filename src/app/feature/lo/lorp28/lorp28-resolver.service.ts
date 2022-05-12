import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp28Service } from './lorp28.service';
@Injectable()
export class Lorp28Resolver implements Resolve<any> {
  constructor(private ls: Lorp28Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
