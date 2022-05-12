import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp17Service, ReportParam } from '@app/feature/lo/lorp17/lorp17.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import value from '*.json';
import { Lorp17LookupCustomerCodeComponent } from './lorp17-lookup-customer-code.component';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
@Component({
  templateUrl: './lorp17.component.html'
})

export class Lorp17Component implements OnInit, OnDestroy {
  Lorp17LookupCustomerCodeComponent = Lorp17LookupCustomerCodeComponent;
  statusPage: boolean;
  searchForm: FormGroup;
  monthList = [];
  yearList = [];
  yearMin: number;
  yearMax: number;
  fromBranchList = [];
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  reportTypeList = [];
  reportParam = {} as ReportParam;
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  exportType = [{ Value: 'pdf', TextTha: 'PDF', TextEng: 'PDF', active: true }
  , { Value: 'xlsx', TextTha: 'EXCEL', TextEng: 'EXCEL', active: true }]
  now = new Date();
  
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp17Service,
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
      FromBranchCode: null,
      ToBranchCode: null,
      FromLoanType: null,
      ToLoanType: null,
      FromCustomerCode: null,
      ToCustomerCode: null,
      reportType: [null, Validators.required],
      ExportType: 'pdf'
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
    this.getMonth();
    const saveData = this.saveData.retrive('LORP17');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp17.Branch;
      this.toBranchList = data.lorp17.Branch;
      this.loanTypeList = data.lorp17.LoanType;
      this.fromLoanTypeList = data.lorp17.LoanType;
      this.toLoanTypeList = data.lorp17.LoanType;
      this.fromCustomerCodeList = data.lorp17.CustomerCode;
      this.toCustomerCodeList = data.lorp17.CustomerCode;
      this.yearMin = data.lorp17.YearMinMax[0].YearMin;
      this.yearMax = data.lorp17.YearMinMax[0].YearMax;
      this.bindDropDownList();
      this.buildYearList();
      this.reportTypeList = data.lorp17.ReportType;
    });
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterLoanType(true);
    this.filterMonthList();
  }

  filterFromBranchList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.fromBranchList = this.selectFilter.FilterActiveByValue(this.fromBranchList, detail.FromBranch);
      } else {
        this.fromBranchList = this.selectFilter.FilterActive(this.fromBranchList);
      }
    }
    this.fromBranchList = [...this.fromBranchList];
  }

  filterToBranchList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.toBranchList = this.selectFilter.FilterActiveByValue(this.toBranchList, detail.ToBranch);
      } else {
        this.toBranchList = this.selectFilter.FilterActive(this.toBranchList);
      }
    }
    this.toBranchList = [...this.toBranchList];
  }

  filterMonthList() {
    this.monthList = [...this.monthList];
  }

  filterYearList() {
    this.yearList = [...this.yearList];
  }

  filterLoanType(filter?: boolean) {
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
    this.saveData.save(this.searchForm.value, 'LORP17');
  }

  getMonth() {
    const monthValue = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const monthNamesEng = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December'],
      monthNamesTha = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
        'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    for (let i = 0; i < 12; i++) {
      this.monthList.push({
        Value: monthValue[i],
        TextEng: monthNamesEng[i],
        TextTha: monthNamesTha[i]
      });
    }
  }

  buildYearList() {
    const date = new Date();
    const indexYear = date.getFullYear() - 1740;
    for (let i = -1; i <= indexYear; i++) {
      const Value = (date.getFullYear() - i);
      const TextEng = (date.getFullYear() - i) + 543;
      const TextTha = (date.getFullYear() - i) + 543;
      this.yearList.push({ Value, TextTha, TextEng });
    }
  }

  // getYear() {
  //   for (let i = this.yearMin; i <= this.yearMax; i++) {
  //     this.yearList.push({
  //       Value: i,
  //       Text: i + 543 + ''
  //     });
  //   }
  // }

  print() {

    // Object.assign(this.reportParam, this.searchForm.value);
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value);
    const loanType = this.getLocaleCompare(this.searchForm.controls.FromLoanType.value, this.searchForm.controls.ToLoanType.value);
    const customerCode = this.getLocaleCompare(this.searchForm.controls.FromCustomerCode.value,
      this.searchForm.controls.ToCustomerCode.value);
    if (branch > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP17.FromBranch', 'Label.LORP17.ToBranch']);
    }
    if (loanType > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP17.FromLoanType', 'Label.LORP17.ToLoanType']);
    }
    if (customerCode > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP17.FromCustomerCode', 'Label.LORP17.ToCustomerCode']);
    }
    if (branch == 1 || customerCode == 1 || loanType == 1 > 0) { return; }

    this.reportParam.Date = this.searchForm.controls.Month.value + '-' + this.searchForm.controls.Year.value;
    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromLoanType = this.searchForm.controls.FromLoanType.value;
    this.reportParam.ToLoanType = this.searchForm.controls.ToLoanType.value;
    this.reportParam.FromCustomerCode = this.searchForm.controls.FromCustomerCode.value;
    this.reportParam.ToCustomerCode = this.searchForm.controls.ToCustomerCode.value;
    this.reportParam.ReportName = 'LORP17_' + this.searchForm.controls.reportType.value; 
    this.reportParam.ExportType = this.searchForm.controls.ExportType.value;
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromLoanType.value, this.loanTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToLoanType.value, this.loanTypeList);
    this.reportParam.FromCustomerCodeText = this.getText(this.searchForm.controls.FromCustomerCode.value, this.fromCustomerCodeList);
    this.reportParam.ToCustomerCodeText = this.getText(this.searchForm.controls.ToCustomerCode.value, this.toCustomerCodeList);
    this.reportParam.MonthText = this.getText(this.searchForm.controls.Month.value, this.monthList);
    this.reportParam.YearText = this.getText(this.searchForm.controls.Year.value, this.yearList);
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        if (res) {
          if(this.searchForm.controls.ExportType.value == 'pdf'){
            this.srcResult = res;
          }else{
            this.OpenWindow(res, this.reportParam.ReportName);
            this.srcResult = null;
          }
          
        }
      });
  }
  
  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + this.reportParam.ExportType + ";base64," + data;
    doc.download = name + "_" + "Report-" + ((Number(moment(this.now).format('YYYY')) - 543) + "-") + moment(this.now).format('MM-DD') + "." + this.reportParam.ExportType;
    doc.click();
  }

  getText(value, list) {
    if (value) {
      const textData = list.find(data => {
        return data.Value === value;
      });
      return this.lang.CURRENT === 'Tha' ? textData.TextTha || textData.Text : textData.TextEng || textData.Text;
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
