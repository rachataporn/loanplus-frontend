import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp38Service } from './lorp38.service';
@Injectable()
export class Lorp38Resolver implements Resolve<any> {
  constructor(private ls: Lorp38Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
