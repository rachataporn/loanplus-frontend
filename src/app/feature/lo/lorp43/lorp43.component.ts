import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp43Service, ReportParam } from '@app/feature/lo/lorp43/lorp43.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import * as moment from 'moment';

@Component({
  templateUrl: './lorp43.component.html'
})

export class Lorp43Component implements OnInit {
  statusPage: boolean;
  searchForm: FormGroup;
  reportParam = {} as ReportParam
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  provinceList = [];
  districtList = [];
  subDistrictList = [];
  reportList = [];
  now = new Date();
  constructor(
    private fb: FormBuilder,
    private ls: Lorp43Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
    private filter: SelectFilterService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      date: [this.now, Validators.required],
      provinceId: null,
      districtId: null,
      subDistrictId: null,
      TypeReport: [null, Validators.required],
    });

  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.provinceList = data.lorp43.Province;
      this.reportList = data.lorp43.TypeReport;
    });
  }

  bindDropDownList() {
    this.filterProvinceList(true);
    this.filterReportList();
  }

  filterReportList() {
    this.reportList = [...this.reportList];
  }

  filterProvinceList(filter?: boolean) {
    if (filter) {
      this.provinceList = this.selectFilter.FilterActive(this.provinceList);
    }
    this.provinceList = [...this.provinceList];
  }

  changeProvince() {
    this.ls.getDistrict(this.searchForm.controls.provinceId.value).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        this.searchForm.controls.districtId.reset();
        this.searchForm.controls.subDistrictId.reset();
        this.districtList = res.DistrictList;
        this.changeDistrict();
      });

  }

  changeDistrict() {
    this.ls.getSubDistrict(this.searchForm.controls.districtId.value).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        this.searchForm.controls.subDistrictId.reset();
        this.subDistrictList = res.SubDistrictList;
      });
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.Date = this.searchForm.controls.date.value;
    this.reportParam.Province = this.searchForm.controls.provinceId.value ? this.searchForm.controls.provinceId.value : null;
    this.reportParam.District = this.searchForm.controls.districtId.value ? this.searchForm.controls.districtId.value : null;
    this.reportParam.SubDistrict = this.searchForm.controls.subDistrictId.value ? this.searchForm.controls.subDistrictId.value : null;
    this.reportParam.TypeReport = this.searchForm.controls.TypeReport.value;
    if (this.searchForm.controls.TypeReport.value == 1) {
      this.reportParam.ReportName = 'LORP43_1'
    } else if (this.searchForm.controls.TypeReport.value == 2) {
      this.reportParam.ReportName = 'LORP43_2'
    } else if (this.searchForm.controls.TypeReport.value == 3) {
      this.reportParam.ReportName = 'LORP43_3'
    } else if (this.searchForm.controls.TypeReport.value == 4) {
      this.reportParam.ReportName = 'LORP43_4'
    }
    this.reportParam.ExportReport = 'xlsx';

    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
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
    doc.href = "data:application/xlsx;base64," + data;
    doc.download = "report43_" + ((Number(moment(this.now).format('YYYY')) - 543) + "-") + moment(this.now).format('MM-DD') + "." + this.reportParam.ExportReport;
    doc.click();
  }

  getText(value, list) {
    if (value) {
      const textData = list.find(data => {
        return data.Value == value;
      });
      return this.lang.CURRENT == "Tha" ? textData.TextTha : textData.TextEng;
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
