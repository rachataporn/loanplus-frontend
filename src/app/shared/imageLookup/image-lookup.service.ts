import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class ImageLookupService {
    constructor(private http: HttpClient) { }

    getImageAll(ImageID  ) : Observable<any> {
        return this.http.get<any>('manageproduct/getProductImageAll', { params: { ImageID: ImageID } })
    }

}