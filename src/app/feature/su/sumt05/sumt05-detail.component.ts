import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page, Size } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Sumt05ModalComponent } from './sumt05-modal.component';
import { Sumt05Service, SuProfileDTO, MenuProfile } from './sumt05.service';

@Component({
  templateUrl: './sumt05-detail.component.html'
})
export class Sumt05DetailComponent implements OnInit {

  SuProfileDTO: SuProfileDTO = {} as SuProfileDTO;
  deleting: MenuProfile[] = [];
  profileForm: FormGroup;
  saving: Boolean;
  submitted: Boolean;
  focusToggle: boolean;
  RowVersion: String;
  page = new Page();
  checkMenuList = [];
  count = 0;
  statusSave: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Sumt05Service,
    private saveData: SaveDataService,
    private modal: ModalService,
    public lang: LangService
  ) {
    this.createForm();
  }

  createForm() {
    this.profileForm = this.fb.group({
      ProfileCode: [null, Validators.required],
      ProfileDesc: [null, Validators.required],
      Active: true,
      MenuProfileForm: this.fb.array([]),
    });
  }

  createDetailForm(item: MenuProfile): FormGroup {
    const fg = this.fb.group({
      ProfileCode: null,
      MenuCode: null,
      MenuNameTha: null,
      MenuNameEng: null,
      RowVersion: null,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });
    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState !== RowState.Add) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    );
    return fg;
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.SuProfileDTO = data.sumt05.detail;
      this.rebuildForm();
      if (data.sumt05.detail.ProfileCode) {
        this.statusSave = false;
      }
    });
  }

  rebuildForm() {
    this.profileForm.markAsPristine();
    this.profileForm.patchValue(this.SuProfileDTO);
    if (this.SuProfileDTO.ProfileCode) {
      this.profileForm.setControl('MenuProfileForm', this.fb.array([]));
      this.profileForm.controls['ProfileCode'].disable({ emitEvent: false });
      setTimeout(() => {
        this.profileForm.setControl('MenuProfileForm', this.fb.array(
          this.SuProfileDTO.MenuProfile.map((detail) => this.createDetailForm(detail))));
      });
    }
  }


  get getDetails(): FormArray {
    return this.profileForm.get('MenuProfileForm') as FormArray;
  }

  addRow() {
    this.getDetails.markAsDirty();
    const data = {
      ProfileCode: this.profileForm.controls['ProfileCode'].value
    };
    this.modal.openComponent(Sumt05ModalComponent, Size.large, data).subscribe(
      (result) => {
        if (result.length > 0) {
          for (const item of result) {
            if (!this.checkDuplicateMenu(item)) {
              this.getDetails.push(
                this.createDetailForm(
                  item as MenuProfile
                )
              );
              this.count += result.length;
            }
          }
        }
      });
  }

  checkDuplicateMenu(result) {
    for (const form of this.getDetails.value) {
      if (form.MenuCode === result.MenuCode) {
        return true;
      }
    }
  }

  checkDuplicate(form) {
    for (const MenuCode of this.checkMenuList) {
      if (form.MenuCode === MenuCode.MenuCode) {
        this.as.error('', 'รหัสเมนูมีค่าซ้ำ');

        return true;
      }
    }
  }

  removeRow(index) {
    const detail = this.getDetails.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      detail.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
      this.deleting.push(detail.value);
    }

    const rows = [...this.getDetails.value];
    rows.splice(index, 1);

    this.getDetails.patchValue(rows, { emitEvent: false });
    this.getDetails.removeAt(this.getDetails.length - 1);
    this.getDetails.markAsDirty();
  }


  prepareSave(values) {
    Object.assign(this.SuProfileDTO, values);
    if (this.SuProfileDTO.MenuProfile != undefined) {
      const beforeAddPayName = this.SuProfileDTO.MenuProfile.filter((item) => {
        return item.RowState !== RowState.Add;
      });
      this.SuProfileDTO.MenuProfile = beforeAddPayName;
    }
    if (this.SuProfileDTO.MenuProfile) {
      this.SuProfileDTO.MenuProfile.map(detail => {
        return Object.assign(detail, values.MenuProfileForm.concat(this.deleting).find((o) => {
          return o.MenuCode === detail.MenuCode && o.RowState !== RowState.Add;
        }));
      });
      this.add(values);
    } else {
      this.SuProfileDTO.MenuProfile = [];
      this.add(values);
    }
  }

  add(values) {
    const adding = values.MenuProfileForm.filter((item) => {
      return item.RowState === RowState.Add;
    });
    this.SuProfileDTO.MenuProfile = this.SuProfileDTO.MenuProfile.concat(adding);
    this.deleting = [];
  }


  onSubmit() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    if (this.profileForm.controls.ProfileCode.value) {
      this.profileForm.controls.ProfileCode.setValue(this.profileForm.controls.ProfileCode.value.trim());
    }

    this.prepareSave(this.profileForm.getRawValue());
    if (this.statusSave) {
      this.js.CheckDuplicate2(this.SuProfileDTO).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe(
          (res) => {
            if (res) {
              this.onSave();
            } else {
              this.as.error('', 'ข้อมูลรหัสกลุ่มสิทธิ์ มีค่าซ้ำ');
            }
          }
        );
    } else {
      this.onSave();
    }
  }

  onSave() {
    if (this.profileForm.value.MenuProfileForm.length === 0) {
      this.as.error('', 'Message.STD00012', ['Label.SUMT05.MenuCode']);
      return;
    } else {
      for (const menu of this.profileForm.value.MenuProfileForm) {
        if (this.checkMenuList.length > 0) {
          if (this.checkDuplicate(menu)) {
            this.checkMenuList = [];
            this.as.error('', 'Message.STD00004', ['Label.SUMT05.MenuCode']);
            return;
          } else {
            this.checkMenuList.push(menu);
          }
        } else {
          this.checkMenuList.push(menu);
        }
      }
    }
    this.js.saveProfile(this.SuProfileDTO).pipe(
      switchMap(() => this.js.getProfileDetail(this.SuProfileDTO.ProfileCode, this.lang.CURRENT)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
        this.statusSave = false;
        this.profileForm.enable({ emitEvent: false });
        if (this.SuProfileDTO.CreatedProgram) {
          this.profileForm.controls['ProfileCode'].disable({ emitEvent: false });
        }
        this.checkMenuList = [];
      }))
      .subscribe(
        (res: SuProfileDTO) => {
          if (res) {
            this.SuProfileDTO = res || {} as SuProfileDTO;
            this.profileForm.enable();
            this.rebuildForm();
            this.as.success('', 'Message.STD00006');
          }
        });
  }


  canDeactivate(): Observable<boolean> | boolean {
    if (!this.profileForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back(flagSearch) {
    this.router.navigate(['/su/sumt05', { flagSearch: flagSearch }], { skipLocationChange: true });
  }
}
