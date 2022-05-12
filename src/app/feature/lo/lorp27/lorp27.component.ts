import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LangService, SaveDataService } from '@app/core';
import { Lorp27Service, ReportParam, SecuritiesType, SecuritiesStatus } from '@app/feature/lo/lorp27/lorp27.service';
import { SelectFilterService } from '@app/shared';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  templateUrl: './lorp27.component.html'
})
export class Lorp27Component implements OnInit, OnDestroy {
  reportParam = {} as ReportParam;
  searchForm: FormGroup;

  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  fromBranchList = [];
  toBranchList = [];
  SecuritiesTypeList = [];
  SecuritiesStatusList = [];
  now = new Date();


  constructor(
    private fb: FormBuilder,
    private sv: Lorp27Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      ApprovedDate: null,
      ToApprovedDate: null,
      FromBranch: null,
      ToBranch: null,
      SecuritiesType: this.fb.array([]),
      SecuritiesStatus: this.fb.array([]),
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP27');
    if (saveData) {
      this.searchForm.patchValue(saveData);
    }

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp27.master.Branch;
      this.toBranchList = data.lorp27.master.Branch;
      this.SecuritiesStatusList = data.lorp27.master.SecuritiesStatus;
      this.SecuritiesTypeList = data.lorp27.master.SecuritiesType;
      this.searchForm.setControl('SecuritiesType', this.fb.array(this.SecuritiesTypeList.map((detail) => this.securitiesTypeForm(detail))));
      this.searchForm.setControl('SecuritiesStatus', this.fb.array(this.SecuritiesStatusList.map((detail) => this.securitiesStatusForm(detail))));
      this.bindDropDownList();
    });
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP27');
  }

  bindDropDownList() {
    this.filterFromBranchList(true);
    this.filterToBranchList(true);
    // this.filterSecuritiesTypeList(true);
    // this.filterSecuritiesStatusList(true);
  }

  filterFromBranchList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.fromBranchList = this.selectFilter.FilterActiveByValue(this.fromBranchList, detail.fromBranch);
      } else {
        this.fromBranchList = this.selectFilter.FilterActive(this.fromBranchList);
      }
    }
    this.fromBranchList = [...this.fromBranchList];
  }

  filterToBranchList(filter?: boolean) {
    if (filter) {
      const detail = this.searchForm.value;
      if (detail) {
        this.toBranchList = this.selectFilter.FilterActiveByValue(this.toBranchList, detail.toBranch);
      } else {
        this.toBranchList = this.selectFilter.FilterActive(this.toBranchList);
      }
    }
    this.toBranchList = [...this.toBranchList];
  }

  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + this.reportParam.ExportType + ";base64," + data;
    doc.download = name + "_" + "SecuritiesHistories-" + ((Number(moment(this.now).format('YYYY')) - 543) + "-") + moment(this.now).format('MM-DD') + "." + this.reportParam.ExportType;
    doc.click();
  }

  prepareSave() {
    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.ReportName = 'LORP27';
    this.reportParam.ExportType = 'xlsx';
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const selected1 = [];
    const selected2 = [];
    let selectedTextSecuritiesType = '';
    this.searchForm.controls.SecuritiesType.value.forEach(element => {
      if (element.Active) {
        selected1.push(element.StatusValue);
        selectedTextSecuritiesType += this.lang.CURRENT === 'Tha' ? element.TextTha + ', ' : element.TextEng + ', ';
      }
      if (selected1.length === this.SecuritiesTypeList.length) {
        // this.lang.CURRENT == "Tha" ? selectedText = 'ทั้งหมด   ' : selectedText = 'All';
        selectedTextSecuritiesType = '';
      }
    });

    let selectedTextSecuritiesStatus = '';
    this.searchForm.controls.SecuritiesStatus.value.forEach(element => {
      if (element.Active) {
        selected2.push(element.StatusValue);
        selectedTextSecuritiesStatus += this.lang.CURRENT === 'Tha' ? element.TextTha + ', ' : element.TextEng + ', ';
      }
      if (selected2.length === this.SecuritiesStatusList.length) {
        // this.lang.CURRENT == "Tha" ? selectedText = 'ทั้งหมด   ' : selectedText = 'All';
        selectedTextSecuritiesStatus = '';
      }
    });

    
    this.reportParam.SecuritiesStatusText = selectedTextSecuritiesStatus.substring(0, selectedTextSecuritiesStatus.length - 2);
    this.reportParam.SecuritiesTypeText= selectedTextSecuritiesType.substring(0, selectedTextSecuritiesType.length - 2);
    this.prepareSave();
    this.sv.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    ).subscribe((res) => {
      if (res) {
        this.OpenWindow(res, this.reportParam.ReportName);
      }
    });
  }

  get securitiesType(): FormArray {
    return this.searchForm.get('SecuritiesType') as FormArray;
  }

  securitiesTypeForm(item: SecuritiesType): FormGroup {
    const fg = this.fb.group({
      StatusValue: null,
      TextTha: null,
      TextEng: null,
      Active: false,
    });

    fg.patchValue(item, { emitEvent: false });
    return fg;
  }


  get securitiesStatus(): FormArray {
    return this.searchForm.get('SecuritiesStatus') as FormArray;
  }

  securitiesStatusForm(item: SecuritiesStatus): FormGroup {
    const fg = this.fb.group({
      StatusValue: null,
      TextTha: null,
      TextEng: null,
      Active: false,
    });

    fg.patchValue(item, { emitEvent: false });
    return fg;
  }
  getText(value, list) {
    if (value) {
      const textData = list.find(data => {
        return data.Value === value;
      });
      return this.lang.CURRENT === 'Tha' ? textData.TextTha : textData.TextEng;
    }
  }





}
