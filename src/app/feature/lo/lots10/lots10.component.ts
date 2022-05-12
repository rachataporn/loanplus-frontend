import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots10Service, Refinance, Contract } from '@app/feature/lo/lots10/lots10.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import * as moment from 'moment'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { switchMap } from 'rxjs/operators';
@Component({
  templateUrl: './lots10.component.html'
})

export class Lots10Component implements OnInit {

  page = new Page();
  
  statusPage: boolean;
  searchForm: FormGroup;
  contractForm: FormGroup;
  RefinanceData: Contract = {} as Contract;
  refinanceTypeList = [{ TextTha: 'ไม่ระบุวันที่ต่อสัญญา', TextEng: 'ไม่ระบุวันที่ต่อสัญญา', Value: 'N' },
  { TextTha: 'ระบุวันที่ต่อสัญญา', TextEng: 'ระบุวันที่ต่อสัญญา', Value: 'Y' },
  ];
  branchList = [];
  loanTypeList = [];
  dueMonthList = [];
  borrowerCodeList = [];
  contractNoList = [];
  dueYearList = [];
  refinanceShow: boolean = false;
  selected = [];
  submitted: boolean = false;
  focusToggle: boolean = false;
  saving: boolean = false;
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private rs: Lots10Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      BranchSearch: null,
      RefinanceRadio: 'N',
      NewContractDate: null,
      NumberOfNewPeriods: [null, Validators.required],
      PaymenByInstallments: null,
      LoanTypeSearch: null,
      DueMonthSearch: null,
      DueYearSearch: null,
      FromBorrowerCodeSearch: null,
      ToBorrowerCodeSearch: null,
      ContractNoSearch: [null, Validators.required],
    });

    this.searchForm.controls.NewContractDate.disable();
    this.searchForm.controls.NumberOfNewPeriods.disable();
    this.searchForm.controls.PaymenByInstallments.disable();

    this.searchForm.controls.ContractNoSearch.valueChanges.subscribe(contractNo => {
      if (contractNo == null) {
        this.searchForm.controls.NewContractDate.setValue(null);
        this.searchForm.controls.NewContractDate.disable();
        this.searchForm.controls.NumberOfNewPeriods.setValue(null);
        this.searchForm.controls.NumberOfNewPeriods.disable();
        this.searchForm.controls.PaymenByInstallments.setValue(null);
        this.searchForm.controls.PaymenByInstallments.disable();
        this.contractForm.controls.RefinanceForm = this.fb.array([]);
      } else {
        this.search();
        this.rs.getContractNoDetail(contractNo).subscribe(res => {
          this.searchForm.patchValue(res);
          this.searchForm.controls.NewContractDate.enable();
          this.searchForm.controls.NumberOfNewPeriods.enable();
        });

      }

    });

    this.searchForm.controls.RefinanceRadio.valueChanges.subscribe(
      val => {
        if (val == 'N') {
          this.refinanceShow = false;
          this.search();
        } else {
          this.refinanceShow = true;
          this.contractForm.controls.RefinanceForm = this.fb.array([]);
          this.search();
          this.submitted = false;
          this.searchForm.markAsPristine();

        }
      });

    this.searchForm.controls.NumberOfNewPeriods.valueChanges.subscribe(period => {
      if (period) {
        // หา array [0] ไปเสิร์จไม่ได้
        this.rs.calculatePeriodAmount(Object.assign({
          fixRate: this.RefinanceData.Refinances[0].AppLoanInterestRate,
          AppLoanPrincipleAmount: this.RefinanceData.Refinances[0].SumLoanBalance,
          AppLoanTotalPeriod: this.searchForm.controls.NumberOfNewPeriods.value
        })).subscribe(res => {
          this.searchForm.controls.PaymenByInstallments.setValue(res);
        });
      }
    });

    this.contractForm = this.fb.group({
      RefinanceForm: this.fb.array([])
    });
  }

  createDetailForm(item: Refinance): FormGroup {
    const fg = this.fb.group({
      guid: Math.random().toString(), // important for tracking change
      ContractHeadId: null,
      Period: null,
      ReceiveNo: null,
      ContractNo: null,
      EndPaymentDate: null,
      CustomerNameTha: null,
      CustomerNameEng: null,
      AppLoanPrincipleAmount: null, //
      BalancePrincipleAmount: null,
      BalanceInterestAmount: null,
      SumLoanBalance: [null],
      OldSumLoanBalance: [null],
      AppLoanInterestRate: null,
      NewInterestAmount: null, //
      NewLoanBalance: null,
      NewContractNo: null,
      ReqTotalMonth: null,
      AppLoanTotalPeriod: null,
      ReqGapPeriod: null,
      RowVersion: null,
    });

    fg.patchValue(item, { emitEvent: false });

    fg.controls.SumLoanBalance.setValidators([Validators.min(fg.controls.OldSumLoanBalance.value)])

    fg.controls.BalanceInterestAmount.disable();
    fg.controls.NewInterestAmount.disable();
    fg.controls.NewLoanBalance.disable();
    fg.controls.NewContractNo.disable();
    fg.controls.AppLoanInterestRate.disable();

    this.rs.calculateInterest(Object.assign({
      fixRate: fg.controls.AppLoanInterestRate.value,
      AppLoanPrincipleAmount: fg.controls.SumLoanBalance.value,
      AppLoanTotalPeriod: fg.controls.AppLoanTotalPeriod.value,
      ReqGapPeriod: fg.controls.ReqGapPeriod.value,
    })).subscribe(res => {
      fg.controls.NewInterestAmount.setValue(res.InterestAmount);
      fg.controls.NewLoanBalance.setValue(res.InterestAmount + fg.controls.SumLoanBalance.value);
    });

    fg.controls.SumLoanBalance.valueChanges.subscribe(res => {
      if (fg.controls.SumLoanBalance.value >= 10000) {

        Object.assign(this.RefinanceData, fg.getRawValue());
        this.rs.calculatePeriodAmount(Object.assign({
          fixRate: fg.controls.AppLoanInterestRate.value,
          AppLoanPrincipleAmount: fg.controls.SumLoanBalance.value,
          AppLoanTotalPeriod: this.searchForm.controls.RefinanceRadio.value == 'N' ? fg.controls.AppLoanTotalPeriod.value : this.searchForm.controls.NumberOfNewPeriods.value
        })).subscribe(res => {
          this.searchForm.controls.PaymenByInstallments.setValue(res);
        });

        this.rs.calculateInterest(Object.assign({
          fixRate: fg.controls.AppLoanInterestRate.value,
          AppLoanPrincipleAmount: fg.controls.SumLoanBalance.value,
          AppLoanTotalPeriod: fg.controls.AppLoanTotalPeriod.value,
          ReqGapPeriod: fg.controls.ReqGapPeriod.value,
        })).subscribe(res => {
          fg.controls.NewInterestAmount.setValue(res.InterestAmount);
          fg.controls.NewLoanBalance.setValue(res.InterestAmount + fg.controls.SumLoanBalance.value);
        });
      }
    });

    this.searchForm.controls.NumberOfNewPeriods.valueChanges.subscribe(res => {
      this.rs.calculateInterest(Object.assign({
        fixRate: fg.controls.AppLoanInterestRate.value,
        AppLoanPrincipleAmount: fg.controls.SumLoanBalance.value,
        AppLoanTotalPeriod: res,
        ReqGapPeriod: fg.controls.ReqGapPeriod.value,
      })).subscribe(res => {
        fg.controls.NewInterestAmount.setValue(res.InterestAmount);
        fg.controls.NewLoanBalance.setValue(res.InterestAmount + fg.controls.SumLoanBalance.value);
      });
    })

    return fg;
  }

  get getRefinance(): FormArray {
    return this.contractForm.get('RefinanceForm') as FormArray;
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    const saveData = this.saveData.retrive('LOTS10');
    if (saveData){
      if (saveData.RefinanceRadio == 'N') {
        this.refinanceShow = false;
      } else {
        this.refinanceShow = true;
      }
      this.searchForm.controls.NewContractDate.enable();
      this.searchForm.controls.NumberOfNewPeriods.enable();
      this.searchForm.patchValue(saveData, {emitEvent: false});
    } 

    this.route.data.subscribe((data) => {
      this.branchList = data.refinance.Branch;
      this.loanTypeList = data.refinance.LoanType;
      this.contractNoList = data.refinance.ContractNo;
      this.borrowerCodeList = data.refinance.BorrowCode;
      this.dueMonthList = data.refinance.Month;
      this.dueYearList = data.refinance.Year;
    });

    this.search();
  }

  search(reset?: boolean) {
    if (this.refinanceShow && !this.searchForm.controls.ContractNoSearch.value) {
      this.focusToggle = !this.focusToggle;
      this.submitted = true;
      return;
    }
    this.selected = [];
    this.rs.getRefinance(this.searchForm.getRawValue())
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.RefinanceData = res;
          this.rebuildForm();
        }, (error) => {
          console.log(error);
        });
  }

  onRefinance() {

    if (this.searchForm.controls.RefinanceRadio.value == 'Y' && this.searchForm.invalid) {
      return;
    }
    if (this.selected.length == 0) {
      this.as.warning('', 'Message.STD00012', ['Label.LOTS10.Contract']);
      return;
    }
    if (this.contractForm.invalid) {
      return;
    }

    this.modal.confirm('Label.LOTS10.ConfirmContract').subscribe(res => {
      if (res) {
        this.submitted = true;
        this.saving = true;
        this.prepareSave(this.selected)
        this.rs.updateRefinance(this.RefinanceData, this.searchForm.controls.RefinanceRadio.value).pipe(
          finalize(() => {
            this.saving = false;
            this.submitted = false;
            if (this.searchForm.controls.RefinanceRadio.value == 'Y') {
              this.rs.getMaster().subscribe(data => {
                this.searchForm.controls.ContractNoSearch.setValue(null);
                this.contractNoList = data.refinance.ContractNo;
                this.selectFilter.SortByLang(this.contractNoList);
                this.contractNoList = [...this.contractNoList];
              });
            }
            this.search();
          }))
          .subscribe(res => {
            this.as.success('', 'Message.STD00006');
          })
      }else {
        return;
      }
    });
  }

  prepareSave(values) {
    this.RefinanceData.Refinances = values;
    if (this.searchForm.controls.RefinanceRadio.value == 'Y') {
      this.RefinanceData.NewContractDate = this.searchForm.controls.NewContractDate.value;
      this.RefinanceData.NumberOfNewPeriods = this.searchForm.controls.NumberOfNewPeriods.value;
      this.RefinanceData.PaymentByInstallments = this.searchForm.controls.PaymenByInstallments.value;
    }

  }

  bindDropDownList() {
    this.selectFilter.SortByLang(this.branchList);
    this.branchList = [...this.branchList];

    this.selectFilter.SortByLang(this.loanTypeList);
    this.loanTypeList = [...this.loanTypeList];

    this.selectFilter.SortByLang(this.dueMonthList);
    this.dueMonthList = [...this.dueMonthList];

    this.selectFilter.SortByLang(this.dueYearList);
    this.dueYearList = [...this.dueYearList];

    this.selectFilter.SortByLang(this.borrowerCodeList);
    this.borrowerCodeList = [...this.borrowerCodeList];

    this.selectFilter.SortByLang(this.contractNoList);
    this.contractNoList = [...this.contractNoList];
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.getRawValue(), 'LOTS10');
  }

  onTableEvent(event) {
    this.search();
  }

  identity(row) {
    return row.guid;
  }

  rebuildForm() {
    this.bindDropDownList();
    this.contractForm.setControl('RefinanceForm',
      this.fb.array(this.RefinanceData.Refinances.map((detail) => this.createDetailForm(detail))));
  }
  
}
