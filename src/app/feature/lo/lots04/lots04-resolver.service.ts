import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots04Service } from './lots04.service';

 
@Injectable()
export class Lots04Resolver implements Resolve<any> {
    constructor(private router: Router,private lots04: Lots04Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const ContractNo  = route.paramMap.get('ContractNo');
        const master = this.lots04.getMaster();
        const detail = this.lots04.getContractDetail(null , ContractNo);
        return forkJoin(
            master,
            detail
        ).pipe(map((result) => {
            let master = result[0];
            let detail = result[1];
            return { master, detail }
        }))
    }
}