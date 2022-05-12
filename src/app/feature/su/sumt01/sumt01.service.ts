import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService, RowState, FileService } from '@app/shared';

export interface Company {
  CompanyCode: string,
  CompanyNameTha: string,
  CompanyNameEng: string,
  CountryCode: string,
  ProvinceId: number, //number,
  AddressTha: string,
  AddressEng: string,
  DistrictId: number, //number,
  Moo: string,
  Soi: string,
  Road: string,
  Tambol: number,
  PostalCode: string,
  TelephoneNo: string,
  FaxNo: string,
  Email: string,
  PersonalTaxTypeCode: string,
  TaxId: string,
  SocailSecurityNo: string,
  SocailSecurityBranch: string,
  ReceiptBranchCode: string,
  ReceiptBranchName: string,
  Website: string,
  GoogleMap: string,
  MapName: string,
  LogoName: string,
  Active: boolean,
  IsBranch: boolean;
  BannerName: string,
  MainCompany: string,
  RowVersion: number,
  AddressFin: string,
  RevenueStampBranchNo: string
  BillPaymentFlag: boolean,
  ComCode: string,
  SuffixCode: string,
  IsMobile: boolean,
  RegionId: number,
  IsCompanyTracking: boolean
}
@Injectable()
export class Sumt01Service {
  constructor(private http: HttpClient, private fs: FileService) { }  //เรียกใช้อะไรมาใส่ในนี้ อย่าเอาไปไว้ข้างนอก

  getMaster(): Observable<any> {
    return this.http.get<any>('system/company/master/true');
  }
  getCompany(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('system/company', { params: filter });
  }

  saveCompany(company, image) {
    let companyf = this.fs.convertModelToFormData(company, { ImageFile: image }); //convertModelToFormData ใช้ในเรื่องรูป
    if (company.RowVersion) {
      return this.http.put<Company>('system/company/updateCompany', companyf);
    } else {
      return this.http.post<Company>('system/company/insertCompany', companyf);
    }
  }
  getCompanyDetail(CompanyCode: any): Observable<any> {
    return this.http.get<any>('system/company/detail', { params: { CompanyCode: CompanyCode } });
  }
  deleteCompany(CompanyCode, version, mainCompany, divFlag) {
    return this.http.unit().delete('system/company/deleteCompany', { params: { CompanyCode: CompanyCode, RowVersion: version, MainCompany: mainCompany, DivFlag: divFlag } });
  }

  getDistrictDDL(ProvinceId) {
    return this.http.get<any>('system/company/districtDDL', { params: { ProvinceId: ProvinceId } });
  }

  getSubDistrictDDL(DistrictId) {
    return this.http.get<any>('system/company/subDistrictDDL', { params: { DistrictId: DistrictId } });
  }

  getPostalCodeDDL(ProvinceId) {
    return this.http.get<any>('system/company/postalCodeDDL', { params: { ProvinceId: ProvinceId } });
  }

  getRegionDDL(RegionId) {
    return this.http.get<any>('system/company/regionDDL', { params: { RegionId: RegionId } });
  }

  checkBranch(CompanyCode) {
    const param = {
      CompanyCode: CompanyCode,
    };
    return this.http.get<any>('system/company/checkBranch', { params: param });
  }
}