import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp33Service } from './lorp33.service';
@Injectable()
export class Lorp33Resolver implements Resolve<any> {
  constructor(private ls: Lorp33Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const company = this.ls.getCompany();
    return company;
  }
}
