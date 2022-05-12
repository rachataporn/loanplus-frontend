import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbmt17Service, Country, PcmContractInfo } from './dbmt17.service';
@Injectable()
export class Dbmt17Resolver implements Resolve<any> {
  constructor(private dbmt17Service: Dbmt17Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const ContractDetail = this.dbmt17Service.getPcmContractDetail();
    return forkJoin(
      ContractDetail

    ).pipe(map((result) => {
      const ContractDetail = result[0];

      return {
        ContractDetail
      };
    }));
  }
}