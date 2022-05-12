import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, Page, Size, ModalRef } from '@app/shared';
import { Lots08Service } from './lots08.service';
import { finalize } from 'rxjs/operators';
import { Lots08ContractLookupComponent } from './lots08-contract-lookup.component';
import { Lots08InvoiceLookupComponent } from './lots08-invoice-lookup.component';

@Component({
    templateUrl: './lots08.component.html'
})
export class Lots08Component implements OnInit {
    Lots08ContractLookupContent = Lots08ContractLookupComponent;
    Lots08InvoiceLookupContent = Lots08InvoiceLookupComponent
    searchForm: FormGroup;
    paymentList = [];
    count: number = 0;
    page = new Page();
    focusToggle: boolean;
    searched: boolean;
    invoiceStatus = [];
    paidStatus = [];
    beforeSearch = '';
    statusPage: boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private lots08Service: Lots08Service,
        private saveData: SaveDataService,
        public lang: LangService,
        private modal: ModalService
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            Keyword: null,
            // ContractNoFrom: null,
            // ContractNoTo: null,
            ContractDateFrom: null,
            ContractDateTo: null,
            InvoiceNoFrom: null,
            InvoiceNoTo: null,
            InvoiceDateFrom: null,
            InvoiceDateTo: null,
            StartDueDate: null,
            EndDueDate: null,
            // CustomerCode: null,
            PaidStatus: '',
            flagSearch: true,
            beforeSearch: null,
            page: new Page(),
        });
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.paidStatus = data.payment.PaidStatus;
        });
        const saveData = this.saveData.retrive('LOTS08');
        if (saveData) { this.searchForm.patchValue(saveData); }

        this.page = this.searchForm.controls.page.value;
        if (!this.searchForm.controls.flagSearch.value) {
            this.beforeSearch = this.searchForm.controls.beforeSearch.value;
            this.statusPage = this.searchForm.controls.flagSearch.value;
        } else {
            this.statusPage = true;
        }
        this.onSearch();
    }

    onTableEvent(event) {
        this.page = event;
        this.statusPage = false;
        this.onSearch();
    }

    search() {
        this.page = new Page();
        this.statusPage = true;
        if (this.searchForm.controls.Keyword.value) {
            this.searchForm.controls.Keyword.setValue(this.searchForm.controls.Keyword.value.trim());
        }
        this.onSearch();
    }

    onSearch() {
        this.searched = true;
        this.lots08Service.getPaymentList(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
            .pipe(finalize(() => {
                this.searched = false;
                if (this.statusPage) {
                    this.beforeSearch = this.searchForm.value;
                    this.searchForm.controls.beforeSearch.reset();
                    this.searchForm.controls.page.setValue(this.page);
                    this.searchForm.controls.beforeSearch.setValue(this.searchForm.value);
                }
            }))
            .subscribe(
                (res: any) => {
                    this.paymentList = res.Rows;
                    this.page.totalElements = res.Rows.length ? res.Total : 0;
                });
    }

    edit(MainContractHeadID, FlagPayOff) {
        this.router.navigate(['/lo/lots08/detail', { MainContractHeadID: MainContractHeadID, FlagPayOff: FlagPayOff, CompanyCode: localStorage.getItem('company') }], {
            skipLocationChange: true
        });
    }

    advancePayment(MainContractHeadID) {
        this.router.navigate(['/lo/lots17/detail', { MainContractHeadID: MainContractHeadID }], {
            skipLocationChange: true
        });
    }

    ngOnDestroy() {
        if (this.router.url.split('/')[2] === 'lots08') {
            this.searchForm.controls.flagSearch.setValue(false);
            this.saveData.save(this.searchForm.value, 'LOTS08');
        } else {
            this.saveData.delete('LOTS08');
        }
    }
}
