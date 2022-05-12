import { Injectable } from '@angular/core';

import { LangService } from '@app/core';
@Injectable()
export class SelectFilterService {

  constructor(private lang: LangService) { }

  public SortByLang(list: any[],field:string='Text') {
    list.sort((a,b) => (a[field+this.lang.CURRENT] || '').localeCompare(b[field+this.lang.CURRENT] || ''));
  }

  public FilterActive(list: any[]): any[] {
    return list.map((item)=>{
      return Object.assign(item,{ disabled : !item.Active});
    })

  }

  public FilterActiveByValue(list: any[], value: any):any[] {
    return list.map((item)=>{
        return Object.assign(item,{ disabled : !item.Active && item.Value !== value})
    })
  }
}
