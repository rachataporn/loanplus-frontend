import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lorp19Service } from './lorp19.service';
@Injectable()
export class Lorp19Resolver implements Resolve<any> {
  constructor(private js: Lorp19Service) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    // const systemCode = route.paramMap.get('systemCode');
    // const menuCode = route.paramMap.get('menuCode');
    // const mainMenu = route.paramMap.get('mainMenu');
    // const systemCombobox = this.js.getSystemCombobox();
    // const mainMenuCombobox = this.js.getMainMenuCombobox(systemCode);
    // const programCodeCombobox = this.js.getProgramCodeCombobox();
    // const languageCombobox = this.js.getLanguageCombobox();
    // const detail = systemCode && menuCode ? this.js.getMenuDetail(systemCode, menuCode) : of({} as Menu);

    const master = this.js.getMaster();
    return master;

  }
}
