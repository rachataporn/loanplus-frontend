import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Dbmt111Service } from '@app/feature/db/dbmt11/dbmt11-1.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './dbmt11-1.component.html'
})

export class Dbmt111Component implements OnInit {
  CountryList = [];
  DistrictTableList = [];
  DistrictDetail = [];
  DistrictHeader = [];
  count = 0;
  page = new Page();
  MasterForm: FormGroup;
  searchForm: FormGroup;
  statusPage: boolean;
  beforeSearch = '';
  saving: boolean;
  ProvinceId = '';
  ProvinceNameEng = '';
  ProvinceNameTha = '';
  inPageOpen = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    private Dbmt111Service: Dbmt111Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
    this.createMasterForm();
  }

  createMasterForm() {
    this.MasterForm = this.fb.group({
      ProvinceId: null,
      ProvinceNameTha: null,
      ProvinceNameEng: null,
    });
  }

  createForm() {
    this.searchForm = this.fb.group({
      ProvinceId: null,
      InputSearch: null,
      flagSearch: true,
      beforeSearch: null
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('DBMT111');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.ProvinceId = data.dbmt111.ProvinceId;
      this.DistrictDetail = data.dbmt111;
      this.inPageOpen = data.dbmt111.inPageOpen;
      this.statusPage = true
      this.rebuildForm();
    });
    if (this.inPageOpen != 'true') {
      if (!this.searchForm.controls.flagSearch.value) {
        this.beforeSearch = this.searchForm.controls.beforeSearch.value;
        this.statusPage = this.searchForm.controls.flagSearch.value;
      } else {
        this.statusPage = true
      }
    }
    this.onSearchHeader();
    this.onSearch();
  }

  rebuildForm() {
    this.MasterForm.markAsPristine();
    this.MasterForm.patchValue(this.DistrictDetail)
    this.searchForm.controls.ProvinceId.setValue(this.ProvinceId);
    this.MasterForm.disable();
  }

  getProvinceList() {
    this.Dbmt111Service.getCountryList().pipe(finalize(() => { })).subscribe(
      (res: any) => {
        this.CountryList = res.CountryList;
      });
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'DBMT111');
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
    this.Dbmt111Service.getData(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
      .pipe(finalize(() => {
        if (this.statusPage) {
          this.beforeSearch = this.searchForm.value;
          this.searchForm.controls.beforeSearch.setValue(this.searchForm.value);
        }
      }))
      .subscribe(
        (res: any) => {
          this.DistrictTableList = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  onSearchHeader() {
    this.Dbmt111Service.getHeader(this.MasterForm.value)
      .pipe(finalize(() => {
        if (this.statusPage) {
          this.beforeSearch = this.searchForm.value;
        }
      }))
      .subscribe(
        (res: any) => {
          this.DistrictHeader = res.Rows[0];
          this.MasterForm.patchValue(this.DistrictHeader);
        });
  }

  back() {
    this.router.navigate(['/db/dbmt10'], { skipLocationChange: true });
  }

  add() {
    var ProvinceId = this.MasterForm.controls.ProvinceId.value;
    var ProvinceNameTha = this.MasterForm.controls.ProvinceNameTha.value;
    var ProvinceNameEng = this.MasterForm.controls.ProvinceNameEng.value;

    this.router.navigate(['/db/dbmt11-1/detail', { ProvinceId: ProvinceId, inPageOpen: true }], { skipLocationChange: true });
  }

  edit(row) {
    var ProvinceId = this.MasterForm.controls.ProvinceId.value;
    var DistrictId = row.district_id;
    this.router.navigate(['/db/dbmt11-1/detail', { ProvinceId: ProvinceId, DistrictId: DistrictId , inPageOpen: true }], { skipLocationChange: true });
  }

  moveToSubDistrict(row, index) {
    var ProvinceId = this.MasterForm.controls.ProvinceId.value;
    var DistrictId = row.district_id;
    this.router.navigate(['/db/dbmt11-2', { ProvinceId: ProvinceId, DistrictId: DistrictId, inPageOpen: true }], { skipLocationChange: true });
  }

  remove(row) {
    this.modal.confirm('Message.STD000030').subscribe(
      (res) => {
        if (res) {
          this.Dbmt111Service.deleteDistrict(row).subscribe(
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