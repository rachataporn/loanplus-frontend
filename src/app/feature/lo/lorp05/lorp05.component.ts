import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp05Service, ReportParam } from '@app/feature/lo/lorp05/lorp05.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
@Component({
  templateUrl: './lorp05.component.html'
})

export class Lorp05Component implements OnInit {
  reportParam = {} as ReportParam
  loanContractsPendingApprovalForm: FormGroup; 
  fromBranchList = [];
  toBranchList = [];
  fromContractTypeList = [];
  toContractTypeList = [];
  fromTheContractDateList = [];
  toTheContractDateList = [];
  printing: boolean;
  page = new Page();
  data = '';
  statusPage: boolean;
  searchForm: FormGroup;
  srcResult = null;
  now = new Date();
  exportType = [{ Value: 'pdf', TextTha: 'PDF', TextEng: 'PDF', active: true }
  , { Value: 'xlsx', TextTha: 'EXCEL', TextEng: 'EXCEL', active: true }]
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    private lorp05Service: Lorp05Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private filter:SelectFilterService
  ) {  this.createForm();}
  createForm() {
    const now = new Date();
    this.searchForm = this.fb.group({
      StartDate: now,
      EndDate: now,
      FromBranch: null,
      ToBranch: null,
      FromContractType: null,
      ToContractType: null,
      FromTheContractDate: null,
      ToTheContractDate: null,
      ExportType: 'pdf'
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP05');
    if (saveData) this.searchForm.patchValue(saveData);
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });
    this.route.data.subscribe((data) => {
      //this.company = data.sumt01.detail;
      this.fromBranchList = data.lorp05.FromBranch;  
      this.toBranchList = data.lorp05.ToBranch;
      this.fromContractTypeList = data.lorp05.FromContractType;
      this.toContractTypeList = data.lorp05.ToContractType;
      // this.fromTheContractDateList = data.lorp06.FromTheContractDate;
      // this.toTheContractDateList = data.lorp06.ToTheContractDate;
     this.rebuildForm();        
    });
  }
  rebuildForm(){
    this.bindDropDownList();
  }              
  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    this.filterFromLoanType(true);
    this.filterToLoanType(true);
   }
   filterFromBranchList(filter?: boolean) {
    this.filter.SortByLang(this.fromBranchList);
    this.fromBranchList = [... this.fromBranchList];
  }

  filterToBranchList(filter?: boolean) {
    this.filter.SortByLang(this.toBranchList);
    this.toBranchList = [... this.toBranchList];
  }

  filterFromLoanType(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.fromContractTypeList = this.filter.FilterActiveByValue(this.fromContractTypeList, detail.FromLoanType);
      }
      else {
        this.fromContractTypeList = this.filter.FilterActive(this.fromContractTypeList);
      }
    }
    this.filter.SortByLang(this.fromContractTypeList);
    this.fromContractTypeList = [... this.fromContractTypeList];
  }

  filterToLoanType(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.toContractTypeList = this.filter.FilterActiveByValue(this.toContractTypeList, detail.ToLoanType);
      }
      else {
        this.toContractTypeList = this.filter.FilterActive(this.toContractTypeList);
      }
    }
    this.filter.SortByLang(this.toContractTypeList);
    this.toContractTypeList = [... this.toContractTypeList];
  }

   ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP05');
  }
  print(){
    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranch.value, this.searchForm.controls.ToBranch.value);
    const loanType = this.getLocaleCompare(this.searchForm.controls.FromContractType.value, this.searchForm.controls.ToContractType.value);
    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP05.Branch', 'Label.LORP05.ToBranch']);
    if (loanType > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP05.FromContractType', 'Label.LORP05.ToContractType']);
    if (branch == 1 ||  loanType == 1  > 0) return;

    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.ReportName = 'LORP05';
    this.reportParam.ExportType = this.searchForm.controls.ExportType.value;
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranch.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranch.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromContractType.value, this.fromContractTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToContractType.value, this.toContractTypeList);
   

    this.lorp05Service.generateReport(this.reportParam).pipe(
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
    doc.download = name + "_" + "Assessment-" + ((Number(moment(this.now).format('YYYY')) - 543) + "-") + moment(this.now).format('MM-DD') + "." + this.reportParam.ExportType;
    doc.click();
  }

  onTableEvent(event) { }
  getText(value, list){
    if(value){
      const textData = list.find(data => {
        return data.Value ==  value;
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
