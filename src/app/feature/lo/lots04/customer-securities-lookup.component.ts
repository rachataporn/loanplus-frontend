import { Component, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Page} from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Lots04Service } from './lots04.service';
import { LangService } from '@app/core';

@Component({
    templateUrl: './customer-securities-lookup.component.html'
})
export class CustomerSecuritiesLookupComponent {

    customers = [];
    count: number = 0;
    page = new Page();
    

    keyword: string = "";
    @Output() selected = new EventEmitter<any[]>();
    customerSelected = [];
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