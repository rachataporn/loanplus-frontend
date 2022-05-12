
import { Injectable } from "@angular/core";
import { Observable, forkJoin, of } from "rxjs";
import { Resolve, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Dbmt08Service, Prefix } from "./dbmt08.service";
import { AlertService } from "@app/core";

@Injectable()
export class Dbmt08Resolver implements Resolve<any> {
  constructor(private dbmt08Service:  Dbmt08Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const PrefixId = route.paramMap.get('PrefixId');
    const master = this.dbmt08Service.getMaster();
    const detail =  PrefixId  ? this.dbmt08Service.getPrefixDetail(PrefixId) : of({} as Prefix)
    
    return forkJoin(
        master,     
       detail
  ).pipe(map((result) => {
      let master  = result[0];
      let detail = result[1];
      return {master,detail } 
  }))
  
}
}

