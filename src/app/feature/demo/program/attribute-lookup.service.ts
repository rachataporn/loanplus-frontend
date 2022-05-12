import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class AttributeLookupService {
    constructor(private http: HttpClient) { }

    getAttributes(search: any, page: any) {
        const filter = Object.assign(search, page);
        // return this.http.get<any>('attribute/search', { params: filter });
        return of([
            {
                guid:Math.random(),
                AttributeID: 1,
                AttributeNameTha: 'ขนาด',
                AttributeNameEng: 'Size',
            },
            {
                guid:Math.random(),
                AttributeID: 3,
                AttributeNameTha: 'สี',
                AttributeNameEng: 'Color',
            }
        ].filter((item)=>{ return item.AttributeNameTha.includes(search.keyword) }))
    }
}