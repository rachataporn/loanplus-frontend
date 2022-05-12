import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState, TableService } from '@app/shared';
import { map } from 'rxjs/operators';

export interface Attribute {
  AttributeId: number,
  AttributeNameTha: string,
  AttributeNameEng: string,
  Description: string,
  AttributeType: string,
  Sequence: number,
  Active: boolean,
  RowVersion: string
}

@Injectable()
export class Lomt09Service {

  constructor(private http: HttpClient) { }
  getDDL(): Observable<any> {
    return this.http.get<any>('loan/securitiesAttribute/getDDL');
  }
  getAttributeDetail(AttributeID): Observable<Attribute> {
    return this.http.get<Attribute>('loan/securitiesAttribute/getAttributeDetail', { params: { AttributeID: AttributeID } });
  }

  getAttributes(search: any, page: any) {
    const filter = {
      Keyword: search.InputSearch,
      sort: page.sort || 'AttributeNameTha ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/securitiesAttribute/getAttribute', { params: filter });
  }

  deleteAttribute(id, RowVersion) {
    return this.http.delete('loan/securitiesAttribute/delete', { params: { AttributeID: id, RowVersion: RowVersion } })
  }

  checkduplicate(attribute) {
    const filter = {
      AttributeId: attribute.AttributeId,
      AttributeNameTha: attribute.AttributeNameTha,
    };
    return this.http.post<any>('loan/securitiesAttribute/Checkdupicate', filter);
  }

  saveAttribute(attribute: Attribute) {
    if (attribute.AttributeId) {
      return this.http.put<Attribute>('loan/securitiesAttribute/edit', attribute);
    } else { return this.http.post<Attribute>('loan/securitiesAttribute/add', attribute); }
  }

}
