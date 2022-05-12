import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp23Service } from './lorp23.service';
@Injectable()
export class Lorp23Resolver implements Resolve<any> {
  constructor(private js: Lorp23Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.js.getMaster();
    return forkJoin(
      master
    ).pipe(map((result) => {
      const master = result[0];
      // const mainMenu = result[1];
      // const programCode = result[2];
      // const language = result[3];
      // const menuDetail = result[4];
      return {
        master
      };
    }));

  }
}
