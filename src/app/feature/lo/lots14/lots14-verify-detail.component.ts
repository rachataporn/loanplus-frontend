import { Component, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Lots14Service, SecuritiesVerifyHistory } from '@app/feature/lo/lots14/lots14.service';
import { Page } from '@app/shared';
import { LangService, AlertService } from '@app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
    templateUrl: './lots14-verify-detail.component.html'
})
export class SecuritiesVerifyDetailPopupComponent {
    verify: SecuritiesVerifyHistory = {} as SecuritiesVerifyHistory;
    securitiesCode: string;
    securitiesStatusSelect: string;
    statusPass: string;
    statusNotPass: string;
    verifyName = [];
    securitiesStatus = [];
    verifydetail = [];
    page = new Page();
    verifyForm: FormGroup;
    saving: boolean;
    submitted: boolean;
    savingVerify: boolean;
    focusToggle: boolean;
    estimateAmount: number;
    loanLimitAmount: number;
    mortgageAmount: number;
    rowVersionSecurities: string;
    securitiesCategoryId: number;
    @Output() selected = new EventEmitter<string>();
    subject: Subject<any>;
    provinceList = [];

    constructor(
        public bsModalRef: BsModalRef,
        private route: ActivatedRoute,
        public lots14Service: Lots14Service,
        public lang: LangService,
        private fb: FormBuilder,
        private as: AlertService,
    ) { this.createForm() }

