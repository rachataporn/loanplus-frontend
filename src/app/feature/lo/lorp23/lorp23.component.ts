import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp23Service, ReportParam } from '@app/feature/lo/lorp23/lorp23.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Lorp23LookupLoanContractComponent } from './lorp23-lookup-contractcode.component';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
@Component({
  templateUrl: './lorp23.component.html'
})

export class Lorp23Component implements OnInit {

  Lorp23LookupLoanContractContent = Lorp23LookupLoanContractComponent;

  reportParam = {} as ReportParam
  menuForm: FormGroup;
  count: Number = 3;
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;

  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  now = new Date();
  reportTypeList = [];
  exportType = [{ Value: 'pdf', TextTha: 'PDF', TextEng: 'PDF', active: true }
    , { Value: 'xlsx', TextTha: 'EXCEL', TextEng: 'EXCEL', active: true }]
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private sv: Lorp23Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      contractNo: [null, Validators.required],
      reportType: [null, Validators.required],
      ExportType: 'pdf'
    });
  }

  ngOnInit() {
    // const saveData = this.saveData.retrive('lomt01');
    // if (saveData) this.searchForm.patchValue(saveData);
    // this.search();

    this.route.data.subscribe((data) => {
      this.reportTypeList = data.lorp23.master.ReportType;
    });
  }

  ngOnDestroy() {
    // this.saveData.save(this.searchForm.value, 'lomt01');
  }

  search() { }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.reportParam.ContractNo = this.searchForm.controls.contractNo.value;
    this.reportParam.ReportName = 'LORP23_' + this.searchForm.controls.reportType.value;
    this.reportParam.ExportType = this.searchForm.controls.ExportType.value;

    this.gennarateReport();
  }

  gennarateReport() {
    this.sv.generateReport(this.reportParam).pipe(
      finalize(() => { this.submitted = false; })
    ).subscribe((res) => {
      if (res) {
        if(this.searchForm.controls.ExportType.value == 'pdf'){
          this.srcResult = res;
        }else{
          this.OpenWindow(res, this.reportParam.ReportName);
          this.srcResult = null;
        }
        
      }
    });
  }

  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + this.reportParam.ExportType + ";base64," + data;
    doc.download = name + "_" + "Report-" + ((Number(moment(this.now).format('YYYY')) - 543) + "-") + moment(this.now).format('MM-DD') + "." + this.reportParam.ExportType;
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
