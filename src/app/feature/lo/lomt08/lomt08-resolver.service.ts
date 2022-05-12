import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt08Service, InvoiceItem } from './lomt08.service';
@Injectable()
export class Lomt08Resolver implements Resolve<any> {
  constructor(private lomt08Service: Lomt08Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
     const InvoiceItemCode = route.paramMap.get('InvoiceItemCode');
    const InvoiceItemDetail = InvoiceItemCode ? this.lomt08Service.getDetail(InvoiceItemCode) : of({} as InvoiceItem);
    
    return forkJoin(
      InvoiceItemDetail
      ).pipe(map((result) => {
      const InvoiceItemDetail = result[0];
      return {
        InvoiceItemDetail
      };
    }));
  }
}
