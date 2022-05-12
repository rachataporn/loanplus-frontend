import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lomt03Service } from '@app/feature/lo/lomt03/lomt03.service';
import { Page, ModalService, ModelRef } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
  templateUrl: './lomt03.component.html'
})

export class Lomt03Component implements OnInit {

  loanList = [];
  companyList: any[];
  menuForm: FormGroup;
  count: Number = 5;
  page = new Page();
  statusPage: boolean = true;
  searchForm: FormGroup;
  beforeSearch = '';

  periods = [];
  year = [];
  currentDateOfYear = new Date(String(new Date().getFullYear()) + '-01-01');
  createPeriodFormModal: FormGroup;
  focusToggle: boolean;
  submitted: boolean;
  yearCreate = null;
  examplePopup: ModelRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    private lomt03Service: Lomt03Service,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) {
    this.createForm();
    this.createSearchForm();
  }

  createForm() {
    this.createPeriodFormModal = this.fb.group({
      year: [new Date().getFullYear(), Validators.required],
      startDate: [this.currentDateOfYear, Validators.required],
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      keywords: [null, Validators.required]
    });
  }

  clearTable() {
    this.periods = [];
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.year = data.attribute.YearList.GetGroupYearList;
    });
    const saveData = this.saveData.retrive('LOMT03');
    if (saveData) {
      this.searchForm.patchValue(saveData ? saveData : null);
      // this.search();
    }
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.controls['keywords'].value, 'LOMT03');
  }

  searchDrop() {
    this.lomt03Service.getYear()
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.year = res.GetGroupYearList;
        });
  }

  onTableEvent(event) {
    this.page = event;
    this.onSearch();
  }

  search() {
    this.page = new Page();
    this.onSearch();
  }

  onSearch() {
    if (this.searchForm.invalid) {
      this.submitted = true;
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.lomt03Service.getPeriod({ keysearch: this.searchForm.controls['keywords'].value },
      this.page
    )
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.periods = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  closeModal() {
    this.examplePopup.hide();
    this.createPeriodFormModal.controls['year'].setValue(new Date().getFullYear());
    this.createPeriodFormModal.controls['startDate'].setValue(this.currentDateOfYear);
  }

  openModal(content) {
    this.examplePopup = this.modal.open(content);
  }

  createPeriod() {
    this.submitted = true;
    if (this.createPeriodFormModal.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.yearCreate = this.createPeriodFormModal.controls['year'].value + 543;
    this.lomt03Service.insertPeriod(this.createPeriodFormModal.value, this.searchForm.controls['keywords'].value, this.page)
      .pipe(finalize(() => {
        this.submitted = false;
      }))
      .subscribe(
        (res: any) => {
          // this.periods = res.Rows;
          // this.page.totalElements = res.Rows.length ? res.Total : 0;
          this.as.success('', 'Message.STD00006');
          this.searchDrop();
          // this.search();
          this.closeModal();
        });
  }

  dupicatePeriod() {
    this.lomt03Service.checkDuplicate(this.createPeriodFormModal.value).pipe(
      finalize(() => {
        this.submitted = false;
      }))
      .subscribe(
        (res) => {
          if (res) {
            this.createPeriod();
          } else {
            this.as.error('', 'ข้อมูลซ้ำซ้อน');
          }
        }
      );
  }
  // openPeriod(index) {
  //   if (this.periods[index].Status === 'N') {
  //     this.periods[index].OpenedDate = new Date();
  //   } else if (this.periods[index].Status === 'C') {
  //     this.periods[index].OpenedDate = new Date();
  //     this.periods[index].ClosedDate = null;
  //     this.periods[index].CanceledDate = new Date();
  //   }
  //   this.periods[index].Status = 'O';
  //   // this.edit(index);
  // }

  // closePeriod(index) {
  //   this.periods[index].ClosedDate = new Date();
  //   this.periods[index].Status = 'C';
  //   // this.edit(index);
  // }

  // edit(index) {
  //   this.lomt03Service.editStatus(this.periods[index], this.searchForm.controls['keywords'].value, this.page)
  //     .pipe(finalize(() => {
  //     }))
  //     .subscribe(
  //       (res: any) => {
  //         this.periods = res.Rows;
  //         this.page.totalElements = res.Total;
  //       });
  // }


}
