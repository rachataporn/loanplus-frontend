import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp34Service, ReportParam } from '@app/feature/lo/lorp34/lorp34.service';
import { Page, ModalService, SelectFilterService, RowState } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lorp34LookupComponent } from './lorp34-lookup.component';
import { Lorp34LookupCustomerCodeComponent } from './lorp34-lookup-customer-code.component';

@Component({
  templateUrl: './lorp34.component.html'
})

export class Lorp34Component implements OnInit, OnDestroy {
  Lorp34LookupContent = Lorp34LookupComponent;
  Lorp34LookupCustomerCodeComponent = Lorp34LookupCustomerCodeComponent;
  statusPage: boolean;
  searchForm: FormGroup;
  CompanyList = [];
  BranchList = [];
  fromBranchList = [];
  toBranchList = [];
  customerCodeList = [];
  reportParam = {} as ReportParam;
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  loanData: any;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp34Service,
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
      CompanyCode: [null, Validators.required],
      FromBranchCode: null,
      ToBranchCode: null,
      FromContractNo: null,
      ToContractNo: null,
      CustomerCode: null
    });

    this.searchForm.controls.CompanyCode.valueChanges.subscribe(val => {
      this.searchForm.controls.FromBranchCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToBranchCode.setValue(null, { emitEvent: false });
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });

      this.filterFromBranchList(val, true);
      this.filterToBranchList(val, true);
    });
  }

  ngOnInit() {

    const saveData = this.saveData.retrive('LORP34');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.CompanyList = data.lorp34.Company;
      this.BranchList = data.lorp34.Branch;
      this.customerCodeList = data.lorp34.CustomerCode;
      this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterCompanyList(true);
    this.filterFromBranchList(this.searchForm.controls.CompanyCode.value, true);
    this.filterToBranchList(this.searchForm.controls.CompanyCode.value, true);
  }

  filterCompanyList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.CompanyList = this.selectFilter.FilterActiveByValue(this.CompanyList, detail.FromCompany);
      } else {
        this.CompanyList = this.selectFilter.FilterActive(this.CompanyList);
      }
    }
    this.CompanyList = [...this.CompanyList];
  }

  filterFromBranchList(CompanyCode, filter?: boolean) {
    if (CompanyCode) {
      this.fromBranchList = this.BranchList.filter(x => x.MainCompany == CompanyCode);
    } else {
      this.fromBranchList = [];
    }

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

  filterToBranchList(CompanyCode, filter?: boolean) {
    if (CompanyCode) {
      this.toBranchList = this.BranchList.filter(x => x.MainCompany == CompanyCode);
    } else {
      this.toBranchList = [];
    }

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

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP34');
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value);
    const contractNo = this.getLocaleCompare(this.searchForm.controls.FromContractNo.value, this.searchForm.controls.ToContractNo.value);

    if (branch > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP34.FromBranch', 'Label.LORP34.ToBranch']);
    }
    if (contractNo > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP34.FromContractNo', 'Label.LORP34.ToContractNo']);
    }
    if (branch == 1 || contractNo == 1 > 0) { return; }

    this.reportParam.CompanyCode = this.searchForm.controls.CompanyCode.value;
    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromContractNo = this.searchForm.controls.FromContractNo.value;
    this.reportParam.ToContractNo = this.searchForm.controls.ToContractNo.value;
    this.reportParam.CustomerCode = this.searchForm.controls.CustomerCode.value;

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

  getLocaleCompare(from, to) {
    if (from == null || to == null) {
      return 0;
    } else {
      return from.localeCompare(to);
    }
  }

}
