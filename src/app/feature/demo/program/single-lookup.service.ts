import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SingleLookupService {
    constructor(private http: HttpClient) { }

    getListItem(search: any, page: any) {
        const filter = Object.assign(search,page);
        return this.http.get<any>('system/listitem/lookup/search', { params: filter });
    }
}