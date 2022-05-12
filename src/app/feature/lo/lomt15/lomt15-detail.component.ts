import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page, SelectFilterService, Size } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lomt15Service, Transport } from './lomt15.service';

@Component({
  templateUrl: './lomt15-detail.component.html'
})
export class Lomt15DetailComponent implements OnInit {

  transport: Transport = {} as Transport;
  master: { transportType: any[] };
  transportType = [];
  TransportType = [];
  TransportForm: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private is: Lomt15Service,
    private modal: ModalService,
    public lang: LangService,
    private filter: SelectFilterService,
    private saveData: SaveDataService,
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.TransportForm = this.fb.group({
      TransportId: null,
      TransportNameTh: [null, Validators.required],
      TransportNameEn: null,
      TransportCode: [null, Validators.required],
      TransportType: null,
      Active: true,
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
    // this.lang.onChange().subscribe(
    //   () => this.bindDropDownList()
    // );

    const saveData = this.saveData.retrive('LOMT15');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.searchForm.controls.flagSearch.setValue(false);
    this.route.data.subscribe((data) => {
      this.transport = data.Lomt15.detail;
      this.TransportType = data.Lomt15.ddl.LoanTypesDto;
    });
    this.rebuildForm();
  }

  // bindDropDownList() {
  //   this.filter.SortByLang(this.attributeType);
  //   this.attributeType = [...this.AttributeType];
  // }

  rebuildForm() {
    this.TransportForm.markAsPristine();
    if (this.transport.TransportId) {
      this.TransportForm.patchValue(this.transport);
      this.TransportForm.controls.TransportCode.disable({ emitEvent: false });
    }
    // this.bindDropDownList();
  }

  prepareSave(values: Object) {
    Object.assign(this.transport, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.TransportForm.controls.TransportNameTh.value) {
      this.TransportForm.controls.TransportNameTh.setValue(this.TransportForm.controls.TransportNameTh.value.trim(), { eventEmit: false });
    }
    if (this.TransportForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.saving = true;
    this.is.checkduplicate(this.TransportForm.getRawValue()).pipe(
      finalize(() => { }))
      .subscribe(
        (res) => {
          if (res) {
            this.onSave();
          } else {
            this.saving = false;
            this.as.error('', 'Message.STD00004', ['Label.LOMT15.ErrorDupicate']);
          }
        });
  }

  onSave() {
    this.prepareSave(this.TransportForm.value);
    this.is.saveTransport(this.transport).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
        this.TransportForm.enable();
        if (this.transport.TransportId != null) {
          this.TransportForm.controls.TransportCode.disable({ emitEvent: false });
        }
      }))
      .subscribe(
        (res: Transport) => {
          this.transport = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        });
  }

  back() {
    this.router.navigate(['/lo/lomt15'], { skipLocationChange: true });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.TransportForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] == 'lomt15') {
      this.saveData.save(this.searchForm.value, 'LOMT15');
    } else {
      this.saveData.save(this.searchForm.value, 'LOMT15');
    }
  }
}
