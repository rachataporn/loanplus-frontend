import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Trrp02Service, ContractStatus, ReportParam } from '@app/feature/tr/trrp02/trrp02.service';
import { Page, ModalService, ModalRef, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService, AuthService } from '@app/core';

@Component({
    templateUrl: './trrp02.component.html'
})

export class Trrp02Component implements OnInit {
    reportParam = {} as ReportParam;
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
        private service: Trrp02Service,
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
            Strat: null,
            End: null,
            ContractStatus: this.fb.array([]),
        });
    }

    ngOnInit() {
        this.lang.onChange().subscribe(() => {
            // this.bindDropDownList();
        });

        this.route.data.subscribe((data) => {
            this.contractStatusList = data.trrp02.master.Checkbox;
            this.branchList = data.trrp02.master.Branch;
            this.companyList = data.trrp02.company;
            this.searchForm.setControl('ContractStatus', this.fb.array(this.contractStatusList.map((detail) => this.contractStatusForm(detail))));
        });
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

    print() {
        let selected = [];
        let selectedText = '';
        let contractValue = null;
        if (selected.length === 0 || selected.length === this.searchForm.controls.ContractStatus.value.length) {
            contractValue = null;
            selectedText = '';
        } else {
            contractValue = selected.join(',');
        }
        this.searchForm.controls.Status.setValue(contractValue);
        // this.printing = true;
        this.reportParam.Branch = this.searchForm.controls.Branch.value;
        this.reportParam.Strat = this.searchForm.controls.Strat.value;
        this.reportParam.End = this.searchForm.controls.End.value;
        this.reportParam.Status = this.searchForm.controls.Status.value;
        this.reportParam.ReportCode = 'TRRP02';
        this.reportParam.ExportType = 'PDF';
        this.service.generateReport(this.reportParam).pipe(
            finalize(() => {
                // this.printing = false;
            })
        )
            .subscribe((res: any) => {
                if (res) {
                    // this.srcResult = res;
                    this.OpenWindow(res, "รายงานการติดตามหนี้ที่บ้านสำหรับสาขา");
                }
            });
    }

    async OpenWindow(data, name) {
        let doc = document.createElement("a");
        doc.href = "data:application/pdf;base64," + data;
        doc.download = name + ".pdf"
        doc.click();
    }


}
