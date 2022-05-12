import { Component, OnInit } from '@angular/core';
import { Company, Sumt01Service } from './sumt01.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Page, ModalService, SelectFilterService, ImageFile } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { SaveDataService, AlertService, LangService } from '@app/core';
import { finalize, switchMap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Category } from '@app/shared/service/configuration.service';
@Component({
  templateUrl: './sumt01-detail.component.html'
})
export class Sumt01DetailComponent implements OnInit {
  imageFile: ImageFile = new ImageFile();
  company: Company = {} as Company;
  // master: { TableName: any[] };
  //DistrictList:  any[];
  master: {
    MainCompanyList: any[], PersonalTaxtList: any[], PostalCodeList: any[], ProvinceList: { province: any[] }, TambolList: any[], DistrictList: any[]
  };
  mainCompanyList = [];
  tambolList = [];
  postalCodeList = [];
  personalTaxtList = [];
  districtList = [];
  provinceList = []
  regionList = []
  companyForm: FormGroup;
  submitted = false;
  saving = false;
  focusToggle = false;
  data = '';
  page = new Page();
  //SubDistrictList = [];
  ProvinceList = [];
  DistrictList = [];
  RegionList = [];
  provinceData = [];
  province = [];
  district = [];
  region = [];
  districtData = [];
  regionData = [];
  tambolData = [];
  tambol = [];
  postalCodeData = [];
  postalCode = [];
  filterMainCompanyList = [];
  category = Category.Company;

  constructor(
    public lang: LangService,
    private Sumt01Service: Sumt01Service,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private saveData: SaveDataService,
    private as: AlertService,
    private filter: SelectFilterService
  ) {
    this.createForm();
  }

  createForm() {
    this.companyForm = this.fb.group({
      CompanyCode: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      CompanyNameTha: [null, Validators.required],
      CompanyNameEng: null,
      AddressTha: [null, Validators.required],
      AddressEng: null,
      DistrictId: null,
      Moo: null,
      Soi: null,
      Road: null,
      Tambol: null,
      PostalCode: null,
      MainCompany: [null, Validators.required],
      TelephoneNo: [null, Validators.pattern('[0-9-#,]*')],
      FaxNo: [null, Validators.pattern('[0-9-#,]*')],
      Email: [null, Validators.email],
      PersonalTaxTypeCode: [null, Validators.required],
      TaxId: [null, Validators.required],
      SocailSecurityNo: null,
      SocailSecurityBranch: null,
      Website: null,
      GoogleMap: null,
      LogoName: null,
      ProvinceId: null,
      BannerName: null,
      ReceiptBranchCode: [null, Validators.required],
      ReceiptBranchName: [null, Validators.required],
      CountryCode: null,
      MapName: null,
      Active: true,
      IsBranch: false,
      RevenueStampBranchNo: null,
      BillPaymentFlag: false,
      IsMobile: false,
      ComCode: [null, Validators.pattern('[0-9]*')],
      SuffixCode: [null, Validators.pattern('[0-9]*')],
      RegionId: null,
      IsCompanyTracking: false,
    });
  }

  get companyCode() {
    return this.companyForm.controls.CompanyCode;
  }

