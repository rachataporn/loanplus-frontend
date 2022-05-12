import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tracking {
  TrackingItemId: number;
  TrackingItemNameTha: string;
  TrackingItemNameEng: string;
  active: boolean;
  CreatedProgram: string;
}

@Injectable()
export class Trmt01Service {
  constructor(private http: HttpClient) { }


  getListTableMaster(search, page: any) {
    const param = {
      InputSearch: search.InputSearch,
      status: search.status,
      sort: page.sort || '',
      index: page.index,
      size: page.size
    }
    return this.http.get('tracking/trackingEvent/getTrackingEventTableList', { params: param });
  }

  getSearchEdit(trackingItemId){
    return this.http.get<any>('tracking/trackingEvent/getTrackingEventDetail', { params: { TrackingItemId: trackingItemId } });
  }

  checkDuplicate(data: Tracking) {
    return this.http.post<Tracking>('tracking/trackingEvent/checkDuplicate', data);
  }

  saveTracking(data: Tracking) {
    if (data.CreatedProgram) {
      return this.http.post<Tracking>('tracking/trackingEvent/updateTrackingEvent', data);
    } else {
      return this.http.post<Tracking>('tracking/trackingEvent/insertTrackingEvent', data);
    }
  }

  deleteTracking(data) {
    const param = {
      TrackingItemId: data.trackingItemId,
      RowVersion: data.RowVersion
    };
    return this.http.delete<Tracking>('tracking/trackingEvent/deleteTrackingEvent', { params: param });
  }

}