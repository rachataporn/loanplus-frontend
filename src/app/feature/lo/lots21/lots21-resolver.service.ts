import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots21Service, PackageDetail, Package } from './lots21.service';
@Injectable()
export class Lots21Resolver implements Resolve<any> {
  constructor(private sv: Lots21Service) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const url: string = route.url.join('/');
    if (url.includes('detail')) {
      const TrackingDocumentPackageId = route.paramMap.get('TrackingDocumentPackageId');
      const TrackingDocumentId = route.paramMap.get('TrackingDocumentId');
      const id = route.paramMap.get('id');

      let master = this.sv.getMaster();
      const company = this.sv.getCompany();
      const packageDetail = TrackingDocumentPackageId ? this.sv.getSearchEdit(TrackingDocumentPackageId) : of({} as Package);
      const detail = this.sv.getLoanAgreementDetail(id);
      const status = TrackingDocumentId ? this.sv.getCheckStatus(TrackingDocumentId): of({});

      return forkJoin(
        master,
        company,
        packageDetail,
        detail,
        status
      ).pipe(map((result) => {
        let master = result[0];
        let company = result[1];
        let packageDetail = result[2];
        let detail = result[3];
        let status = result[4];
        return {
          master,
          company,
          packageDetail,
          detail,
          status
        };
      }));
    } else {
      let master = this.sv.getMaster();
      return master;
    }
  }
}
