import { NgModule, ErrorHandler, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppHeaderModule, AppFooterModule } from '@coreui/angular'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { OAuthModule } from 'angular-oauth2-oidc';

import { RouteReusableStrategy } from './route-reusable-strategy';
import { AppBreadcrumbModule } from './shell/breadcrumb';
import { AppSidebarModule } from './shell/sidenav/lib'
import { ShellComponent } from './shell/shell.component';
import { SidenavComponent } from './shell/sidenav/sidenav.component';
import { AuthService } from './authentication/auth.service';
import { AuthGuard } from './authentication/auth-guard.service';
import { JwtInterceptor } from './http/jwt-interceptor.service';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor.service';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor.service';
import { DataConvertInterceptor } from './http/data-convert.interceptor.service';
import { UnitInterceptor } from './http/unit.interceptor.service';
import { HttpService } from './http/http.service';
import { GlobalErrorHandler } from './error-handler.service';
import { OAuthConfig } from './authentication/oauth.config';
import { TimeoutInterceptor, DEFAULT_TIMEOUT, defaultTimeout } from './http/timeout.interceptor.service';

export function initOAuth(oAuthConfig: OAuthConfig): Function {
  return () => oAuthConfig.load();
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient.skipJwtHandler().skipDataConvert(), "system/localize/", "");
}


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    OAuthModule.forRoot(),
    RouterModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      enableHtml: true
    })
  ],
  declarations: [
    ShellComponent,
    SidenavComponent,
  ],
  providers: [
    OAuthConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initOAuth,
      deps: [OAuthConfig],
      multi: true
    },
    AuthService,
    AuthGuard,
    ApiPrefixInterceptor,
    ErrorHandlerInterceptor,
    DataConvertInterceptor,
    JwtInterceptor,
    UnitInterceptor,
    TimeoutInterceptor,
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    },
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: defaultTimeout }
  ],
})
//singleton
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}