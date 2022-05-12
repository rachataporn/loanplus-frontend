import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Parameter, Sumt08Service } from './sumt08.service';

@Component({
  templateUrl: './sumt08-detail.component.html'
})
export class Sumt08DetailComponent implements OnInit {
  parameterDetail: Parameter = {} as Parameter;
  parameterFrom: FormGroup;
  flagClose = '';
  saving: boolean;
  
  submitted: boolean;
  focusToggle: boolean;
  statusSave = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private modal: ModalService,
    private saveData: SaveDataService,
    public lang: LangService,
    private sumt08Service: Sumt08Service
  ) {
    this.createForm();
  }

  createForm() {
    this.parameterFrom = this.fb.group({
      ParameterGroupCode: null,
      ParameterCode: null,
      ParameterValue: null,
      Remark: null,
      Active: true,
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.parameterDetail = data.sumt08.parameterDetail;
      this.rebuildForm();
    });
  }

  rebuildForm() {
    this.parameterFrom.markAsPristine();
    this.parameterFrom.patchValue(this.parameterDetail);
    if (this.parameterDetail.ParameterGroupCode && this.parameterDetail.ParameterCode) {
      this.parameterFrom.controls.ParameterGroupCode.disable();
      this.parameterFrom.controls.ParameterCode.disable();
    }
  }

  prepareSave(values: Object) {
    Object.assign(this.parameterDetail, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.parameterFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.statusSave = 'insert';
    this.saving = true;
    this.onSave();
  }

  onSave() {
    this.prepareSave(this.parameterFrom.getRawValue());
    this.sumt08Service.saveParameter(this.parameterDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
        this.statusSave = '';
        
      }))
      .subscribe(
        (res: any) => {
          this.parameterDetail = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        }
      );
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.parameterFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/su/sumt08'], { skipLocationChange: true });
  }
}


