import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lomt04Service, ReceiveType } from './lomt04.service';

@Component({
  templateUrl: './lomt04-detail.component.html'
})
export class Lomt04DetailComponent implements OnInit, OnDestroy {
  receiveTypeDetail: ReceiveType = {} as ReceiveType;
  receiveTypeFrom: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  statusSave = '';
  firstCreate = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Lomt04Service,
    private saveData: SaveDataService,
    private modal: ModalService,
    public lang: LangService
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.receiveTypeFrom = this.fb.group({
      ReceiveTypeCode: [null, Validators.required],
      AccountCode: [null, Validators.required],
      ReceiveTypeNameTha: [null, Validators.required],
      ReceiveTypeNameEng: null,
      ReceiveFormat: [null, Validators.required],
      Active: true,
      ReceiveFlag: true,
      PaymentFlag: true,
      CustomerReceiveFlag: true,
      DefaultReceiptFlag: false
    });
  }

  createBackSearchForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      flagSearch: null,
      beforeSearch: null
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LOMT04');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.receiveTypeDetail = data.lomt04.receiveTypeDetailList;
      this.rebuildForm();
    });
    this.searchForm.controls.flagSearch.setValue(false);
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lomt04') {
      this.saveData.save(this.searchForm.value, 'LOMT04');
    } else {
      this.saveData.save(this.searchForm.value, 'LOMT04');
    }
  }

  rebuildForm() {
    this.receiveTypeFrom.markAsPristine();
    this.receiveTypeFrom.patchValue(this.receiveTypeDetail);
    if (this.receiveTypeDetail.ReceiveTypeCode) {
      this.firstCreate = this.receiveTypeDetail.ReceiveTypeCode;
      this.receiveTypeFrom.controls.ReceiveTypeCode.disable();
    } else {
      this.receiveTypeFrom.controls.ReceiveTypeCode.enable();
    }
  }

  prepareSave(values: Object) {
    Object.assign(this.receiveTypeDetail, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.receiveTypeFrom.controls['ReceiveTypeCode'].value) {
      this.receiveTypeFrom.controls['ReceiveTypeCode'].setValue(this.receiveTypeFrom.controls['ReceiveTypeCode'].value.trim());
    }
    if (this.receiveTypeFrom.controls['AccountCode'].value) {
      this.receiveTypeFrom.controls['AccountCode'].setValue(this.receiveTypeFrom.controls['AccountCode'].value.trim());
    }
    if (this.receiveTypeFrom.controls['ReceiveTypeNameTha'].value) {
      this.receiveTypeFrom.controls['ReceiveTypeNameTha'].setValue(this.receiveTypeFrom.controls['ReceiveTypeNameTha'].value.trim());
    }
    if (this.receiveTypeFrom.controls['ReceiveTypeNameEng'].value) {
      this.receiveTypeFrom.controls['ReceiveTypeNameEng'].setValue(this.receiveTypeFrom.controls['ReceiveTypeNameEng'].value.trim());
    }
    if (this.receiveTypeFrom.controls['ReceiveFormat'].value) {
      this.receiveTypeFrom.controls['ReceiveFormat'].setValue(this.receiveTypeFrom.controls['ReceiveFormat'].value.trim());
    }
    if (this.receiveTypeFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      this.statusSave = '';
      return;
    }
    if (!this.firstCreate) {
      this.js.checkDuplicate(this.receiveTypeFrom.controls['ReceiveTypeCode'].value).pipe(
        finalize(() => {
        }))
        .subscribe(
          (res: any) => {
            if (res) {
              if (this.receiveTypeFrom.controls['DefaultReceiptFlag'].value) {
                this.js.checkefaultFlag(this.receiveTypeFrom.controls['ReceiveTypeCode'].value).pipe(
                  finalize(() => {
                  }))
                  .subscribe(
                    (res: boolean) => {
                      if (!res) {
                        this.onSave();
                      } else {
                        this.as.warning('', 'Message.LO00028');
                      }
                    }
                  );
              } else {
                this.onSave();
              }
            } else {
              this.as.error('', 'Message.STD00004', ['Label.LOMT04.ReceiveTypeCode']);
            }
          }
        );
    } else {
      if (this.receiveTypeFrom.controls['DefaultReceiptFlag'].value) {
        this.js.checkefaultFlag(this.receiveTypeFrom.controls['ReceiveTypeCode'].value).pipe(
          finalize(() => {
          }))
          .subscribe(
            (res: boolean) => {
              if (!res) {
                this.onSave();
              } else {
                this.as.warning('', 'Message.LO00028');
              }
            }
          );
      } else {
        this.onSave();
      }
    }
  }

  onSave() {
    this.prepareSave(this.receiveTypeFrom.value);
    this.js.saveReceiveType(this.receiveTypeDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: ReceiveType) => {
          this.receiveTypeDetail = res;
          this.rebuildForm();
          this.receiveTypeFrom.controls.ReceiveTypeCode.disable();
          this.as.success('', 'Message.STD00006');
        }
      );
  }


  canDeactivate(): Observable<boolean> | boolean {
    if (!this.receiveTypeFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back(flagSearch) {
    this.router.navigate(['/lo/lomt04', { flagSearch: flagSearch }], { skipLocationChange: true });
  }
}
