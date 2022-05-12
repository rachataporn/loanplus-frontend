import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Trrp05Service } from './trrp05.service';
@Injectable()
export class Trrp05Resolver implements Resolve<any> {
  constructor(private ls: Trrp05Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
