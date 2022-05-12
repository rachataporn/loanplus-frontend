import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp30Service, ReportParam, ContractStatus } from '@app/feature/lo/lorp30/lorp30.service';
import { Page, ModalService, SelectFilterService, RowState } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
// import { Lorp30LookupComponent } from './lorp30-lookup.component';
// import { Lorp30LookupCustomerCodeComponent } from './lorp30-lookup-customer-code.component';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
@Component({
  templateUrl: './lorp30.component.html'
})

export class Lorp30Component implements OnInit, OnDestroy {
  // Lorp09LookupContent = Lorp30LookupComponent;
  // Lorp09LookupCustomerCodeComponent = Lorp30LookupCustomerCodeComponent;
  statusPage: boolean;
  searchForm: FormGroup;
  fromBranchList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  customerCodeList = [];
  reportFormatList = [];
  // contractStatusList = [];
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
    private ls: Lorp30Service,
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
      FromBranchCode: [null, Validators.required],
      ToBranchCode: [null, Validators.required],
      FromApprovedContractDate: null,
      ToApprovedContractDate: null,
      ExportType: 'xlsx'
    });

    // this.searchForm.controls.FromBranchCode.valueChanges.subscribe(res => {
    //   this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
    //   this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
    //   this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
    //   this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
    // });
    // this.searchForm.controls.ToBranchCode.valueChanges.subscribe(res => {
    //   this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
    //   this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
    //   this.searchForm.controls.FromContractNo.setValue(null, { emitEvent: false });
    //   this.searchForm.controls.ToContractNo.setValue(null, { emitEvent: false });
    // });
  }

  ngOnInit() {

    const saveData = this.saveData.retrive('LORP30');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp30.Branch;
      this.toBranchList = data.lorp30.Branch;
      this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
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
    if (branch > 0) {
      this.as.warning('', 'Message.LO00006', ['Label.LORP30.FromBranch', 'Label.LORP30.ToBranch']);
    }
    if (branch == 1 > 0) { return; }
    let selected = [];
    let selectedText = '';
    let contractValue = null;
    // this.searchForm.controls.ContractStatus.value.forEach(element => {
    //   if (element.Active) {
    //     selected.push(element.StatusValue);
    //     selectedText += this.lang.CURRENT === 'Tha' ? element.TextTha + ', ' : element.TextEng + ', ';
    //   }
    // });
    // if (selected.length === 0 || selected.length === this.searchForm.controls.ContractStatus.value.length) {
    //   contractValue = null;
    //   selectedText = '';
    // } else {
    //   contractValue = selected.join(',');
    // }
    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromApprovedContractDate = this.searchForm.controls.FromApprovedContractDate.value;
    this.reportParam.ToApprovedContractDate = this.searchForm.controls.ToApprovedContractDate.value;
    this.reportParam.ReportName = 'LORP30';
    this.reportParam.ExportType = 'xlsx'
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        if (res) {
          if (this.searchForm.controls.ExportType.value == 'pdf') {
            this.srcResult = res;
          } else {
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

  // get contractStatus(): FormArray {
  //   return this.searchForm.get('ContractStatus') as FormArray;
  // }

  // contractStatusForm(item: ContractStatus): FormGroup {
  //   const fg = this.fb.group({
  //     StatusValue: null,
  //     TextTha: null,
  //     TextEng: null,
  //     Active: false,
  //     // RowState: RowState.Add,
  //   });

  //   fg.patchValue(item, { emitEvent: false });
  //   return fg;
  // }

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
