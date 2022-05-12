import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots26Service } from './lots26.service';

@Injectable()
export class Lots26Resolver implements Resolve<any> {
    constructor(private lots26: Lots26Service) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const url: string = route.url.join('/');
        if (url.includes('detail')) {
            const master = this.lots26.getMaster(true);
            
            return forkJoin(
                master,
            ).pipe(map((result) => {
                let master = result[0];
                return { master }
            }))

        } else {
            let master = this.lots26.getMaster(false);
            return master;
        }
    }
}