    createForm() {
        this.verifyForm = this.fb.group({
            securitiesStatus: [null, Validators.required],
            verifyDate: [{ value: new Date(), disabled: true }, Validators.required],
            verifyName: null,
            estimateAmount: [null, Validators.required],
            loanLimitAmount: [null, Validators.required],
            reasoncode: null,
            remark: null,
            mortgageAmount: null,
            provinceOutOfBound: [{ value: null, disabled: true }],
            endNotTransferDate: [{ value: null, disabled: true }],
            endTransferInheritanceDate: [{ value: null, disabled: true }]
        })

        this.verifyForm.controls.securitiesStatus.valueChanges.subscribe(
            (value) => {
                if (value == this.statusPass) {
                    this.verifyForm.controls.reasoncode.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.reasoncode.disable({ emitEvent: false });

                    this.verifyForm.controls.endNotTransferDate.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.endNotTransferDate.disable({ emitEvent: false });
                    this.verifyForm.controls.provinceOutOfBound.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.provinceOutOfBound.disable({ emitEvent: false });
                    this.verifyForm.controls.endTransferInheritanceDate.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.endTransferInheritanceDate.disable({ emitEvent: false });

                    this.verifyForm.controls.endNotTransferDate.setValidators(null);
                    this.verifyForm.controls.provinceOutOfBound.setValidators(null);
                    this.verifyForm.controls.endTransferInheritanceDate.setValidators(null);

                    this.verifyForm.controls.endNotTransferDate.updateValueAndValidity();
                    this.verifyForm.controls.provinceOutOfBound.updateValueAndValidity();
                    this.verifyForm.controls.endTransferInheritanceDate.updateValueAndValidity();
                } else if (value == '6') {
                    this.verifyForm.controls.provinceOutOfBound.enable({ emitEvent: false });
                    this.verifyForm.controls.provinceOutOfBound.setValidators([Validators.required]);

                    this.verifyForm.controls.endNotTransferDate.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.endNotTransferDate.disable({ emitEvent: false });
                    this.verifyForm.controls.reasoncode.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.reasoncode.disable({ emitEvent: false });
                    this.verifyForm.controls.endTransferInheritanceDate.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.endTransferInheritanceDate.disable({ emitEvent: false });

                    this.verifyForm.controls.endNotTransferDate.setValidators(null);
                    this.verifyForm.controls.endTransferInheritanceDate.setValidators(null);

                    this.verifyForm.controls.endNotTransferDate.updateValueAndValidity();
                    this.verifyForm.controls.provinceOutOfBound.updateValueAndValidity();
                    this.verifyForm.controls.endTransferInheritanceDate.updateValueAndValidity();
                } else if (value == '8') {
                    this.verifyForm.controls.endNotTransferDate.enable({ emitEvent: false });
                    this.verifyForm.controls.endNotTransferDate.setValidators([Validators.required]);

                    this.verifyForm.controls.provinceOutOfBound.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.provinceOutOfBound.disable({ emitEvent: false });
                    this.verifyForm.controls.reasoncode.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.reasoncode.disable({ emitEvent: false });
                    this.verifyForm.controls.endTransferInheritanceDate.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.endTransferInheritanceDate.disable({ emitEvent: false });

                    this.verifyForm.controls.provinceOutOfBound.setValidators(null);
                    this.verifyForm.controls.endTransferInheritanceDate.setValidators(null);

                    this.verifyForm.controls.endNotTransferDate.updateValueAndValidity();
                    this.verifyForm.controls.provinceOutOfBound.updateValueAndValidity();
                    this.verifyForm.controls.endTransferInheritanceDate.updateValueAndValidity();
                } else if (value == '9') {
                    this.verifyForm.controls.endTransferInheritanceDate.enable({ emitEvent: false });
                    this.verifyForm.controls.endTransferInheritanceDate.setValidators([Validators.required]);

                    this.verifyForm.controls.provinceOutOfBound.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.provinceOutOfBound.disable({ emitEvent: false });
                    this.verifyForm.controls.reasoncode.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.reasoncode.disable({ emitEvent: false });
                    this.verifyForm.controls.endNotTransferDate.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.endNotTransferDate.disable({ emitEvent: false });

                    this.verifyForm.controls.provinceOutOfBound.setValidators(null);
                    this.verifyForm.controls.endNotTransferDate.setValidators(null);
                    this.verifyForm.controls.reasoncode.setValidators(null);

                    this.verifyForm.controls.endNotTransferDate.updateValueAndValidity();
                    this.verifyForm.controls.provinceOutOfBound.updateValueAndValidity();
                    this.verifyForm.controls.reasoncode.updateValueAndValidity();
                } else {
                    if (this.verifyForm.controls.reasoncode.value == null) {
                        this.verifyForm.controls.reasoncode.setValue(null, { emitEvent: false })
                    }
                    this.verifyForm.controls.reasoncode.enable({ emitEvent: false });

                    this.verifyForm.controls.endNotTransferDate.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.endNotTransferDate.disable({ emitEvent: false });
                    this.verifyForm.controls.provinceOutOfBound.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.provinceOutOfBound.disable({ emitEvent: false });
                    this.verifyForm.controls.endTransferInheritanceDate.setValue(null, { emitEvent: false })
                    this.verifyForm.controls.endTransferInheritanceDate.disable({ emitEvent: false });

                    this.verifyForm.controls.endNotTransferDate.setValidators(null);
                    this.verifyForm.controls.provinceOutOfBound.setValidators(null);
                    this.verifyForm.controls.endTransferInheritanceDate.setValidators(null);

                    this.verifyForm.controls.endNotTransferDate.updateValueAndValidity();
                    this.verifyForm.controls.provinceOutOfBound.updateValueAndValidity();
                    this.verifyForm.controls.endTransferInheritanceDate.updateValueAndValidity();
                }
            })
    }

    ngOnInit() {
        this.verify.SecuritiesCode = this.securitiesCode;
        this.verify.RowVersionSecurities = this.rowVersionSecurities;
        this.securitiesStatus = this.securitiesStatus;
        this.provinceList = this.provinceList;
        this.verifyForm.controls.verifyName.setValue(this.verifyName[0]['Text' + this.lang.CURRENT], { emitEvent: false });
        this.verifyForm.controls.estimateAmount.setValue(this.estimateAmount, { emitEvent: false });
        this.verifyForm.controls.loanLimitAmount.setValue(this.loanLimitAmount, { emitEvent: false })
        this.verifyForm.controls.mortgageAmount.setValue(this.mortgageAmount, { emitEvent: false })
        this.search();
        this.onDisable();
    }

