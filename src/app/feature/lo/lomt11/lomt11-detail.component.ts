import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, RowState, Page, SelectFilterService, Size } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lomt11Service, InvoiceItem } from './lomt11.service';

@Component({
  templateUrl: './lomt11-detail.component.html'
})
export class Lomt11DetailComponent implements OnInit {

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
    private Lomt11Service: Lomt11Service,
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
      this.Lomt11Service.checkDuplicate(this.invoiceItemForm.controls.InvoiceItemCode.value)
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
    this.Lomt11Service.saveLoan(this.invoiceItem).pipe(
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
    this.Lomt11Service.checkDuplicatePriority(this.invoiceItemForm.controls.InvoiceItemCode.value,this.invoiceItemForm.controls.InvoiceItemPriority.value)
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
    this.Lomt11Service.checkDuplicateSequence(this.invoiceItemForm.controls.InvoiceItemCode.value,this.invoiceItemForm.controls.InvoiceItemSequence.value)
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


  back() {
    this.router.navigate(['/lo/lomt08'], { skipLocationChange: true });
  }
}
