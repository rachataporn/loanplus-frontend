import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots19Service, Disbursement } from './lots19.service';
@Injectable()
export class Lots19Resolver implements Resolve<any> {
  constructor(private sv: Lots19Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    
    const url: string = route.url.join('/');

    if (url.includes('detail')) {
        const TrackingDocumentId = route.paramMap.get('TrackingDocumentId');
        const TrackingDocumentId21 = route.paramMap.get('TrackingDocumentId21');
      let master = this.sv.getMaster();
      const company = this.sv.getCompany();
      
      const disDetail = TrackingDocumentId ? this.sv.getSearchEdit(TrackingDocumentId) : of({} as Disbursement);
      const newTracking = TrackingDocumentId21 ? this.sv.getNewContractDetail(TrackingDocumentId21) : of({} as Disbursement) ;
      
      return forkJoin(
        master,
        disDetail,
        company,
        newTracking
      ).pipe(map((result) => {
        let master = result[0];
        let disDetail = result[1];
        let company = result[2];
        let newTracking = result[3];
        return {
          master,
          disDetail,
          company,
          newTracking
        };
      }));
    } else {
      let master = this.sv.getMaster();
      return master;
    }
  }
}
