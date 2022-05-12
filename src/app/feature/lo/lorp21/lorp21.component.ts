import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp21Service, ReportParam } from '@app/feature/lo/lorp21/lorp21.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lorp21.component.html'
})

export class Lorp21Component implements OnInit {
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
  yearList = [];
  // financeStatusPico = [{ Value: '1', TextTha: 'แบ่งกลุ่มตามสินเชื่อพิโก', TextEng: 'Segment By Pico Plus', active: true }, { Value: '2', TextTha: 'แบ่งกลุ่มตามวงเงินสินเชื่อพิโกพลัส', TextEng: 'Segment By Credit Limit Pico Plus',active: true }]
  // fromBranchList = [];
  // toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];

  provinceList = [];

  statusPage: boolean;
  searchForm: FormGroup;
  reportParam = {} as ReportParam
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  constructor(
    private fb: FormBuilder,
    private ls: Lorp21Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
    private filter:SelectFilterService 
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      MonthCode: null,
      YearCode: null,
      ProvinceCode: null,
      FromLoanType: null,
      ToLoanType: null,
      date:[null, Validators.required]
    });

   
    this.searchForm.controls.ProvinceCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
      this.filterFromLoanType(true)
    this.filterToLoanType(true)
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP21');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.provinceList = data.lorp21.Province;
      this.loanTypeList = data.lorp21.LoanType;
      this.fromLoanTypeList = data.lorp21.LoanType;
      this.toLoanTypeList = data.lorp21.LoanType;
    });
    this.buildYearList();
  }

  buildYearList() {
    var date = new Date();
    var indexYear = date.getFullYear() - 1740;
    for (var i = -1; i <= indexYear; i++) {
      var Value = (date.getFullYear() - i) + 543;
      var TextEng = date.getFullYear() - i;
      var TextTha = (date.getFullYear() - i) + 543;
      this.yearList.push({ Value, TextTha, TextEng });
    }
  }

  bindDropDownList() {
    this.filterProvinceList(true);
    this.filterFromLoanType(true)
    this.filterToLoanType(true)
    this.filterMonthList();
  }

  filterMonthList() {
    this.monthList = [...this.monthList];
  }

  filterYearList() {
    this.yearList = [...this.yearList];
  }

  filterProvinceList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.provinceList = this.selectFilter.FilterActiveByValue(this.provinceList, detail.Province);
      }
      else {
        this.provinceList = this.selectFilter.FilterActive(this.provinceList);
      }
    }
    this.provinceList = [...this.provinceList];
  }
  
  filterFromLoanType(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.fromLoanTypeList = this.filter.FilterActiveByValue(this.fromLoanTypeList, detail.FromLoanType);
      }
      else {
        this.fromLoanTypeList = this.filter.FilterActive(this.fromLoanTypeList);
      }
    }
    this.filter.SortByLang(this.fromLoanTypeList);
    this.fromLoanTypeList = [... this.fromLoanTypeList];
  }

  filterToLoanType(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.toLoanTypeList = this.filter.FilterActiveByValue(this.toLoanTypeList, detail.ToLoanType);
      }
      else {
        this.toLoanTypeList = this.filter.FilterActive(this.toLoanTypeList);
      }
    }
    this.filter.SortByLang(this.toLoanTypeList);
    this.toLoanTypeList = [... this.toLoanTypeList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP21');
  }

  print() {

    Object.assign(this.reportParam, this.searchForm.value);
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    // const ProvinceCode = this.getLocaleCompare(this.searchForm.controls.ProvinceCode.value);
    const loanType = this.getLocaleCompare(this.searchForm.controls.FromLoanType.value, this.searchForm.controls.ToLoanType.value);
    // if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromBranch', 'Label.LORP02.ToBranch']);
    if (loanType > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromLoanType', 'Label.LORP02.ToLoanType']);
    if (/*branch == 1 ||*/ loanType == 1 > 0) return;
    var selected = [];
    var selectedText = '';

    this.reportParam.MonthCode = this.searchForm.controls.MonthCode.value;
    this.reportParam.YearCode = this.searchForm.controls.YearCode.value;
    this.reportParam.ProvinceCode = this.searchForm.controls.ProvinceCode.value;
    this.reportParam.FromLoanType = this.searchForm.controls.FromLoanType.value;
    this.reportParam.ToLoanType = this.searchForm.controls.ToLoanType.value;
    this.reportParam.Date = this.searchForm.controls.date.value;
    this.reportParam.ReportName = 'LORP21'
    this.reportParam.ExportType = 'pdf';
    this.reportParam.ProvinceText = this.getText(this.searchForm.controls.ProvinceCode.value, this.provinceList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromLoanType.value, this.loanTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToLoanType.value, this.loanTypeList);
    this.reportParam.MonthText = this.getText(this.searchForm.controls.MonthCode.value, this.monthList);
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        if (res) {
          this.srcResult = res;
          this.OpenWindow( this.srcResult)
        }
      });
  }

  async OpenWindow(data) {
    let doc = document.createElement("a");
    doc.href = "data:application/vnd.ms-excel;base64," + data;
    doc.download = "report21"
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
