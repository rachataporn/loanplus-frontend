import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import {
  ModalService, RowState, SelectFilterService, FormsBase
  , DropdownForms, TextboxForms, FormsControlService, NumberForms, DateForms, BrowserService, ImageFile, Guid, Size, YearForms
} from '@app/shared';
import { Lots14Service, Securities, SecuritiesImage, SecuritiesRegisterRef } from './lots14.service';
import { Observable } from 'rxjs';
import { Category } from '@app/shared/service/configuration.service';
import { SecuritiesVerifyDetailPopupComponent } from './lots14-verify-detail.component';
import { switchMap, finalize } from 'rxjs/operators';

@Component({
  templateUrl: './lots14-detail.component.html',
  providers: [FormsControlService]
})
export class Lots14DetailComponent implements OnInit {
  securitiesMaster: Securities = {} as Securities;
  securitiesRegisRef: SecuritiesRegisterRef = {} as SecuritiesRegisterRef;
  requestSecuritiesForm: FormGroup;
  submitted: boolean;
  focusToggle: boolean;
  saving: boolean;
  securitiesAttributeGeneral = [];
  securitiesAttributeList = [];
  viewImageList: SecuritiesImage[] = [] as SecuritiesImage[];
  province = [];
  provinceData = [];
  assetTypeList = [];
  docStatusList = [];
  brandCar = [];
  brandMotorcycle = [];
  userName = [];
  securitiesBodyNumber: boolean;
  securitiesAttGenMotorcycle: boolean;
  securitiesAttEngine: boolean;
  securitiesAttGen: boolean;
  category = Category.Securities;
  securitiesAttMould: boolean;
  imageFiles: ImageFile[] = [];
  editSecurities: boolean;
  securitiesAttDistrict: boolean;
  securitiesAttSubDistrict: boolean;
  RegisRefId: any;
  RegisRefName: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private lots14Service: Lots14Service,
    public lang: LangService,
    private selectFilter: SelectFilterService,
    private browser: BrowserService,
    private modal: ModalService,
    private qcs: FormsControlService
  ) {
    this.createForm();
  }

  createForm() {
    const now = new Date();

    this.requestSecuritiesForm = this.fb.group({
      SecuritiesCode: [{ value: 'AUTO', disabled: true }],
      CompanyCode: null,
      SecuritiesDate: [{ value: now, disabled: true }],
      SecuritiesCategoryId: [null, Validators.required],
      SecuritiesStatus: '1',
      EstimateAmount: [null, Validators.required],
      LoanLimitAmount: [null, Validators.required],
      Description: [null, Validators.required],
      Remark: null,
      RowVersion: null,
      RefRegisterId: null,
      RefRegisterName: [{ value: null, disabled: true }],
      RefRegisterDate: [{ value: null, disabled: true }],
      RefRegisterChannel: [{ value: null, disabled: true }],
      SecuritiesImages: this.fb.array([]),
      SecuritiesAttributes: this.fb.group({}),
      ReqSecuritiesBy: [{ value: null, disabled: true }],
      AppPrincipleAmount: [{ value: null, disabled: true }],
      CustomerReqSecurities: [{ value: null, disabled: true }],
      MortgageAmount: null
    });

    this.requestSecuritiesForm.controls.SecuritiesCategoryId.valueChanges.subscribe(
      (value) => {
        let securities = this.assetTypeList.find(function (item) {
          return item.Value == value;
        }) || {}
        if (this.editSecurities) {
          this.getSecuritiesAttributes(securities.Value, this.requestSecuritiesForm.controls.SecuritiesCode.value);
          this.getTemplateView(securities.Value2, this.requestSecuritiesForm.controls.SecuritiesCode.value);
        } else {
          this.getSecuritiesAttributes(securities.Value, null);
          this.getTemplateView(securities.Value2, null);
        }
      }
    )
  }

  createDetailForm(item: SecuritiesImage): FormGroup {
    let fg = this.fb.group({
      SecuritiesImageId: null,
      SecuritiesCode: null,
      ViewId: null,
      ImageName: null,
      RowVersion: null,
      TemplateViewId: null,
      ViewNameTha: null,
      ViewNameEng: null,
      ViewSeq: null,
      File: null,
      FileDeleting: null,
      RowState: RowState.Add,
      ImageId: null,
      RegisterId: null
    });

    fg.patchValue(item, { emitEvent: false });
    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    )

    this.imageFiles.push(new ImageFile());
    return fg;
  }

  ngOnInit() {
    this.RegisRefId = this.route.snapshot.params.RegisRefId;

    if (this.RegisRefId) {
      this.lots14Service.getRegisRef(this.RegisRefId).subscribe(
        (res: SecuritiesRegisterRef) => {
          this.securitiesRegisRef = res;

          if (this.securitiesRegisRef.RegisterId) {
            this.requestSecuritiesForm.controls.RefRegisterId.setValue(this.securitiesRegisRef.RegisterId, { emitEvent: false });
            this.requestSecuritiesForm.controls.RefRegisterName.setValue(this.securitiesRegisRef.RegisterName, { emitEvent: false });
            this.requestSecuritiesForm.controls.RefRegisterDate.setValue(this.securitiesRegisRef.RegisterDate, { emitEvent: false });

            if (this.lang.CURRENT !== 'Tha') {
              this.requestSecuritiesForm.controls.RefRegisterChannel.setValue(this.securitiesRegisRef.RegisterChannelTha, { emitEvent: false });
            } else {
              this.requestSecuritiesForm.controls.RefRegisterChannel.setValue(this.securitiesRegisRef.RegisterChannelEng, { emitEvent: false });
            }

            this.requestSecuritiesForm.controls.SecuritiesCategoryId.setValue(String(this.securitiesRegisRef.SecuritiesCategoryId));
          }
        });
    }

    this.route.data.subscribe((data) => {
      this.securitiesMaster = data.requestSecureVerify.SecuritiesDetail;
      this.assetTypeList = data.requestSecureVerify.master.AssetList;
      this.docStatusList = data.requestSecureVerify.master.DocStatusList;
      this.userName = data.requestSecureVerify.master.Username;
      this.province = data.requestSecureVerify.province.LoanTypesDto;
      this.brandCar = data.requestSecureVerify.brandCar.LoanTypesDto;
      this.brandMotorcycle = data.requestSecureVerify.brandMotorcycle.LoanTypesDto;
      if (this.province) {
        this.province = this.selectFilter.FilterActive(this.province);
        this.province = [...this.province];
      }
    });

    this.rebuildForm();
  }

  rebuildForm() {
    this.bindDropDownList();
    this.requestSecuritiesForm.markAsPristine();

    if (this.securitiesMaster.SecuritiesCode != null) {
      this.editSecurities = true;
      this.securitiesAttGen = false;
      this.securitiesAttMould = false;
      this.securitiesAttDistrict = false;
      this.securitiesAttSubDistrict = false;
      this.securitiesBodyNumber = false;
      this.securitiesAttGenMotorcycle = false;
      this.securitiesAttEngine = false;
      this.requestSecuritiesForm.patchValue(this.securitiesMaster);
      this.requestSecuritiesForm.controls.SecuritiesCategoryId.setValue(String(this.securitiesMaster.SecuritiesCategoryId), { emitEvent: false });
      this.requestSecuritiesForm.controls.ReqSecuritiesBy.setValue(this.securitiesMaster['ReqSecuritiesBy' + this.lang.CURRENT], { emitEvent: false });

      if (this.requestSecuritiesForm.controls.RefRegisterId.value) {
        this.lots14Service.getRegisRef(this.requestSecuritiesForm.controls.RefRegisterId.value).subscribe(
          (res: SecuritiesRegisterRef) => {
            this.securitiesRegisRef = res;

            if (this.securitiesRegisRef.RegisterId) {
              this.requestSecuritiesForm.controls.RefRegisterName.setValue(this.securitiesRegisRef.RegisterName, { emitEvent: false });
              this.requestSecuritiesForm.controls.RefRegisterDate.setValue(this.securitiesRegisRef.RegisterDate, { emitEvent: false });

              if (this.lang.CURRENT !== 'Tha') {
                this.requestSecuritiesForm.controls.RefRegisterChannel.setValue(this.securitiesRegisRef.RegisterChannelTha, { emitEvent: false });
              } else {
                this.requestSecuritiesForm.controls.RefRegisterChannel.setValue(this.securitiesRegisRef.RegisterChannelEng, { emitEvent: false });
              }
            }
          });
      }
      this.requestSecuritiesForm.disable({ emitEvent: false });
      // this.requestSecuritiesForm.controls.EstimateAmount.enable({ emitEvent: false });
      // this.requestSecuritiesForm.controls.LoanLimitAmount.enable({ emitEvent: false });
    }
  }

  bindDropDownList() {
    if (this.brandCar) {
      this.brandCar = this.selectFilter.FilterActive(this.brandCar);
      this.brandCar = [...this.brandCar];
    }

    if (this.brandMotorcycle) {
      this.brandMotorcycle = this.selectFilter.FilterActive(this.brandMotorcycle);
      this.brandMotorcycle = [...this.brandMotorcycle];
    }
    return;
  }

  get securitiesAttributes(): FormGroup {
    return this.requestSecuritiesForm.get('SecuritiesAttributes') as FormGroup;
  }

  get SecuritiesImages(): FormArray {
    return this.requestSecuritiesForm.get('SecuritiesImages') as FormArray;
  }

  get getDocStatus() {
    return this.docStatusList.find((item) => { return item.Value == this.requestSecuritiesForm.controls['SecuritiesStatus'].value });
  };

  getSecuritiesAttributes(SecuritiesType: string, SecuritiesCode: string) {
    if (SecuritiesType) {
      this.lots14Service.getSecuritiesAttributes(SecuritiesType, SecuritiesCode).subscribe(
        (res) => {
          this.securitiesAttributeList = this.getattribute(res);
          this.requestSecuritiesForm.setControl('SecuritiesAttributes', this.toFormGroup(this.securitiesAttributeList));
        }
      );
    } else {
      this.securitiesAttributeList = [];
      this.requestSecuritiesForm.setControl('SecuritiesAttributes', this.fb.group({}))
    }
  }

  getTemplateView(TemplateViewID?: number, SecuritiesCode: string = null) {
    if (TemplateViewID) {
      this.lots14Service.getImageDetails(TemplateViewID, SecuritiesCode).subscribe(
        (res) => {
          this.viewImageList = res;
          this.requestSecuritiesForm.setControl('SecuritiesImages', this.fb.array(this.viewImageList.map((detail) => this.createDetailForm(detail))));
        }
      );
    } else {
      if (this.SecuritiesImages.length > 0) {
        while (this.SecuritiesImages.length !== 0) {
          this.SecuritiesImages.removeAt(0)
        }
        this.imageFiles = [];
      }
    }
  }

  checkFormsTypes(item) {
    if (item.AttributeType == "L") {
      var dropdown = new DropdownForms();
      dropdown.id = item.SecuritiesAttributeId;
      dropdown.key = item.AttributeId;
      dropdown.label = item.AttributeNameTha;
      dropdown.labelTha = item.AttributeNameTha;
      dropdown.labelEng = item.AttributeNameEng;
      dropdown.order = item.TitleSeq;
      dropdown.TitleSeq = item.CategoryAttributeId;
      dropdown.required = item.RequireFlag;
      dropdown.RowVersion = item.RowVersion;
      dropdown.RowState = item.RowState;

      if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 2) {
        if (item.AttributeNameEng == 'Brand') {
          dropdown.options = this.brandCar;
          if (item.AttributeValue) {
            dropdown.value = String(item.AttributeValue) || null;
          }
        }

        if (item.AttributeNameEng == 'Generation') {
          dropdown.isObservableOptions = true;
          if (item.AttributeValue) {
            dropdown.value = String(item.AttributeValue) || null;
          }
        }

        if (item.AttributeNameEng == 'Mould') {
          dropdown.isObservableOptions = true;
          if (item.AttributeValue) {
            dropdown.value = String(item.AttributeValue) || null;
          }
        }

      } else if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 3) {
        if (item.AttributeNameEng == 'Brand') {
          dropdown.options = this.brandMotorcycle;
          if (item.AttributeValue) {
            dropdown.value = String(item.AttributeValue) || null;
          }
        }

        if (item.AttributeNameEng == 'Generation') {
          dropdown.isObservableOptions = true;
          if (item.AttributeValue) {
            dropdown.value = String(item.AttributeValue) || null;
          }
        }

        if (item.AttributeNameEng == 'EngineNumber') {
          dropdown.isObservableOptions = true;
          if (item.AttributeValue) {
            dropdown.value = String(item.AttributeValue) || null;
          }
        }

        if (item.AttributeNameEng == 'Body number') {
          dropdown.isObservableOptions = true;
          if (item.AttributeValue) {
            dropdown.value = String(item.AttributeValue) || null;
          }
        }
      }

      if (item.AttributeNameEng == 'Province') {
        dropdown.options = this.province;
        if (item.AttributeValueId) {
          dropdown.value = String(item.AttributeValueId) || null;
        }
      }

      if (item.AttributeNameEng == 'District') {
        dropdown.isObservableOptions = true;
        if (item.AttributeValueId) {
          dropdown.value = item.AttributeValueId || null;
        }
      }

      if (item.AttributeNameEng == 'Subdistrict') {
        dropdown.isObservableOptions = true;
        if (item.AttributeValueId) {
          dropdown.value = item.AttributeValueId || null;
        }
      }
      return dropdown;
    }
    else if (item.AttributeType == "N") {
      var number = new NumberForms();
      number.id = item.SecuritiesAttributeId;
      number.key = item.AttributeId;
      number.label = item.AttributeNameTha;
      number.labelTha = item.AttributeNameTha;
      number.labelEng = item.AttributeNameEng;
      number.order = item.TitleSeq;
      number.TitleSeq = item.CategoryAttributeId;
      number.required = item.RequireFlag;
      number.value = item.AttributeValue || null;
      number.RowVersion = item.RowVersion;
      number.RowState = item.RowState;
      return number;
    }
    else if (item.AttributeType == "T") {
      var text = new TextboxForms();
      text.id = item.SecuritiesAttributeId;
      text.key = item.AttributeId;
      text.label = item.AttributeNameTha;
      text.labelTha = item.AttributeNameTha;
      text.labelEng = item.AttributeNameEng;
      text.order = item.TitleSeq;
      text.TitleSeq = item.CategoryAttributeId;
      text.required = item.RequireFlag;
      text.value = item.AttributeValue || null;
      text.RowVersion = item.RowVersion;
      text.RowState = item.RowState;
      return text;
    }
    else if (item.AttributeType == "Y") {
      var year = new YearForms();
      year.id = item.SecuritiesAttributeId;
      year.key = item.AttributeId;
      year.label = item.AttributeNameTha;
      year.labelTha = item.AttributeNameTha;
      year.order = item.TitleSeq;
      year.TitleSeq = item.CategoryAttributeId;
      year.labelEng = item.AttributeNameEng;
      year.required = item.RequireFlag;
      year.value = item.AttributeValue || null;
      year.RowVersion = item.RowVersion;
      year.RowState = item.RowState;
      return year;
    }
    else if (item.AttributeType == "D") {
      var date = new DateForms();
      date.id = item.SecuritiesAttributeId;
      date.key = item.AttributeId;
      date.label = item.AttributeNameTha;
      date.labelTha = item.AttributeNameTha;
      date.order = item.TitleSeq;
      date.TitleSeq = item.CategoryAttributeId;
      date.labelEng = item.AttributeNameEng;
      date.required = item.RequireFlag;
      date.value = item.AttributeValue || null;
      date.RowVersion = item.RowVersion;
      date.RowState = item.RowState;
      return date;
    }
  }

  getattribute(attribute: any[]) {
    let forms = [];
    let formsAttribute: FormsBase<any>[] = [];
    attribute.forEach((item) => {
      const form = this.checkFormsTypes(item)
      forms.push(form);
    })
    formsAttribute = forms;
    return formsAttribute;
  }

  back() {
    this.router.navigate(['/lo/lots14'], { skipLocationChange: true });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.requestSecuritiesForm.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  private triggerResize() {
    if (this.browser.isIE) {
      var evt = document.createEvent('UIEvents');
      evt.initEvent('resize', true, false);
      window.dispatchEvent(evt);
    } else {
      window.dispatchEvent(new Event('resize'));
    }
  }

  tabSelected() {
    setTimeout(this.triggerResize.bind(this), 1)
  }

  toFormGroup(forms: FormsBase<any>[]) {
    let group: any = {};

    forms.forEach(form => {
      group[form.key] = form.required ? new FormControl({ value: form.value || null, disabled: true }, Validators.required)
        : new FormControl({ value: form.value || null, disabled: true });

      (group[form.key] as FormControl).valueChanges.subscribe(
        val => {
          if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 2) {
            if (form.labelEng == 'Brand') {
              let index = forms.findIndex(x => x.labelEng == 'Generation');
              if (index >= 0) {
                this.GetGeneration(val, forms, index, group);
              }
            }
            if (form.labelEng == 'Generation') {
              let index = forms.findIndex(x => x.labelEng == 'Mould');
              if (index >= 0) {
                this.getMould(val, forms, index, group);
              }
            }
            if (form.labelEng == 'Mould') {
              let index = forms.findIndex(x => x.labelEng == 'Year');
              if (index >= 0) {
                this.checkYear(val, forms, index, group);
              }
            }
          } else if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 3) {
            if (form.labelEng == 'Brand') {
              let index = forms.findIndex(x => x.labelEng == 'Generation');
              if (index >= 0) {
                this.GetGenerationMotorcycle(val, forms, index, group);
              }
            }
            else if (form.labelEng == 'Generation') {
              let index = forms.findIndex(x => x.labelEng == 'Body number');
              if (index >= 0) {
                this.getBodyNumber(val, forms, index, group);
              }
            }
            else if (form.labelEng == 'Body number') {
              let index = forms.findIndex(x => x.labelEng == 'EngineNumber');
              if (index >= 0) {
                this.getEngineNumber(val, forms, index, group);
              }
            }
            else if (form.labelEng == 'EngineNumber') {
              let index = forms.findIndex(x => x.labelEng == 'Year');
              if (index >= 0) {
                this.checkYear(val, forms, index, group);
              }
            }
          }

          if (form.labelEng == 'Province') {
            let index = forms.findIndex(x => x.labelEng == 'District');
            if (index >= 0) {
              this.GetDistrict(val, forms, index, group);
            }
          }
          if (form.labelEng == 'District') {
            let index = forms.findIndex(x => x.labelEng == 'Subdistrict');
            if (index >= 0) {
              this.GetSubDistrict(val, forms, index, group);
            }
          }
          if (form.RowState == RowState.Normal && this.securitiesAttDistrict && this.securitiesAttSubDistrict) {
            form.RowState = RowState.Edit;
          } else if (form.RowState == RowState.Normal) {
            form.RowState = RowState.Edit;
          } else if (form.RowState == null) {
            form.RowState = RowState.Add;
          }
          form.value = val;
        }
      );
      (group[form.key] as FormControl).updateValueAndValidity({ onlySelf: false, emitEvent: true });
    });
    return this.fb.group(group);
  }

  checkYear(value, forms, index, group) {
    var ddlKeep = forms[index];
    if (group[ddlKeep.key]) {
      if (value) {
        if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4') {
          group[ddlKeep.key].disable({ emitEvent: false });
        } else {
          // group[ddlKeep.key].enable({ emitEvent: false });
        }
      }
      else {
        group[ddlKeep.key].setValue(null);
        group[ddlKeep.key].disable({ emitEvent: false });
      }
    }
  }

  getEngineNumber(generation, formsEngine, i, group) {
    var modelName = ''
    var model = formsEngine.find(x => x.labelEng == 'Generation');
    if (model) {
      modelName = model.value;
    }
    this.lots14Service.getEngineNumber(modelName, generation).subscribe(
      (res: any) => {
        let detail = res.EngineNumbersData;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];
        let index1 = formsEngine.findIndex(x => x.labelEng == 'EngineNumber');
        var ddlKeep = formsEngine[index1];
        if (ddlKeep) {
          if (generation) {
            if (this.securitiesAttGenMotorcycle && this.securitiesBodyNumber && this.securitiesAttEngine) {
              group[ddlKeep.key].setValue(null);
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4') {
              group[ddlKeep.key].disable({ emitEvent: false });

            } else {
              // group[ddlKeep.key].enable({ emitEvent: false });
            }
          } else {
            ddlKeep.options = [];
            group[ddlKeep.key].setValue(null);
            group[ddlKeep.key].disable({ emitEvent: false });
          }
          (ddlKeep as DropdownForms).isReady.next(true);
        }
        this.securitiesAttEngine = true;
      });
  }

  getBodyNumber(generation, formsBody, i, group) {
    this.lots14Service.getBodyNumber(generation).subscribe(
      (res: any) => {
        let detail = res.BodyNumbersData;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];
        let index2 = formsBody.findIndex(x => x.labelEng == 'Body number')
        var ddlKeep = formsBody[index2];
        if (ddlKeep) {
          if (generation) {
            if (this.securitiesAttGenMotorcycle && this.securitiesBodyNumber && this.securitiesAttEngine) {
              group[ddlKeep.key].setValue(null);
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4') {
              group[ddlKeep.key].disable({ emitEvent: false });

            } else {
              // group[ddlKeep.key].enable({ emitEvent: false });
            }
          } else {
            ddlKeep.options = [];
            group[ddlKeep.key].setValue(null);
            group[ddlKeep.key].disable({ emitEvent: false });
          }
          (ddlKeep as DropdownForms).isReady.next(true);
        }
        this.securitiesBodyNumber = true;
      });
  }

  getMould(generation, forms, index, group) {
    this.lots14Service.getMould(generation).subscribe(
      (res: any) => {
        let detail = res.MouldsData;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];

        var ddlKeep = forms[index];
        if (ddlKeep) {
          if (generation) {
            if (this.securitiesAttGen && this.securitiesAttMould) {
              group[ddlKeep.key].setValue(null);
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4') {
              group[ddlKeep.key].disable({ emitEvent: false });

            } else {
              // group[ddlKeep.key].enable({ emitEvent: false });
            }
          } else {
            ddlKeep.options = [];
            group[ddlKeep.key].setValue(null);
            group[ddlKeep.key].disable({ emitEvent: false });
          }
          (ddlKeep as DropdownForms).isReady.next(true);
        }
        this.securitiesAttMould = true;
      });
  }

  GetGenerationMotorcycle(brand, formsGen, index, group) {
    this.lots14Service.getGenerationMotorcycleDDL(brand).subscribe(
      (res: any) => {
        let detail = res.GenerationMotorcyclesData;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];

        var ddlKeep = formsGen[index];
        if (ddlKeep) {
          if (brand) {
            if (this.securitiesAttGenMotorcycle && this.securitiesBodyNumber && this.securitiesAttEngine) {
              group[ddlKeep.key].setValue(null);
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4') {
              group[ddlKeep.key].disable({ emitEvent: false });

            } else {
              // group[ddlKeep.key].enable({ emitEvent: false });
            }
          } else {
            ddlKeep.options = [];
            group[ddlKeep.key].setValue(null);
            group[ddlKeep.key].disable({ emitEvent: false });
          }
          (ddlKeep as DropdownForms).isReady.next(true);
        }
        this.securitiesAttGenMotorcycle = true;
      });
  }

  GetGeneration(brand, forms, index, group) {
    this.lots14Service.getGeneration(brand).subscribe(
      (res: any) => {
        let detail = res.GenerationsData;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];

        var ddlKeep = forms[index];
        if (ddlKeep) {
          if (brand) {
            if (this.securitiesAttGen && this.securitiesAttMould) {
              group[ddlKeep.key].setValue(null);
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4') {
              group[ddlKeep.key].disable({ emitEvent: false });
            } else {
              // group[ddlKeep.key].enable({ emitEvent: false });
            }
          } else {
            ddlKeep.options = [];
            group[ddlKeep.key].setValue(null);
            group[ddlKeep.key].disable({ emitEvent: false });
          }
          (ddlKeep as DropdownForms).isReady.next(true);
        }
        this.securitiesAttGen = true;
      });
  }

  GetDistrict(province, forms, index, group) {
    this.lots14Service.getDistrict(province).subscribe(
      (res: any) => {
        let detail = res.DistrictList;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];

        var ddlKeep = forms[index];
        if (ddlKeep) {
          if (province) {
            if (this.securitiesAttDistrict && this.securitiesAttSubDistrict) {
              group[ddlKeep.key].setValue(null);
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4') {
              group[ddlKeep.key].disable({ emitEvent: false });

            } else {
              // group[ddlKeep.key].enable({ emitEvent: false });
            }
          } else {
            ddlKeep.options = [];
            group[ddlKeep.key].setValue(null);
            group[ddlKeep.key].disable({ emitEvent: false });
          }
          (ddlKeep as DropdownForms).isReady.next(true);
        }
        this.securitiesAttDistrict = true;
      });
  }

  GetSubDistrict(district, forms, index, group) {
    this.lots14Service.getSubDistrict(district).subscribe(
      (res: any) => {
        let detail = res.SubDistrictList;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];

        var ddlKeep = forms[index];
        if (ddlKeep) {
          if (!district) {
            ddlKeep.options = [];
            group[ddlKeep.key].setValue(null);
            group[ddlKeep.key].disable({ emitEvent: false });
          } else {
            if (this.securitiesAttDistrict && this.securitiesAttSubDistrict) {
              group[ddlKeep.key].setValue(null);
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4') {
              group[ddlKeep.key].disable({ emitEvent: false });
            } else {
              // group[ddlKeep.key].enable({ emitEvent: false });
            }
          }
          (ddlKeep as DropdownForms).isReady.next(true);
        }
        this.securitiesAttSubDistrict = true;
      });
  }

  openPopupVerify() {
    const data = {
      securitiesCode: this.securitiesMaster.SecuritiesCode,
      securitiesStatus: this.docStatusList.filter(item => {
        return (item.Value != '1' && item.Value != '' && item.Value != '5' && item.Value != '7')
      }),
      securitiesStatusSelect: this.securitiesMaster.SecuritiesStatus,
      statusPass: '3',
      statusNotPass: '4',
      verifyName: this.userName,
      estimateAmount: this.securitiesMaster.EstimateAmount,
      loanLimitAmount: this.securitiesMaster.LoanLimitAmount,
      rowVersionSecurities: this.securitiesMaster.RowVersion,
      securitiesCategoryId: this.securitiesMaster.SecuritiesCategoryId,
      mortgageAmount: this.securitiesMaster.MortgageAmount,
      provinceList: this.province
    };

    this.modal.openComponent(SecuritiesVerifyDetailPopupComponent, Size.large, data)
      .subscribe(
        (result) => {
          if (result != '') {
            this.lots14Service.getSearchEdit(result).subscribe((res: Securities) => {
              this.securitiesMaster = res;
              this.rebuildForm();
            })
          }
        });
  }

  onSubmit() {
    this.submitted = true;
    if (this.requestSecuritiesForm.invalid) {
      this.focusToggle = !this.focusToggle;
      this.saving = false;
      return;
    }
    let dataToSave: Securities = {} as Securities;
    dataToSave.SecuritiesCode = this.requestSecuritiesForm.controls.SecuritiesCode.value;
    dataToSave.EstimateAmount = this.requestSecuritiesForm.controls.EstimateAmount.value;
    dataToSave.LoanLimitAmount = this.requestSecuritiesForm.controls.LoanLimitAmount.value;
    this.lots14Service.update(dataToSave).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: Securities) => {
          this.securitiesMaster = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        }
      );
  }
}
