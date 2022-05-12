import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp37Service } from './lorp37.service';
@Injectable()
export class Lorp37Resolver implements Resolve<any> {
  constructor(private ls: Lorp37Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
