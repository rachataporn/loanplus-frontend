import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of, from } from 'rxjs';
import { filter, take, switchMap, finalize, catchError, map, concatMap } from 'rxjs/operators';

import { AuthService } from '../authentication/auth.service';
import { LangService } from '../lang.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    isRefreshingToken: boolean = false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private authService: AuthService;
    private lang:LangService;
    constructor(private injector: Injector) { }

    // add authorization header with jwt token if available
    private addToken(req: HttpRequest<any>) {
        let headers = this.authService.getAuthorizationHeader();
        if(this.lang.language) headers = headers.append('Language', this.lang.language);
        return req.clone({
            headers: headers
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.authService = this.injector.get(AuthService);
        this.lang = this.injector.get(LangService);
        return next.handle(this.addToken(request)).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    return this.handle401Error(request, next);
                }
                else return throwError(err);
            })
        )
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.refreshTokenSubject.next(null);

            return from(this.authService.refreshToken()).pipe(
                catchError(() => {
                    return this.authService.handleRefreshTokenError();
                }),
                switchMap(() => {
                    console.log('refresh token success');
                    this.refreshTokenSubject.next(true);
                    return next.handle(this.addToken(req))
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                })
            )
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(() => {
                    return next.handle(this.addToken(req));
                })
            )
        }
    }
}