import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots06Service } from './lots06.service';
 
@Injectable()
export class Lots06Resolver implements Resolve<any> {
    constructor(private router: Router,private lots06: Lots06Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const ContractNo  = route.paramMap.get('ContractNo');
        const master = this.lots06.getMaster();
        return master;
    }
}