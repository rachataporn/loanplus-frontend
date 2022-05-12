import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface NotifyDto {
    Notify: NotifyDtoList[];
}

export interface NotifyDtoList {
    // DueDate: Date;
    TrackingId: number;
    TrackingNo: string;
    ContractHeadId: number;
    TrackingItemId: number;
    // TrackingStatus: string;
    // MobileNumber: string;
}

@Injectable()
export class Trts0102Service {
    constructor(private http: HttpClient) { }

    sendNotifyLine(data: NotifyDto) {
        return this.http.put<any>('tracking/TrackingSMS/sendNotifySms', data);
    }

    getTrackingSMSList(page: any) {
        const param = {
            Sort: page.sort,
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('tracking/TrackingSMS/getTrackingSMSList', { params: param });
    }

}
