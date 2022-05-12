import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots14Service, Securities } from './lots14.service';
@Injectable()
export class Lots14Resolver implements Resolve<any> {
  constructor(private lots14Service: Lots14Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const SecuritiesCode = route.paramMap.get('SecuritiesCode');
    let master = this.lots14Service.getMaster();
    let province = this.lots14Service.getProvinceDDLQuery();
    const SecuritiesDetail = SecuritiesCode ? this.lots14Service.getSearchEdit(SecuritiesCode) : of({} as Securities);
    let brandCar = this.lots14Service.getBrandDDLQuery();
    let brandMotorcycle = this.lots14Service.getBrandMotorcycleDDLQuery();
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
