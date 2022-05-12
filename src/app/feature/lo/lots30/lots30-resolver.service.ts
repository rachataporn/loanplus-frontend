import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CashSubmitHead, Lots30Service } from './lots30.service';

@Injectable()
export class Lots30Resolver implements Resolve<any> {
    constructor(private router: Router, private lots30Service: Lots30Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const url: string = route.url.join('/');
        const company = this.lots30Service.getCompany();

        if (url.includes('detail')) {
            let master = this.lots30Service.getMaster(true);
            const CashSubmitHeadId = route.paramMap.get('CashSubmitHeadId');
            const CashSubmitDetail = this.lots30Service.getCashSubmitDetail(CashSubmitHeadId);

            return forkJoin(
                CashSubmitDetail,
                master,
                company,
            ).pipe(map((result) => {
                let CashSubmitDetail = result[0];
                let master = result[1];
                let company = result[2]
                return {
                    CashSubmitDetail,
                    master,
                    company
                };
            }));
        } else {
            let master = this.lots30Service.getMaster(false);
            return forkJoin(
                company,
                master,
            ).pipe(map((result) => {
                let company = result[0];
                let master = result[1];
                return { company, master }
            }))
        }
    }
}