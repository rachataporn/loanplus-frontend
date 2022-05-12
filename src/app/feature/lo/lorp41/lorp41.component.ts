import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp41Service, ReportParam, ContractStatus } from '@app/feature/lo/lorp41/lorp41.service';
import { Page, ModalService, SelectFilterService, RowState } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
@Component({
  templateUrl: './lorp41.component.html'
})

export class Lorp41Component implements OnInit {
  reportTypeList = [];
  statusPage: boolean;
  searchForm: FormGroup;
  fromBranchList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  fromContractNoList = [];
  contractStatusList = [];
  toContractNoList = [];
  contractNoList = [];
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  reportParam = {} as ReportParam
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  a: string = '';
  yearList = [];
  reportFormatList = []
  exportType = [{ Value: 'pdf', TextTha: 'PDF', TextEng: 'PDF', active: true }
    , { Value: 'xlsx', TextTha: 'EXCEL', TextEng: 'EXCEL', active: true }]

  mounthData = [];
  mounthList = [
    { Value: '1', TextTha: 'มกราคม', TextEng: 'January', Active: true },
    { Value: '2', TextTha: 'กุมภาพันธ์', TextEng: 'February', Active: true },
    { Value: '3', TextTha: 'มีนาคม', TextEng: 'March', Active: true },
    { Value: '4', TextTha: 'เมษายน', TextEng: 'April', Active: true },
    { Value: '5', TextTha: 'พฤษภาคม', TextEng: 'May', Active: true },
    { Value: '6', TextTha: 'มิถุนายน', TextEng: 'June', Active: true },
    { Value: '7', TextTha: 'กรกฎาคม', TextEng: 'July', Active: true },
    { Value: '8', TextTha: 'สิงหาคม', TextEng: 'August', Active: true },
    { Value: '9', TextTha: 'กันยายน', TextEng: 'September', Active: true },
    { Value: '10', TextTha: 'ตุลาคม', TextEng: 'October', Active: true },
    { Value: '11', TextTha: 'พฤษจิกายน', TextEng: 'November', Active: true },
    { Value: '12', TextTha: 'ธันวาคม', TextEng: 'December', Active: true }];

  customerGradeList = [
    { Value: 'N', TextTha: 'เกรด ลูกค้าใหม่', TextEng: 'Grade New', Active: true },
    { Value: 'A', TextTha: 'เกรด A', TextEng: 'Grade A', Active: true },
    { Value: 'B', TextTha: 'เกรด B', TextEng: 'Grade B', Active: true },
    { Value: 'C', TextTha: 'เกรด C', TextEng: 'Grade C', Active: true },
    { Value: 'D', TextTha: 'เกรด D', TextEng: 'Grade D', Active: true },
    { Value: 'NPL', TextTha: 'เกรด NPL', TextEng: 'Grade NPL', Active: true }];

