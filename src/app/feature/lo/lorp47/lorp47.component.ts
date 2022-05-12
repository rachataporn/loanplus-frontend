import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp47Service, ReportParam } from '@app/feature/lo/lorp47/lorp47.service';
import { Page, ModalService, SelectFilterService, RowState } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
@Component({
  templateUrl: './lorp47.component.html'
})

export class Lorp47Component implements OnInit {
  reportTypeList = [];
  statusPage: boolean;
  searchForm: FormGroup;
  fromBranchList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  fromContractNoList = [];
  contractStatusList = [];
  toContractNoList = [];
  contractNoList = [];
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  reportParam = {} as ReportParam
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  a: string = '';
  yearList = [];
  reportFormatList = []

  mounthData = [];
  mounthList = [
    { Value: '1', TextTha: 'มกราคม', TextEng: 'January', Active: true },
    { Value: '2', TextTha: 'กุมภาพันธ์', TextEng: 'February', Active: true },
    { Value: '3', TextTha: 'มีนาคม', TextEng: 'March', Active: true },
    { Value: '4', TextTha: 'เมษายน', TextEng: 'April', Active: true },
    { Value: '5', TextTha: 'พฤษภาคม', TextEng: 'May', Active: true },
    { Value: '6', TextTha: 'มิถุนายน', TextEng: 'June', Active: true },
    { Value: '7', TextTha: 'กรกฎาคม', TextEng: 'July', Active: true },
    { Value: '8', TextTha: 'สิงหาคม', TextEng: 'August', Active: true },
    { Value: '9', TextTha: 'กันยายน', TextEng: 'September', Active: true },
    { Value: '10', TextTha: 'ตุลาคม', TextEng: 'October', Active: true },
    { Value: '11', TextTha: 'พฤษจิกายน', TextEng: 'November', Active: true },
    { Value: '12', TextTha: 'ธันวาคม', TextEng: 'December', Active: true }];

  customerGradeList = [
    { Value: 'N', TextTha: 'เกรด ลูกค้าใหม่', TextEng: 'Grade New', Active: true },
    { Value: 'A', TextTha: 'เกรด A', TextEng: 'Grade A', Active: true },
    { Value: 'B', TextTha: 'เกรด B', TextEng: 'Grade B', Active: true },
    { Value: 'C', TextTha: 'เกรด C', TextEng: 'Grade C', Active: true },
    { Value: 'D', TextTha: 'เกรด D', TextEng: 'Grade D', Active: true },
    { Value: 'NPL', TextTha: 'เกรด NPL', TextEng: 'Grade NPL', Active: true }];

  now = new Date();
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp47Service,
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
      BranchCode: [null, Validators.required],
      MonthCode: [null, Validators.required],
      Year: [null, Validators.required],
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP47');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = this.toBranchList = data.lorp47.Branch;
      this.bindDropDownList();
    });


    this.buildYearList();
  }

  get getParameterForSingleLookup() {
    return { ListItemGroupCode: "income_loan" }
  }

  buildYearList() {
    var date = new Date();
    var indexYear = date.getFullYear() - 1740;
    for (var i = -1; i <= indexYear; i++) {
      var Value
      var TextEng = Value = date.getFullYear() - i;
      var TextTha = (date.getFullYear() - i) + 543;
      this.yearList.push({ Value, TextTha, TextEng });
    }
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
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

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP47');
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.reportParam.ReportName = 'LORP47';
    this.reportParam.BranchCode = this.searchForm.controls.BranchCode.value;
    this.reportParam.MonthCode = this.searchForm.controls.MonthCode.value;
    this.reportParam.Year = this.searchForm.controls.Year.value;
    
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => { this.submitted = false; })
    ).subscribe((res) => {
      if (res) {
          this.OpenWindow(res, this.reportParam.ReportName);
          this.srcResult = null;
      }
    });
  }

  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + "xlsx" + ";base64," + data;
    doc.download = name + "_" + "Report-" + ((Number(moment(this.now).format('YYYY')) - 543) + "-") + moment(this.now).format('MM-DD') + "." + "xlsx";
    doc.click();
  }

}
