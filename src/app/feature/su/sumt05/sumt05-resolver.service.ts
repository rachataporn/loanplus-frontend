import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sumt05Service, SuProfileDTO } from './sumt05.service';
import { AlertService, LangService, SaveDataService } from '@app/core';
@Injectable()
export class Sumt05Resolver implements Resolve<any> {
  constructor(private sumt05Service: Sumt05Service, public lang: LangService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const ProfileCode = route.paramMap.get('ProfileCode');
    const Detail = ProfileCode ? this.sumt05Service.getProfileDetail(ProfileCode, this.lang.CURRENT) : of({} as SuProfileDTO);

    return forkJoin(
      Detail

    ).pipe(map((result) => {
      const detail = result[0];

      return {
        detail
      };
    }));
  }
}
