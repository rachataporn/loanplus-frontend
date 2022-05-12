import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots28Service } from './lots28.service';
 
@Injectable()
export class Lots28Resolver implements Resolve<any> {
    constructor(private router: Router,private lots28: Lots28Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const master = this.lots28.getMaster();
        return forkJoin(
            master,
        ).pipe(map((result) => {
            let master = result[0];
            return { master }
        }))
    }
}