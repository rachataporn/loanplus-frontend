import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots25BService, ContractHead } from './lots25B.service';


@Injectable()
export class Lots25BResolver implements Resolve<any> {
    constructor(private router: Router, private lots25B: Lots25BService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const url: string = route.url.join('/');
        if (url.includes('detail')) {
            const id = route.paramMap.get('id');
            const backToPage = route.paramMap.get('backToPage');

            const ofBackToPage = of({ backToPage: backToPage });
            const master = this.lots25B.getContractManageMasterDetail(id);
            const detail = this.lots25B.getContractManageGetDetail(id , null);

            return forkJoin(
                master,
                detail,
                ofBackToPage,
            ).pipe(map((result) => {
                let master = result[0];
                let detail = result[1];
                let ofBackToPage = result[2];
                
                return { master, detail, ofBackToPage }
            }))

        } else {
            let master = this.lots25B.getMaster(false);
            return master;
        }
    }
}