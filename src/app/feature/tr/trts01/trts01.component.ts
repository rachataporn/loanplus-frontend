import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, Page, Size, ModelRef } from '@app/shared';
import { Trts01Service, NotifyDto, ContractStatus } from './trts01.service';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './trts01.component.html'
})
export class Trts01Component implements OnInit {
    searchForm: FormGroup;
    contractStatusList = [];
    companyList = [];
    notify: NotifyDto = {} as NotifyDto;
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
        private service: Trts01Service,
        private modal: ModalService,
        public lang: LangService,
        private saveData: SaveDataService
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            Branch: null,
            Status: null,
            Keyword: null,
            ContractStatus: this.fb.array([]),
        });
    }

    ngOnInit() {
        this.lang.onChange().subscribe(() => {
            // this.bindDropDownList();
        });

        this.route.data.subscribe((data) => {
            this.contractStatusList = data.trts01.master.Checkbox;
            this.branchList = data.trts01.master.Branch;

            this.companyList = data.trts01.company;
            this.searchForm.setControl('ContractStatus', this.fb.array(this.contractStatusList.map((detail) => this.contractStatusForm(detail))));
            // this.bindDropDownList();
        });
        // this.page.totalElements = 10;
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
        this.service.getTrackingList( this.searchForm.getRawValue(), this.page).pipe(
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

    edit(TrackingId: number, ) {
        this.router.navigate(['/tr/trts01/detail', { TrackingId: TrackingId }], { skipLocationChange: true });
    }

    add() {
        this.router.navigate(['/tr/trts01/detail'], { skipLocationChange: true });
    }
}
