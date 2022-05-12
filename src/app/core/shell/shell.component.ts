import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../authentication/auth.service';
import { DOCUMENT } from '@angular/platform-browser';
import { DomService } from '@app/shared/service/dom.service';
import { filter, map, switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { LangService } from '../lang.service';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./shell.component.css'],
  templateUrl: './shell.component.html',
})
export class ShellComponent implements OnInit,OnDestroy {

  private changes: MutationObserver;
  public element: HTMLElement;
  showBreadcrumb:boolean = true;
  supportLanguages = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public langService : LangService,
    public translate: TranslateService,
    private auth: AuthService,
    private dom:DomService,
    @Inject(DOCUMENT)  document?: any
  ) {
    this.changes = new MutationObserver((mutations) => {
      this.dom.triggerResize(300);
    });
    this.element =  document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });

    this.router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        document.body.classList.remove('sidebar-show');
      }
    });
    const onNavigationEnd = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    );
    merge(this.translate.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.route;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        switchMap(route => route.data)
      )
      .subscribe(event => {
        if(event['breadcrumb'] != undefined && event['breadcrumb'] === false){
          this.showBreadcrumb = false;
        }
        else this.showBreadcrumb = true;
        this.auth.program = event['code'] || 'no-prog';
      });
  }

  ngOnInit(): void {
    this.supportLanguages = this.langService.supportLanguages;
  }
  ngOnDestroy(): void {
    this.changes.disconnect();
  }
  get userName(){
    return this.auth.userChanged().pipe(
      map(user=> user.userName)
    )
  }

  get currentLang():any {
    return this.supportLanguages.find((lang)=>{
      return lang.value == this.langService.language;
    });
  }

  setLang(lang: string) {
     this.langService.language = lang;
  }
}
