import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService } from '@app/shared';
import { finalize } from 'rxjs/operators';
import { Lots26Service, SignatureSelect } from './lots26.service';

@Component({
    templateUrl: './lots26-detail.component.html'
})
export class Lots26DetailComponent implements OnInit {
    saving: boolean;
    submitted: boolean;
    focusToggle: boolean;
    signatureForm: FormGroup;
    signatureSelect: SignatureSelect = {} as SignatureSelect;
    SignatureDocuments = [];
    Signature = [];
    IsDisableWaitSign: boolean = false;
    ContractHeadId: number;
    IsSignature: boolean;
    IsSignCancel: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private lots26Service: Lots26Service,
        private modal: ModalService,
        public lang: LangService

    ) {
        this.createForm();
    }

    createForm() {
        this.signatureForm = this.fb.group({
            Remark: null
        })
    }

    ngOnInit() {
        this.ContractHeadId = this.route.snapshot.params['id'];
        this.IsSignature = JSON.parse(this.route.snapshot.params['isSignature']);

        this.route.data.subscribe((data) => {
            this.SignatureDocuments = data.lots26.master.SignatureDocuments;
        });

        this.onCheckSignStatus();
        this.onCheckWaitSign();
        this.searchSignature();
    }

    searchSignature() {
        this.lots26Service.getSignature(Object.assign({
            ContractHeadId: this.ContractHeadId,
            Remark: this.signatureForm.controls.Remark.value
        }))
            .pipe(finalize(() => { }))
            .subscribe(
                (res) => {
                    this.Signature = res.Rows;
                });
    }

    updateSignature() {
        this.modal.confirm("ยืนยันการยื่นเอกสารให้ลงนาม").subscribe(
            (res) => {
                if (res) {
                    this.signatureSelect.MainContractHeadId = this.ContractHeadId;
                    this.lots26Service.updateSignature(this.signatureSelect)
                        .pipe(finalize(() => {
                        }))
                        .subscribe(
                            (res: any) => {
                                this.as.success('ยื่นเอกสารให้ลงนามสำเร็จ', '');
                                this.onCheckWaitSign();
                                this.searchSignature();
                            });
                }
            })
    }

    onCheckWaitSign() {
        this.signatureSelect.MainContractHeadId = this.ContractHeadId;
        this.lots26Service.checkWaitSign(this.signatureSelect)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: boolean) => {
                    this.IsDisableWaitSign = res;
                });
    }

    onTableSignEvent(event) {
        this.searchSignature();
    }

    onCheckSignature() {
        this.modal.confirm("ยืนยันการลงนาม เพื่อดำเนินการอนุมัติสัญญาเงินกู้ต่อไป").subscribe(
            (res) => {
                if (res) {
                    this.signatureSelect.MainContractHeadId = this.ContractHeadId;
                    this.lots26Service.checkContractSign(this.signatureSelect)
                        .pipe(finalize(() => {
                        }))
                        .subscribe(
                            (res: boolean) => {
                                if (res) {
                                    this.onConfirmSignature();
                                } else {
                                    this.as.warning('เอกสารทั้งหมดต้องได้รับการลงนามให้ครบถ้วน', '');
                                }
                            });
                }
            })
    }

    onConfirmSignature() {
        this.lots26Service.updateConfirmSignature(this.signatureSelect)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.as.success('ยืนยันการลงนามสำเร็จ', '');
                    this.onCheckWaitSign();
                    this.searchSignature();
                });
    }

    back() {
        this.router.navigate(['/lo/lots26'], { skipLocationChange: true });
    }

    onCheckSignStatus() {
        this.signatureSelect.MainContractHeadId = this.ContractHeadId;
        this.lots26Service.checkSignStatus(this.signatureSelect)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: boolean) => {
                    this.IsSignCancel = res;
                });
    }
}
