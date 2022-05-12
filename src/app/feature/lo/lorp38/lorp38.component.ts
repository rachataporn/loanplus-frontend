import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lorp38Service, ReportParam } from './lorp38.service';
import { LangService } from '@app/core';
import { SelectFilterService } from '../../../shared/service/select-filter.service';

@Component({
  templateUrl: './lorp38.component.html'
})

export class Lorp38Component implements OnInit {
  searchForm: FormGroup;
  provinceList = [];
  branchList = [];
  year = [{ "Text": "2020", "Value": "2020" }, { "Text": "2021", "Value": "2021" }, { "Text": "2022", "Value": "2022" }, { "Text": "2023", "Value": "2023" }];
  monthList = [{ Value: '01', TextTha: 'มกราคม', TextEng: 'January', active: true },
  { Value: '02', TextTha: 'กุมภาพันธ์', TextEng: 'February', active: true },
  { Value: '03', TextTha: 'มีนาคม', TextEng: 'March', active: true },
  { Value: '04', TextTha: 'เมษายน', TextEng: 'April', active: true },
  { Value: '05', TextTha: 'พฤษภาคม', TextEng: 'May', active: true },
  { Value: '06', TextTha: 'มิถุนายน', TextEng: 'June', active: true },
  { Value: '07', TextTha: 'กรกฎาคม', TextEng: 'July', active: true },
  { Value: '08', TextTha: 'สิงหาคม', TextEng: 'August', active: true },
  { Value: '09', TextTha: 'กันยายน', TextEng: 'September', active: true },
  { Value: '10', TextTha: 'ตุลาคม', TextEng: 'October', active: true },
  { Value: '11', TextTha: 'พฤษจิกายน', TextEng: 'November', active: true },
  { Value: '12', TextTha: 'ธันวาคม', TextEng: 'December', active: true }];
  loanContractType = [];
  reportParam = {} as ReportParam;
  submitted: boolean;
  focusToggle: boolean;
  printing: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ls: Lorp38Service,
    public lang: LangService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
  ) {
    this.createForm();
  }


  createForm() {
    this.searchForm = this.fb.group({
      ProvinceCode: null,
      FromBranchCode: null,
      ToBranchCode: null,
      ContractType: null,
      Year: [null, Validators.required],
      Month: null
    });
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropdownlist();
    });

    this.route.data.subscribe((data) => {
      this.provinceList = data.lorp38.ProvinceList;
      this.branchList = data.lorp38.BranchList;
      this.loanContractType = data.lorp38.ContractTypeList;
    })
    this.searchForm.controls.ContractType.setValue('M');
    this.bindDropdownlist();
  }

  bindDropdownlist() {
    this.selectFilter.SortByLang(this.provinceList);
    this.selectFilter.FilterActive(this.provinceList);
    this.provinceList = [...this.provinceList];

    this.selectFilter.SortByLang(this.branchList);
    this.selectFilter.FilterActive(this.branchList);
    this.branchList = [...this.branchList];

    this.selectFilter.SortByLang(this.loanContractType);
    this.loanContractType = [...this.loanContractType];
  }

  get ContractType() {
    return this.searchForm.controls.ContractType.value;
  }

  print() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.reportParam.Year = this.searchForm.controls.Year.value;
    this.reportParam.ProvinceId = this.searchForm.controls.ProvinceCode.value;
    this.reportParam.CompanyCodeFrom = this.searchForm.controls.FromBranchCode.value;
    this.reportParam.CompanyCodeTo = this.searchForm.controls.ToBranchCode.value;
    this.reportParam.Month = this.searchForm.controls.Month.value == null ? '12' : this.searchForm.controls.Month.value;

    if (this.searchForm.controls.ContractType.value == 'M') {
      this.reportParam.MainContractType = true;
    } else {
      this.reportParam.MainContractType = false;
    }

    this.printing = true;
    this.ls.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.submitted = false;
        this.printing = false;
      })
    )
      .subscribe((res) => {
        if (res) {
          this.OpenWindow(res)
        }
      });
  }

  async OpenWindow(data) {
    let doc = document.createElement("a");
    doc.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + data;
    doc.download = "NPL_Report_Accounting"
    doc.click();
  }
}
