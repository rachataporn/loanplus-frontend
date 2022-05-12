import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, AuthService, LangService, SaveDataService } from '@app/core';
import { Lorp39Service, ReportParam, ContractStatus} from '@app/feature/lo/lorp39/lorp39.service';
import { ModalService, SelectFilterService } from '@app/shared';
import { finalize } from 'rxjs/internal/operators/finalize';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  templateUrl: './lorp39.component.html'
})

export class Lorp39Component implements OnInit, OnDestroy {
  statusPage: boolean;
  searchForm: FormGroup;
  exportType = [{ Value: 'pdf', TextTha: 'PDF', TextEng: 'PDF', active: true }
    , { Value: 'xlsx', TextTha: 'EXCEL', TextEng: 'EXCEL', active: true }]
  reportParam = {} as ReportParam;
  srcResult = null;
  printing: boolean;
  reportTypeList = [];
  company = [];
  Companies = [];
  docStatusList = [];
  contractStatusList = [];
  detailList = [];
  loanType = [];
  Branch = [];
  now = new Date(); 
  constructor(
    private fb: FormBuilder,
    private ls: Lorp39Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
    private auth: AuthService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      FromCompany: null,
      ToCompany: null,
      FromContractType: null,
      ToContractType: null,
      FromOwnerDeadDate: null,
      ToOwnerDeadDate: null,
      DocStatus: '',
      ContractStatus: this.fb.array([]),
      ExportType: 'pdf',
      reportType: [null, Validators.required],
    });
  }
  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.docStatusList = data.lorp39.DocStatusList;
      this.contractStatusList = data.lorp39.ContractStatus;
      this.loanType = data.lorp39.LoanType;
      this.Branch = data.lorp39.Branch;
      this.searchForm.setControl('ContractStatus', this.fb.array(this.contractStatusList.map((detail) => this.contractStatusForm(detail))))

    });
    this.getCompany();
  }

  bindDropdownlist() {
    this.selectFilter.SortByLang(this.company);
    this.company = [...this.company];
    this.selectFilter.SortByLang(this.loanType);
    this.selectFilter.FilterActive(this.loanType);
    this.loanType = [...this.loanType];
  }

  get currentCompany() {
    return (this.Companies.find(com => com.CompanyCode == this.auth.company) || {});
  }

  getCompany() {
    this.ls.getCompany().pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.Companies = res;
        });
  }

  get contractStatus(): FormArray {
    return this.searchForm.get('ContractStatus') as FormArray;
  };

  contractStatusForm(item: ContractStatus): FormGroup {
    let fg = this.fb.group({
      StatusValue: null,
      TextTha: null,
      TextEng: null,
      Active: false,
      //RowState: RowState.Add,
    });

    fg.patchValue(item, { emitEvent: false });
    return fg;
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP39');
  }

  print() {

    let selected = [];
    let selectedText = '';
    this.searchForm.controls.ContractStatus.value.forEach(element => {
      if (element.Active) {
        selected.push(element.StatusValue);
        selectedText += this.lang.CURRENT === 'Tha' ? element.TextTha + ', ' : element.TextEng + ', ';
      }
    });

    if (selected.length === 0 || selected.length === this.searchForm.controls.ContractStatus.value.length) {
      selected = [];
      selectedText = '';
    }
    this.reportParam.FromCompany = this.searchForm.controls.FromCompany.value;
    this.reportParam.ToCompany = this.searchForm.controls.ToCompany.value;
    this.reportParam.FromContractType = this.searchForm.controls.FromContractType.value;
    this.reportParam.ToContractType = this.searchForm.controls.ToContractType.value;
    this.reportParam.FromOwnerDeadDate = this.searchForm.controls.FromOwnerDeadDate.value;
    this.reportParam.ToOwnerDeadDate = this.searchForm.controls.ToOwnerDeadDate.value;
    this.reportParam.DocStatus = this.searchForm.controls.DocStatus.value;
    this.reportParam.ContractStatus = selected.join(',');
    this.reportParam.ExportType = this.searchForm.controls.ExportType.value;
    this.reportParam.ReportName = 'LORP40';

    
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
      })
    )
      .subscribe((res) => {
        if (res) {
          if (this.searchForm.controls.ExportType.value == 'pdf') {
            this.srcResult = res;
          } else {
            this.OpenWindow(res,this.reportParam.ReportName);
            this.srcResult = null;
          }
        }
      });
  }

  async OpenWindow(data,name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + this.reportParam.ExportType + ";base64," + data;
    doc.download = name + "_" + "SecuritiesOwnerDeathReport-" + ((Number(moment(this.now).format('YYYY')) - 543) + "-") + moment(this.now).format('MM-DD') + "." + this.reportParam.ExportType;
    doc.click();
  }
}
