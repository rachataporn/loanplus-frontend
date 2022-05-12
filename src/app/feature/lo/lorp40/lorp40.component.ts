import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp40Service, ReportParam } from '@app/feature/lo/lorp40/lorp40.service';
import { SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  templateUrl: './lorp40.component.html'
})

export class Lorp40Component implements OnInit {

  statusPage: boolean;
  searchForm: FormGroup;
  fromBranchList = [];
  toBranchList = [];
  fromContractNoList = [];
  toContractNoList = [];
  contractNoList = [];
  reportParam = {} as ReportParam
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  now = new Date();

  constructor(
    private fb: FormBuilder,
    private ls: Lorp40Service,
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
      FromApprovedContractDate: null,
      ToApprovedContractDate: null,
      FromContractNo: null,
      ToContractNo: null
    });

    this.searchForm.controls.FromBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
      this.filterContractNo(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value, true);
    });
    this.searchForm.controls.ToBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
      this.filterContractNo(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value, true);
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP40');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp40.Branch;
      this.toBranchList = data.lorp40.Branch;
      this.contractNoList = data.lorp40.ContractNo;
      this.fromContractNoList = data.lorp40.ContractNo;
      this.toContractNoList = data.lorp40.ContractNo;
      this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterContractNo(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value, true);
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

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP40');
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value);
    const contractNo = this.getLocaleCompare(this.searchForm.controls.FromContractNo.value, this.searchForm.controls.ToContractNo.value);

    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP40.FromBranch', 'Label.LORP40.ToBranch']);
    if (contractNo > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP40.FromContractNo', 'Label.LORP40.ToContractNo']);
    if (branch == 1 || contractNo == 1 > 0) return;

    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromApprovedContractDate = this.searchForm.controls.FromApprovedContractDate.value;
    this.reportParam.ToApprovedContractDate = this.searchForm.controls.ToApprovedContractDate.value;
    this.reportParam.FromContractNo = this.searchForm.controls.FromContractNo.value;
    this.reportParam.ToContractNo = this.searchForm.controls.ToContractNo.value;

    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        if (res) {
          this.OpenWindow(res, 'Formatข้อมูลรายบุคคลสินเชื่อสบายใจ');
        }
      });
  }

  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/xlsx;base64," + data;
    doc.download = name + "_" + "Report-" + ((Number(moment(this.now).format('YYYY')) - 543) + "-") + moment(this.now).format('MM-DD') + ".xlsx";
    doc.click();
  }

  getLocaleCompare(from, to) {
    if (from == null || to == null) {
      return 0;
    } else {
      return from.localeCompare(to);
    }
  }
}
