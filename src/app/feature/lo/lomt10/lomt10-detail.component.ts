import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateView, Lomt10Service } from './lomt10.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AlertService } from '@app/core';
import { Observable } from 'rxjs';
import { ModalService } from '@app/shared';

@Component({
    templateUrl: './lomt10-detail.component.html'
})

export class Lomt10DetailComponent implements OnInit {
    templateView: TemplateView = {} as TemplateView;
    templateViewForm: FormGroup;
    submitted: boolean;
    focusToggle: boolean;
    saving: boolean;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private is: Lomt10Service,
        private as: AlertService,
        private modal: ModalService,
        private route: ActivatedRoute,
    ) {
        this.createForm();
    }

    createForm() {
        this.templateViewForm = this.fb.group({
            TemplateViewId: null,
            TemplateName: [null, Validators.required],
            Active: true,
        });
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.templateView = data.Lomt10.detail;
            this.rebuildForm();
        });
    }

    prepareSave(values: Object) {
        Object.assign(this.templateView, values);
    }

    checkTemplateName() {
        if (this.templateViewForm.controls.TemplateName.value) {
            let trimData = this.templateViewForm.controls.TemplateName.value ? this.templateViewForm.controls.TemplateName.value.trim() : null
            this.templateViewForm.controls.TemplateName.setValue(trimData);
          }
    }

    onSubmit() {
        this.submitted = true;
        if (this.templateViewForm.invalid) {
            this.focusToggle = !this.focusToggle;
            return;
        }

        if (this.templateViewForm.controls.TemplateViewId.value == null) {
            this.is.checkDupTemplateView(this.templateViewForm.controls.TemplateName.value, null).pipe(
                finalize(() => {
                    this.saving = false;
                    this.submitted = false;
                }))
                .subscribe((res: any) => {
                    if (res == 0) {
                        this.onSave();
                    }
                    else {
                        this.as.error('', 'Message.STD00004', ['Label.LOMT10.TemplateView']);
                    }
                });
        } else {
            this.is.checkDupTemplateView(this.templateViewForm.controls.TemplateName.value, this.templateViewForm.controls.TemplateViewId.value).pipe(
                finalize(() => {
                    this.saving = false;
                    this.submitted = false;
                }))
                .subscribe((res: any) => {
                    if (res == 0) {
                        this.onSave();
                    }
                    else {
                        this.as.error('', 'Message.STD00004', ['Label.LOMT10.TemplateView']);
                    }
                });
        }
    }

    onSave() {
        this.submitted = true;
        if (this.templateViewForm.invalid) {
            this.focusToggle = !this.focusToggle;
            return;
        }

        this.saving = true;
        this.templateViewForm.disable();
        this.prepareSave(this.templateViewForm.value);
        this.is.saveTemplateView(this.templateView).pipe(
            finalize(() => {
                this.saving = false;
                this.submitted = false;
                this.templateViewForm.enable();
            }))
            .subscribe(
                (res: TemplateView) => {
                    if (res) {
                        this.templateView = res;
                        this.rebuildForm();
                        this.as.success("", "Message.STD00006");
                    }
                });
    }

    rebuildForm() {
        this.templateViewForm.markAsPristine();
        if (this.templateView.TemplateViewId) {
            this.templateViewForm.patchValue(this.templateView);
        }
    }

    canDeactivate(): Observable<boolean> | boolean {
        if (!this.templateViewForm.dirty) {
            return true;
        }
        return this.modal.confirm("Message.STD00002");
    }

    back() {
        this.router.navigate(['/lo/lomt10'], { skipLocationChange: true });
    }

}
