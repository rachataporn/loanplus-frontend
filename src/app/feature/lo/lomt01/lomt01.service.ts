import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface SecuritiesCategory {
  CategoryId: number;
  CategoryNameTha: string;
  CategoryNameEng: string;
  TemplateViewId: number;
  SecuritiesTypeGroup: string;
  RunningType: string;
  RunningNoFormat: string;
  RunningNoDigit: number;
  FormatYear: string;
  FormatMonth: string;
  Active: boolean;
  TemplateName: string;
  RowVersion: string;
  Priority: number;
  securitiesAttribute: SecuritiesAttribute[]
}

export interface SecuritiesAttribute {
  CategoryAttributeId: number;
  CategoryId: number;
  AttributeId: number;
  RequireFlag: boolean;
  TitleSeq: string;
  AttributeNameTha: string;
  AttributeNameEng: string;
  AttributeTypeTha: string;
  AttributeTypeEng: string;
  RowVersion: string;
  RowState: RowState;
}

@Injectable()
export class Lomt01Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/SecuritiesCategory/master');
  }

  getSecuritiesLists(search: any, page: any) {
    const param = {
      Keyword: search.keywords,
      SecuritiesTypeGroup: search.SecuritiesTypeGroup,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/SecuritiesCategory/securitiesAttribute', { params: param });
  }

  getSecuritiesAttribute(search: any, page: any) {
    const param = {
      keywords: search.keywords,
      sort: page.sort || 'AttributeNameTha ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/SecuritiesCategory/securitiesAttributeLookup', { params: param });
  }

  getSecuritiesCategoryDetail(categoryId: any): Observable<any> {
    return this.http.get<any>('loan/SecuritiesCategory/detail', { params: { CategoryId: categoryId } });
  }

  saveSecuritiesCategory(data: SecuritiesCategory) {
    if (data.RowVersion) {
      return this.http.unit().put<SecuritiesCategory>('loan/SecuritiesCategory/updateSecurities', data);
    } else {
      return this.http.unit().post<SecuritiesCategory>('loan/SecuritiesCategory/insertSecurities', data);
    }
  }

  deleteCategory(id, version) {
    return this.http.unit().delete('loan/SecuritiesCategory/deleteSecurities', { params: { CategoryId: id, RowVersion: version } });
  }

  checkSecuritiesAttributeDup(CategoryNameTha, Id) {
    return this.http.get<any>('loan/SecuritiesCategory/checkSecuritiesAttributeDup', { params: { categoryNameTha: CategoryNameTha, id: Id } });
  }
}
