import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lomt07Service, Information } from './lomt07.service';

@Component({
  templateUrl: './lomt07-detail.component.html'
})
export class Lomt07DetailComponent implements OnInit, OnDestroy {
  informationDetail: Information = {} as Information;
  informationFrom: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  statusSave = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Lomt07Service,
    private modal: ModalService,
    public lang: LangService,
    private saveData: SaveDataService,
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.informationFrom = this.fb.group({
      InformationId: null,
      InformationName: [null, Validators.required],
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
    const saveData = this.saveData.retrive('LOMT07');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.searchForm.controls.flagSearch.setValue(false);
    this.route.data.subscribe((data) => {
      this.informationDetail = data.lomt07.informationDetailList;
      this.rebuildForm();
    });
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LOMT07');
  }

  rebuildForm() {
    this.informationFrom.markAsPristine();
    if (this.informationDetail.InformationId) {
      this.informationFrom.patchValue(this.informationDetail);
    }
  }

  prepareSave(values: Object) {
    Object.assign(this.informationDetail, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.informationFrom.controls.InformationName.value) {
      this.informationFrom.controls.InformationName.setValue(this.informationFrom.controls.InformationName.value.trim());
    }
    if (this.informationFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      this.statusSave = '';
      return;
    }
    this.saving = true;
    this.prepareSave(this.informationFrom.value);
    this.js.checkDupInformationName(this.informationDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: any) => {
        res === 0 ? this.onSave() : this.as.error('', 'ชื่อข้อมูลมีค่าซ้ำ');
      });
  }

  onSave() {
    this.saving = true;
    this.js.saveInformation(this.informationDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: Information) => {
          this.informationDetail = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        }
      );
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.informationFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back(flagSearch) {
    this.router.navigate(['/lo/lomt07', { flagSearch: flagSearch }], { skipLocationChange: true });
  }
}
