import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots24AService, ContractStatus, RequestStatus , AcceptStatus  } from '@app/feature/lo/lots24A/lots24A.service';
import { Page, ModalService, ModalRef, Size, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
    templateUrl: './lots24A.component.html'
})

export class Lots24AComponent implements OnInit {
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
   // RequestNumber:string;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private modal: ModalService,
        private fb: FormBuilder,
        private lots24AService: Lots24AService,
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
            RequestNumber: null,
            LoanTypeCode: null,
            ContractType: null,
            ContractStatus: this.fb.array([]),
            RefinanceNo: null,
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
        let fg = this.fb.group({
            Value: null,
            TextTha: null,
            TextEng: null,
            Active: false
        });

        fg.patchValue(item, { emitEvent: false });
        if(fg.value.Value=='W') fg.controls.Active.setValue(true);
        return fg;
    }

    get keyword() {
        return this.searchForm.controls.keyword.value;
    }

    get RequestNumber() {
        return this.searchForm.controls.RequestNumber.value;
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

    get RefinanceNo() {
        return this.searchForm.controls.RefinanceNo.value;
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
        let saveData = this.saveData.retrive("LOTS24A");
        if (saveData) this.searchForm.patchValue(saveData);

        this.lang.onChange().subscribe(() => {
            this.bindDropdownlist();
        });

        this.route.data.subscribe((data) => {
            this.company = data.lots24A.Companys;
            this.loanType = data.lots24A.loanTypes;
            this.loanContractType = data.lots24A.ContractType;
            this.loanContractStatus = data.lots24A.ContractStatus;
            this.loanRequestStatus = data.lots24A.RequestStatus; 
            this.loanAcceptStatus = data.lots24A.AcceptStatus;
        })
        this.searchForm.setControl('RequestStatus', this.fb.array(this.loanRequestStatus.map((detail) => this.requestStatusForm(detail))));
        this.searchForm.setControl('AcceptStatus', this.fb.array(this.loanAcceptStatus.map((detail) => this.acceptStatusForm(detail))));
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
        this.saveData.save(this.searchForm.value, "LOTS24A");
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
        this.lots24AService.getContractManagement(Object.assign({
            keyword: this.keyword,
            CompanyCode: this.CompanyCode,
            RequestNumber: this.RequestNumber,
            LoanTypeCode: this.LoanTypeCode,
            ContractType: this.ContractType,
            RefinanceNo: this.RefinanceNo,
            ContractStatus: selectedRequest.join(","),
            RequestStatus: selectedRequest.join(","),
            AcceptStatus: selectedAccept.join(","),
            DateFrom:this.DateFrom,
            DateTo:this.DateTo,
            ProgramType:'R'
        }), this.page)
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.loanAgreement = res.Rows;
                    this.page.totalElements = res.Total;
                });
    }

    edit(id,OldContractId, event) {
        if (event.which == 3) {
            const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots24/detail', { id: id,OldContractId: OldContractId, backToPage: '/lo/lots24' }], { skipLocationChange: true }));
            window.open(url, '_blank');
        } else {
            this.router.navigate(['/lo/lots24/detail', { id: id,OldContractId: OldContractId, backToPage: '/lo/lots24' }], { skipLocationChange: true });
        }
    }

    clickContractType() {
        this.search();
    }
}
