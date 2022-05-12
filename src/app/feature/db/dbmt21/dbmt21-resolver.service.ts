import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbmt21Service, DbDepartmentNew } from './dbmt21.service';

@Injectable()
export class Dbmt21Resolver implements Resolve<any> {
  constructor(private router: Router,private ss: Dbmt21Service) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const DepartmentCode = route.paramMap.get('DepartmentCode');
    const DepartmentDetail = DepartmentCode ? this.ss.getDepartment(DepartmentCode) : of({ DbDepartmentCompany : [] } as DbDepartmentNew);
    const Master = this.ss.getMaster();
    return forkJoin(
         Master,
         DepartmentDetail
      ).pipe(map((result) => {
        let master = result[0];
        let DepartmentDetail = result[1];
        return {master,DepartmentDetail }
    }))
}
}
