import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp20Service } from './lorp20.service';
@Injectable()
export class Lorp20Resolver implements Resolve<any> {
  constructor(private Lorp20Service: Lorp20Service) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.Lorp20Service.getMaster();
    return master;
  }
 
}
