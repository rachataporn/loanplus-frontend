import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp49Service, ReportParam } from './lorp49.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { SelectFilterService } from '../../../shared/service/select-filter.service';

@Component({
  templateUrl: './Lorp49.component.html'
})

export class Lorp49Component implements OnInit {
  searchForm: FormGroup;
  reportParam = {} as ReportParam;
  submitted: boolean;
  focusToggle: boolean;
  printing: boolean;
  FromBranchList = [];
  ToBranchList = [];
  now = new Date();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ls: Lorp49Service,
    public lang: LangService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      FromBranchCode: null,
      ToBranchCode: null,
      FromDate: null,
      ToDate: null,
    });
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropdownlist();
    });

    this.route.data.subscribe((data) => {
      this.FromBranchList = data.lorp49.Branch;
      this.ToBranchList = data.lorp49.Branch;
    })
    this.bindDropdownlist();
  }

  bindDropdownlist() {
    this.selectFilter.SortByLang(this.FromBranchList);
    this.selectFilter.FilterActive(this.FromBranchList);
    this.FromBranchList = [...this.FromBranchList];

    this.selectFilter.SortByLang(this.ToBranchList);
    this.selectFilter.FilterActive(this.ToBranchList);
    this.ToBranchList = [...this.ToBranchList];
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.reportParam.FromCompanyCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToCompanyCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromDate = this.searchForm.controls.FromDate.value;
    this.reportParam.ToDate = this.searchForm.controls.ToDate.value;

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
    doc.download = "LORP52";
    doc.click();
  }
}
