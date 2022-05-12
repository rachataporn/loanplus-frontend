import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Dbmt112Service } from '@app/feature/db/dbmt11/dbmt11-2.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './dbmt11-2.component.html'
})

export class Dbmt112Component implements OnInit {
  SubDistrictTableList = [];
  DistrictId = [];
  ProvinceId = [];
  MasterDetail = [];
  SubDistrictHeader = [];
  count = 0;
  page = new Page();
  searchForm: FormGroup;
  MasterForm: FormGroup;
  statusPage: boolean;
  saving: boolean;
  beforeSearch = '';
  inPageOpen = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    private Dbmt112Service: Dbmt112Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createMasterForm();
    this.createForm();
  }

  createMasterForm() {
    this.MasterForm = this.fb.group({
      ProvinceId: null,
      DistrictId: null,
      DistrictNameTha: null,
      DistrictNameEng: null,
    });
  }

  createForm() {
    this.searchForm = this.fb.group({
      ProvinceId: null,
      DistrictId: null,
      InputSearch: null,
      flagSearch: true,
      beforeSearch: null
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('DBMT112');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.ProvinceId = data.dbmt112.ProvinceId;
      this.DistrictId = data.dbmt112.DistrictId;
      this.MasterDetail = data.dbmt112;
      this.statusPage = true
      this.rebuildForm();

    });
    if (this.inPageOpen != 'true') {
      if (!this.searchForm.controls.flagSearch.value) {
        this.beforeSearch = this.searchForm.controls.beforeSearch.value;
        this.statusPage = this.searchForm.controls.flagSearch.value;
      }
      else {
        this.statusPage = true
      }
    }
    this.onSearchHeader();
    this.onSearch();
  }

  rebuildForm() {
    this.MasterForm.markAsPristine();
    this.searchForm.markAsPristine();
    this.MasterForm.patchValue(this.MasterDetail);
    this.searchForm.controls.ProvinceId.setValue(this.ProvinceId);
    this.searchForm.controls.DistrictId.setValue(this.DistrictId);
    this.MasterForm.disable();
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'DBMT112');
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
    this.Dbmt112Service.getData(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
      .pipe(finalize(() => {
        if (this.statusPage) {
          this.beforeSearch = this.searchForm.value;
          this.searchForm.controls.beforeSearch.setValue(this.searchForm.value);
        }
      }))
      .subscribe(
        (res: any) => {
          this.SubDistrictTableList = res.Rows;
          this.page.totalElements = res.Total;
        });
  }

  onSearchHeader() {
    this.Dbmt112Service.getHeader(this.MasterForm.value)
      .pipe(finalize(() => {
        if (this.statusPage) {
          this.beforeSearch = this.searchForm.value;
        }
      }))
      .subscribe(
        (res: any) => {
          this.SubDistrictHeader = res.Rows[0];
          this.MasterForm.patchValue(this.SubDistrictHeader);
        });
  }

  add() {
    this.router.navigate(['/db/dbmt11-2/detail', { ProvinceId: this.ProvinceId, DistrictId: this.DistrictId, inPageOpen: true }], { skipLocationChange: true });
  }

  edit(row) {
    this.router.navigate(['/db/dbmt11-2/detail', { ProvinceId: row.province_id, DistrictId: row.district_id, SubDistrictId: row.sub_district_id, inPageOpen: true  }], { skipLocationChange: true });
  }

  back() {
    var ProvinceId = this.ProvinceId
    this.router.navigate(['/db/dbmt11-1', { ProvinceId: ProvinceId, inPageOpen: true}], { skipLocationChange: true });
  }

  remove(row) {
    this.modal.confirm('Message.STD000030').subscribe(
      (res) => {
        if (res) {
          this.Dbmt112Service.deleteSubDistrict(row).subscribe(
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
