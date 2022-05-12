import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState, FileService } from '@app/shared';

export interface Customer {
  CustomerCode: string;
  PrefixId: number;
  FirstName: string;
  LastName: string;
  FirstNameEn: string;
  LastNameEn: string;
  MobileNo: string;
  LineId: string;
  Email: string;
  Birthday: Date;
  IdCard: string;
  DateIssue: Date;
  DateExpiry: Date;
  ProfileImage: string;
  Nationality: string;
  Religion: string;
  Career: string;
  Gender: string;
  MaritalStatus: string;
  LoanStatus: string;
  Remark: string;
  Credit: string;
  ProfileWebcam: string;
  LineUserId: string;
  CreatedProgram: String;
  GradeCustomer: String;
  Race: String;
  ContactPersons: ContactPerson[];
  PhoneNumber: PhoneNumber[];
  Securities: Securities[];
  CustomerBankAccount: CustomerBankAccount[];
  CustomerWorkplace: CustomerWorkplace[];
  CustomerAddress: CustomerAddress[];
  LoanFlag: boolean;
  GuarantorFlag: boolean;
  DepositFlag: boolean;
  StockFlag: boolean;
  ResignFlag: boolean;
  OtherFlag: boolean;
  OtherRemark: string;
  BlacklistRemark: string;
  VerifyFace: boolean;
  VerifyName: boolean;
  BlacklistStatus: boolean;
  CustomerStatus: string;
  SecurityCode: string,
  RowVersion: string;
  FlagSendToMgm: boolean;
  MgmCode: string;
  PicoInterestUsed36: number;
  PicoInterestUsed28: number;
  LawInterestUsed: number;
  CustomerBorrower: CustomerBorrower[];
  Lat: number;
  Lng: number;
  CustomerAttachment: CustomerAttachment[];
  LawRemark: string;
  SubmitLawDepartment: boolean;
  MortgageOnly: boolean;
  LawStatus: string;
  LawStartDate: Date;
  LatCurrent: number;
  LngCurrent: number;
  BranchComment: number;
}

export interface CustomerAddress {
  Replaces: boolean;
  AddressId: number;
  CustomerCode: string;
  AddressType: string;
  BuildingName: string;
  BuildingNo: string;
  VillageNo: string;
  Alley: string;
  Street: string;
  SubDistrictId: number;
  DistrictId: number;
  ProvinceId: number;
  ZipCode: number;
  PhoneNo: string;
  MobileNo: string;
  Email: string;
  Latitude: string;
  Longitude: string;
  RowVersion: string;
}

export interface CustomerCardAddress {
  Replaces: boolean;
  AddressId: number;
  CustomerCode: string;
  AddressType: string;
  BuildingName: string;
  BuildingNo: string;
  VillageNo: string;
  Alley: string;
  Street: string;
  SubDistrictId: number;
  DistrictId: number;
  ProvinceId: number;
  ZipCode: number;
  PhoneNo: string;
  MobileNo: string;
  Email: string;
  Latitude: string;
  Longitude: string;
  RowVersion: string;
}

export interface CustomerWorkAddress {
  Replaces: boolean;
  AddressId: number;
  CustomerCode: string;
  AddressType: string;
  BuildingName: string;
  BuildingNo: string;
  VillageNo: string;
  Alley: string;
  Street: string;
  SubDistrictId: number;
  DistrictId: number;
  ProvinceId: number;
  ZipCode: number;
  PhoneNo: string;
  MobileNo: string;
  Email: string;
  Latitude: string;
  Longitude: string;
  RowVersion: string;
}

export interface PhoneNumberVerify {
  MobileId: number;
  MobileNumber: string;
  MobileDescription: string;
  CustomerCode: string;
  MobileDefault: boolean;
  RowState: RowState;
  RowVersion: string;
  Default: boolean;
}

export interface PhoneNumber {
  MobileId: number;
  MobileNumber: string;
  MobileDescription: string;
  CustomerCode: string;
  MobileDefault: boolean;
  RowState: RowState;
  RowVersion: string;
}

