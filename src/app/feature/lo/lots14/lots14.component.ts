import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Lots14Service } from '@app/feature/lo/lots14/lots14.service';
import { Page, ModalRef, SelectFilterService } from '@app/shared';
import { LangService, SaveDataService } from '@app/core';
import { ImageDisplayService } from '@app/shared/image/image-display.service';
import { finalize } from 'rxjs/operators';
import { ConfigurationService, ContentType, Category } from '@app/shared/service/configuration.service';

@Component({
  templateUrl: './lots14.component.html'
})

export class Lots14Component implements OnInit {
  searchForm: FormGroup;
  popup: ModalRef;
  mytime: Date = new Date();
  detailList = [];
  assetTypeList = [];
  companyList = [];
  page = new Page();
  beforeSearch = '';
  statusPage: boolean;
  category = Category.Securities;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private lots14Service: Lots14Service,
    private saveData: SaveDataService,
    private route: ActivatedRoute,
    public image: ImageDisplayService,
    private config: ConfigurationService,
    public lang: LangService
  ) {
    this.createForm();
  }

  createForm() {
    const now = new Date();

    this.searchForm = this.fb.group({
      CompanyCode: null,
      SecuritiesType: null,
      DateFrom: null,
      DateTo: null,
      Securities: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page(),
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.companyList = data.requestSecureVerify.master.CompanyList;
      this.assetTypeList = data.requestSecureVerify.master.AssetList;
    });

    const saveData = this.saveData.retrive('LOTS14');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.page = this.searchForm.controls.page.value;
    if (!this.searchForm.controls.flagSearch.value) {
      this.beforeSearch = this.searchForm.controls.beforeSearch.value;
      this.statusPage = this.searchForm.controls.flagSearch.value;
    } else {
      this.statusPage = true;
    }
    this.onSearch();
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    if (this.searchForm.controls.Securities.value) {
      this.searchForm.controls.Securities.setValue(this.searchForm.controls.Securities.value.trim());
    }
    this.onSearch();
  }

  onSearch() {
    this.lots14Service.getSearch(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
      .pipe(finalize(() => {
        if (this.statusPage) {
          this.beforeSearch = this.searchForm.value;
          this.searchForm.controls.beforeSearch.reset();
          this.searchForm.controls.page.setValue(this.page);
          this.searchForm.controls.beforeSearch.setValue(this.searchForm.value);
        }
      }))
      .subscribe(
        (res: any) => {
          this.detailList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lots14') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOTS14');
    } else {
      this.saveData.delete('LOTS14');
    }
  }

  edit(SecuritiesCode) {
    this.router.navigate(['/lo/lots14/detail', { SecuritiesCode: SecuritiesCode }], { skipLocationChange: true });
  }
}
