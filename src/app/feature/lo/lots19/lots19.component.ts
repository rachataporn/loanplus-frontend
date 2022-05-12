import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots19Service, Disbursement } from '@app/feature/lo/lots19/lots19.service';
import { Page, TableService, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, AuthService, LangService, SaveDataService } from '@app/core';
import { Lots19ContractLookupComponent } from './lots19-contract-lookup.component';

@Component({
  templateUrl: './lots19.component.html'
})

export class Lots19Component implements OnInit {
  Lots19ContractLookupContent = Lots19ContractLookupComponent;
  TrackingDoc: Disbursement[] = [];
  company = [];
  Companies = [];
  page = new Page();
  beforeSearch = '';
  statusPage: boolean;
  searchForm: FormGroup;

  isCompany: boolean;
  loadingMasterCustomer: Boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modal: ModalService,
    private sv: Lots19Service,
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
      CompanyCode: null,
      CompanyReqTake: null,
      page: new Page()
    });
  }

  ngOnInit() {

    const saveData = this.saveData.retrive('LOTS19');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.getCompany();

    this.lang.onChange().subscribe(() => {
      this.bindDropdownlist();
    });

    this.route.data.subscribe((data) => {
      // this.company = data.lots18.master.Companys;
      this.isCompany = data.Lots19.IsMainCompany
    })
    this.bindDropdownlist();
    this.onSearch();
    
  }

  bindDropdownlist() {
    this.selectFilter.SortByLang(this.company);
    this.company = [...this.company];
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lots19') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOTS19');
    } else {
      this.saveData.delete('LOTS19');
    }
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
    this.sv.getSearchTrackingDoc(Object.assign({
      Keyword: this.searchForm.controls.Keyword.value,
      CompanyCode: this.searchForm.controls.CompanyReqTake.value,
      IsCompany: this.isCompany
    }), this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.TrackingDoc = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  add() {
    this.router.navigate(['/lo/lots19/detail'], { skipLocationChange: true });
  }

  edit(TrackingDocumentId) {
    this.router.navigate(['/lo/lots19/detail', { TrackingDocumentId: TrackingDocumentId }], { skipLocationChange: true });
  }

  remove(row) {
    this.modal.confirm('Message.STD000030').subscribe(
      (res) => {
        if (res) {
          this.sv.deleteTracking(row).subscribe(
            (response) => {
              this.as.success(' ', 'Message.STD00014');
              this.search();
            }, (error) => {
              this.as.error(' ', 'Message.STD000032');
            });
        }
      });
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

  linkContractDetail(id?: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots03' }], { skipLocationChange: true }));
    window.open(url, '_blank');
  }

}
