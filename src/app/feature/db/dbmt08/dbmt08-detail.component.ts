
import { Component, OnInit } from '@angular/core';
import { AlertService, SaveDataService, LangService } from '@app/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService, Page, SelectFilterService } from '@app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Prefix, Dbmt08Service } from './dbmt08.service';

@Component({
  templateUrl: './dbmt08-detail.component.html'
})
export class Dbmt08DetailComponent implements OnInit {
  prefix: Prefix = {} as Prefix;
  master: { System: any[] };
  system = [];
  prefixForm: FormGroup;
  submitted = false;
  saving = false;
  focusToggle = false;
  data = '';
  page = new Page();
  statusPage: boolean;
  flagClose = '';
  constructor(
    private dbmt08Service: Dbmt08Service,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private filter: SelectFilterService
  ) { this.createForm() }
  createForm() {
    this.prefixForm = this.fb.group({
      PrefixNameTha: [null, Validators.required],
      PrefixNameEng: null,
      SuffixNameTha: null,
      SuffixNameEng: null,
      PersonalityType: [null, Validators.required],
      Description: null,
      Active: true

    });
  }
  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });
    this.route.data.subscribe((data) => {
      this.prefix = data.prefix.detail;
      this.system = data.prefix.master.System;
      this.rebuildForm();
    });
  }
  bindDropDownList() {
    this.filter.SortByLang(this.system);
    this.system = [... this.system];
  }
  rebuildForm() {
    this.prefixForm.markAsPristine();
    if (this.prefix.RowVersion) {
      this.prefixForm.patchValue(this.prefix);
      this.prefixForm.controls.PrefixNameTha.disable();
    }

  }
  prepareSave(values: Object) {
    Object.assign(this.prefix, values);
  }
  onSubmit() {
    this.submitted = true;
    if (this.prefixForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.saving = true;
    this.prepareSave(this.prefixForm.getRawValue());
    this.dbmt08Service.CheckSensitiveCase(this.prefix).pipe(
      finalize(() => { this.saving = false; })).subscribe((res) => {
        res ? this.as.warning('', 'คำนำหน้า มาค่าซ้ำ') : this.onSave();
      });
  }

  onSave() {
    this.saving = true;
    this.dbmt08Service.savePrefix(this.prefix).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: Prefix) => {
        if (res) {
          this.prefix = res;
          this.rebuildForm();
          this.as.success("", "Message.STD00006");
        }
      });
  }

  changePrefixName() {
    if (this.prefixForm.controls.PrefixNameTha.value) {
      this.prefixForm.controls.PrefixNameTha.setValue(this.prefixForm.controls.PrefixNameTha.value.trim(), { eventEmit: false });
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.prefixForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/db/dbmt08'], { skipLocationChange: true });
  }

}
