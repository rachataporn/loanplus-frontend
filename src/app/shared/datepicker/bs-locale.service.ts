import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thLocale } from 'ngx-bootstrap/locale';

defineLocale('th', thLocale); 
@Injectable()
export class BsLocaleService {
  private _defaultLocale = 'th';
  private _locale = new BehaviorSubject<string>(this._defaultLocale);
  private _localeChange: Observable<string> = this._locale.asObservable();

  get locale(): BehaviorSubject<string> {
    return this._locale;
  }

  get localeChange(): Observable<string> {
    return this._localeChange;
  }

  get currentLocale(): string {
    return this._locale.getValue();
  }

  use(locale: string): void {
    if (locale === this.currentLocale) {
      return;
    }

    this._locale.next(locale);
  }
}
