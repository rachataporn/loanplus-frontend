import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lorp35Service, ReportParam } from '@app/feature/lo/lorp35/lorp35.service';
import { ModalService, SelectFilterService } from '@app/shared';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  templateUrl: './lorp35.component.html'
})

export class Lorp35Component implements OnInit, OnDestroy {
  statusPage: boolean;
  searchForm: FormGroup;
  exportType = [{ Value: 'pdf', TextTha: 'PDF', TextEng: 'PDF', active: true }
    , { Value: 'xlsx', TextTha: 'EXCEL', TextEng: 'EXCEL', active: true }]
  userList = [];
  logTypelist = [];
  reportParam = {} as ReportParam;
  srcResult = null;
  printing: boolean;
  isContractDateList = [{ Value: true, TextTha: 'ไม่รวมข้อมูลวันที่ทำสัญญา', TextEng: 'ไม่รวมข้อมูลวันที่ทำสัญญา', active: true }
    , { Value: false, TextTha: 'รวมข้อมูลวันที่ทำสัญญา', TextEng: 'รวมข้อมูลวันที่ทำสัญญา', active: true }]
  reportTypeList = [];
  focusToggle: boolean;
  submitted: boolean;
  constructor(
    private fb: FormBuilder,
    private ls: Lorp35Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      FromLogDate: null,
      ToLogDate: null,
      FromUserId: null,
      ToUserId: null,
      LogType: '',
      ExportType: 'pdf',
      IsContractDate: true,
      reportType: [null, Validators.required],
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP35');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.userList = data.lorp35.User;
      this.logTypelist = data.lorp35.LogType;
      this.reportTypeList = data.lorp35.ReportType;

      this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterUserList(true);
  }

  filterUserList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.userList = this.selectFilter.FilterActiveByValue(this.userList, detail.FromUserId);
      } else {
        this.userList = this.selectFilter.FilterActive(this.userList);
      }
    }
    this.userList = [...this.userList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP35');
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.reportParam.FromLogDate = this.searchForm.controls.FromLogDate.value;
    this.reportParam.ToLogDate = this.searchForm.controls.ToLogDate.value;
    this.reportParam.FromUserId = this.searchForm.controls.FromUserId.value;
    this.reportParam.ToUserId = this.searchForm.controls.ToUserId.value;
    this.reportParam.LogType = this.searchForm.controls.LogType.value == '' ? null : this.searchForm.controls.LogType.value;
    this.reportParam.ExportType = this.searchForm.controls.ExportType.value;
    this.reportParam.IsContractDate = this.searchForm.controls.IsContractDate.value;
    this.reportParam.ReportName = 'LORP35_' + this.searchForm.controls.reportType.value;

    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
      })
    )
      .subscribe((res) => {
        if (res) {
          if (this.searchForm.controls.ExportType.value == 'pdf') {
            this.srcResult = res;
          } else {
            this.OpenWindow(res,this.reportParam.ReportName);
            this.srcResult = null;
          }
        }
      });
  }

  async OpenWindow(data,name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + this.reportParam.ExportType + ";base64," + data;
    doc.download = name + "." + this.reportParam.ExportType;
    doc.click();
  }
}
