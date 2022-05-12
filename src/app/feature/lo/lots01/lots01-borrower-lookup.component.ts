import { Component, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Page } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Lots01Service } from './lots01.service';
import { LangService } from '@app/core';

@Component({
    templateUrl: './lots01-borrower-lookup.component.html'
})
export class Lots01BorrowerLookupComponent {

    customers = [];
    count: number = 0;
    page = new Page();
    keyword: string = "";
    CustomerMain: string;
    IsRefinance: boolean;
    @Output() selected = new EventEmitter<any[]>();
    customerSelected = [];
    constructor(
        public modalRef: BsModalRef,
        public as: Lots01Service,
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

        this.as.getBorrowerLookup(Object.assign({ keyword: this.keyword, CustomerMain: this.CustomerMain, IsRefinance: this.IsRefinance }), this.page)
            .pipe(finalize(() => { this.customerSelected = []; }))
            .subscribe(
                (res) => {
                    this.customers = res.Rows;
                    this.page.totalElements = res.Total;
                });
    }

    select(): void {
        this.selected.next(this.customerSelected);
        this.modalRef.hide();
    }

    close(): void {
        this.selected.next([]);
        this.modalRef.hide();
    }
}