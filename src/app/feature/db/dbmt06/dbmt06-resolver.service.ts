import { Injectable } from "@angular/core";
import { Dbmt06Service,  BankAccountType  } from "./dbmt06.service";
import { Observable, forkJoin, of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable()
export class Dbmt06Resolver implements Resolve<any> {
  constructor(private dbmt06Service:  Dbmt06Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const bankAccountTypeCode = route.paramMap.get('bankAccountTypeCode');
   
    const detail = bankAccountTypeCode ? this.dbmt06Service.getBankAccountTypeDetail(bankAccountTypeCode) : of({} as BankAccountType)
    return forkJoin(     
       detail
  ).pipe(map((result) => {
      
      let detail = result[0];
      return {detail} 
  }))
  
}
}