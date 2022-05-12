import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Page, ModalService, TableService, SelectFilterService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, SaveDataService, LangService } from '@app/core';
import { Lomt16Service, CompanySendRound, Company } from "./lomt16.service";
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-lomt16',
  templateUrl: './lomt16.component.html',
  styleUrls: ['./lomt16.component.scss']
})
export class Lomt16Component implements OnInit {
  company: Company[] = [];
  dayOfWeek = [];
  //menuForm: FormGroup;
  page = new Page();
  submitted = false;
  focusToggle = false;
  saving = false;
  companyRound: CompanySendRound = {} as CompanySendRound;
  searchForm: FormGroup;

  constructor(
    public lang: LangService,
    private Lomt16Service: Lomt16Service,
    private fb: FormBuilder,
    private saveData: SaveDataService,
    private as: AlertService,
    private filter: SelectFilterService,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      inputSearch: null
    });
    this.searchForm.valueChanges.subscribe(() => this.page.index = 0);
  }

  ngOnInit() {

    this.route.data.subscribe((data) => {
      this.dayOfWeek = data.tracking.master.DayOfWeek;
    });

    const saveData = this.saveData.retrive('LOMT16');
    if (saveData) this.searchForm.patchValue(saveData);
    const pageData = this.saveData.retrive('LOMT16Page');
    if (pageData) this.page = pageData;
    this.search(false);

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });
    this.bindDropDownList();
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LOMT16');
    this.saveData.save(this.page, 'LOMT16Page');
  }

  search(reset) {
    if (reset) this.page.index = 0;
    this.Lomt16Service.getCompany(this.searchForm.value, this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.company = res.Rows;
          this.page.totalElements = res.Total;
        }, (error) => {
          console.log(error);
        });
  }

  onTableEvent(event) {
    this.search(false);
  }


  bindDropDownList() {
    this.filterDayOfWeek(true);
  }


  filterDayOfWeek(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.dayOfWeek = this.filter.FilterActiveByValue(this.dayOfWeek, detail.DayOfWeek);
      }
      else {
        this.dayOfWeek = this.filter.FilterActive(this.dayOfWeek);
      }
    }
    this.dayOfWeek = [...this.dayOfWeek];
  }

  onSubmit() {
    this.submitted = true;
    this.saving = true;
    this.onSave();
  }

  onSave() {
    this.saving = true;
    this.prepareSave();
    this.Lomt16Service.save(this.companyRound).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: any) => {
          this.as.success('', 'Message.STD00006');
          this.search(true);
        });
  }

  prepareSave() {
    this.companyRound.company = this.company
  }

}
