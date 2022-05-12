import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trts06Service, Tracking } from './trts06.service';
@Injectable()
export class Trts06Resolver implements Resolve<any> {
  constructor(private trts06ervice: Trts06Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const TrackingId = route.paramMap.get('TrackingId');
    let master = this.trts06ervice.getMaster();
    const TrackingDetail = TrackingId ? this.trts06ervice.getSearchEdit(TrackingId) : of({} as Tracking);

    return forkJoin(
      TrackingDetail,
      master
    ).pipe(map((result) => {
      let TrackingDetail = result[0];
      let master = result[1];
      return {
        TrackingDetail,
        master
      };
    }));
  }
}
