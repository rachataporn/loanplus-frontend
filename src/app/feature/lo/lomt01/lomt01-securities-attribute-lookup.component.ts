import { Component, Output, EventEmitter } from '@angular/core';
import { LangService } from '@app/core';
import { finalize } from 'rxjs/operators';
import { Lomt01Service } from './lomt01.service';
import { Page } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
    templateUrl: './lomt01-securities-attribute-lookup.component.html'
})
export class Lomt01SecuritiesAttributeLookupComponent {

    attributes = [];
    page = new Page();
    statusPage: boolean;
    searchForm: FormGroup;
    parameter: any = {};
    @Output() selected = new EventEmitter<any[]>();
    attributeSelected = [];
    constructor(
        private fb: FormBuilder,
        public modalRef: BsModalRef,
        public lomt01Service: Lomt01Service,
        public lang: LangService
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            keywords: null
        });
    }


    ngOnInit() {
        this.search();
    }

    // onTableEvent(event) {
    //     this.page = event;
    //     this.search();
    // }

    // search() {
    //     this.lomt01Service.getSecuritiesAttribute(this.keyword, this.page)
    //         .subscribe(
    //             (res: any) => {
    //                 this.attributes = res.Rows;
    //                 this.page.totalElements = res.Rows.length ? res.Total : 0;
    //             });
    // }

    onTableEvent(event) {
        this.page = event;
        this.statusPage = false;
        this.search();
    }

    onSearch() {
        this.page.index = 0;
        this.statusPage = true;
        this.search();
    }

    search() {
        this.lomt01Service.getSecuritiesAttribute(this.searchForm.value, this.page)
            .pipe(finalize(() => { }))
            .subscribe(
                (res: any) => {
                    this.attributes = res.Rows;
                    this.page.totalElements = res.Rows.length ? res.Total : 0;
                });
    }


    getSelectData() {
        if (this.attributeSelected.length > 0) {
            return false;
        } else {
            return true;
        }
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