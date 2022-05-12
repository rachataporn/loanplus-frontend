import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots23Service, SecuritiesOwner } from './lots23.service';
@Injectable()
export class Lots23Resolver implements Resolve<any> {
  constructor(private sv: Lots23Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    
    const url: string = route.url.join('/');

    if (url.includes('detail')) {
      const SecuritiesOwnerDeadId = route.paramMap.get('SecuritiesOwnerDeadId');
      let master = this.sv.getMaster();
      const company = this.sv.getCompany();
      const securitiesOwnerDeadDetail = SecuritiesOwnerDeadId ? this.sv.getSearchEdit(SecuritiesOwnerDeadId) : of({} as SecuritiesOwner);
      
      return forkJoin(
        master,
        company,
        securitiesOwnerDeadDetail
      ).pipe(map((result) => {
        let master = result[0];
        let company = result[1];
        let securitiesOwnerDeadDetail = result[2];
        return {
          master,
          company
          ,securitiesOwnerDeadDetail
        };
      }));
    } else {
      let master = this.sv.getMaster();
      return master;
    }
  }
}
