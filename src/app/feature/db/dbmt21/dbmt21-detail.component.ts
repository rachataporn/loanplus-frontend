import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, RowState, SelectFilterService } from '@app/shared';
import { Observable, of, throwError } from 'rxjs';
import { finalize, switchMap, isEmpty } from 'rxjs/operators';
import { DbDepartmentNew, Dbmt21Service, DbDepartmentCompany } from './dbmt21.service'

@Component({
  templateUrl: './dbmt21-detail.component.html'
})
export class Dbmt21DetailComponent implements OnInit {
  DepartmentDetail: DbDepartmentNew = {} as DbDepartmentNew;
  DepartmentForm: FormGroup;
  ProfileForm: FormGroup;
  PermissionForm: FormGroup;
  submitted: boolean;
  focusToggle: boolean;
  saving: boolean;
  countCh: number;
  master: {
    CompanyList: any[]
    ParentList: any[]
  };
  parentList = [];
  companyList = [];
  Deleting = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private modal: ModalService,
    private filter: SelectFilterService,
    private dbmt21: Dbmt21Service,
    public lang: LangService,
  ) { this.createForm() }

  createForm() {
    this.DepartmentForm = this.fb.group({
      DepartmentId: null,
      DepartmentCode: [null, Validators.required],
      DepartmentNameTha: [null, Validators.required],
      DepartmentNameEng: null,
      DepartmentParent: null,
      Active: true,
      DepartmentAbbreviation: [null, Validators.required],
      DbDepartmentCompany: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
    })
    this.route.data.subscribe((data) => {
      this.master = data.dbmt21.master;
      this.DepartmentDetail = data.dbmt21.DepartmentDetail;
      this.parentList = this.master.ParentList;
      this.companyList = this.master.CompanyList;
    });
    this.rebuildForm();
  }

  rebuildForm() {
    this.DepartmentForm.markAsPristine();
    this.DepartmentForm.patchValue(this.DepartmentDetail);

    if (this.DepartmentDetail.DepartmentCode) {
      this.DepartmentForm.controls.DepartmentCode.disable({ emitEvent: false });
      this.DepartmentForm.setControl('DbDepartmentCompany', this.fb.array(
        this.DepartmentDetail.DbDepartmentCompany.map((detail) => this.createDbDepartmentCompanyForm(detail))
      ));
      this.DepartmentForm.controls.DbDepartmentCompany.disable({ emitEvent: false });
    }

  }

  get getDbDepartmentCompany(): FormArray {
    return this.DepartmentForm.get('DbDepartmentCompany') as FormArray;
  }

  createDbDepartmentCompanyForm(item: DbDepartmentCompany): FormGroup {
    let fg = this.fb.group({
      guid: Math.random(),
      CompanyCode: [null, Validators.required],
      DepartmentCode: null,
      RowVersion: null,
      RowState: RowState.Add,
    });

    fg.patchValue(item, { emitEvent: false });

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )

    return fg;
  }

  addDbDepartmentCompanyRow() {
    this.getDbDepartmentCompany.push(this.createDbDepartmentCompanyForm({} as DbDepartmentCompany));
    this.getDbDepartmentCompany.markAsDirty();
  }

  removeDbDepartmentCompanyRow(index) {
    let detail = this.getDbDepartmentCompany.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      detail.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
      this.Deleting.push(detail.getRawValue());
    }

    let rows = [...this.getDbDepartmentCompany.value];
    rows.splice(index, 1);

    this.getDbDepartmentCompany.patchValue(rows, { emitEvent: false });
    this.getDbDepartmentCompany.removeAt(index);
    this.getDbDepartmentCompany.markAsDirty();
  }

  prepareSave(DepartmentForm) {
    Object.assign(this.DepartmentDetail, DepartmentForm);
    const permissions = this.getDbDepartmentCompany.getRawValue();
    const permissionAdding = permissions.filter(function (item) {
      return item.RowState === RowState.Add;
    });

    this.DepartmentDetail.DbDepartmentCompany.map(label => {
      return Object.assign(label, permissions.filter(item => item.RowState === RowState.Edit).find((item) => {
        return label.CompanyCode == item.CompanyCode
      }));
    });

    this.DepartmentDetail.DbDepartmentCompany = this.DepartmentDetail.DbDepartmentCompany.concat(this.Deleting);
    this.DepartmentDetail.DbDepartmentCompany = this.DepartmentDetail.DbDepartmentCompany.filter(item => item.RowState !== RowState.Add).concat(permissionAdding);

    this.Deleting = [];
  }

  validateDbDepartmentCompany() {
    const seen = new Set();
    const hasDuplicates = this.getDbDepartmentCompany.getRawValue().some(function (item) {
      return item.CompanyCode !== null && seen.size === seen.add(item.CompanyCode.toLowerCase()).size;
    });
    return hasDuplicates;
  }

  onSubmit() {
    this.submitted = true;

    this.submitted = true;
    if (this.DepartmentForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.getDbDepartmentCompany.getRawValue().length <= 0) {
      this.as.warning('', 'ต้องเลือกบริษัทอย่างน้อย 1 บริษัท');
      return;
    }

    this.saving = true;
    this.prepareSave(this.DepartmentForm.getRawValue());
    this.dbmt21.saveDepartment(this.DepartmentDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: DbDepartmentNew) => {
          this.DepartmentDetail = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        }
      );
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.DepartmentForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/db/dbmt21'], { skipLocationChange: true });
  }
}


