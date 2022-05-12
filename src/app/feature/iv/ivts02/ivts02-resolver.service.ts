import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ivts02Service } from './ivts02.service';
@Injectable()
export class Ivts02Resolver implements Resolve<any> {
  constructor(private js: Ivts02Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    return null;

  }
}
