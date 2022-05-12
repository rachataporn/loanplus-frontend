import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots18Service } from './lots18.service';


@Injectable()
export class Lots18Resolver implements Resolve<any> {
    constructor(private router: Router, private lots18: Lots18Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const master = this.lots18.getMaster();

        return forkJoin(
            master,
        ).pipe(map((result) => {
            let master = result[0];
            return { master }
        }))
    }
}