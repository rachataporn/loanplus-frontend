import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, GuardsCheckEnd, NavigationEnd, NavigationCancel, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '@env/environment';
import { UpdateService, AuthService, LangService } from '@app/core';
import { LoadingService } from '@app/core/loading.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigurationService } from './shared/service/configuration.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit ,OnDestroy {
  constructor(private router: Router,
    public translate: TranslateService,
    private location: Location,
    private update: UpdateService,
    private ls: LoadingService,
    private oAuthService: OAuthService,
    private authService: AuthService,
    private lang:LangService,
    private config:ConfigurationService
  ) {
    if (this.oAuthService.hasValidAccessToken()) {
      this.authService.init();
      this.authService.startupTokenRefresh();
      this.config.load();
    }
  }

  ngOnInit() {
    this.update.init();
    this.lang.init(environment.defaultLanguage);
    this.router.events.subscribe((evt) => {
      //block ui when lazyloading start
      if (evt instanceof RouteConfigLoadStart || evt instanceof GuardsCheckEnd) {
        this.ls.show();
      } else if (evt instanceof RouteConfigLoadEnd || evt instanceof NavigationEnd) {
        this.ls.hide();
      }
      //candeactiveguard : fix url change on cancel
      if (evt instanceof NavigationCancel) {
        this.location.replaceState(evt.url);
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
  ngOnDestroy(): void {
    this.lang.destroy();
  }
}
