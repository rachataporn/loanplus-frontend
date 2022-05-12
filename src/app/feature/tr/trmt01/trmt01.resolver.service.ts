import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trmt01Service, Tracking } from './trmt01.service';

@Injectable()
export class Trmt01Resolver implements Resolve<any> {
  constructor(private sv: Trmt01Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const trackingItemId = route.paramMap.get('trackingItemId');
    const TrackingDetail = trackingItemId ? this.sv.getSearchEdit(trackingItemId) : of({} as Tracking);

    return forkJoin(
      TrackingDetail,

    ).pipe(map((result) => {
      let TrackingDetail = result[0];
      return {
        TrackingDetail,

      };
    }));
  }
}