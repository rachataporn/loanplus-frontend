import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class LookupService {
    constructor(private http: HttpClient) { }
    search(request,filter,keyColumn): Observable<any> {
        return this.http.skipErrorHandler().get<any>(request,{params : filter}).pipe(
            map((res:any)=>{
                return res.Total == 1 ? res.Rows[0][keyColumn] : null
            }),
            catchError(()=>{
                return of(null);
            })
        );
    }
    getDescription(request,keys): Observable<any> {
        return this.http.skipErrorHandler().get<any>(request,{ params : keys }).pipe(
            catchError(()=>{
                return of({});
            })
        );
    }
}