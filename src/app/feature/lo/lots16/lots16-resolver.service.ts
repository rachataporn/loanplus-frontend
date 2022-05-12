import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots16Service, Mgm } from './lots16.service';
@Injectable()
export class Lots16Resolver implements Resolve<any> {
  constructor(private sv: Lots16Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const url: string = route.url.join('/');
    if (url.includes('detail')) {
        const MgmCode = route.paramMap.get('MgmCode');
      let master = this.sv.getMaster(true);
      const mgmDetail = MgmCode ? this.sv.getMgmDetail(MgmCode) : of({} as Mgm);
      return forkJoin(
        master,
        mgmDetail,
      ).pipe(map((result) => {
        let master = result[0];
        let mgmDetail = result[1];
        return {
          master,
          mgmDetail,
        };
      }));
    } else {
      let master = this.sv.getMaster(false);
      return master;
    }
  }
}
