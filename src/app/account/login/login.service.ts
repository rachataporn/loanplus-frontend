import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '@app/core';
import { ConfigurationService } from '@app/shared/service/configuration.service';

export interface LoginContext {
  username: string;
  password: string;
}
export interface ChangePassword {
  UserName: string,
  OldPassword: string,
  NewPassword: string
}

@Injectable()
export class LoginService {

  constructor(
    protected auth: AuthService,
    private oAuthService: OAuthService,
    private http: HttpClient,
    private config:ConfigurationService
  ){}
  signIn(credential: LoginContext): Promise<void | object> {
    return this.oAuthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(credential.username, credential.password)
      .then(() => {
        this.auth.init();
        this.config.load();
      })
      .catch((err) => {
        if (err.error.error_description) {
          throw err;
        }
        else {
          err.error.error_description = err.message;
          throw err;
        }
      })
  }

  getUserPolicy(username: string) {
    return this.http.disableApiPrefix().get<any>(`${environment.authUrl}/api/account/policy`, { params: { username: username } });
  }

  changePassword(change: ChangePassword) {
    return this.http.disableApiPrefix().post<any>(`${environment.authUrl}/api/account/changepassword`, change);
  }

  forgetPassword(email: string) {
    return this.http.disableApiPrefix().post<any>(`${environment.authUrl}/api/account/forgetpassword`, `\"${email}\"`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
