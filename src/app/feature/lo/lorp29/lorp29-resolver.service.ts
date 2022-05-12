import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Lorp29Service } from './lorp29.service';
@Injectable()
export class Lorp29Resolver implements Resolve<any> {
  constructor(private ls: Lorp29Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
