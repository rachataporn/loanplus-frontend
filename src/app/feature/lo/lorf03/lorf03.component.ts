import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorf03Service, ReportParam } from '@app/feature/lo/lorf03/lorf03.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { from } from 'rxjs';

@Component({
  templateUrl: './lorf03.component.html'
})

export class Lorf03Component implements OnInit {

  searchForm: FormGroup;
  printing: boolean;
  fromBranchList = [];
  toBranchList = [];
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  contractNoList = [];
  fromContractNoList = [];
  toContractNoList = [];
  reportParam = {} as ReportParam
  srcResult = null;
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorf03Service,
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
      FromBranch: null,
      ToBranch: null,
      FromCustomerCode: null,
      ToCustomerCode: null,
      FromContractDate: null,
      ToContractDate: null,
      FromContractNo: null,
      ToContractNo: null,
    });

    this.searchForm.controls.FromBranch.valueChanges.subscribe(res => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
      this.filterContractNo(this.searchForm.controls.FromBranch.value, this.searchForm.controls.ToBranch.value, true);
    });
    this.searchForm.controls.ToBranch.valueChanges.subscribe(res => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
      this.filterContractNo(this.searchForm.controls.FromBranch.value, this.searchForm.controls.ToBranch.value, true);
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORF03');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });
    
    this.route.data.subscribe((data) => {
      this.fromBranchList = data.carpurchaseagreement.Branch;
      this.toBranchList = data.carpurchaseagreement.Branch;
      this.fromCustomerCodeList = data.carpurchaseagreement.BorrowerCode;
      this.toCustomerCodeList = data.carpurchaseagreement.BorrowerCode;
      this.contractNoList = data.carpurchaseagreement.ContractNo;
      this.fromContractNoList = data.carpurchaseagreement.ContractNo;
      this.toContractNoList = data.carpurchaseagreement.ContractNo;
      this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterContractNo(this.searchForm.controls.FromBranch.value, this.searchForm.controls.ToBranch.value, true);
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

  filterFromCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.fromCustomerCodeList);
    this.fromCustomerCodeList = [...this.fromCustomerCodeList];
  }

  filterToCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.toCustomerCodeList);
    this.toCustomerCodeList = [...this.toCustomerCodeList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORF03');
  }

  print() {
    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranch.value, this.searchForm.controls.ToBranch.value);
    const contractNo = this.getLocaleCompare(this.searchForm.controls.FromContractNo.value, this.searchForm.controls.ToContractNo.value);
    const customerCode = this.getLocaleCompare(this.searchForm.controls.FromCustomerCode.value, this.searchForm.controls.ToCustomerCode.value);
    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORF03.FromBranch', 'Label.LORF03.ToBranch']);
    if (contractNo > 0) this.as.warning('', 'Message.LO00006', ['Label.LORF03.FromContractNo', 'Label.LORF03.ToContractNo']);
    if (customerCode > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP03.FromCustomerCode', 'Label.LORP03.ToCustomerCode']);
    if (branch + contractNo + customerCode > 0) return;

    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.ReportName = 'LORF03';
    this.reportParam.ExportType = 'pdf';

    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
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
