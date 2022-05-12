
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlertService, SaveDataService, LangService } from '@app/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ModalService, Page, SelectFilterService, RowState, Size, ModelRef } from '@app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Dbmt07Service, Employee, EmployeeMgmTarget } from './dbmt07.service';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  templateUrl: './dbmt07-detail.component.html'
})
export class Dbmt07DetailComponent implements OnInit {
  @ViewChild('genPlanTarget') tpl: TemplateRef<any>;
  employee: Employee = {} as Employee;
  // targetTemp: EmployeeMgmTarget = {} as EmployeeMgmTarget;
  employeeForm: FormGroup;
  genarateForm: FormGroup;

  modalEdit: ModelRef;

  master: {
    PrefixId: any[]
    , CompanyCode: any[]
    , DepartmentName: any[]
    , PositionCode: any[]
    , ReligionCode: any[]
    , NationalityCode: any[]
    , RaceCode: any[]
    , CountryCode: any[]
    , ProvinceId: any[]
    , DistrictId: any[]
    , SubdistrictId: any[]
    , PostalcodeId: any[]
  };

  PrefixId = [];
  CompanyCode = [];
  DepartmentCode = [];
  PositionCode = [];
  ReligionCode = [];
  NationalityCode = [];
  RaceCode = [];
  CountryCode = [];
  ProvinceId = [];
  DistrictId = [];
  SubdistrictId = [];
  PostalcodeId = [];


  country = [];
  ProvinceData = [];
  province = [];
  DistrictData = [];
  districtData = [];
  district = [];
  SubDistrictData = [];
  subdistrict = [];
  subdistrictId = [];
  PostalCodeData = [];
  postalCode = [];

  departmentcode = [];
  DepartmentData = [];
  CompanyData = [];
  companycode = [];

  checkSearchingYear: boolean;
  yearDisable: boolean;
  YearList = [];
  MounthList = [];
  checkModal = false;


  savingDis = false;
  submitted = false;
  submittedGen = false;
  saving = false;
  focusToggle = false;
  focusToggleGen = false;
  data = '';
  page = new Page();
  statusPage: boolean;
  flagClose = '';
  constructor(
    private dbmt07Service: Dbmt07Service,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private filter: SelectFilterService
  ) { this.createForm() }

  createForm() {
    this.employeeForm = this.fb.group({
      EmployeeCode: [null, Validators.required],
      PrefixId: [null, Validators.required],
      FirstName: [null, Validators.required],
      LastName: [null, Validators.required],
      FirstNameEn: [null, [Validators.required, Validators.pattern('^[A-Z][a-z]+')]],
      LastNameEn: [null, [Validators.required, Validators.pattern('^[A-Z][a-z]+')]],
      CompanyCode: [null, Validators.required],
      DepartmentCode: [null, Validators.required],
      PositionCode: [null, Validators.required],
      IdCard: [null, Validators.required],
      PassportNo: null,
      Mobile: [null, Validators.pattern('[0-9-#,]*')],
      ReligionCode: null,
      NationalityCode: null,
      RaceCode: null,
      CountryCode: null,
      ProvinceId: null,
      DistrictId: null,
      SubDistrictId: null,
      Address: null,
      PostalCodeId: null,
      Email: [null, Validators.required],
      Active: true,
      Year: new Date().getFullYear() + 543,
      EmployeeMgmTarget: this.fb.array([]),
      IsMobile: false
    });

    this.genarateForm = this.fb.group({
      Year: [null, Validators.required],
      Target: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.filterDropDown();
    });

    this.route.data.subscribe((data) => {
      this.employee = data.employee.detail;
      this.PrefixId = data.employee.master.PrefixId;
      this.CompanyCode = data.employee.master.CompanyCode;
      this.DepartmentCode = data.employee.master.DepartmentName;
      this.PositionCode = data.employee.master.PositionCode;
      this.ReligionCode = data.employee.master.ReligionCode;
      this.NationalityCode = data.employee.master.NationalityCode;
      this.RaceCode = data.employee.master.RaceCode;
      this.CountryCode = data.employee.master.CountryCode;
      this.ProvinceId = data.employee.master.ProvinceId;
      this.MounthList = data.employee.master.Mounth;
      // this.DistrictId = data.employee.master.DistrictId;
      // this.subdistrictId = data.employee.master.SubdistrictId;
      // this.PostalcodeId = data.employee.master.PostalcodeId;
      this.rebuildForm();
    });
    this.checkDropDown();

    if (this.employeeForm.controls.ProvinceId.value || this.employeeForm.controls.CountryCode.value) {
      this.employeeForm.controls.ProvinceId.enable();
    } else {
      this.employeeForm.controls.ProvinceId.disable()
    }

    if (this.employeeForm.controls.DistrictId.value || this.employeeForm.controls.ProvinceId.value) {
      this.employeeForm.controls.DistrictId.enable();
    } else {
      this.employeeForm.controls.DistrictId.disable()
    }

    if (this.employeeForm.controls.SubDistrictId.value || this.employeeForm.controls.DistrictId.value) {
      this.employeeForm.controls.SubDistrictId.enable();
    } else {
      this.employeeForm.controls.SubDistrictId.disable()
    }

    if (this.employeeForm.controls.PostalCodeId.value || this.employeeForm.controls.SubDistrictId.value) {
      this.employeeForm.controls.PostalCodeId.enable();
    } else {
      this.employeeForm.controls.PostalCodeId.disable();
    }

    this.buildYearList();
  }

