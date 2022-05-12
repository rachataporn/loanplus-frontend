import { Component, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Page } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Lots24AService } from './lots24A.service';
import { LangService } from '@app/core';

@Component({
    templateUrl: './borrower-lookup.component.html'
})
export class Borrower24ALookupComponent {

    customers = [];
    count: number = 0;
    page = new Page();
    keyword: string = "";
    CustomerMain: string;
    @Output() selected = new EventEmitter<any[]>();
    customerSelected = [];
    constructor(
        public modalRef: BsModalRef,
        public as: Lots24AService,
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
        this.as.getBorrowerLookup(Object.assign({ keyword: this.keyword, CustomerMain: this.CustomerMain }), this.page)
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