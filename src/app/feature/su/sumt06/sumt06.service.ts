import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface PasswordPolicy {
  PasswordPolicyCode: String;
  PasswordPolicyName: String;
  PasswordPolicyDescription: String;
  FailTime: number;
  PasswordAge: number;
  MaxDupPassword: number;
  PasswordMinimumLength: number;
  PasswordMaximumLength: number;
  UsingUppercase: boolean;
  UsingLowercase: boolean;
  UsingNumericChar: boolean;
  UsingSpecialChar: boolean;
  Active: boolean;
  CreatedProgram: string;
}

@Injectable()
export class Sumt06Service {
  constructor(private http: HttpClient) { }

  getPasswordPolicy(search: any, page: any) {
    const filter = {
      Keyword: search.InputSearch || '',
      sort: page.sort || 'PasswordPolicyCode ASC',
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('system/PasswordPolicy/getPasswordPolicyList', { params: filter });
  }

  public savePasswordPolicy(data: PasswordPolicy) {
    if (data.CreatedProgram) {
      return this.http.put<PasswordPolicy>('system/PasswordPolicy/updatePasswordPolicy', data);
    } else {
      return this.http.post<PasswordPolicy>('system/PasswordPolicy/createPasswordPolicy', data);
    }
  }

  updatePasswordPolicyList(PasswordPolicyCode) {
    return this.http.get<any>('system/PasswordPolicy/getUpdatePasswordPolicyList', { params: { PasswordPolicyCode: PasswordPolicyCode } });
  }

  delete(PasswordPolicyCode: string, RowVersion: any) {
    return this.http.delete<string>('system/PasswordPolicy/deletePasswordPolicy', { params: { PasswordPolicyCode: PasswordPolicyCode, RowVersion: RowVersion } });
  }

  CheckDuplicate(data: PasswordPolicy){
    return this.http.post<PasswordPolicy>('system/PasswordPolicy/checkDuplicate', data);
  }

}