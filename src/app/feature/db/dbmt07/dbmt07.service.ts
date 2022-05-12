import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Employee {
  CompanyCode: string,
  EmployeeCode: string,
  PrefixId: number,
  FirstName: string,
  LastName: string,
  FirstNameEn: string,
  LastNameEn: string,
  DepartmentCode: string,
  PositionCode: string,
  IdCard: string,
  PassportNo: string,
  Mobile: string,
  Email: string,
  ReligionCode: string,
  NationalityCode: string,
  RaceCode: string,
  CountryCode: string,
  ProvinceId: number,
  DistrictId: number,
  Address: string,
  PostalCode: string,
  Active: boolean,
  RowVersion: number,
  UserId: number,
  SubDistrictId: number,
  PostalCodeId: number,
  IsMobile: boolean,
  EmployeeMgmTarget: EmployeeMgmTarget[];
}

export interface EmployeeMgmTarget {
  EmployeeMgmTargetId: number;
  CompanyCode: string;
  EmployeeCode: string;
  Year: string;
  MonthCode: string;
  Target: number;
}

@Injectable()
export class Dbmt07Service {
  constructor(private http: HttpClient) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('system/Employee/master');
  }

  getEmployee(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('system/Employee', { params: filter });
  }

  getEmployeeDetail(CompanyCode, EmployeeCode) {
    return this.http.get<any>('system/Employee/detail', { params: { CompanyCode: CompanyCode, EmployeeCode: EmployeeCode } });
  }

  CheckSensitiveCase(param: Employee) {
    return this.http.post('system/Employee/CheckSensitiveCase', param);
  }

  saveEmployee(Employee: Employee) {
    if (Employee.RowVersion) {
      return this.http.put<Employee>('system/Employee/updateEmployee', Employee);
    } else {
      return this.http.post<Employee>('system/Employee/insertEmployee', Employee);
    }
  }

  DeleteEmployee(EmployeeCode, CompanyCode, version) {
    return this.http.unit().delete('system/Employee/DeleteEmployee', { params: { EmployeeCode: EmployeeCode, CompanyCode: CompanyCode, RowVersion: version } });
  }

  getDistrictDDL(ProvinceId) {
    return this.http.get<any>('system/Employee/districtDDL', { params: { ProvinceId: ProvinceId } });
  }

  getSubDistrictDDL(DistrictId) {
    return this.http.get<any>('system/Employee/subDistrictDDL', { params: { DistrictId: DistrictId } });
  }

  getPostalCodeDDL(ProvinceId) {
    return this.http.get<any>('system/Employee/postalCodeDDL', { params: { ProvinceId: ProvinceId } });
  }


  chechYearSelect(CompanyCode, EmployeeCode, Year) {
    return this.http.get<any>('system/Employee/checkYearSelect', { params: { CompanyCode: CompanyCode, EmployeeCode: EmployeeCode, Year: Year } });
  }

  getYearList(CompanyCode, EmployeeCode, Year) {
    return this.http.get<any>('system/Employee/getYearSelect', { params: { CompanyCode: CompanyCode, EmployeeCode: EmployeeCode, Year: Year } });
  }
}
