import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ContractStatus, Trts04Service } from '@app/feature/tr/trts04/trts04.service';
import { ModalService, Page } from '@app/shared';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
    templateUrl: './trts04.component.html'
})
export class Trts04Component implements OnInit {
    searchForm: FormGroup;
    contractStatusList = [];
    companyList = [];
    List = [];
    page = new Page();
    branchList = [];
    lineStatus = [];
    selected = [];
    trackingCauseList = [];
    saving: boolean;
    submitted: boolean;
    loanData: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private service: Trts04Service,
        private modal: ModalService,
        public lang: LangService
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            Branch: null,
            Keyword: null,
            Status: null,
            TrackingDate: null,
            TrackingCause: '',
            ContractStatus: this.fb.array([]),
        });
    }

    ngOnInit() {
        this.lang.onChange().subscribe(() => {
        });

        this.route.data.subscribe((data) => {
            this.contractStatusList = data.trts04.master.Checkbox;
            this.branchList = data.trts04.master.Branch;
            this.trackingCauseList = data.trts04.master.TrackingCause;
            this.companyList = data.trts04.company;
            this.searchForm.setControl('ContractStatus'
                , this.fb.array(this.contractStatusList.map((detail) => this.contractStatusForm(detail))));
        });
        this.onSearch();
    }

    get contractStatus(): FormArray {
        return this.searchForm.get('ContractStatus') as FormArray;
    }

    contractStatusForm(item: ContractStatus): FormGroup {
        const fg = this.fb.group({
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
        const selected = [];
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
        this.searchForm.controls.TrackingCause.value;
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

    edit(TrackingId: number) {
        this.router.navigate(['/tr/trts04/detail', { TrackingId: TrackingId }], { skipLocationChange: true });
    }

    processCloseContract(row) {
        this.modal.confirm('Message.LO00064').subscribe(
            (res) => {
                if (res) {
                    this.submitted = true;
                    const param = {
                        ContractNo: row.ContractNo
                    };
                    this.service.processCloseContract(param).pipe(
                        finalize(() => {
                            this.submitted = false;
                        }))
                        .subscribe((res: any) => {
                            if (!res) {
                                this.onSearch();
                                this.as.success('', 'Message.LO00065');
                            } else {
                                if (res.error) {
                                    this.as.error('', res.error);
                                }
                            }
                        });
                }
            }
        );
    }

    add() {
        this.router.navigate(['/tr/trts04/detail'], { skipLocationChange: true });
    }
}
