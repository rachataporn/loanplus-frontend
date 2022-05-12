import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots11Service } from '@app/feature/lo/lots11/lots11.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Contract } from './lots11.service';
 

@Component({
  templateUrl: './lots11.component.html'
})

export class Lots11Component implements OnInit {

  closeContracts:Contract[] = [];
  master = {} as any;
  branches = [];
  loanTypes = [];
  customers = [];
  contracts = [];
  options = [];

  searchForm: FormGroup;
  searched = false;
  focusToggle = false;
  closeContractForm : FormGroup;
  selected = [];
  saving = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ls: Lots11Service,
    public lang: LangService,
    private as: AlertService,
    private ss:SelectFilterService
  ) {
    this.createSearchForm();
    this.createCloseContractForm();
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
       Branch:[null,Validators.required],
       CloseDate:[new Date(),Validators.required],
       LoanType:null,
       CustomerCodeFrom:null,
       CustomerCodeTo:null,
       ContractNoFrom:null,
       ContractNoTo:null,
       BalanceAmountFrom:null,
       BalanceAmountTo:null,
       CloseOption:null,
       Month:null,
       ApproveDate:null,
       Period:null
    });
    this.searchForm.controls.Branch.valueChanges.subscribe(value=>{
       this.searchForm.controls.ContractNoFrom.setValue(null)
       this.searchForm.controls.ContractNoTo.setValue(null)
       this.contracts = [];
       this.ls.getDependency({Branch : value}).subscribe(
         dependency => { 
          this.contracts = dependency.Contracts;
        }
       )
    })
    this.searchForm.valueChanges.subscribe(()=>{
       this.selected = [];
       this.closeContracts = [];
       this.assignContracts();
    })
  }

  createCloseContractForm(){
    this.closeContractForm = this.fb.group({
       contractForm:this.fb.array([])
    })
  }
  createContractForm(item:Contract){
    const fg = this.fb.group({
      guid:Math.random().toString(),
      ContractHeadId:null,
      CustomerCode:null,
      ContractNo:null,
      EndPaymentDate:null,
      CustomerNameTha:null,
      CustomerNameEng:null,
      AppLoanPrincipleAmount:null,
      AppLoanInterestRate:null,
      BalancePrincipleAmount:null,
      Period:null,
      ApproveLossDescription:null,
      RowVersion:null
    })
    fg.patchValue(item,{ emitEvent : false});
    return fg;
  }
  get getContracts(){
    return this.closeContractForm.get("contractForm") as FormArray;
  }
  get getOption() {
    return this.searchForm.controls.CloseOption.value;
  }
  private bindDropdown(){
    this.ss.SortByLang(this.branches,'CompanyName');
    this.ss.SortByLang(this.loanTypes,'LoanTypeName');
    this.ss.SortByLang(this.customers,'CustomerName');
    this.branches = [...this.branches];
    this.loanTypes = [...this.loanTypes];
    this.customers = [...this.customers];
  }
  private assignContracts(){
    this.closeContractForm.setControl('contractForm',
    this.fb.array(this.closeContracts.map((detail) => this.createContractForm(detail))));
  }
  ngOnInit() {
    this.lang.onChange().subscribe(()=>{
        this.bindDropdown();
    })
    this.route.data.subscribe((data) => {
      this.master = data.close;
      this.branches = this.master.Branches;
      this.loanTypes = this.master.LoanTypes;
      this.customers = this.master.Customers;
      this.contracts = this.master.Contracts;
      this.options = this.master.Options;
      this.bindDropdown();
    })
    this.assignContracts();
  }

  search(){
     this.searched = true;
     if(this.searchForm.invalid){
      this.focusToggle = !this.focusToggle;
      return;
     }
     this.saving = true;
     this.ls.getContracts(this.searchForm.value).pipe(
       finalize(()=> this.saving = false)
     )
     .subscribe(contracts=>{
       this.closeContracts = contracts;
       this.assignContracts();
     })
  }
  identity(row){
    return row.guid;
  }

  process(){
    if(this.selected.length === 0){
      this.as.warning('', 'Message.STD00012', ['Label.LOTS11.Detail']);
      return;
    }

    const contractProcess = this.selected.map(select=>{
      return this.getContracts.value.find(contract=>contract.guid == select.guid);
    })
 
    this.ls.processContract(contractProcess,this.searchForm.controls.CloseDate.value)
    .subscribe(()=>{
      this.selected = [];
      this.search();
      this.as.success('','Message.STD00020');
    })
  }
}

