import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ContentType {
    Image = "Image",
    File = "File"
}
export enum Category {
    Example = "Example",
    Company = "Companys",
    Contract = "Contract",
    Receive = "Receive",
    PreApprove = "PreApprove",
    ContractAttachment = "ContractAttachment",
    Securities = "Securities",
    MgmAttachment = "MgmAttachment",
    TrackingDocument = "TrackingDocument",
    ReceiptAttachment = "ReceiptAttachment",
    Financial = "Financial",
    AkornAttachment = "AkornAttachment",
    CashSubmitAttachment = "CashSubmitAttachment",
    TrackingAttachment = "TrackingAttachment",
    Identity = "Identity"
}

export class Configuration {
    DisplayPath: string
}

@Injectable({ providedIn: 'root' })
export class ConfigurationService {


    private config = new BehaviorSubject<Configuration>(new Configuration());
    constructor(private http: HttpClient) { }

    load() {
        this.http.get<Configuration>("system/configuration")
            .subscribe((value: Configuration) => {
                const configuration = new Configuration();
                configuration.DisplayPath = value.DisplayPath;
                this.config.next(configuration)
            })
    }

    public configChanged(): Observable<Configuration> {
        return this.config.asObservable();
    }
}
