import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp13Service, ReportParam, ContractStatus } from '@app/feature/lo/lorp13/lorp13.service';
import { Page, ModalService, SelectFilterService, RowState } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lorp13LookupComponent } from './lorp13-lookup.component';
import { Lorp13LookupCustomerCodeComponent } from './lorp13-lookup-customer-code.component';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
@Component({
  templateUrl: './lorp13.component.html'
})

export class Lorp13Component implements OnInit, OnDestroy {
  Lorp13LookupContent = Lorp13LookupComponent;
  Lorp13LookupCustomerCodeComponent = Lorp13LookupCustomerCodeComponent;
  statusPage: boolean;
  searchForm: FormGroup;
  fromBranchList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  userNo1List = [];
  userNo2List = [];
  reportFormatList = [];
  contractStatusList = [];
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  reportParam = {} as ReportParam;
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  now = new Date();
  exportType = [{ Value: 'pdf', TextTha: 'PDF', TextEng: 'PDF', active: true }
  , { Value: 'xlsx', TextTha: 'EXCEL', TextEng: 'EXCEL', active: true }]
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp13Service,
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
      FromCustomerCode: null,
      ToCustomerCode: null,
      UserNo1: null,
      UserNo2: null,
      ReportFormat: [null, Validators.required],
      ContractStatus: this.fb.array([]),
      ExportType: 'pdf'
    });

    this.searchForm.controls.FromBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
    });
    this.searchForm.controls.ToBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
    });
  }

  ngOnInit() {

    const saveData = this.saveData.retrive('LORP13');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp13.Branch;
      this.toBranchList = data.lorp13.Branch;
      this.loanTypeList = data.lorp13.LoanType;
      this.fromLoanTypeList = data.lorp13.LoanType;
      this.toLoanTypeList = data.lorp13.LoanType;
      this.userNo1List = data.lorp13.UserName;
      this.userNo2List = data.lorp13.UserName;
      this.reportFormatList = data.lorp13.ReportFormat;
      this.contractStatusList = data.lorp13.ContractStatus;
      this.fromCustomerCodeList = this.toCustomerCodeList = data.lorp13.CustomerCode;
      this.bindDropDownList();
      this.searchForm.setControl('ContractStatus', this.fb.array(this.contractStatusList.map((detail) => this.contractStatusForm(detail))));
    });
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterLoanType(true);
    this.filterReportFormat(true);
    this.filterUserNo1List(true);
    this.filterUserNo2List(true);
    this.filterFromCustomerCodeList(true);
    this.filterToCustomerCodeList(true);
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
    this.selectFilter.SortByLang(this.fromBranchList);
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
    this.selectFilter.SortByLang(this.toBranchList);
    this.toBranchList = [...this.toBranchList];
  }

  filterUserNo1List(filter?: boolean) {
    // this.selectFilter.SortByLang(this.userNo1List);
    this.userNo1List = [...this.userNo1List];
  }

  filterUserNo2List(filter?: boolean) {
    // this.selectFilter.SortByLang(this.userNo2List);
    this.userNo2List = [...this.userNo2List];
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

  filterFromCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.fromCustomerCodeList);
    this.fromCustomerCodeList = [...this.fromCustomerCodeList];
  }

  filterToCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.toCustomerCodeList);
    this.toCustomerCodeList = [...this.toCustomerCodeList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP13');
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
    const customerCode = this.getLocaleCompare(this.searchForm.controls.FromCustomerCode.value,
      this.searchForm.controls.ToCustomerCode.value);
    const userNo = this.getLocaleCompareNumber(this.searchForm.controls.UserNo1.value, this.searchForm.controls.UserNo2.value);
    if (branch > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP13.FromBranch', 'Label.LORP13.ToBranch']);
    }
    if (loanType > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP13.FromLoanType', 'Label.LORP13.ToLoanType']);
    }
    if (contractNo > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP13.FromContractNo', 'Label.LORP13.ToContractNo']);
    }
    if (customerCode > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP13.FromCustomerCode', 'Label.LORP13.ToCustomerCode']);
    }
    if (userNo > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP13.FromUser', 'Label.LORP13.ToUser']);
    }
    if (branch == 1 || contractNo == 1 || customerCode == 1 || userNo == 1 || loanType == 1 > 0) { return; }

    const selected = [];
    let selectedText = '';
    this.searchForm.controls.ContractStatus.value.forEach(element => {
      if (element.Active) {
        selected.push(element.StatusValue);
        selectedText += this.lang.CURRENT === 'Tha' ? element.TextTha + ', ' : element.TextEng + ', ';
      }
      if (selected.length === this.contractStatusList.length) {
        // this.lang.CURRENT == "Tha" ? selectedText = 'ทั้งหมด   ' : selectedText = 'All';
        selectedText = '';
      }
    });

    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromLoanType = this.searchForm.controls.FromLoanType.value;
    this.reportParam.ToLoanType = this.searchForm.controls.ToLoanType.value;
    this.reportParam.FromApprovedContractDate = this.searchForm.controls.FromApprovedContractDate.value;
    this.reportParam.ToApprovedContractDate = this.searchForm.controls.ToApprovedContractDate.value;
    this.reportParam.FromContractNo = this.searchForm.controls.FromContractNo.value;
    this.reportParam.ToContractNo = this.searchForm.controls.ToContractNo.value;
    this.reportParam.FromCustomerCode = this.searchForm.controls.FromCustomerCode.value;
    this.reportParam.ToCustomerCode = this.searchForm.controls.ToCustomerCode.value;
    this.reportParam.UserNo1 = this.searchForm.controls.UserNo1.value;
    this.reportParam.UserNo2 = this.searchForm.controls.UserNo2.value;
    this.reportParam.ContractStatus = selected.join(',');
    this.reportParam.ReportName = 'LORP13_' + this.searchForm.controls.ReportFormat.value;
    this.reportParam.ExportType =  this.searchForm.controls.ExportType.value;
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromLoanType.value, this.loanTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToLoanType.value, this.loanTypeList);
    this.reportParam.FromCustomerCodeText = this.getText(this.searchForm.controls.FromCustomerCode.value, this.fromCustomerCodeList);
    this.reportParam.ToCustomerCodeText = this.getText(this.searchForm.controls.ToCustomerCode.value, this.toCustomerCodeList);
    this.reportParam.FromCustomerCodeText = this.getText(this.searchForm.controls.FromCustomerCode.value, this.fromCustomerCodeList);
    this.reportParam.UserNo1Text = this.getText(this.searchForm.controls.UserNo1.value, this.userNo1List);
    this.reportParam.UserNo2Text = this.getText(this.searchForm.controls.UserNo2.value, this.userNo2List);
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
      return from.toString().localeCompare(to.toString());
    }
  }


  getLocaleCompareNumber(from: number, to: number) {
    if (from == null || to == null || from <= to) {
      return 0;
    } else {
      return 1;
    }
  }

}
