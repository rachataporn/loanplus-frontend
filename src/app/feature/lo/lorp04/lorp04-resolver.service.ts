import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp04Service } from './lorp04.service';
@Injectable()
export class Lorp04Resolver implements Resolve<any> {
  constructor(private ls: Lorp04Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const master = this.ls.getMaster();
    return master;

  }
}
