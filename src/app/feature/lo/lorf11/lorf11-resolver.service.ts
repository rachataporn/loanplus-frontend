import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorf11Service } from './lorf11.service';

@Injectable()
export class Lorf11Resolver implements Resolve<any> {
  constructor(private ls: Lorf11Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.ls.getMaster();
    return master;
  }
}
