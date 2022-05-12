import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots27Service, Securities } from './lots27.service';
@Injectable()
export class Lots27Resolver implements Resolve<any> {
  constructor(private lots27Service: Lots27Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const SecuritiesCode = route.paramMap.get('SecuritiesCode');
    let master = this.lots27Service.getMaster();
    let province = this.lots27Service.getProvinceDDLQuery();
    const SecuritiesDetail = SecuritiesCode ? this.lots27Service.getSearchEdit(SecuritiesCode) : of({} as Securities);
    let brandCar = this.lots27Service.getBrandDDLQuery();
    let brandMotorcycle = this.lots27Service.getBrandMotorcycleDDLQuery();
    return forkJoin(
      SecuritiesDetail,
      master,
      province,
      brandCar,
      brandMotorcycle
    ).pipe(map((result) => {
      let SecuritiesDetail = result[0];
      let master = result[1];
      let province = result[2];
      let brandCar = result[3];
      let brandMotorcycle = result[4];
      return {
        SecuritiesDetail,
        master,
        province,
        brandCar,
        brandMotorcycle
      };
    }));
  }
}
