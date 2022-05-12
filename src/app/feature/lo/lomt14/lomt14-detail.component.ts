import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, AuthService } from '@app/core';
import { ModalService, SelectFilterService, RowState, Size } from '@app/shared';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Lomt14Service, CarPrice } from './lomt14.service';

@Component({
  templateUrl: './lomt14-detail.component.html'
})
export class Lomt14DetailComponent implements OnInit {
  carPrice: CarPrice = {} as CarPrice;
  carPriceFrom: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  selected = [];
  viewList = [];
  formatYearList = [];
  formatMonthList = [];
  securitiesGroupList = [];
  CarType = [];
  countDup: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private lomt14Service: Lomt14Service,
    private modal: ModalService,
    public lang: LangService,
    private selectFilter: SelectFilterService,
    private auth: AuthService
  ) {
    this.createForm();
  }

  createForm() {
    this.carPriceFrom = this.fb.group({
      CarId: null,
      BrandName: [null, Validators.required],
      ModelName: [null, Validators.required],
      ModelType: [null, Validators.required],
      Year: [null, Validators.required],
      Price: [null, Validators.required],
      CarType: 'C'
    });

    this.carPriceFrom.controls.BrandName.valueChanges.subscribe(
      (value) => {
        this.carPriceFrom.controls.BrandName.setValue(value.toUpperCase(), { emitEvent: false });
      }
    );
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.carPrice = data.Lomt14.detail ? data.Lomt14.detail || {} as CarPrice : {} as CarPrice;
      this.CarType = data.Lomt14.master.CarTypeList;
    });
    this.rebuildForm();
  }

  rebuildForm() {
    this.carPriceFrom.markAsPristine();
    this.carPriceFrom.patchValue(this.carPrice);
  }

  prepareSave(values: Object) {
    Object.assign(this.carPrice, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.carPriceFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.saving = true;
    this.prepareSave(this.carPriceFrom.getRawValue());
    this.lomt14Service.save(this.carPrice).pipe(
      switchMap((id) =>
        this.lomt14Service.getDetail(id || this.carPrice.CarId)
      ),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: CarPrice) => {
        if (res) {
          this.carPrice = res;
          this.rebuildForm();
          this.as.success("", "Message.STD00006");
        }
      });
  }

  back() {
    this.router.navigate(['/lo/lomt14'], { skipLocationChange: true });
  }
}
