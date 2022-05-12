import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp40Service } from './lorp40.service';
@Injectable()
export class Lorp40Resolver implements Resolve<any> {
  constructor(private ls: Lorp40Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
