import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots25AService, ContractHead } from './lots25A.service';


@Injectable()
export class Lots25AResolver implements Resolve<any> {
    constructor(private router: Router, private lots25A: Lots25AService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const url: string = route.url.join('/');
        if (url.includes('detail')) {
            const id = route.paramMap.get('id');
            const backToPage = route.paramMap.get('backToPage');

            const ofBackToPage = of({ backToPage: backToPage });
            const master = this.lots25A.getContractManageMasterDetail(id);
            const detail = this.lots25A.getContractManageGetDetail(id , null);

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
            let master = this.lots25A.getMaster(false);
            return master;
        }
    }
}