import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import {Lorp20Service, ReportParam} from '@app/feature/lo/lorp20/lorp20.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { from } from 'rxjs';

@Component({
  templateUrl: './lorp20.component.html'
})

export class Lorp20Component implements OnInit {
  NPL = [{value : '1', active : true}
          , {value : '2', active : true}
          , {value : '3', active : true}
          , {value : '4', active : true}
          , {value : '5', active : true}
          , {value : '6', active : true}];
  badDebtAppraisalReportForm: FormGroup; 
  reportParam = {} as ReportParam
  searchForm: FormGroup;
  // master: {
  //   FromBranchList: any[], ToBranchList: any[], 
  //   FromContractTypeList: any[],ToContractTypeList:  any[], 
  //   ContractDateList: any[] };
  fromBranchList = [];
  toBranchList = [];
  fromContractTypeList = [];
  toContractTypeList = [];
  //contractDateList = [];
  srcResult = null;
  printing: boolean;
  focusToggle = false;
  submitted = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    private Lorp20Service: Lorp20Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private filter:SelectFilterService 
  ) {
    this.createForm();
  }
  createForm() {
    const now = new Date();
    this.searchForm = this.fb.group({
      StartDate: now,
      EndDate: now,
      FromBranch: null,
      ToBranch: null,
      FromContractType: null,
      ToContractType: null,
      ContractDate: [null, Validators.required],
      NPL: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });
    const saveData = this.saveData.retrive('LORP20');
    if (saveData) this.searchForm.patchValue(saveData);
    this.route.data.subscribe((data) => {
      
      this.fromBranchList = data.lorp20.FromBranch;  
      this.toBranchList = data.lorp20.ToBranch;
      this.fromContractTypeList = data.lorp20.FromContractType;
      this.toContractTypeList = data.lorp20.ToContractType;
      //this.contractDateList = data.lorp20.ContractDate;
      //this.toTheContractDateList = data.lorp06.master.ToTheContractDateList;
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
    this.saveData.save(this.searchForm.value, 'LORP20');
  }

  onTableEvent(event) {

  }
  print(){
    
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranch.value, this.searchForm.controls.ToBranch.value);
    const loanType = this.getLocaleCompare(this.searchForm.controls.FromContractType.value, this.searchForm.controls.ToContractType.value);
    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP20.Branch', 'Label.LORP05.ToBranch']);
    if (loanType > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP20.FromContractType', 'Label.LORP05.ToContractType']);
    if (branch == 1 ||  loanType == 1  > 0) return;
    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.ReportName = 'LORP20';
    this.reportParam.ExportType = 'pdf';
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranch.value, this.fromBranchList);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranch.value, this.toBranchList);
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromContractType.value, this.fromContractTypeList);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToContractType.value, this.toContractTypeList);
    this.Lorp20Service.generateReport(this.reportParam).pipe(   
      finalize(() => {
      })
    )
      .subscribe((res) => {
        if (res) {
          this.srcResult = res;
        }
      });
  }
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
