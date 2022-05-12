import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots10Service } from './lots10.service';
 
@Injectable()
export class Lots10Resolver implements Resolve<any> {
    constructor(private router: Router,private lots10: Lots10Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        const master = this.lots10.getMaster();
        return master;
    }
}