  get email() {
    return this.companyForm.controls.Email;
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
      this.bindDropDownProvince();
      this.bindDropDownDistrict();
      this.bindDropDownSubDistrict();
      this.bindDropDownPostalCode();
      this.bindDropDownRegion();
    });
    this.route.data.subscribe((data) => {
      this.company = data.sumt01.detail;
      this.mainCompanyList = data.sumt01.master.MainCompanyList;
      // this.postalCodeList = data.sumt01.master.PostalCodeList;
      this.provinceList = data.sumt01.master.ProvinceList;
      this.regionList = data.sumt01.master.RegionList;
      // this.districtList = data.sumt01.master.DistrictList;
      // this.tambolList = data.sumt01.master.TambolList;
      this.personalTaxtList = data.sumt01.master.PersonalTaxtList;
      this.rebuildForm();
    });
    this.checkDropDown();
  }

  bindDropDownList() {
    this.filter.SortByLang(this.personalTaxtList);
    this.personalTaxtList = [... this.personalTaxtList];
    this.filterMainCompanyL(true)
  }

  filterMainCompanyL(filter?: boolean) {
    if (filter) {
      const detail = this.companyForm.value;
      if (detail) {
        this.mainCompanyList = this.filter.FilterActiveByValue(this.mainCompanyList, detail.MainCompany);
      }
      else {
        this.mainCompanyList = this.filter.FilterActive(this.mainCompanyList);
      }
    }
    // this.filter.SortByLang(this.fromContractTypeList);
    // this.fromContractTypeList = [... this.fromContractTypeList];
    this.filter.SortByLang(this.mainCompanyList);
    this.mainCompanyList = [... this.mainCompanyList];
  }

  bindDropDownProvince(filter?: boolean) {
    if (filter) {
      if (this.companyForm.controls.CompanyCode.value) {
        this.province = this.filter.FilterActiveByValue(this.provinceList, this.companyForm.controls.ProvinceId.value);
      }
      else {
        this.province = this.filter.FilterActive(this.provinceList);
      }
    }
    this.filter.SortByLang(this.province);
    this.provinceData = [...this.province];
  }

  bindDropDownDistrict(filter?: boolean) {
    if (filter) {
      if (this.companyForm.controls.CompanyCode.value) {
        this.district = this.filter.FilterActiveByValue(this.districtList, this.companyForm.controls.DistrictId.value);
      }
      else {
        this.district = this.filter.FilterActive(this.districtList);
      }
    }
    this.filter.SortByLang(this.district);;
    this.districtData = [...this.district];
  }

  bindDropDownSubDistrict(filter?: boolean) {
    if (filter) {
      if (this.companyForm.controls.CompanyCode.value) {
        this.tambol = this.filter.FilterActiveByValue(this.tambolList, this.companyForm.controls.Tambol.value);
      }
      else {
        this.tambol = this.filter.FilterActive(this.tambolList);
      }
    }
    this.filter.SortByLang(this.tambol);
    this.tambolData = [... this.tambol];
  }

  bindDropDownPostalCode(filter?: boolean) {
    if (filter) {
      if (this.companyForm.controls.CompanyCode.value) {
        this.postalCode = this.filter.FilterActiveByValue(this.postalCodeList, this.companyForm.controls.PostalCode.value);
      }
      else {
        this.postalCode = this.filter.FilterActive(this.postalCodeList);
      }
    }
    this.filter.SortByLang(this.postalCode);
    this.postalCodeData = [... this.postalCode];
  }

  bindDropDownRegion(filter?: boolean) {
    if (filter) {
      if (this.companyForm.controls.CompanyCode.value) {
        this.region = this.filter.FilterActiveByValue(this.regionList, this.companyForm.controls.RegionId.value);
      }
      else {
        this.region = this.filter.FilterActive(this.regionList);
      }
    }
    this.filter.SortByLang(this.region);
    this.regionData = [...this.region];
  }

  changeProvince() {
    this.districtData = [];
    this.tambolData = [];
    this.postalCodeData = [];
    this.companyForm.controls['DistrictId'].setValue(null);
    this.companyForm.controls['Tambol'].setValue(null);
    this.companyForm.controls['PostalCode'].setValue(null);
    // this.districtData = this.district.filter(data => data.ProvinceId == this.companyForm.controls['ProvinceId'].value);
    // this.postalCodeData = this.postalCode.filter(data => data.ProvinceId == this.companyForm.controls['ProvinceId'].value);

    if (this.companyForm.controls['ProvinceId'].value) {
      this.Sumt01Service.getDistrictDDL(this.companyForm.controls['ProvinceId'].value).pipe(
        finalize(() => {
          if (this.districtData.length > 0) {
            this.companyForm.controls['DistrictId'].enable();
            this.companyForm.controls['Tambol'].disable();
          } else {
            this.companyForm.controls['DistrictId'].disable();
            this.companyForm.controls['Tambol'].disable();
            this.companyForm.controls['PostalCode'].disable();
          }
        })).subscribe((res) => {
          this.districtData = res.DistrictList;
        });

      this.Sumt01Service.getPostalCodeDDL(this.companyForm.controls['ProvinceId'].value).pipe(
        finalize(() => {
          if (this.postalCodeData.length > 0) {
            this.companyForm.controls['PostalCode'].enable();
          } else {
            this.companyForm.controls['PostalCode'].disable();;
          }
        })).subscribe((res) => {
          this.postalCodeData = res.PostalCodeList;
        });
    } else {
      this.companyForm.controls.DistrictId.disable();
      this.companyForm.controls.Tambol.disable();
      this.companyForm.controls.PostalCode.disable();
    }
  }

  getDistrict(ProvinceId, DistrictId) {
    if (ProvinceId) {
      this.Sumt01Service.getDistrictDDL(ProvinceId).pipe(
        finalize(() => {
          if (this.districtData.length > 0) {
            this.companyForm.controls['DistrictId'].enable();
            this.companyForm.controls['Tambol'].disable();
          } else {
            this.companyForm.controls['DistrictId'].disable();
            this.companyForm.controls['Tambol'].disable();
            this.companyForm.controls['PostalCode'].disable();
          }
          if (DistrictId) {
            this.getSubDistrict(DistrictId);
          }
        })).subscribe((res) => {
          this.districtData = res.DistrictList;
        });

      this.Sumt01Service.getPostalCodeDDL(ProvinceId).pipe(
        finalize(() => {
          if (this.postalCodeData.length > 0) {
            this.companyForm.controls['PostalCode'].enable();
          } else {
            this.companyForm.controls['PostalCode'].disable();;
          }
        })).subscribe((res) => {
          this.postalCodeData = res.PostalCodeList;
        });
    } else {
      this.companyForm.controls.DistrictId.disable();
      this.companyForm.controls.Tambol.disable();
      this.companyForm.controls.PostalCode.disable();
    }
  }

  changeDistrict() {
    this.tambolData = [];
    this.companyForm.controls['Tambol'].setValue(null);
    // this.tambolData = this.tambol.filter(data => data.DistrictId == this.companyForm.controls['DistrictId'].value);

    if (this.companyForm.controls['DistrictId'].value) {
      this.Sumt01Service.getSubDistrictDDL(this.companyForm.controls['DistrictId'].value).pipe(
        finalize(() => {
          if (this.tambolData.length > 0) {
            this.companyForm.controls['Tambol'].enable();
          } else {
            this.companyForm.controls['Tambol'].disable();
          }
        })).subscribe((res) => {
          this.tambolData = res.SubDistrictList;
        });
    } else {
      this.companyForm.controls.Tambol.disable();
    }
  }

  getSubDistrict(DistrictId) {
    if (DistrictId) {
      this.Sumt01Service.getSubDistrictDDL(DistrictId).pipe(
        finalize(() => {
          if (this.tambolData.length > 0) {
            this.companyForm.controls['Tambol'].enable();
          } else {
            this.companyForm.controls['Tambol'].disable();
          }
        })).subscribe((res) => {
          this.tambolData = res.SubDistrictList;
        });
    } else {
      this.companyForm.controls.Tambol.disable();
    }
  }

  changeRegion() {
    // this.tambolData = this.tambol.filter(data => data.DistrictId == this.companyForm.controls['DistrictId'].value);

    // if (this.companyForm.controls['RegionId'].value) {
    //   this.Sumt01Service.getRegionDDL(this.companyForm.controls['RegionId'].value).pipe(
    //     finalize(() => {
    //       if (this.regionData.length > 0) {
    //         this.companyForm.controls['RegionId'].enable();
    //       } else {
    //         this.companyForm.controls['RegionId'].disable();
    //       }
    //     })).subscribe((res) => {
    //       this.regionData = res.RegionList;
    //     });
    // } 
  }

  changeSubDistrict() {
    // this.postalCodeData = [];
    // this.companyForm.controls['PostalCode'].setValue(null);
    // this.postalCodeData = this.postalCode.filter(data => data.DistrictId == this.companyForm.controls['DistrictId'].value);
    // //filter(data => data.Tambol == this.companyForm.controls['Tambol'].value);
    // if (this.postalCodeData.length > 0) {
    //   this.companyForm.controls['PostalCode'].enable();
    // } else {
    //   this.companyForm.controls['PostalCode'].disable();;
    // }
  }

  checkDropDown() {
    this.districtData = this.district.filter(data => data.ProvinceId == this.companyForm.controls['ProvinceId'].value);
    if (this.districtData.length > 0) {
      this.companyForm.controls['DistrictId'].enable();
      this.companyForm.controls['Tambol'].enable();
      //this.companyForm.controls['PostalCode'].enable();
    } else {
      this.companyForm.controls['DistrictId'].disable();
      this.companyForm.controls['Tambol'].disable();
      this.companyForm.controls['PostalCode'].disable();
    }
    this.tambolData = this.tambol.filter(data => data.DistrictId == this.companyForm.controls['DistrictId'].value);
    if (this.tambolData.length > 0) {
      this.companyForm.controls['Tambol'].enable();
      this.companyForm.controls['PostalCode'].enable();
    } else {
      this.companyForm.controls['Tambol'].disable();
      this.companyForm.controls['PostalCode'].disable();
    }
    this.postalCodeData = this.postalCode.filter(data => data.ProvinceId == this.companyForm.controls['ProvinceId'].value);
    //filter(data => data.Tambol== this.companyForm.controls['Tambol'].value);
    if (this.postalCodeData.length > 0) {
      this.companyForm.controls['PostalCode'].enable();
    } else {
      this.companyForm.controls['PostalCode'].disable();
    }
  }

  rebuildForm() {
    this.companyForm.markAsPristine();
    if (this.company.RowVersion) {
      this.companyForm.patchValue(this.company);
      this.filterMainCompany();
      this.companyForm.controls.CompanyCode.disable();  //*****

      if (this.company.CompanyCode = '9999') {
        this.companyForm.controls.MainCompany.disable({ emitEvent: false });
      }
    }
    this.getDistrict(this.company.ProvinceId, this.company.DistrictId);
    this.bindDropDownList();
    this.bindDropDownProvince(true);
    this.bindDropDownDistrict(true);
    this.bindDropDownSubDistrict(true);
    this.bindDropDownPostalCode(true);
    this.bindDropDownRegion(true);
  }

  prepareSave(values: Object) {
    Object.assign(this.company, values);

    const rProvinceData = this.provinceData.filter((data) => {
      return data.Value == this.company.ProvinceId;
    });
    const rDistrictData = this.districtData.filter((data) => {
      return data.Value == this.company.DistrictId;
    });
    const rTambolData = this.tambolData.filter((data) => {
      return data.Value == this.company.Tambol;
    });
    let addressTha = this.company.AddressTha != null && this.company.AddressTha != '' ? 'เลขที่ ' + this.company.AddressTha : '';
    let provinceTha = rProvinceData.length != 0 ? ' จ. ' + rProvinceData[0].TextTha : '';
    let districtTha = rDistrictData.length != 0 ? ' อ. ' + rDistrictData[0].TextTha : '';
    let tambolTha = rTambolData.length != 0 ? ' ต. ' + rTambolData[0].TextTha : '';
    let mooTha = this.company.Moo != null && this.company.Moo != '' ? ' หมู่ ' + this.company.Moo : '';
    let soiTha = this.company.Soi != null && this.company.Soi != '' ? ' ซอย ' + this.company.Soi : '';
    let roadTha = this.company.Road != null && this.company.Road != '' ? ' ถนน ' + this.company.Road : '';
    let postalCode = this.company.PostalCode != null && this.company.PostalCode != '' ? ' ' + this.company.PostalCode : '';

    this.company.AddressFin = addressTha + mooTha + soiTha + roadTha + tambolTha + districtTha + provinceTha + postalCode;
  }

  checkBranch() {
    this.submitted = true;
    if (this.companyForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    
    if (this.companyForm.controls.IsBranch.value) {
      this.onSubmit()
    }
    else {
      this.Sumt01Service.checkBranch(this.companyForm.controls.CompanyCode.value).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe((res: any) => {
          if (res > 0) {
            this.as.warning('', 'สาขานี้มีการทำสัญญาแล้ว ไม่สามารถเปลี่ยน flag สาขาออกได้');
          } else {
            this.onSubmit()
          }
        });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.companyForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.saving = true;
    this.prepareSave(this.companyForm.getRawValue());
    this.Sumt01Service.saveCompany(this.company, this.imageFile).pipe(
      switchMap(() => this.Sumt01Service.getCompanyDetail(this.company.CompanyCode)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: Company) => {
        if (res) {
          this.company = res;
          this.rebuildForm();
          this.as.success("", "Message.STD00006");

        }
      });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.companyForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back() {
    this.router.navigate(['/su/sumt01'], { skipLocationChange: true });
  }

  filterMainCompany() {

    this.mainCompanyList = this.mainCompanyList.filter(filter => filter.Value != this.companyForm.controls.CompanyCode.value);

  }

}