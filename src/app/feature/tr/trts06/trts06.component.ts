import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Trts06Service } from '@app/feature/tr/trts06/trts06.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
    templateUrl: './trts06.component.html'
})

export class Trts06Component implements OnInit {
    searchForm: FormGroup;
    contractStatusList = [];
    List = [];
    page = new Page();
    branchList = []
    lineStatus = [];
    selected = [];
    saving: boolean;
    submitted: boolean;
    loanData: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private service: Trts06Service,
        private modal: ModalService,
        public lang: LangService,
        private saveData: SaveDataService
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            Keyword: null,
        });
    }

    ngOnInit() {
        this.onSearch();
    }

    onTableEvent(event) {
        this.page = event;
        this.onSearch();
    }

    onSearch() {
        this.service.getTrackingList(this.searchForm.getRawValue(), this.page).pipe(
            finalize(() => {
                this.submitted = false;
            }))
            .subscribe(
                (res: any) => {
                    this.List = res.Rows ? res.Rows : [];
                    this.page.totalElements = res.Total;
                });
    }

    loanDetailOutput(loanDetail) {
        this.loanData = {};
        this.loanData = loanDetail;
    }

    edit(TrackingId: number,) {
        this.router.navigate(['/tr/trts06/detail', { TrackingId: TrackingId }], { skipLocationChange: true });
    }

    add() {
        this.router.navigate(['/tr/trts06/detail'], { skipLocationChange: true });
    }
}
