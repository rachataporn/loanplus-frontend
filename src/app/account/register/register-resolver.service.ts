import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterService } from './register.service';
@Injectable()
export class RegisterResolver implements Resolve<any> {
  constructor(private js: RegisterService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    // const systemCode = route.paramMap.get('systemCode');
    // const menuCode = route.paramMap.get('menuCode');
    // const mainMenu = route.paramMap.get('mainMenu');
    // const systemCombobox = this.js.getSystemCombobox();
    // const mainMenuCombobox = this.js.getMainMenuCombobox(systemCode);
    // const programCodeCombobox = this.js.getProgramCodeCombobox();
    // const languageCombobox = this.js.getLanguageCombobox();
    // const detail = systemCode && menuCode ? this.js.getMenuDetail(systemCode, menuCode) : of({} as Menu);

    // return forkJoin(
    //   systemCombobox,
    //   mainMenuCombobox,
    //   programCodeCombobox,
    //   languageCombobox,
    //   detail
    // ).pipe(map((result) => {
    //   const system = result[0];
    //   const mainMenu = result[1];
    //   const programCode = result[2];
    //   const language = result[3];
    //   const menuDetail = result[4];
    //   return {
    //     system
    //     , mainMenu
    //     , programCode
    //     , language
    //     , menuDetail
    //   };
    // }));
    return null;
  }
}
