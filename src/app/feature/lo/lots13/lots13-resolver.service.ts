import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots13Service, Securities } from './lots13.service';
@Injectable()
export class Lots13Resolver implements Resolve<any> {
  constructor(private lots13Service: Lots13Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const SecuritiesCode = route.paramMap.get('SecuritiesCode');
    let master = this.lots13Service.getMaster();
    let province = this.lots13Service.getProvinceDDLQuery();
    const SecuritiesDetail = SecuritiesCode ? this.lots13Service.getSearchEdit(SecuritiesCode) : of({} as Securities);
    let brandCar = this.lots13Service.getBrandDDLQuery();
    let brandMotorcycle = this.lots13Service.getBrandMotorcycleDDLQuery();
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
