import { Component, OnInit } from '@angular/core';
import { LangService } from '@app/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '@app/shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Lots07Service } from './lots07.service';

@Component({
    templateUrl: './lots07-lookup-invoice-no.component.html'
})
export class Lots07LookupInvoiceNoComponent implements OnInit {
    itemsLOV = [];
    count = 0;
    page = new Page();
    
    result: Subject<any>;
    searchForm: FormGroup;
    invoiceStatusList = [];
    contractListSelect = [];
    keyword: string;

    constructor(
        public bsModalRef: BsModalRef,
        public as: Lots07Service,
        private fb: FormBuilder,
        public lang: LangService
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            CustomerCode: null,
            CustomerName: null,
            InvoiceDate: null,
            InvoiceNo: null,
            LoanStatus: null
        });
    }

    ngOnInit() {
        this.searchForm.controls.InvoiceNo.setValue(this.keyword);
        this.as.getMaster().subscribe(
            (res) => {
                this.invoiceStatusList = res.InvoiceStatusRadio;
            }
        );
        this.search();

        this.lang.onChange().subscribe(
            () =>
            this.invoiceStatusList = [...this.invoiceStatusList]
          );
    }

    onTableEvent(event) {
        this.page = event;
        this.search();
    }

    search(reset?: boolean) {
        if (reset) this.page.index = 0;
        this.as.getInvoiceNoLOV(this.searchForm.value, this.page)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.itemsLOV = res.Rows ? res.Rows : [];
                    this.page.totalElements = res.Total;
                });
    }

    select(key: string): void {
        this.result.next(key);
        this.bsModalRef.hide();
    }

    close(): void {
        this.result.next(null);
        this.bsModalRef.hide();
    }
}

