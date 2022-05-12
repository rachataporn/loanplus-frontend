import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt06Service, Group } from './lomt06.service';
@Injectable()
export class Lomt06Resolver implements Resolve<any> {
  constructor(private lomt06Service: Lomt06Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const GroupCode = route.paramMap.get('GroupCode');
    const GroupDetail = GroupCode ? this.lomt06Service.getDetail(GroupCode) : of({} as Group);
    
    return forkJoin(
      GroupDetail

      ).pipe(map((result) => {
      const GroupDetail = result[0];

      return {
        GroupDetail
      };
    }));
  }
}
