import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Trrp04Service, ReportParam } from './trrp04.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { SelectFilterService } from '../../../shared/service/select-filter.service';

@Component({
  templateUrl: './trrp04.component.html'
})

export class Trrp04Component implements OnInit {
  searchForm: FormGroup;
  branchList = [];
  reportParam = {} as ReportParam;
  submitted: boolean;
  focusToggle: boolean;
  printing: boolean;
  ReportType = [{ Value: 'TRRP04', TextTha: 'ที่ดิน', TextEng: 'ที่ดิน', active: true }
  , { Value: 'TRRP04_2', TextTha: 'รถ', TextEng: 'รถ', active: true }
  , { Value: 'TRRP04_3', TextTha: 'ฟ้องร้อง', TextEng: 'ฟ้องร้อง', active: true }]

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ls: Trrp04Service,
    public lang: LangService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      ProcessDate: [new Date()],
      ProcessDateTo: [new Date()],
      FromBranchCode: null,
      ToBranchCode: null,
      ReportType: [null ,Validators.required]
    });
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropdownlist();
    });

    this.route.data.subscribe((data) => {
      this.branchList = data.trrp04.BranchList;
    })
    this.bindDropdownlist();
  }

  bindDropdownlist() {
    this.selectFilter.SortByLang(this.branchList);
    this.selectFilter.FilterActive(this.branchList);
    this.branchList = [...this.branchList];
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.reportParam.ProcessDate = this.searchForm.controls.ProcessDate.value;
    this.reportParam.ProcessDateTo = this.searchForm.controls.ProcessDateTo.value;
    this.reportParam.CompanyCodeFrom = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.CompanyCodeTo = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.ReportType = this.searchForm.controls.ReportType.value;

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
    doc.download = "TRRP04"
    doc.click();
  }
}