  get FirstNameEn() {
    return this.employeeForm.controls.FirstNameEn;
  }

  get LastNameEn() {
    return this.employeeForm.controls.LastNameEn;
  }

  rebuildForm() {
    this.employeeForm.markAsPristine();
    if (this.employee.RowVersion) {
      this.employeeForm.patchValue(this.employee);
      this.employeeForm.controls.EmployeeCode.disable();
      this.employeeForm.controls.CompanyCode.disable();
      if (this.employeeForm.controls.PostalCodeId.value) {
        this.employeeForm.controls.PostalCodeId.setValue((this.employee.PostalCodeId).toString());
      }
      this.rebuildTarget();
    }

    this.filterDropDown();
  }

  rebuildTarget() {
    setTimeout(() => {
      this.employeeForm.setControl('EmployeeMgmTarget', this.fb.array(
        this.employee.EmployeeMgmTarget.map((detail) => this.createEmployeeMgmTargetForm(detail))
      ));
    });
    this.employeeForm.controls.Year.enable();
  }

  createEmployeeMgmTargetForm(item: EmployeeMgmTarget): FormGroup {
    const fg = this.fb.group({
      EmployeeMgmTargetId: null,
      CompanyCode: null,
      EmployeeCode: null,
      Year: [null, Validators.required],
      MonthCode: [null, Validators.required],
      Target: [null, Validators.required],
      RowVersion: 0,
      RowState: RowState.Add
    });
    fg.patchValue(item, { emitEvent: false });
    fg.controls.Year.disable();
    fg.controls.MonthCode.disable();

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState === RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    );

