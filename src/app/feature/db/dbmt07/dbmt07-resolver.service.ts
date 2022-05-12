
import { Injectable } from "@angular/core";
import { Observable, forkJoin, of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot} from '@angular/router';
import { map } from 'rxjs/operators';
import { AlertService } from "@app/core";
import { Dbmt07Service, Employee} from "./dbmt07.service";

@Injectable()
export class Dbmt07Resolver implements Resolve<any> {
  constructor(private dbmt07Service:  Dbmt07Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const CompanyCode = route.paramMap.get('CompanyCode');
    const EmployeeCode = route.paramMap.get('EmployeeCode');
    const master = this.dbmt07Service.getMaster();

   const detail =  EmployeeCode  ? this.dbmt07Service.getEmployeeDetail(CompanyCode, EmployeeCode) : of({} as Employee)
    return forkJoin(
       master,     
      detail
  )
  .pipe(map((result) => {
      let master  = result[0];
     let detail = result[1];
      return {master,detail}
  }))
  
}
}


