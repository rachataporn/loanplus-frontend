import { Component, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { Lots13Service } from '@app/feature/lo/lots13/lots13.service';
import { Page } from '@app/shared';
import { LangService } from '@app/core';
import { Subject } from 'rxjs';

@Component({
    templateUrl: './lots13-history-verify-detail.component.html'
})
export class SecuritiesHistoryVerifyDetailPopupComponent {
    securitiesCode: string;
    isSuperUser: boolean;
    securitiesCategoryId: string;

    verifydetail = [];
    pageVerify = new Page();
    saving: boolean;
    submitted: boolean;
    savingVerify: boolean;
    focusToggle: boolean;
    @Output() selected = new EventEmitter<string>();
    subject: Subject<any>;

    contractDetail = [];
    pageContract = new Page();

    constructor(
        public bsModalRef: BsModalRef,
        public lots13Service: Lots13Service,
        public lang: LangService
    ) { }

    ngOnInit() {
        this.searchVerify();
        this.searchContract();
    }

    searchVerify() {
        this.lots13Service.getVerify(this.securitiesCode, this.pageVerify)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.verifydetail = res.Rows;
                    this.pageVerify.totalElements = res.Rows.length ? res.Total : 0;
                });
    }

    onTableEventVerify(event) {
        this.pageVerify = event;
        this.searchVerify();
    }

    onTableEventContract(event) {
        this.pageContract = event;
        this.searchContract();
    }

    searchContract() {
        this.lots13Service.getHistoryContract(this.securitiesCode, this.pageContract)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.contractDetail = res.Rows;
                    this.pageContract.totalElements = res.Rows.length ? res.Total : 0;
                });
    }

    close(): void {
        this.selected.next('');
        this.bsModalRef.hide();
    }

    convertSecuritiesStatus() {
        this.lots13Service.convertSecuritiesStatus(this.securitiesCode)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: string) => {
                    this.selected.next(res);
                    this.bsModalRef.hide();
                });
    }
}