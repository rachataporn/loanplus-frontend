import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots03Service, ContractHead } from './lots03.service';


@Injectable()
export class Lots03Resolver implements Resolve<any> {
    constructor(private router: Router, private lots03: Lots03Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const url: string = route.url.join('/');
        if (url.includes('detail')) {
            const id = route.paramMap.get('id');
            const backToPage = route.paramMap.get('backToPage');

            const ofBackToPage = of({ backToPage: backToPage });
            const master = this.lots03.getMaster(true);
            const detail = this.lots03.getLoanAgreementDetail(id);

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
            let master = this.lots03.getMaster(false);
            return master;
        }
    }
}