import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots20Service, PackageDetail, Package, TrackingDoc } from './lots20.service';
@Injectable()
export class Lots20Resolver implements Resolve<any> {
  constructor(private sv: Lots20Service) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const url: string = route.url.join('/');
    if (url.includes('detail')) {
      const TrackingDocumentPackageId = route.paramMap.get('TrackingDocumentPackageId');
      let master = this.sv.getMaster();
      const company = this.sv.getCompany();
      const packageDetail = TrackingDocumentPackageId ? this.sv.getSearchEdit(TrackingDocumentPackageId) : of({} as Package);
      
      return forkJoin(
        master,
        company,
        packageDetail,
      ).pipe(map((result) => {
        let master = result[0];
        let company = result[1];
        let packageDetail = result[2];
        return {
          master,
          company,
          packageDetail
        };
      }));
    } else {
      let master = this.sv.getMaster();
      return master;
    }
  }
}
