import { Injectable } from "@angular/core";

import { Observable, forkJoin, of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Sumt01Service, Company } from "./sumt01.service";

@Injectable()
export class Sumt01Resolver implements Resolve<any> {
  constructor(private Sumt01Service:  Sumt01Service) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const companyCode = route.paramMap.get('companyCode');
    const master = this.Sumt01Service.getMaster();
    const detail = companyCode ? this.Sumt01Service.getCompanyDetail(companyCode) : of({} as Company)
    return forkJoin(
      master,
       detail
  ).pipe(map((result) => {
      let master = result[0];
      let detail = result[1];
      return {detail, master,} //detail }
  }))
  }
}