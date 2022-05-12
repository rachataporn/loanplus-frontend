import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp33Service, ReportParam, ContractStatus } from '@app/feature/lo/lorp33/lorp33.service';
import { Page, ModalService, SelectFilterService, RowState, ModalRef } from '@app/shared';
import { AlertService, LangService, SaveDataService, Size } from '@app/core';

@Component({
  templateUrl: './lorp33.component.html'
})

export class Lorp33Component implements OnInit, OnDestroy {
  @ViewChild('AlertConfirm') alertConfirm: TemplateRef<any>;
  statusPage: boolean;
  searchForm: FormGroup;
  fromBranchList = [];
  toBranchList = [];
  loanTypeList = [];
  fromLoanTypeList = [];
  toLoanTypeList = [];
  customerCodeList = [];
  reportFormatList = [];
  reportParam = {} as ReportParam;
  srcResult = null;
  printing: boolean;
  now = new Date();
  submitted: boolean;
  focusToggle: boolean;
  loanData: any;
  page = new Page();
  list = [];
  alertPopup: ModalRef;

  minDate = new Date("January 01, 2021 00:00:00");
  exportType = [
    { Value: '1', TextTha: 'รายวัน', TextEng: 'รายวัน', active: true }
    , { Value: '2', TextTha: 'รายเดือน', TextEng: 'รายเดือน', active: true }
    , { Value: '3', TextTha: 'รายปี', TextEng: 'รายปี', active: true }
  ]

  mount = [
    { Value: '1', TextTha: 'มกราคม', TextEng: 'มกราคม', active: true }
    , { Value: '2', TextTha: 'กุมภาพันธ์', TextEng: 'กุมภาพันธ์', active: true }
    , { Value: '3', TextTha: 'มีนาคม', TextEng: 'มีนาคม', active: true }
    , { Value: '4', TextTha: 'เมษายน', TextEng: 'เมษายน', active: true }
    , { Value: '5', TextTha: 'พฤษภาคม', TextEng: 'พฤษภาคม', active: true }
    , { Value: '6', TextTha: 'มิถุนายน', TextEng: 'มิถุนายน', active: true }
    , { Value: '7', TextTha: 'กรกฎาคม', TextEng: 'กรกฎาคม', active: true }
    , { Value: '8', TextTha: 'สิงหาคม', TextEng: 'สิงหาคม', active: true }
    , { Value: '9', TextTha: 'กันยายน', TextEng: 'กันยายน', active: true }
    , { Value: '10', TextTha: 'ตุลาคม', TextEng: 'ตุลาคม', active: true }
    , { Value: '11', TextTha: 'พฤศจิกายน', TextEng: 'พฤศจิกายน', active: true }
    , { Value: '12', TextTha: 'ธันวาคม', TextEng: 'ธันวาคม', active: true }
  ]

