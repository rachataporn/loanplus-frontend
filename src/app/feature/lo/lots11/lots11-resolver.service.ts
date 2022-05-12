import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Lots11Service } from './lots11.service';


@Injectable()
export class Lots11Resolver implements Resolve<any> {
    constructor(private ts: Lots11Service) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
            const master = this.ts.getMaster();
            return master;
    }
}