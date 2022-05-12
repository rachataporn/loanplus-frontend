import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Lomt06Service, Group } from './lomt06.service';

@Component({
  templateUrl: './lomt06-detail.component.html'
})
export class Lomt06DetailComponent implements OnInit {

  GroupDetail: Group = {} as Group;
  GroupFrom: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  statusSave = '';
  firstCreate = '';
  submitted: boolean;
  focusToggle: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Lomt06Service,
    private saveData: SaveDataService,
    private modal: ModalService,
    public lang: LangService
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.GroupFrom = this.fb.group({
      GroupCode: [null, Validators.required],
      GroupName: [null, Validators.required],
      Active: true,
    });
  }

  createBackSearchForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      flagSearch: null,
      beforeSearch: null
    });
    this.searchForm.controls.flagSearch.setValue(false);
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LOMT06');
    if (saveData) {
      this.searchForm.patchValue(saveData);
      this.route.data.subscribe((data) => {
        this.GroupDetail = data.lomt06.GroupDetail;
        this.rebuildForm();
        // if (data.lomt06.GroupDetail.GroupCode) {
        //   this.statusSave = false;
        // }
      });
      this.searchForm.controls.flagSearch.setValue(false);
    }
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lomt06') {
      this.saveData.save(this.searchForm.value, 'LOMT06');
    } else {
      this.saveData.save(this.searchForm.value, 'LOMT06');
    }
  }

  rebuildForm() {
    this.GroupFrom.markAsPristine();
    this.GroupFrom.patchValue(this.GroupDetail);
    if (this.GroupDetail.GroupCode) {
      this.firstCreate = this.GroupDetail.GroupCode;
      this.GroupFrom.controls.GroupCode.disable();
    } else {
      this.GroupFrom.controls.GroupCode.enable();
    }
  }

  prepareSave(values: Object) {
    Object.assign(this.GroupDetail, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.GroupFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    // if (this.statusSave) {
    //   this.js.CheckDuplicate(this.GroupDetail).pipe(
    //     finalize(() => {
    //       this.saving = false;
    //       this.submitted = false;
    //     }))
    //     .subscribe(
    //       (res) => {
    //         if (res) {
    //           this.onSave();
    //         } else {
    //           this.as.error('', 'ข้อมูลกลุ่มลูกหนี้ มีค่าซ้ำ');
    //         }
    //       }
    //     );
    // } else {
    //   this.onSave();
    // }

    if (this.GroupFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      this.statusSave = '';
      return;
    }
    if (!this.firstCreate) {
      this.js.CheckDuplicate(this.GroupDetail).pipe(
        finalize(() => {
        }))
        .subscribe(
          (res: any) => {
            if (res) {
              this.onSave();
            } else {
              this.as.error('', 'Message.STD00004', ['Label.LOMT06.GroupCode']);
            }
          }
        );
    } else { this.onSave(); }


  }

  onSave() {
    if (this.GroupFrom.controls.GroupCode.value) {
      this.GroupFrom.controls.GroupCode.setValue(this.GroupFrom.controls.GroupCode.value.trim());
    }

    if (this.GroupFrom.controls.GroupName.value) {
      this.GroupFrom.controls.GroupName.setValue(this.GroupFrom.controls.GroupName.value.trim());
    }

    if (this.GroupFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.prepareSave(this.GroupFrom.value);
    this.js.saveGroup(this.GroupDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: Group) => {
          this.GroupDetail = res;
          this.rebuildForm();
          this.GroupFrom.controls.GroupCode.disable();
          this.as.success('', 'บันทึกสำเร็จ');
        }
      );
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.GroupFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back(flagSearch) {
    this.router.navigate(['/lo/lomt06', { flagSearch: flagSearch }], { skipLocationChange: true });
  }
}
