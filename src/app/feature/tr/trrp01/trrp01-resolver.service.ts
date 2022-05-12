import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trrp01Service } from './trrp01.service';
@Injectable()
export class Trrp01Resolver implements Resolve<any> {
  constructor(private ls: Trrp01Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}

