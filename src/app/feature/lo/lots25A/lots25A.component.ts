import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots25AService, ContractStatus ,  RequestStatus , AcceptStatus } from '@app/feature/lo/lots25A/lots25A.service';
import { Page, ModalService, ModalRef, Size, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
    templateUrl: './lots25A.component.html'
})

export class Lots25AComponent implements OnInit {
    searchForm: FormGroup;
    page = new Page();
    loanAgreement = [];
    company = [];
    loanType = [];
    loanContractType = [];
    loanContractStatus = [];
    loanRequestStatus = [];
    loanAcceptStatus = [];
    submitted: boolean;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private modal: ModalService,
        private fb: FormBuilder,
        private lots25Service: Lots25AService,
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
            ContractStatus: this.fb.array([]),
            RequestStatus: this.fb.array([]),
            AcceptStatus: this.fb.array([]),
            DateFrom: null,
            DateTo: null,
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

    requestStatusForm(item: RequestStatus): FormGroup {
        let fg = this.fb.group({
            Value: null,
            TextTha: null,
            TextEng: null,
            Active: false
        });

        fg.patchValue(item, { emitEvent: false });
        if(fg.value.Value=='WB') fg.controls.Active.setValue(true);

        return fg;
    }

    acceptStatusForm(item: AcceptStatus): FormGroup {
        console.log(" acceptStatusForm  item ");
        let fg = this.fb.group({
            Value: null,
            TextTha: null,
            TextEng: null,
            Active: false
        });
    
        fg.patchValue(item, { emitEvent: false });
        console.log(" fg : ");
        console.log(fg);

        if(fg.value.Value=='W') fg.controls.Active.setValue(true);
    
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

    get requestStatus(): FormArray {
        return this.searchForm.get('RequestStatus') as FormArray;
    };

    get acceptStatus(): FormArray {
        return this.searchForm.get('AcceptStatus') as FormArray;
    };

    get DateFrom() {
        return this.searchForm.controls.DateFrom.value;
    }

    get DateTo() {
        return this.searchForm.controls.DateTo.value;
    }

    ngOnInit() {
        let saveData = this.saveData.retrive("LOTS25A");
        if (saveData) this.searchForm.patchValue(saveData);

        this.lang.onChange().subscribe(() => {
            this.bindDropdownlist();
        });

        this.route.data.subscribe((data) => {
            console.log(" start data ")
            console.log(data)
            console.log(" end data ")
            this.company = data.lots25A.Companys;
            this.loanType = data.lots25A.loanTypes;
            this.loanContractType = data.lots25A.ContractType;
            this.loanContractStatus = data.lots25A.ContractStatus;
            this.loanRequestStatus = data.lots25A.RequestStatus;
            this.loanAcceptStatus = data.lots25A.AcceptStatus;
        })
        this.searchForm.setControl('RequestStatus', this.fb.array(this.loanRequestStatus.map((detail) => this.requestStatusForm(detail))));
        this.searchForm.setControl('AcceptStatus', this.fb.array(this.loanAcceptStatus.map((detail) => this.acceptStatusForm(detail))));
        this.searchForm.controls.ContractType.setValue('M');
        this.bindDropdownlist();
        //set Search Default
        this.buildForm();
        this.search();
    }

    buildForm() {

    }

    bindDropdownlist() {
        this.selectFilter.SortByLang(this.company);
        this.company = [...this.company];
        this.selectFilter.SortByLang(this.loanType);
        this.selectFilter.FilterActive(this.loanType);
        this.loanType = [...this.loanType];
    }

    ngOnDestroy() {
        this.saveData.save(this.searchForm.value, "LOTS25A");
    }

    onTableEvent(event) {
        this.search();
    }

    search() {
        var selectedRequest = [];
        var selectedAccept = [];
        this.searchForm.controls.RequestStatus.value.forEach(element => {
            if (element.Active) {
                selectedRequest.push(element.Value);
            }
        });
        this.searchForm.controls.AcceptStatus.value.forEach(element => {
            if (element.Active) {
                selectedAccept.push(element.Value);
            }
        });
        this.lots25Service.getContractManagement(Object.assign({
            keyword: this.keyword,
            CompanyCode: this.CompanyCode,
            LoanTypeCode: this.LoanTypeCode,
            ContractType: this.ContractType,
            RequestStatus: selectedRequest.join(","),
            DateFrom: this.DateFrom,
            DateTo: this.DateTo,
            AcceptStatus: selectedAccept.join(","),
            ProgramType:'N'
        }), this.page)
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    console.log("  res ")
                    console.log(res)
                    console.log("  --- res --- ")
                    this.loanAgreement = res.Rows;
                    this.page.totalElements = res.Total;
                });
    }

 

    edit(id, event) {
        if (event.which == 3) {
            const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots25/detail', { id: id, backToPage: '/lo/lots25' }], { skipLocationChange: true }));
            window.open(url, '_blank');
        } else {
            this.router.navigate(['/lo/lots25/detail', { id: id, backToPage: '/lo/lots25' }], { skipLocationChange: true });
        }
    }

    clickContractType() {
        this.search();
    }
}
