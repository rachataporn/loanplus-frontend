import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, RowState, Page, SelectFilterService, Size } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lomt08Service, InvoiceItem } from './lomt08.service';

@Component({
  templateUrl: './lomt08-detail.component.html'
})
export class Lomt08DetailComponent implements OnInit {

  itemsLOV = [];
  flagClose = '';
  selected = [];
  checkMenuList = [];
  count: number = 5;
  countCh: number;
  statusSave: string;
  data = '';
  page = new Page();
  focusToggle: boolean;
  statusPage: boolean;
  saving: boolean;
  submitted: boolean;
  invoiceItem: InvoiceItem = {} as InvoiceItem;
  invoiceItemForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private filter: SelectFilterService,
    private lomt08Service: Lomt08Service,
    private modal: ModalService,
    public lang: LangService
  ) {
    this.createForm();
  }

  createForm() {
    this.invoiceItemForm = this.fb.group({
      InvoiceItemCode: [null, Validators.required],
      InvoiceItemNameTha: [null, Validators.required],
      InvoiceItemNameEng: null,
      InvoiceItemSequence: [null, Validators.required],
      InvoiceItemPriority: [null, Validators.required],
      Active: true,
    });
  }
  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.invoiceItem = data.lomt08.InvoiceItemDetail;
      this.rebuildForm();
    });
  }

  prepareSave(values: Object) {
    Object.assign(this.invoiceItem, values);
  }

  rebuildForm() {
    this.invoiceItemForm.markAsPristine();
    this.invoiceItemForm.patchValue(this.invoiceItem);
    if (this.invoiceItem.InvoiceItemCode) {
      this.invoiceItemForm.controls.InvoiceItemCode.disable();
    } else {
      this.invoiceItemForm.controls.InvoiceItemCode.enable();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.invoiceItemForm.invalid) {
      this.focusToggle = !this.focusToggle;
      this.saving = false;
      return;
    }
    if (!this.invoiceItem.InvoiceItemCode) {
      this.lomt08Service.checkDuplicate(this.invoiceItemForm.controls.InvoiceItemCode.value)
        .pipe(finalize(() => {
        }))
        .subscribe(
          (res: any) => {
            if (res) {
              this.as.error('', 'Message.STD00004', ['Label.LOMT08.InvoiceItemCode']);
              return;
            } else {
              this.checkDuplicateSequence();
            }
          }, (error) => {
            console.log(error);
          });
    }
    else {
      this.checkDuplicateSequence();
    }
  }
  onSave() {
    this.saving = true;
    this.prepareSave(this.invoiceItemForm.getRawValue());
    this.lomt08Service.saveLoan(this.invoiceItem).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: InvoiceItem) => {
          this.invoiceItem = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        }
      );
  }
  checkDuplicatePriority() {
    this.lomt08Service.checkDuplicatePriority(this.invoiceItemForm.controls.InvoiceItemCode.value,this.invoiceItemForm.controls.InvoiceItemPriority.value)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          if (res) {
            this.as.warning('', 'Message.STD00004', ['Label.LOMT08.InvoiceItemPriority']);
            return;
          } else {
            this.onSave();
          }
        }
      );
  }

  checkDuplicateSequence() {
    this.lomt08Service.checkDuplicateSequence(this.invoiceItemForm.controls.InvoiceItemCode.value,this.invoiceItemForm.controls.InvoiceItemSequence.value)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          if (res) {
            this.as.warning('', 'Message.STD00004', ['Label.LOMT08.InvoiceItemSequence']);
            return;
          } else {
            this.checkDuplicatePriority();
          }
        }
      );
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.invoiceItemForm.dirty) {
        return true;
    }
    return this.modal.confirm("Message.STD00002");
}

  back() {
    this.router.navigate(['/lo/lomt08'], { skipLocationChange: true });
  }
}
