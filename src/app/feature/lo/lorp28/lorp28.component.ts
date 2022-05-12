import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp28Service, ReportParam } from './lorp28.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { SelectFilterService } from '../../../shared/service/select-filter.service';

@Component({
  templateUrl: './lorp28.component.html'
})

export class Lorp28Component implements OnInit {
  searchForm: FormGroup;
  provinceList = [];
  branchList = [];
  loanContractType = [];
  reportType = [];
  reportParam = {} as ReportParam;
  submitted: boolean;
  focusToggle: boolean;
  printing: boolean;
  maxDate = null;
  minDate = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ls: Lorp28Service,
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
      ContractType: null,
      ReportType: [null, Validators.required],
    });

    this.searchForm.controls.ReportType.valueChanges.subscribe(
      (control) => {
        if (control == 'NPL_Report_2') {
          this.maxDate = new Date("December 13, 2020 00:00:00");
          this.minDate = null;
        } else if (control == 'NPL_Report') {
          this.maxDate = new Date();
          this.minDate = new Date("December 14, 2020 00:00:00");
        } else {
          this.maxDate = new Date();
          this.minDate = null;
        }
        this.searchForm.controls.ProcessDate.setValue(this.maxDate);
      }
    );
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropdownlist();
    });

    this.route.data.subscribe((data) => {
      this.provinceList = data.lorp28.ProvinceList;
      this.branchList = data.lorp28.BranchList;
      this.loanContractType = data.lorp28.ContractTypeList;
      this.reportType = data.lorp28.ReportType;
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
    this.reportParam.ReportName = this.searchForm.controls.ReportType.value;

    if (this.searchForm.controls.ContractType.value == 'M') {
      this.reportParam.MainContractType = true;
    } else {
      this.reportParam.MainContractType = false;
    }

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
    doc.download = "NPL_Report"
    doc.click();
  }
}
