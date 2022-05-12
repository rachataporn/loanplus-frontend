import { Component, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Page } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Lots18Service } from './lots18.service';
import { LangService } from '@app/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    templateUrl: './lots18-customer-lookup.component.html'
})
export class Lots18CustomerLookupComponent {
    customers = [];
    page = new Page();
    result: Subject<any>;
    searchForm: FormGroup;
    keyword: string;

    constructor(
        public modalRef: BsModalRef,
        public as: Lots18Service,
        private lang: LangService,
        private fb: FormBuilder,
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            keyword: null,
            IdCard: null
        });
    }

    ngOnInit() {
        this.searchForm.controls.IdCard.setValue(this.keyword);
        this.search();
    }

    onTableEvent(event) {
        this.page = event;
        this.search();
    }

    search() {
        this.as.getCutomerLookup(this.searchForm.value, this.page)
            .subscribe(
                (res) => {
                    this.customers = res.Rows;
                    this.page.totalElements = res.Total;
                });
    }

    select(key: string): void {
        this.result.next(key);
        this.modalRef.hide();
    }

    close(): void {
        this.result.next(null);
        this.modalRef.hide();
    }
}