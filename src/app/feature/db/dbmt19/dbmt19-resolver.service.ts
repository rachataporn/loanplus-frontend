import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbmt19Service, Country , Banner } from './dbmt19.service';
@Injectable()
export class Dbmt19Resolver implements Resolve<any> {
  constructor(private dbmt19Service: Dbmt19Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const Id = route.paramMap.get('Id');
    const BannerDetail = Id ? this.dbmt19Service.getBannerDetail(Id) : of({} as Banner);
    
    return forkJoin(
      BannerDetail

      ).pipe(map((result) => {
      const BannerDetail = result[0];

      return {
        BannerDetail
      };
    }));
  }
}