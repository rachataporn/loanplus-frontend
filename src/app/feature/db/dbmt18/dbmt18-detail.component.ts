import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Dbmt18Service, Country,Faq } from './dbmt18.service';

@Component({
  templateUrl: './dbmt18-detail.component.html'
})
export class Dbmt18DetailComponent implements OnInit {

  CountryDetail: Country = {} as Country;
  CountryFrom: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  focusToggle: boolean;
  statusSave: boolean = true;
  FaqDetail: Faq = {} as Faq;
  FaqFrom: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Dbmt18Service,
    private saveData: SaveDataService,
    private modal: ModalService,
    public lang: LangService
  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.CountryFrom = this.fb.group({
      CountryCode: [null, Validators.required],
      CountryNameTha: [null, Validators.required],
      CountryNameEng: null,
      Active: true,
    });
 
    this.FaqFrom = this.fb.group({
      FaqCode: [null, Validators.required],
      FaqTopic: [null, Validators.required],
      FaqDescription: null,
      Active: null,
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
    const saveData = this.saveData.retrive('DBMT18');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.FaqDetail = data.dbmt18.FaqDetail;
      this.rebuildForm(); 
      if (data.dbmt18.FaqDetail.FaqCode) {
        this.statusSave = false;
      }
    });
    this.searchForm.controls.flagSearch.setValue(false);
  }

  rebuildForm() {
    this.FaqFrom.markAsPristine();
    this.FaqFrom.patchValue(this.FaqDetail);
    if (this.FaqDetail.FaqCode) {
      this.FaqFrom.controls.FaqCode.disable();
      this.FaqFrom.controls.FaqCode.setValue(this.FaqDetail.FaqCode);
      // this.FaqFrom.controls.FaqTopic.disable();
      this.FaqFrom.controls.FaqTopic.setValue(this.FaqDetail.FaqTopic);
      //this.FaqFrom.controls.FaqCode.disable();
      this.FaqFrom.controls.FaqDescription.setValue(this.FaqDetail.FaqDescription);
      this.statusSave = false;
    } else {
      this.FaqFrom.controls.FaqCode.enable();
    }


  }

  prepareSave(values: Object) {
    Object.assign(this.CountryDetail, values);
  }

  prepareSaveFaq(values: Object) {
    Object.assign(this.FaqDetail, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.FaqFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    if (this.FaqFrom.controls.FaqCode.value ) {
      this.FaqFrom.controls.FaqCode.setValue(this.FaqFrom.controls.FaqCode.value.trim());
      if (this.FaqFrom.controls.FaqCode.value == null || this.FaqFrom.controls.FaqCode.value == '' || this.FaqFrom.controls.FaqTopic.value == null || this.FaqFrom.controls.FaqTopic.value == '' || this.FaqFrom.controls.FaqDescription.value == null || this.FaqFrom.controls.FaqDescription.value == '' ) {
        return;
      }
    }
    // this.prepareSave(this.CountryFrom.value);
    if(this.FaqFrom.controls.Active.value == null) this.FaqFrom.controls.Active.setValue(false);
    this.prepareSaveFaq(this.FaqFrom.value);
    if (this.statusSave) {
      this.js.CheckDuplicateFaq(this.FaqDetail).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe(
          (res) => {
            if (res) {
              this.onSave();
            } else {
              this.as.warning('', 'ข้อมูลประเทศ มีค่าซ้ำ');
            }
          }
        );
    } else {
      this.onSave();
    }
  }

  onSave() {
    this.js.savePcmFaq(this.FaqDetail).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe(
          (res: Faq) => {
            this.FaqDetail = res;
            this.rebuildForm();
            //this.F.controls.CountryCode.disable();
            this.as.success('', 'Message.STD000033');
          }
        );
    // this.js.saveCountry(this.CountryDetail).pipe(
    //   finalize(() => {
    //     this.saving = false;
    //     this.submitted = false;
    //   }))
    //   .subscribe(
    //     (res: Country) => {
    //       this.CountryDetail = res;
    //       this.rebuildForm();
    //       this.CountryFrom.controls.CountryCode.disable();
    //       this.as.success('', 'Message.STD000033');
    //     }
    //   );
  }


  ngOnDestroy() {
    // if (this.router.url.split('/')[2] === 'dbmt18') {
    //   this.saveData.save(this.searchForm.value, 'DBMT18');
    // } else {
    //   this.saveData.save(this.searchForm.value, 'DBMT18');
    // }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.FaqFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back(flagSearch) {
    this.router.navigate(['/db/dbmt18', { flagSearch: flagSearch }], { skipLocationChange: true });
  }
}