export interface ContactPerson {
  ContactId: number;
  CustomerCode: string;
  PrefixId: number;
  FirstName: string;
  LastName: string;
  MobileNo: string;
  Relationship: string;
  Remark: string;
  RowState: RowState;
  RowVersion: string;
}

export interface CustomerBorrower {
  CustomerBorrowerId: number;
  CustomerCode: string;
  CustomerBorrowerCode: string;
  RowState: RowState;
  RowVersion: string;
}

export interface Securities {
  CustomerSecuritiesId: number;
  CustomerCode: string;
  SecuritiesType: string;
  SecuritiesCode: string;
  EstimateAmount: number;
  LoanLimitAmount: number;
  Active: boolean;
  Description: string;
  SecuritiesImage: string;
  RowState: RowState;
  RowVersion: string;
  CategoryNameTha: string;
  CategoryNameEng: string;
  StatusTracking: boolean;
}

export interface CustomerBankAccount {
  BankAccountId: number;
  CustomerCode: string;
  BankCode: string;
  AccountNo: string;
  BankBranch: string;
  AccountName: string;
  BankAccountTypeCode: string;
  RowVersion: string;
}

export interface CustomerWorkplace {
  WorkplaceId: number;
  WorkplaceName: string;
  CustomerCode: string;
  StartDate: Date;
  WorkplacePosition: string;
  Department: string;
  WorkplaceUnder: string;
  Salary: number;
  RowVersion: string;
}

export interface SaveL {
  LogSystem: string;
  LogDiscription: string;
  LogItemGroupCode: string;
  LogItemCode: string;
  LogProgram: string;
  CustomerCode: string;
  CustomerName: string;
  ContractHeadId: number;
  RowVersion: string;
}

export interface CustomerAttachment {
  CustomerAttachmentId: number,
  CustomerCode: string,
  FilePath: string,
  FileName: string,
  Description: string,
  AttahmentId: number,
  RowState: RowState,
  RowVersion: string;
  Active: boolean,
  IsDisableAttachment: boolean,
}

