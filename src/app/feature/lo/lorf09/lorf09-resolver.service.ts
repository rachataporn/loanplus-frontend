import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorf09Service } from './lorf09.service';
@Injectable()
export class Lorf09Resolver implements Resolve<any> {
  constructor(private ls: Lorf09Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const FromContractNo  = route.paramMap.get('FromContractNo');
    const ToContractNo  = route.paramMap.get('ToContractNo');
    const master = this.ls.getMaster();
    return master;
  }
}
