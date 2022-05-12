import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import {
  ModalService, RowState, SelectFilterService, FormsBase
  , DropdownForms, TextboxForms, FormsControlService, NumberForms, DateForms, BrowserService, ImageFile, Guid, Size, YearForms
} from '@app/shared';
import { Lots27Service, Securities, SecuritiesAttribute, SecuritiesImage, SecuritiesRegisterRef } from './lots27.service';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Category } from '@app/shared/service/configuration.service';
import { SecuritiesHistoryVerifyDetailPopupComponent } from '../lots13/lots13-history-verify-detail.component';

@Component({
  templateUrl: './lots27-detail.component.html',
  providers: [FormsControlService]
})
export class Lots27DetailComponent implements OnInit {
  securitiesMaster: Securities = {} as Securities;
  securitiesRegisRef: SecuritiesRegisterRef = {} as SecuritiesRegisterRef;
  requestSecuritiesForm: FormGroup;
  submitted: boolean;
  focusToggle: boolean;
  saving: boolean = false;
  approved: boolean = false;
  checkButton: boolean;
  resetValue = false;
  securitiesAttributeGeneral = [];
  securitiesAttributeList = [];
  viewImageList: SecuritiesImage[] = [] as SecuritiesImage[];
  province = [];
  brandCar = [];
  brandMotorcycle = [];
  assetTypeList = [];
  docStatusList = [];
  parameter = [];
  category = Category.Securities;
  imageFiles: ImageFile[] = [];
  editSecurities: boolean;
  securitiesAttDistrict: boolean;
  securitiesAttSubDistrict: boolean;
  securitiesAttGen: boolean;
  securitiesAttMould: boolean;
  securitiesBodyNumber: boolean;
  securitiesAttGenMotorcycle: boolean;
  securitiesAttEngine: boolean;
  verifyComplete: boolean = false;
  RegisRefId: any;
  RegisRefName: any;
  showAlert: string = 'STD00000';
  ReqSecuritiesBy: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private lots27Service: Lots27Service,
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
      SecurityOwner: [null, Validators.required],
      ContractNumber: [null, Validators.required],
      Description: [null, Validators.required],
      Remark: null,
      RowVersion: null,
      RefRegisterId: null,
      RefRegisterName: [{ value: null, disabled: true }],
      RefRegisterDate: [{ value: null, disabled: true }],
      RefRegisterChannel: [{ value: null, disabled: true }],
      SecuritiesImages: this.fb.array([]),
      SecuritiesAttributes: this.fb.group({}),
      ApprovedCode: [{ value: 'AUTO', disabled: true }],
      ReqSecuritiesBy: [{ value: null, disabled: true }],
      AppPrincipleAmount: [{ value: null, disabled: true }],
      CustomerReqSecurities: [{ value: null, disabled: true }],
      SecuritiesSource: 'W',
      ProvinceOutOfBound: [{ value: null, disabled: true }],
      EndNotTransferDate: [{ value: null, disabled: true }],
      EndTransferInheritanceDate: [{ value: null, disabled: true }],
    });

    this.requestSecuritiesForm.controls.SecuritiesCategoryId.valueChanges.subscribe(
      (value) => {
        this.checkButton = false;
        this.requestSecuritiesForm.controls.Description.setValue(null);
        let securities = this.assetTypeList.find(function (item) {
          return item.Value == value;
        }) || {}
        if (this.editSecurities || this.securitiesMaster.SecuritiesSource == 'M') {
          this.getSecuritiesAttributes(securities.Value, this.requestSecuritiesForm.controls.SecuritiesCode.value);
          this.getTemplateView(securities.Value2, this.requestSecuritiesForm.controls.SecuritiesCode.value);
        } else {
          this.getSecuritiesAttributes(securities.Value, null);
          this.getTemplateView(securities.Value2, null);
        }

        if (value != 2 && value != 3) {
          this.requestSecuritiesForm.controls.EstimateAmount.setValue(9999999);
        } else {
          this.requestSecuritiesForm.controls.EstimateAmount.setValue(0);
        }
      }
    )

    this.requestSecuritiesForm.controls.ContractNumber.valueChanges.subscribe(
      (control) => {
        if (control) {
          this.showAlert = "STD00030";
        } else {
          this.showAlert = "STD00000";
        }
      }
    );

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
      RegisterId: null,
      AttahmentId: null
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
      this.lots27Service.getRegisRef(this.RegisRefId).subscribe(
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
      this.securitiesMaster = data.lots27.SecuritiesDetail;
      this.assetTypeList = data.lots27.master.AssetList;
      this.docStatusList = data.lots27.master.DocStatusList;
      this.ReqSecuritiesBy = data.lots27.master.ReqSecuritiesBy;
      this.province = data.lots27.province.LoanTypesDto;
      this.brandCar = data.lots27.brandCar.LoanTypesDto;
      this.brandMotorcycle = data.lots27.brandMotorcycle.LoanTypesDto;

    });

    this.rebuildForm();
  }

  rebuildForm() {
    this.requestSecuritiesForm.controls.Description.disable();
    this.requestSecuritiesForm.markAsPristine();
    this.bindDropDownList();
    if (this.securitiesMaster.SecuritiesCode != null) {
      if (this.securitiesMaster.SecuritiesSource == 'M') {
        this.editSecurities = false;
      } else {
        this.editSecurities = true;
      }

      this.securitiesAttGen = false;
      this.securitiesAttMould = false;
      this.securitiesAttDistrict = false;
      this.securitiesAttSubDistrict = false;
      this.securitiesAttGenMotorcycle = false;
      this.securitiesBodyNumber = false;
      this.securitiesAttEngine = false;
      this.requestSecuritiesForm.patchValue(this.securitiesMaster);
      this.requestSecuritiesForm.controls.SecuritiesCategoryId.setValue(String(this.securitiesMaster.SecuritiesCategoryId), { emitEvent: false });
      this.requestSecuritiesForm.controls.SecuritiesCategoryId.disable({ emitEvent: false });
      this.requestSecuritiesForm.controls.EstimateAmount.disable({ emitEvent: false });
      this.requestSecuritiesForm.controls.LoanLimitAmount.disable({ emitEvent: false });
      this.requestSecuritiesForm.controls.ReqSecuritiesBy.setValue(this.securitiesMaster['ReqSecuritiesBy' + this.lang.CURRENT], { emitEvent: false });

      if (this.securitiesMaster.ProvinceOutOfBound) {
        this.requestSecuritiesForm.controls.ProvinceOutOfBound.setValue(this.securitiesMaster.ProvinceOutOfBound.toString(), { emitEvent: false });
      }

      if (this.RegisRefId ? this.RegisRefId : this.requestSecuritiesForm.controls.RefRegisterId.value) {
        this.lots27Service.getRegisRef(this.RegisRefId ? this.RegisRefId : this.requestSecuritiesForm.controls.RefRegisterId.value).subscribe(
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
            }
          });
      }
    } else {
      this.requestSecuritiesForm.controls.ReqSecuritiesBy.setValue(this.ReqSecuritiesBy, { emitEvent: false });
    }

    if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4'
      || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '6' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '7'
      || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '8') {
      this.requestSecuritiesForm.disable({ emitEvent: false });
      this.verifyComplete = true;
    }

    if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '1' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '2') {
      this.requestSecuritiesForm.controls.SecurityOwner.enable({ emitEvent: false });
      this.requestSecuritiesForm.controls.ContractNumber.enable({ emitEvent: false });
    }
  }

  bindDropDownList() {
    if (this.assetTypeList) {
      this.assetTypeList = this.selectFilter.FilterActive(this.assetTypeList);
      this.assetTypeList = [...this.assetTypeList];
    }

    if (this.province) {
      this.province = this.selectFilter.FilterActive(this.province);
      this.province = [...this.province];
    }

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
  }

  getSecuritiesAttributes(SecuritiesType: string, SecuritiesCode: string) {
    if (SecuritiesType) {
      this.lots27Service.getSecuritiesAttributes(SecuritiesType, SecuritiesCode).subscribe(
        async (res) => {
          const securityList = await this.getattribute(res);
          this.requestSecuritiesForm.setControl('SecuritiesAttributes', this.toFormGroup(securityList));
          this.securitiesAttributeList = securityList;

          var mould = null;
          if (this.requestSecuritiesForm.controls.SecuritiesStatus.value != '3' && this.requestSecuritiesForm.controls.SecuritiesStatus.value != '4'
            && this.requestSecuritiesForm.controls.SecuritiesStatus.value != '6' && this.requestSecuritiesForm.controls.SecuritiesStatus.value != '7'
            && this.requestSecuritiesForm.controls.SecuritiesStatus.value != '8') {
            this.securitiesAttributeList.forEach(item => {
              if (item.labelEng === 'Mould') {
                mould = item.value;
              }

              if (item.labelEng === 'Year' && mould != null) {
                this.checkEstimateAmount(item.value, mould);
              }
            });
          }
        }
      );
    } else {
      this.securitiesAttributeList = [];
      this.requestSecuritiesForm.setControl('SecuritiesAttributes', this.fb.group({}))
    }
  }

  getTemplateView(TemplateViewID?: number, SecuritiesCode: string = null) {
    if (TemplateViewID) {
      this.lots27Service.getImageDetails(TemplateViewID, SecuritiesCode).subscribe(
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

  onSubmit() {
    this.submitted = true;
    this.securitiesDetail();
    if (this.requestSecuritiesForm.invalid) {
      this.focusToggle = !this.focusToggle;
      this.as.warning('', 'Message.LO00003');
      return;
    }

    if (this.requestSecuritiesForm.controls.LoanLimitAmount.value > this.requestSecuritiesForm.controls.EstimateAmount.value) {
      this.as.warning('', 'Message.LO00029');
      return;
    }

    // if ((this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 2 || this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 3) && this.requestSecuritiesForm.controls.EstimateAmount.value <= 0) {
    //   this.as.warning('', 'Message.LO00032');
    //   return;
    // }

    if (!this.approved) {
      this.lots27Service.checkDuplicate(this.requestSecuritiesForm.controls['Description'].value
        , this.requestSecuritiesForm.controls['SecuritiesCode'].value).pipe(
          finalize(() => {
          }))
        .subscribe(
          (res: boolean) => {
            if (res) {
              this.saving = true;
              this.prepareSave(this.requestSecuritiesForm.getRawValue());

              this.lots27Service.saveRequestSecurities(this.securitiesMaster, this.imageFiles).pipe(
                switchMap((code) => {
                  return this.lots27Service.getSearchEdit(code || this.securitiesMaster.SecuritiesCode);
                }),
                finalize(() => {
                  this.saving = false;
                  this.submitted = false;
                  this.verifyComplete = false;
                  this.approved = false;
                }))
                .subscribe((res: Securities) => {
                  if (res) {
                    this.securitiesMaster = res;
                    this.rebuildForm();
                    this.as.success('', 'Message.STD00006');
                  }
                });
            } else {
              this.as.warning('', 'Message.STD00004', ['Label.LOTS27.SecuritiesDescription']);
            }
          }
        );
    } else {
      this.saving = true;

      const param = {
        'CompanyCode': this.requestSecuritiesForm.controls.CompanyCode.value
        , 'SecuritiesCode': this.requestSecuritiesForm.controls.SecuritiesCode.value
        , 'SecuritiesDate': this.requestSecuritiesForm.controls.SecuritiesDate.value
        , 'SecuritiesCategoryId': this.requestSecuritiesForm.controls.SecuritiesCategoryId.value
        , 'SecuritiesStatus': this.requestSecuritiesForm.controls.SecuritiesStatus.value
        , 'EstimateAmount': this.requestSecuritiesForm.controls.EstimateAmount.value
        , 'LoanLimitAmount': this.requestSecuritiesForm.controls.LoanLimitAmount.value
        , 'SecurityOwner': this.requestSecuritiesForm.controls.SecurityOwner.value
        , 'ContractNumber': this.requestSecuritiesForm.controls.ContractNumber.value
        , 'Description': this.requestSecuritiesForm.controls.Description.value
        , 'Remark': this.requestSecuritiesForm.controls.Remark.value
        , 'ApprovedCode': this.requestSecuritiesForm.controls.ApprovedCode.value || ''
        , 'RowVersion': this.requestSecuritiesForm.controls.RowVersion.value
      };
      this.lots27Service.reApproveSecurities(param).pipe(
        switchMap((code) => {
          return this.lots27Service.getSearchEdit(code || this.securitiesMaster.SecuritiesCode);
        }),
        finalize(() => {
          this.saving = false;
          this.submitted = false;
          this.verifyComplete = false;
          this.approved = false;
        }))
        .subscribe((res: Securities) => {
          if (res) {
            this.securitiesMaster = res;
            this.rebuildForm();

            this.as.success('', 'Message.STD00006');
          }
        });
    }
  }

  prepareSave(values) {
    Object.assign(this.securitiesMaster, values);
    delete this.securitiesMaster['SecuritiesAttributes'];

    let arr = [];
    this.securitiesAttributeList.forEach((item) => {
      var data = <SecuritiesAttribute>{};
      if (item.controlType == 'List') {

        if (item.labelEng == "Brand" || item.labelEng == "Generation" || item.labelEng == "Mould" || item.labelEng == "Body number" || item.labelEng == "EngineNumber") {
          data.SecuritiesAttributeId = item.id;
          data.AttributeValue = item.value;
          data.RowVersion = item.RowVersion;
          data.RowState = item.RowState;
          data.CategoryAttributeId = item.TitleSeq;
        } else {
          data.SecuritiesAttributeId = item.id;
          data.AttributeValueId = item.value;
          data.RowVersion = item.RowVersion;
          data.RowState = item.RowState;
          data.CategoryAttributeId = item.TitleSeq;
        }
      }
      else if (item.controlType == "Date") {
        data.SecuritiesAttributeId = item.id;
        data.AttributeValue = item.value == null ? null : item.value.toJSON();
        data.RowVersion = item.RowVersion;
        data.RowState = item.RowState;
        data.CategoryAttributeId = item.TitleSeq;
      } else {
        data.SecuritiesAttributeId = item.id;
        data.AttributeValue = item.value;
        data.RowVersion = item.RowVersion;
        data.RowState = item.RowState;
        data.CategoryAttributeId = item.TitleSeq;
      }
      arr.push(data);
    });

    this.securitiesMaster.SecuritiesAttribute = [];
    Object.assign(this.securitiesMaster.SecuritiesAttribute, arr);
    this.securitiesMaster.SecuritiesImages.forEach((item) => {
      item.AttahmentId = isNaN(item.AttahmentId) ? null : item.AttahmentId;

      if (this.securitiesMaster.RowVersion != null && item.RowState == RowState.Add) {
        item.SecuritiesCode = this.securitiesMaster.SecuritiesCode;
      }
    })
  }

  back() {
    if (this.RegisRefId) {
      this.router.navigate(['/lo/lots02/detail', { CustomerCode: this.securitiesRegisRef.RegisterId, Flag: true }], { skipLocationChange: true });
    } else {
      this.router.navigate(['/lo/lots27'], { skipLocationChange: true });
    }
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

  securitiesDetail() {
    if (this.requestSecuritiesForm.controls.SecuritiesAttributes.value != null) {
      let detailSecurities = '';
      let carObj = { plateNumber: 'รถยนต์ เลขทะเบียน : ', province: ' จังหวัด : ' };
      let motorcycleObj = { plateNumber: 'รถจักรยานยนต์ เลขทะเบียน : ', province: ' จังหวัด : ' };
      let landObj = { landNumber: 'โฉนดที่ดินเลขที่ : ', landNo: ' ที่ดินเลขที่ : ', subDistrict: ' ตำบล : ', district: ' อำเภอ : ', province: ' จังหวัด : ' };
      let NS3KObj = { landNumber: 'นส 3 ก เลขที่ : ', landNo: ' ที่ดินเลขที่ : ', subDistrict: ' ตำบล : ', district: ' อำเภอ : ', province: ' จังหวัด : ' }
      let address = { subDistrict: '', district: '', province: '' }
      this.securitiesAttributeList.forEach(element => {
        if (element.value != null && element.value != '') {
          if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 2) {
            if (element.labelEng == 'Plate number') {
              carObj.plateNumber += element.value;
            } else if (element.labelEng == 'Province') {
              let index = element.options.find((item) => {
                return item.Value == element.value
              });
              carObj.province += index.TextTha;
            }
            this.requestSecuritiesForm.controls.Description.setValue(carObj.plateNumber + carObj.province);
          } else if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 3) {
            if (element.labelEng == 'Plate number') {
              motorcycleObj.plateNumber += element.value;
            } else if (element.labelEng == 'Province') {
              let index = element.options.find((item) => {
                return item.Value == element.value
              });
              motorcycleObj.province += index.TextTha;
            }
            this.requestSecuritiesForm.controls.Description.setValue(motorcycleObj.plateNumber + motorcycleObj.province);
          } else if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 1) {

            if (element.labelEng == 'Deed number') {
              landObj.landNumber += element.value;
            } else if (element.labelEng == 'Land number') {
              landObj.landNo += element.value;
            } else if (element.labelEng == 'Subdistrict') {
              let index = element.options.find((item) => {
                return item.Value == element.value
              });
              landObj.subDistrict += index.TextTha;
            } else if (element.labelEng == 'District') {
              let index = element.options.find((item) => {
                return item.Value == element.value
              });
              landObj.district += index.TextTha;
            } else if (element.labelEng == 'Province') {
              let index = element.options.find((item) => {
                return item.Value == element.value
              });
              landObj.province += index.TextTha;
            }
            this.requestSecuritiesForm.controls.Description.setValue(landObj.landNumber + landObj.landNo + landObj.subDistrict + landObj.district + landObj.province);
          } else if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 4) {
            if (element.labelEng == 'NS3K number') {
              NS3KObj.landNumber += element.value;
            } else if (element.labelEng == 'Land number') {
              NS3KObj.landNo += element.value;
            } else if (element.labelEng == 'Subdistrict') {
              let index = element.options.find((item) => {
                return item.Value == element.value
              });
              NS3KObj.subDistrict += index.TextTha;
            } else if (element.labelEng == 'District') {
              let index = element.options.find((item) => {
                return item.Value == element.value
              });
              NS3KObj.district += index.TextTha;
            } else if (element.labelEng == 'Province') {
              let index = element.options.find((item) => {
                return item.Value == element.value
              });
              NS3KObj.province += index.TextTha;
            }
            this.requestSecuritiesForm.controls.Description.setValue(NS3KObj.landNumber + NS3KObj.landNo + NS3KObj.subDistrict + NS3KObj.district + NS3KObj.province);
          } else {
            if (element.labelEng == 'Province' || element.labelEng == 'District' || element.labelEng == 'Subdistrict') {
              if (element.labelEng == 'Subdistrict') {
                let index = element.options.find((item) => {
                  return item.Value == element.value
                });
                address.subDistrict = ' ตำบล : ' + index.TextTha;
              } else if (element.labelEng == 'District') {
                let index = element.options.find((item) => {
                  return item.Value == element.value
                });
                address.district = ' อำเภอ : ' + index.TextTha;
              } else if (element.labelEng == 'Province') {
                let index = element.options.find((item) => {
                  return item.Value == element.value
                });
                address.province = ' จังหวัด : ' + index.TextTha;
              }
            } else {
              if (element.controlType == "List") {
                let index = element.options.find((item) => {
                  return item.Value == element.value
                });
                detailSecurities += element.labelTha + ": " + index.TextTha + " ";
              } else {
                detailSecurities += element.labelTha + ": " + element.value + " ";
              }
            }
            this.requestSecuritiesForm.controls.Description.setValue(detailSecurities + address.subDistrict + address.district + address.province);
          }
        }
      });
    }
  }

  tabSelected() {
    this.securitiesDetail();
    setTimeout(this.triggerResize.bind(this), 1)
  }

  toFormGroup(forms: FormsBase<any>[]) {
    let group: any = {};
    forms.forEach(form => {

      if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4'
        || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '6' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '7'
        || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '8') {
        if (this.approved) {
          if (form.labelEng == "Brand" || form.labelEng == "Generation" || form.labelEng == "Mould" || form.labelEng == "Body number" || form.labelEng == "EngineNumber" || form.labelEng == 'Year' || form.labelEng == 'CarModelCode') {
            group[form.key] = form.required ? new FormControl({ value: null, disabled: false }, Validators.required)
              : new FormControl({ value: null, disabled: false });
          } else {
            group[form.key] = form.required ? new FormControl({ value: form.value || null, disabled: false }, Validators.required)
              : new FormControl({ value: form.value || null, disabled: false });
          }
        } else {
          group[form.key] = form.required ? new FormControl({ value: form.value || null, disabled: true }, Validators.required)
            : new FormControl({ value: form.value || null, disabled: true });
        }
      } else if ((form.labelEng == 'District' || form.labelEng == 'Subdistrict' || form.labelEng == 'Generation' || form.labelEng == 'Mould' || form.labelEng == 'Year' || form.labelEng == 'Body number' || form.labelEng == 'EngineNumber' || form.labelEng == 'CarModelCode') && !this.editSecurities) {
        if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 2 && form.labelEng == 'Body number') {
          group[form.key] = form.required ? new FormControl({ value: form.value || null, disabled: false }, Validators.required)
            : new FormControl({ value: form.value || null, disabled: false });
        } else {

          group[form.key] = form.required ? new FormControl({ value: form.value || null, disabled: true }, Validators.required)
            : new FormControl({ value: form.value || null, disabled: true });

        }
      } else {
        group[form.key] = form.required ? new FormControl(form.value || null, Validators.required)
          : new FormControl(form.value || null);
      }

      (group[form.key] as FormControl).valueChanges.subscribe(
        val => {
          if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 2) {

            if (form.labelEng == 'Plate number') {
              let indexBand = forms.findIndex(x => x.labelEng == 'Plate number');
              var ddlKeep = forms[indexBand];
              if (this.approved) {
                group[ddlKeep.key].disable({ emitEvent: false });
              }
            }

            if (form.labelEng == 'Car number') {
              let indexBand = forms.findIndex(x => x.labelEng == 'Car number');
              var ddlKeep = forms[indexBand];
              if (this.approved) {
                group[ddlKeep.key].disable({ emitEvent: false });
              }
            }

            if (form.labelEng == 'Brand') {
              let indexBand = forms.findIndex(x => x.labelEng == 'Brand');
              var ddlKeep = forms[indexBand];
              if (this.approved && !this.resetValue) {

                group[ddlKeep.key].enable({ emitEvent: false });
                group[ddlKeep.key].setValue(null, { emitEvent: false });
                this.resetValue = true;

              } else if (this.approved && this.resetValue) {

                if (group[ddlKeep.key].value) {
                  let index = forms.findIndex(x => x.labelEng == 'Generation');
                  if (index >= 0) {
                    this.GetGeneration(val, forms, index, group);
                  }
                }
              } else {
                let index = forms.findIndex(x => x.labelEng == 'Generation');
                if (index >= 0) {
                  this.GetGeneration(val, forms, index, group);
                }
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
            if (form.labelEng == 'Year') {
              let mouldVal = forms.find(x => x.labelEng == 'Mould').value;
              if (mouldVal && val && !this.editSecurities || (val && this.approved)) {
                this.checkButton = true;
                this.checkEstimateAmount(val, mouldVal);
              }
            }
          } else if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 3) {

            if (form.labelEng == 'Plate number') {
              let indexBand = forms.findIndex(x => x.labelEng == 'Plate number');
              var ddlKeep = forms[indexBand];
              if (this.approved) {
                group[ddlKeep.key].disable({ emitEvent: false });
              }
            }

            if (form.labelEng == 'Car number') {
              let indexBand = forms.findIndex(x => x.labelEng == 'Car number');
              var ddlKeep = forms[indexBand];
              if (this.approved) {
                group[ddlKeep.key].disable({ emitEvent: false });
              }
            }
            if (form.labelEng == 'Brand') {
              let index = forms.findIndex(x => x.labelEng == 'Generation');
              if (index >= 0) {
                this.GetGenerationMotorcycle(val, forms, index, group);
              }
            }

            if (form.labelEng == 'Generation') {
              let index = forms.findIndex(x => x.labelEng == 'Body number');
              if (index >= 0) {
                this.getBodyNumber(val, forms, index, group);
              }
            }

            if (form.labelEng == 'Body number') {
              let index = forms.findIndex(x => x.labelEng == 'EngineNumber');
              if (index >= 0) {
                this.getEngineNumber(val, forms, index, group);
              }
            }

            if (form.labelEng == 'EngineNumber') {
              let index = forms.findIndex(x => x.labelEng == 'Year');
              if (index >= 0) {
                this.checkYear(val, forms, index, group);
              }
            }

            if (form.labelEng == 'Year') {
              let EngineNumberVal = forms.find(x => x.labelEng == 'EngineNumber').value;
              if ((EngineNumberVal && val && !this.editSecurities) || (val && this.approved)) {
                this.checkButton = true;
                this.checkEstimateAmount(val, EngineNumberVal);
              }
            }
          }

          if (form.labelEng == 'Province') {
            let index = forms.findIndex(x => x.labelEng == 'District');
            if (index >= 0) {
              this.GetDistrict(val, forms, index, group);
            }
            if (this.approved) {
              let indexProvince = forms.findIndex(x => x.labelEng == 'Province');
              var ddlKeep = forms[indexProvince];
              if (this.approved) {
                group[ddlKeep.key].disable({ emitEvent: false });
              }
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
        if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4'
          || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '6' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '7'
          || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '8') {
          if (this.approved) {
            group[ddlKeep.key].enable({ emitEvent: false });
          } else {
            group[ddlKeep.key].disable({ emitEvent: false });
          }
        } else {
          group[ddlKeep.key].enable({ emitEvent: false });
          if (group[ddlKeep.key].value != null && !this.editSecurities || this.approved) {
            this.checkEstimateAmount(group[ddlKeep.key].value, value);
          }
        }
      }
      else {
        if (!group[ddlKeep.key].value) {
          group[ddlKeep.key].setValue(null);
        }
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
    this.lots27Service.getEngineNumber(modelName, generation).subscribe(
      (res: any) => {
        let detail = res.EngineNumbersData;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];
        let index1 = formsEngine.findIndex(x => x.labelEng == 'EngineNumber');
        var ddlKeep = formsEngine[index1];
        if (this.approved) {
          group[ddlKeep.key].disable({ emitEvent: false });
        }
        if (ddlKeep) {
          if (generation) {
            if (this.securitiesAttGenMotorcycle && this.securitiesBodyNumber && this.securitiesAttEngine) {
              group[ddlKeep.key].setValue(null);
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '6' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '7'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '8') {
              if (this.approved) {
                group[ddlKeep.key].enable({ emitEvent: false });
              } else {
                group[ddlKeep.key].disable({ emitEvent: false });
              }

            } else {
              group[ddlKeep.key].enable({ emitEvent: false });
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

    this.lots27Service.getBodyNumber(generation).subscribe(
      (res: any) => {
        let detail = res.BodyNumbersData;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];
        let index2 = formsBody.findIndex(x => x.labelEng == 'Body number')
        var ddlKeep = formsBody[index2];
        if (ddlKeep) {
          if (generation) {
            if (this.securitiesAttGenMotorcycle && this.securitiesBodyNumber && this.securitiesAttEngine) {
              if (!this.approved) {
                group[ddlKeep.key].setValue(null);
              }
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '6' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '7'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '8') {
              if (this.approved) {
                group[ddlKeep.key].enable({ emitEvent: false });
              } else {
                group[ddlKeep.key].disable({ emitEvent: false });
              }
            } else {
              group[ddlKeep.key].enable({ emitEvent: false });
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
    this.lots27Service.getMould(generation).subscribe(
      (res: any) => {
        let detail = res.MouldsData;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];

        var ddlKeep = forms[index];
        if (ddlKeep) {
          if (generation) {
            if (this.securitiesAttGen && this.securitiesAttMould) {
              if (!this.approved) {
                group[ddlKeep.key].setValue(null);
              }
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '6' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '7'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '8') {
              if (!this.approved) {
                group[ddlKeep.key].disable({ emitEvent: false });
              } else {
                group[ddlKeep.key].enable({ emitEvent: false });
              }
            } else {
              group[ddlKeep.key].enable({ emitEvent: false });

            }
          } else {
            ddlKeep.options = [];
            // if (!this.approved) {
            group[ddlKeep.key].setValue(null);
            group[ddlKeep.key].disable({ emitEvent: false });
            // }
          }
          (ddlKeep as DropdownForms).isReady.next(true);
        }
        this.securitiesAttMould = true;
      });
  }

  GetGenerationMotorcycle(brand, formsGen, index, group) {
    this.lots27Service.getGenerationMotorcycleDDL(brand).subscribe(
      (res: any) => {
        let detail = res.GenerationMotorcyclesData;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];

        var ddlKeep = formsGen[index];
        if (ddlKeep) {
          if (brand) {
            if (this.securitiesAttGenMotorcycle && this.securitiesBodyNumber && this.securitiesAttEngine) {
              if (!this.approved) {
                group[ddlKeep.key].setValue(null);
              }
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '6' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '7'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '8') {
              if (!this.approved) {
                group[ddlKeep.key].disable({ emitEvent: false });
              } else {
                group[ddlKeep.key].enable({ emitEvent: false });
              }
            } else {
              group[ddlKeep.key].enable({ emitEvent: false });

            }
          } else {
            ddlKeep.options = [];
            if (!this.approved) {
              group[ddlKeep.key].setValue(null);
              group[ddlKeep.key].disable({ emitEvent: false });
            }
          }
          (ddlKeep as DropdownForms).isReady.next(true);
        }
        this.securitiesAttGenMotorcycle = true;
      });
  }

  GetGeneration(brand, forms, index, group) {
    this.lots27Service.getGeneration(brand).subscribe(
      (res: any) => {
        let detail = res.GenerationsData;
        detail = this.selectFilter.FilterActive(detail);
        detail = [...detail];

        var ddlKeep = forms[index];
        if (ddlKeep) {
          if (brand) {
            if (this.securitiesAttGen && this.securitiesAttMould) {
              if (!this.approved) {
                group[ddlKeep.key].setValue(null);
              }
            }
            ddlKeep.options = detail;
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '6' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '7'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '8') {
              if (!this.approved) {
                group[ddlKeep.key].disable({ emitEvent: false });
              } else {
                group[ddlKeep.key].enable({ emitEvent: false });
              }
            } else {
              group[ddlKeep.key].enable({ emitEvent: false });

            }
          } else {
            ddlKeep.options = [];
            if (!this.approved) {
              group[ddlKeep.key].setValue(null);
              group[ddlKeep.key].disable({ emitEvent: false });
            }
          }
          (ddlKeep as DropdownForms).isReady.next(true);
        }
        this.securitiesAttGen = true;
      });
  }

  GetDistrict(province, forms, index, group) {
    this.lots27Service.getDistrict(province).subscribe(
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
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '6' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '7'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '8') {
              group[ddlKeep.key].disable({ emitEvent: false });

            } else {
              group[ddlKeep.key].enable({ emitEvent: false });
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
    this.lots27Service.getSubDistrict(district).subscribe(
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
            if (this.requestSecuritiesForm.controls.SecuritiesStatus.value == '3' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '4'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '6' || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '7'
              || this.requestSecuritiesForm.controls.SecuritiesStatus.value == '8') {
              group[ddlKeep.key].disable({ emitEvent: false });
            } else {
              group[ddlKeep.key].enable({ emitEvent: false });
            }
          }
          (ddlKeep as DropdownForms).isReady.next(true);
        }
        this.securitiesAttSubDistrict = true;
      });
  }

  onRemoveImage(index, attahmentId: number) {
    let detail = this.SecuritiesImages.at(index) as FormGroup
    if (detail.controls.AttahmentId.value == attahmentId) {
      detail.controls.FileDeleting.setValue(attahmentId, { emitEvent: false })
    }
  }

  checkDuplicateImageName(result) {
    for (const form of this.SecuritiesImages.value) {
      if (form.ImageName === result.ImageName) {
        this.as.warning('', 'Message.LO00011');
        return true;
      }
    }
  }

  onSelectedImage(index, securitiesImage: SecuritiesImage) {
    if (!this.checkDuplicateImageName(securitiesImage)) {
      let detail = this.SecuritiesImages.at(index) as FormGroup
      detail.controls.ImageName.setValue(securitiesImage.ImageName, { emitEvent: false });
      detail.controls.ImageId.setValue(securitiesImage.ImageId, { emitEvent: false });
      detail.controls.RegisterId.setValue(securitiesImage.RegisterId, { emitEvent: false });
      detail.controls.AttahmentId.setValue(securitiesImage.ImageName, { emitEvent: false });
    }
  }

  openPopupHistoryVerify() {
    const data = {
      securitiesCode: this.securitiesMaster.SecuritiesCode,
      isSuperUser: this.securitiesMaster.IsSupperUser
    };
    this.modal.openComponent(SecuritiesHistoryVerifyDetailPopupComponent, Size.large, data).pipe(
      switchMap((code) => {
        if (code != '') {
          return this.lots27Service.getSearchEdit(code || this.securitiesMaster.SecuritiesCode)
        } else {
          return [];
        }
      }),
      finalize(() => {
      }))
      .subscribe((res: Securities) => {
        if (res) {
          this.securitiesMaster = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        }
      });
  }

  checkEstimateAmount(year, mouldVal) {
    if (this.requestSecuritiesForm.controls.SecuritiesAttributes.value != null) {
      let brand = '';
      let gen = '';
      let mould = '';
      let bodyNumber = '';
      let carModelCode = '';
      let engineNumber = '';

      this.securitiesAttributeList.forEach(element => {
        if (element.labelEng == "Brand") {
          brand = element.value;
        } else if (element.labelEng == "Generation") {
          gen = element.value;
        } else if (element.labelEng == "Mould") {
          mould = element.value;
        } else if (element.labelEng == "Body number") {
          bodyNumber = element.value;
        } else if (element.labelEng == "EngineNumber") {
          engineNumber = element.value;
        } else if (element.labelEng == "CarModelCode") {
          carModelCode = element.value;
        }
      });

      if (!year) {
        year = this.securitiesAttributeList.find(x => x.labelEng == "Year").value;
      };

      if (!mould) {
        mould = mouldVal;
      };

      if (!engineNumber) {
        engineNumber = mouldVal;
      };

      if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 2 && brand != '' && gen != '') {
        this.lots27Service.getCheckEstimateAmount(brand, gen, mould, year).subscribe(
          (res) => {
            let price = res.EstimateAmount;
            if (price.length > 0) {
              let EstimateAmount = res.EstimateAmount[0].Price
              this.requestSecuritiesForm.controls.EstimateAmount.setValue(EstimateAmount);
              this.requestSecuritiesForm.controls.EstimateAmount.disable();
            } else {
              this.requestSecuritiesForm.controls.EstimateAmount.setValue(0);
              this.requestSecuritiesForm.controls.EstimateAmount.disable();
              this.as.warning('', 'Message.LO00032');
            }
          });
      } else if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 3) {
        this.lots27Service.getCheckEstimateAmountMotorycle(brand, gen, bodyNumber, engineNumber, carModelCode, year).subscribe(
          (res) => {
            let price = res.EstimateAmountsData;
            if (price.length > 0) {
              let EstimateAmount = res.EstimateAmountsData[0].Price
              this.requestSecuritiesForm.controls.EstimateAmount.setValue(EstimateAmount);
              this.requestSecuritiesForm.controls.EstimateAmount.disable();
            } else {
              this.requestSecuritiesForm.controls.EstimateAmount.setValue(0);
              this.requestSecuritiesForm.controls.EstimateAmount.disable();
              this.as.warning('', 'Message.LO00032');
            }
          });
      }
    }
  }

  onReApproved() {
    this.approved = true;
    this.requestSecuritiesForm.markAsDirty();

    if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 2 || this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 3) {
      this.requestSecuritiesForm.controls.SecuritiesAttributes.enable();
      this.rebuildForm()
    } else {
      if (this.requestSecuritiesForm.controls.SecuritiesCategoryId.value == 1) {
        this.requestSecuritiesForm.controls.EstimateAmount.enable();
      }
    }
    this.requestSecuritiesForm.controls.LoanLimitAmount.enable();
  }
}
