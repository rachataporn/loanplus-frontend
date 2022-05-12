import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
 
import { ResetService }from './reset.service';
import { mergeMap } from 'rxjs/operators';
@Injectable()
export class ResetResolver implements Resolve<any> {
    constructor(private router: Router,private rs:ResetService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
        
        const userId = route.paramMap.get('id');
        const token = route.queryParamMap.get('code');
        return this.rs.getPolicy(userId).pipe(
            mergeMap(
                val=>{
                    if(val){
                        val =  Object.assign(val,{ Code : decodeURIComponent(token),UserId:userId })
                        return of(val);
                    }
                    else{
                        this.router.navigate(['/login']);
                        return EMPTY;
                    }
                }
            )
        )
    }
}