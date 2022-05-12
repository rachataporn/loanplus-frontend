import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp22Service, ReportParam, SaveL } from '@app/feature/lo/lorp22/lorp22.service';
import { Page, ModalService, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import value from '*.json';
import { Lorp22LookupCustomerCodeComponent } from './lorp22-lookup-customer-code.component';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
@Component({
  templateUrl: './lorp22.component.html'
})

export class Lorp22Component implements OnInit, OnDestroy {
  Lorp22LookupCustomerCodeComponent = Lorp22LookupCustomerCodeComponent;
  statusPage: boolean;
  searchForm: FormGroup;
  reportParam = {} as ReportParam;
  saveLog = {} as SaveL;
  fromCustomerCodeList = [];
  toCustomerCodeList = [];
  groupList = [];
  srcResult = null;
  printing: boolean;
  submitted: boolean;
  focusToggle: boolean;
  reportFormat: string;
  exportType = [{ Value: 'pdf', TextTha: 'PDF', TextEng: 'PDF', active: true }
  , { Value: 'xlsx', TextTha: 'EXCEL', TextEng: 'EXCEL', active: true }]
  now = new Date();
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Lorp22Service,
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
      FromCustomerCode: null,
      ToCustomerCode: null,
      Group: null,
      ExportType: 'pdf'
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('LORP22');
    if (saveData) { this.searchForm.patchValue(saveData); }

    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });

    this.route.data.subscribe((data) => {
      this.fromCustomerCodeList = this.toCustomerCodeList = data.lorp22.CustomerCode;
      this.groupList = data.lorp22.Group;
      // this.bindDropDownList();
    });
  }

  bindDropDownList() {
    this.filterFromCustomerCodeList(true);
    this.filterToCustomerCodeList(true);
    this.filterGroupList(true);
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'LORP22');
  }

  filterFromCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.fromCustomerCodeList);
    this.fromCustomerCodeList = [...this.fromCustomerCodeList];
  }

  filterToCustomerCodeList(filter?: boolean) {
    this.selectFilter.SortByLang(this.toCustomerCodeList);
    this.toCustomerCodeList = [...this.toCustomerCodeList];
  }

  filterGroupList(filter?: boolean) {
    this.selectFilter.SortByLang(this.groupList);
    this.groupList = [...this.groupList];
  }

  prepareSaveLog() {

  }

  print() {
    // Object.assign(this.reportParam, this.searchForm.value);
    this.printing = true;
    this.submitted = true;
    var formCusText: string;
    var toCusText: string;
    var groupText: string;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    const customerCode = this.getLocaleCompare(this.searchForm.controls.FromCustomerCode.value,
      this.searchForm.controls.ToCustomerCode.value);
    if (customerCode > 0) {
      return this.as.warning('', 'Message.LO00006', ['Label.LORP22.FromCustomerCode', 'Label.LORP22.ToCustomerCode']);
    }
    this.searchForm.controls.FromCustomerCode.value ? formCusText = this.getText(this.searchForm.controls.FromCustomerCode.value, this.fromCustomerCodeList) : formCusText = 'ทั้งหมด';
    this.searchForm.controls.ToCustomerCode.value ? toCusText = this.getText(this.searchForm.controls.ToCustomerCode.value, this.toCustomerCodeList) : toCusText = 'ทั้งหมด';
    this.searchForm.controls.Group.value ? groupText = this.getText(this.searchForm.controls.Group.value, this.groupList) : groupText = 'ทั้งหมด';
    this.saveLog.LogSystem = 'LO';
    this.saveLog.LogDiscription = 'ขอดูข้อมูลบัตรประชาชนและเบอร์โทรศัพท์ จากหน้า รายงานรายชื่อลูกค้าสมาชิก ' + ['ตั้งแต่ผู้กู้'] + ' ' + formCusText + ' - ' + ['ถึงผู้กู้'] + ' ' + toCusText + ' กลุ่มอาชีพ ' + groupText;
    this.saveLog.LogItemGroupCode = 'SaveLog';
    this.saveLog.LogItemCode = '3';
    this.saveLog.LogProgram = 'LORP22';

    this.reportParam.FromCustomerCode = this.searchForm.controls.FromCustomerCode.value;
    this.reportParam.ToCustomerCode = this.searchForm.controls.ToCustomerCode.value;
    this.reportParam.ReportName = 'LORP22';
    this.reportParam.ExportType = this.searchForm.controls.ExportType.value;
    this.reportParam.GroupOfCareer = this.searchForm.controls.Group.value;
    this.reportParam.FromCustomerCodeText = this.getText(this.searchForm.controls.FromCustomerCode.value, this.fromCustomerCodeList);
    this.reportParam.ToCustomerCodeText = this.getText(this.searchForm.controls.ToCustomerCode.value, this.toCustomerCodeList);
    this.reportParam.GroupOfCareerText = this.getText(this.searchForm.controls.Group.value, this.groupList);

    // this.ls.saveLog(this.saveLog).pipe(
    //   finalize(() => {
    //   })
    // ).subscribe((res) => {
      this.ls.generateReport(this.reportParam).pipe(
        finalize(() => {
          this.submitted = false;
          this.printing = false;
        })
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
    // });
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
