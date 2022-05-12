import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface ReportParamLorf02 {
    FromContractNo: string,
    ToContractNo: string,
    ReportName: string,
    ExportType: string,
}

export interface Tracking {
    TrackingId: number;
    MainContractHeadId: number;
    TrackingDate: Date;
    DueDate: Date;
    MeetingDate: Date;
    MeetingHome: Date;
    MeetingNpl: Date;
    AuctionDate: Date;
    CallTrackingStatus: string;
    HomeTrackingStatus: string;
    NplTrackingStatus: string;
    Remark: string;
    ContractNo: string;
    MobileNo: string;
    CustomerCode: string;
    CustomerNameTha: string;
    CountTime: number;
    TotalAmount: number;
    ProfileImage: string;
    RowVersion: string;
    LawTrackingStatus: string;
    ApproveLossDescription: string;
    OwnerDeadthDate: string;
    CostSue: number;
    TrackingAttachment: TrackingAttachment[];
    CostExecute: number;
}

export interface ReportParamNotice {
    TrackingNo: string,
}

export interface ContractStatus {
    StatusValue: string,
    RowState: string,
    Active: boolean,
}

export interface ReportParamLorp15 {
    FromBranchCode: string;
    ToBranchCode: string;
    FromLoanType: string;
    ToLoanType: string;
    AsOfDate: Date;
    FromContractNo: string;
    ToContractNo: string;
    FromCustomerCode: string;
    ToCustomerCode: string;
    ReportFormat: string;
    ReportName: string;
    ExportType: string;
    FromBranchText: string;
    ToBranchText: string;
    FromLoanTypeText: string;
    ToLoanTypeText: string;
    FromCustomerCodeText: string;
    ToCustomerCodeText: string;
    FromContractCodeText: string;
    ToContractCodeText: string;
}

export interface AttachHis {
    ContractAttachmentId: number,
    ContractHeadId: number,
    AttachmentTypeCode: string,
    AttachmentType: string,
    FilePath: string,
    FileName: string,
    Description: string,
    AttahmentId: number
}

export interface TrackingAttachment {
    TrackingAttachmentId: number,
    FilePath: string,
    FileName: string,
    Description: string,
    AttahmentId: number,
    RowState: RowState,
    CreatedDate: string,
    CreatedBy: string
}

@Injectable()
export class Trts04Service {
    constructor(private http: HttpClient) { }

    getMaster(): Observable<any> {
        return this.http.get<any>('tracking/TrackingLaw/master');
    }

    getCompany() {
        return this.http.get<any>('tracking/TrackingLaw/getCompany');
    }

    // sendNotifyLine(data: NotifyDto) {
    //     return this.http.put<any>('tracking/TrackingSMS/sendNotifySms', data);
    // }

    getTrackingList(form: any, page: any) {
        const param = {
            CompanyCode: form.Branch,
            Status: form.Status,
            Keyword: form.Keyword,
            TrackingDate: form.TrackingDate,
            TrackingCause: form.TrackingCause,
            Sort: page.sort,
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('tracking/TrackingLaw/getSearchMaster', { params: param });
    }

    getSearchEdit(TrackingId) {
        return this.http.get<any>('tracking/TrackingLaw/getSearchEdit', { params: { TrackingId: TrackingId } });
    }

    getSearchHistoryCall(CustomerCode: any, page: any) {
        const param = {
            CustomerCode: CustomerCode,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/TrackingLaw/getSearchHistoryCall', { params: param });
    }

    getSearchHistoryCompany(CustomerCode: any, page: any) {
        const param = {
            CustomerCode: CustomerCode,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/TrackingLaw/getSearchHistoryCompany', { params: param });
    }

    getSearchHistoryHome(CustomerCode: any, page: any) {
        const param = {
            CustomerCode: CustomerCode,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/TrackingLaw/getSearchHistoryHome', { params: param });
    }

    getSearchHistoryLaw(CustomerCode: any, page: any) {
        const param = {
            CustomerCode: CustomerCode,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/TrackingLaw/getSearchHistoryLaw', { params: param });
    }

    getSearchHistoryAttach(MainContractHeadId: any, page: any) {
        const param = {
            MainContractHeadId: MainContractHeadId,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/trackingActivity/getSearchHistoryAttach', { params: param });
    }

    getSearchAmount(MainContractHeadId) {
        return this.http.get<any>('tracking/TrackingLaw/getSearchAmount', { params: { MainContractHeadId: MainContractHeadId } });
    }

    getBorrowerList(MainContractHeadId) {
        return this.http.get<any>('tracking/TrackingLaw/getBorrowerList', { params: { MainContractHeadId: MainContractHeadId } });
    }

    saveRequestRoan(data: Tracking) {
        return this.http.post<Tracking>('tracking/TrackingLaw/saveTrakingQuery', data);
    }

    // generateReport(param: ReportParam) {
    //     return this.http.post('tracking/TrackingLaw/getHistoryReport', param, { responseType: 'text' });
    // }

    generateReportRf02(param: ReportParamLorf02) {
        return this.http.post('loan/loanagreementreport/getlorf02report', param, { responseType: 'text' });
    }

    generateReportLorp15(param: ReportParamLorp15) {
        return this.http.post('loan/loanoverduereceivablesreport/getlorp15report', param, { responseType: 'text' });
    }

    generateNotice(param: ReportParamNotice) {
        return this.http.post('tracking/TrackingLaw/printNotice', param, { responseType: 'text' });
    }

    GetCustomerLOV(searchForm: any, page: any) {
        const param = {
            CustomerCode: searchForm.CustomerCode,
            CustomerName: searchForm.CustomerName,
            Sort: page.sort || '',
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('tracking/TrackingLaw/customerLOV', { params: param });
    }

    getContractListByCustomer(CustomerCode) {
        return this.http.get<any>('tracking/TrackingLaw/getContractList', { params: { CustomerCode: CustomerCode } });
    }

    processCloseContract(data) {
        return this.http.post('tracking/TrackingLaw/closeContract', data);
    }

    GetCustomerLawLOV(searchForm: any, page: any) {
        const param = {
            CustomerCode: searchForm.CustomerCode,
            CustomerName: searchForm.CustomerName,
            Sort: page.sort || '',
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('tracking/TrackingLaw/customerLawLOV', { params: param });
    }

    getContractList(CustomerCode) {
        return this.http.get<any>('tracking/TrackingLaw/getContractListLaw', { params: { CustomerCode: CustomerCode } });
    }

    getMobileNumberOther(CustomerCode) {
        return this.http.get<any>('tracking/trackingActivity/getMobileNumberOther', { params: { CustomerCode: CustomerCode } });
    }
}




