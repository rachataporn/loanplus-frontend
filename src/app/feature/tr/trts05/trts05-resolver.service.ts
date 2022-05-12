import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trts05Service, Tracking } from './trts05.service';
@Injectable()
export class Trts05Resolver implements Resolve<any> {
  constructor(private sv: Trts05Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const TrackingId = route.paramMap.get('TrackingId');
    const TrackingNo = route.paramMap.get('TrackingNo');
    let master = this.sv.getMaster();
    const company = this.sv.getCompany();
    const TrackingDetail = TrackingId && TrackingNo ? this.sv.getSearchEdit(TrackingId, TrackingNo) : of({} as Tracking);

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
