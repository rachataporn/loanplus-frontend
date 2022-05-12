import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorf01Service } from './lorf01.service';
@Injectable()
export class Lorf01Resolver implements Resolve<any> {
  constructor(private ls: Lorf01Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const ContractNo  = route.paramMap.get('ContractNo');
    const master = this.ls.getMaster();
    return master;
  }
}
