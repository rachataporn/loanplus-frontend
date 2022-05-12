import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots26Service } from '@app/feature/lo/lots26/lots26.service';
import { Page, SelectFilterService } from '@app/shared';
import { LangService, SaveDataService } from '@app/core';

@Component({
    templateUrl: './lots26.component.html'
})

export class Lots26Component implements OnInit {
    searchForm: FormGroup;
    page = new Page();
    loanAgreement = [];
    company = [];
    loanType = [];
    submitted: boolean;
    signatureStatusList = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private lots26Service: Lots26Service,
        public lang: LangService,
        private saveData: SaveDataService,
        private selectFilter: SelectFilterService,
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            keyword: null,
            CompanyCode: null,
            LoanTypeCode: null,
            SignatureStatus: ''
        });

        this.searchForm.valueChanges.subscribe(() => this.page.index = 0);
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

    get SignatureStatus() {
        return this.searchForm.controls.SignatureStatus.value;
    }

    ngOnInit() {
        let saveData = this.saveData.retrive("LOTS26");
        if (saveData) this.searchForm.patchValue(saveData);

        this.lang.onChange().subscribe(() => {
            this.bindDropdownlist();
        });

        this.route.data.subscribe((data) => {
            this.company = data.lots26.Companys;
            this.loanType = data.lots26.loanTypes;
            this.signatureStatusList = data.lots26.SignatureStatusList;
        })
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
        this.saveData.save(this.searchForm.value, "LOTS26");
    }

    onTableEvent(event) {
        this.search();
    }

    search() {
        this.lots26Service.getLoanAgreement(Object.assign({
            keyword: this.keyword,
            CompanyCode: this.CompanyCode,
            LoanTypeCode: this.LoanTypeCode,
            SignatureStatus: this.SignatureStatus
        }), this.page)
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.loanAgreement = res.Rows;
                    this.page.totalElements = res.Total;
                });
    }

    edit(id, signature, event) {
        if (event.which == 3) {
            const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots26/detail', { id: id, isSignature: signature }], { skipLocationChange: true }));
            window.open(url, '_blank');
        } else {
            this.router.navigate(['/lo/lots26/detail', { id: id, isSignature: signature }], { skipLocationChange: true });
        }
    }

    clickSignatureStatus() {
        this.search();
    }
}
