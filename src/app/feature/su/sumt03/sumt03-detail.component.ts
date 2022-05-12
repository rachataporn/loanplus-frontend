import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { Page, ModalService, RowState } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { ProgramLabel, Program, Sumt03Service } from './sumt03.service';

@Component({
  templateUrl: './sumt03-detail.component.html'
})
export class Sumt03DetailComponent implements OnInit {
  program: Program = {} as Program;
  programForm: FormGroup;
  langCodeList = [];
  langCode = 'TH';
  langData: any[];
  systemCodeList = [];
  submitted: boolean;
  focusToggle: boolean;
  saving: boolean;
  page = new Page();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private modal: ModalService,
    public lang: LangService,
    private sumt03: Sumt03Service
  ) { this.createForm(); }

  createForm() {
    this.programForm = this.fb.group({
      ProgramCode: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      ProgramName: [null],
      ProgramPath: [null, [Validators.required, Validators.pattern(/\S+/)]],
      ApiFileName: [null],
      ProgramLabelForm: this.fb.array([])
    });
  }

  createDetailForm(item: ProgramLabel): FormGroup {
    const fg = this.fb.group({
      guid: Math.random().toString(), // important for tracking change
      SystemCode: 'Pico',
      ProgramCode: [null],
      FieldName: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      LangCode: [this.langCode],
      LabelName: [null],
      RowVersion: null,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });
    if (item.RowVersion) {
      fg.controls.SystemCode.disable();
      fg.controls.ProgramCode.disable();
      fg.controls.FieldName.disable();
      fg.controls.LangCode.disable();
    }
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
    this.getLang();
    this.route.data.subscribe((data) => {
      this.langCodeList = data.sumt03.master.Lang;
      this.systemCodeList = data.sumt03.master.System;
      this.program = data.sumt03.detail;
      this.rebuildForm();
    });
  }

  getLang(reset?: boolean) {
    this.sumt03.getLang(this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.langData = res.Rows;
          this.page.totalElements = res.Total;
        }, (error) => {
          console.log(error);
        });
  }

  changeLang(langCode: string) {
    this.langCode = langCode;
    this.programForm.controls.ProgramLabelForm = this.fb.array([]);
    if (this.program.RowVersion) {
      this.sumt03.getProgramDetail(this.program.ProgramCode, this.langCode).subscribe((res: Program) => {
        this.program = res;
        this.rebuildForm();
      });
    }
  }

  onTableEvent(event) {
    this.getLang();
  }

  copy() {
    this.submitted = true;
    if (this.programForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.getProgramLabel.value.length === 0) {
      this.as.warning('', 'Message.STD00012', ['Label.SUMT03.ProgramLabel']);
      return;
    }
    if (this.validateProgramLabel()) {
      this.as.error('', 'Message.STD00004', ['Label.SUMT03.FieldName']);
      return;
    }

        this.saving = true;
        this.prepareSave(this.programForm.getRawValue());
        this.sumt03.saveProgram(this.program).pipe(
          switchMap(() => this.sumt03.copyProgramLabel(this.program)),
          switchMap(() => this.sumt03.getProgramDetail(this.program.ProgramCode, this.langCode)),
          finalize(() => {
            this.saving = false;
            this.submitted = false;
          }))
          .subscribe((res: Program) => {
            this.program = res;
            this.rebuildForm();
            this.as.success('', 'Message.STD00006');
          });
    
  }

  rebuildForm() {
    this.programForm.markAsPristine();
    this.programForm.patchValue(this.program);
    if (this.program.RowVersion) {
      this.programForm.setControl('ProgramLabelForm',
        this.fb.array(this.program.ProgramLabels.map((detail) => this.createDetailForm(detail))));
      this.programForm.controls.ProgramCode.disable();
    }
  }

  get getProgramLabel(): FormArray {
    return this.programForm.get('ProgramLabelForm') as FormArray;
  }

  addRow() {
    this.getProgramLabel.push(this.createDetailForm({} as ProgramLabel));
    this.getProgramLabel.markAsDirty();
  }

  removeRow(index) {

    const detail = this.getProgramLabel.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      // เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
      const deleting = this.program.ProgramLabels.find(item =>
        item.SystemCode === detail.controls.SystemCode.value
        && item.ProgramCode === detail.controls.ProgramCode.value
        && item.FieldName === detail.controls.FieldName.value
        && item.LangCode === detail.controls.LangCode.value
      );
      deleting.RowState = RowState.Delete;
    }

    // --ลบข้อมูลrecordนี้ออกจาก formarray
    this.getProgramLabel.removeAt(index);
    this.getProgramLabel.markAsDirty();
    // ---------------------------------
  }
  validateProgramLabel() {
    const seen = new Set();
    const hasDuplicates = this.getProgramLabel.getRawValue().some(function (item) {
      return seen.size === seen.add(item.FieldName.toLowerCase() + item.LangCode.toLowerCase()).size;
    });
    return hasDuplicates;
  }
  prepareSave(values: Object) {
    Object.assign(this.program, values);
    const programLabels = this.getProgramLabel.getRawValue();
    // add
    const adding = programLabels.filter(function (item) {
      return item.RowState === RowState.Add;
    });
    // edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.program.ProgramLabels.map(label => {
      return Object.assign(label, programLabels.filter(item => item.RowState === RowState.Edit).find((item) => {
        return label.SystemCode === item.SystemCode
          && label.ProgramCode === item.ProgramCode
          && label.FieldName === item.FieldName
          && label.LangCode === item.LangCode;
      }));
    });
    // เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.program.ProgramLabels = this.program.ProgramLabels.filter(item => item.RowState !== RowState.Add).concat(adding);
  }

  onSubmit() {
    this.submitted = true;
    if (this.programForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.getProgramLabel.value.length === 0) {
      this.as.warning('', 'Message.STD00012', ['Label.SUMT03.ProgramLabel']);
      return;
    }
    if (this.validateProgramLabel()) {
      this.as.error('', 'Message.STD00004', ['Label.SUMT03.FieldName']);
      return;
    }
    this.saving = true;
    this.prepareSave(this.programForm.getRawValue());
    this.sumt03.saveProgram(this.program).pipe(
      switchMap(() => this.sumt03.getProgramDetail(this.program.ProgramCode, this.langCode)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: Program) => {
        this.program = res;
        this.rebuildForm();
        this.as.success('', 'Message.STD00006');
      });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.programForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/su/sumt03'], { skipLocationChange: true });
  }

  get ProgramCode() {
    return this.programForm.controls.ProgramCode;
  }

  get ProgramPath() {
    return this.programForm.controls.ProgramPath;
  }
}


