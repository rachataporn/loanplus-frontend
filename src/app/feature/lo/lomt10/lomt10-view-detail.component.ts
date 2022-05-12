import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { View, Lomt10Service } from './lomt10.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AlertService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from '@app/shared';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './lomt10-view-detail.component.html'
})

export class Lomt10ViewDetailComponent implements OnInit {
  view: View = {} as View;
  viewForm: FormGroup;
  submitted: boolean;
  focusToggle: boolean;
  saving: boolean;
  checkSeq: boolean = false;
  checkName: boolean = false;

  constructor(
    private fb: FormBuilder,
    private is: Lomt10Service,
    private as: AlertService,
    private router: Router,
    private modal: ModalService,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  createForm() {
    this.viewForm = this.fb.group({
      ViewId: null,
      TemplateViewId: null,
      ViewNameTha: [null, Validators.required],
      ViewNameEng: null,
      ViewSeq: [null, [Validators.required, Validators.min(1), Validators.max(999999999)]],
      Active: true,
    });

  }

  ngOnInit() {
    if (this.route.snapshot.params.templateViewID) {
      this.viewForm.controls['TemplateViewId'].setValue(this.route.snapshot.params.templateViewID);
    }
    this.route.data.subscribe((data) => {
      this.view = data.Lomt10.viewDetail;
      this.rebuildForm();
    });
  }

  get NumberValue() {
    return this.viewForm.controls.ViewSeq;
  }

  prepareSave(values: Object) {
    Object.assign(this.view, values);
  }

  onSave() {
    this.submitted = true;

    if (this.viewForm.invalid) {
      this.focusToggle != this.focusToggle;
      return;
    }
    this.viewForm.disable();
    this.prepareSave(this.viewForm.value);
    this.is.saveView(this.view).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
        this.viewForm.enable();
      }))
      .subscribe(
        (res: View) => {
          if (res) {
            this.view = res;
            this.rebuildForm();
            this.as.success("", "Message.STD00006");
          }
        });
  }


  onSubmit() {
    this.submitted = true;
    let valueTrim = this.viewForm.controls.ViewNameTha.value ? this.viewForm.controls.ViewNameTha.value.trim() : null;
    this.viewForm.controls.ViewNameTha.setValue(valueTrim);
    if (this.viewForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.viewForm.controls.ViewId.value == null) {
      this.is.checkDupViewName(this.viewForm.controls.ViewNameTha.value, null, this.viewForm.controls.TemplateViewId.value).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe((res: any) => {
          if (res == 0) {
            this.is.checkDupView(this.viewForm.controls.ViewSeq.value, null, this.viewForm.controls.TemplateViewId.value).pipe(
              finalize(() => {
                this.saving = false;
                this.submitted = false;
              }))
              .subscribe((res: any) => {
                if (res == 0) {
                  this.onSave();
                }
                else {
                  this.as.error('', 'Message.STD00004', ['Label.LOMT10.Ordinal']);
                }
              });
          }
          else {
            this.as.error('', 'Message.STD00004', ['Label.LOMT10.ViewThai']);
          }
        });
    } else {
      this.is.checkDupViewName(this.viewForm.controls.ViewNameTha.value, this.viewForm.controls.ViewId.value, this.viewForm.controls.TemplateViewId.value).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe((res: any) => {
          if (res == 0) {
            this.is.checkDupView(this.viewForm.controls.ViewSeq.value, this.viewForm.controls.ViewId.value, this.viewForm.controls.TemplateViewId.value).pipe(
              finalize(() => {
                this.saving = false;
                this.submitted = false;
              }))
              .subscribe((res: any) => {
                if (res == 0) {
                  this.onSave();
                }
                else {
                  this.as.error('', 'Message.STD00004', ['Label.LOMT10.Ordinal']);
                }
              });
          }
          else {
            this.as.error('', 'Message.STD00004', ['Label.LOMT10.ViewThai']);
          }
        });
    }
  }

  rebuildForm() {
    this.viewForm.markAsPristine();
    if (this.view.ViewId) {
      this.viewForm.patchValue(this.view);
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.viewForm.dirty) {
      return true;
    }
    return this.modal.confirm("Message.STD00002");
  }

  back() {
    if (this.route.snapshot.params.programCode == 'lomt01') {
      this.router.navigate(['/lo/lomt10-2', { programCode: 'lomt01' }], { skipLocationChange: true });
    } else {
      this.router.navigate(['/lo/lomt10-2'], { skipLocationChange: true });
    }

  }
}

