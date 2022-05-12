import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transport {
  TransportId: number,
  TransportNameTh: string,
  TransportNameEn: string,
  TransportCode: string,
  TransportType: string,
  Active: boolean,
  RowVersion: string
}

@Injectable()
export class Lomt15Service {

  constructor(private http: HttpClient) { }
  getDDL(): Observable<any> {
    return this.http.get<any>('loan/Transport/getDDL');
  }
  getSearchDetail(TransportId): Observable<Transport> {
    return this.http.get<Transport>('loan/Transport/getSearchDetail', { params: { TransportId: TransportId } });
  }

  getTransport(search: any, page: any) {
    const filter = {
      Keyword: search.InputSearch,
      sort: page.sort || 'TransportNameTh ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/Transport/getTransport', { params: filter });
  }

  deleteTransport(TransportId, RowVersion) {
    return this.http.delete('loan/Transport/delete', { params: { TransportId: TransportId, RowVersion: RowVersion } })
  }

  checkduplicate(transport) {
    const filter = {
      TransportId: transport.TransportId,
      TransportCode: transport.TransportCode,
    };
    return this.http.post<any>('loan/Transport/Checkdupicate', filter);
  }

  saveTransport(transport: Transport) {
    if (transport.TransportId) {
      return this.http.put<Transport>('loan/Transport/edit', transport);
    } else { return this.http.post<Transport>('loan/Transport/add', transport); }
  }

}
