import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sumt06Service, PasswordPolicy } from './sumt06.service';

@Injectable()
export class Sumt06Resolver implements Resolve<any> {
    [x: string]: any;
    constructor(private router: Router, private sumt06Service: Sumt06Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        const passwordPolicyCode = route.paramMap.get('PasswordPolicyCode');
        const PasswordPolicyDetail = passwordPolicyCode ? this.sumt06Service.updatePasswordPolicyList(passwordPolicyCode) : of({} as PasswordPolicy);
        return forkJoin(
            PasswordPolicyDetail,

        ).pipe(map((result) => {
            const PasswordPolicyDetail = result[0];

            return {
                PasswordPolicyDetail,
            }
        }))
    }
}