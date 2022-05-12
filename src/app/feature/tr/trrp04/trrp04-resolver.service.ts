import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Trrp04Service } from './trrp04.service';
@Injectable()
export class Trrp04Resolver implements Resolve<any> {
  constructor(private ls: Trrp04Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
