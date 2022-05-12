import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp32Service, ReportParam } from '@app/feature/lo/lorp32/lorp32.service';
import { Page, ModalService, SelectFilterService, ModalRef } from '@app/shared';
import { AlertService, LangService, SaveDataService, Size } from '@app/core';

@Component({
  templateUrl: './lorp32.component.html'
})

export class Lorp32Component implements OnInit {
  @ViewChild('AlertConfirm') alertConfirm: TemplateRef<any>;
  searchForm: FormGroup;
  printing: boolean;
  fromBranchList = [];
  toBranchList = [];
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  contractNoList = [];
  fromContractNoList = [];
  toContractNoList = [];
  ReportTypeList = [];
  ReportSBTNameList = [];
  ReportSDNameList = [];
  MonthList = [];
  YearList = [];
  SDPeriod = [];
  nameReport: string;
  focusToggle: boolean;
  submitted: boolean;
  page = new Page();
  list = [];
  statusPage: boolean;
  reportParam = {} as ReportParam
  srcResult = null;
  alertPopup: ModalRef;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp32Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      FromBranchCode: null,
      ToBranchCode: null,
      ReportType: [null, Validators.required],
    });

    this.searchForm.controls.FromBranchCode.valueChanges
      .subscribe(value => {
        if (value) {

        } else {
          this.searchForm.controls.ToBranchCode.setValue(null, { emitEvent: false })
        }
      })
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP32');
    if (saveData) this.searchForm.patchValue(saveData);
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });
    this.route.data.subscribe((data) => {
      this.ReportTypeList = data.garuntee.ReportType;
      this.MonthList = data.garuntee.Month;
      this.fromBranchList = this.toBranchList = data.garuntee.Branch;

      this.bindDropDownList();
      this.buildYearList();
      this.search();

    });
  }

  bindDropDownList() {
    this.filterFormBranchList(true);
    this.filterMonthList(true);
    this.filterYearList(true);
  }

  filterMonthList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.MonthList = this.selectFilter.FilterActiveByValue(this.MonthList, detail.Month);
      }
      else {
        this.MonthList = this.selectFilter.FilterActive(this.MonthList);
      }
    }
    this.MonthList = [...this.MonthList];
  }

  filterFormBranchList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.fromBranchList = this.selectFilter.FilterActiveByValue(this.fromBranchList, detail.FromBranchCode);
      }
      else {
        this.fromBranchList = this.selectFilter.FilterActive(this.fromBranchList);
      }
    }
    this.fromBranchList = [...this.fromBranchList];
  }

  filterYearList(filter?: boolean) {
    this.YearList = [...this.YearList];
  }

  buildYearList() {
    var date = new Date();
    var indexYear = date.getFullYear() - 1740;
    for (var i = -1; i <= indexYear; i++) {
      var Value
      var TextEng = Value = date.getFullYear() - i;
      var TextTha = (date.getFullYear() - i) + 543;
      this.YearList.push({ Value, TextTha, TextEng });
    }
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP32');
  }

  prepareSave() {
    Object.assign(this.reportParam);
    if (this.searchForm.controls.ReportType.value == 'Month') {
      this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
      this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
      this.reportParam.ReportName = 'LORP32_' + this.searchForm.controls.ReportType.value;
      this.reportParam.ExportType = 'xlsx';
      this.reportParam.ReportType = this.searchForm.controls.ReportType.value;
    } else {
      this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
      this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
      this.reportParam.ExportType = 'xlsx';
      this.reportParam.ReportType = this.searchForm.controls.ReportType.value;
      if (this.searchForm.controls.ReportType.value == '3 Years' || this.searchForm.controls.ReportType.value == '5 Years') {
        this.reportParam.ReportName = 'LORP32_' + this.searchForm.controls.ReportType.value.slice(2, 7);
        this.reportParam.CountYear = this.searchForm.controls.ReportType.value.slice(0, 1);
      } else {
        this.reportParam.ReportName = 'LORP32_' + this.searchForm.controls.ReportType.value.slice(3, 8);
        this.reportParam.CountYear = this.searchForm.controls.ReportType.value.slice(0, 2);
      }
    }
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value);
    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromBranch', 'Label.LORP02.ToBranch']);
    if (branch == 1) return;

    this.prepareSave();
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    ).subscribe((res) => {
      this.alertPopup = this.modal.open(this.alertConfirm, Size.medium);
    });
  }

  getLocaleCompare(from, to) {
    if (from == null || to == null) {
      return 0;
    } else {
      return from.localeCompare(to);
    }
  }

  getText(value, list) {
    if (value) {
      const textData = list.find(data => {
        return data.Value == value;
      });
      return textData.TextEng;
    }
  }

  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + this.reportParam.ExportType + ";base64," + data;
    doc.download = name + '.' + this.reportParam.ExportType
    doc.click();
  }

  search() {
    this.ls.getReportList(this.searchForm.value, this.page).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        if (res) {
          this.list = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        }
      });
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.search();
  }

  getType(data) {
    const value = data ? this.ReportTypeList.find(x => x.Value == data) : null
    return data ? value.TextTha : null
  }

  async dowload(data) {
    let doc = document.createElement("a");
    doc.href = data;
    doc.click();
  }

  close() {
    this.alertPopup.hide();
    this.search();
  }
}
