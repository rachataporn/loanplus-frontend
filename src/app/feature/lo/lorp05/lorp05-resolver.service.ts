import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp05Service } from './lorp05.service';
@Injectable()
export class Lorp05Resolver implements Resolve<any> {
  constructor(private Lorp05Service: Lorp05Service) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.Lorp05Service.getMaster();
    return master;
  }

  
}
