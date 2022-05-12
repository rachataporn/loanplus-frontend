import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { Dbmt04Service, ListItem } from './dbmt04.service';
import { map } from 'rxjs/operators';

@Injectable()
export class Dbmt04Resolver implements Resolve<any> {
    constructor(private ds: Dbmt04Service) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {

        const url:string = route.url.join('/');
        if(url.includes('detail')) {
            const listItemGroupCode = route.paramMap.get('listItemGroupCode');
            const listItemCode = route.paramMap.get('listItemCode');
            const master = this.ds.getMaster(true); 
            const listItem = listItemCode ? this.ds.getListItem(listItemGroupCode,listItemCode) : of({} as ListItem)
            return forkJoin(
                master,
                listItem
            ).pipe(map((result) => {
                let master = result[0];
                let detail = result[1];
                return { master, detail }
            }))
        }
        else{
            const master = this.ds.getMaster(false);
            return master;
        }
    }
}