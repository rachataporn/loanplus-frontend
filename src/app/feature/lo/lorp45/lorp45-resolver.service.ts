import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp45Service } from './lorp45.service';
@Injectable()
export class Lorp45Resolver implements Resolve<any> {
  constructor(private ls: Lorp45Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
