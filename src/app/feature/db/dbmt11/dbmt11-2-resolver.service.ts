import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbmt112Service, SubDistrict } from './dbmt11-2.service';
@Injectable()
export class Dbmt112Resolver implements Resolve<any> {
  constructor(private dbmt112Service: Dbmt112Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const ProvinceId = route.paramMap.get('ProvinceId');
    const DistrictId = route.paramMap.get('DistrictId');
    const inPageOpen = route.paramMap.get('inPageOpen');
    const SubDistrictId = route.paramMap.get('SubDistrictId');
    const SubDistrictDetail = ProvinceId && DistrictId ? this.dbmt112Service.getInPageSubDistrictDetail(ProvinceId, DistrictId, SubDistrictId) : of({} as SubDistrict);

    return forkJoin(
      SubDistrictDetail,
      ProvinceId, 
      DistrictId,
      inPageOpen
      ).pipe(map((result) => {
      const SubDistrictDetail = result[0];
      return {
        SubDistrictDetail,
        ProvinceId,
        DistrictId,
        inPageOpen
      };
    }));
  }
}
