import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trts03Service, Tracking } from './trts03.service';
@Injectable()
export class Trts03Resolver implements Resolve<any> {
  constructor(private trts03ervice: Trts03Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const TrackingId = route.paramMap.get('TrackingId');
    let master = this.trts03ervice.getMaster(TrackingId);
    const company = this.trts03ervice.getCompany();
    const TrackingDetail = TrackingId ? this.trts03ervice.getSearchEdit(TrackingId) : of({} as Tracking);

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
