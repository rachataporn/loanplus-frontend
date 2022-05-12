import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp42Service, ReportParam } from '@app/feature/lo/lorp42/lorp42.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import * as moment from 'moment';

@Component({
  templateUrl: './lorp42.component.html'
})

export class Lorp42Component implements OnInit {
  now = new Date();
  searchForm: FormGroup;
  reportParam = {} as ReportParam
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  constructor(
    private fb: FormBuilder,
    private ls: Lorp42Service,
    public lang: LangService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      date:[this.now, Validators.required]
    });

  }

  ngOnInit() {

  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.Date = this.searchForm.controls.date.value;
    this.reportParam.ReportName = 'LORP42'
    this.reportParam.ExportType = 'xls';
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        if (res) {
          this.srcResult = res;
          this.OpenWindow( this.srcResult)
        }
      });
  }

  async OpenWindow(data) {
    let doc = document.createElement("a");
    doc.href = "data:application/vnd.ms-excel;base64," + data;
    doc.download = "report42_" + ((Number(moment(this.now).format('YYYY')) - 543) + "-") + moment(this.now).format('MM-DD') + "." + this.reportParam.ExportType;
    doc.click();
  }

  getText(value, list) {
    if (value) {
      const textData = list.find(data => {
        return data.Value == value;
      });
      return this.lang.CURRENT == "Tha" ? textData.TextTha : textData.TextEng;
    }
  }

  getLocaleCompare(from, to) {
    if (from == null || to == null) {
      return 0;
    } else {
      return from.localeCompare(to);
    }
  }
}
