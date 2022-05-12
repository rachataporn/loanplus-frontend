import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sumt08Service, Parameter} from './sumt08.service';
 
@Injectable()
export class Sumt08Resolver implements Resolve<any> {
    constructor(private router: Router,private ss: Sumt08Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const ParameterGroupCode = route.paramMap.get('ParameterGroupCode');
        const ParameterCode = route.paramMap.get('ParameterCode');
        const groupParameter = this.ss.getGroupParameter();
        const parameterDetail = ParameterGroupCode && ParameterCode ? this.ss.getProgramDetail(ParameterGroupCode, ParameterCode) : of({} as Parameter);

        return forkJoin(
            groupParameter,
            parameterDetail
        ).pipe(map((result) => {
            let groupParameter = result[0];
            let parameterDetail = result[1];
            return {
                parameterDetail, 
                groupParameter
            } 
        }))
    }
}