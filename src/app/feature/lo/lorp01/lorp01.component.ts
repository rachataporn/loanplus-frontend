import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp01Service, ReportParam } from '@app/feature/lo/lorp01/lorp01.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { from } from 'rxjs';

@Component({
  templateUrl: './lorp01.component.html'
})

export class Lorp01Component implements OnInit {

  searchForm: FormGroup;
  printing: boolean;
  fromBranchList = [];
  toBranchList = [];
  fromContractNoList = [];
  toContractNoList = [];
  filterFromContractNoList = [];
  filterToContractNoList = [];
  reportParam = {} as ReportParam
  srcResult = null;
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp01Service,
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
      FromContractNo: null,
      ToContractNo: null,
    });
    
    this.searchForm.controls.FromBranch.valueChanges.subscribe(res => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
      this.filterContractNo();
    });
    this.searchForm.controls.ToBranch.valueChanges.subscribe(res => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
      this.filterContractNo();
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP01');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });
    
    this.route.data.subscribe((data) => {
      this.fromBranchList = data.loandetails.Branch;
      this.toBranchList = data.loandetails.Branch;
      this.fromContractNoList = data.loandetails.ContractNo;
      this.toContractNoList = data.loandetails.ContractNo;
      this.filterFromContractNoList = data.loandetails.ContractNo;
      this.filterToContractNoList = data.loandetails.ContractNo;
      this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterFromContractNo(true);
    this.filterToContractNo(true);
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
    this.selectFilter.SortByLang(this.filterFromContractNoList);
    this.filterFromContractNoList = [...this.filterFromContractNoList];
  }

  filterToContractNo(filter?: boolean) {
    this.selectFilter.SortByLang(this.filterToContractNoList);
    this.filterToContractNoList = [...this.filterToContractNoList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP01');
  }

  print() {
    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranch.value, this.searchForm.controls.ToBranch.value);
    const contractNo = this.getLocaleCompare(this.searchForm.controls.FromContractNo.value, this.searchForm.controls.ToContractNo.value);

    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP01.FromBranch', 'Label.LORP01.ToBranch']);
    if (contractNo > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP01.FromContractNo', 'Label.LORP01.ToContractNo']);
    if (branch == 1 || contractNo == 1> 0) return;

    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.ReportName = 'LORP01';
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

  filterContractNo() {
    if (this.searchForm.controls.FromBranch.value != null && this.searchForm.controls.ToBranch.value != null) {
      this.filterFromContractNoList = this.fromContractNoList.filter(filter =>  filter.CompanyCode >= this.searchForm.controls.FromBranch.value && filter.CompanyCode <= this.searchForm.controls.ToBranch.value );
      this.filterToContractNoList = this.toContractNoList.filter(filter =>  filter.CompanyCode >= this.searchForm.controls.FromBranch.value  && filter.CompanyCode <= this.searchForm.controls.ToBranch.value );
    }
    else if (this.searchForm.controls.FromBranch.value == null && this.searchForm.controls.ToBranch.value == null) {
      this.filterFromContractNoList = this.fromContractNoList;
      this.filterToContractNoList = this.toContractNoList;
    }
    else if (this.searchForm.controls.FromBranch.value != null && this.searchForm.controls.ToBranch.value == null) {
      this.filterFromContractNoList  = this.fromContractNoList.filter(filter =>  filter.CompanyCode >= this.searchForm.controls.FromBranch.value);
      this.filterToContractNoList = this.toContractNoList.filter(filter => filter.CompanyCode >= this.searchForm.controls.FromBranch.value);
    }
    else if (this.searchForm.controls.FromBranch.value == null && this.searchForm.controls.ToBranch.value != null) {
      this.filterFromContractNoList  = this.fromContractNoList.filter(filter =>  filter.CompanyCode <= this.searchForm.controls.ToBranch.value);
      this.filterToContractNoList = this.toContractNoList.filter(filter =>  filter.CompanyCode <= this.searchForm.controls.ToBranch.value);
    }
  }
}
