import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots24CService, ContractHead } from './lots24C.service';


@Injectable()
export class Lots24CResolver implements Resolve<any> {
    constructor(private router: Router, private lots24C: Lots24CService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const url: string = route.url.join('/');
        if (url.includes('detail')) {
            const id = route.paramMap.get('id');
            const OldContractId = route.paramMap.get('OldContractId');
            const backToPage = route.paramMap.get('backToPage');

            const ofBackToPage = of({ backToPage: backToPage });
            const master = this.lots24C.getContractManageMasterDetail(OldContractId,id);
            const detail = this.lots24C.getContractManageGetDetail(id , null);

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
            let master = this.lots24C.getMaster(false);
            return master;
        }
    }
}