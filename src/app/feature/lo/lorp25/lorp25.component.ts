import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp25Service, ReportParam } from '@app/feature/lo/lorp25/lorp25.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lorp25LookupComponent } from './lorp25-lookup.component';

@Component({
  templateUrl: './lorp25.component.html'
})

export class Lorp25Component implements OnInit {
  Lorp25LookupContent = Lorp25LookupComponent;
  reportParam = {} as ReportParam
  menuForm: FormGroup;
  count: Number = 3;
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;

  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;

  showReportFormat: boolean;

  reportTypeList = [];
  MonthList = [];
  YearList = [];
  ContractList = [];
  FromBranchList = [];
  ToBranchList = [];
  ReportTypeList = [];
  ReportFormatList = [];

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private sv: Lorp25Service,
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
      Month: [null, Validators.required],
      Year: [null, Validators.required],
      FromBranch: null,
      ToBranch: null,
      FromContract: null,
      ToContract: null,
      ReportType: [null, Validators.required],
      ReportFormat: [null, Validators.required],
    });

    this.searchForm.controls.ReportType.valueChanges.subscribe(value => {
      if (value == "2") {
        this.searchForm.controls.ReportFormat.setValue("1");
      }
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP25');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.MonthList = data.lorp25.master.Month;
      this.FromBranchList = data.lorp25.master.Branch;
      this.ToBranchList = data.lorp25.master.Branch;
      this.ReportTypeList = data.lorp25.master.ReportType;
      this.ReportFormatList = data.lorp25.master.ReportFormat;
      this.bindDropDownList();
    });
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP25');
  }

  bindDropDownList() {
    this.filterMonthList(true);
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterReportTypeList(true);
    this.filterReportFormatList(true);
    this.buildYearList();
  }

  filterMonthList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.MonthList = this.selectFilter.FilterActiveByValue(this.MonthList, detail.Month);
      } else {
        this.MonthList = this.selectFilter.FilterActive(this.MonthList);
      }
    }
    this.MonthList = [...this.MonthList];
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

  filterFromBranchList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.FromBranchList = this.selectFilter.FilterActiveByValue(this.FromBranchList, detail.FromBranch);
      } else {
        this.FromBranchList = this.selectFilter.FilterActive(this.FromBranchList);
      }
    }
    this.FromBranchList = [...this.FromBranchList];
  }

  filterToBranchList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.ToBranchList = this.selectFilter.FilterActiveByValue(this.ToBranchList, detail.ToBranch);
      } else {
        this.ToBranchList = this.selectFilter.FilterActive(this.ToBranchList);
      }
    }
    this.ToBranchList = [...this.ToBranchList];
  }

  filterReportTypeList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.ReportTypeList = this.selectFilter.FilterActiveByValue(this.ReportTypeList, detail.ReportType);
      } else {
        this.ReportTypeList = this.selectFilter.FilterActive(this.ReportTypeList);
      }
    }
    this.ReportTypeList = [...this.ReportTypeList];
  }

  filterReportFormatList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.ReportFormatList = this.selectFilter.FilterActiveByValue(this.ReportFormatList, detail.ReportFormat);
      } else {
        this.ReportFormatList = this.selectFilter.FilterActive(this.ReportFormatList);
      }
    }
    this.ReportFormatList = [...this.ReportFormatList];
  }

  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + this.reportParam.ExportType + ";base64," + data;
    doc.download = name + "_" + this.reportParam.Month + "-" + this.reportParam.Year + "." + this.reportParam.ExportType
    doc.click();
  }

  prepareSave() {
    Object.assign(this.reportParam, this.searchForm.value);
    parseInt(this.reportParam.Month) < 10 ? this.reportParam.Month = ('0' + this.reportParam.Month) : this.reportParam.Month
    this.reportParam.ReportName = 'LORP25_0' + ((parseInt(this.searchForm.controls.ReportType.value) + parseInt(this.searchForm.controls.ReportFormat.value)) + '');
    this.reportParam.ExportType = 'xlsx';
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranch.value, this.searchForm.controls.ToBranch.value);
    const contractNo = this.getLocaleCompare(this.searchForm.controls.FromContract.value, this.searchForm.controls.ToContract.value);
    if (branch > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP25.FromBranch', 'Label.LORP25.ToBranch']);
    }
    if (contractNo > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP25.FormContractNo', 'Label.LORP25.ToContractNo']);
    }
    if (branch == 1 || contractNo == 1 > 0) { return; }

    this.prepareSave();
    this.sv.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    ).subscribe((res) => {
      if (res) {
        this.OpenWindow(res, this.reportParam.ReportName);
      }
    });
  }

  getText(value, list) {
    if (value) {
      const textData = list.find(data => {
        return data.Value === value;
      });
      return this.lang.CURRENT === 'Tha' ? textData.TextTha : textData.TextEng;
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
