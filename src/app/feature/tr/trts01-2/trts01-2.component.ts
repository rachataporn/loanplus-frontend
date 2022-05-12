import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, Page, Size, ModelRef, ModalRef } from '@app/shared';
import { Trts0102Service, NotifyDto } from './trts01-2.service';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './trts01-2.component.html'
})
export class Trts0102Component implements OnInit {
    notify: NotifyDto = {} as NotifyDto;
    focusToggleSerch: boolean;
    sendSmsList = [{
        BranchCode: 'BRM01'
        , DueDate: '20/02/2563'
        , ContractNo: 'BRM0163-00006'
        , Name: 'ยศกร บางทิพย์'
        , Total: '50,000'
        , Before: ''
        , Current: 'ไม่ได้ติดตาม'
        , TrDate: '25/02/2563'
    }];
    page = new Page();
    branchList = []
    lineStatus = [];
    selected = [];
    saving: boolean;
    submitted: boolean;
    loanData: any;
    changePopup: ModalRef;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private service: Trts0102Service,
        private modal: ModalService,
        public lang: LangService,
        private saveData: SaveDataService
    ) {
        this.createForm();
    }

    createForm() {
    }
    open(content) {
        this.changePopup = this.modal.open(content, Size.medium);
    }
    closeReset() {
        this.changePopup.hide();
    }
    ngOnInit() {
        this.branchList = [{ Value: 'BRM01', Text: 'BRM01: บริษัท เพื่อนแท้ เงินด่วน (บุรีรัมย์) จำกัด' }]
        this.page.totalElements = 10;
        // this.search();
    }

    onTableEvent(event) {
        this.page = event;
        this.search();
    }

    search() {
        this.page = new Page();
        this.onSearch();
    }

    onSearch() {
        this.service.getTrackingSMSList(this.page).pipe(
            finalize(() => {
                this.submitted = false;
                this.selected = [];
            }))
            .subscribe(
                (res: any) => {
                    this.sendSmsList = res.Rows ? res.Rows : [];
                    this.page.totalElements = res.Total;
                });
    }

    loanDetailOutput(loanDetail) {
        this.loanData = {};
        this.loanData = loanDetail;
    }

    onSendSms() {
        if (this.selected.length > 0) {
            this.notify.Notify = [];
            Object.assign(this.notify.Notify, this.selected);
            this.service.sendNotifyLine(this.notify)
                .pipe(finalize(() => { this.search(); }))
                .subscribe(
                    (res: any) => { });
            this.as.success('Message.LO00016', '');
        } else {
            this.as.warning('Message.LO00017', '');
        }
    }

    clickStatus() {
        this.search();
    }
    next() {
        this.router.navigate(['/tr/trts01-2/detail'], { skipLocationChange: true });
    }
}
