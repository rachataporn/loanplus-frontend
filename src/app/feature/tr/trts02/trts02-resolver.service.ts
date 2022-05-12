import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trts02Service, Tracking } from './trts02.service';
@Injectable()
export class Trts02Resolver implements Resolve<any> {
  constructor(private trts02Service: Trts02Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const TrackingId = route.paramMap.get('TrackingId');
    let master = this.trts02Service.getMaster();
    const company = this.trts02Service.getCompany();
    const TrackingDetail = TrackingId ? this.trts02Service.getSearchEdit(TrackingId) : of({} as Tracking);

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
