import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots05Service } from './lots05.service';
 
@Injectable()
export class Lots05Resolver implements Resolve<any> {
    constructor(private router: Router,private lots05: Lots05Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const ContractNo  = route.paramMap.get('ContractNo');
        const master = this.lots05.getMaster();
        return master;
    }
}