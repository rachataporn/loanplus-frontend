import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots20Service, PackageDetail, Package } from '@app/feature/lo/lots20/lots20.service';
import { Page, TableService, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, AuthService, LangService, SaveDataService } from '@app/core';
import { Lots20ContractLookupComponent } from './lots20-contract-lookup.component';

@Component({
  templateUrl: './lots20.component.html'
})

export class Lots20Component implements OnInit {
  Lots20ContractLookupContent = Lots20ContractLookupComponent;
  TrackingDoc: PackageDetail[] = [];
  PackageList: Package[] = [];
  company = [];
  Companies = [];
  page = new Page();
  page2 = new Page();
  beforeSearch = '';
  statusPage: boolean;
  searchForm: FormGroup;

  loadingMasterCustomer: Boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modal: ModalService,
    private sv: Lots20Service,
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

    const saveData = this.saveData.retrive('LOTS20');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.getCompany();

    this.lang.onChange().subscribe(() => {
      this.bindDropdownlist();
    });

    this.route.data.subscribe((data) => {

    })
    this.bindDropdownlist();
    this.onSearchTracking();
    this.onSearchPackage();

  }

  bindDropdownlist() {
    this.selectFilter.SortByLang(this.company);
    this.company = [...this.company];
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lots20') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOTS20');
    } else {
      this.saveData.delete('LOTS20');
    }
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearchTracking();
  }

  onTableEvent2(event) {
    this.page2 = event;
    this.statusPage = false;
    this.onSearchPackage();
  }

  onSearchTracking() {
    this.sv.getSearchSendDoc(this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.TrackingDoc = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  onSearchPackage() {
    this.sv.getSearchPackage(this.page2)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.PackageList = res.Rows;
          this.page2.totalElements = res.Total;
        });
  }

  edit(TrackingDocumentPackageId) {
    this.router.navigate(['/lo/lots20/detail/package', { TrackingDocumentPackageId: TrackingDocumentPackageId }], { skipLocationChange: true });
  }

  PrepareDoc(ReqCompanyCode, ReqCompanyCreatedDocument) {
    this.router.navigate(['/lo/lots20/detail', { ReqCompanyDocument: ReqCompanyCode, ReqCompanyCreatedDocument: ReqCompanyCreatedDocument }], { skipLocationChange: true });
  }
  add(){
    this.router.navigate(['/lo/lots20/detail/package'], { skipLocationChange: true });
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
