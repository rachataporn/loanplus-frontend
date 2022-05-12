import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableService, RowState } from '@app/shared';
import { environment } from '@env/environment';

export interface User {
  Id: number,
  UserName: string,
  EmployeeCode: string,
  PasswordPolicyCode: string,
  DefaultLang: string,
  Active: boolean,
  LockoutEnabled: boolean,
  ForceChangePassword: boolean,
  StartEffectiveDate: Date,
  EndEffectiveDate: Date,
  LastUpdateBy: string,
  LastUpdateDate: Date,
  LastChangePassword: Date,
  PasswordRaw: string,
  Profiles: Profile[],
  Permissions: Permission[],
  PasswordExpireDate: Date,
  FailTime: number
}

export interface Profile {
  Id: number,
  ProfileCode: string,
  RowVersion: string;
  RowState: RowState

}
export interface Permission {
  Id: number,
  CompanyCode: string,
  IsDefault: boolean,
  RowVersion: string;
  RowState: RowState

}

@Injectable()
export class Sumt07Service {
  constructor(private http: HttpClient,
    private ts: TableService) { }


  getUsers(search: any, page: any) {
    const filter = Object.assign(search, page);
    filter.sort = page.sort || 'UserName'
    return this.http.get<any>('system/SuUser/getUserList', { params: filter });

  }
  getUser(UserId) {
    return this.http.get<any>('system/SuUser/getUserDetail', { params: { UserId: UserId } });
  }

  getMaster(): Observable<any> {
    return this.http.get<any>('system/SuUser/master');
  }

  saveUser(data: User) {
    if (data.Id) {
      return this.http.put<User>('system/SuUser', data);
    } else {
      return this.http.post<User>('system/SuUser', data);
    }
  }
  delete(UserId, version) {
    return this.http.delete('system/SuUser', { params: { Id: UserId, RowVersion: version } });
  }
  getEmployee(userId) {
    return this.http.get('system/SuUser/emp', { params: { userId: userId }, responseType: 'text' });
  }
  forgetPassword(email: string) {
    return this.http.disableApiPrefix().post<any>(`${environment.authUrl}/api/account/forgetpassword`, `\"${email}\"`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
