import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trrp02Service } from './trrp02.service';
@Injectable()
export class Trrp02Resolver implements Resolve<any> {
  constructor(private trts02Service: Trrp02Service) { }

  resolve(): Observable<any> {
    let master = this.trts02Service.getMaster();
    return forkJoin(
      master,
    ).pipe(map((result) => {
      let master = result[0];
      return {
        master,
      };
    }));
  }
}
