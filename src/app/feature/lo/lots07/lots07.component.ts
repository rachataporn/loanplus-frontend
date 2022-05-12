import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, Page, Size, ModelRef } from '@app/shared';
import { Lots07Service, NotifyDto, InvoiceHeaderPrint, InvoiceDetailPrint, ReportDto } from './lots07.service';
import { finalize } from 'rxjs/operators';
import { Lots07LookupComponent } from './lots07-lookup.component';
import { Lots07LookupInvoiceNoComponent } from './lots07-lookup-invoice-no.component';

@Component({
    templateUrl: './lots07.component.html'
})
export class Lots07Component implements OnInit {
    Lots07LookupContent = Lots07LookupComponent;
    Lots07LookupInvoiceNoContent = Lots07LookupInvoiceNoComponent;
    popup: ModelRef;
    SearchForm: FormGroup;
    generateInvoiceForm: FormGroup;
    notify: NotifyDto = {} as NotifyDto;
    invoiceHeaderPrint: InvoiceHeaderPrint = {} as InvoiceHeaderPrint;
    invoiceDetailPrint: InvoiceDetailPrint = {} as InvoiceDetailPrint;
    reportDto: ReportDto = {} as ReportDto;
    focusToggleSerch: boolean
    invoiceList = [];
    invoiceDDL = [];
    count: number = 0;
    page = new Page();

    keywords: string = '';
    invoiceStatus = [];
    printStatus = [];
    emailStatus = [];
    lineStatus = [];
    selected = [];
    saving: boolean;
    printing: boolean;
    submitted: boolean;
    loanData: any;
    reportUrl: string;

