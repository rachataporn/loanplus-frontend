import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { DashboardService, ContractForm } from './dashboard.service';
import { map } from 'rxjs/operators';

@Injectable()
export class DashboardResolver implements Resolve<any> {
    constructor(private ds: DashboardService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {

        //const master = this.ds.getMaster();
        const company = this.ds.getCompany();  
        const approvePermission = this.ds.getApprovePermission();     
        
        return forkJoin(
            //master,
            company,
            approvePermission,
            // contractsHistory
        ).pipe(map((result) => {
            //let master = result[0];
            let company = result[0];
            let approvePermission = result[1];
            return { company, approvePermission }
        }))
    }
}