  now = new Date();
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp41Service,
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
      Date: new Date(),
      FromBranchCode: null,
      ToBranchCode: null,
      FromLoanType: null,
      ToLoanType: null,
      FromCustomerCode: null,
      ToCustomerCode: null,
      ReportFormat: null,
      mounthCode: null,
      yearCode: null,
      DateMounth: null,
      formDate: new Date(),
      toDate: new Date(),
      NaDate: new Date(),
      ReportPattern: [null, Validators.required],
      ContractStatus: this.fb.array([]),
      ExportType: 'pdf',
      CustomerGrade: null,
      CloseAllContract: false
    });

    this.searchForm.controls.ReportFormat.valueChanges.subscribe(value => {
      if (value == '1') {
        this.searchForm.controls.NaDate.setValue(new Date);
        this.a = '1';
      } else if (value == '2') {
        this.a = '2';
      } else if (value == '3') {
        this.searchForm.controls.formDate.setValue(new Date);
        this.searchForm.controls.toDate.setValue(new Date);
        this.a = '3';
      } else {
        this.a = null;
        this.searchForm.controls.ReportFormat.setValue(null, { emitEvent: false });
      }
    })

    this.searchForm.controls.mounthCode.valueChanges.subscribe(value => {
      var year: any;
      if (this.searchForm.controls.yearCode.value == null) {
        year = this.now.getFullYear();
      } else {
        year = this.searchForm.controls.yearCode.value;
      }
      var date = year + "-" + value + "-" + 1;
      this.searchForm.controls.DateMounth.setValue(new Date(date));
    })

    this.searchForm.controls.yearCode.valueChanges.subscribe(value => {
      var mounth: any;
      if (this.searchForm.controls.yearCode.value == null) {
        mounth = this.now.getMonth() + 1
      } else {
        mounth = this.searchForm.controls.mounthCode.value;
      }
      var date = value + "-" + mounth + "-" + 1;
      this.searchForm.controls.DateMounth.setValue(new Date(date));
    })

    this.searchForm.controls.FromBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
    });
    this.searchForm.controls.ToBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
    });

    this.searchForm.controls.ReportPattern.valueChanges.subscribe(res => {
      if (res && res == '03') {
        this.searchForm.controls.ExportType.setValue('pdf', { emitEvent: false });
        this.searchForm.controls.ExportType.disable({ emitEvent: false });
      } else if (res && res == 'LORP51'){
        this.searchForm.controls.ExportType.setValue('xlsx', { emitEvent: false });
      } else if (res && res == '01' || res && res == '02'){
        this.searchForm.controls.ExportType.setValue('pdf', { emitEvent: false });
      } else {
        this.searchForm.controls.ExportType.enable({ emitEvent: false });
      }
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP41');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = this.toBranchList = data.lorp41.Branch;
      this.loanTypeList = data.lorp41.LoanType;
      this.fromLoanTypeList = this.toLoanTypeList = data.lorp41.LoanType;
      this.fromCustomerCodeList = this.toCustomerCodeList = data.lorp41.CustomerCode;
      this.reportTypeList = data.lorp41.ReportType;
      this.contractStatusList = data.lorp41.ContractStatus;
      this.reportFormatList = data.lorp41.reportFormate;
      // this.reportFormatList = data.lorp41.ReportFormat;
      this.bindDropDownList();
      this.searchForm.setControl('ContractStatus', this.fb.array(this.contractStatusList.map((detail) => this.contractStatusForm(detail))));
    });


    this.buildYearList();
  }

  get getParameterForSingleLookup() {
    return { ListItemGroupCode: "income_loan" }
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
    this.filterContractNo(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value, true);
    this.filterReportFormat(true);
    this.filterFromCustomerCodeList(true);
    this.filterToCustomerCodeList(true);
    this.filterYearList(true);
    this.filterFormatList(true);
  }

  filterFormatList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.reportFormatList = this.selectFilter.FilterActiveByValue(this.reportFormatList, detail.ReportFormat);
      }
      else {
        this.reportFormatList = this.selectFilter.FilterActive(this.reportFormatList);
      }
    }
    // this.selectFilter.SortByLang(this.reportFormatList);
    this.reportFormatList = [...this.reportFormatList];
  }

  filterYearList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.mounthList = this.selectFilter.FilterActiveByValue(this.mounthList, detail.mounthCode);
      }
      else {
        this.mounthList = this.selectFilter.FilterActive(this.mounthList);
      }
    }
    // this.selectFilter.SortByLang(this.fromBranchList);
    this.fromBranchList = [...this.fromBranchList];
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

  filterFromCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.fromCustomerCodeList);
    this.fromCustomerCodeList = [...this.fromCustomerCodeList];
  }

  filterToCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.toCustomerCodeList);
    this.toCustomerCodeList = [...this.toCustomerCodeList];
  }

  filterContractNo(fromCompanyCode, toCompanyCode, filter?: boolean) {
    if (fromCompanyCode != null && toCompanyCode != null) {
      this.fromContractNoList = this.contractNoList.filter(filter => filter.CompanyCode >= fromCompanyCode && filter.CompanyCode <= toCompanyCode);
      this.toContractNoList = this.contractNoList.filter(filter => filter.CompanyCode >= fromCompanyCode && filter.CompanyCode <= toCompanyCode);
    }
    else if (fromCompanyCode == null && toCompanyCode == null) {
      this.fromContractNoList = this.contractNoList;
      this.toContractNoList = this.contractNoList;
    }
    else if (fromCompanyCode != null && toCompanyCode == null) {
      this.fromContractNoList = this.contractNoList.filter(filter => filter.CompanyCode >= fromCompanyCode);
      this.toContractNoList = this.contractNoList.filter(filter => filter.CompanyCode >= fromCompanyCode);
    }
    else if (fromCompanyCode == null && toCompanyCode != null) {
      this.fromContractNoList = this.contractNoList.filter(filter => filter.CompanyCode <= toCompanyCode);
      this.toContractNoList = this.contractNoList.filter(filter => filter.CompanyCode <= toCompanyCode);
    }

    this.selectFilter.SortByLang(this.fromContractNoList);
    this.fromContractNoList = [...this.fromContractNoList];

    this.selectFilter.SortByLang(this.toContractNoList);
    this.toContractNoList = [...this.toContractNoList];
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

  filterReportFormat(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.reportFormatList = this.selectFilter.FilterActiveByValue(this.reportFormatList, detail.ReportFormat);
      }
      else {
        this.reportFormatList = this.selectFilter.FilterActive(this.reportFormatList);
      }
    }
    this.selectFilter.SortByLang(this.reportFormatList);
    this.reportFormatList = [...this.reportFormatList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP41');
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.searchForm.controls.ReportFormat.value == '1') {
      this.searchForm.controls.yearCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.mounthCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.DateMounth.setValue(null, { emitEvent: false });
      this.searchForm.controls.formDate.setValue(null, { emitEvent: false });
      this.searchForm.controls.toDate.setValue(null, { emitEvent: false });
      if (!this.searchForm.controls.NaDate.value) {
        this.as.warning('', "กรุณาระบุวันที่");
        return;
      }
    } else if (this.searchForm.controls.ReportFormat.value == '2') {
      this.searchForm.controls.NaDate.setValue(null, { emitEvent: false });
      this.searchForm.controls.formDate.setValue(null, { emitEvent: false });
      this.searchForm.controls.toDate.setValue(null, { emitEvent: false });
      if (!this.searchForm.controls.mounthCode.value || !this.searchForm.controls.yearCode.value) {
        this.as.warning('', 'กรุณาระบุเดือน ปี ให้ครบ');
        return;
      }
    } else if (this.searchForm.controls.ReportFormat.value == '3') {
      this.searchForm.controls.yearCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.mounthCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.DateMounth.setValue(null, { emitEvent: false });
      this.searchForm.controls.NaDate.setValue(null, { emitEvent: false });
      if (!this.searchForm.controls.formDate.value || !this.searchForm.controls.toDate.value) {
        this.as.warning('', 'กรุณาระบุวันที่เรื่ม วันที่สิ้นสุด ให้ครบ');
        return;
      }
    } else {
      this.searchForm.controls.NaDate.setValue(null, { emitEvent: false });
      this.searchForm.controls.yearCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.mounthCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.DateMounth.setValue(null, { emitEvent: false });
      this.searchForm.controls.formDate.setValue(null, { emitEvent: false });
      this.searchForm.controls.toDate.setValue(null, { emitEvent: false });
    }

    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value);
    const loanType = this.getLocaleCompare(this.searchForm.controls.FromLoanType.value, this.searchForm.controls.ToLoanType.value);
    const customerCode = this.getLocaleCompare(this.searchForm.controls.FromCustomerCode.value, this.searchForm.controls.ToCustomerCode.value);
    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromBranch', 'Label.LORP02.ToBranch']);
    if (loanType > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromLoanType', 'Label.LORP02.ToLoanType']);
    if (customerCode > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromCustomerCode', 'Label.LORP02.ToCustomerCode']);
    if (branch == 1 || loanType == 1 || customerCode == 1 > 0) return;

    let selected = [];
    let selectedText = '';
    this.searchForm.controls.ContractStatus.value.forEach(element => {
      if (element.Active) {
        selected.push(element.StatusValue);
        selectedText += this.lang.CURRENT === 'Tha' ? element.TextTha + ', ' : element.TextEng + ', ';
      }
    });

    if (selected.length === 0 || selected.length === this.searchForm.controls.ContractStatus.value.length) {
      selected = [];
      selectedText = '';
    }
    this.reportParam.Date = this.searchForm.controls.Date.value;
    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromLoanType = this.searchForm.controls.FromLoanType.value;
    this.reportParam.ToLoanType = this.searchForm.controls.ToLoanType.value;
    this.reportParam.ContractStatus = selected.join(',');
    this.reportParam.ReportName = this.searchForm.controls.ReportPattern.value == 'LORP51' ? 'LORP51' : 'LORP41_' + this.searchForm.controls.ReportPattern.value;
    this.reportParam.ExportType = this.searchForm.controls.ReportPattern.value == 'LORP51' ? 'xlsx' : this.searchForm.controls.ExportType.value;
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromLoanType.value, this.loanTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToLoanType.value, this.loanTypeList);

    this.reportParam.HeaderText = this.getText(this.searchForm.controls.ReportFormat.value, this.reportFormatList);
    this.reportParam.MounthText = this.getText(this.searchForm.controls.mounthCode.value, this.mounthList);
    this.reportParam.YearText = this.getText(this.searchForm.controls.yearCode.value, this.yearList);
    this.reportParam.NaDate = this.searchForm.controls.NaDate.value;
    this.reportParam.DateMounth = this.searchForm.controls.DateMounth.value;
    this.reportParam.formDate = this.searchForm.controls.formDate.value;
    this.reportParam.toDate = this.searchForm.controls.toDate.value;
    this.reportParam.ReportFormat = this.searchForm.controls.ReportFormat.value;
    this.reportParam.ContractStatusText = selectedText.substring(0, selectedText.length - 2);
    this.reportParam.CustomerGrade = this.searchForm.controls.CustomerGrade.value;
    this.reportParam.CloseAllContract = this.searchForm.controls.CloseAllContract.value;

    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => { this.submitted = false; })
    ).subscribe((res) => {
      if (res) {
        if (this.searchForm.controls.ExportType.value == 'pdf') {
          this.srcResult = res;
        } else {
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

  get contractStatus(): FormArray {
    return this.searchForm.get('ContractStatus') as FormArray;
  }

  contractStatusForm(item: ContractStatus): FormGroup {
    const fg = this.fb.group({
      StatusValue: null,
      TextTha: null,
      TextEng: null,
      Active: false,
      // RowState: RowState.Add,
    });

    fg.patchValue(item, { emitEvent: false });
    return fg;
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
