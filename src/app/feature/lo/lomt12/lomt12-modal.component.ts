import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LangService, AlertService } from '@app/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Page } from '../../../shared';
import { LoanAgreementType, Lomt12Service } from './lomt12.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  templateUrl: './lomt12-modal.component.html'
})
export class Lomt12ModalComponent {
  loanAgreementForm: FormGroup;
  focusToggle: boolean;
  saving: boolean;
  submitted: boolean;
  CanRefinances = [];
  loanAgreementType: LoanAgreementType = {} as LoanAgreementType;

  constructor(
    private router: Router,
    public modalRef: BsModalRef,
    public lomt12Service: Lomt12Service,
    public lang: LangService,
    private fb: FormBuilder,
    private as: AlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.loanAgreementForm = this.fb.group({
      LoanTypeCode: [null, [Validators.required, Validators.pattern(/\S+/)]],
      LoanTypeNameTha: [null, Validators.required],
      LoanTypeNameEng: null,
      CanRefinance: true,
      Active: true
    });
  }

  ngOnInit() {
    this.lomt12Service.getMaster().subscribe(
      (res: any) => {
        this.CanRefinances = res.CanRefinances;
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.loanAgreementForm.invalid) {
      this.focusToggle = !this.focusToggle;
      this.saving = false;
      return;
    }

    this.lomt12Service.checkDuplicate(this.loanAgreementForm.controls.LoanTypeCode.value)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          if (res) {
            this.as.error('', 'Message.STD00004', ['Label.LOMT12.LoanTypeCode']);
            return;
          } else {
            this.onSave();
          }
        });
  }

  prepareSave(values: Object) {
    Object.assign(this.loanAgreementType, values);
  }

  onSave() {
    this.saving = true;
    this.prepareSave(this.loanAgreementForm.getRawValue());
    this.lomt12Service.saveLoanType(this.loanAgreementType).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: LoanAgreementType) => {
          this.close();
          this.as.success('', 'Message.STD00006');
          this.router.navigate(['/lo/lomt12/detail', { LoanTypeCode: res.LoanTypeCode }], { skipLocationChange: true });
        }
      );
  }

  checkLoanTypeCode() {
    if (this.loanAgreementForm.controls.LoanTypeCode.value) {
      this.loanAgreementForm.controls.LoanTypeCode.setValue(this.loanAgreementForm.controls.LoanTypeCode.value.trim(), { eventEmit: false });
    }
  }

  close(): void {
    this.modalRef.hide();
  }
}
