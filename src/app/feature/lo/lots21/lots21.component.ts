import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots21Service, PackageDetail, Package } from '@app/feature/lo/lots21/lots21.service';
import { Page, TableService, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, AuthService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lots21.component.html'
})

export class Lots21Component implements OnInit {
  checkDocumentList = [];
  receivePackageList = [];
  receivePackageSave: Package = {} as Package;
  // packageDetail: PackageDetail = {} as PackageDetail;
  company = [];
  Companies = [];
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
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
    private sv: Lots21Service,
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

    const saveData = this.saveData.retrive('LOTS21');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.getCompany();

    this.lang.onChange().subscribe(() => {
      this.bindDropdownlist();
    });

    this.route.data.subscribe((data) => {

    })
    this.bindDropdownlist();
    this.onSearchCheckDoc();
    this.onSearchReceivePackage();

  }

  bindDropdownlist() {
    this.selectFilter.SortByLang(this.company);
    this.company = [...this.company];
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lots21') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOTS21');
    } else {
      this.saveData.delete('LOTS21');
    }
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearchReceivePackage();
  }

  onTableEvent2(event) {
    this.page2 = event;
    this.statusPage = false;
    this.onSearchCheckDoc();
  }

  onSearchCheckDoc() {
    this.sv.onSearchCheckDoc(this.page2)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.checkDocumentList = res.Rows;
          this.page2.totalElements = res.Total;
        });
  }

  onSearchReceivePackage() {
    this.sv.onSearchReceivePackage(this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.receivePackageList = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  edit(TrackingDocumentPackageId) {
    this.router.navigate(['/lo/lots21/detail/package', { TrackingDocumentPackageId: TrackingDocumentPackageId }], { skipLocationChange: true });
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

  receivePackage(row) {
    this.modal.confirm("ต้องการยืนยันรับพัสดุหรือไม่?").subscribe(
      (res) => {
        if (res) {
          this.onSave(row);
        }
      })
  }

  onSave(row) {
    this.saving = true;
    this.sv.saveReceivePacakage(row).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(res => {
        this.onSearchCheckDoc();
        this.onSearchReceivePackage();
        this.as.success('', 'Message.STD00006');
      })
  }
}
