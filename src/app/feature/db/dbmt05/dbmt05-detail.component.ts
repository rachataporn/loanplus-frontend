import { Component, OnInit } from '@angular/core';
import { AlertService, SaveDataService, LangService } from '@app/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ModalService, Page, RowState } from '@app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { Dbmt05Service, Bank, BankBranch } from './dbmt05.service';
import { switchMap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './dbmt05-detail.component.html'
})
export class Dbmt05DetailComponent implements OnInit {
  bank: Bank = {} as Bank;
  bankForm: FormGroup;
  submitted = false;
  saving = false;
  focusToggle = false;
  data = '';
  page = new Page();
  statusPage: boolean;
  flagClose = '';

  deleteBranch = [];
  constructor(
    private dbmt05Service: Dbmt05Service,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService
  ) { this.createForm() }

  get bankCode() {
    return this.bankForm.controls.BankCode;
  }
  createForm() {
    this.bankForm = this.fb.group({
      BankCode: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      BankNameTha: [null, [Validators.required, Validators.pattern(/\S+/)]],
      BankNameEng: null,
      Description: null,
      Active: true,
      BankBranchForm: this.fb.array([]),
      TransferBankCode: null
    });
  }

  createDetailForm(item: BankBranch): FormGroup {
    const fg = this.fb.group({
      guid: Math.random().toString(), // important for tracking change
      BankCode: [null],
      BranchCode: [null, Validators.required],
      BranchNameTha: [null, Validators.required],
      BranchNameEng: [null],
      Active: true,
      RowVersion: null,
      RowState: RowState.Add
    });

    fg.patchValue(item, { emitEvent: false });
    if (item.RowVersion) {
      fg.controls.BranchCode.disable();
    }

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState === RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    );

    return fg;
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.bank = data.bank.detail;
      this.rebuildForm();
    });
  }

  rebuildForm() {
    this.bankForm.markAsPristine();
    this.bankForm.patchValue(this.bank);

    if (this.bank.RowVersion) {
      this.bankForm.setControl('BankBranchForm',
        this.fb.array(this.bank.BankBranchs.map((detail) => this.createDetailForm(detail))));
      this.bankForm.controls.BankCode.disable();
    }
  }

  validateBranch() {
    const seen = new Set();
    const hasDuplicates = this.getBranch.getRawValue().some(function (item) {
      return item.BranchCode !== null && seen.size === seen.add(item.BranchCode.toLowerCase()).size;
    });
    return hasDuplicates;
  }

  prepareSave(values: Object) {

    Object.assign(this.bank, values);
    const bankBranchs = this.getBranch.getRawValue();

    //add
    const adding = bankBranchs.filter(function (item) {
      return item.RowState === RowState.Add;
    });

    // edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.bank.BankBranchs.map(label => {
      return Object.assign(label, bankBranchs.filter(item => item.RowState === RowState.Edit).find((item) => {
        return label.BankCode === item.BankCode
          && label.BranchCode === item.BranchCode;
      }));
    });
    // เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.bank.BankBranchs = this.bank.BankBranchs.filter(item => item.RowState !== RowState.Add).concat(adding);
  }

  onSubmit() {
    this.submitted = true;
    if (this.bankForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.getBranch.length === 0) {
      this.as.warning('', 'Message.STD00012', ['รายละเอียดสาขา']);
      return;
    }

    if (this.validateBranch()) {
      this.as.warning('', 'Message.STD00004', ['รหัสสาขา']);
      return;
    }

    this.saving = true;
    this.prepareSave(this.bankForm.getRawValue());
    this.dbmt05Service.saveBank(this.bank).pipe(
      switchMap(() => this.dbmt05Service.getBankDetail(this.bank.BankCode)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: Bank) => {
        this.bank = res;
        this.rebuildForm();
        this.as.success("", "Message.STD00006");
      });
  }

  get getBranch(): FormArray {
    return this.bankForm.get('BankBranchForm') as FormArray;
  }

  addBranchRow() {
    this.getBranch.push(this.createDetailForm({} as BankBranch));
    this.getBranch.markAsDirty();
  }

  removeRow(index) {
    let detail = this.getBranch.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      const deleting = this.bank.BankBranchs.find(item =>
        item.BankCode === detail.controls.BankCode.value
        && item.BranchCode === detail.controls.BranchCode.value
      );
      deleting.RowState = RowState.Delete;
    }
    this.getBranch.removeAt(index);
    this.getBranch.markAsDirty();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.bankForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/db/dbmt05'], { skipLocationChange: true });
  }

}
