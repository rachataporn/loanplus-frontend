import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { languages } from '@env/languages';
import { Subscription } from 'rxjs';
import { AuthService } from './authentication/auth.service';

const languageKey = 'language';

@Injectable({
    providedIn: 'root'
})
export class LangService {

    private langChangeSubscription!: Subscription;
    private userChangeSubscription!: Subscription;
    languageDatas: { [index: string]: string } = {};
    supportLanguages = [{ value:languages.thai,text:'ไทย'},{value:languages.eng,text:'Eng'}]
    constructor(private translate: TranslateService,private authService:AuthService) {
        this.languageDatas[languages.thai] = 'Tha';
        this.languageDatas[languages.eng] = 'Eng';
    }

    init(defaultLanguage) {
        this.language = defaultLanguage;
        this.langChangeSubscription = this.translate.onLangChange
            .subscribe((event: LangChangeEvent) => {
                localStorage.setItem(languageKey, event.lang);
            });
        this.userChangeSubscription = this.authService.userChanged()
        .subscribe(user=>{
           if(user)  this.language = user.defaultLang || defaultLanguage
        })
    }
    destroy() {
        if (this.langChangeSubscription) {
            this.langChangeSubscription.unsubscribe();
        }
        if (this.userChangeSubscription) {
            this.userChangeSubscription.unsubscribe();
        }
    }
    onChange() {
        return this.translate.onLangChange.pipe(
            map((event: LangChangeEvent) => {
                return event.lang;
            })
        )
    }
    set language(language: string) {
        language = language || localStorage.getItem(languageKey) || this.translate.getBrowserCultureLang();
        const langPart = language.split('-');
        if (langPart.length > 1) {
            language = langPart[0];
        }
        this.translate.use(language);
    }
    get language() {
        return this.translate.currentLang;
    }

    get CURRENT(): string {
        return this.languageDatas[this.translate.currentLang];
    }

}