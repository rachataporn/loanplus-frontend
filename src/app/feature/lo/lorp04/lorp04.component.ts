import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp04Service, ReportParam } from '@app/feature/lo/lorp04/lorp04.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { moment } from 'ngx-bootstrap/chronos/test/chain';


@Component({
  templateUrl: './lorp04.component.html'
})

export class Lorp04Component implements OnInit {

  searchForm: FormGroup;
  fromBranchList = [];
  toBranchList = [];
  fromBorrowerCodeList = [];
  toBorrowerCodeList = [];
  fromGaruntorCodeList = [];
  toGaruntorCodeList = [];
  srcResult = null;
  reportParam = {} as ReportParam
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
    private ls: Lorp04Service,
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
      FromBorrowerCode: null,
      ToBorrowerCode: null,
      FromGaruntorCode: null,
      ToGaruntorCode: null,
      ExportType: 'pdf'
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP04');
    if (saveData) this.searchForm.patchValue(saveData);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.loanCustomersAndGuarantors.Branch;
      this.toBranchList = data.loanCustomersAndGuarantors.Branch;
      this.fromBorrowerCodeList = data.loanCustomersAndGuarantors.CustomerCode;
      this.toBorrowerCodeList = data.loanCustomersAndGuarantors.CustomerCode;
      this.fromGaruntorCodeList = data.loanCustomersAndGuarantors.GaruntorCode;
      this.toGaruntorCodeList = data.loanCustomersAndGuarantors.GaruntorCode;
      this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterFromBorrowerCodeList(true);
    this.filterToBorrowerCodeList(true);
    this.filterFromGaruntorCodeList(true);
    this.filterToGaruntorCodeList(true);
    
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

  filterFromBorrowerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.fromBorrowerCodeList);
    this.fromBorrowerCodeList = [...this.fromBorrowerCodeList];
  }

  filterToBorrowerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.toBorrowerCodeList);
    this.toBorrowerCodeList = [...this.toBorrowerCodeList];
  }

  filterFromGaruntorCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.fromGaruntorCodeList);
    this.fromGaruntorCodeList = [...this.fromGaruntorCodeList];
  }

  filterToGaruntorCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.toGaruntorCodeList);
    this.toGaruntorCodeList = [...this.toGaruntorCodeList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP04');
  }

  print() {
    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranchCode.value, this.searchForm.controls.ToBranchCode.value);
    const borrowerCode = this.getLocaleCompare(this.searchForm.controls.FromBorrowerCode.value, this.searchForm.controls.ToBorrowerCode.value);
    const garuntorCode = this.getLocaleCompare(this.searchForm.controls.FromGaruntorCode.value, this.searchForm.controls.ToGaruntorCode.value);
    if( branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP04.FromBranch', 'Label.LORP04.ToBranch']);
    if( borrowerCode > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP04.FromBorrowerCode', 'Label.LORP04.ToBorrowerCode']);
    if( garuntorCode > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP04.FromGaruntorCode', 'Label.LORP04.ToGaruntorCode']);
    if(branch == 1 || borrowerCode == 1 || garuntorCode == 1> 0) return;
    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.ReportName = 'LORP04';
    this.reportParam.ExportType = this.searchForm.controls.ExportType.value;
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranchCode.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranchCode.value, this.toBranchList);

    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
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

  getLocaleCompare(from, to){
    if(from == null || to == null){
      return 0;
    }else{
      return from.localeCompare(to);
    }
}

getText(value, list) {
  if (value) {
    const textData = list.find(data => {
      return data.Value == value;
    });
    return this.lang.CURRENT == "Tha" ? textData.TextTha : textData.TextEng;
  }
}

}
