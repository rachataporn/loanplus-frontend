import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Dbmt12Service, Position } from './dbmt12.service';

@Component({
  templateUrl: './dbmt12-detail.component.html'
})
export class Dbmt12DetailComponent implements OnInit {

  PositionDetail: Position = {} as Position;
  positionFrom: FormGroup;
  searchForm: FormGroup;

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
    private js: Dbmt12Service,
    private modal: ModalService,
    private saveData: SaveDataService,
    public lang: LangService
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.positionFrom = this.fb.group({
      PositionCode: [null, Validators.required],
      PositionNameTha: [null, Validators.required],
      PositionNameEng: null,
      CreatedProgram: null,
      Active: true
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
    const saveData = this.saveData.retrive('DBMT12');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.PositionDetail = data.dbmt12.positionDetailList;
      this.rebuildForm();
    });
    this.searchForm.controls.flagSearch.setValue(false);
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] == "dbmt12") {
      this.saveData.save(this.searchForm.value, 'DBMT12');
    } else {
      this.saveData.save(this.searchForm.value, 'DBMT12');
    };
  }

  rebuildForm() {
    this.positionFrom.markAsPristine();
    this.positionFrom.patchValue(this.PositionDetail);
    if (this.PositionDetail.PositionCode) {
      this.positionFrom.controls.PositionCode.disable();
    } else {
      this.positionFrom.controls.PositionCode.enable();
    }
  }

  prepareSave(values: Object) {
    Object.assign(this.PositionDetail, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.positionFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    if (this.positionFrom.controls.PositionCode.value) {
      this.positionFrom.controls.PositionCode.setValue(this.positionFrom.controls.PositionCode.value.trim());
      if (this.positionFrom.controls.PositionCode.value == null || this.positionFrom.controls.PositionCode.value == '') {
        return;
      }
    }

    this.prepareSave(this.positionFrom.getRawValue());
    if (!this.PositionDetail.CreatedProgram) {
      this.js.CheckDuplicate(this.PositionDetail)
        .pipe(finalize(() => {
        }))
        .subscribe(
          (res: any) => {
            if (res) {
              this.positionFrom.controls.CreatedProgram.value
              this.onSave();

            } else {
              this.as.error('', 'Message.STD00004', ['Label.DBMT12.PositionCode']);
            }
          }, (error) => {
            console.log(error);
          });
    } else {
      this.positionFrom.controls.CreatedProgram.value
      this.onSave();
    }

  }

  onSave() {
    this.js.savePosition(this.PositionDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res) => {
          this.PositionDetail = res;
          this.rebuildForm();
          this.as.success(' ', 'Message.STD00006');
        }
      );
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.positionFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/db/dbmt12'], { skipLocationChange: true });
  }
}
