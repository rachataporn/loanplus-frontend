import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Lorp08Service } from './lorp08.service';

@Injectable()
export class Lorp08Resolver implements Resolve<any> {
  constructor(private Lorp08Service : Lorp08Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.Lorp08Service.getMaster();
      return master;
  }
}  


