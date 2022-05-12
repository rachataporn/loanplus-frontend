import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp45Service, ReportParam } from './lorp45.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { SelectFilterService } from '../../../shared/service/select-filter.service';

@Component({
  templateUrl: './lorp45.component.html'
})

export class Lorp45Component implements OnInit {
  searchForm: FormGroup;
  provinceList = [];
  branchList = [];
  loanContractType = [];
  reportParam = {} as ReportParam;
  submitted: boolean;
  focusToggle: boolean;
  printing: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ls: Lorp45Service,
    public lang: LangService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
  ) {
    this.createForm();
  }


  createForm() {
    this.searchForm = this.fb.group({
      ProcessDate: [new Date(), Validators.required],
      ProvinceCode: null,
      FromBranchCode: null,
      ToBranchCode: null,
      ContractType: null
    });
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropdownlist();
    });

    this.route.data.subscribe((data) => {
      this.provinceList = data.lorp45.ProvinceList;
      this.branchList = data.lorp45.BranchList;
      this.loanContractType = data.lorp45.ContractTypeList;
    })
    this.searchForm.controls.ContractType.setValue('M');
    this.bindDropdownlist();
  }

  bindDropdownlist() {
    this.selectFilter.SortByLang(this.provinceList);
    this.selectFilter.FilterActive(this.provinceList);
    this.provinceList = [...this.provinceList];

    this.selectFilter.SortByLang(this.branchList);
    this.selectFilter.FilterActive(this.branchList);
    this.branchList = [...this.branchList];

    this.selectFilter.SortByLang(this.loanContractType);
    this.loanContractType = [...this.loanContractType];
  }

  get ContractType() {
    return this.searchForm.controls.ContractType.value;
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.reportParam.ProcessDate = this.searchForm.controls.ProcessDate.value;
    this.reportParam.ProvinceId = this.searchForm.controls.ProvinceCode.value;
    this.reportParam.CompanyCodeFrom = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.CompanyCodeTo = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.MainContractType = this.searchForm.controls.ContractType.value;



    this.printing = true;
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
        this.printing = false;
      })
    )
      .subscribe((res) => {
        if (res) {
          this.OpenWindow(res)
        }
      });
  }

  async OpenWindow(data) {
    let doc = document.createElement("a");
    doc.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + data;
    doc.download = "LORP45"
    doc.click();
  }
}
