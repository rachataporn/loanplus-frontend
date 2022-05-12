import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, RowState, SelectFilterService } from '@app/shared';
import { Observable, of, throwError } from 'rxjs';
import { finalize, switchMap, isEmpty } from 'rxjs/operators';
import { User, Sumt07Service, Profile, Permission } from './sumt07.service'

@Component({
  templateUrl: './sumt07-detail.component.html'
})
export class Sumt07DetailComponent implements OnInit {
  UserDetail: User = {} as User;

  password = "AUTO";
  UserForm: FormGroup;
  ProfileForm: FormGroup;
  PermissionForm: FormGroup;


  submitted: boolean;
  focusToggle: boolean;
  saving: boolean;
  countCh: number;
  master: {
    EmployeeList: any[]
    PasswordList: any[]
    LangList: any[]
    ProfileList: any[]
    PermissionList: any[]
  };
  employeeList = [];
  passwordList = []
  langList = []
  profileList = []
  permissionList: { [index: string]: any[] } = {};
  passwordExpireDate;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private modal: ModalService,
    private filter: SelectFilterService,
    private sumt07: Sumt07Service,
    public lang: LangService,
  ) { this.createForm() }

  createForm() {
    this.UserForm = this.fb.group({
      UserName: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9@_\.]+$/)]],
      EmployeeCode: [null, Validators.required],
      FirstName: null,
      LastName: null,
      PasswordPolicyCode: [null, Validators.required],
      DefaultLang: [null, Validators.required],
      Active: true,
      LockoutEnabled: true,
      ForceChangePassword: false,
      StartEffectiveDate: [null, Validators.required],
      EndEffectiveDate: null,
      Profile: this.fb.array([]),
      Permission: this.fb.array([]),
      PasswordExpireDate: null,
      FailTime: null
    });
    this.UserForm.controls.PasswordPolicyCode.valueChanges.subscribe(code => {
      const policy = this.master.PasswordList.find(item => {
        return item.Value == code
      }) || {};
      if (code && this.UserDetail.LastChangePassword != null && policy.PasswordAge) {
        this.passwordExpireDate = this.addDays(this.UserDetail.LastChangePassword, policy.PasswordAge);
      }
      else this.passwordExpireDate = null

      this.UserForm.controls.PasswordExpireDate.setValue(this.passwordExpireDate);
      this.UserForm.controls.FailTime.setValue(policy.FailTime);
    })
  }
  private addDays(date: Date, days: number): Date {
    let clone = new Date(date.valueOf())
    clone.setDate(clone.getDate() + days);
    return clone;
  }


  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    })
    this.route.data.subscribe((data) => {
      this.UserDetail = data.sumt07.userDetail;
      this.master = data.sumt07.master;
      this.rebuildForm();
    });
  }

  bindDropDownList() {
    this.filter.SortByLang(this.master.EmployeeList);
    this.filter.SortByLang(this.master.PermissionList);
    this.employeeList = [...this.master.EmployeeList.filter(employee => this.UserDetail.Id ? true : employee.UserId == null)
      .map(em => {
        em.disabled = (this.UserDetail.Id ? (this.UserDetail.EmployeeCode != em.Value && !em.Active) : !em.Active)
        return em;
      })];
    this.passwordList = [...this.master.PasswordList.map(ps => {
      ps.disabled = (this.UserDetail.Id ? (this.UserDetail.PasswordPolicyCode != ps.Value && !ps.Active) : !ps.Active)
      return ps;
    })];
    this.langList = [...this.master.LangList];
    this.profileList = [...this.master.ProfileList];
    //this.permissionList = [...this.master.PermissionList];
    return;
  }

  rebuildForm() {
    this.UserForm.markAsPristine();
    this.bindDropDownList();
    this.UserForm.patchValue(this.UserDetail);
    this.UserForm.controls.UserName.enable();
    this.UserForm.controls.EmployeeCode.enable();
    if (this.UserDetail.Id) {
      this.UserForm.controls.UserName.disable();
      this.UserForm.controls.EmployeeCode.disable();
      this.UserForm.setControl('Profile', this.fb.array(
        this.UserDetail.Profiles.map((detail) => this.createProfileForm(detail))
      ));
      this.UserForm.setControl('Permission', this.fb.array(
        this.UserDetail.Permissions.map((detail) => this.createPermissionForm(detail))
      ));
    }
  }
  get UserName() {
    return this.UserForm.controls.UserName;
  }

  get getProfile(): FormArray {
    return this.UserForm.get('Profile') as FormArray;
  }
  get getPermission(): FormArray {
    return this.UserForm.get('Permission') as FormArray;
  }

  createProfileForm(item: Profile): FormGroup {
    let fg = this.fb.group({
      guid: Math.random(),
      Id: 0,
      ProfileCode: [null, Validators.required],
      RowVersion: null,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });
    if (item.ProfileCode) {
      fg.controls.ProfileCode.disable();
    }
    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )
    return fg;
  }

  createPermissionForm(item: Permission): FormGroup {
    const guid = Math.random().toString();
    this.permissionList[guid] = this.master.PermissionList.map(com => {
      com.disabled = (item.Id ? (item.CompanyCode != com.Value && !com.Active) : !com.Active)
      return com;
    })
    let fg = this.fb.group({
      guid: guid,
      Id: 0,
      CompanyCode: [null, Validators.required],
      IsDefault: false,
      RowVersion: null,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });
    if (item.CompanyCode) {
      fg.controls.CompanyCode.disable();
    }
    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )
    
    fg.controls.IsDefault.valueChanges.subscribe(
      (val) => {
        if (val) {
          this.getPermission.controls.forEach(
            control => {
              var a = control as FormGroup;
              a.controls.IsDefault.setValue(null, { emitEvent: false });
              if (a.controls.RowState.value != RowState.Add && a.controls.RowState.value != RowState.Delete) {
                a.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
              }
            }
          )
          fg.controls.IsDefault.setValue(true, { emitEvent: false })
        }
      })
    return fg;
  }

  addProfileRow() {
    this.getProfile.push(this.createProfileForm({} as Profile));
    this.getProfile.markAsDirty();
  }


  removeProfileRow(index) {
    let detail = this.getProfile.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      const deleting = this.UserDetail.Profiles.find(item =>
        item.ProfileCode === detail.controls.ProfileCode.value
      );
      deleting.RowState = RowState.Delete;
    }

    this.getProfile.removeAt(index);
    this.getProfile.markAsDirty();
  }

  addPermissionRow() {
    this.getPermission.push(this.createPermissionForm({} as Permission));
    this.getPermission.markAsDirty();
  }

  removePermissionRow(index) {
    let detail = this.getPermission.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      const deleting = this.UserDetail.Permissions.find(item =>
        item.CompanyCode === detail.controls.CompanyCode.value
      );
      deleting.RowState = RowState.Delete;
    }
    this.getPermission.removeAt(index);
    this.getPermission.markAsDirty();
  }

  prepareSave(UserForm, ProfileForm, PermissionForm) {
    Object.assign(this.UserDetail, UserForm);

    const profiles = this.getProfile.getRawValue();
    const profileAdding = profiles.filter(function (item) {
      return item.RowState === RowState.Add;
    });

    this.UserDetail.Profiles.map(label => {
      return Object.assign(label, profiles.filter(item => item.RowState === RowState.Edit).find((item) => {
        return label.Id === item.Id && label.ProfileCode == item.ProfileCode
      }));
    });
    this.UserDetail.Profiles = this.UserDetail.Profiles.filter(item => item.RowState !== RowState.Add && item.RowState !== RowState.Normal).concat(profileAdding);

    const permissions = this.getPermission.getRawValue();
    const permissionAdding = permissions.filter(function (item) {
      return item.RowState === RowState.Add;
    });

    this.UserDetail.Permissions.map(label => {
      return Object.assign(label, permissions.filter(item => item.RowState === RowState.Edit).find((item) => {
        return label.Id === item.Id && label.CompanyCode == item.CompanyCode
      }));
    });
    this.UserDetail.Permissions = this.UserDetail.Permissions.filter(item => item.RowState !== RowState.Add && item.RowState !== RowState.Normal).concat(permissionAdding);
  }

  validateProfile() {
    const seen = new Set();
    const hasDuplicates = this.getProfile.getRawValue().some(function (item) {
      return item.ProfileCode !== null && seen.size === seen.add(item.ProfileCode.toLowerCase()).size;
    });
    return hasDuplicates;
  }
  validatePermission() {
    const seen = new Set();
    const hasDuplicates = this.getPermission.getRawValue().some(function (item) {
      return item.CompanyCode !== null && seen.size === seen.add(item.CompanyCode.toLowerCase()).size;
    });
    return hasDuplicates;
  }
  validatePermissionIsDefault() {
    const hasIsDefault = this.getPermission.getRawValue().some(function (item) {
      return item.IsDefault == true;
    });
    return hasIsDefault;
  }
  onSubmit() {
    this.submitted = true;
    let error: boolean = false;
    if (this.UserForm.invalid) {
      this.focusToggle = !this.focusToggle;
      this.saving = false;
      this.as.warning('', 'Message.SU00032');
      error = true;
    }
    if (this.getProfile.length === 0) {
      this.as.warning('', 'Message.STD00012', ['Label.SUMT07.Profile']);
      error = true;
    }
    if (this.getPermission.length === 0) {
      this.as.warning('', 'Message.STD00012', ['Label.SUMT07.Permission']);
      error = true;
    }

    if (this.getProfile.length && this.getProfile.invalid) {
      this.as.warning('', 'Message.SU00033');
      error = true;
    }
    if (this.getProfile.length && this.validateProfile()) {
      this.as.error('', 'Message.STD00004', ['Label.SUMT07.Profile']);
      error = true;
    }

    if (this.getPermission.length && this.getPermission.invalid) {
      this.as.warning('', 'Message.SU00034');
      error = true;
    }
    if (this.getPermission.length && this.validatePermission()) {
      this.as.error('', 'Message.STD00004', ['Label.SUMT07.Permission']);
      error = true;
    }
    if (this.getPermission.length && !this.validatePermissionIsDefault()) {
      this.as.warning('', 'Message.STD00023', ['Label.SUMT07.IsDefualt']);
      error = true;
    }
    if (error) return;
    this.saving = true;
    this.prepareSave(this.UserForm.value, this.getProfile.getRawValue(), this.getPermission.getRawValue());
    this.sumt07.saveUser(this.UserDetail).pipe(
      switchMap(id => this.sumt07.getUser(this.UserDetail.Id ? this.UserDetail.Id : id)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: User) => {
          this.UserDetail = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        }
      );

  }

  forget() {
    this.sumt07.getEmployee(this.UserDetail.Id).subscribe(email => {
      if (email) {
        this.sumt07.forgetPassword(email).subscribe(() => {
          this.as.success("", "Message.SU00019");
        })
      }
      else this.as.warning('', 'Message.SU00036');
    })
  }
  canDeactivate(): Observable<boolean> | boolean {
    if (!this.UserForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/su/sumt07'], { skipLocationChange: true });
  }
}


