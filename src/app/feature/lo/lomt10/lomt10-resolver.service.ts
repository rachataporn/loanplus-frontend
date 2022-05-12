import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { View, TemplateView, Lomt10Service } from '@app/feature/lo/lomt10/lomt10.service';

@Injectable()
export class Lomt10Resolver implements Resolve<any> {
  constructor(private is: Lomt10Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const id = route.paramMap.get('id');
    const viewId = route.paramMap.get('viewId');
    const detail = id ? this.is.getTemplateViewDetail(id) : of({} as TemplateView);
    const viewDetail = viewId ? this.is.getViewDetail(viewId) : of({} as View);
    return forkJoin(
      detail,
      viewDetail
    ).pipe(map((result) => {
      let detail = result[0];
      let viewDetail = result[1];
      return {
        detail,
        viewDetail
      }
    }))
  }
}