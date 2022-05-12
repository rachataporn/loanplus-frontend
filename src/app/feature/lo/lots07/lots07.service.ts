import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RowState } from '@app/shared';

export interface LoInvoiceHead {
    InvoiceHeadId: number;
    MainContractHeadId: number;
    ContractPeriodId: number;
    PaymentHeadId: number;
    CompanyCode: string;
    InvoiceNo: string;
    InvoiceDate: Date;
    InputDate: Date;
    RefInvoiceId: number;
    InvoiceStatus: string;
    PaidStatus: string;
    PrintStatus: string;
    EmailStatus: string;
    LineStatus: string;
    Remark: string;
    CanceledDate: Date;
    CanceledBy: string;
    CancelRemark: string;
    CurrencyCode: string;
    CreditTermCode: string;
    DueDate: Date;
    TotalAmount: number;
    PaidAmount: number;
    DocSource: string;
    PdfPath: string;
    CreatedBy: string;
    ContractNo: string;
    InvoiceStatusTha: string;
    InvoiceStatusEng: string;
    PrintStatusTha: string;
    PrintStatusEng: string;
    EmailStatusTha: string;
    EmailStatusEng: string;
    LineStatusTha: string;
    LineStatusEng: string;
    CustomerCode: string;
    CustomerNameTha: string;
    CustomerNameEng: string;
    MobileNo: string;
    DocSourceTha: string;
    DocSourceEng: string;
    Period: number;
    RowVersion: string,
    ReceiveDate: Date;
    Details: LoInvoiceDetail[];
    InvoiceDetails: LoInvoiceDetail[];
}

export interface LoInvoiceDetail {
    InvoiceDetailId: number;
    InvoiceHeadId: number;
    ContractHeadId: number;
    CustomerNameTha: string;
    CustomerNameEng: string;
    GuarantorNameTha: string;
    GuarantorNameEng: string;
    PeriodAmount: number;
    FineAmount: number;
    TrackingAmount: number;
    AccruedAmount: number;
    TotalAmount: number;
    DeleteStatus: boolean;
    RowVersion: string;
    RowState: RowState;
}

export interface NotifyDto {
    Notify: NotifyDtoList[];
}

export interface NotifyDtoList {
    DueDate: Date;
    CommunicationType: string;
    InvoiceNo: string;
}

export interface InvoiceHeaderPrint {
    reportName: string;
    outPath: string;
    fileName: string;
    itemData: InvoiceDetailPrint
}

export interface InvoiceDetailPrint {
    IvCustomerName: string;
    IvCustomerNameJoin: string;
    IvCustomerAddress: string;
    IvContractNo: string;
    IvInvoiceDate: Date;
    IvPeriod: number;
    IvTotalAmount: number;
    IvTotalAmountText: string;
    IvContractDueDate: Date;
    IvInvoiceNo: string;
    IvPrincipleAmount: number;
    IvInterestAmount: number;
    company_code: string;
    iv_branch_code: string;
    Date: Date;
    type: string;
}

export interface ReportDto {
    InvoiveHead: NotifyDtoList[];
}

export interface NotifyDtoList {
    InvoiceHeadId: number;
    InvoiceNo: string;
    pdfPath: string;
    CompanyCode: string;
}

@Injectable()
export class Lots07Service {
    constructor(private http: HttpClient) { }

    getMaster(): Observable<any> {
        return this.http.get<any>('loan/invoice/master');
    }

    getInvoiceDDL(LoanNo: string) {
        const param = {
            LoanNo: LoanNo
        };
        return this.http.get<any>('loan/invoice/invoiceDDL', { params: param });
    }

    getInvoiceStatusDDL(Status) {
        const param = {
            Status: Status
        };
        return this.http.get<any>('loan/invoice/invoiceStatusDDL', { params: param });
    }

    sendNotifyLine(data: NotifyDto) {
        return this.http.post<any>('loan/invoice/sendNotifyLine', data);
    }

