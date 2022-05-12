import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Lots27Service } from '@app/feature/lo/lots27/lots27.service';
import { Page, ModalRef, SelectFilterService } from '@app/shared';
import { LangService, SaveDataService } from '@app/core';
import { finalize } from 'rxjs/operators';
import { ConfigurationService, ContentType, Category } from '@app/shared/service/configuration.service';

@Component({
  templateUrl: './lots27.component.html'
})

export class Lots27Component implements OnInit {
  searchForm: FormGroup;
  popup: ModalRef;
  mytime: Date = new Date();
  detailList = [];
  assetTypeList: any[];
  docStatusList = [];
  page = new Page();
  beforeSearch = '';
  statusPage: boolean;
  category = Category.Securities;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private lots27Service: Lots27Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
    private config: ConfigurationService
  ) {
    this.createForm();
  }

  createForm() {
    const now = new Date();

    this.searchForm = this.fb.group({
      SecuritiesType: null,
      DateFrom: null,
      DateTo: null,
      Securities: null,
      DocStatus: '5',
      flagSearch: true,
      beforeSearch: null,
      page: new Page(),
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.assetTypeList = data.lots27.master.AssetList;
      this.docStatusList = data.lots27.master.DocStatusList;
    });

    const saveData = this.saveData.retrive('LOTS27');
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
    this.lots27Service.getSearch(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
    this.saveData.save(this.searchForm.value, 'LOTS27');
  }

  add() {
    this.router.navigate(['/lo/lots27/detail'], { skipLocationChange: true });
  }

  edit(SecuritiesCode) {
    this.router.navigate(['/lo/lots27/detail', { SecuritiesCode: SecuritiesCode }], { skipLocationChange: true });
  }

  linkToContractDetail(id) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots27' }], { skipLocationChange: true }));
    window.open(url, '_blank');
  }
}
