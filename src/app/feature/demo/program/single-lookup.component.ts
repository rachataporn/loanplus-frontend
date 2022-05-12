import { Component, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SingleLookupService } from './single-lookup.service';
import { Page } from '@app/shared';

@Component({
    templateUrl: './single-lookup.component.html'
})
export class SingleLookupComponent {
    listItems = [];
    page = new Page();
    parameter:any={};
    keyword: string;
    result: Subject<any>;

    constructor(
        public bsModalRef: BsModalRef,
        public ss: SingleLookupService
    ) { }

    ngOnInit() {
        this.search();
    }

    onTableEvent() {
        this.search();
    }

    search(reset?:boolean) {
        if(reset) this.page.index = 0;
        this.ss.getListItem(Object.assign(this.parameter,{ keyword: this.keyword }), this.page)
            .subscribe(
                (res) => {
                    this.listItems = res.Rows;
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