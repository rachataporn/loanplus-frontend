import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export class Configuration{
    DisplayPath:string
}

@Injectable({ providedIn: 'root' })
export class ConfigurationReportService {

 
    private config = new BehaviorSubject<Configuration>(new Configuration());
    constructor(private http: HttpClient) { }

    load(){
        this.http.get<Configuration>("system/configuration/reportPath")
        .subscribe((value:Configuration)=>{
            const configuration = new Configuration();
            configuration.DisplayPath = value.DisplayPath;
            this.config.next(configuration)
        })
    }

    public configChanged(): Observable<Configuration> {
        return this.config.asObservable();
    }
}