    sendNotifyEmail(data: NotifyDto) {
        return this.http.post<any>('loan/invoice/sendNotifyEmail', data);
    }

    printInvoice(data: ReportDto) {
        return this.http.post<any>('loan/invoice/printInvoice', data);
    }

    getContractNoLOV(searchForm: any, page: any) {
        const param = {
            LoanNo: searchForm.LoanNo,
            CustomerCode: searchForm.CustomerCode,
            CustomerName: searchForm.CustomerName,
            LoanDate: searchForm.LoanDate,
            LoanStatus: searchForm.LoanStatus,
            LovStatus: searchForm.LovStatus,
            Sort: page.sort || 'ContractNo ContractDate Remark CustomerCode desc',
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('loan/invoice/contractNoLOV', { params: param });
    }

    getInvoiceNoLOV(searchForm: any, page: any) {
        const param = {
            CustomerCode: searchForm.CustomerCode,
            CustomerName: searchForm.CustomerName,
            InvoiceDate: searchForm.InvoiceDate,
            InvoiceNo: searchForm.InvoiceNo,
            LoanStatus: searchForm.LoanStatus,
            Sort: page.sort || 'InvoiceNo InvoiceDate CustomerCode desc',
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('loan/invoice/invoiceNoLOV', { params: param });
    }

    checkInvoice(ContractHeadId) {
        const param = {
            ContractHeadId: ContractHeadId
        };
        return this.http.get<any>('loan/invoice/checkInvoice', { params: param });
    }

    searchDataInvoiceForSave(ContractHeadId, ContractPeriodId) {
        const param = {
            ContractHeadId: ContractHeadId, 
            ContractPeriodId: ContractPeriodId
        };
        return this.http.get<LoInvoiceHead>('loan/invoice/searchDataInvoiceForSave', { params: param });
    }

    getInvoiceList(searchForm: any, page: any) {
        const param = {
            Customer: searchForm.Customer,
            EmailStatus: searchForm.EmailStatus,
            InvoiceDateFrom: searchForm.InvoiceDateFrom,
            InvoiceDateTo: searchForm.InvoiceDateTo,
            InvoiceNoFrom: searchForm.InvoiceNoFrom,
            InvoiceNoTo: searchForm.InvoiceNoTo,
            InvoiceStatus: searchForm.InvoiceStatus,
            LineStatus: searchForm.LineStatus,
            LoanNo: searchForm.LoanNo,
            PrintStatus: searchForm.PrintStatus,
            EndDueDate: searchForm.EndDueDate,
            StartDueDate: searchForm.StartDueDate,
            Sort: page.sort || 'InvoiceDate InvoiceNo LoanNo Period desc',
            Index: page.index,
            Size: page.size
        };
        return this.http.get<any>('loan/invoice/invoiceList', { params: param });
    }

    cancelInvoice(InvoiceHeadId: string) {
        const param = {
            InvoiceHeadId: InvoiceHeadId
        };
        return this.http.get<any>('loan/invoice/cancelInvoice', { params: param });
    }

    getDataDefult() {
        return this.http.get<any>('loan/invoice/invoicDataDefault');
    }

    getInvoiceHead(InvoiceHeadId: string) {
        const param = {
            InvoiceHeadId: InvoiceHeadId
        };
        return this.http.get<LoInvoiceHead>('loan/invoice/invoiceHead', { params: param });
    }

    saveInvoice(data: LoInvoiceHead) {
        if (data.RowVersion) {
            return this.http.unit().put<LoInvoiceHead>('loan/invoice/updateInvoice', data);
        } else {
            return this.http.unit().post<LoInvoiceHead>('loan/invoice/insertInvoice', data);
        }
    }

    generate(date: string) {
        const param = {
            CurrentDate: date
        };
        return this.http.unit().get<any>('loan/invoice/generate', { params: param });
    }

    getInvoicePeriod(ContractHeadId) {
        const param = {
            ContractHeadId: ContractHeadId
        };
        return this.http.get<any>('loan/invoice/invoicePeriod', { params: param });
    }
}
