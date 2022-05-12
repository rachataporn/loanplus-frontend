import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp12Service,ReportParam} from '@app/feature/lo/lorp12/lorp12.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lorp12.component.html',
})

export class Lorp12Component implements OnInit {
  
  statusPage: boolean;
  searchForm: FormGroup;

  fromBranches= []; 
  toBranch= [];  
  fromContractType= []; 
  toContractType= [];  
  fromTheBorrowerCode= [];  
  toTheBorrowerCode= [];
  fromTheContractClosingDate= []; 
  untilTheContractClosingDate= [];  

  reportParam = {} as ReportParam
  srcResult = null;
  printing: boolean;
  page = new Page();
  data = '';
  loanclosingForm: FormGroup;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lorp12Service: Lorp12Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private filter:SelectFilterService
    
  ) {this.createForm();}
  
  createForm() {
    const now = new Date();
    this.searchForm = this.fb.group({
      StartDate: now,
      EndDate: now,
      FromBranches:null,
      ToBranch:null,
      FromContractType:null,
      ToContractType:null,
      FromTheBorrowerCode:null,
      ToTheBorrowerCode:null,
      FromTheContractClosingDate:null,
      UntilTheContractClosingDate:null,
    });
  }
  ngOnInit() {
    const saveData = this.saveData.retrive('LORP12');
    if (saveData) this.searchForm.patchValue(saveData);
      this.lang.onChange().subscribe(() => {
        this.bindDropDownList();
      });
    
    this.route.data.subscribe((data) => {
      this.fromBranches = data.lorp12.FromBranches;  
      this.toBranch = data.lorp12.ToBranch; 
      this.fromContractType = data.lorp12.FromContractType; 
      this.toContractType = data.lorp12.ToContractType;
      this.fromTheBorrowerCode = data.lorp12.FromTheBorrowerCode; 
      this.toTheBorrowerCode = data.lorp12.ToTheBorrowerCode;
      this.bindDropDownList();       
    });
  }
  rebuildForm(){
    this.bindDropDownList();
  } 
   bindDropDownList() {
    this.filterfromBranches(true);
    this.filtertoBranch(true);
    this.filterfromContractType(true);
    this.filtertoContractType(true);
    this.filterfromTheBorrowerCode(true);
    this.filtertoTheBorrowerCode(true);
  }
  filterfromBranches(filter?: boolean) {
    this.filter.SortByLang(this.fromBranches);
    this.fromBranches = [...this.fromBranches];
  }
  filtertoBranch(filter?: boolean) {
    this.filter.SortByLang(this.toBranch);
    this.toBranch = [...this.toBranch];
  }
  filterfromContractType(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.fromContractType = this.filter.FilterActiveByValue(this.fromContractType, detail.FromContractType);
      }
      else {
        this.fromContractType = this.filter.FilterActive(this.fromContractType);
      }
    }
    this.filter.SortByLang(this.fromContractType);
    this.fromContractType = [...this.fromContractType];
  }
  filtertoContractType(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.toContractType = this.filter.FilterActiveByValue(this.toContractType, detail.ToContractType);
      }
      else {
        this.toContractType = this.filter.FilterActive(this.toContractType);
      }
    }
    this.filter.SortByLang(this.toContractType);
    this.toContractType = [...this.toContractType];
  }
  filterfromTheBorrowerCode(filter?: boolean) {
    this.filter.SortByLang(this.fromTheBorrowerCode);
    this.fromTheBorrowerCode = [...this.fromTheBorrowerCode];
  }

  filtertoTheBorrowerCode(filter?: boolean) {
    this.filter.SortByLang(this.toTheBorrowerCode);
    this.toTheBorrowerCode = [...this.toTheBorrowerCode];
  }
 
  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP12');
  }
  print(){
    const branch = this.getLocaleCompare(this.searchForm.controls.FromBranches.value, this.searchForm.controls.ToBranch.value);
    const loanType = this.getLocaleCompare(this.searchForm.controls.FromContractType.value, this.searchForm.controls.ToContractType.value);
    const customerCode = this.getLocaleCompare(this.searchForm.controls.FromTheBorrowerCode.value, this.searchForm.controls.ToTheBorrowerCode.value);
    if (branch > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP12.FromBranches', 'Label.LORP12.ToBranch']);
    if (loanType > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP12.FromContractType', 'Label.LORP12.ToContractType']);
    if( customerCode > 0) this.as.warning('', 'Message.LO00006', ['Label.LORP12.FromTheBorrowerCode', 'Label.LORP12.ToTheBorrowerCode']);
    //if (branch +  loanType + customerCode  > 0) return;
    if (branch == 1 ||  loanType == 1 || customerCode == 1 > 0) return;
    
    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.ReportName = 'LORP12';
    this.reportParam.ExportType = 'pdf';
    this.reportParam.FromLoanTypeText = this.getText(this.searchForm.controls.FromContractType.value, this.fromContractType);
    this.reportParam.ToLoanTypeText = this.getText(this.searchForm.controls.ToContractType.value, this.toContractType);
    this.reportParam.FromBranchText = this.getText(this.searchForm.controls.FromBranches.value, this.fromBranches);
    this.reportParam.ToBranchText = this.getText(this.searchForm.controls.ToBranch.value, this.toBranch);

    this.lorp12Service.generateReport(this.reportParam).pipe(
      finalize(() => {
      })
    )
    .subscribe((res) => {
      if (res) {
        this.srcResult = res;
      }
    });
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



