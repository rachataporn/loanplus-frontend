import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trts07Service } from './trts07.service';
@Injectable()
export class Trts07Resolver implements Resolve<any> {
  constructor(private ls: Trts07Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const ContractNo  = route.paramMap.get('ContractNo');
    // const master = this.ls.getMaster();
    // return master;
    return null;
  }
}
