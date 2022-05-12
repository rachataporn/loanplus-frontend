import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp42Service } from './lorp42.service';
@Injectable()
export class Lorp42Resolver implements Resolve<any> {
  constructor(private ls: Lorp42Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    // const master = this.ls.getMaster();
    return null;
  }
}
