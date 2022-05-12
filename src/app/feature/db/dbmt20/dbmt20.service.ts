import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class Dbmt20Service {

  constructor(private http: HttpClient) { }

  searchPcmUserTracking(data:any){
    return this.http.unit().post<any>('system/PCMUserTraking/searchPcmUserTraking', data);
  }

  getProvince(data:any){
    return this.http.unit().post<any>('system/PCMUserTraking/pcmUserTrakingEntity', data);
  }

  searchPcmUserTrackingDisplay(data:any){
    return this.http.unit().post<any>('system/PCMUserTraking/searchPcmUserTrackingDisplay', data);
  }


}
