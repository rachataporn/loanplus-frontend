import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpParams ,HttpParameterCodec} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

class Encoder implements HttpParameterCodec{ 
    encodeKey(key: string): string { return encodeURIComponent(key); }

    encodeValue(value: string): string { return this.serializeValue(value); }
  
    decodeKey(key: string): string { return decodeURIComponent(key); }
  
    decodeValue(value: string) { return decodeURIComponent(value); }

    serializeValue(value) {
        let type = typeof(value);
        if (value && type === "object") {
            if(value instanceof Date) return value.toJSON();
            else return JSON.stringify(value);
        }
        if (value === null || value === undefined) {
          return "";
        }
        return encodeURIComponent(value);
      }
}

@Injectable()
export class DataConvertInterceptor implements HttpInterceptor {
    private dateRegex = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;

    private utcDateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let newParams = new HttpParams({encoder: new Encoder()})
        if(request.params instanceof HttpParams){ 
           request.params.keys().map((key)=>{
                let value:any = request.params.get(key);
                 newParams = newParams.append(key,value);
             }
          )
        }
       
        return next.handle(request.clone({
            params:newParams
        })).pipe(
            tap(
                (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        this.convertDates(event.body); //date string to JS date object
                    }
                }
            )
        )
    }

    private convertDates(object: Object) {
        if (!object || !(object instanceof Object)) {
            return;
        }

        if (object instanceof Array) {
            for (const item of object) {
                this.convertDates(item);
            }
        }

        for (const key of Object.keys(object)) {
            const value = object[key];

            if (value instanceof Array) {
                for (const item of value) {
                    this.convertDates(item);
                }
            }

            if (value instanceof Object) {
                this.convertDates(value);
            }

            if (typeof value === 'string' && this.dateRegex.test(value)) {
                object[key] = new Date(value);
            }
        }
    }
}