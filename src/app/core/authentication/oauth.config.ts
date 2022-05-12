import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

import { environment } from '@env/environment';

export const oAuthConfig: AuthConfig = {

    clientId: 'spa',
    scope: 'openid pico.profile offline_access loan system tracking',
    oidc: false,
    issuer: environment.authUrl,
    requireHttps: false

};

/**
 * angular-oauth2-oidc configuration.
 */
@Injectable() export class OAuthConfig {

    constructor(private oAuthService: OAuthService) { }

    load(): Promise<object> {
        let url: string;

        this.oAuthService.configure(oAuthConfig);
        url = `${environment.authUrl}/.well-known/openid-configuration`;

        // Defines the storage.
        this.oAuthService.setStorage(localStorage);

        // Loads Discovery Document.
        return this.oAuthService.loadDiscoveryDocument(url);
    }

}