import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots03Service, ContractStatus } from '@app/feature/lo/lots03/lots03.service';
import { Page, ModalService, ModalRef, Size, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
    templateUrl: './lots03.component.html'
})

export class Lots03Component implements OnInit {
    searchForm: FormGroup;
    page = new Page();
    loanAgreement = [];
    company = [];
    loanType = [];
    loanContractType = [];
    loanContractStatus = [];
    submitted: boolean;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private modal: ModalService,
        private fb: FormBuilder,
        private lots03Service: Lots03Service,
        public lang: LangService,
        private saveData: SaveDataService,
        private as: AlertService,
        private selectFilter: SelectFilterService,
    ) {
        this.createForm();
    }

    createForm() {

        this.searchForm = this.fb.group({
            keyword: null,
            CompanyCode: null,
            LoanTypeCode: null,
            ContractType: null,
            ContractStatus: this.fb.array([])
        });

        this.searchForm.valueChanges.subscribe(() => this.page.index = 0);
    }

    contractStatusForm(item: ContractStatus): FormGroup {
        let fg = this.fb.group({
            Value: null,
            TextTha: null,
            TextEng: null,
            Active: false
        });

        fg.patchValue(item, { emitEvent: false });
        return fg;
    }

    get keyword() {
        return this.searchForm.controls.keyword.value;
    }

    get CompanyCode() {
        return this.searchForm.controls.CompanyCode.value;
    }

    get LoanTypeCode() {
        return this.searchForm.controls.LoanTypeCode.value;
    }

    get ContractType() {
        return this.searchForm.controls.ContractType.value;
    }

    get contractStatus(): FormArray {
        return this.searchForm.get('ContractStatus') as FormArray;
    };

    ngOnInit() {
        let saveData = this.saveData.retrive("LOTS03");
        if (saveData) this.searchForm.patchValue(saveData);

        this.lang.onChange().subscribe(() => {
            this.bindDropdownlist();
        });

        this.route.data.subscribe((data) => {
            this.company = data.lots03.Companys;
            this.loanType = data.lots03.loanTypes;
            this.loanContractType = data.lots03.ContractType;
            this.loanContractStatus = data.lots03.ContractStatus;
        })
        this.searchForm.setControl('ContractStatus', this.fb.array(this.loanContractStatus.map((detail) => this.contractStatusForm(detail))));
        this.searchForm.controls.ContractType.setValue('M');
        this.bindDropdownlist();
        this.search();
    }

    bindDropdownlist() {
        this.selectFilter.SortByLang(this.company);
        this.company = [...this.company];
        this.selectFilter.SortByLang(this.loanType);
        this.selectFilter.FilterActive(this.loanType);
        this.loanType = [...this.loanType];
    }

    ngOnDestroy() {
        this.saveData.save(this.searchForm.value, "LOTS03");
    }

    onTableEvent(event) {
        this.search();
    }

    search() {
        var selected = [];
        this.searchForm.controls.ContractStatus.value.forEach(element => {
            if (element.Active) {
                selected.push(element.Value);
            }
        });
        this.lots03Service.getLoanAgreement(Object.assign({
            keyword: this.keyword,
            CompanyCode: this.CompanyCode,
            LoanTypeCode: this.LoanTypeCode,
            ContractType: this.ContractType,
            ContractStatus: selected.join(",")
        }), this.page)
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.loanAgreement = res.Rows;
                    this.page.totalElements = res.Total;
                });
    }

    add() {
        this.router.navigate(['/lo/lots04'], { skipLocationChange: true });
    }

    edit(id, event) {
        if (event.which == 3) {
            const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots03' }], { skipLocationChange: true }));
            window.open(url, '_blank');
        } else {
            this.router.navigate(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots03' }], { skipLocationChange: true });
        }
    }

    clickContractType() {
        this.search();
    }
}
