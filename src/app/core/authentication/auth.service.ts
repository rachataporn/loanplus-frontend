import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable, BehaviorSubject, of, timer } from 'rxjs';
import { Router } from '@angular/router';

import { BrowserService } from '@app/shared/service/browser.service';
import { BypassGuardService } from '../bypass-guard.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { User } from './user';
import { ConfigurationService } from '@app/shared/service/configuration.service';

const company = 'company';
const program = 'program';
const isCompanyTracking = 'isCompanyTracking';

@Injectable()
export class AuthService {

    redirectUrl: string;
    private signinStatus = new BehaviorSubject<boolean>(false);
    private user = new BehaviorSubject<User>(new User());

    private forceChangeSubject = new Subject<boolean>();
    forceChange = this.forceChangeSubject.asObservable();
    
    /**
     * Offset for the scheduling to avoid the inconsistency of data on the client.
     */
    private offsetSeconds = 30;
    constructor(
        private oAuthService: OAuthService,
        private router:Router,
        private bypass:BypassGuardService,
        private browser:BrowserService
    ) { }
   
    public init(): void {
        // Tells all the subscribers about the new status & data.
        this.signinStatus.next(true);
        this.user.next(this.getUser());
    }
    public isSignedIn(): Observable<boolean> {
        return this.signinStatus.asObservable();
    }    
    public getAuthorizationHeader(): HttpHeaders {
        // Creates header for the auth requests.
        let headers: HttpHeaders = new HttpHeaders();

        const token: string = this.oAuthService.getAccessToken();
        if (token !== '') {
            const tokenValue: string = 'Bearer ' + token;
            headers = headers.append('Authorization', tokenValue);
        }
        if(this.company){
            headers = headers.append('Company', this.company);
        }
        if(this.isCompanyTracking){
            headers = headers.append('IsCompanyTracking', this.isCompanyTracking);
        }
        if(this.program){
            headers = headers.append('Program', this.program);
        }
        if (this.browser.isIE) {
            Object.assign(headers, {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT',
                'If-Modified-Since': '0'
            })
        }
        return headers;
    }

    public userChanged(): Observable<User> {
        return this.user.asObservable();
    }
    public get company(){
        return localStorage.getItem(company);
    }
    public set company(value){
        localStorage.setItem(company,value);
    }
    public get isCompanyTracking(){
        return localStorage.getItem(isCompanyTracking);
    }
    public set isCompanyTracking(value){
        localStorage.setItem(isCompanyTracking,value);
    }
    public get program(){
        return localStorage.getItem(program);
    }
    public set program(value){
        localStorage.setItem(program,value);
    }
    public hasToken(){
        return this.oAuthService.hasValidAccessToken();
    }
    public getUser(): User {
        const user: User = new User();
        if (this.oAuthService.hasValidAccessToken()) {
            const userInfo: any = this.oAuthService.getIdentityClaims();
            user.userName = userInfo.name;
            user.companyCode = userInfo.company;
            user.defaultLang = userInfo.local;
            user.profiles = userInfo.role;
            this.company = user.companyCode;
        }
        return user;
    }

    public signout(): void {
        this.oAuthService.logOut(true);

        this.redirectUrl = null;

        // Tells all the subscribers about the new status & data.
        this.signinStatus.next(false);
        this.user.next(new User());

        localStorage.removeItem(isCompanyTracking);
    }

    public handleRefreshTokenError() {
        this.bypass.bypass();
        this.redirectUrl = this.router.url;
        // The user is forced to sign in again.
        this.router.navigate(['/login']);
        return of();
    }

    refreshToken() : Promise<object | void> {
       return this.oAuthService.refreshToken()
    }
    /**
     * Case when the user comes back to the app after closing it.
     */
    public startupTokenRefresh(): void {
        if (this.oAuthService.hasValidAccessToken()) {
            const source: Observable<number> = timer(this.calcDelay(new Date().valueOf()));

            // Once the delay time from above is reached, gets a new access token and schedules additional refreshes.
            source.subscribe(() => this.oAuthService.refreshToken());
        }
    }
    private calcDelay(time: number): number {
        const expiresAt: number = this.oAuthService.getAccessTokenExpiration();
        const delay: number = expiresAt - time - this.offsetSeconds * 1000;
        return delay > 0 ? delay : 0;
    }
}