    onDisable() {
        if (this.securitiesStatusSelect == this.statusPass || this.securitiesStatusSelect == this.statusNotPass
            || this.securitiesStatusSelect == '6' || this.securitiesStatusSelect == '8') {
            this.verifyForm.disable({ emitEvent: false });
            this.savingVerify = true;
        } else {
            this.verifyForm.enable({ emitEvent: false });
            this.verifyForm.controls.verifyDate.disable({ emitEvent: false });
            this.savingVerify = false;
        }
    }

    onRequire() {
        if (this.verifyForm.controls.securitiesStatus.value == this.statusPass) {
            this.verifyForm.controls.reasoncode.setValidators(null);
        } else {
            this.verifyForm.controls.reasoncode.setValidators([Validators.required]);
        }
        this.verifyForm.controls.reasoncode.updateValueAndValidity();
    }

    search() {
        this.lots14Service.getVerify(this.securitiesCode, this.page)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.verifydetail = res.Rows;
                    this.page.totalElements = res.Rows.length ? res.Total : 0;
                });
    }

    onTableEvent(event) {
        this.page = event;
        this.search();
    }

    prepareSave(values) {
        Object.assign(this.verify, values)
    }

    saveVerify() {
        this.submitted = true;
        this.onRequire();

        if (this.verifyForm.invalid) {
            this.focusToggle = !this.focusToggle;
            return;
        }

        if ((this.securitiesCategoryId == 2 || this.securitiesCategoryId == 3) && this.verifyForm.controls.estimateAmount.value <= 0
            && this.verifyForm.controls.securitiesStatus.value != '6' && this.verifyForm.controls.securitiesStatus.value != '8') {
            this.as.warning('', 'ประเภทหลักทรัพย์ที่เป็นรถยนต์หรือรถจักรยานยนต์ต้องมีข้อมูลในข้อมูลราคากลาง');
            return;
        }

        if ((((this.securitiesCategoryId == 2 || this.securitiesCategoryId == 3) && this.verifyForm.controls.estimateAmount.value <= 0) || this.verifyForm.controls.loanLimitAmount.value <= 0) && this.verifyForm.controls.securitiesStatus.value != '4'
            && this.verifyForm.controls.securitiesStatus.value != '6' && this.verifyForm.controls.securitiesStatus.value != '8') {
            this.as.warning('', 'มูลค่าหลักทรัพย์และวงเงินที่กู้ได้ต้องมีค่ามากกว่า 0');
            return;
        }

        if ((this.securitiesCategoryId == 2 || this.securitiesCategoryId == 3)) {
            if (this.verifyForm.controls.loanLimitAmount.value <= this.verifyForm.controls.estimateAmount.value) {
                this.saving = true;
                this.verifyForm.disable({ emitEvent: false });
                this.prepareSave(this.verifyForm.value);
                this.lots14Service.saveVerify(this.verify).pipe(
                    finalize(() => {
                        this.saving = false;
                        this.submitted = false;
                        this.onDisable();
                    }))
                    .subscribe(
                        (res: SecuritiesVerifyHistory) => {
                            this.as.success("", "Message.STD00006");
                            this.search();
                            this.close();
                            this.selected.next(this.verify.SecuritiesCode);
                        });
            } else {
                this.as.warning('', 'Message.LO00029');
            }
        } else {
            this.saving = true;
            this.verifyForm.disable({ emitEvent: false });
            this.prepareSave(this.verifyForm.value);
            this.lots14Service.saveVerify(this.verify).pipe(
                finalize(() => {
                    this.saving = false;
                    this.submitted = false;
                    this.onDisable();
                }))
                .subscribe(
                    (res: SecuritiesVerifyHistory) => {
                        this.as.success("", "Message.STD00006");
                        this.search();
                        this.close();
                        this.selected.next(this.verify.SecuritiesCode);
                    });
        }
    }

    close(): void {
        this.selected.next('');
        this.verifyForm.reset();
        this.bsModalRef.hide();
    }
}
