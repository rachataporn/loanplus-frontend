import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp07Service, ReportParam} from '@app/feature/lo/lorp07/lorp07.service';
import { Page, ModalService, SelectFilterService, RowState } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lorp07.component.html'
})

export class Lorp07Component implements OnInit {

  statusPage: boolean;
  searchForm: FormGroup;
  fromBranchList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  reportParam = {} as ReportParam
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp07Service,
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
      ThisDate: null,
      FromBranchCode: null,
      ToBranchCode: null,
      FromLoanType: null,
      ToLoanType: null,
      FromApprovedContractDate: null,
      ToApprovedContractDate: null,
      FromCustomerCode: null,
      ToCustomerCode: null,
    });
    this.searchForm.controls.ToBranchCode.valueChanges.subscribe(res => {
      this.searchForm.controls.FromLoanType.setValue(null, { emitEvent: false });
      this.searchForm.controls.ToLoanType.setValue(null, { emitEvent: false });
    });
  }

  ngOnInit() {

    const saveData = this.saveData.retrive('LORP07');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.loanextension.Branch;
      this.toBranchList = data.loanextension.Branch;
      this.loanTypeList = data.loanextension.LoanType;
      this.fromLoanTypeList = data.loanextension.LoanType;
      this.toLoanTypeList = data.loanextension.LoanType;
      this.fromCustomerCodeList = data.loanextension.CustomerCode;
      this.toCustomerCodeList = data.loanextension.CustomerCode;
      this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterLoanType(true);
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



  filterFromCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.fromCustomerCodeList);
    this.fromCustomerCodeList = [...this.fromCustomerCodeList];
  }

  filterToCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.toCustomerCodeList);
    this.toCustomerCodeList = [...this.toCustomerCodeList];
  }

  filterLoanType(filter?: boolean){
    if (filter) {
        this.fromLoanTypeList = this.selectFilter.FilterActive(this.fromLoanTypeList);
        this.toLoanTypeList = this.selectFilter.FilterActive(this.toLoanTypeList);      
    }

    this.selectFilter.SortByLang(this.fromLoanTypeList);
    this.fromLoanTypeList = [...this.fromLoanTypeList];

    this.selectFilter.SortByLang(this.toLoanTypeList);
    this.toLoanTypeList = [...this.toLoanTypeList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP07');
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
    const customerCode = this.getLocaleCompare(this.searchForm.controls.FromCustomerCode.value, this.searchForm.controls.ToCustomerCode.value);
    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP03.FromBranch', 'Label.LORP03.ToBranch']);
    if (loanType > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP03.FromLoanType', 'Label.LORP03.ToLoanType']);
    if (customerCode > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP03.FromCustomerCode', 'Label.LORP03.ToCustomerCode']);
    if (branch == 1 || loanType == 1 || customerCode == 1 > 0) return;

    this.reportParam.ThisDate = this.searchForm.controls.ThisDate.value; 
    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromLoanType = this.searchForm.controls.FromLoanType.value;
    this.reportParam.ToLoanType = this.searchForm.controls.ToLoanType.value;
    this.reportParam.FromApprovedContractDate = this.searchForm.controls.FromApprovedContractDate.value;
    this.reportParam.ToApprovedContractDate = this.searchForm.controls.ToApprovedContractDate.value;
    this.reportParam.FromCustomerCode = this.searchForm.controls.FromCustomerCode.value;
    this.reportParam.ToCustomerCode = this.searchForm.controls.ToCustomerCode.value;
    this.reportParam.ReportName = 'LORP03';
    this.reportParam.ExportType = 'pdf';
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromLoanType.value, this.loanTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToLoanType.value, this.loanTypeList);
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

  get contractStatus(): FormArray {
    return this.searchForm.get('ContractStatus') as FormArray;
  };


  getText(value, list) {
    if (value) {
      const textData = list.find(data => {
        return data.Value == value;
      });
      return this.lang.CURRENT == "Tha" ? textData.TextTha : textData.TextEng;
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
