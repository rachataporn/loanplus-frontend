import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { GoogleResult } from './google-result.model';

declare var google: any;

@Injectable({
    providedIn: 'root',
})
export class PlacePredictionService {
    private data: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    currentData = this.data.asObservable();

    public autocompleteService: any;

    constructor(private mapsAPILoader: MapsAPILoader) {
        this.mapsAPILoader.load().then(() => {
            this.autocompleteService = new google.maps.places.AutocompleteService();
        });
    }

    getPlacePredictions(term: string): Observable<Object[]> {
        return this.autocompleteService.getPlacePredictions({ input: term }, (data: GoogleResult[]) => {
            if (data) {
                this.data.next(data);
            }
        });
    }
}
