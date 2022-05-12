import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sumt04Service, Menu } from './sumt04.service';

@Injectable()
export class Sumt04Resolver implements Resolve<any> {
    [x: string]: any;
    constructor(private router: Router, private sumt04Service: Sumt04Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        const MenuCode = route.paramMap.get('MenuCode');
        const Master = this.sumt04Service.getMaster();
        const MenuDetail = MenuCode ? this.sumt04Service.getMenuDetail(MenuCode) : of({} as Menu);
        return forkJoin(
            MenuDetail,
            Master

        ).pipe(map((result) => {
            const MenuDetail = result[0];
            const master = result[1];
            return {
                MenuDetail,master
            }
        }))
        
    }
}