import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp18Service, ReportParam } from '@app/feature/lo/lorp18/lorp18.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lorp18LookupComponent } from './lorp18-lookup.component';

@Component({
  templateUrl: './lorp18.component.html'
})

export class Lorp18Component implements OnInit {
  Lorp18LookupContent = Lorp18LookupComponent;
  fromBranchList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  toContractNoList = [];
  contractNoList = [];
  fromContractNoList = [];
  reportFormatList = [];
  menuForm: FormGroup;
  count: Number = 5;
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;
  reportParam = {} as ReportParam;
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  reportFormat: string;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lorp18Service: Lorp18Service,
    public lang: LangService,
    private route: ActivatedRoute,
    private saveData: SaveDataService,
    private as: AlertService,
    private selectFilter: SelectFilterService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      Pidate: [new Date(), Validators.required],
      FromBranchCode: null,
      ToBranchCode: null,
      FromLoanType: null,
      ToLoanType: null,
      FromContractNo: null,
      ToContractNo: null,
    });
    this.searchForm.controls.FromBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
      this.filterContractNo(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value, true);
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
    });
    this.searchForm.controls.ToBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
      this.filterContractNo(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value, true);
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
    });
    this.searchForm.controls.FromLoanType.valueChanges.subscribe(value => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
    })

    this.searchForm.controls.ToLoanType.valueChanges.subscribe(value => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
    })
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP18');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp18.Branch;
      this.toBranchList = data.lorp18.Branch;
      this.loanTypeList = data.lorp18.LoanType;
      this.fromLoanTypeList = data.lorp18.LoanType;
      this.toLoanTypeList = data.lorp18.LoanType;
      this.contractNoList = data.lorp18.ContractNo;
      this.fromContractNoList = data.lorp18.ContractNo;
      this.toContractNoList = data.lorp18.ContractNo;
      this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterReportFormat(true);
    this.filterContractNo(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value, true);
    this.filterLoanType(true);
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
    this.saveData.save(this.searchForm.value, 'LORP18');
  }

  print() {

    // Object.assign(this.reportParam, this.searchForm.value);
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    if (this.searchForm.controls.Pidate.value == null) {
      return;
    }
    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value);
    const loanType = this.getLocaleCompare(this.searchForm.controls.FromLoanType.value, this.searchForm.controls.ToLoanType.value);
    const contractNo = this.getLocaleCompare(this.searchForm.controls.FromContractNo.value,
      this.searchForm.controls.ToContractNo.value);
    if (branch > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP18.FromBranch', 'Label.LORP18.ToBranch']);
    }
    if (loanType > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP18.FromLoanType', 'Label.LORP18.ToLoanType']);
    }
    if (contractNo > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP18.FromContractNo', 'Label.LORP18.ToContractNo']);
    }
    if (branch == 1 || loanType == 1 || contractNo == 1 > 0) { return; }
    this.reportParam.Pidate = this.searchForm.controls.Pidate.value;
    this.reportParam.FromContractNo = this.searchForm.controls.FromContractNo.value;
    this.reportParam.ToContractNo = this.searchForm.controls.ToContractNo.value;
    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromLoanType = this.searchForm.controls.FromLoanType.value;
    this.reportParam.ToLoanType = this.searchForm.controls.ToLoanType.value;
    this.reportParam.ReportName = 'LORP18';
    this.reportParam.ExportType = 'pdf';
    this.reportParam.FromContractNoText = this.getText(this.searchForm.controls.FromContractNo.value, this.contractNoList);
    this.reportParam.ToContractNoText = this.getText(this.searchForm.controls.ToContractNo.value, this.contractNoList);
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromLoanType.value, this.loanTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToLoanType.value, this.loanTypeList);
    this.lorp18Service.generateReport(this.reportParam).pipe(
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