  year = [
    { Value: new Date().getFullYear(), TextTha: new Date().getFullYear() + 543, TextEng: new Date().getFullYear() + 543, active: true }
  ]


  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp33Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      FromBranchCode: null,
      ToBranchCode: null,
      StartDate: [null, Validators.required],
      EndDate: [null, Validators.required],
      FromMount: [null, Validators.required],
      ToMount: [null, Validators.required],
      FromYear: [null, Validators.required],
      ToYear: [null, Validators.required],
      ExportType: [null, Validators.required]
    });

    this.searchForm.controls.FromBranchCode.valueChanges
      .subscribe(value => {
        if (value) {

        } else {
          this.searchForm.controls.ToBranchCode.setValue(null, { emitEvent: false })
        }
      })
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.fromBranchList = data.lorp33;
      this.toBranchList = data.lorp33;
    });

    this.searchForm.controls.StartDate.enable();
    this.searchForm.controls.EndDate.enable();
    this.searchForm.controls.FromMount.disable();
    this.searchForm.controls.ToMount.disable();
    this.searchForm.controls.FromYear.disable();
    this.searchForm.controls.ToYear.disable();

    this.search();
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP33');
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    var temp1 = new Date(this.searchForm.controls.StartDate.value);
    var temp2 = new Date(this.searchForm.controls.EndDate.value);
    this.reportParam.FromBranchCode = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.ToBranchCode = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.FromMount = this.searchForm.controls.FromMount.value;
    this.reportParam.ToMount = this.searchForm.controls.ToMount.value;
    this.reportParam.FromYear = this.searchForm.controls.FromYear.value;
    this.reportParam.ToYear = this.searchForm.controls.ToYear.value;
    this.reportParam.StartDate = this.searchForm.controls.StartDate.value;
    this.reportParam.EndDate = this.searchForm.controls.EndDate.value;
    this.reportParam.StartDateString = temp1.toDateString();
    this.reportParam.EndDateString = temp2.toDateString();

    if (this.searchForm.controls.ExportType.value == 1) {
      this.reportParam.ReportName = 'LORP33_Day';
    } else if (this.searchForm.controls.ExportType.value == 2) {
      this.reportParam.ReportName = 'LORP33_Mount';
    } else if (this.searchForm.controls.ExportType.value == 3) {
      this.reportParam.ReportName = 'LORP33_Year';
    }

    this.reportParam.ExportType = 'xlsx'
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        this.alertPopup = this.modal.open(this.alertConfirm, Size.medium);
      });
  }

  async OpenWindow(data, name) {
    let doc = document.createElement("a");
    doc.href = "data:application/" + this.reportParam.ExportType + ";base64," + data;
    doc.download = name + "." + this.reportParam.ExportType;
    doc.click();
  }

  async dowload(data) {
    let doc = document.createElement("a");
    doc.href = data;
    doc.click();
  }

  changeType() {
    this.searchForm.controls.StartDate.reset();
    this.searchForm.controls.EndDate.reset();
    this.searchForm.controls.FromMount.reset();
    this.searchForm.controls.ToMount.reset();
    this.searchForm.controls.FromYear.reset();
    this.searchForm.controls.ToYear.reset();
    if (this.searchForm.controls.ExportType.value == 1) {
      this.searchForm.controls.StartDate.enable();
      this.searchForm.controls.EndDate.enable();
      this.searchForm.controls.FromMount.disable();
      this.searchForm.controls.ToMount.disable();
      this.searchForm.controls.FromYear.disable();
      this.searchForm.controls.ToYear.disable();
    } else if (this.searchForm.controls.ExportType.value == 2) {
      this.searchForm.controls.StartDate.disable();
      this.searchForm.controls.EndDate.disable();
      this.searchForm.controls.FromMount.enable();
      this.searchForm.controls.ToMount.enable();
      this.searchForm.controls.FromYear.disable();
      this.searchForm.controls.ToYear.disable();
    } else if (this.searchForm.controls.ExportType.value == 3) {
      this.searchForm.controls.StartDate.disable();
      this.searchForm.controls.EndDate.disable();
      this.searchForm.controls.FromMount.disable();
      this.searchForm.controls.ToMount.disable();
      this.searchForm.controls.FromYear.enable();
      this.searchForm.controls.ToYear.enable();
    } else {
      this.searchForm.controls.StartDate.disable();
      this.searchForm.controls.EndDate.disable();
      this.searchForm.controls.FromMount.disable();
      this.searchForm.controls.ToMount.disable();
      this.searchForm.controls.FromYear.disable();
      this.searchForm.controls.ToYear.disable();
    }
  }

  search() {
    var reportType = '';
    if (this.searchForm.controls.ExportType.value == 1) {
      reportType = 'LORP33_Day';
    } else if (this.searchForm.controls.ExportType.value == 2) {
      reportType = 'LORP33_Mount';
    } else if (this.searchForm.controls.ExportType.value == 3) {
      reportType = 'LORP33_Year';
    }

    this.ls.getReportList(this.searchForm.value, this.page, reportType).pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
      .subscribe((res) => {
        if (res) {
          this.list = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        }
      });
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.search();
  }

  getMonth(data) {
    const value = data ? this.mount.find(x => x.Value == data) : null
    return data ? value.TextTha : null
  }

  getYear(data) {
    const value = data ? this.year.find(x => x.Value == data) : null
    return data ? value.TextTha : null
  }

  close() {
    this.alertPopup.hide();
    this.search();
  }
}
