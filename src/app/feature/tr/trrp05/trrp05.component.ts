import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Trrp05Service, ReportParam } from './trrp05.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { SelectFilterService } from '../../../shared/service/select-filter.service';

@Component({
  templateUrl: './trrp05.component.html'
})

export class Trrp05Component implements OnInit {
  searchForm: FormGroup;
  reportParam = {} as ReportParam;
  submitted: boolean;
  focusToggle: boolean;
  printing: boolean;
  ReportName = [];
  BranchList = [];
  now = new Date();
  ReportTypeList = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ls: Trrp05Service,
    public lang: LangService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
    private as: AlertService,

  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      FromDate: null,
      ToDate: null,
      BranchCode: null,
      ReportName: [null, Validators.required]
    });

    this.searchForm.controls.ReportName.valueChanges.subscribe(res => {
      this.searchForm.controls.FromDate.setValue(null);
      this.searchForm.controls.ToDate.setValue(null);
      if (this.searchForm.controls.ReportName.value == 'TRRP06') {
        this.searchForm.controls.FromDate.setErrors({ 'invalid': true });
      } else if (this.searchForm.controls.ReportName.value == 'TRRP05') {
        this.searchForm.controls.FromDate.setErrors({ 'invalid': true });
        this.searchForm.controls.ToDate.setErrors({ 'invalid': true });
      }
    });
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropdownlist();
    });

    this.route.data.subscribe((data) => {
      this.ReportName = data.trrp05.ReportName;
      this.BranchList = data.trrp05.Branch;
    })
    this.bindDropdownlist();
  }

  bindDropdownlist() {
    this.selectFilter.FilterActive(this.ReportName);
    this.ReportName = [...this.ReportName];

    this.selectFilter.SortByLang(this.BranchList);
    this.selectFilter.FilterActive(this.BranchList);
    this.BranchList = [...this.BranchList];
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    let reportName = this.ReportName.find(o => { return o.Value == this.searchForm.controls.ReportName.value });
    this.reportParam.FromDate = this.searchForm.controls.FromDate.value;
    this.reportParam.ToDate = this.searchForm.controls.ToDate.value;
    this.reportParam.CompanyCode = this.searchForm.controls.BranchCode.value;
    this.reportParam.ReportName = reportName.TextTha;
    this.reportParam.ReportCode = this.searchForm.controls.ReportName.value;
    if (this.reportParam.FromDate != null || this.reportParam.ToDate != null) {
      if (this.searchForm.controls.ReportName.value != 'TRRP06') {
        this.reportParam.Message = 'ข้อมูล ตั้งแต่วันที่ ' + this.reportParam.FromDate.toLocaleDateString('th-TH') + ' ถึงวันที่ ' + this.reportParam.ToDate.toLocaleDateString('th-TH');
      } else {
        this.reportParam.Message = 'ข้อมูล ณ วันที่ ' + this.reportParam.FromDate.toLocaleDateString('th-TH')
      }
    } else {
      this.reportParam.Message = 'ข้อมูล ตั้งแต่วันที่ ทั้งหมด ถึงวันที่ ทั้งหมด';
    }
    this.printing = true;
    if (this.searchForm.controls.ReportName.value == 'TRRP05') {
      this.ls.generateReportTRRP05(this.reportParam).pipe(
        finalize(() => {
          this.submitted = false;
          this.printing = false;
        })
      )
        .subscribe((res) => {
          this.as.success('', 'กำลังพิมพ์รายงาน ถ้าสำเร็จจะมีการแจ้งเตือนผ่านทาง E-Mail');
        });
    } else {
      this.ls.generateReport(this.reportParam).pipe(
        finalize(() => {
          this.submitted = false;
          this.printing = false;
        })
      )
        .subscribe((res) => {
          if (res) {
            this.OpenWindow(res, this.reportParam.ReportCode)
          }
        });
    }

  }

  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + data;
    doc.download = this.searchForm.controls.ReportName.value;
    doc.click();
  }
}
