import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lomt11Service, InvoiceItem } from './lomt11.service';
@Injectable()
export class Lomt11Resolver implements Resolve<any> {
  constructor(private Lomt11Service: Lomt11Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
     const InvoiceItemCode = route.paramMap.get('InvoiceItemCode');
    const InvoiceItemDetail = InvoiceItemCode ? this.Lomt11Service.getDetail(InvoiceItemCode) : of({} as InvoiceItem);
    
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