    return fg;
  }

  filterDropDown() {
    this.getDistrict(this.employee.ProvinceId, this.employee.DistrictId);
    // this.getDistrict(this.employee.DistrictId);
    this.bindDropDownCountry(true);
    this.bindDropDownProvince(true);
    this.bindDropDownDistrict(true);
    this.bindDropDownSubDistrict(true);
    this.bindDropDownPostalcode(true);
    this.bindDropDownCompany(true);
    this.bindDropDownDepartmentName(true);
    this.filterPrefixId(true);
    this.filterReligionCode(true);
    this.filterNationalityCode(true);
    this.filterRaceCode(true);
    this.filterPositionCode(true);
  }

  prepareSave(values: Object) {
    Object.assign(this.employee, values);
    this.employee.EmployeeMgmTarget = [];

    const getTarget = this.EmployeeMgmTarget.getRawValue();
    const targetAdding = getTarget.filter(function (item) {
      return item.RowState === RowState.Add || item.RowState === RowState.Edit;
    });

    this.employee.EmployeeMgmTarget = this.employee.EmployeeMgmTarget.concat(targetAdding);
  }

  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }

    this.saving = true;
    this.prepareSave(this.employeeForm.getRawValue());
    this.dbmt07Service.CheckSensitiveCase(this.employee).pipe(
      finalize(() => { })).subscribe((res) => {
        if (res) {
          this.as.warning('', 'Message.STD00032');
          this.saving = false;
        } else {
          this.onSave();
          // this.getYearList();
        }
      });
  }

  onSave() {
    this.saving = true;
    this.dbmt07Service.saveEmployee(this.employee).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: Employee) => {
        if (res) {
          this.employee = res;
          this.rebuildForm();
          this.as.success("", "Message.STD00006");
        }
      });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.employeeForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/db/dbmt07'], { skipLocationChange: true });
  }

  bindDropDownCountry(filter?: boolean) {
    if (filter) {
      if (this.employeeForm.controls.EmployeeCode.value) {
        this.country = this.filter.FilterActiveByValue(this.CountryCode, this.employeeForm.controls.CountryCode.value);
      }
      else {
        this.country = this.filter.FilterActive(this.CountryCode);
      }
    }
    this.filter.SortByLang(this.country);
    this.country = [...this.CountryCode];
  }

  bindDropDownProvince(filter?: boolean) {
    if (filter) {
      if (this.employeeForm.controls.EmployeeCode.value) {
        this.province = this.filter.FilterActiveByValue(this.ProvinceId, this.employeeForm.controls.ProvinceId.value);
      }
      else {
        this.province = this.filter.FilterActive(this.ProvinceId);
      }
    }
    this.filter.SortByLang(this.province);
    this.ProvinceData = [...this.ProvinceId];
  }

  bindDropDownDistrict(filter?: boolean) {
    if (filter) {
      if (this.employeeForm.controls.EmployeeCode.value) {
        this.district = this.filter.FilterActiveByValue(this.DistrictId, this.employeeForm.controls.DistrictId.value);
      }
      else {
        this.district = this.filter.FilterActive(this.DistrictId);
      }
    }
    this.filter.SortByLang(this.district);
    this.DistrictData = [...this.DistrictId];
  }

  bindDropDownSubDistrict(filter?: boolean) {
    if (filter) {
      if (this.employeeForm.controls.EmployeeCode.value) {
        this.subdistrict = this.filter.FilterActiveByValue(this.subdistrictId, this.employeeForm.controls.SubDistrictId.value);
      }
      else {
        this.subdistrict = this.filter.FilterActive(this.subdistrictId);
      }
    }
    this.filter.SortByLang(this.subdistrict);
    this.SubDistrictData = [...this.SubdistrictId];
  }

  bindDropDownPostalcode(filter?: boolean) {
    if (filter) {
      if (this.employeeForm.controls.EmployeeCode.value) {
        this.postalCode = this.filter.FilterActiveByValue(this.PostalcodeId, this.employeeForm.controls.PostalCodeId.value);
      }
      else {
        this.postalCode = this.filter.FilterActive(this.PostalcodeId);
      }
    }
    this.filter.SortByLang(this.postalCode);
    this.PostalCodeData = [...this.PostalcodeId];
  }

  bindDropDownCompany(filter?: boolean) {
    if (filter) {
      if (this.employeeForm.controls.EmployeeCode.value) {
        this.CompanyCode = this.filter.FilterActiveByValue(this.CompanyCode, this.employeeForm.controls.CompanyCode.value);
      }
      else {
        this.CompanyCode = this.filter.FilterActive(this.CompanyCode);
      }
    }
    this.filter.SortByLang(this.CompanyCode);
    this.CompanyData = [...this.CompanyCode];
  }

  bindDropDownDepartmentName(filter?: boolean) {
    if (filter) {
      if (this.employeeForm.controls.EmployeeCode.value) {
        this.DepartmentCode = this.filter.FilterActiveByValue(this.DepartmentCode, this.employeeForm.controls.DepartmentCode.value);
      }
      else {
        this.DepartmentCode = this.filter.FilterActive(this.DepartmentCode);
      }
    }
    this.filter.SortByLang(this.DepartmentCode);
    this.DepartmentData = [...this.DepartmentCode];
  }

  filterPrefixId(filter?: boolean) {
    if (filter) {
      const detail = this.employeeForm.value;
      if (detail) {
        this.PrefixId = this.filter.FilterActiveByValue(this.PrefixId, detail.PrefixId);
      }
      else {
        this.PrefixId = this.filter.FilterActive(this.PrefixId);
      }
    }
    this.filter.SortByLang(this.PrefixId);
    this.PrefixId = [...this.PrefixId];
  }

  filterReligionCode(filter?: boolean) {
    if (filter) {
      const detail = this.employeeForm.value;
      if (detail) {
        this.ReligionCode = this.filter.FilterActiveByValue(this.ReligionCode, detail.ReligionCode);
      }
      else {
        this.ReligionCode = this.filter.FilterActive(this.ReligionCode);
      }
    }
    this.filter.SortByLang(this.ReligionCode);
    this.ReligionCode = [...this.ReligionCode];
  }

  filterNationalityCode(filter?: boolean) {
    if (filter) {
      const detail = this.employeeForm.value;
      if (detail) {
        this.NationalityCode = this.filter.FilterActiveByValue(this.NationalityCode, detail.NationalityCode);
      }
      else {
        this.NationalityCode = this.filter.FilterActive(this.NationalityCode);
      }
    }
    this.filter.SortByLang(this.NationalityCode);
    this.NationalityCode = [...this.NationalityCode];
  }

  filterRaceCode(filter?: boolean) {
    if (filter) {
      const detail = this.employeeForm.value;
      if (detail) {
        this.RaceCode = this.filter.FilterActiveByValue(this.RaceCode, detail.RaceCode);
      }
      else {
        this.RaceCode = this.filter.FilterActive(this.RaceCode);
      }
    }
    this.filter.SortByLang(this.RaceCode);
    this.RaceCode = [...this.RaceCode];
  }

  filterPositionCode(filter?: boolean) {
    if (filter) {
      const detail = this.employeeForm.value;
      if (detail) {
        this.PositionCode = this.filter.FilterActiveByValue(this.PositionCode, detail.PositionCode);
      }
      else {
        this.PositionCode = this.filter.FilterActive(this.PositionCode);
      }
    }
    this.filter.SortByLang(this.PositionCode);
    this.PositionCode = [...this.PositionCode];
  }

  checkDropDown() {
    this.ProvinceData = this.province.filter(data => data.CountryCode == this.employeeForm.controls['CountryCode'].value);
    if (this.ProvinceData.length > 0) {
      this.employeeForm.controls.ProvinceId.enable();
      this.employeeForm.controls.DistrictId.enable();
      this.employeeForm.controls.SubDistrictId.enable();
      this.employeeForm.controls.PostalCodeId.enable();
    } else {
      this.employeeForm.controls.ProvinceId.disable();
      this.employeeForm.controls.DistrictId.disable();
      this.employeeForm.controls.SubDistrictId.disable();
      this.employeeForm.controls.PostalCodeId.disable();
    }

    this.DistrictData = this.district.filter(data => data.ProvinceId == this.employeeForm.controls['ProvinceId'].value);
    if (this.DistrictData.length > 0) {
      this.employeeForm.controls.DistrictId.enable();
      this.employeeForm.controls.SubDistrictId.enable();
      this.employeeForm.controls.PostalCodeId.enable();
    } else {
      this.employeeForm.controls.DistrictId.disable();
      this.employeeForm.controls.SubDistrictId.disable();
      this.employeeForm.controls.PostalCodeId.disable();
    }

    this.SubDistrictData = this.subdistrict.filter(data => data.DistrictId == this.employeeForm.controls['DistrictId'].value);
    if (this.DistrictData.length > 0) {
      this.employeeForm.controls.SubDistrictId.enable();
      this.employeeForm.controls.PostalCodeId.enable();
    } else {
      this.employeeForm.controls.SubDistrictId.disable();
      this.employeeForm.controls.PostalCodeId.disable();
    }

    this.PostalCodeData = this.postalCode.filter(data => data.DistrictId == this.employeeForm.controls['DistrictId'].value);
    if (this.PostalCodeData.length > 0) {
      this.employeeForm.controls.PostalCodeId.enable();
    } else {
      this.employeeForm.controls.PostalCodeId.disable();
    }

    this.DepartmentData = this.DepartmentCode.filter(data => data.CompanyCode == this.employeeForm.controls['CompanyCode'].value);
    if (this.DepartmentData.length > 0) {

      this.employeeForm.controls.PostalCodeId.enable();
    } else {
      this.employeeForm.controls.PostalCodeId.disable();
    }
  }

  changeemployeeCode() {
    if (this.employeeForm.controls.EmployeeCode.value) {
      this.employeeForm.controls.EmployeeCode.setValue(this.employeeForm.controls.EmployeeCode.value.trim(), { eventEmit: false });
    }
  }

  changeCountry() {
    this.ProvinceData = [];
    this.DistrictData = [];
    this.SubDistrictData = [];
    this.employeeForm.controls.ProvinceId.setValue(null);
    this.employeeForm.controls.DistrictId.setValue(null);
    this.employeeForm.controls.SubDistrictId.setValue(null);
    this.employeeForm.controls.PostalCodeId.setValue(null);
    this.ProvinceData = this.province.filter(data => data.CountryCode == this.employeeForm.controls['CountryCode'].value);
    if (this.ProvinceData.length > 0) {
      this.employeeForm.controls.ProvinceId.enable();
    } else {
      this.employeeForm.controls.ProvinceId.disable();
      this.employeeForm.controls.DistrictId.disable();
      this.employeeForm.controls.SubDistrictId.disable();
      this.employeeForm.controls.PostalCodeId.disable();
    }
  }

  getDistrict(ProvinceId, DistrictId) {
    if (ProvinceId) {
      this.dbmt07Service.getDistrictDDL(ProvinceId).pipe(
        finalize(() => {
          if (this.DistrictData.length > 0 && ProvinceId) {
            this.employeeForm.controls.DistrictId.enable();
            this.employeeForm.controls.SubDistrictId.disable();
          } else {
            this.employeeForm.controls.DistrictId.disable();
            this.employeeForm.controls.SubDistrictId.disable();
            this.employeeForm.controls.PostalCodeId.disable();
          }
          if (DistrictId) {
            this.getSubDistrict(DistrictId);
          }
        })).subscribe((res) => {
          this.DistrictData = res.DistrictList;
        });

      this.dbmt07Service.getPostalCodeDDL(ProvinceId).pipe(
        finalize(() => {
          if (this.PostalCodeData.length > 0 && ProvinceId) {
            this.employeeForm.controls.PostalCodeId.enable();
          } else {
            this.employeeForm.controls.PostalCodeId.disable();
          }
        })).subscribe((res) => {
          this.PostalCodeData = res.PostalCodeList;
        });
    } else {
      this.employeeForm.controls.DistrictId.disable();
      this.employeeForm.controls.SubDistrictId.disable();
      this.employeeForm.controls.PostalCodeId.disable();
    }
  }

  changeProvince() {
    this.DistrictData = [];
    this.SubDistrictData = [];
    this.PostalCodeData = [];
    this.employeeForm.controls.DistrictId.setValue(null);
    this.employeeForm.controls.SubDistrictId.setValue(null);
    this.employeeForm.controls.PostalCodeId.setValue(null);
    // this.DistrictData = this.district.filter(data => data.ProvinceId == this.employeeForm.controls['ProvinceId'].value);
    // this.PostalCodeData = this.postalCode.filter(data => data.ProvinceId == this.employeeForm.controls['ProvinceId'].value);

    if (this.employeeForm.controls['ProvinceId'].value) {
      this.dbmt07Service.getDistrictDDL(this.employeeForm.controls['ProvinceId'].value).pipe(
        finalize(() => {
          if (this.DistrictData.length > 0 && this.employeeForm.controls.ProvinceId.value) {
            this.employeeForm.controls.DistrictId.enable();
            this.employeeForm.controls.SubDistrictId.disable();
          } else {
            this.employeeForm.controls.DistrictId.disable();
            this.employeeForm.controls.SubDistrictId.disable();
            this.employeeForm.controls.PostalCodeId.disable();
          }
        })).subscribe((res) => {
          this.DistrictData = res.DistrictList;
        });

      this.dbmt07Service.getPostalCodeDDL(this.employeeForm.controls['ProvinceId'].value).pipe(
        finalize(() => {
          if (this.PostalCodeData.length > 0 && this.employeeForm.controls.ProvinceId.value) {
            this.employeeForm.controls.PostalCodeId.enable();
          } else {
            this.employeeForm.controls.PostalCodeId.disable();
          }
        })).subscribe((res) => {
          this.PostalCodeData = res.PostalCodeList;
        });
    } else {
      this.employeeForm.controls.DistrictId.disable();
      this.employeeForm.controls.SubDistrictId.disable();
      this.employeeForm.controls.PostalCodeId.disable();
    }
  }

  getSubDistrict(DistrictId) {
    if (DistrictId) {
      this.dbmt07Service.getSubDistrictDDL(DistrictId).pipe(
        finalize(() => {
          if (this.SubDistrictData.length > 0 && DistrictId) {
            this.employeeForm.controls.SubDistrictId.enable();
          } else {
            this.employeeForm.controls.SubDistrictId.disable();
          }
        })).subscribe((res) => {
          this.SubDistrictData = res.SubDistrictList;
        });
    } else {
      this.employeeForm.controls.SubDistrictId.disable();
    }
  }

  changeDistrict() {
    this.SubDistrictData = [];
    this.employeeForm.controls.SubDistrictId.setValue(null);
    // this.employeeForm.controls.PostalCodeId.setValue(null);
    // this.SubDistrictData = this.subdistrict.filter(data => data.DistrictId == this.employeeForm.controls['DistrictId'].value);

    if (this.employeeForm.controls['DistrictId'].value) {
      this.dbmt07Service.getSubDistrictDDL(this.employeeForm.controls['DistrictId'].value).pipe(
        finalize(() => {
          if (this.SubDistrictData.length > 0 && this.employeeForm.controls.DistrictId.value) {
            this.employeeForm.controls.SubDistrictId.enable();
          } else {
            this.employeeForm.controls.SubDistrictId.disable();
            // this.employeeForm.controls.PostalCodeId.disable();
          }
        })).subscribe((res) => {
          this.SubDistrictData = res.SubDistrictList;
        });
    } else {
      this.employeeForm.controls.SubDistrictId.disable();
    }
  }

  changeSubDistrict() {
    // this.PostalCodeData = [];
    // this.employeeForm.controls.PostalCodeId.setValue(null);
    // this.PostalCodeData = this.postalCode.filter(data => data.SubdistrictId == this.employeeForm.controls['SubDistrictId'].value);
    // if (this.PostalCodeData.length > 0 && this.employeeForm.controls.SubDistrictId.value) {
    //   this.employeeForm.controls.PostalCodeId.enable();
    // } else {
    //   this.employeeForm.controls.PostalCodeId.disable();
    // }
  }

  changeCompany() {
    this.DepartmentData = [];
    this.employeeForm.controls['DepartmentCode'].setValue(null);
    this.DepartmentData = this.DepartmentCode.filter(data => data.CompanyCode == this.employeeForm.controls['CompanyCode'].value);
    if (this.DepartmentData.length > 0) {

      this.employeeForm.controls['DepartmentCode'].enable();
    } else {
      this.employeeForm.controls['DepartmentCode'].disable();

    }
  }

  onSelect(tabValue) { }


  // -----------------------------------------
  buildYearList() {
    var date = new Date();
    var indexYear = date.getFullYear() - 1740;
    for (var i = -1; i <= indexYear; i++) {
      var Value
      var TextEng = Value = date.getFullYear() - i;
      var TextTha = (date.getFullYear() - i) + 543;
      this.YearList.push({ Value, TextTha, TextEng });
    }
  }

  get EmployeeMgmTarget(): FormArray {
    return this.employeeForm.get('EmployeeMgmTarget') as FormArray;
  }

  addMgmTarget() {
    this.EmployeeMgmTarget.push(this.createEmployeeMgmTargetForm({} as EmployeeMgmTarget));
    this.employeeForm.markAsDirty();
  }

  openPlanTarget(edit) {
    this.genarateForm.enable();
    if (this.EmployeeMgmTarget.length > 0) {
      if (this.validateCheckDirtyForm()) {
        this.modal.confirm("ต้องการละทิ้งการเปลี่ยนแปลงหรือไม่").subscribe(res => {
          if (res) {
            this.EmployeeMgmTarget.getRawValue().forEach(element => {
              this.EmployeeMgmTarget.removeAt(0);
            });

            this.employeeForm.markAsDirty();
            this.employeeForm.controls.Year.enable();
            this.modalEdit = this.modal.open(edit, Size.medium);
          }
        })
      } else {
        this.modalEdit = this.modal.open(edit, Size.medium);
      }
    } else {
      this.modalEdit = this.modal.open(edit, Size.medium);
    }
  }

  closeEdit(flag) {
    if (flag) {
      this.checkModal = false;
      this.checkSearchingYear = false;
      this.yearDisable = false;

      if (this.savingDis) {
        this.employeeForm.controls.Year.disable();
        this.genarateForm.reset();
      }
      this.savingDis = false;

      this.modalEdit.hide();
    }
  }

  validateCheckDirtyForm() {
    const seen = new Set();
    const dirty = this.EmployeeMgmTarget.getRawValue().some(function (item) {
      return item.RowState == 1 || item.RowState == 2 || item.RowState == 3
    });
    return dirty;
  }

  onGenTarget() {
    this.submittedGen = true;
    if (this.genarateForm.invalid) {
      this.focusToggleGen = !this.focusToggleGen;
      return;
    }
    if (this.EmployeeMgmTarget.length > 0) {
      this.EmployeeMgmTarget.getRawValue().forEach(element => {
        this.EmployeeMgmTarget.removeAt(0);
      });
    }

    this.genarateForm.disable();
    this.saving = true;
    for (var i = 0; i < this.MounthList.length; i++) {
      this.addMgmTarget();
      const fg: FormGroup = <FormGroup>this.EmployeeMgmTarget.controls[i];
      fg.controls.Year.setValue(this.genarateForm.controls.Year.value - 543);
      fg.controls.MonthCode.setValue(this.MounthList[i].Value);
      fg.controls.Target.setValue(this.genarateForm.controls.Target.value);
    }
    this.employeeForm.controls.Year.setValue(this.genarateForm.controls.Year.value);
    this.employeeForm.controls.Year.disable();
    this.closeEdit(true);
    this.submittedGen = false;
    this.genarateForm.reset();
    setTimeout(() => {
      this.saving = false;
    }, 200);
  }

  checkYearSelect() {
    this.checkSearchingYear = true;
    this.yearDisable = true;
    this.dbmt07Service.chechYearSelect(this.employee.CompanyCode, this.employee.EmployeeCode, this.genarateForm.controls.Year.value).pipe(
      finalize(() => {
        this.checkSearchingYear = false;
        this.yearDisable = false;
      }))
      .subscribe((res: Employee) => {
        if (res) {// มีแล้ว หลังบ้าน alert ถามว่า จะแก้ไขหรือไม่
          this.savingDis = true;
          this.modalEdit.hide();
          // setTimeout(() => {
          this.modal.confirm("ข้อมูลดังกล่าวถูกบันทึกไว้อยู่แล้วต้องการนำมาแก้ไขหรือไม่").subscribe(value => {
            if (value) { //ไปเอาข้อมูลปีที่เลือกมาโชว์
              this.getYearList(this.genarateForm.controls.Year.value);
            } else {
              this.modalEdit = this.modal.open(this.tpl, Size.medium);
            }
          })
          // }, 200);
        } else {
          this.savingDis = false;
        }
      });
  }

  getYearList(value) {
    this.dbmt07Service.getYearList(this.employee.CompanyCode, this.employee.EmployeeCode, value).pipe(
      finalize(() => {
        this.checkSearchingYear = false;
        this.yearDisable = false;
      }))
      .subscribe((res: any) => {
        if (res) {// มีแล้ว หลังบ้าน alert ถามว่า จะแก้ไขหรือไม่
          this.employee = res
          this.EmployeeMgmTarget.getRawValue().forEach(element => {
            this.EmployeeMgmTarget.removeAt(0);
          });
          this.rebuildTarget();
        }
      });
  }

  searchYear() {
    // 
    if (this.validateCheckDirtyForm()) {
      this.modal.confirm("มีการแก้ไขต้องการบันทึกก่อนหรือไม่").subscribe(res => {
        if (res) {
          this.onSubmit();
          this.getYearList(this.employeeForm.controls.Year.value);
        } else {
          this.getYearList(this.employeeForm.controls.Year.value);
        }
      })
    } else {
      this.getYearList(this.employeeForm.controls.Year.value);
    }

  }

}
