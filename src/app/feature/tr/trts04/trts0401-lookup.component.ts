import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LangService } from '@app/core';
import { Page } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Trts04Service } from './trts04.service';

@Component({
    templateUrl: './trts0401-lookup.component.html'
})
export class Trts0401LookupComponent implements OnInit {
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
        public as: Trts04Service,
        private fb: FormBuilder,
        public lang: LangService,
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            CustomerCode: null,
            CustomerName: null,
            LovStatus: 'search'
        });
    }

    ngOnInit() {
        this.searchForm.controls.CustomerCode.setValue(this.keyword);
        this.search();
    }

    onTableEvent(event) {
        this.page = event;
        this.search();
    }

    search(reset?: boolean) {
        if (reset) {
            this.page.index = 0;
        }
        this.as.GetCustomerLawLOV(this.searchForm.value, this.page)
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

