import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbmt16Service, DocumentType } from './dbmt16.service';
@Injectable()
export class Dbmt16Resolver implements Resolve<any> {
  constructor(private service: Dbmt16Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const DocumentTypeCode = route.paramMap.get('DocumentTypeCode');
    const DocumentTypeDetail = DocumentTypeCode ? this.service.getDetail(DocumentTypeCode) : of({} as DocumentType);
    const System = this.service.getMaster();
    return forkJoin(
      DocumentTypeDetail, System
    ).pipe(map((result) => {
      const documentTypeDetailList = result[0];
      const systemList = result[1];
      return {
        documentTypeDetailList,
        systemList
      };
    }));
  }
}
