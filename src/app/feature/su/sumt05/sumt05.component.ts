import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Sumt05Service, SuProfileDTO } from '@app/feature/su/sumt05/sumt05.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';


@Component({
  templateUrl: './sumt05.component.html'
})

export class Sumt05Component implements OnInit {
  SuProfileDTO: SuProfileDTO = {} as SuProfileDTO;
  profileList = [];
  page = new Page();

  searchForm: FormGroup;
  statusPage: boolean;
  beforeSearch = '';

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private sumt05Service: Sumt05Service,
    public lang: LangService,
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
    const saveData = this.saveData.retrive('SUMT05');
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
    if (this.searchForm.controls.InputSearch.value) {
      this.searchForm.controls.InputSearch.setValue(this.searchForm.controls.InputSearch.value.trim());
    }
    this.onSearch();
  }

  onSearch() {
    this.sumt05Service.getProfileList(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
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
          this.profileList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  add() {
    this.router.navigate(['/su/sumt05/detail'], { skipLocationChange: true });
  }

  edit(ProfileCode) {
    this.router.navigate(['/su/sumt05/detail', { ProfileCode: ProfileCode }], { skipLocationChange: true });
  }

  remove(ProfileCode, RowVersion) {
    this.modal.confirm('Message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.sumt05Service.deleteProfile(ProfileCode, RowVersion).subscribe(
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

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'sumt05') {
      this.searchForm.controls.flagSearch.setValue(false);
      this.saveData.save(this.searchForm.value, 'SUMT05');
    } else {
      this.saveData.delete('SUMT05');
    }
  }
}
