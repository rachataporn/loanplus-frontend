import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorf02Service } from './lorf02.service';
@Injectable()
export class Lorf02Resolver implements Resolve<any> {
  constructor(private ls: Lorf02Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const FromContractNo  = route.paramMap.get('FromContractNo');
    const ToContractNo  = route.paramMap.get('ToContractNo');
    const master = this.ls.getMaster();
    return master;
  }
}
