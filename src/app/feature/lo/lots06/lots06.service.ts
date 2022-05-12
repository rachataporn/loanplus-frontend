import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableService, RowState } from '@app/shared';


export interface Contract {
  LoanAgreements: LoanAgreement[]
}

export class LoanAgreement {
  ContractHeadId: number;
  CompanyCode: string;
  CustomerCode: string;
  CustomerNameTha: string;
  CustomerNameEng: string;
  ContractDate: Date;
  ContractNo: string;
  AppLoanPrincipleAmount: number;
  AppLoanInterestAmount: number;
  Amount: number;
  ApprovedDate: Date;
  TransferDate: Date;
  StartInterestDate: Date;
  StartPaymentDate: Date;
  ReqGapPeriod: number;
  ReqTotalMonth: number;
  RowVersion: string;
  AppLoanInterestRate: number;
  AppLoanTotalPeriod: number;
  Compose: boolean;
}

export interface ReportParam {
  inputSearch: string,
  ContractNo: string,
  ApprovePaymentOnlineStatus: string,
  ApprovePaymentOnlineDateFrom: Date,
  ApprovePaymentOnlineDateTo: Date,
}

@Injectable()
export class Lots06Service {
  constructor(private http: HttpClient,
    private ts: TableService) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/ApproveLoanTransferAgreement/master/true');
  }

  getLoanAgreement(search: any, page: any) {
    const filter = {
      InputSearch: search.inputSearch || '',
      ContractNo: search.ContractNo || '',
      ApprovePaymentOnlineStatus: search.ApprovePaymentOnlineStatus,
      ApprovePaymentOnlineDateFrom: search.ApprovePaymentOnlineDateFrom,
      ApprovePaymentOnlineDateTo: search.ApprovePaymentOnlineDateTo,
      sort: page.sort,
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/ApproveLoanTransferAgreement/getLoanTranferAgreementList', { params: filter });
  }

  updateLoanTranferAgreement(Data: LoanAgreement) {
    return this.http.unit().put<any>('loan/ApproveLoanTransferAgreement/updateLoanTranferAgreement', Data);
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/ApproveLoanTransferAgreement/getlorp48report', param, { responseType: 'text' });
  }

  updateMultipleLoanTranferAgreement(Data: any) {
    return this.http.unit().put<any>('loan/ApproveLoanTransferAgreement/updateMultipleLoanTranferAgreement', Data);
  }
}
