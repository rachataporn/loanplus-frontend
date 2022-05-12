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
    TrackingAttachment: TrackingAttachment[];

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
export class Trts02Service {
    constructor(private http: HttpClient) { }

    getMaster(): Observable<any> {
        return this.http.get<any>('tracking/TrackingHome/master');
    }

    getCompany() {
        return this.http.get<any>('tracking/TrackingHome/getCompany');
    }

    // sendNotifyLine(data: NotifyDto) {
    //     return this.http.put<any>('tracking/TrackingSMS/sendNotifySms', data);
    // }

    getTrackingList(form: any, page: any) {
        const param = {
            CompanyCode: form.Branch,
            Status: form.Status,
            Keyword: form.Keyword,
            MeetingHome: form.MeetingHome,
            Sort: page.sort,
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('tracking/TrackingHome/getSearchMaster', { params: param });
    }

    getSearchEdit(TrackingId) {
        return this.http.get<any>('tracking/TrackingHome/getSearchEdit', { params: { TrackingId: TrackingId } });
    }

    getSearchHistoryCall(CustomerCode: any, page: any) {
        const param = {
            CustomerCode: CustomerCode,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/TrackingHome/getSearchHistoryCall', { params: param });
    }

    getSearchHistoryCompany(CustomerCode: any, page: any) {
        const param = {
            CustomerCode: CustomerCode,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/TrackingHome/getSearchHistoryCompany', { params: param });
    }

    getSearchHistoryHome(CustomerCode: any, page: any) {
        const param = {
            CustomerCode: CustomerCode,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/TrackingHome/getSearchHistoryHome', { params: param });
    }

    getSearchHistoryAttach(MainContractHeadId: any, page: any) {
        const param = {
            MainContractHeadId: MainContractHeadId,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/TrackingHome/getSearchHistoryAttach', { params: param });
    }

    getSearchAmount(MainContractHeadId) {
        return this.http.get<any>('tracking/TrackingHome/getSearchAmount', { params: { MainContractHeadId: MainContractHeadId } });
    }

    getBorrowerList(MainContractHeadId) {
        return this.http.get<any>('tracking/TrackingHome/getBorrowerList', { params: { MainContractHeadId: MainContractHeadId } });
    }

    saveRequestRoan(data: Tracking) {
        return this.http.post<Tracking>('tracking/TrackingHome/saveTrakingQuery', data);
    }

    // generateReport(param: ReportParam) {
    //     return this.http.post('tracking/TrackingHome/getHistoryReport', param, { responseType: 'text' });
    // }

    generateReportRf02(param: ReportParamLorf02) {
        return this.http.post('loan/loanagreementreport/getlorf02report', param, { responseType: 'text' });
    }

    generateReportLorp15(param: ReportParamLorp15) {
        return this.http.post('loan/loanoverduereceivablesreport/getlorp15report', param, { responseType: 'text' });
    }

    GetCustomerLOV(searchForm: any, page: any) {
        const param = {
            CustomerCode: searchForm.CustomerCode,
            CustomerName: searchForm.CustomerName,
            Sort: page.sort || '',
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('tracking/TrackingHome/customerLOV', { params: param });
    }

    getContractList(CustomerCode) {
        return this.http.get<any>('tracking/TrackingHome/getContractList', { params: { CustomerCode: CustomerCode } });
    }

    getMobileNumberOther(CustomerCode) {
        return this.http.get<any>('tracking/trackingActivity/getMobileNumberOther', { params: { CustomerCode: CustomerCode } });
    }
}




