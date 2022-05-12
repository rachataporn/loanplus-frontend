import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorf06Service, ReportParam } from '@app/feature/lo/lorf06/lorf06.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { from } from 'rxjs';

@Component({
  templateUrl: './lorf06.component.html'
})

export class Lorf06Component implements OnInit {

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
    private ls: Lorf06Service,
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
    const saveData = this.saveData.retrive('LORF06');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });
    
    this.route.data.subscribe((data) => {
      this.fromBranchList = data.loanorder.Branch;
      this.toBranchList = data.loanorder.Branch;
      this.fromCustomerCodeList = data.loanorder.BorrowerCode;
      this.toCustomerCodeList = data.loanorder.BorrowerCode;
      this.contractNoList = data.loanorder.ContractNo;
      this.fromContractNoList = data.loanorder.ContractNo;
      this.toContractNoList = data.loanorder.ContractNo;
      this.bindDropDownList();
    });

    
    const routeFromContractNo = this.route.snapshot.paramMap.get('FromContractNo');
    const routeToContractNo = this.route.snapshot.paramMap.get('ToContractNo');
    if(routeFromContractNo && routeToContractNo){
       this.searchForm.reset();
       this.saveData.save(this.searchForm.value,"LORF06");
       this.searchForm.controls.FromContractNo.setValue(routeFromContractNo);
       this.searchForm.controls.ToContractNo.setValue(routeToContractNo);
       this.print();
    }
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
    this.saveData.save(this.searchForm.value, 'LORF06');
  }

  print() {
    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranch.value, this.searchForm.controls.ToBranch.value);
    const contractNo = this.getLocaleCompare(this.searchForm.controls.FromContractNo.value, this.searchForm.controls.ToContractNo.value);
    const customerCode = this.getLocaleCompare(this.searchForm.controls.FromCustomerCode.value, this.searchForm.controls.ToCustomerCode.value);
    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORF06.FromBranch', 'Label.LORF06.ToBranch']);
    if (contractNo > 0) this.as.warning('', 'Message.LO00006', ['Label.LORF06.FromContractNo', 'Label.LORF06.ToContractNo']);
    if (customerCode > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP06.FromCustomerCode', 'Label.LORP06.ToCustomerCode']);
    if (branch + contractNo + customerCode > 0) return;

    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.ReportName = 'LORF06_New';
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
