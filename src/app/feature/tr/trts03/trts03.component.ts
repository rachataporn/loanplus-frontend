import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Trts03Service, ContractStatus } from '@app/feature/tr/trts03/trts03.service';
import { Page, ModalService, ModalRef, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService, AuthService } from '@app/core';

@Component({
    templateUrl: './trts03.component.html'
})

export class Trts03Component implements OnInit {
    searchForm: FormGroup;
    contractStatusList = [];
    companyList = [];
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
        private service: Trts03Service,
        private modal: ModalService,
        public lang: LangService,
        private saveData: SaveDataService
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            Branch: null,
            Keyword: null,
            Status: null,
            MeetingHome: null,
            ContractStatus: this.fb.array([]),
        });
    }

    ngOnInit() {
        this.lang.onChange().subscribe(() => {
        });

        this.route.data.subscribe((data) => {
            this.contractStatusList = data.trts03.master.Checkbox;
            this.branchList = data.trts03.master.Branch;

            this.companyList = data.trts03.company;
            this.searchForm.setControl('ContractStatus', this.fb.array(this.contractStatusList.map((detail) => this.contractStatusForm(detail))));
        });
        this.onSearch();
    }

    get contractStatus(): FormArray {
        return this.searchForm.get('ContractStatus') as FormArray;
    };

    contractStatusForm(item: ContractStatus): FormGroup {
        let fg = this.fb.group({
            Value: null,
            TextTha: null,
            TextEng: null,
            Active: false,
        });
        fg.patchValue(item, { emitEvent: false });
        return fg;
    }

    onTableEvent(event) {
        this.page = event;
        this.onSearch();
    }

    onSearch() {
        let selected = [];
        let selectedText = '';
        let contractValue = null;
        this.searchForm.controls.ContractStatus.value.forEach(element => {
            if (element.Active) {
                selected.push(element.Value);
                selectedText += this.lang.CURRENT === 'Tha' ? element.TextTha + ', ' : element.TextEng + ', ';
            }
        });
        if (selected.length === 0 || selected.length === this.searchForm.controls.ContractStatus.value.length) {
            contractValue = null;
            selectedText = '';
        } else {
            contractValue = selected.join(',');
        }
        this.searchForm.controls.Status.setValue(contractValue);
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
        this.router.navigate(['/tr/trts03/detail', { TrackingId: TrackingId }], { skipLocationChange: true });
    }

    add() {
        this.router.navigate(['/tr/trts03/detail'], { skipLocationChange: true });
    }
}
