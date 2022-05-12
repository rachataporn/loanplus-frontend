import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportParam {
    Branch: string,
    Status: string,
    Strat: Date,
    End: Date,
    ReportCode: string,
    ReportName: string,
    ExportType: string,
}

export interface ContractStatus {
    StatusValue: string,
    RowState: string,
    Active: boolean,
}




@Injectable()
export class Trrp02Service {
    constructor(private http: HttpClient) { }

    getMaster(): Observable<any> {
        return this.http.get<any>('tracking/TrackingHomeReport/master');
    }

    generateReport(param: ReportParam) {
        return this.http.post('tracking/TrackingHomeReport/print', param, { responseType: 'text' });
    }
}



