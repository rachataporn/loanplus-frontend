import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sumt07Service, User } from './sumt07.service';
 
@Injectable()
export class Sumt07Resolver implements Resolve<any> {
  constructor(private router: Router,private ss: Sumt07Service) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
     const UserId = route.paramMap.get('UserId');
    const UserDetail = UserId ? this.ss.getUser(UserId) : of({ Profiles:[],Permissions : [] } as User);
    const Master = this.ss.getMaster();
    return forkJoin(
         Master,
         UserDetail
      ).pipe(map((result) => {
        let master = result[0];
        let userDetail = result[1];
        return {master,userDetail }
    }))
}
}