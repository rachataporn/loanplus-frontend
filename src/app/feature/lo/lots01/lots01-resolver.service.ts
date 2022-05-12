import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lots01Service, Customer } from './lots01.service';
import { Page } from '@app/shared';
@Injectable()
export class Lots01Resolver implements Resolve<any> {
  constructor(private lots01Service: Lots01Service) { }
  pageContractHead = new Page();
  pageBorrower = new Page();
  pageGuarantor = new Page();
  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const CustomerCode = route.paramMap.get('CustomerCode');
    const CustomerDetail = CustomerCode ? this.lots01Service.getCustomerDetail(CustomerCode) : of({} as Customer);
    const ContactBorrowList = CustomerCode ? this.lots01Service.getBorrower(CustomerCode, this.pageBorrower) : of({} as Customer);
    const ContactGuarantorList = CustomerCode ? this.lots01Service.getGuarantor(CustomerCode, this.pageGuarantor) : of({} as Customer);
    const Master = this.lots01Service.getMaster();
    const PhoneList = CustomerCode ? this.lots01Service.getPhone(CustomerCode, this.pageGuarantor) : of({} as Customer);
    return forkJoin(
      CustomerDetail,
      Master,
      ContactBorrowList,
      ContactGuarantorList,
      PhoneList
    ).pipe(map((result) => {
      const customerDetail = result[0];
      const master = result[1];
      const ContactBorrowList = result[2];
      const ContactGuarantorList = result[3];
      const PhoneList = result[4];
      return {
        customerDetail
        , master
        , ContactBorrowList
        , ContactGuarantorList
        , PhoneList
      };
    }));
  }
}
