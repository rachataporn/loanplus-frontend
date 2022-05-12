import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApproveLoanService } from './approve_loan.service';
@Injectable()
export class ApproveLoanResolver implements Resolve<any> {
  constructor(private js: ApproveLoanService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const loanTypeDDL = this.js.getLoanTypeDDL();
    return forkJoin(
      loanTypeDDL
    ).pipe(map((result) => {
      const loanTypeDDL = result[0];
      return {
        loanTypeDDL
      };
    }));

    // return null;
  }
}
