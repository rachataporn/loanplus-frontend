import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbmt20Service } from './dbmt20.service';
@Injectable()
export class Dbmt20Resolver implements Resolve<any> {
  constructor(private dbmt20Service: Dbmt20Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    //const Id = route.paramMap.get('Id');
    //const BannerDetail = Id ? this.dbmt20Service.getBannerDetail(Id) : of({} as Banner);
    
    return forkJoin(
      //BannerDetail

      ).pipe(map((result) => {
      //const BannerDetail = result[0];

      return {
        //BannerDetail
      };
    }));
  }
}