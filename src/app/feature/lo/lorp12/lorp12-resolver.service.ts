import { Injectable } from "@angular/core";
import { Observable, forkJoin, of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Lorp12Service } from "./lorp12.service";

@Injectable()
export class Lorp12Resolver implements Resolve<any> {
  constructor(private Lorp12Service:  Lorp12Service) { }
  
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const master = this.Lorp12Service.getMaster();
    return master;
  }
}
