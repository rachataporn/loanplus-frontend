import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots01Service } from '@app/feature/lo/lots01/lots01.service';
import { Page } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lots01.component.html'
})

export class Lots01Component implements OnInit, OnDestroy {
  customerList = [];
  page = new Page();
  searchForm: FormGroup;

  beforeSearch = '';
  statusPage: boolean;

  BlackLists = [{ Value: null, TextTha: "ทั้งหมด", TextEng: "All" }, { Value: false, TextTha: "ไม่แบล็คลิสต์", TextEng: "Not Blacklist" }, { Value: true, TextTha: "แบล็คลิสต์", TextEng: "Blacklist" }];
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private lots01Service: Lots01Service,
    private lang: LangService,
    private as: AlertService,
    private saveData: SaveDataService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      CustomerCode: null,
      CustomerName: null,
      IdCard: null,
      BlackList: null,
      flagSearch: true,
      beforeSearch: null,
      page: new Page(),
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LOTS01');
    if (saveData) {
      this.searchForm.setValue(saveData);
    }
    this.page = this.searchForm.controls.page.value;
    if (!this.searchForm.controls.flagSearch.value) {
      this.beforeSearch = this.searchForm.controls.beforeSearch.value;
      this.statusPage = this.searchForm.controls.flagSearch.value;
    } else {
      this.statusPage = true;
    }
    this.search();
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lots01') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'LOTS01');
    } else {
      this.saveData.delete('LOTS01');
    }
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.search();
  }

  onSearch() {
    this.page = new Page();
    this.statusPage = true;
    if (this.searchForm.controls.CustomerCode.value) {
      this.searchForm.controls.CustomerCode.setValue(this.searchForm.controls.CustomerCode.value.trim());
    }
    if (this.searchForm.controls.CustomerName.value) {
      this.searchForm.controls.CustomerName.setValue(this.searchForm.controls.CustomerName.value.trim());
    }
    if (this.searchForm.controls.IdCard.value) {
      this.searchForm.controls.IdCard.setValue(this.searchForm.controls.IdCard.value.trim());
    }
    this.search();
  }

  search() {
    this.lots01Service.getCustomerList(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
          this.customerList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  searchStatus() {
    this.statusPage = true;
    this.search();
  }

  edit(CustomerCode) {
    this.router.navigate(['/lo/lots01/detail', { CustomerCode: CustomerCode }], { skipLocationChange: true });
  }

  add() {
    this.router.navigate(['/lo/lots01/detail'], { skipLocationChange: true });
  }

}
