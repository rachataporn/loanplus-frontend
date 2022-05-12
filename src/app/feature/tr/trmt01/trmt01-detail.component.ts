import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Trmt01Service, Tracking } from './trmt01.service';
import { Page, ModalService, ModalRef, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ConfigurationService, ContentType, Category } from '../../../shared/service/configuration.service';


@Component({
    templateUrl: './trmt01-detail.component.html'
})

export class Trmt01DetailComponent implements OnInit {
    TrackingMaster: Tracking = {} as Tracking;
    TrackingForm: FormGroup;

    submitted: boolean;
    focusToggle: boolean;
    saving: boolean;
    disabled: boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private sv: Trmt01Service,
        public lang: LangService,
        private config: ConfigurationService,
        private selectFilter: SelectFilterService,
        private modal: ModalService,

    ) {
        this.createForm();
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.TrackingMaster = data.tracking.TrackingDetail;
            this.rebuildForm();
        });
    }

    createForm() {
        this.TrackingForm = this.fb.group({
            TrackingItemId: null,
            TrackingItemNameTha: [null, Validators.required],
            TrackingItemNameEng: null,
            active: true
        });
    }

    rebuildForm() {
        this.TrackingForm.markAsPristine();
        if (this.TrackingMaster.CreatedProgram) {
            this.TrackingForm.patchValue(this.TrackingMaster);
        }
    }

    prepareSave(values: Object) {
        Object.assign(this.TrackingMaster, values);
    }

    onSubmit() {
        this.submitted = true;

        if (this.TrackingForm.invalid) {
            this.focusToggle = !this.focusToggle;
            return;
        }

        this.saving = true;
        this.disabled = true;
        this.TrackingForm.disable();
        this.prepareSave(this.TrackingForm.getRawValue());
        this.sv.checkDuplicate(this.TrackingMaster).pipe(finalize(() => {
            this.saving = false;
            this.submitted = false;
            this.disabled = false;
        })).subscribe(
            (res) => {
                if (res) {
                    this.onSave();
                } else {
                    this.TrackingForm.enable();
                    this.as.error('', 'มีค่าซ้ำ');
                }
            }
        );
    }

    onSave() {
        this.saving = true;
        this.sv.saveTracking(this.TrackingMaster).pipe(finalize(() => {
            this.saving = false;
            this.saving = false;
            this.disabled = false;
            this.TrackingForm.enable();
        })).subscribe(
            (res: any) => {
                if (res.CreatedProgram) {
                    this.TrackingMaster = res;
                    this.rebuildForm();
                    this.as.success('', 'บันทึกสำเร็จ');
                } else {
                    this.as.error('', 'เกิดข้อผิดพลาด');
                }
            }
        );
    }

    back() {
        this.router.navigate(['/tr/trmt01'], { skipLocationChange: true });
    }
}