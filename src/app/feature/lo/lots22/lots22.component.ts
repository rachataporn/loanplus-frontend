import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots22Service, ContractStatus } from '@app/feature/lo/lots22/lots22.service';
import { Page, TableService, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, AuthService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lots22.component.html'
})

export class Lots22Component implements OnInit {
  company = [];
  Companies = [];
  docStatusList = [];
  contractStatusList = [];
  Branch = [];
  detailList = []
  page = new Page();
  beforeSearch = '';
  statusPage: boolean;
  searchForm: FormGroup;

  now = new Date();
  isCompany: boolean;
  loadingMasterCustomer: Boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modal: ModalService,
    private sv: Lots22Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private selectFilter: SelectFilterService,

  ) { this.createForm(); }

  createForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      beforeSearch: null,
      flagSearch: true,
      Keyword: null,
      FromDate: null,
      ToDate: null,
      Company: null,
      DocStatus: '',
      ContractStatus: this.fb.array([]),
      page: new Page()
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

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.docStatusList = data.Lots22.DocStatusList;
      this.contractStatusList = data.Lots22.ContractStatus;
      this.Branch = data.Lots22.Branch;
      this.searchForm.setControl('ContractStatus', this.fb.array(this.contractStatusList.map((detail) => this.contractStatusForm(detail))))

    });
    this.getCompany();
    this.onSearch();
  }

  bindDropdownlist() {
    this.selectFilter.SortByLang(this.company);
    this.company = [...this.company];
  }

  get currentCompany() {
    return (this.Companies.find(com => com.CompanyCode == this.auth.company) || {});
  }

  getCompany() {
    this.sv.getCompany().pipe(
      finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.Companies = res;
        });
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    if (this.searchForm.controls['InputSearch'].value) {
      this.searchForm.controls['InputSearch'].setValue(this.searchForm.controls['InputSearch'].value.trim());
    }
    this.onSearch();
  }

  onSearch() {
    var selected = [];
    this.searchForm.controls.ContractStatus.value.forEach(element => {
        if (element.Active) {
            selected.push(element.StatusValue);
        }
    });
    this.sv.getSearchSecuritiesOwnerDead(Object.assign({
      Keyword: this.searchForm.controls.Keyword.value,
      FromDate: this.searchForm.controls.FromDate.value,
      ToDate: this.searchForm.controls.ToDate.value,
      CompanyCode: this.searchForm.controls.Company.value,
      DocStatus: this.searchForm.controls.DocStatus.value,
      ContractStatus: selected.join(",")
    }), this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.detailList = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  add(){
    this.router.navigate(['/lo/lots22/detail'], { skipLocationChange: true });
  }

  searchEdit(SecuritiesOwnerDeadId) {
    this.router.navigate(['/lo/lots22/detail', { SecuritiesOwnerDeadId: SecuritiesOwnerDeadId }], { skipLocationChange: true });
  }

  linkContractDetail(id?: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots03' }], { skipLocationChange: true }));
    window.open(url, '_blank');
  }
}
