import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface InvoiceItem {
 InvoiceItemCode : string ;
 InvoiceItemNameTha : string;
 InvoiceItemNameEng : string;
 InvoiceItemSequence : number;
 InvoiceItemPriority : number;
 Active : boolean;
 CreatedProgram: String;
 RowVersion: string;
}



@Injectable()
export class Lomt08Service {
  constructor(private http: HttpClient) { }

  getInvoice(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/InvoiceItem/getInvoiceItemQuery', { params: param });
  }

  getDetail(InvoiceItemCode) {
    return this.http.get<any>('loan/InvoiceItem/getInvoiceItemDetail', { params: { InvoiceItemCode: InvoiceItemCode } });
  }

  checkDuplicateSequence(InvoiceItemCode,InvoiceItemSequence) {
    return this.http.get<any>('loan/InvoiceItem/CheckDuplicateSequence', { params: { InvoiceItemCode:InvoiceItemCode,InvoiceItemSequence: InvoiceItemSequence } });
  }
  checkDuplicate(InvoiceItemCode) {
    return this.http.get<any>('loan/InvoiceItem/CheckDuplicate', { params: { InvoiceItemCode: InvoiceItemCode } });
  }
  checkDuplicatePriority(InvoiceItemCode,InvoiceItemPriority) {
    return this.http.get<any>('loan/InvoiceItem/CheckDuplicatePriority', { params: { InvoiceItemCode:InvoiceItemCode,InvoiceItemPriority: InvoiceItemPriority } });
  }

  public saveLoan(data: InvoiceItem) {
     if (data.CreatedProgram) {
      return this.http.put<InvoiceItem>('loan/InvoiceItem/UpdateInvoiceItem', data);
    } else {
      return this.http.post<InvoiceItem>('loan/InvoiceItem/CreateInvoiceItem', data);
    }
  }

  delete(InvoiceItemCode,RowVersion){
    return this.http.delete('loan/InvoiceItem/DeleteInvoiceItem', { params: { InvoiceItemCode: InvoiceItemCode , RowVersion:RowVersion} })
  }
}
