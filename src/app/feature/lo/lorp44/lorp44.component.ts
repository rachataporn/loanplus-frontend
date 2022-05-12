import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp44Service, ReportParam } from '@app/feature/lo/lorp44/lorp44.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import * as moment from 'moment';

@Component({
  templateUrl: './lorp44.component.html'
})

export class Lorp44Component implements OnInit {
  now = new Date();
  maxDate = null;
  minDate = null;
  searchForm: FormGroup;
  reportParam = {} as ReportParam
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  fromBranchList = [];
  toBranchList = [];
  ReportTypeList = [];

  constructor(
    private fb: FormBuilder,
    private ls: Lorp44Service,
    public lang: LangService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
    private as: AlertService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      FromBranchCode: null,
      ToBranchCode: null,
      date: [this.now, Validators.required],
      ReportType: [null, Validators.required],
    });
    this.searchForm.controls.ReportType.valueChanges.subscribe(
      (control) => {
        if (control == 'TRRP04_6_2') {
          this.maxDate = new Date("December 13, 2020 00:00:00");
          this.minDate = null;
        } else if (control == 'TRRP04_6') {
          this.maxDate = new Date();
          this.minDate = new Date("December 14, 2020 00:00:00");
        } else {
          this.maxDate = new Date();
          this.minDate = null;
        }
        this.searchForm.controls.date.setValue(this.maxDate);
      }
    );
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp44.Branch;
      this.toBranchList = data.lorp44.Branch;
      this.ReportTypeList = data.lorp44.ReportType;
      this.bindDropDownList();
    });
  }


  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterReportTypeList(true);
  }

  filterFromBranchList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.fromBranchList = this.selectFilter.FilterActiveByValue(this.fromBranchList, detail.FromBranch);
      }
      else {
        this.fromBranchList = this.selectFilter.FilterActive(this.fromBranchList);
      }
    }
    this.selectFilter.SortByLang(this.fromBranchList);
    this.fromBranchList = [...this.fromBranchList];
  }

  filterToBranchList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.toBranchList = this.selectFilter.FilterActiveByValue(this.toBranchList, detail.ToBranch);
      }
      else {
        this.toBranchList = this.selectFilter.FilterActive(this.toBranchList);
      }
    }
    this.selectFilter.SortByLang(this.toBranchList);
    this.toBranchList = [...this.toBranchList];
  }

  filterReportTypeList(filter?: boolean) {
    if (filter) {
      this.ReportTypeList = this.selectFilter.FilterActive(this.ReportTypeList);
    }
    this.ReportTypeList = [...this.ReportTypeList];
  }

  print() {
    this.submitted = true;

    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    Object.assign(this.reportParam, this.searchForm.value);
    let reportName = this.ReportTypeList.find(o => { return o.Value == this.searchForm.controls.ReportType.value });

    let branchFromTha = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    let branchToTha = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);

    this.reportParam.Date = this.searchForm.controls.date.value;
    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.ReportType = this.searchForm.controls.ReportType.value;
    this.reportParam.ReportName = reportName.TextTha;
    this.reportParam.Message = 'ข้อมูล ณ วันที่ ' + this.reportParam.Date.toLocaleDateString('th-TH') + ' ตั้งแต่สาขา ' + branchFromTha + ' ถึงสาขา ' + branchToTha;
    this.reportParam.ExportType = 'xlsx';

    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        this.as.success('', 'กำลังพิมพ์รายงาน ถ้าสำเร็จจะมีการแจ้งเตือนผ่านทาง E-Mail');
      });
  }

  getText(value, list) {
    if (value) {
      const textData = list.find(data => {
        return data.Value == value;
      });
      return this.lang.CURRENT == "Tha" ? textData.TextTha : textData.TextEng;
    } else {
      return 'ทั้งหมด';
    }
  }

  getLocaleCompare(from, to) {
    if (from == null || to == null) {
      return 0;
    } else {
      return from.localeCompare(to);
    }
  }
}
