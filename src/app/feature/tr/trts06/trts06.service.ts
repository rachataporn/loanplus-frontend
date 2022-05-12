import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    CanSendLawDepartment: boolean;
}

@Injectable()
export class Trts06Service {
    constructor(private http: HttpClient) { }

    getMaster(): Observable<any> {
        return this.http.get<any>('tracking/SubmitLaw/master');
    }

    getTrackingList(form: any, page: any) {
        const param = {
            Keyword: form.Keyword,
            Sort: page.sort,
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('tracking/SubmitLaw/getSearchMaster', { params: param });
    }

    getSearchEdit(TrackingId) {
        return this.http.get<any>('tracking/SubmitLaw/getSearchEdit', { params: { TrackingId: TrackingId } });
    }

    getSearchAmount(MainContractHeadId) {
        return this.http.get<any>('tracking/SubmitLaw/getSearchAmount', { params: { MainContractHeadId: MainContractHeadId } });
    }

    getBorrowerList(MainContractHeadId) {
        return this.http.get<any>('tracking/SubmitLaw/getBorrowerList', { params: { MainContractHeadId: MainContractHeadId } });
    }

    saveRequestRoan(data: Tracking) {
        return this.http.post<Tracking>('tracking/SubmitLaw/saveTrakingQuery', data);
    }

    GetCustomerLOV(searchForm: any, page: any) {
        const param = {
            CustomerCode: searchForm.CustomerCode,
            CustomerName: searchForm.CustomerName,
            Sort: page.sort || '',
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('tracking/SubmitLaw/customerLOV', { params: param });
    }

    getContractList(CustomerCode) {
        return this.http.get<any>('tracking/SubmitLaw/getContractList', { params: { CustomerCode: CustomerCode } });
    }

    getMobileNumberOther(CustomerCode) {
        return this.http.get<any>('tracking/trackingActivity/getMobileNumberOther', { params: { CustomerCode: CustomerCode } });
    }
}




