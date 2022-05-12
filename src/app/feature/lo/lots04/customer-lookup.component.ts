import { Component, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Page } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Lots04Service } from './lots04.service';
import { LangService } from '@app/core';
import { Subject } from 'rxjs';

@Component({
    templateUrl: './customer-lookup.component.html'
})
export class CustomerLookupComponent {

    customers = [];
    count: number = 0;
    page = new Page();
    keyword: string = "";
    result: Subject<any>;

    constructor(
        public modalRef: BsModalRef,
        public as: Lots04Service,
        private lang: LangService,
    ) { }

    ngOnInit() {
        this.search();
    }

    onTableEvent(event) {
        this.page = event;
        this.search();
    }

    search() {
        this.as.getCutomerLookup(Object.assign({ keyword: this.keyword }), this.page)
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.customers = res.Rows;
                    this.page.totalElements = res.Total;
                });
    }

    select(customer): void {
        this.result.next(customer);
        this.modalRef.hide();
    }

    close(): void {
        this.result.next(null);
        this.modalRef.hide();
    }
}