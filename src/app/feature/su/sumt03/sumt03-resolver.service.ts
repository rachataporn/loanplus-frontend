import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sumt03Service, Program } from './sumt03.service';

@Injectable()
export class Sumt03Resolver implements Resolve<any> {
    constructor(private router: Router, private ss: Sumt03Service) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        // const master = this.ss.getMaster();
        // return master;
        const programCode = route.paramMap.get('programCode');
        const Master = this.ss.getMaster();
        const Detail = programCode ? this.ss.getProgramDetail(programCode, 'TH') : of({ ProgramLabels: [] } as Program);

        // const detail = this.es.getRegister(id);
        return forkJoin(
            Master,
            Detail
        ).pipe(map((result) => {
            const master = result[0];
            const detail = result[1];
            return { detail, master, }; // detail }
        }));
    }
}