    beforeSearch = '';
    statusPage: boolean;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private service: Lots07Service,
        private modal: ModalService,
        public lang: LangService,
        private saveData: SaveDataService
    ) {
        this.createForm();
    }

    createForm() {
        this.SearchForm = this.fb.group({
            LoanNo: null,
            InvoiceDateFrom: null,
            InvoiceDateTo: null,
            StartDueDate: null,
            EndDueDate: null,
            InvoiceNoFrom: null,
            InvoiceNoTo: null,
            Customer: null,
            InvoiceStatus: '1',
            PrintStatus: null,
            EmailStatus: null,
            LineStatus: null,
            flagSearch: true,
            beforeSearch: null,
            page: new Page(),
        });
        this.generateInvoiceForm = this.fb.group({
            Date: null,
        });
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.invoiceStatus = data.route.master.InvoiceStatusRadio ? data.route.master.InvoiceStatusRadio : [];
            this.invoiceStatus.push(
                { Value: null, TextTha: "ทั้งหมด", TextEng: "All" }
            );
            this.printStatus = data.route.master.PrintStatusRadio ? data.route.master.PrintStatusRadio : [];
            this.printStatus.push(
                { Value: null, TextTha: "ทั้งหมด", TextEng: "All" }
            );
            this.emailStatus = data.route.master.EmailStatusRadio ? data.route.master.EmailStatusRadio : [];
            this.emailStatus.push(
                { Value: null, TextTha: "ทั้งหมด", TextEng: "All" }
            );
            this.lineStatus = data.route.master.LineStatusRadio ? data.route.master.LineStatusRadio : [];
            this.lineStatus.push(
                { Value: null, TextTha: "ทั้งหมด", TextEng: "All" }
            );
            this.invoiceDDL = data.route.invoiceDDL.InvoiceList ? data.route.invoiceDDL.InvoiceList : [];
        });

        const saveData = this.saveData.retrive('LOTS07');
        if (saveData) {
            this.SearchForm.patchValue(saveData);
        }
        this.page = this.SearchForm.controls.page.value;
        if (!this.SearchForm.controls.flagSearch.value) {
            this.beforeSearch = this.SearchForm.controls.beforeSearch.value;
            this.statusPage = this.SearchForm.controls.flagSearch.value;
        } else {
            this.statusPage = true;
        }
        this.onSearch();
    }

    onTableEvent(event) {
        this.page = event;
        this.statusPage = false;
        this.onSearch();
    }

    search() {
        this.page = new Page();
        this.statusPage = true;
        if (this.SearchForm.controls.Customer.value) {
            this.SearchForm.controls.Customer.setValue(this.SearchForm.controls.Customer.value.trim());
        }
        this.onSearch();
    }

    onSearch() {
        this.service.getInvoiceList(this.statusPage ? (this.SearchForm.value) : this.beforeSearch, this.page)
            .pipe(finalize(() => {
                this.submitted = false;
                this.selected = [];
                if (this.statusPage) {
                    this.beforeSearch = this.SearchForm.value;
                    this.SearchForm.controls.beforeSearch.reset();
                    this.SearchForm.controls.page.setValue(this.page);
                    this.SearchForm.controls.beforeSearch.setValue(this.SearchForm.value);
                }
            }))
            .subscribe(
                (res: any) => {
                    this.invoiceList = res.Rows ? res.Rows : [];
                    this.page.totalElements = res.Rows.length ? res.Total : 0;
                });
    }

    modalGenerateInvoice(content) {
        this.popup = this.modal.open(content, Size.small);
    }

    closeModal() {
        this.generateInvoiceForm.reset();
        this.popup.hide();
    }

    GenerateInvoice() {
        this.service.generate(this.generateInvoiceForm.controls.Date.value).pipe(
            finalize(() => { }))
            .subscribe(
                (res: any) => {
                    this.search();
                    this.closeModal();
                });
    }

    loanDetailOutput(loanDetail) {
        this.loanData = {};
        this.loanData = loanDetail;
        this.SearchForm.controls.LoanNo.setValue(this.loanData.ContractNo);
        this.getInvoiceDDL();
    }

    getInvoiceDDL() {
        this.service.getInvoiceDDL(this.SearchForm.controls.LoanNo.value)
            .pipe(finalize(() => {
                this.SearchForm.controls.InvoiceNoFrom.setValue(null);
                this.SearchForm.controls.InvoiceNoTo.setValue(null);
            }))
            .subscribe(
                (res: any) => {
                    this.invoiceDDL = res.InvoiceList;
                });
    }

    onSendEMail() {
        if (this.selected.length > 0) {
            this.notify.Notify = [];
            Object.assign(this.notify.Notify, this.selected)
            this.service.sendNotifyEmail(this.notify)
                .pipe(finalize(() => { }))
                .subscribe(
                    (res: any) => { });
            this.as.success('Message.LO00015', '');
            this.search();
        } else {
            this.as.warning('Message.LO00017', '');
        }
    }

    onSendLine() {
        if (this.selected.length > 0) {
            this.notify.Notify = [];
            Object.assign(this.notify.Notify, this.selected)
            this.service.sendNotifyLine(this.notify)
                .pipe(finalize(() => { }))
                .subscribe(
                    (res: any) => { });
            this.as.success('Message.LO00016', '');
            this.search();
        } else {
            this.as.warning('Message.LO00017', '');
        }
    }

    onPrint() {
        if (this.selected.length > 0) {
            this.reportDto.InvoiveHead = [];
            Object.assign(this.reportDto.InvoiveHead, this.selected)
            this.service.printInvoice(this.reportDto)
                .pipe(finalize(() => { this.search(); }))
                .subscribe(
                    (res: any) => {
                        if (res.reports != undefined) {
                            if (res.reports.length > 0) {
                                res.reports.forEach(item => {
                                    this.OpenWindow(item.data);
                                });
                            }
                        }
                    });
        } else {
            this.as.warning('Message.LO00017', '');
        }
    }

    async OpenWindow(data) {
        await window.open(data, '_blank');
    }

    closeModalReport() {
        this.popup.hide();
    }

    add() {
        this.router.navigate(['lo/lots07/detail'], { skipLocationChange: true });
    }

    edit(row) {
        this.router.navigate(['lo/lots07/detail', { InvoiceHeadId: row.InvoiceHeadId, ContractHeadId: row.ContractHeadId }], { skipLocationChange: true });
    }

    cancelInvoice(row) {
        if (row.InvoiceStatus == '1') {
            this.modal.confirm('Message.LO00018').subscribe(
                (confirm) => {
                    if (confirm) {
                        this.service.cancelInvoice(row.InvoiceHeadId)
                            .pipe(finalize(() => { }))
                            .subscribe(
                                (res: any) => {
                                    this.search();
                                });
                    }
                });
        } else {
            this.as.warning('Message.LO00019', '');
        }
    }

    clickStatus() {
        this.search();
    }

    ngOnDestroy() {
        if (this.router.url.split('/')[2] === 'lots07') {
            this.SearchForm.controls.flagSearch.setValue(false);
            this.saveData.save(this.SearchForm.value, 'LOTS07');
        } else {
            this.saveData.delete('LOTS07');
        }
    }

}
