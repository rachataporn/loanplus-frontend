import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface NotifyDto {
    Notify: NotifyDtoList[];
}

export interface NotifyDtoList {
    // DueDate: Date;
    TrackingId: number;
    TrackingNo: string;
    ContractHeadId: number;
    TrackingItemId: number;
    // TrackingStatus: string;
    // MobileNumber: string;
}

export interface ReportParam {
    TrackingItemCode: string;
    CustomerCode: string;
    CompanyCode: string;
    ReportCode: string;
    ReportName: string;
    ExportType: string;
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
    LawTrackingStatus: string;
    RowVersion: string;
    TrackingAttachment: TrackingAttachment[];
}

export interface ContractStatus {
    StatusValue: string,
    RowState: string,
    Active: boolean,
}

export interface TrackingAttachment {
    TrackingAttachmentId: number,
    AttahmentId: number,
    FilePath: string,
    FileName: string,
    Description: string,
    RowState: RowState,
    CreatedDate: string,
    CreatedBy: string
}

@Injectable()
export class Trts01Service {
    constructor(private http: HttpClient) { }

    GetCustomerLOV(searchForm: any, page: any) {
      const param = {
        CustomerCode: searchForm.CustomerCode,
        CustomerName: searchForm.CustomerName,
        Sort: page.sort || '',
        Index: page.index,
        Size: page.size
      };
      return this.http.get<any>('tracking/trackingActivity/customerLOV', { params: param });
    }

    getMaster(): Observable<any> {
        return this.http.get<any>('tracking/trackingActivity/master');
    }

    getCompany() {
        return this.http.get<any>('tracking/trackingActivity/getCompany');
    }

    // sendNotifyLine(data: NotifyDto) {
    //     return this.http.put<any>('tracking/TrackingSMS/sendNotifySms', data);
    // }

    getTrackingList(form: any, page: any) {
        const param = {
            CompanyCode: form.Branch,
            Status: form.Status,
            Keyword: form.Keyword,
            Sort: page.sort,
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('tracking/trackingActivity/getSearchMaster', { params: param });
    }

    getSearchEdit(TrackingId) {
        return this.http.get<any>('tracking/trackingActivity/getSearchEdit', { params: { TrackingId: TrackingId } });
    }

    getSearchHistoryCall(CustomerCode: any, page: any) {
        const param = {
            CustomerCode: CustomerCode,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/trackingActivity/getSearchHistoryCall', { params: param });
    }

    getSearchHistoryCompany(CustomerCode: any, page: any) {
        const param = {
            CustomerCode: CustomerCode,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/trackingActivity/getSearchHistoryCompany', { params: param });
    }

    getSearchHistoryHome(CustomerCode: any, page: any) {
        const param = {
            CustomerCode: CustomerCode,
            sort: page.sort,
            index: page.index,
            size: page.size
        };
        return this.http.get<any>('tracking/trackingActivity/getSearchHistoryHome', { params: param });
    }

    getSearchAmount(MainContractHeadId) {
        return this.http.get<any>('tracking/trackingActivity/getSearchAmount', { params: { MainContractHeadId: MainContractHeadId } });
    }

    getBorrowerList(MainContractHeadId) {
        return this.http.get<any>('tracking/trackingActivity/getBorrowerList', { params: { MainContractHeadId: MainContractHeadId } });
    }

    saveRequestRoan(data: Tracking) {
        return this.http.post<Tracking>('tracking/trackingActivity/saveTrakingQuery', data);
    }

    generateReport(param: ReportParam) {
        return this.http.post('tracking/trackingActivity/getHistoryReport', param, { responseType: 'text' });
    }

    getContractList(CustomerCode) {
        return this.http.get<any>('tracking/trackingActivity/getContractList', { params: { CustomerCode: CustomerCode } });
    }

    getMobileNumberOther(CustomerCode) {
        return this.http.get<any>('tracking/trackingActivity/getMobileNumberOther', { params: { CustomerCode: CustomerCode } });
    }
}
