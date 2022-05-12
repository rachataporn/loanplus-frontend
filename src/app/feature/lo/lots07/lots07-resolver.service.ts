import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots07Service, LoInvoiceHead } from './lots07.service';
@Injectable()
export class Lots07Resolver implements Resolve<any> {
  constructor(private lots07Service: Lots07Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const InvoiceHeadId = route.paramMap.get('InvoiceHeadId');
    const ContractHeadId = route.paramMap.get('ContractHeadId');
    const InvoiceHead = InvoiceHeadId ? this.lots07Service.getInvoiceHead(InvoiceHeadId) :  of({InvoiceDetails : []} as LoInvoiceHead);
    const InvoicePeriodDdl = ContractHeadId? this.lots07Service.getInvoicePeriod(ContractHeadId) : of([]);
    let DataDefult: any;
    if (InvoiceHeadId == null) {
      DataDefult = this.lots07Service.getDataDefult();
    } else {
      DataDefult = "No Data Defult";
    }
    const InvoiceDDL = this.lots07Service.getInvoiceDDL(null);
    const Master = this.lots07Service.getMaster();
    return forkJoin(InvoiceDDL
                      , Master
                      , InvoiceHead
                      , DataDefult
                      , InvoicePeriodDdl
                    ).pipe(map((result) => {
      const invoiceDDL = result[0];
      const master = result[1];
      const invoiceHead = result[2];
      const dataDefult = result[3];
      const invoicePeriodDdl = result[4];
      return { 
        invoiceDDL,
        master,
        invoiceHead,
        dataDefult,
        invoicePeriodDdl
      };
    }));
  }
}
