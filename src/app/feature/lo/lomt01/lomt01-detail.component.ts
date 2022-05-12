import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, AuthService } from '@app/core';
import { ModalService, SelectFilterService, RowState, Size } from '@app/shared';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Lomt01Service, SecuritiesCategory, SecuritiesAttribute } from './lomt01.service';
import { Lomt01SecuritiesAttributeLookupComponent } from './lomt01-securities-attribute-lookup.component';

@Component({
  templateUrl: './lomt01-detail.component.html'
})
export class Lomt01DetailComponent implements OnInit {
  securitiesCategory: SecuritiesCategory = {} as SecuritiesCategory;
  securitiesCategoryFrom: FormGroup;
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
    private lomt01Service: Lomt01Service,
    private modal: ModalService,
    public lang: LangService,
    private selectFilter: SelectFilterService,
    private auth: AuthService
  ) {
    this.createForm();
  }

  createForm() {
    this.securitiesCategoryFrom = this.fb.group({
      CategoryId: null,
      CategoryNameTha: [null, Validators.required],
      CategoryNameEng: null,
      MainCategoryId: null,
      CategorySequence: null,
      TemplateViewId: [null, Validators.required],
      SecuritiesTypeGroup: [null, Validators.required],
      RunningType: [null, Validators.required],
      RunningNoFormat: null,
      RunningNoDigit: [null, Validators.required],
      FormatYear: '0',
      FormatMonth: '0',
      Active: true,
      RunningNoFormatForDisplay: [{ value: null, disabled: true }],
      SecuritiesAttributeFrom: this.fb.array([]),
      Priority: null
    });

    this.securitiesCategoryFrom.controls.RunningType.valueChanges.subscribe(() => {
      this.generateRunningNoFormat();
    });
    this.securitiesCategoryFrom.controls.FormatYear.valueChanges.subscribe(() => {
      this.generateRunningNoFormat();
    });
    this.securitiesCategoryFrom.controls.FormatMonth.valueChanges.subscribe(() => {
      this.generateRunningNoFormat();
    });
    this.securitiesCategoryFrom.controls.RunningNoDigit.valueChanges.subscribe(() => {
      this.generateRunningNoFormat();
    });
  }

  createDetailForm(item: SecuritiesAttribute): FormGroup {
    let fg = this.fb.group({
      guid: Math.random().toString(), // important for tracking change
      CategoryAttributeId: null,
      CategoryId: null,
      AttributeId: null,
      RequireFlag: null,
      TitleSeq: [null, Validators.required],
      categoryAttributeSequence: null,
      Active: null,
      AttributeNameTha: null,
      AttributeNameEng: null,
      AttributeTypeTha: null,
      AttributeTypeEng: null,
      RowVersion: null,
      Priority: null,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState === RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    );
    return fg;
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.securitiesCategory = data.secureCategory.SecuritiesCategory ? data.secureCategory.SecuritiesCategory || {} as SecuritiesCategory : {} as SecuritiesCategory;
      this.viewList = data.secureCategory.master.ViewList;
      this.formatYearList = data.secureCategory.master.FormatYear;
      this.formatMonthList = data.secureCategory.master.FormatMonth;
      this.securitiesGroupList = data.secureCategory.master.SecuritiesGroup;
      this.filterListDropdown();
    });
    this.rebuildForm();
  }

  filterListDropdown() {
    this.viewList = this.selectFilter.FilterActive(this.viewList);
    this.viewList = [...this.viewList];

    this.securitiesGroupList = this.selectFilter.FilterActive(this.securitiesGroupList);
    this.securitiesGroupList = [...this.securitiesGroupList];
  }

  rebuildForm() {
    this.securitiesCategoryFrom.markAsPristine();
    this.securitiesCategoryFrom.patchValue(this.securitiesCategory);
    if (this.securitiesCategory.RowVersion) {
      this.securitiesCategoryFrom.controls.TemplateViewId.setValue(String(this.securitiesCategory.TemplateViewId));
      this.securitiesCategoryFrom.setControl('SecuritiesAttributeFrom',
        this.fb.array(this.securitiesCategory.securitiesAttribute.map((detail) => this.createDetailForm(detail))));
    }
  }

  get getSecuritiesAttribute(): FormArray {
    return this.securitiesCategoryFrom.get('SecuritiesAttributeFrom') as FormArray;
  };

  addAttribute() {
    this.modal.openComponent(Lomt01SecuritiesAttributeLookupComponent, Size.large).subscribe(
      (result) => {
        if (result.length > 0) {
          for (const item of result) {
            if (!this.checkDuplicate(item)) {
              this.getSecuritiesAttribute.push(
                this.createDetailForm(
                  item as SecuritiesAttribute
                )
              );
            }
          }
        }
      });
  }

  checkDuplicate(result) {
    for (const form of this.getSecuritiesAttribute.value) {
      if (form.AttributeId === result.AttributeId) {
        this.as.warning('', 'Label.LOMT01.Message.Attribute');
        return true;
      }
    }
  }

  removeRow(index) {
    const detail = this.getSecuritiesAttribute.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      // เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
      const deleting = this.securitiesCategory.securitiesAttribute.find(item =>
        item.AttributeId === detail.controls.AttributeId.value
      );
      deleting.RowState = RowState.Delete;
    }

    // --ลบข้อมูลrecordนี้ออกจาก formarray
    this.getSecuritiesAttribute.removeAt(index);
    this.getSecuritiesAttribute.markAsDirty();
    // ---------------------------------
  }

  prepareSave(values: Object) {
    Object.assign(this.securitiesCategory, values);
    const securitiesAttributes = this.getSecuritiesAttribute.getRawValue();
    // add
    const adding = securitiesAttributes.filter(function (item) {
      return item.RowState === RowState.Add;
    });
    // edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.securitiesCategory.securitiesAttribute.map(label => {
      return Object.assign(label, securitiesAttributes.filter(item => item.RowState === RowState.Edit).find((item) => {
        return label.CategoryAttributeId === item.CategoryAttributeId;
      }));
    });
    // เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.securitiesCategory.securitiesAttribute = this.securitiesCategory.securitiesAttribute.filter(item => item.RowState !== RowState.Add).concat(adding);
  }

  checkSeqDup() {
    const duplicate = this.getSecuritiesAttribute.getRawValue().some((row1, idx1) => {
      return this.getSecuritiesAttribute.getRawValue().some((row2, idx2) => {
        return row1.TitleSeq === row2.TitleSeq && idx1 < idx2
      });
    });
    return duplicate;
  }

  onSubmit() {
    this.submitted = true;
    if (this.securitiesCategoryFrom.controls.CategoryNameTha.value) {
      this.securitiesCategoryFrom.controls.CategoryNameTha.setValue(this.securitiesCategoryFrom.controls.CategoryNameTha.value.trim());
    }
    if (this.securitiesCategoryFrom.controls.TemplateViewId.value) {
      this.securitiesCategoryFrom.controls.TemplateViewId.setValue(this.securitiesCategoryFrom.controls.TemplateViewId.value.trim());
    }
    if (this.securitiesCategoryFrom.controls.SecuritiesTypeGroup.value) {
      this.securitiesCategoryFrom.controls.SecuritiesTypeGroup.setValue(this.securitiesCategoryFrom.controls.SecuritiesTypeGroup.value.trim());
    }
    if (this.securitiesCategoryFrom.controls.RunningType.value) {
      this.securitiesCategoryFrom.controls.RunningType.setValue(this.securitiesCategoryFrom.controls.RunningType.value.trim());
    }
    if (this.securitiesCategoryFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    if (this.getSecuritiesAttribute.value.length === 0) {
      this.as.warning('', 'Message.STD00012', ['Label.LOMT01.Attribute']);
      return;
    }
    if (this.securitiesCategoryFrom.controls.CategoryId.value == null) {
      this.lomt01Service.checkSecuritiesAttributeDup(this.securitiesCategoryFrom.controls.CategoryNameTha.value, null).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe((res: any) => {
          if (res == 0) {
            this.onSave();
          } else {
            this.as.error('', 'Label.LOMT01.Message.SecuritiesTypes');
          }
        });
    } else {
      this.lomt01Service.checkSecuritiesAttributeDup(this.securitiesCategoryFrom.controls.CategoryNameTha.value, this.securitiesCategoryFrom.controls.CategoryId.value).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe((res: any) => {
          if (res == 0) {
            this.onSave();
          }
          else {
            this.as.error('', 'Label.LOMT01.Message.SecuritiesTypes');
          }
        });
    }
  }

  onSave() {
    if (this.checkSeqDup()) {
      this.as.error('', 'Label.LOMT01.Message.OrderOfTopic');
      return;
    }

    this.saving = true;
    this.prepareSave(this.securitiesCategoryFrom.getRawValue());
    this.lomt01Service.saveSecuritiesCategory(this.securitiesCategory).pipe(
      switchMap((id) => this.lomt01Service.getSecuritiesCategoryDetail(this.securitiesCategory.CategoryId || id)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: SecuritiesCategory) => {
        if (res) {
          this.securitiesCategory = res;
          this.rebuildForm();
          this.as.success("", "Message.STD00006");
        }
      });
  }

  generateRunningNoFormat() {
    let txtRunningNoFormatDisplay = null
      , RunningType = null
      , CompanyCode = "{Company}"
      , FormatYear = null
      , FormatMonth = null
      , txtRunning = null
      , RunningNoFormat = null
      , txtRunningNoFormat = null;

    if (this.securitiesCategoryFrom.controls.RunningType.value) {
      RunningType = "{" + this.securitiesCategoryFrom.controls.RunningType.value + "}";
    } else RunningType = "";

    if (this.securitiesCategoryFrom.controls.FormatYear.value != "0") {
      FormatYear = this.securitiesCategoryFrom.controls.FormatYear.value;
    } else FormatYear = "";

    if (this.securitiesCategoryFrom.controls.FormatMonth.value != "0") {
      FormatMonth = this.securitiesCategoryFrom.controls.FormatMonth.value;
    } else FormatMonth = "";

    if (this.securitiesCategoryFrom.controls.RunningNoDigit.value) {
      txtRunning = "RUNNING";
    } else txtRunning = "";

    txtRunningNoFormatDisplay = RunningType + CompanyCode + FormatYear + FormatMonth + txtRunning;
    this.securitiesCategoryFrom.controls.RunningNoFormatForDisplay.patchValue(txtRunningNoFormatDisplay, { emitEvent: false })

    var regax = /\{{1,}\w*\}/gi;
    var formats = txtRunningNoFormatDisplay.match(regax);
    var regax1 = /\w+/gi;
    let format = [];
    if (formats) {
      for (let i = 0; i < formats.length; i++) {
        format.push(formats[i].replace(regax1, i))
      }
      RunningNoFormat = format.join("");
    }
    txtRunningNoFormat = (RunningNoFormat == null ? "" : RunningNoFormat).concat(txtRunning);
    this.securitiesCategoryFrom.controls.RunningNoFormat.patchValue(txtRunningNoFormat, { emitEvent: false })
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.securitiesCategoryFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/lo/lomt01'], { skipLocationChange: true });
  }
}
