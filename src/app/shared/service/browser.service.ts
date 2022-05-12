import { Injectable } from '@angular/core';

@Injectable()
export class BrowserService {
    isIE = navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > -1
}
