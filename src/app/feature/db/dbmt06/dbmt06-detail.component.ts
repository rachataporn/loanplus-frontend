import { Component, OnInit } from '@angular/core';
import { AlertService, SaveDataService, LangService } from '@app/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService, Page } from '@app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { Dbmt06Service, BankAccountType } from './dbmt06.service';
import { switchMap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './dbmt06-detail.component.html'
})
export class Dbmt06DetailComponent implements OnInit {
  bankAccountType: BankAccountType = {} as BankAccountType;
  bankAccountTypeForm: FormGroup;
  submitted = false;
  saving = false;
  focusToggle = false;
  data = '';
  page = new Page();
  statusPage: boolean;
  flagClose = '';
  constructor(
    private dbmt06Service: Dbmt06Service,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) { this.createForm() }

  get bankAccountTypeCode(){
    return this.bankAccountTypeForm.controls.BankAccountTypeCode;
  }
  createForm() {
    this.bankAccountTypeForm = this.fb.group({
      BankAccountTypeCode: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      BankAccountTypeDescription: null,
      Active: true
    });
  }
  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.bankAccountType = data.bankAccountType.detail;
      this.rebuildForm();
    });
  }
  rebuildForm() {
    this.bankAccountTypeForm.markAsPristine();
    if (this.bankAccountType.RowVersion) {
      this.bankAccountTypeForm.patchValue(this.bankAccountType);
      this.bankAccountTypeForm.controls.BankAccountTypeCode.disable();
    }

  }
  prepareSave(values: Object) {
    Object.assign(this.bankAccountType, values);
  }
  onSubmit() {
    this.submitted = true;
    if (this.bankAccountTypeForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.saving = true;
    this.prepareSave(this.bankAccountTypeForm.getRawValue());
    this.dbmt06Service.saveBankAccountType(this.bankAccountType).pipe(
      switchMap(() => this.dbmt06Service.getBankAccountTypeDetail(this.bankAccountType.BankAccountTypeCode)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: BankAccountType) => {
        if (res) {
          this.bankAccountType = res;
          this.rebuildForm();
          this.as.success("", "Message.STD00006");
        }
      });
  }
  canDeactivate(): Observable<boolean> | boolean {
    if (!this.bankAccountTypeForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/db/dbmt06'], { skipLocationChange: true });
  }

}
