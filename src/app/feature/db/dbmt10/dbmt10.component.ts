import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Dbmt10Service, Province } from '@app/feature/db/dbmt10/dbmt10.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './dbmt10.component.html'
})

export class Dbmt10Component implements OnInit {
  ProvinceDetail: Province = {} as Province;
  CountryList: any[];
  ProvinceTableList = [];
  count = 0;
  page = new Page();
  searchForm: FormGroup;
  statusPage: boolean;
  beforeSearch = '';
  CountryData = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    private dbmt10Service: Dbmt10Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private selectFilter: SelectFilterService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      Province: null,
      InputSearch: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page(),
    });
  }

  filterCountryCode() {
    this.CountryData = this.CountryList.filter(item => item.active === false);
    this.CountryData = this.selectFilter.FilterActive(this.CountryData);
    this.selectFilter.SortByLang(this.CountryData);
    this.CountryData = [...this.CountryData];
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('DBMT10');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.CountryList = data.dbmt10.CountryList.CountryList;
      this.filterCountryCode();
    });

    this.page = this.searchForm.controls.page.value;
    if (!this.searchForm.controls.flagSearch.value) {
      this.beforeSearch = this.searchForm.controls.beforeSearch.value;
      this.statusPage = this.searchForm.controls.flagSearch.value;
    } else {
      this.statusPage = true;
    }
    this.onSearch();
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'dbmt10' || this.router.url.split(';')[0] === '/db/dbmt11-1') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'DBMT10');
    } else {
      this.saveData.delete('DBMT10');
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
    this.onSearch();
  }

  onSearch() {
    if (this.searchForm.controls['InputSearch'].value) {
      this.searchForm.controls['InputSearch'].setValue(this.searchForm.controls['InputSearch'].value.trim());
    }
    this.dbmt10Service.getData(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
          this.ProvinceTableList = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  add() {
    this.router.navigate(['/db/dbmt10/detail'], { skipLocationChange: true });
  }

  edit(ProvinceId) {
    this.router.navigate(['/db/dbmt10/detail', { ProvinceId: ProvinceId }], { skipLocationChange: true });
  }

  moveToDistrict(row, index) {
    this.router.navigate(['/db/dbmt11-1', { ProvinceId: row.province_id, inPageOpen: true }], { skipLocationChange: true });
  }

  remove(row) {
    this.modal.confirm('Message.STD000030').subscribe(
      (res) => {
        if (res) {
          this.dbmt10Service.deleteProvince(row).subscribe(
            (response) => {
              this.as.success(' ', 'Message.STD00014');
              this.search();
            }, (error) => {
              console.log(error);
              this.as.error(' ', 'Message.STD000032');
            });
        }
      });
  }
}
