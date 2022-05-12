import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp16Service, ReportParam, ContractStatus } from '@app/feature/lo/lorp16/lorp16.service';

import { Page, ModalService, SelectFilterService, RowState } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lorp16LookupCostomerCodeComponent } from './lorp16-lookup-customercodefrom.component';
import { Lorp16LookupLoantypeComponent } from './lorp16-lookup-loantypefrom.component';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  templateUrl: './lorp16.component.html'
})

export class Lorp16Component implements OnInit {
  Lorp16LookupCostomerCodeContent = Lorp16LookupCostomerCodeComponent;
  Lorp16LookupLoantypeContent = Lorp16LookupLoantypeComponent;

  statusPage: boolean;
  searchForm: FormGroup;
  fromBranchList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  fromContractNoList = [];
  toContractNoList = [];
  contractNoList = [];
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  reportFormatList = [];
  reportParam = {} as ReportParam
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  minDate = null;
  now = new Date();
  contractStatusList = [];
  listTextAll = [{ Value: null, TextTha: 'ทั้งหมด', TextEng: 'All', active: true }]
  exportType = [{ Value: 'pdf', TextTha: 'PDF', TextEng: 'PDF', active: true }
    , { Value: 'xlsx', TextTha: 'EXCEL', TextEng: 'EXCEL', active: true }]

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp16Service,
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
      Date: [new Date(), Validators.required],
      FromBranchCode: null,
      ToBranchCode: null,
      FromLoanType: null,
      ToLoanType: null,
      FromCustomerCode: null,
      ToCustomerCode: null,
      ReportFormat: [null, Validators.required],
      ContractStatus: this.fb.array([]),
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

    this.searchForm.controls.ReportFormat.valueChanges.subscribe(res => {
      if (res && res == '05') {
        this.searchForm.controls.ExportType.setValue('xlsx', { emitEvent: false });
        this.searchForm.controls.ExportType.disable({ emitEvent: false });
      } else {
        this.searchForm.controls.ExportType.setValue('pdf', { emitEvent: false });
        this.searchForm.controls.ExportType.enable({ emitEvent: false });
      }
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP16');
    if (saveData) this.searchForm.patchValue(saveData);
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp16.Branch;
      this.toBranchList = data.lorp16.Branch;
      this.loanTypeList = data.lorp16.LoanType;
      this.fromCustomerCodeList = data.lorp16.CustomerCode;
      this.toCustomerCodeList = data.lorp16.CustomerCode;
      this.reportFormatList = data.lorp16.ReportFormat;
      this.contractStatusList = data.lorp16.ContractStatus;
      this.bindDropDownList();
      this.searchForm.setControl('ContractStatus', this.fb.array(this.contractStatusList.map((detail) => this.contractStatusForm(detail))))
    });
  }

  get getParameterForSingleLookup() {
    return { ListItemGroupCode: "income_loan" }
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterLoanType(true);
    this.filterContractNo(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value, true);
    this.filterReportFormat(true);
    this.filterFromCustomerCodeList(true);
    this.filterToCustomerCodeList(true);
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
      this.fromLoanTypeList = this.selectFilter.FilterActive(this.loanTypeList);
      this.toLoanTypeList = this.selectFilter.FilterActive(this.loanTypeList);
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
    // this.selectFilter.SortByLang(this.reportFormatList);
    this.reportFormatList = [...this.reportFormatList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP02');
  }

  resetDate() {
    this.minDate = null;
    if (this.searchForm.controls.ReportFormat.value === '03') {
      this.searchForm.controls.Date.reset();
      this.minDate = this.now;
    }
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value);
    const loanType = this.getLocaleCompare(this.searchForm.controls.FromLoanType.value, this.searchForm.controls.ToLoanType.value);
    const customerCode = this.getLocaleCompare(this.searchForm.controls.FromCustomerCode.value, this.searchForm.controls.ToCustomerCode.value);
    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromBranch', 'Label.LORP02.ToBranch']);
    if (loanType > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromLoanType', 'Label.LORP02.ToLoanType']);
    if (customerCode > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromCustomerCode', 'Label.LORP02.ToCustomerCode']);
    if (branch == 1 || loanType == 1 || customerCode == 1 > 0) return;

    var selected = [];
    var selectedText = '';
    this.searchForm.controls.ContractStatus.value.forEach(element => {
      if (element.Active) {
        selected.push(element.StatusValue)
        selectedText += this.lang.CURRENT == "Tha" ? element.TextTha + ', ' : element.TextEng + ', ';
      }
    });

    this.reportParam.Date = this.searchForm.controls.Date.value;
    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromLoanType = this.searchForm.controls.FromLoanType.value;
    this.reportParam.ToLoanType = this.searchForm.controls.ToLoanType.value;
    this.reportParam.FromCustomerCode = this.searchForm.controls.FromCustomerCode.value;
    this.reportParam.ToCustomerCode = this.searchForm.controls.ToCustomerCode.value;
    this.reportParam.ContractStatus = selected.join(",");

    if (this.searchForm.controls.ReportFormat.value == '04' || this.searchForm.controls.ReportFormat.value == '06') {
      this.reportParam.ReportName = 'AttachmentReport4';
    } else if (this.searchForm.controls.ReportFormat.value == '05') {
      this.reportParam.ReportName = 'AttachmentReport3';
    } else {
      this.reportParam.ReportName = 'LORP16_' + this.searchForm.controls.ReportFormat.value;
    }

    this.reportParam.ExportType = this.searchForm.controls.ExportType.value;
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.FromBranchCode.value ? this.fromBranchList : this.listTextAll)
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromLoanType.value, this.loanTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToLoanType.value, this.loanTypeList);
    this.reportParam.FromCustomerCodeText = this.getText(this.searchForm.controls.FromCustomerCode.value, this.fromCustomerCodeList);
    this.reportParam.ToCustomerCodeText = this.getText(this.searchForm.controls.ToCustomerCode.value, this.toCustomerCodeList);
    this.reportParam.ReportFormat = this.searchForm.controls.ReportFormat.value;
    this.reportParam.ContractStatusText = selectedText.substring(0, selectedText.length - 2);
    this.reportParam.IsIgnorePagination = ((this.searchForm.controls.ReportFormat.value == '04' || this.searchForm.controls.ReportFormat.value == '06') && this.searchForm.controls.ExportType.value == 'xlsx') ? true : false;
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
  get contractStatus(): FormArray {
    return this.searchForm.get('ContractStatus') as FormArray;
  };

  contractStatusForm(item: ContractStatus): FormGroup {
    let fg = this.fb.group({
      StatusValue: null,
      TextTha: null,
      TextEng: null,
      Active: false,
      //RowState: RowState.Add,
    });

    fg.patchValue(item, { emitEvent: false });
    return fg;
  }
}
