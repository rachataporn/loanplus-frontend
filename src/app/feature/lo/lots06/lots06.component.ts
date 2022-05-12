import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots06Service, LoanAgreement, Contract, ReportParam } from '@app/feature/lo/lots06/lots06.service';
import { Page, ModalService, SelectFilterService, Size, ModalRef } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { switchMap } from 'rxjs/operators';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { Category } from '@app/shared/service/configuration.service';

@Component({
  templateUrl: './lots06.component.html'
})

export class Lots06Component implements OnInit {
  page = new Page();
  searchForm: FormGroup;
  branchList: any[];
  // contractNo: any[];
  // contractNoList: any[];
  loanAgreementData: any[];
  submitted: boolean;
  focusToggle: boolean;
  saving: boolean;
  isSuperUser: boolean;
  categoryCustomer = Category.Example;
  approvePaymentOnlineStatusList = [];
  printing: boolean;
  now = new Date();
  reportParam = {} as ReportParam;
  selected = [];
  contractList: Contract = {} as Contract;
  loanAgreement = {} as LoanAgreement;

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lots06: Lots06Service,
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
      inputSearch: null,
      ContractNo: null,
      ApprovePaymentOnlineStatus: '1',
      ApprovePaymentOnlineDateFrom: [new Date(), Validators.required],
      ApprovePaymentOnlineDateTo: [new Date(), Validators.required],
    });

    this.searchForm.valueChanges.subscribe(() => {
      this.page.index = 0;
    });

    // this.searchForm.controls.inputSearch.valueChanges.subscribe(res => {
    //   this.searchForm.controls.ContractNo.setValue(null, { emitEvent: false });
    //   this.filterContractNo(this.searchForm.controls.inputSearch.value, true);
    // });

    this.searchForm.controls.ApprovePaymentOnlineStatus.valueChanges.subscribe(val => {
      if (val == '2') {
        this.searchForm.controls.ApprovePaymentOnlineDateFrom.enable();
        this.searchForm.controls.ApprovePaymentOnlineDateTo.enable();
        this.searchForm.controls.ApprovePaymentOnlineDateFrom.setValue(new Date());
        this.searchForm.controls.ApprovePaymentOnlineDateTo.setValue(new Date());
        this.search();
      } else {
        this.searchForm.controls.ApprovePaymentOnlineDateFrom.setValue(null);
        this.searchForm.controls.ApprovePaymentOnlineDateTo.setValue(null);
        this.searchForm.controls.ApprovePaymentOnlineDateFrom.disable();
        this.searchForm.controls.ApprovePaymentOnlineDateTo.disable();
        this.search();
      }
    });

    // this.searchForm.controls.ApprovePaymentOnlineDateFrom.valueChanges.subscribe(val => {
    //   if (val) {
    //     this.search();
    //   }
    // });

    // this.searchForm.controls.ApprovePaymentOnlineDateTo.valueChanges.subscribe(val => {
    //   if (val) {
    //     this.search();
    //   }
    // });
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.branchList = data.lots06.Branch;
      // this.contractNo = data.lots06.ContractNo;
      // this.contractNoList = data.lots06.ContractNo;
      this.isSuperUser = data.lots06.IsSuperUser;
      this.approvePaymentOnlineStatusList = data.lots06.ApprovePaymentOnlineStatusList
    });

    // const saveData = this.saveData.retrive('LOTS06');
    // if (saveData) this.searchForm.patchValue(saveData);

    // const routeContractNo = this.route.snapshot.paramMap.get('ContractNo');
    // if (routeContractNo) {
    //   this.searchForm.reset();
    //   this.saveData.save(this.searchForm.value, "LOTS06");
    //   this.searchForm.controls.ContractNo.setValue(routeContractNo);
    // }

    this.search();
  }

  search() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.lots06.getLoanAgreement(this.searchForm.value, this.page)
      .pipe(finalize(() => { this.submitted = false; }))
      .subscribe(
        (res: any) => {
          this.loanAgreementData = res.Rows;
          this.page.totalElements = res.Total;
          this.rebuildForm();
        }, (error) => {
          console.log(error);
        });
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LOTS06');
  }

  onTableEvent(event) {
    this.search();
  }

  rebuildForm() {
    this.bindDropDownList();
  }

  bindDropDownList() {
    // this.filterContractNo(this.searchForm.controls.inputSearch.value, false);

    this.selectFilter.SortByLang(this.branchList);
    this.branchList = [...this.branchList];
  }

  seeContractDetail(id) {
    this.router.navigate(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots06' }], { skipLocationChange: true });
  }

  // filterContractNo(companyCode, filter?: boolean) {
  //   if (companyCode) {
  //     this.contractNoList = this.contractNo.filter(filter => filter.CompanyCode == companyCode);
  //   } else {
  //     this.contractNoList = this.contractNo;
  //   }
  //   this.selectFilter.SortByLang(this.contractNoList);
  //   this.contractNoList = [...this.contractNoList];
  // }

  approveLoanTranfer(row) {
    this.submitted = true;

    const presentDate = moment(moment(new Date())).startOf('day');
    if (!moment(moment(row.ContractDate)).isSame(presentDate) && !this.isSuperUser) {
      this.as.warning('', 'Label.LOTS06.NotPresentDate', []);
      return;
    }
    this.lots06.updateLoanTranferAgreement(row).pipe(
      switchMap(() => this.lots06.getLoanAgreement(this.searchForm.value, this.page)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(res => {
        this.loanAgreementData = res.Rows;
        this.page.totalElements = res.Total;
        this.rebuildForm();
        this.as.success('', 'Message.STD00006');
      })
  }

  onPrint() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.printing = true;
    Object.assign(this.reportParam, this.searchForm.value)
    this.lots06.generateReport(this.reportParam)
      .pipe(finalize(() => {
        this.submitted = false;
        this.printing = false;
      }))
      .subscribe(
        (res: any) => {
          this.OpenWindow(res);
        });
  }

  async OpenWindow(data) {
    let doc = document.createElement("a");
    doc.href = "data:application/xlsx;base64," + data;
    doc.download = "Contract_Approve_Payment_Report-" + ((Number(moment(this.now).format('YYYY')) - 543) + "-") + moment(this.now).format('MM-DD') + ".xlsx";
    doc.click();
  }

  confirmApproveLoanTranfer() {
    if (this.selected.length <= 0) {
      this.as.warning('', 'ต้องมีรายการสัญญา มากกว่า 1 รายการ');
      return;
    }

    this.modal.confirm("ยืนยันการอนุมัติโอนเงิน ( " + this.selected.length + " รายการ )").subscribe(
      (res) => {
        if (res) {
          this.contractList.LoanAgreements = [];

          this.selected.forEach(x => {
            var loanAgreements = new LoanAgreement();
            loanAgreements.ContractHeadId = x.ContractHeadId;
            loanAgreements.CompanyCode = x.CompanyCode;
            loanAgreements.CustomerCode = x.CustomerCode;
            loanAgreements.CustomerNameTha = x.CustomerNameTha;
            loanAgreements.CustomerNameEng = x.CustomerNameEng;
            loanAgreements.ContractDate = x.ContractDate;
            loanAgreements.ContractNo = x.ContractNo;
            loanAgreements.AppLoanPrincipleAmount = x.AppLoanPrincipleAmount;
            loanAgreements.AppLoanInterestAmount = x.AppLoanInterestAmount;
            loanAgreements.Amount = x.Amount;
            loanAgreements.ApprovedDate = x.ApprovedDate;
            loanAgreements.TransferDate = x.TransferDate;
            loanAgreements.StartInterestDate = x.StartInterestDate;
            loanAgreements.StartPaymentDate = x.StartPaymentDate;
            loanAgreements.ReqGapPeriod = x.ReqGapPeriod;
            loanAgreements.ReqTotalMonth = x.ReqTotalMonth;
            loanAgreements.RowVersion = x.RowVersion;
            loanAgreements.AppLoanInterestRate = x.AppLoanInterestRate;
            loanAgreements.AppLoanTotalPeriod = x.AppLoanTotalPeriod;
            loanAgreements.Compose = x.Compose;

            this.loanAgreement = loanAgreements;

            this.contractList.LoanAgreements.push(this.loanAgreement);
          });

          this.lots06.updateMultipleLoanTranferAgreement(this.contractList.LoanAgreements).pipe(
            // switchMap(() => this.lots06.getLoanAgreement(this.searchForm.value, this.page)),
            finalize(() => {
              this.saving = false;
              this.submitted = false;
              this.selected = [];
            }))
            .subscribe(res => {
              this.searchForm.controls.ApprovePaymentOnlineStatus.setValue('2');
              // this.search();
              // this.loanAgreementData = res.Rows;
              // this.page.totalElements = res.Total;
              this.rebuildForm();
              this.as.success('', 'Message.STD00006');
            })
        }
      })
  }

  onClickRow(data, event) {
    let index = this.selected.findIndex(x => x.ContractHeadId == data.ContractHeadId && x.CustomerCode == data.CustomerCode);

    if (event.target.checked) {
      this.selected.push(data);
    } else {
      const rows = [...this.selected];
      rows.splice(index, 1);
      this.selected = [...rows];
    }
  }
}
