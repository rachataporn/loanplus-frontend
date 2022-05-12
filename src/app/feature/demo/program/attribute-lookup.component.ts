import { Component, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AttributeLookupService } from './attribute-lookup.service';
import { Page } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: './attribute-lookup.component.html'
})
export class AttributeLookupComponent {

    attributes = [];
    count: number = 0;
    page = new Page();

    keyword: string = "";
    parameter: any = {};
    @Output() selected = new EventEmitter<any[]>();
    attributeSelected = [];
    constructor(
        public modalRef: BsModalRef,
        public as: AttributeLookupService
    ) { }

    ngOnInit() {
        this.search();
    }

    onTableEvent(event) {
        this.page = event;
        this.search();
    }

    search() {
        this.as.getAttributes(Object.assign(this.parameter, { keyword: this.keyword }), this.page)
            .pipe(finalize(() => { this.attributeSelected = []; }))
            .subscribe(
                (res: any[]) => {
                    this.attributes = res;
                    this.count = res.length;
                });
    }

    select(): void {
        this.selected.next(this.attributeSelected);
        this.modalRef.hide();
    }

    close(): void {
        this.selected.next([]);
        this.modalRef.hide();
    }
}