import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface LoanAgreementType {
  LoanTypeCode: string;
  LoanTypeNameTha: string;
  LoanTypeNameEng: string;
  CanRefinance: boolean;
  Active: boolean;
  IsLoanInsurance: boolean;
  ContractType: string;
  InterestRate: number;
  MinPeriod: number;
  MaxPeriod: number;
  InterestAllMax: number;
  InterestAllMax2: number;
  InterestAllMaxDisplay: number;
  InterestAllMax2Display: number;
  CategoryId: number;
  MaxLoanAmount: number;
  MortgageFee: number;
  ContractDocument: string;
  RowVersion: string;
  ContractTypeTha: string;
  ContractTypeEng: string;
  CategoryNameTha: string;
  CategoryNameEng: string;
  RowState: RowState;
  LoanTypeBorrower1: LoanTypeBorrower;
  LoanTypeBorrower2: LoanTypeBorrower;
  LoanTypeBorrowers: LoanTypeBorrower[];
  NotCloseAdvance: number;
  NumberMonthsPaid: number;
}

export interface LoanTypeBorrower {
  LoanTypeBorrowerId: number;
  LoanTypeCode: string;
  IsMainBorrower: boolean;
  ContractMaximumLimit: number;
  AgeNotOver: number;
  IsRequireSubBorrower: boolean;
  IsNeedLeastOneSubBorrower: boolean;
  IsCreditNotEnough: boolean;
  IsAgeOverSixty: boolean;
  IsNotRegisProvince: boolean;
  RegisProvince: string;
  RegisProvinceName: string;
  IsCheckAddress: boolean;
  RowVersion: string;
  RowState: RowState;
  //---------------************--------------Borrower1---------------**********-------------------------------
  LoanTypeBorrower1DetailIdCardAddress: LoanTypeBorrowerDetail;
  LoanTypeBorrower1DetailCurrentAddress: LoanTypeBorrowerDetail;
  LoanTypeBorrower1DetailWorkplaceAddress: LoanTypeBorrowerDetail;
  LoanTypeBorrower1DetailIdCardAddressContract: LoanTypeBorrowerDetail;
  LoanTypeBorrower1DetailCurrentAddressContract: LoanTypeBorrowerDetail;
  LoanTypeBorrower1DetailWorkplaceAddressContract: LoanTypeBorrowerDetail;
  CustomerCredits1: LoanTypeCustomerCredit[];
  //----------------------------------------------------------------------------------

  //---------------************--------------Borrower2---------------**********-------------------------------
  LoanTypeBorrower2DetailIdCardAddress: LoanTypeBorrowerDetail;
  LoanTypeBorrower2DetailCurrentAddress: LoanTypeBorrowerDetail;
  LoanTypeBorrower2DetailWorkplaceAddress: LoanTypeBorrowerDetail;
  LoanTypeBorrower2DetailIdCardAddressContract: LoanTypeBorrowerDetail;
  LoanTypeBorrower2DetailCurrentAddressContract: LoanTypeBorrowerDetail;
  LoanTypeBorrower2DetailWorkplaceAddressContract: LoanTypeBorrowerDetail;
  CustomerCredits2: LoanTypeCustomerCredit[];
  IsNotRegisProvinceList: ProvinceList[];
  //----------------------------------------------------------------------------------

  //-----------------------------------Result-----------------------------------------------
  LoanTypeBorrowerDetails: LoanTypeBorrowerDetail[];
  CustomerCredits: LoanTypeCustomerCredit[];
}

export interface LoanTypeBorrowerDetail {
  LoanTypeBorrowerDetailId: number;
  LoanTypeCode: string;
  LoanTypeBorrowerId: number;
  IsMainBorrower: boolean;
  BorrowerDetailType: string;
  AddressType: string;
  IsContractingProvince: boolean;
  IsInProvince: boolean;
  IsAllProvince: boolean;
  RegisProvince: string;
  RegisProvinceName: string;
  RowVersion: string;
  RowState: RowState;
  CurrentAddressList: ProvinceList[];
  IdCardAddressList: ProvinceList[];
  WorkplaceAddressList: ProvinceList[];
}

export interface LoanTypeCustomerCredit {
  LoanTypeCustomerCreditId: number;
  LoanTypeCode: string;
  LoanTypeBorrowerId: number;
  CustomerGrade: string;
  AgeNotOver: number;
  NewContractMaximumLimit: number;
  RefinanceMaximumLimit: number;
  RefinanceAdditionalPayment: boolean;
  RowVersion: string;
  RowState: RowState;
}

export interface ProvinceList {
  Value: string;
  TextTha: string;
  TextEng: string;
  Active: boolean;
}

@Injectable()
export class Lomt12Service {
  constructor(private http: HttpClient) { }

  getLoanList(search: any, page: any) {
    const param = {
      Keyword: search.InputSearch,
      sort: page.sort || 'LoanTypeCode ASC',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreementTypeNew/getLoanAgeementTypeList', { params: param });
  }

  getDetail(LoanTypeCode) {
    return this.http.get<any>('loan/LoanAgreementTypeNew/getLoanAgeementTypeDetail', { params: { LoanTypeCode: LoanTypeCode } });
  }

  checkDuplicate(LoanTypeCode) {
    return this.http.get<any>('loan/LoanAgreementTypeNew/checkDuplicate', { params: { LoanTypeCode: LoanTypeCode } });
  }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/LoanAgreementTypeNew/master');
  }

  saveLoanType(data: LoanAgreementType) {
    if (data.RowVersion) {
      return this.http.put<LoanAgreementType>('loan/LoanAgreementTypeNew/UpdateLoanAgreementType', data);
    } else {
      return this.http.post<LoanAgreementType>('loan/LoanAgreementTypeNew/CreateLoanAgreementType', data);
    }
  }

  saveBorrowerLimit(data: LoanTypeBorrower) {
    return this.http.put<LoanTypeBorrower>('loan/LoanAgreementTypeNew/UpdateLoanTypeBorrower', data);
  }

  saveBorrower1Detail(data: LoanTypeBorrowerDetail) {
    if (data.LoanTypeBorrowerDetailId) {
      return this.http.put<LoanTypeBorrowerDetail>('loan/LoanAgreementTypeNew/UpdateBorrower1Detail', data);
    } else {
      return this.http.post<LoanTypeBorrowerDetail>('loan/LoanAgreementTypeNew/CreateBorrower1Detail', data);
    }
  }

  saveCustomerCredit(data: LoanTypeCustomerCredit) {
    if (data.LoanTypeCustomerCreditId) {
      return this.http.put<LoanTypeCustomerCredit>('loan/LoanAgreementTypeNew/UpdateLoanTypeCustomerCredit', data);
    } else {
      return this.http.post<LoanTypeCustomerCredit>('loan/LoanAgreementTypeNew/CreateLoanTypeCustomerCredit', data);
    }
  }

  getCustomerCreditList(search: any, page: any) {
    const param = {
      LoanTypeCode: search.LoanTypeCode,
      sort: page.sort, //|| 'CustomerGradw, cma.AttachmentID',
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/LoanAgreementTypeNew/getCustomerCreditList', { params: param });
  }

  delete(LoanTypeCode, RowVersion) {
    return this.http.delete('loan/LoanAgreementTypeNew/DeleteLoanAgreementType', { params: { LoanTypeCode: LoanTypeCode, RowVersion: RowVersion } })
  }

  checkLoanTypeBorrowerDeatil(LoanTypeCode) {
    return this.http.get<any>('loan/LoanAgreementTypeNew/checkLoanTypeBorrowerDeatil', { params: { LoanTypeCode: LoanTypeCode } });
  }
}
