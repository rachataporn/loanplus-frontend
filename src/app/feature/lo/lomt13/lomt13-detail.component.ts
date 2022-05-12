import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, AuthService } from '@app/core';
import { ModalService, SelectFilterService, RowState, Size } from '@app/shared';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Lomt13Service, MotorcyclePrice } from './lomt13.service';

@Component({
  templateUrl: './lomt13-detail.component.html'
})
export class Lomt13DetailComponent implements OnInit {
  motorcyclePrice: MotorcyclePrice = {} as MotorcyclePrice;
  motorcyclePriceFrom: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  selected = [];
  viewList = [];
  formatYearList = [];
  formatMonthList = [];
  securitiesGroupList = [];
  countDup: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private Lomt13Service: Lomt13Service,
    private modal: ModalService,
    public lang: LangService,
    private selectFilter: SelectFilterService,
    private auth: AuthService
  ) {
    this.createForm();
  }

  createForm() {
    this.motorcyclePriceFrom = this.fb.group({
      MotorcycleId: null,
      BrandName: [null, Validators.required],
      ModelName: [null, Validators.required],
      IdentificationNo: null,
      EngineNo: null,
      ModelCode: null,
      Year: [null, Validators.required],
      Price: [null, Validators.required]
    });

    this.motorcyclePriceFrom.controls.BrandName.valueChanges.subscribe(
      (value) => {
        this.motorcyclePriceFrom.controls.BrandName.setValue(value.toUpperCase(), { emitEvent: false });
      }
    );
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.motorcyclePrice = data.Lomt13.detail ? data.Lomt13.detail || {} as MotorcyclePrice : {} as MotorcyclePrice;
    });
    this.rebuildForm();
  }

  rebuildForm() {
    this.motorcyclePriceFrom.markAsPristine();
    this.motorcyclePriceFrom.patchValue(this.motorcyclePrice);
  }

  prepareSave(values: Object) {
    Object.assign(this.motorcyclePrice, values);
    this.motorcyclePrice.IdentificationNo == "" ? this.motorcyclePrice.IdentificationNo = null : this.motorcyclePrice.IdentificationNo;
    this.motorcyclePrice.ModelCode == "" ? this.motorcyclePrice.ModelCode = null : this.motorcyclePrice.ModelCode;
    this.motorcyclePrice.EngineNo == "" ? this.motorcyclePrice.EngineNo = null : this.motorcyclePrice.EngineNo;
  }

  onSubmit() {
    this.submitted = true;
    if (this.motorcyclePriceFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.saving = true;
    this.prepareSave(this.motorcyclePriceFrom.getRawValue());
    this.Lomt13Service.save(this.motorcyclePrice).pipe(
      switchMap((id) =>
        this.Lomt13Service.getDetail(id || this.motorcyclePrice.MotorcycleId)
      ),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: MotorcyclePrice) => {
        if (res) {
          this.motorcyclePrice = res;
          this.rebuildForm();
          this.as.success("", "Message.STD00006");
        }
      });
  }

  back() {
    this.router.navigate(['/lo/lomt13'], { skipLocationChange: true });
  }
}
