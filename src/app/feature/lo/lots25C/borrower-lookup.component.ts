import { Component, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Page } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Lots25CService } from './lots25C.service';
import { LangService } from '@app/core';

@Component({
    templateUrl: './borrower-lookup.component.html'
})
export class Borrower25CLookupComponent {

    customers = [];
    count: number = 0;
    page = new Page();
    keyword: string = "";
    CustomerMain: string;
    @Output() selected = new EventEmitter<any[]>();
    customerSelected = [];
    constructor(
        public modalRef: BsModalRef,
        public as: Lots25CService,
        private lang: LangService,
    ) { }

    ngOnInit() {
        console.log(" into Borrower25LookupComponent ngOnInit() ")
        this.search();
    }

    onTableEvent(event) {
        this.page = event;
        this.search();
    }

    search() {
        console.log(" into Borrower25LookupComponent  search() ") 
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