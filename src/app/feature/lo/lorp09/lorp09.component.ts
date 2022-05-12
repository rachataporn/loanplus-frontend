import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp09Service, ReportParam, ContractStatus } from '@app/feature/lo/lorp09/lorp09.service';
import { Page, ModalService, SelectFilterService, RowState } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lorp09LookupComponent } from './lorp09-lookup.component';
import { Lorp09LookupCustomerCodeComponent } from './lorp09-lookup-customer-code.component';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
@Component({
  templateUrl: './lorp09.component.html'
})

export class Lorp09Component implements OnInit, OnDestroy {
  Lorp09LookupContent = Lorp09LookupComponent;
  Lorp09LookupCustomerCodeComponent = Lorp09LookupCustomerCodeComponent;
  statusPage: boolean;
  searchForm: FormGroup;
  fromBranchList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  customerCodeList = [];
  reportFormatList = [];
  contractStatusList = [];
  reportParam = {} as ReportParam;
  srcResult = null;
  printing: boolean;
  now = new Date();
  submitted: boolean;
  focusToggle: boolean;
  loanData: any;
  exportType = [{ Value: 'pdf', TextTha: 'PDF', TextEng: 'PDF', active: true }
  , { Value: 'xlsx', TextTha: 'EXCEL', TextEng: 'EXCEL', active: true }]
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp09Service,
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
      FromApprovedContractDate: null,
      ToApprovedContractDate: null,
      FromContractNo: null,
      ToContractNo: null,
      CustomerCode: null,
      ReportFormat: [null, Validators.required],
      ContractStatus: this.fb.array([]),
      ExportType: 'pdf'
    });

    this.searchForm.controls.FromBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
    });
    this.searchForm.controls.ToBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
    });
  }

  ngOnInit() {

    const saveData = this.saveData.retrive('LORP09');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp09.Branch;
      this.toBranchList = data.lorp09.Branch;
      this.loanTypeList = data.lorp09.LoanType;
      this.fromLoanTypeList = data.lorp09.LoanType;
      this.toLoanTypeList = data.lorp09.LoanType;
      this.customerCodeList = data.lorp09.CustomerCode;
      this.reportFormatList = data.lorp09.ReportFormat;
      this.contractStatusList = data.lorp09.ContractStatus;
      this.bindDropDownList();
      this.searchForm.setControl('ContractStatus', this.fb.array(this.contractStatusList.map((detail) => this.contractStatusForm(detail))));
    });
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterLoanType(true);
    this.filterReportFormat(true);
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
    // this.selectFilter.SortByLang(this.fromBranchList);
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
    // this.selectFilter.SortByLang(this.toBranchList);
    this.toBranchList = [...this.toBranchList];
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
      } else {
        this.reportFormatList = this.selectFilter.FilterActive(this.reportFormatList);
      }
    }
    // this.selectFilter.SortByLang(this.reportFormatList);
    this.reportFormatList = [...this.reportFormatList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP09');
  }

  print() {

    // Object.assign(this.reportParam, this.searchForm.value);
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value);
    const loanType = this.getLocaleCompare(this.searchForm.controls.FromLoanType.value, this.searchForm.controls.ToLoanType.value);
    const contractNo = this.getLocaleCompare(this.searchForm.controls.FromContractNo.value, this.searchForm.controls.ToContractNo.value);
    if (branch > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP09.FromBranch', 'Label.LORP09.ToBranch']);
    }
    if (loanType > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP09.FromLoanType', 'Label.LORP09.ToLoanType']);
    }
    if (contractNo > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP09.FromContractNo', 'Label.LORP09.ToContractNo']);
    }
    if (branch == 1 || loanType == 1 || contractNo == 1 > 0) { return; }

    let selected = [];
    let selectedText = '';
    let contractValue = null;
    this.searchForm.controls.ContractStatus.value.forEach(element => {
      if (element.Active) {
        selected.push(element.StatusValue);
        selectedText += this.lang.CURRENT === 'Tha' ? element.TextTha + ', ' : element.TextEng + ', ';
      }
    });
    if (selected.length === 0 || selected.length === this.searchForm.controls.ContractStatus.value.length) {
      contractValue = null;
      selectedText = '';
    } else {
      contractValue = selected.join(',');
    }
    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromLoanType = this.searchForm.controls.FromLoanType.value;
    this.reportParam.ToLoanType = this.searchForm.controls.ToLoanType.value;
    this.reportParam.FromApprovedContractDate = this.searchForm.controls.FromApprovedContractDate.value;
    this.reportParam.ToApprovedContractDate = this.searchForm.controls.ToApprovedContractDate.value;
    this.reportParam.FromContractNo = this.searchForm.controls.FromContractNo.value;
    this.reportParam.ToContractNo = this.searchForm.controls.ToContractNo.value;
    this.reportParam.CustomerCode = this.searchForm.controls.CustomerCode.value;
    this.reportParam.ContractStatus = contractValue;
    this.reportParam.ReportName = 'LORP09_' + this.searchForm.controls.ReportFormat.value;
    this.reportParam.ExportType = this.searchForm.controls.ExportType.value;
    this.reportParam.ReportFormatName = this.getText(this.searchForm.controls.ReportFormat.value, this.reportFormatList);
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromLoanType.value, this.fromLoanTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToLoanType.value, this.toLoanTypeList);
    this.reportParam.CustomerCodeText = this.getText(this.searchForm.controls.CustomerCode.value, this.customerCodeList);
    this.reportParam.ContractStatusText = selectedText.substring(0, selectedText.length - 2);
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
