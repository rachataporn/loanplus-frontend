import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableService, RowState } from '@app/shared';


export interface Contract {
  LoanAgreements: LoanAgreement[]
}

export interface LoanAgreement {
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
  Allowed: boolean;
  ContractNoOld: string;
  Compose: boolean;
  AssessmentQuestions: AssessmentQuestions[];
  Remark: string;
}

export interface AssessmentQuestions {
  ContractAnswerId: number;
  CustomerCode: string;
  QuestionId: number;
  Answer: string;
  AnswerId: number;
  RowVersion: string;
  RowState: RowState;
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
}
export interface ReportParam {
  inputSearch: string,
  ContractNo: string,
  ApprovePaymentOnlineStatus: string,
  ApprovePaymentOnlineDateFrom: Date,
  ApprovePaymentOnlineDateTo: Date,
}

@Injectable()
export class Lots05Service {
  constructor(private http: HttpClient,
    private ts: TableService) { }

  getMaster(): Observable<any> {
    return this.http.get<any>('loan/ApproveLoanAgreement/master/true');
  }

  getLoanAgreement(search: any, page: any) {
    const filter = {
      InputSearch: search.inputSearch || '',
      ContractNo: search.ContractNo || '',
      ApproveStatus: search.ApproveStatus,
      ApproveDateFrom: search.ApproveDateFrom,
      ApproveDateTo: search.ApproveDateTo,
      sort: page.sort,
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      index: page.index,
      size: page.size
    };
    return this.http.get<any>('loan/ApproveLoanAgreement/getLoanAgreementList', { params: filter });
  }

  updateLoanAgreement(Data: LoanAgreement, Allowed) {
    Data.Allowed = Allowed;
    return this.http.unit().put<any>('loan/ApproveLoanAgreement/updateLoanAgreement', Data);
  }

  saveLog(param: SaveL) {
    return this.http.post('system/Log/saveLog', param);
  }

  getAssessmentQuestion(): Observable<any> {
    return this.http.get<any>('loan/ApproveLoanAgreement/getAssessmentQuestion');
  }

  generateReport(param: ReportParam) {
    return this.http.post('loan/ApproveLoanAgreement/getlorp49report', param, { responseType: 'text' });
  }
}
