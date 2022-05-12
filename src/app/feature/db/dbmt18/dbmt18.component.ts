import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Dbmt18Service } from '@app/feature/db/dbmt18/dbmt18.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './dbmt18.component.html'
})

export class Dbmt18Component implements OnInit {
  countryList = [];
  faqList = [];
  count = 0;
  page = new Page();
  searchForm: FormGroup;
  statusPage: boolean;
  beforeSearch = '';

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private dbmt18Service: Dbmt18Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page(),
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('DBMT18');
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

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'dbmt18') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'DBMT18');
    } else {
      this.saveData.delete('DBMT18');
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
    this.dbmt18Service.getDataFaq(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
          this.faqList = res.Rows;
          this.page.totalElements = res.Total;
        });
    // this.dbmt18Service.getData(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
    //   .pipe(finalize(() => {
    //     if (this.statusPage) {
    //       this.beforeSearch = this.searchForm.value;
    //       this.searchForm.controls.beforeSearch.reset();
    //       this.searchForm.controls.page.setValue(this.page);
    //       this.searchForm.controls.beforeSearch.setValue(this.searchForm.value);
    //     }
    //   }))
    //   .subscribe(
    //     (res: any) => {
    //       this.countryList = res.Rows;
    //       this.page.totalElements = res.Total;
    //     });
  }

  add() {
    this.router.navigate(['/db/dbmt18/detail', { flagSearch: true }], { skipLocationChange: true });
  }

  edit(Id) {
    this.router.navigate(['/db/dbmt18/detail', { Id: Id }], { skipLocationChange: true });
  }

  remove(CountryCode, RowVersion) {
    this.modal.confirm('Message.STD000030').subscribe(
      (res) => {
        if (res) {
          this.dbmt18Service.deleteCountry(CountryCode, RowVersion).subscribe(
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
