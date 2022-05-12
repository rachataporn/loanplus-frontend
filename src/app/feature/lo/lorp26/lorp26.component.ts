import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp26Service, ReportParam } from '@app/feature/lo/lorp26/lorp26.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  templateUrl: './lorp26.component.html'
})

export class Lorp26Component implements OnInit {

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

  FromBranchList = [];
  ToBranchList = [];
  AssessmentList = [];
  now = new Date();

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private sv: Lorp26Service,
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
      StartDate: null,
      EndDate: null,
      FromBranch: null,
      ToBranch: null,
      Assessment: null
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP26');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.FromBranchList = data.lorp26.master.Branch;
      this.ToBranchList = data.lorp26.master.Branch;
      this.AssessmentList = data.lorp26.master.Assessment;
      this.bindDropDownList();
    });
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP26');
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterMonthList(true);
  }

  filterMonthList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.AssessmentList = this.selectFilter.FilterActiveByValue(this.AssessmentList, detail.Assessment);
      } else {
        this.AssessmentList = this.selectFilter.FilterActive(this.AssessmentList);
      }
    }
    this.AssessmentList = [...this.AssessmentList];
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

  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + this.reportParam.ExportType + ";base64," + data;
    doc.download = name + "_" + "Assessment-" + ((Number(moment(this.now).format('YYYY')) - 543) + "-") + moment(this.now).format('MM-DD') + "." + this.reportParam.ExportType;
    doc.click();
  }

  prepareSave() {
    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.ReportName = 'LORP26'
    this.reportParam.ExportType = 'xlsx';
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranch.value, this.searchForm.controls.ToBranch.value);
    if (branch > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP26.FromBranch', 'Label.LORP26.ToBranch']);
    }

    if (branch > 0) { return; }

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

  getLocaleCompare(from, to) {
    if (from == null || to == null) {
      return 0;
    } else {
      return from.localeCompare(to);
    }
  }
}
