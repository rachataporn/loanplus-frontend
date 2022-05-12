import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp15Service, ReportParam } from '@app/feature/lo/lorp15/lorp15.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { SelectFilterService } from '../../../shared/service/select-filter.service';
import { FormArray } from '@angular/forms';
import { Lorp15LookupComponent } from './lorp15-lookup.component';
import { Lorp15LookupCustomerCodeComponent } from './lorp15-lookup-customercode.component';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
@Component({
  templateUrl: './lorp15.component.html'
})

export class Lorp15Component implements OnInit, OnDestroy {

  menuForm: FormGroup;
  count: Number = 5;
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;

  Lorp15LookupContent = Lorp15LookupComponent;
  Lorp15LookupCustomerCodeComponent = Lorp15LookupCustomerCodeComponent;
  fromBranchList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  fromContractNoList = [];
  toContractNoList = [];
  filterFromContractNoList = [];
  filterToContractNoList = [];
  customerCodeList = [];
  contractNoList = [];
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  reportFormatList = [];
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
    private ls: Lorp15Service,
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
      AsOfDate: [new Date(), Validators.required],
      FromContractNo: null,
      ToContractNo: null,
      FromCustomerCode: null,
      ToCustomerCode: null,
      ReportFormat: [null, Validators.required],
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

    const saveData = this.saveData.retrive('LORP15');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp15.Branch;
      this.toBranchList = data.lorp15.Branch;
      this.loanTypeList = data.lorp15.LoanType;
      this.fromLoanTypeList = data.lorp15.LoanType;
      this.toLoanTypeList = data.lorp15.LoanType;
      this.fromContractNoList = data.lorp15.ContractNo;
      this.toContractNoList = data.lorp15.ContractNo;
      this.filterFromContractNoList = data.lorp15.ContractNo;
      this.filterToContractNoList = data.lorp15.ContractNo;
      this.fromCustomerCodeList = data.lorp15.CustomerCode;
      this.toCustomerCodeList = data.lorp15.CustomerCode;
      this.reportFormatList = data.lorp15.ReportFormat;
      this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterLoanType(true);
    this.filterFromContractNo(true);
    this.filterToContractNo(true);
    this.filterReportFormat(true);
    this.filterCustomerCodeList(true);
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

  filterFromContractNo(filter?: boolean) {
    this.selectFilter.SortByLang(this.fromContractNoList);
    this.fromContractNoList = [...this.fromContractNoList];
  }

  filterToContractNo(filter?: boolean) {
    this.selectFilter.SortByLang(this.toContractNoList);
    this.toContractNoList = [...this.toContractNoList];
  }

  filterCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.customerCodeList);
    this.customerCodeList = [...this.customerCodeList];
  }

  filterFromCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.fromCustomerCodeList);
    this.fromCustomerCodeList = [...this.fromCustomerCodeList];
  }

  filterToCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.toCustomerCodeList);
    this.toCustomerCodeList = [...this.toCustomerCodeList];
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

  filterContractNo() {
    if (this.searchForm.controls.FromBranchCode.value != null && this.searchForm.controls.ToBranchCode.value != null) {
      this.filterFromContractNoList = this.fromContractNoList.filter(filter => filter.CompanyCode >=
        this.searchForm.controls.FromBranchCode.value && filter.CompanyCode <= this.searchForm.controls.ToBranchCode.value);
      this.filterToContractNoList = this.toContractNoList.filter(filter => filter.CompanyCode >=
        this.searchForm.controls.FromBranchCode.value && filter.CompanyCode <= this.searchForm.controls.ToBranchCode.value);

    } else if (this.searchForm.controls.FromBranchCode.value == null && this.searchForm.controls.ToBranchCode.value == null) {
      this.filterFromContractNoList = this.fromContractNoList;
      this.filterToContractNoList = this.toContractNoList;

    } else if (this.searchForm.controls.FromBranchCode.value != null && this.searchForm.controls.ToBranchCode.value == null) {
      this.filterFromContractNoList = this.fromContractNoList.filter(filter => filter.CompanyCode >=
        this.searchForm.controls.FromBranchCode.value);
      this.filterToContractNoList = this.toContractNoList.filter(filter => filter.CompanyCode >=
        this.searchForm.controls.FromBranchCode.value);

    } else if (this.searchForm.controls.FromBranchCode.value == null && this.searchForm.controls.ToBranchCode.value != null) {
      this.filterFromContractNoList = this.fromContractNoList.filter(filter => filter.CompanyCode <=
        this.searchForm.controls.ToBranchCode.value);
      this.filterToContractNoList = this.toContractNoList.filter(filter => filter.CompanyCode <=
        this.searchForm.controls.ToBranchCode.value);
    }
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
    this.saveData.save(this.searchForm.value, 'LORP15');
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
    const customerCode = this.getLocaleCompare(this.searchForm.controls.FromCustomerCode.value, this.searchForm.controls.ToCustomerCode.value);
    if (branch > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP15.FromBranch', 'Label.LORP15.ToBranch']);
    }
    if (loanType > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP15.FromLoanType', 'Label.LORP15.ToLoanType']);
    }
    if (contractNo > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP15.FromContractNo', 'Label.LORP15.ToContractNo']);
    }
    if (customerCode > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP15.FromCustomerCode', 'Label.LORP15.ToCustomerCode']);
    }
    if (branch == 1 || contractNo == 1 || loanType == 1 || customerCode == 1 > 0) { return; }

    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromLoanType = this.searchForm.controls.FromLoanType.value;
    this.reportParam.ToLoanType = this.searchForm.controls.ToLoanType.value;
    this.reportParam.AsOfDate = this.searchForm.controls.AsOfDate.value;
    this.reportParam.FromContractNo = this.searchForm.controls.FromContractNo.value;
    this.reportParam.ToContractNo = this.searchForm.controls.ToContractNo.value;
    this.reportParam.FromCustomerCode = this.searchForm.controls.FromCustomerCode.value;
    this.reportParam.ToCustomerCode = this.searchForm.controls.ToCustomerCode.value;
    this.reportParam.ReportName = 'LORP15_' + this.searchForm.controls.ReportFormat.value;
    this.reportParam.ExportType = this.searchForm.controls.ExportType.value;
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromLoanType.value, this.fromLoanTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToLoanType.value, this.toLoanTypeList);
    this.reportParam.FromCustomerCodeText = this.getText(this.searchForm.controls.FromCustomerCode.value, this.fromCustomerCodeList);
    this.reportParam.ToCustomerCodeText = this.getText(this.searchForm.controls.ToCustomerCode.value, this.toCustomerCodeList);
    this.reportParam.FromContractCodeText = this.getText(this.searchForm.controls.FromContractNo.value, this.fromContractNoList);
    this.reportParam.ToContractCodeText = this.getText(this.searchForm.controls.ToContractNo.value, this.toContractNoList);
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
