import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trts01Service, Tracking } from './trts01.service';
@Injectable()
export class Trts01Resolver implements Resolve<any> {
  constructor(private sv: Trts01Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const TrackingId = route.paramMap.get('TrackingId');
    let master = this.sv.getMaster();
    const company = this.sv.getCompany();
    const TrackingDetail = TrackingId ? this.sv.getSearchEdit(TrackingId) : of({} as Tracking);

    return forkJoin(
      TrackingDetail,
      master,
      company
    ).pipe(map((result) => {
      let TrackingDetail = result[0];
      let master = result[1];
      let company = result[2];
      return {
        TrackingDetail,
        master,
        company
      };
    }));
  }
}
