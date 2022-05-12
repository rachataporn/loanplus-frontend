import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp10Service, ContractStatus, ReportParam } from '@app/feature/lo/lorp10/lorp10.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lorp10LookupLoantypeFromComponent } from './lorp10-lookup-loantypefrom.component';
import { Lorp10LookupCostomerCodeFromComponent } from './lorp10-lookup-customercodefrom.component';
import { Lorp10LookupLoanContractFromComponent } from './lorp10-lookup-contractcodefrom.component';

@Component({
  templateUrl: './lorp10.component.html'
})

export class Lorp10Component implements OnInit {
  Lorp10LookupLoantypeFromContent = Lorp10LookupLoantypeFromComponent;
  Lorp10LookupCostomerCodeContent = Lorp10LookupCostomerCodeFromComponent;
  Lorp10LookupLoanContractFromContent = Lorp10LookupLoanContractFromComponent;
  loanTypeList = [];
  reportParam = {} as ReportParam

  fromBranchList = [];
  toBranchList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  fromContractNoList = [];
  toContractNoList = [];
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  contractStatusList = [];
  reportFormatList = [];
  reportConditionList = [];

  menuForm: FormGroup;
  count: Number = 5;
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;

  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;

  hideF = '';

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private sv: Lorp10Service,
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
      FromLoanType: null,
      ToLoanType: null,
      FromContractNo: null,
      ToContractNo: null,
      FromCustomerCode: null,
      ToCustomerCode: null,
      ReportFormat: [null, Validators.required],
      conditionReport: null,
      StartDate: new Date(),
      EndDate: new Date(),
      ContractStatus: this.fb.array([]),
    });

    this.searchForm.controls.conditionReport.valueChanges.subscribe(value => {
      value == null ? this.hideF = '0' : this.hideF = '1';
    })

    this.searchForm.controls.FromLoanType.valueChanges.subscribe(value => {
    })

    this.searchForm.controls.FromBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.FromCustomerCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToCustomerCode.setValue(null, { emitEvent: false });
    });

    this.searchForm.controls.ToBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.FromCustomerCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToCustomerCode.setValue(null, { emitEvent: false });
    });

    this.searchForm.controls.FromLoanType.valueChanges.subscribe(value => {
      this.searchForm.controls.FromCustomerCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToCustomerCode.setValue(null, { emitEvent: false });
    })

    this.searchForm.controls.ToLoanType.valueChanges.subscribe(value => {
      this.searchForm.controls.FromCustomerCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToCustomerCode.setValue(null, { emitEvent: false });
    })
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp10.Branch;
      this.toBranchList = data.lorp10.Branch;

      this.loanTypeList = data.lorp10.LoanType;
      this.fromLoanTypeList = data.lorp10.LoanType;
      this.toLoanTypeList = data.lorp10.LoanType;

      this.fromContractNoList = this.toContractNoList = data.lorp10.ContractNo;
      this.fromCustomerCodeList = this.toCustomerCodeList = data.lorp10.CustomerCode;
      this.reportFormatList = data.lorp10.ReportFormat;
      this.reportConditionList = data.lorp10.ReportCondition;
      this.contractStatusList = data.lorp10.ContractStatus;
      this.searchForm.setControl('ContractStatus', this.fb.array(this.contractStatusList.map((detail) => this.contractStatusForm(detail))));

      this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterLoanType(true);
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterReportFormate(true);
    this.filterReportCondition(true);
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
        this.toBranchList = this.selectFilter.FilterActiveByValue(this.toBranchList, detail.FromBranch);
      }
      else {
        this.toBranchList = this.selectFilter.FilterActive(this.toBranchList);
      }
    }
    this.selectFilter.SortByLang(this.toBranchList);
    this.toBranchList = [...this.toBranchList];
  }

  filterReportFormate(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.reportFormatList = this.selectFilter.FilterActiveByValue(this.reportFormatList, detail.FromBranch);
      }
      else {
        this.reportFormatList = this.selectFilter.FilterActive(this.reportFormatList);
      }
    }
    // this.selectFilter.SortByLang(this.reportFormatList);
    this.reportFormatList = [...this.reportFormatList];
  }

  filterReportCondition(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.reportConditionList = this.selectFilter.FilterActiveByValue(this.reportConditionList, detail.FromBranch);
      }
      else {
        this.reportConditionList = this.selectFilter.FilterActive(this.reportConditionList);
      }
    }
    // this.selectFilter.SortByLang(this.reportConditionList);
    this.reportConditionList = [...this.reportConditionList];
  }

  ngOnDestroy() {
    // this.saveData.save(this.searchForm.value, 'lomt01');
  }

  get getParameterForSingleLookup() {
    return { ListItemGroupCode: "income_loan" }
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.searchForm.controls.conditionReport.value == null) {
      this.searchForm.controls.StartDate.setValue(null);
      this.searchForm.controls.EndDate.setValue(null);
    }

    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value);
    const loanType = this.getLocaleCompare(this.searchForm.controls.FromLoanType.value, this.searchForm.controls.ToLoanType.value);
    const contractNo = this.getLocaleCompare(this.searchForm.controls.FromContractNo.value, this.searchForm.controls.ToContractNo.value);
    const customerCode = this.getLocaleCompare(this.searchForm.controls.FromCustomerCode.value, this.searchForm.controls.ToCustomerCode.value);
    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromBranch', 'Label.LORP02.ToBranch']);
    if (loanType > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromLoanType', 'Label.LORP02.ToLoanType']);
    if (contractNo > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromContractNo', 'Label.LORP02.ToContractNo']);
    if (customerCode > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP02.FromCustomerCode', 'Label.LORP02.ToCustomerCode']);
    if (branch == 1 || contractNo == 1 || loanType == 1 || customerCode == 1 > 0) return;

    if (this.searchForm.controls.conditionReport.value) {
      if (this.searchForm.controls.StartDate.value == null || this.searchForm.controls.EndDate.value == null) {
        this.as.warning('', 'กรุณากรอกวันที่ให้ถูกต้อง');
        return;
      }
    }

    var selected = [];
    var selectedText = '';
    this.searchForm.controls.ContractStatus.value.forEach(element => {
      if (element.Active) {
        selected.push(element.StatusValue);
        selectedText += this.lang.CURRENT == "Tha" ? element.TextTha + ', ' : element.TextEng + ', ';
      }
      if (selected.length === this.contractStatusList.length) {
        this.lang.CURRENT == "Tha" ? selectedText = 'ทั้งหมด   ' : selectedText = 'All';
      }
    });

    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromLoanType = this.searchForm.controls.FromLoanType.value;
    this.reportParam.ToLoanType = this.searchForm.controls.ToLoanType.value;
    this.reportParam.FromCustomerCode = this.searchForm.controls.FromCustomerCode.value;
    this.reportParam.ToCustomerCode = this.searchForm.controls.ToCustomerCode.value;
    this.reportParam.FromContractNo = this.searchForm.controls.FromContractNo.value;
    this.reportParam.ToContractNo = this.searchForm.controls.ToContractNo.value;
    this.reportParam.ContractStatus = selected.join(",");
    this.reportParam.ReportName = 'LORP10_' + this.searchForm.controls.ReportFormat.value;
    this.reportParam.ExportType = 'pdf';
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromLoanType.value, this.fromLoanTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToLoanType.value, this.toLoanTypeList);
    this.reportParam.FromContractNoText = this.getText(this.searchForm.controls.FromContractNo.value, this.fromContractNoList);
    this.reportParam.ToContractNoText = this.getText(this.searchForm.controls.ToContractNo.value, this.toContractNoList);
    this.reportParam.FromCustomerCodeText = this.getText(this.searchForm.controls.FromCustomerCode.value, this.fromCustomerCodeList);
    this.reportParam.ToCustomerCodeText = this.getText(this.searchForm.controls.ToCustomerCode.value, this.toCustomerCodeList);

    this.reportParam.ContractStatusText = selectedText.substring(0, selectedText.length - 2);
    this.reportParam.FormDate = this.searchForm.controls.StartDate.value;
    this.reportParam.ToDate = this.searchForm.controls.EndDate.value;
    this.reportParam.ConditionReport = this.searchForm.controls.conditionReport.value;

    // this.sv.CheckgenerateReport(this.reportParam).pipe(finalize(() => { this.submitted = false; })
    // ).subscribe((res) => {
    //   res ? this.as.warning('', 'ไม่พบข้อมูล ใช้ Genreport') : this.gennarateReport();
    // });
    this.gennarateReport();
  }

  gennarateReport() {
    this.sv.generateReport(this.reportParam).pipe(
      finalize(() => { this.submitted = false; })
    ).subscribe((res) => {
      if (res) { this.srcResult = res; }
    });
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