@Injectable()
export class Lots01Service {
  constructor(private http: HttpClient,
    private fs: FileService) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/customer/master');
  }

  getDistrict(ProvinceId): Observable<any> {
    const param = {
      ProvinceId: ProvinceId
    };
    return this.http.get<any>('loan/customer/getDistrict', { params: param });
  }

  getSubDistrict(DistrictId): Observable<any> {
    const param = {
      DistrictId: DistrictId
    };
    return this.http.get<any>('loan/customer/getSubDistrict', { params: param });
  }

  getZipcode(SubDistrictId): Observable<any> {
    const param = {
      SubDistrictId: SubDistrictId
    };
    return this.http.get<any>('loan/customer/getZipcode', { params: param });
  }

  getModalSecurities(search, page, CustomerCode): Observable<any> {
    const param = {
      Keyword: search.Keyword,
      SecuritiesType: search.SecuritiesType,
      DateFrom: search.DateFrom,
      DateTo: search.DateTo,
      CustomerCode: CustomerCode,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/customer/getModalSecurities', { params: param });
  }

  getContract(customerCode: string, contractType: string, page: any) {
    const param = {
      customerCode: customerCode,
      contractType: contractType,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/customer/getContract', { params: param });
  }

  getBorrower(customerCode: string, page: any) {
    const param = {
      customerCode: customerCode,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/customer/getBorrower', { params: param });
  }

  getGuarantor(customerCode: string, page: any) {
    const param = {
      customerCode: customerCode,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/customer/getGuarantor', { params: param });
  }

  getPhone(customerCode: string, page: any) {
    const param = {
      customerCode: customerCode,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/customer/getPhone', { params: param });
  }

  getCustomerList(search: any, page: any) {
    const param = {
      CustomerCode: search.CustomerCode,
      CustomerName: search.CustomerName,
      IdCard: search.IdCard,
      BlackList: search.BlackList,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/customer/getCustomerList', { params: param });
  }

  getCustomerDetail(CustomerCode) {
    return this.http.get<any>('loan/customer/getCustomerDetail', { params: { CustomerCode: CustomerCode } });
  }

  searchIdCard(IdCard, CustomerCode) {
    return this.http.get<any>('loan/customer/searchIdCard', { params: { IdCard: IdCard, CustomerCode: CustomerCode } });
  }

  public saveCustomer(data: Customer, image, attachment, attachments) {
    let companyFormData = this.fs.convertModelToFormData(data, { ImageFile: image, AttachmentFile: attachment, AttachmentDetailFiles: attachments });
    if (data.CreatedProgram) {
      return this.http.put<Customer>('loan/customer/updateCustomer', companyFormData);
    } else {
      return this.http.post<Customer>('loan/customer/createCustomer', companyFormData);
    }
  }

  getSecuritiesCategory() {
    return this.http.get<any>('loan/customer/getSecuritiesCategory');
  }

  saveLog(param: SaveL) {
    return this.http.post('system/Log/saveLog', param);
  }

  callOTP() {
    var require: any
    const { URLSearchParams } = require('url');
    const fetch = require('node-fetch');
    const encodedParams = new URLSearchParams();

    encodedParams.set('msisdn', '0982535010');
    encodedParams.set('key', '1694495892364874');
    encodedParams.set('secret', 'd327c36c6ab8d0febc894095f878b0ea');

    const url = 'https://otp.thaibulksms.com/v1/otp/request';

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodedParams
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));
    //this.http.post<any>('loan/approveLoan', FormData);

    return null
  }

  requestOTP() {
    return this.http.post<any>('loan/customer/requestOTP', {});
  }

  request(customerCode: string, phoneNumber: string, firstNameEn: string, lastNameEn: string, idCard: string) {
    const params = {
      CustomerCode: customerCode,
      PhoneNumber: phoneNumber,
      FirstNameEn: firstNameEn,
      LastNameEn: lastNameEn,
      IdCard: idCard,
    };
    return this.http.post('loan/customer/requestOTP', params, { responseType: 'text' });
  }

  checkSignature(userTel: string) {
    return this.http.post('loan/customer/checkSignature', { userTel: userTel }, { responseType: 'text' });
  }

  confirmSign(data: Customer, userTel: string) {
    const params = {
      customer: data,
      userTel: userTel,
    };
    return this.http.post('loan/customer/confirmSign', params, { responseType: 'text' });
  }

  clearSign(userTel: string) {
    return this.http.post('loan/customer/clearSign', { userTel: userTel }, { responseType: 'text' });
  }

  checkUserVerify(userTel: string) {
    return this.http.post('loan/customer/checkUserVerify', { userTel: userTel }, { responseType: 'text' });
  }

  getBorrowerLookup(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('loan/customer/BorrowerLookup/search', { params: filter });
  }

  checkBorrowerAddress(search: any) {
    const filter = Object.assign(search);
    return this.http.get<any>('loan/customer/checkBorrowerAddress', { params: filter });
  }

  getCountDownTime() {
    return this.http.get<any>('loan/ContractManagement/getCountdownTime');
  }

  getCustomerCourtHistory(customerCode: string, page: any) {
    const param = {
      customerCode: customerCode,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/customer/getCustomerCourtHistory', { params: param });
  }

  getCustomerCreditGradeHistory(customerCode: string, page: any) {
    const param = {
      customerCode: customerCode,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/customer/getCustomerCreditGradeHistory', { params: param });
  }

  searchName(FirstName, LastName, CustomerCode) {
    return this.http.get<any>('loan/customer/searchName', { params: { FirstName: FirstName, LastName: LastName, CustomerCode: CustomerCode } });
  }

  getCustomerBranchComment(customerCode: string, page: any) {
    const param = {
      customerCode: customerCode,
      sort: page.sort,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/customer/getCustomerBranchComment', { params: param });
  }
}
