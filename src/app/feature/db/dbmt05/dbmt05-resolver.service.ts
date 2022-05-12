import { Injectable } from "@angular/core";
import { Dbmt05Service, Bank  } from "./dbmt05.service";
import { Observable, forkJoin, of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable()
export class Dbmt05Resolver implements Resolve<any> {
  constructor(private dbmt05Service:  Dbmt05Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const bankCode = route.paramMap.get('bankCode');
   // const detail = this.dbmt05Service.getBankDetail();
    const detail = bankCode ? this.dbmt05Service.getBankDetail(bankCode) : of({BankBranchs: []} as Bank)
  //const detail = programCode ? this.ss.getProgramDetail(programCode,'TH') : of({ ProgramLabels : [] } as Program);
    //return forkJoin();
    return forkJoin(     
       detail
  ).pipe(map((result) => {
      //let master = result[0];
      let detail = result[0];
      return {detail} //detail }
  }))
  
}
}