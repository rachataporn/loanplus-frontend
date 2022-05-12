import { Component, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Page} from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Lots24BService } from './lots24B.service';
import { LangService } from '@app/core';

@Component({
    templateUrl: './customer-lookup.component.html'
})
export class Lots24BCustomerLookupComponent {

    customers = [];
    count: number = 0;
    page = new Page();
    

    keyword: string = "";
    @Output() selected = new EventEmitter<any[]>();
    customerSelected = [];
    constructor(
        public modalRef: BsModalRef,
        public as: Lots24BService,
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
            .pipe(finalize(() => {  this.customerSelected = []; }))
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