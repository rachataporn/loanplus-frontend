import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@app/core';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Sumt04Service, Menu, MenuLabel } from './sumt04.service'
import { ModalService, RowState } from '@app/shared';


@Component({
  templateUrl: './sumt04-detail.component.html'
})
export class Sumt04DetailComponent implements OnInit {
  Menu: Menu = {} as Menu;
  MenuForm: FormGroup;
  submitted: boolean;
  MenuName: string;
  SystemList: [];
  LangList: [];
  ProgramList: [];
  MainMenuList: [];
  LangCode: string;
  focusToggle: boolean;
  firstCreate: string;
  saving: boolean;
  
  statusSave: boolean = true;

  systemCode: string = '';
  menuCode: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private modal: ModalService,
    private sumt04: Sumt04Service
  ) { this.createForm() }

  createForm() {
    this.MenuForm = this.fb.group({
      SystemCode: [null, Validators.required],
      MenuCode: [null, Validators.required],
      MenuName: null,
      MainMenu: null,
      ProgramCode: null,
      MenuLabelForm: this.fb.array([]),
      RowVersion: null,
      Icon: null,
      Active: true,
      CreatedProgram: null
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.Menu = data.sumt04.MenuDetail;
      this.Menu.SuMenuLabels = data.sumt04.MenuDetail.SuMenuLabels;
      this.SystemList = data.sumt04.master.System;
      this.LangList = data.sumt04.master.Lang;
      this.MainMenuList = data.sumt04.master.MainMenu;
      this.ProgramList = data.sumt04.master.Program;
      if (data.sumt04.MenuDetail.MenuCode) {
        this.statusSave = false;
      }

    });
    this.rebuildForm();
  }

  
  createDetailForm(item: MenuLabel): FormGroup {
    let fg = this.fb.group({
      guid: Math.random().toString(),
      SystemCode: null,
      MenuCode: null,
      MenuName: null,
      LangCode: [null, Validators.required],
      RowVersion: null,
      RowState: RowState.Add
    });

    fg.patchValue(item, { emitEvent: false });

    fg.controls.SystemCode.setValue(this.MenuForm.controls.SystemCode.value);
    fg.controls.MenuCode.setValue(this.MenuForm.controls.MenuCode.value);

    if (item.RowVersion) {
      fg.controls.LangCode.disable();

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

  rebuildForm() {
    this.MenuForm.markAsPristine();
    this.MenuForm.patchValue(this.Menu);

    if (this.Menu.MenuCode, this.Menu.SystemCode) {
      this.MenuForm.controls.MenuCode.disable();
      this.MenuForm.controls.SystemCode.disable();
      this.firstCreate = this.Menu.RowVersion;

    }
    else {
      this.MenuForm.controls.MenuCode.enable();
      this.MenuForm.controls.SystemCode.enable();
      
    }
    if (this.Menu.SuMenuLabels) {
      this.MenuForm.setControl('MenuLabelForm', this.fb.array(this.Menu.SuMenuLabels.map((detail) => this.createDetailForm(detail))));

    }

  }

  get getMenuLabel(): FormArray {
    return this.MenuForm.get('MenuLabelForm') as FormArray;
  };

  addRow() {
    this.systemCode = this.MenuForm.controls.SystemCode.value;
    this.menuCode = this.MenuForm.controls.MenuCode.value;
    this.getMenuLabel.push(this.createDetailForm({} as MenuLabel));
    this.getMenuLabel.markAsDirty();
  }

  removeRow(index) {

    const detail = this.getMenuLabel.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      const deleting = this.Menu.SuMenuLabels.find(item =>
        item.SystemCode === detail.controls.SystemCode.value
        && item.LangCode === detail.controls.LangCode.value
        && item.MenuCode == detail.controls.MenuCode.value

      );
      deleting.RowState = RowState.Delete;
    }
    this.getMenuLabel.removeAt(index);
    this.getMenuLabel.markAsDirty();

  }

  prepareSave(values: Object) {

    Object.assign(this.Menu, values);
    const SuMenuLabels = this.getMenuLabel.getRawValue();
    const adding = SuMenuLabels.filter(function (item) {
      return item.RowState == RowState.Add;
    });
    if (!this.firstCreate) {
      this.Menu.SuMenuLabels = adding;
    }

    this.Menu.SuMenuLabels.map(label => {
      return Object.assign(label, SuMenuLabels.filter(item => item.RowState === RowState.Edit).find((item) => {
        return label.LangCode == item.LangCode
          && label.MenuCode == item.MenuCode
        

      }));
    });

    this.Menu.SuMenuLabels = this.Menu.SuMenuLabels.filter(
      item => item.RowState !== RowState.Add).concat(adding);

  }


  canDeactivate(): Observable<boolean> | boolean {
    if (!this.MenuForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }



  validateMenuLabel() {
    let seen = new Set();
    var hasDuplicates = this.getMenuLabel.getRawValue().some(function (item) {
      return seen.size === seen.add(item.MenuCode).size;
    });
    return hasDuplicates;
  }

  onSubmit() {
    this.submitted = true;
    this.MenuForm.controls.MenuCode.setValue(this.MenuForm.controls.MenuCode.value != null ? this.MenuForm.controls.MenuCode.value.trim() : null, { eventEmit: false });
    if (this.MenuForm.invalid) {
      this.submitted = true;
      this.focusToggle = !this.focusToggle;
      return;
    }
    if (this.getMenuLabel.value.length === 0) {
      this.as.warning('', 'Message.STD00012', ['Label.SUMT04.MenuName']);
      return;
    }

    this.prepareSave(this.MenuForm.getRawValue());
    if (!this.Menu.RowVersion) {
      this.sumt04.CheckDuplicate(this.Menu).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe(
          (res) => {
            if (res) {
              this.onSave();
            } else {
              this.as.error('', 'ข้อมูลซ้ำ');
            }
          }
        );
    } else {
      this.onSave();
    }
  }

  onSave() {
    this.sumt04.saveMenu(this.Menu).pipe(
      switchMap(() => this.sumt04.getMenuDetail(this.Menu.MenuCode)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: Menu) => {
          this.Menu = res;

          this.rebuildForm();
          this.as.success(' ', 'Message.STD00006');
        }
      );
  }

  back() {
    this.router.navigate(['/su/sumt04'], { skipLocationChange: true });
  }

}


