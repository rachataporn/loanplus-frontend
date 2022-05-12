import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp11Service, ReportParam } from '@app/feature/lo/lorp11/lorp11.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lorp11.component.html'
})

export class Lorp11Component implements OnInit {
  monthList = [{ Value: '01', TextTha: 'มกราคม', TextEng: 'January', active: true },
  { Value: '02', TextTha: 'กุมภาพันธ์', TextEng: 'February', active: true },
  { Value: '03', TextTha: 'มีนาคม', TextEng: 'March', active: true },
  { Value: '04', TextTha: 'เมษายน', TextEng: 'April', active: true },
  { Value: '05', TextTha: 'พฤษภาคม', TextEng: 'May', active: true },
  { Value: '06', TextTha: 'มิถุนายน', TextEng: 'June', active: true },
  { Value: '07', TextTha: 'กรกฎาคม', TextEng: 'July', active: true },
  { Value: '08', TextTha: 'สิงหาคม', TextEng: 'August', active: true },
  { Value: '09', TextTha: 'กันยายน', TextEng: 'September', active: true },
  { Value: '10', TextTha: 'ตุลาคม', TextEng: 'October', active: true },
  { Value: '11', TextTha: 'พฤษจิกายน', TextEng: 'November', active: true },
  { Value: '12', TextTha: 'ธันวาคม', TextEng: 'December', active: true }];

  // yearList = [{ Value: '2020', TextTha: '2563', TextEng: '2020', active: true },
  // { Value: '2019', TextTha: '2562', TextEng: '2019', active: true },
  // { Value: '2018', TextTha: '2561', TextEng: '2018', active: true },
  // { Value: '2017', TextTha: '2560', TextEng: '2017', active: true }];

  fromBranchList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  yearList = [];

  statusPage: boolean;
  searchForm: FormGroup;
  reportParam = {} as ReportParam
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  constructor(
    private fb: FormBuilder,
    private ls: Lorp11Service,
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
      MonthCode: [null, Validators.required],
      YearCode: [null, Validators.required],
      FromBranchCode: null,
      ToBranchCode: null,
      FromLoanType: null,
      ToLoanType: null
    });
    this.searchForm.controls.FromBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
    });
    this.searchForm.controls.ToBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP11');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp11.Branch;
      this.toBranchList = data.lorp11.Branch;
      this.loanTypeList = data.lorp11.LoanType;
      this.fromLoanTypeList = this.toLoanTypeList = data.lorp11.LoanType;
      // this.toLoanTypeList = data.lorp11.LoanType;
      // this.bindDropDownList();
    });
    this.buildYearList();
  }

  buildYearList() {
    var date = new Date();
    var indexYear = date.getFullYear() - 1740;
    for (var i = -1; i <= indexYear; i++) {
      var Value
      var TextEng = Value = date.getFullYear() - i;
      var TextTha = (date.getFullYear() - i) + 543;
      this.yearList.push({ Value, TextTha, TextEng });
    }
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterLoanType(true);
    this.filterMonthList();
  }

  filterMonthList() {
    // this.selectFilter.SortByLang(this.monthList);
    this.monthList = [...this.monthList];
  }

  filterYearList() {
    // this.selectFilter.SortByLang(this.monthList);
    this.yearList = [...this.yearList];
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
    // this.selectFilter.SortByLang(this.fromBranchList);
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
    // this.selectFilter.SortByLang(this.toBranchList);
    this.toBranchList = [...this.toBranchList];
  }

  filterLoanType(filter?: boolean){
    if (filter) {
        this.fromLoanTypeList = this.selectFilter.FilterActive(this.fromLoanTypeList);
        this.toLoanTypeList = this.selectFilter.FilterActive(this.toLoanTypeList);      
    }

    this.selectFilter.SortByLang(this.fromLoanTypeList);
    this.fromLoanTypeList = [...this.fromLoanTypeList];

    this.selectFilter.SortByLang(this.toLoanTypeList);
    this.toLoanTypeList = [...this.toLoanTypeList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP11');
  }

  print() {
    Object.assign(this.reportParam, this.searchForm.value);
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value);
    const loanType = this.getLocaleCompare(this.searchForm.controls.FromLoanType.value, this.searchForm.controls.ToLoanType.value);
    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromBranch', 'Label.LORP02.ToBranch']);
    if (loanType > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromLoanType', 'Label.LORP02.ToLoanType']);
    if (branch == 1 || loanType == 1 > 0) return;
    var selected = [];
    var selectedText = '';

    this.reportParam.MonthCode = this.searchForm.controls.MonthCode.value;
    this.reportParam.YearCode = this.searchForm.controls.YearCode.value;
    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromLoanType = this.searchForm.controls.FromLoanType.value;
    this.reportParam.ToLoanType = this.searchForm.controls.ToLoanType.value;
    this.reportParam.ReportName = 'LORP11'
    this.reportParam.ExportType = 'pdf';
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromLoanType.value, this.fromLoanTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToLoanType.value, this.toLoanTypeList);
    this.reportParam.MonthText = this.getText(this.searchForm.controls.MonthCode.value, this.monthList);
    this.reportParam.YearText = this.getText(this.searchForm.controls.YearCode.value, this.yearList);
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        if (res) {
          this.srcResult = res;
        }
      });
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
