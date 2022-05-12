import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { Page, SelectFilterService, ModelRef, ModalService, Size, RowState } from '@app/shared';
import { finalize } from 'rxjs/operators';
import { LoanAgreementType, LoanTypeBorrower, LoanTypeBorrowerDetail, LoanTypeCustomerCredit, Lomt12Service, ProvinceList } from './lomt12.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './lomt12-detail.component.html',
  styleUrls: ['./lomt12.component.scss']
})
export class Lomt12DetailComponent implements OnInit {
  //-------------------------------------------------Borrower1-------------------------------------------------------
  //-------------------------------------------------Excution-------------------------------------------------------
  @ViewChild('editBorrower1DetailIdCardAddress') editBorrower1DetailIdCardAddress;
  @ViewChild('editBorrower1DetailCurrentAddress') editBorrower1DetailCurrentAddress;
  @ViewChild('editBorrower1DetailWorkplaceAddress') editBorrower1DetailWorkplaceAddress;
  //-------------------------------------------------Contract-------------------------------------------------------
  @ViewChild('editBorrower1DetailIdCardAddressContract') editBorrower1DetailIdCardAddressContract;
  @ViewChild('editBorrower1DetailCurrentAddressContract') editBorrower1DetailCurrentAddressContract;
  @ViewChild('editBorrower1DetailWorkplaceAddressContract') editBorrower1DetailWorkplaceAddressContract;
  //-----------------------------------------------------------------------------------------------------------------

  //-------------------------------------------------Borrower1-------------------------------------------------------
  //-------------------------------------------------Excution-------------------------------------------------------
  @ViewChild('editBorrower2DetailIdCardAddress') editBorrower2DetailIdCardAddress;
  @ViewChild('editBorrower2DetailCurrentAddress') editBorrower2DetailCurrentAddress;
  @ViewChild('editBorrower2DetailWorkplaceAddress') editBorrower2DetailWorkplaceAddress;
  //-------------------------------------------------Contract-------------------------------------------------------

  @ViewChild('editBorrower2DetailIdCardAddressContract') editBorrower2DetailIdCardAddressContract;
  @ViewChild('editBorrower2DetailCurrentAddressContract') editBorrower2DetailCurrentAddressContract;
  @ViewChild('editBorrower2DetailWorkplaceAddressContract') editBorrower2DetailWorkplaceAddressContract;
  //-----------------------------------------------------------------------------------------------------------------

  page = new Page();
  focusToggle: boolean;
  saving: boolean;
  submitted: boolean;

  addressType: string;
  currentAddress: string;
  idCardAddress: string;
  workplaceAddress: string;

  borrowerDetailType: string;
  execution: string;
  contract: string;

  popup: ModelRef;

  loanAgreementForm: FormGroup;
  loanAgreementType: LoanAgreementType = {} as LoanAgreementType;
  //-----------------------Borrower1 ---------------------------------------
  LoanTypeBorrower1Form: FormGroup;
  //-----------------------Borrower2 ---------------------------------------
  LoanTypeBorrower2Form: FormGroup;

  regisProvince = [];

  master: {
    LoanTypeList: any[]
    , CanRefinances: any[]
    , ContractTypeList: any[]
    , ProvinceList: any[]
    , CustomerCreditTypeList: any[]
  };

  LoanTypeList = [];
  CanRefinances = [];
  ContractTypeList = [];
  ProvinceList = [];
  CustomerCreditTypeList = [];
  customerCreditList = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    private as: AlertService,
    private filter: SelectFilterService,
    private lomt12Service: Lomt12Service,
    public lang: LangService
  ) {
    this.createForm();
  }

  createForm() {
    this.loanAgreementForm = this.fb.group({
      LoanTypeCode: [null, [Validators.required, Validators.pattern(/\S+/)]],
      LoanTypeNameTha: [null, Validators.required],
      LoanTypeNameEng: null,
      CanRefinance: true,
      Active: true,
      IsLoanInsurance: false,
      ContractType: [null, Validators.required],
      InterestRate: [null, Validators.required],
      MinPeriod: [null, Validators.required],
      MaxPeriod: [null, Validators.required],
      InterestAllMax: [null, Validators.required],
      InterestAllMax2: [null, Validators.required],
      InterestAllMaxDisplay: [null, Validators.required],
      InterestAllMax2Display: [null, Validators.required],
      CategoryId: [null, Validators.required],
      MaxLoanAmount: null,
      MortgageFee: 0,
      ContractDocument: null,
      ContractTypeTha: null,
      ContractTypeEng: null,
      CategoryNameTha: null,
      CategoryNameEng: null,
      RowVersion: null,
      NotCloseAdvance: null,
      NumberMonthsPaid: null
    });

    //---------------------------------------------------------Borrower1-------------------------------------------------
    this.LoanTypeBorrower1Form = this.fb.group({
      LoanTypeBorrowerId: null,
      LoanTypeCode: null,
      IsMainBorrower: null,
      ContractMaximumLimit: null,
      AgeNotOver: null,
      IsRequireSubBorrower: null,
      IsNeedLeastOneSubBorrower: null,
      IsCreditNotEnough: null,
      IsAgeOverSixty: null,
      IsNotRegisProvince: null,
      RegisProvince: null,
      RegisProvinceName: null,
      CustomerCreditType: null,
      NotOverPerYear: null,
      NewContractLimit: null,
      RefinanceLimit: null,
      RefinanceAdditionalPayment: null,
      RowVersion: null,
      RowState: RowState.Add,
      //----------------------------------------------------------------------------------
      LoanTypeBorrower1DetailIdCardAddressForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList: this.fb.array([])
      }),
      LoanTypeBorrower1DetailCurrentAddressForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList: this.fb.array([])
      }),
      LoanTypeBorrower1DetailWorkplaceAddressForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList: this.fb.array([])
      }),
      //----------------------------------------------------------------------------------
      LoanTypeBorrower1DetailIdCardAddressContractForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList: this.fb.array([])
      }),
      LoanTypeBorrower1DetailCurrentAddressContractForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList: this.fb.array([])
      }),
      LoanTypeBorrower1DetailWorkplaceAddressContractForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList: this.fb.array([])
      }),
      //----------------------------------------------------------------------------------
      CustomerCredit1Form: this.fb.array([])
    });

    //---------------------------------------------------------Borrower2------------------------------------------------
    this.LoanTypeBorrower2Form = this.fb.group({
      LoanTypeBorrowerId: null,
      LoanTypeCode: null,
      IsMainBorrower: null,
      ContractMaximumLimit: null,
      AgeNotOver: null,
      IsRequireSubBorrower: null,
      IsNeedLeastOneSubBorrower: null,
      IsCreditNotEnough: null,
      IsAgeOverSixty: null,
      IsNotRegisProvince: null,
      RegisProvince: null,
      RegisProvinceName: null,
      CustomerCreditType: null,
      NotOverPerYear: null,
      NewContractLimit: null,
      RefinanceLimit: null,
      RefinanceAdditionalPayment: null,
      RowVersion: null,
      RowState: RowState.Add,
      RegisProvinceBorrower2List: this.fb.array([]),
      //----------------------------------------------------------------------------------
      LoanTypeBorrower2DetailIdCardAddressForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList2: this.fb.array([])
      }),
      LoanTypeBorrower2DetailCurrentAddressForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList2: this.fb.array([])
      }),
      LoanTypeBorrower2DetailWorkplaceAddressForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList2: this.fb.array([])
      }),
      //----------------------------------------------------------------------------------
      LoanTypeBorrower2DetailIdCardAddressContractForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList2: this.fb.array([])
      }),
      LoanTypeBorrower2DetailCurrentAddressContractForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList2: this.fb.array([])
      }),
      LoanTypeBorrower2DetailWorkplaceAddressContractForm: this.fb.group({
        LoanTypeBorrowerDetailId: null,
        LoanTypeCode: null,
        LoanTypeBorrowerId: null,
        BorrowerDetailType: null,
        AddressType: null,
        IsContractingProvince: false,
        IsInProvince: false,
        IsAllProvince: false,
        RegisProvince: null,
        RegisProvinceName: null,
        RowVersion: null,
        RowState: RowState.Add,
        RegisProvinceList2: this.fb.array([])
      }),
      //----------------------------------------------------------------------------------
      CustomerCredit2Form: this.fb.array([])
    });

    this.LoanTypeBorrower2Form.controls.IsNotRegisProvince.valueChanges.subscribe(
      (val) => {
        if (val) {
          this.RegisProvinceBorrower2List.enable({ emitEvent: false });
        } else {
          this.LoanTypeBorrower2Form.setControl('RegisProvinceBorrower2List', this.fb.array([]));
          this.LoanTypeBorrower2Form.setControl('RegisProvinceBorrower2List', this.fb.array(this.ProvinceList.map((detail) => this.createRegisProvinceForm(detail))));
          this.RegisProvinceBorrower2List.disable({ emitEvent: false });
        }
      }
    )


    this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('IsInProvince').valueChanges.subscribe(
      (val) => {
        if (val) {
          this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('IsAllProvince').enable();
        } else {
          this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('IsAllProvince').disable();
        }
      }
    )

    // this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('IsAllProvince').valueChanges.subscribe(
    //   (val) => {
    //     if (val) {
    //       this.RegisProvinceBorrower2List.enable({ emitEvent: false });
    //     } else {
    //       this.LoanTypeBorrower2Form.setControl('RegisProvinceBorrower2List', this.fb.array([]));
    //       this.LoanTypeBorrower2Form.setControl('RegisProvinceBorrower2List', this.fb.array(this.ProvinceList.map((detail) => this.createRegisProvinceForm(detail))));
    //       this.RegisProvinceBorrower2List.disable({ emitEvent: false });
    //     }
    //   }
    // )
  }

  createLoanTypeBorrower1DetailForm(item: any): FormGroup {
    const fg = this.fb.group({
      LoanTypeBorrowerDetailId: null,
      LoanTypeCode: item.LoanTypeCode == null ? this.loanAgreementType.LoanTypeBorrower1.LoanTypeCode : item.LoanTypeCode,
      LoanTypeBorrowerId: item.LoanTypeBorrowerId == null ? this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerId : item.LoanTypeBorrowerId,
      // LoanTypeCode: null,
      // LoanTypeBorrowerId: null,
      BorrowerDetailType: null,
      AddressType: null,
      IsContractingProvince: false,
      IsInProvince: false,
      IsAllProvince: false,
      RegisProvince: null,
      RegisProvinceName: null,
      RowVersion: null,
      RowState: item.RowState == null ? RowState.Add : item.RowState,
      RegisProvinceList: this.fb.array([])
    });
    fg.patchValue(item, { emitEvent: false });

    if (item.IdCardAddressList != null) {
      item.IdCardAddressList = this.filter.FilterActive(item.IdCardAddressList);
      this.filter.SortByLang(item.IdCardAddressList);
      fg.setControl('RegisProvinceList', this.fb.array(item.IdCardAddressList.map((detail) => this.createRegisProvinceForm(detail))));
    }

    if (item.CurrentAddressList != null) {
      item.CurrentAddressList = this.filter.FilterActive(item.CurrentAddressList);
      this.filter.SortByLang(item.CurrentAddressList);
      fg.setControl('RegisProvinceList', this.fb.array(item.CurrentAddressList.map((detail) => this.createRegisProvinceForm(detail))));
    }

    if (item.WorkplaceAddressList != null) {
      item.WorkplaceAddressList = this.filter.FilterActive(item.WorkplaceAddressList);
      this.filter.SortByLang(item.WorkplaceAddressList);
      fg.setControl('RegisProvinceList', this.fb.array(item.WorkplaceAddressList.map((detail) => this.createRegisProvinceForm(detail))));
    }

    if (item.IdCardAddressList == null && item.CurrentAddressList == null && item.WorkplaceAddressList == null) {
      fg.setControl('RegisProvinceList', this.fb.array(this.ProvinceList.map((detail) => this.createRegisProvinceForm(detail))));
      fg.controls.RegisProvinceList.disable({ emitEvent: false });
      // this.RegisProvinceList.disable({ emitEvent: false });
    }

    if (!fg.controls.IsInProvince.value) {
      fg.controls.IsAllProvince.disable({ emitEvent: false });
    }

    fg.controls.IsInProvince.valueChanges.subscribe(
      (val) => {
        if (val) {
          fg.controls.RegisProvinceList.enable({ emitEvent: true });
          fg.controls.IsAllProvince.enable({ emitEvent: false });
        } else {
          let provinceList = this.ProvinceList;
          provinceList.forEach(element => {
            element.IsCheck = false;
          });
          this.RegisProvinceList.controls.forEach(element => {
            element.get("IsCheck").setValue(false);
          });
          fg.controls.RegisProvinceList.disable({ emitEvent: false });
          fg.controls.IsAllProvince.disable({ emitEvent: false });
          fg.controls.IsAllProvince.setValue(false);
        }
      }
    )

    fg.controls.IsAllProvince.valueChanges.subscribe(
      (val) => {
        if (val) {
          this.RegisProvinceList.controls.forEach(element => {
            element.get("IsCheck").setValue(true);
          });
        } else {
          this.RegisProvinceList.controls.forEach(element => {
            element.get("IsCheck").setValue(false);
          });
        }
      }
    )

    fg.controls.RegisProvinceList.valueChanges.subscribe(
      (val) => {
        var provinceFalse = val.filter(data => {
          return data.IsCheck == false;
        })
        if (provinceFalse.length > 0 && fg.controls.IsAllProvince.value) {
          fg.controls.IsAllProvince.setValue(false, { emitEvent: false })

        } else if (provinceFalse.length == 0 && !fg.controls.IsAllProvince.value) {
          fg.controls.IsAllProvince.setValue(true, { emitEvent: false })
        }
      }
    )

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == null) {
          fg.controls.RowState.setValue(RowState.Add, { emitEvent: false });
        }

        if (control.RowState === RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    );

    return fg;
  }

  createCustomerCredit1Form(item: LoanTypeCustomerCredit): FormGroup {
    const fg = this.fb.group({
      guid: Math.random().toString(), // important for tracking change
      LoanTypeCustomerCreditId: null,
      LoanTypeCode: item.LoanTypeCode == null ? this.loanAgreementType.LoanTypeBorrower1.LoanTypeCode : item.LoanTypeCode,
      LoanTypeBorrowerId: item.LoanTypeBorrowerId == null ? this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerId : item.LoanTypeBorrowerId,
      CustomerGrade: null,
      AgeNotOver: null,
      NewContractMaximumLimit: null,
      RefinanceMaximumLimit: null,
      RefinanceAdditionalPayment: false,
      RowVersion: null,
      RowState: item.RowState == null ? RowState.Add : item.RowState,
      // RowState: RowState.Add
    });

    fg.patchValue(item, { emitEvent: false });
    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == null) {
          fg.controls.RowState.setValue(RowState.Add, { emitEvent: false });
        }

        if (control.RowState === RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    );
    return fg;
  }

  createLoanTypeBorrower2DetailForm(item: any): FormGroup {
    const fg = this.fb.group({
      LoanTypeBorrowerDetailId: null,
      LoanTypeCode: item.LoanTypeCode == null ? this.loanAgreementType.LoanTypeBorrower2.LoanTypeCode : item.LoanTypeCode,
      LoanTypeBorrowerId: item.LoanTypeBorrowerId == null ? this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerId : item.LoanTypeBorrowerId,
      // LoanTypeCode: null,
      // LoanTypeBorrowerId: null,
      BorrowerDetailType: null,
      AddressType: null,
      IsContractingProvince: false,
      IsInProvince: false,
      IsAllProvince: false,
      RegisProvince: null,
      RegisProvinceName: null,
      RowVersion: null,
      RowState: item.RowState == null ? RowState.Add : item.RowState,
      // RowState: RowState.Add,
      RegisProvinceList2: this.fb.array([])
    });
    fg.patchValue(item, { emitEvent: false });

    if (item.IdCardAddressList != null) {
      item.IdCardAddressList = this.filter.FilterActive(item.IdCardAddressList);
      this.filter.SortByLang(item.IdCardAddressList);
      fg.setControl('RegisProvinceList2', this.fb.array(item.IdCardAddressList.map((detail) => this.createRegisProvinceForm(detail))));
    }

    if (item.CurrentAddressList != null) {
      item.CurrentAddressList = this.filter.FilterActive(item.CurrentAddressList);
      this.filter.SortByLang(item.CurrentAddressList);
      fg.setControl('RegisProvinceList2', this.fb.array(item.CurrentAddressList.map((detail) => this.createRegisProvinceForm(detail))));
    }

    if (item.WorkplaceAddressList != null) {
      item.WorkplaceAddressList = this.filter.FilterActive(item.WorkplaceAddressList);
      this.filter.SortByLang(item.WorkplaceAddressList);
      fg.setControl('RegisProvinceList2', this.fb.array(item.WorkplaceAddressList.map((detail) => this.createRegisProvinceForm(detail))));
    }

    if (item.IdCardAddressList == null && item.CurrentAddressList == null && item.WorkplaceAddressList == null) {
      fg.setControl('RegisProvinceList2', this.fb.array(this.ProvinceList.map((detail) => this.createRegisProvinceForm(detail))));
      fg.controls.RegisProvinceList2.disable({ emitEvent: false });
      // this.RegisProvinceList2.disable({ emitEvent: false });
    }
    if (!fg.controls.IsInProvince.value) {
      fg.controls.IsAllProvince.disable({ emitEvent: false });
    }

    fg.controls.IsInProvince.valueChanges.subscribe(
      (val) => {
        if (val) {
          fg.controls.RegisProvinceList2.enable({ emitEvent: false });
          fg.controls.IsAllProvince.enable({ emitEvent: false });
        } else {
          this.RegisProvinceList2.controls.forEach(element => {
            element.get("IsCheck").setValue(false);
          });
          fg.controls.RegisProvinceList2.disable({ emitEvent: false });
          fg.controls.IsAllProvince.setValue(false);
          fg.controls.IsAllProvince.disable({ emitEvent: false });
        }
      }
    )

    fg.controls.IsAllProvince.valueChanges.subscribe(
      (val) => {
        if (val) {
          this.RegisProvinceList2.controls.forEach(element => {
            element.get("IsCheck").setValue(true);
          });
        } else {
          this.RegisProvinceList2.controls.forEach(element => {
            element.get("IsCheck").setValue(false);
          });
        }
      }
    )

    fg.controls.RegisProvinceList2.valueChanges.subscribe(
      (val) => {
        var provinceFalse = val.filter(data => {
          return data.IsCheck == false;
        })
        if (provinceFalse.length > 0 && fg.controls.IsAllProvince.value) {
          fg.controls.IsAllProvince.setValue(false, { emitEvent: false })

        } else if (provinceFalse.length == 0 && !fg.controls.IsAllProvince.value) {
          fg.controls.IsAllProvince.setValue(true, { emitEvent: false })
        }
      }
    )

    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == null) {
          fg.controls.RowState.setValue(RowState.Add, { emitEvent: false });
        }

        if (control.RowState === RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    );

    return fg;
  }

  createCustomerCredit2Form(item: LoanTypeCustomerCredit): FormGroup {
    const fg = this.fb.group({
      guid: Math.random().toString(), // important for tracking change
      LoanTypeCustomerCreditId: null,
      LoanTypeCode: item.LoanTypeCode == null ? this.loanAgreementType.LoanTypeBorrower2.LoanTypeCode : item.LoanTypeCode,
      LoanTypeBorrowerId: item.LoanTypeBorrowerId == null ? this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerId : item.LoanTypeBorrowerId,
      CustomerGrade: null,
      AgeNotOver: null,
      NewContractMaximumLimit: null,
      RefinanceMaximumLimit: null,
      RefinanceAdditionalPayment: false,
      RowVersion: null,
      RowState: item.RowState == null ? RowState.Add : item.RowState,
      // RowState: RowState.Add
    });

    fg.patchValue(item, { emitEvent: false });
    fg.valueChanges.subscribe(
      (control) => {
        if (control.RowState == null) {
          fg.controls.RowState.setValue(RowState.Add, { emitEvent: false });
        }

        if (control.RowState === RowState.Normal) {
          fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
        }
      }
    );
    return fg;
  }

  createRegisProvinceForm(item: ProvinceList): FormGroup {
    let fg = this.fb.group({
      Value: null,
      TextTha: null,
      TextEng: null,
      Active: null,
      IsCheck: null
    });

    fg.patchValue(item, { emitEvent: false });
    return fg;
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.loanAgreementType = data.attribute.LoanTypeDetail;
      this.master = data.attribute.master;
      this.currentAddress = data.attribute.master.CurrentAddress;
      this.idCardAddress = data.attribute.master.IdCardAddress;
      this.workplaceAddress = data.attribute.master.WorkplaceAddress;

      this.execution = data.attribute.master.Execution;
      this.contract = data.attribute.master.Contract;
      this.rebuildForm();
    });
  }

  rebuildForm() {
    this.loanAgreementForm.markAsPristine();
    this.LoanTypeBorrower1Form.markAsPristine();
    this.LoanTypeBorrower2Form.markAsPristine();
    this.bindDropDownList();

    this.loanAgreementForm.patchValue(this.loanAgreementType);
    if (this.loanAgreementType.LoanTypeCode) {
      this.loanAgreementForm.controls.LoanTypeCode.disable();
    } else {
      this.loanAgreementForm.controls.LoanTypeCode.enable();
    }

    //------------------------------------------------------------------------------- Borrower 1--------------------------------------------------------------------------------------------------------------------
    this.LoanTypeBorrower1Form.patchValue(this.loanAgreementType.LoanTypeBorrower1);
    this.LoanTypeBorrower1Form.setControl('LoanTypeBorrower1DetailIdCardAddressForm', this.createLoanTypeBorrower1DetailForm(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrower1DetailIdCardAddress));
    this.LoanTypeBorrower1Form.setControl('LoanTypeBorrower1DetailCurrentAddressForm', this.createLoanTypeBorrower1DetailForm(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrower1DetailCurrentAddress));
    this.LoanTypeBorrower1Form.setControl('LoanTypeBorrower1DetailWorkplaceAddressForm', this.createLoanTypeBorrower1DetailForm(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrower1DetailWorkplaceAddress));
    this.LoanTypeBorrower1Form.setControl('LoanTypeBorrower1DetailIdCardAddressContractForm', this.createLoanTypeBorrower1DetailForm(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrower1DetailIdCardAddressContract));
    this.LoanTypeBorrower1Form.setControl('LoanTypeBorrower1DetailCurrentAddressContractForm', this.createLoanTypeBorrower1DetailForm(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrower1DetailCurrentAddressContract));
    this.LoanTypeBorrower1Form.setControl('LoanTypeBorrower1DetailWorkplaceAddressContractForm', this.createLoanTypeBorrower1DetailForm(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrower1DetailWorkplaceAddressContract));
    this.LoanTypeBorrower1Form.setControl('CustomerCredit1Form',
      this.fb.array(this.loanAgreementType.LoanTypeBorrower1.CustomerCredits1.map((detail) => this.createCustomerCredit1Form(detail))));

    //------------------------------------------------------------------------------- Borrower 2--------------------------------------------------------------------------------------------------------------------
    this.LoanTypeBorrower2Form.patchValue(this.loanAgreementType.LoanTypeBorrower2);
    if (this.LoanTypeBorrower2Form.controls.IsNotRegisProvince.value) {
      this.loanAgreementType.LoanTypeBorrower2.IsNotRegisProvinceList = this.filter.FilterActive(this.loanAgreementType.LoanTypeBorrower2.IsNotRegisProvinceList);
      this.filter.SortByLang(this.loanAgreementType.LoanTypeBorrower2.IsNotRegisProvinceList);

      this.LoanTypeBorrower2Form.setControl('RegisProvinceBorrower2List', this.fb.array(this.loanAgreementType.LoanTypeBorrower2.IsNotRegisProvinceList.map((detail) => this.createRegisProvinceForm(detail))));
    } else {
      this.LoanTypeBorrower2Form.setControl('RegisProvinceBorrower2List', this.fb.array(this.ProvinceList.map((detail) => this.createRegisProvinceForm(detail))));
      this.RegisProvinceBorrower2List.disable({ emitEvent: false });
    }

    this.LoanTypeBorrower2Form.setControl('LoanTypeBorrower2DetailIdCardAddressForm', this.createLoanTypeBorrower2DetailForm(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrower2DetailIdCardAddress));
    this.LoanTypeBorrower2Form.setControl('LoanTypeBorrower2DetailCurrentAddressForm', this.createLoanTypeBorrower2DetailForm(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrower2DetailCurrentAddress));
    this.LoanTypeBorrower2Form.setControl('LoanTypeBorrower2DetailWorkplaceAddressForm', this.createLoanTypeBorrower2DetailForm(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrower2DetailWorkplaceAddress));
    this.LoanTypeBorrower2Form.setControl('LoanTypeBorrower2DetailIdCardAddressContractForm', this.createLoanTypeBorrower2DetailForm(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrower2DetailIdCardAddressContract));
    this.LoanTypeBorrower2Form.setControl('LoanTypeBorrower2DetailCurrentAddressContractForm', this.createLoanTypeBorrower2DetailForm(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrower2DetailCurrentAddressContract));
    this.LoanTypeBorrower2Form.setControl('LoanTypeBorrower2DetailWorkplaceAddressContractForm', this.createLoanTypeBorrower2DetailForm(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrower2DetailWorkplaceAddressContract));
    this.LoanTypeBorrower2Form.setControl('CustomerCredit2Form',
      this.fb.array(this.loanAgreementType.LoanTypeBorrower2.CustomerCredits2.map((detail) => this.createCustomerCredit2Form(detail))));
  }

  get getCustomerCredit1(): FormArray {
    return this.LoanTypeBorrower1Form.get('CustomerCredit1Form') as FormArray;
  }

  get RegisProvinceList(): FormArray {
    if (this.borrowerDetailType === this.execution) {
      if (this.addressType === this.idCardAddress) {
        return this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressForm.get('RegisProvinceList') as FormArray;
      } else if (this.addressType === this.currentAddress) {
        return this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressForm.get('RegisProvinceList') as FormArray;
      } else if (this.addressType === this.workplaceAddress) {
        return this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressForm.get('RegisProvinceList') as FormArray;
      }
    } else if (this.borrowerDetailType === this.contract) {
      if (this.addressType === this.idCardAddress) {
        return this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressContractForm.get('RegisProvinceList') as FormArray;
      } else if (this.addressType === this.currentAddress) {
        return this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressContractForm.get('RegisProvinceList') as FormArray;
      } else if (this.addressType === this.workplaceAddress) {
        return this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressContractForm.get('RegisProvinceList') as FormArray;
      }
    }
  }

  get getCustomerCredit2(): FormArray {
    return this.LoanTypeBorrower2Form.get('CustomerCredit2Form') as FormArray;
  }

  get RegisProvinceList2(): FormArray {
    if (this.borrowerDetailType === this.execution) {
      if (this.addressType === this.idCardAddress) {
        return this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('RegisProvinceList2') as FormArray;
      } else if (this.addressType === this.currentAddress) {
        return this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressForm.get('RegisProvinceList2') as FormArray;
      } else if (this.addressType === this.workplaceAddress) {
        return this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressForm.get('RegisProvinceList2') as FormArray;
      }
    } else if (this.borrowerDetailType === this.contract) {
      if (this.addressType === this.idCardAddress) {
        return this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressContractForm.get('RegisProvinceList2') as FormArray;
      } else if (this.addressType === this.currentAddress) {
        return this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressContractForm.get('RegisProvinceList2') as FormArray;
      } else if (this.addressType === this.workplaceAddress) {
        return this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressContractForm.get('RegisProvinceList2') as FormArray;
      }
    }
  }

  get RegisProvinceBorrower2List(): FormArray {
    return this.LoanTypeBorrower2Form.get('RegisProvinceBorrower2List') as FormArray;
  }

  openEditBorrower1Detail(addressType, borrowerDetailType) {
    this.addressType = addressType;
    this.borrowerDetailType = borrowerDetailType

    if (this.borrowerDetailType === this.execution) {
      if (this.addressType === this.idCardAddress) {
        this.openPopupLarge(this.editBorrower1DetailIdCardAddress);
      } else if (this.addressType === this.currentAddress) {
        this.openPopupLarge(this.editBorrower1DetailCurrentAddress);
      } else if (this.addressType === this.workplaceAddress) {
        this.openPopupLarge(this.editBorrower1DetailWorkplaceAddress);
      }
    } else if (this.borrowerDetailType === this.contract) {
      if (this.addressType === this.idCardAddress) {
        this.openPopupLarge(this.editBorrower1DetailIdCardAddressContract);
      } else if (this.addressType === this.currentAddress) {
        this.openPopupLarge(this.editBorrower1DetailCurrentAddressContract);
      } else if (this.addressType === this.workplaceAddress) {
        this.openPopupLarge(this.editBorrower1DetailWorkplaceAddressContract);
      }
    }
  }

  openEditBorrower2Detail(addressType, borrowerDetailType) {
    this.addressType = addressType;
    this.borrowerDetailType = borrowerDetailType

    if (this.borrowerDetailType === this.execution) {
      if (this.addressType === this.idCardAddress) {
        this.openPopupLarge(this.editBorrower2DetailIdCardAddress);
      } else if (this.addressType === this.currentAddress) {
        this.openPopupLarge(this.editBorrower2DetailCurrentAddress);
      } else if (this.addressType === this.workplaceAddress) {
        this.openPopupLarge(this.editBorrower2DetailWorkplaceAddress);
      }
    } else if (this.borrowerDetailType === this.contract) {
      if (this.addressType === this.idCardAddress) {
        this.openPopupLarge(this.editBorrower2DetailIdCardAddressContract);
      } else if (this.addressType === this.currentAddress) {
        this.openPopupLarge(this.editBorrower2DetailCurrentAddressContract);
      } else if (this.addressType === this.workplaceAddress) {
        this.openPopupLarge(this.editBorrower2DetailWorkplaceAddressContract);
      }
    }
  }

  openPopupLarge(content) {
    this.popup = this.modal.open(content, Size.large);
  }

  onTableEvent(event) {
    this.page = event;
    // this.loadDocumentList(this.customerSeller.CustomerCode);
  }

  bindDropDownList() {
    this.filter.SortByLang(this.master.LoanTypeList);
    this.master.LoanTypeList = this.filter.FilterActive(this.master.LoanTypeList);
    this.filter.SortByLang(this.master.CanRefinances);
    this.master.CanRefinances = this.filter.FilterActive(this.master.CanRefinances);
    this.master.ProvinceList = this.filter.FilterActive(this.master.ProvinceList);
    this.filter.SortByLang(this.master.ProvinceList);
    this.LoanTypeList = [...this.master.LoanTypeList];
    this.CanRefinances = [...this.master.CanRefinances];
    this.ContractTypeList = [...this.master.ContractTypeList];
    this.ProvinceList = [...this.master.ProvinceList];
    this.CustomerCreditTypeList = [...this.master.CustomerCreditTypeList];
    return;
  }

  addRowCustomerCredit1() {
    this.getCustomerCredit1.push(this.createCustomerCredit1Form({} as LoanTypeCustomerCredit));
    this.getCustomerCredit1.markAsDirty();
  }

  removeRowCustomerCredit1(index) {
    const detail = this.getCustomerCredit1.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      // เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
      const deleting = this.loanAgreementType.LoanTypeBorrower1.CustomerCredits1.find(item =>
        item.LoanTypeCustomerCreditId === detail.controls.LoanTypeCustomerCreditId.value
      );
      deleting.RowState = RowState.Delete;
    }

    // --ลบข้อมูลrecordนี้ออกจาก formarray
    this.getCustomerCredit1.removeAt(index);
    this.getCustomerCredit1.markAsDirty();
    // ---------------------------------
  }

  addRowCustomerCredit2() {
    this.getCustomerCredit2.push(this.createCustomerCredit2Form({} as LoanTypeCustomerCredit));
    this.getCustomerCredit2.markAsDirty();
  }

  removeRowCustomerCredit2(index) {
    const detail = this.getCustomerCredit2.at(index) as FormGroup;
    if (detail.controls.RowState.value !== RowState.Add) {
      // เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete
      const deleting = this.loanAgreementType.LoanTypeBorrower2.CustomerCredits2.find(item =>
        item.LoanTypeCustomerCreditId === detail.controls.LoanTypeCustomerCreditId.value
      );
      deleting.RowState = RowState.Delete;
    }

    // --ลบข้อมูลrecordนี้ออกจาก formarray
    this.getCustomerCredit2.removeAt(index);
    this.getCustomerCredit2.markAsDirty();
    // ---------------------------------
  }

  checkLoanTypeCode() {
    if (this.loanAgreementForm.controls.LoanTypeCode.value) {
      this.loanAgreementForm.controls.LoanTypeCode.setValue(this.loanAgreementForm.controls.LoanTypeCode.value.trim(), { eventEmit: false });
    }
  }

  back() {
    this.router.navigate(['/lo/lomt12'], { skipLocationChange: true });
  }

  confirm() {
    this.popup.hide();
  }

  decline() {
    this.submitted = false;
    this.popup.hide();
  }

  prepareSave(values: Object) {
    Object.assign(this.loanAgreementType, values);

    //-----------------------------------------------------------------------Borrower1--------------------------------------------------------------------------------------------
    Object.assign(this.loanAgreementType.LoanTypeBorrower1, this.LoanTypeBorrower1Form.getRawValue());
    this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerDetails = [];

    if (this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailIdCardAddressForm.LoanTypeBorrowerId && this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailIdCardAddressForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailIdCardAddressForm);
    }

    if (this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailCurrentAddressForm.LoanTypeBorrowerId && this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailCurrentAddressForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailCurrentAddressForm);
    }

    if (this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailWorkplaceAddressForm.LoanTypeBorrowerId && this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailWorkplaceAddressForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailWorkplaceAddressForm);
    }

    if (this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailIdCardAddressContractForm.LoanTypeBorrowerId && this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailIdCardAddressContractForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailIdCardAddressContractForm);
    }

    if (this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailCurrentAddressContractForm.LoanTypeBorrowerId && this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailCurrentAddressContractForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailCurrentAddressContractForm);
    }

    if (this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailWorkplaceAddressContractForm.LoanTypeBorrowerId && this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailWorkplaceAddressContractForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower1Form.value.LoanTypeBorrower1DetailWorkplaceAddressContractForm);
    }

    if (this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerDetails.length === 0) {
      this.loanAgreementType.LoanTypeBorrower1.IsCheckAddress = false;
    } else {
      this.loanAgreementType.LoanTypeBorrower1.IsCheckAddress = true;
    }

    this.loanAgreementType.LoanTypeBorrower1.CustomerCredits = this.loanAgreementType.LoanTypeBorrower1.CustomerCredits1;
    const customercredit1 = this.getCustomerCredit1.getRawValue();
    // add
    const adding1 = customercredit1.filter(function (item) {
      return item.RowState === RowState.Add;
    });
    // edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.loanAgreementType.LoanTypeBorrower1.CustomerCredits.map(label => {
      return Object.assign(label, customercredit1.filter(item => item.RowState === RowState.Edit).find((item) => {
        return label.LoanTypeCustomerCreditId === item.LoanTypeCustomerCreditId;
      }));
    });
    // เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.loanAgreementType.LoanTypeBorrower1.CustomerCredits = this.loanAgreementType.LoanTypeBorrower1.CustomerCredits.filter(item => item.RowState !== RowState.Add).concat(adding1);
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //-----------------------------------------------------------------------Borrower2--------------------------------------------------------------------------------------------
    var selectedProvince = [];
    this.RegisProvinceBorrower2List.value.forEach(element => {
      if (element.IsCheck) {
        selectedProvince.push(element.Value);
      }
    });

    this.LoanTypeBorrower2Form.controls.RegisProvince.setValue(selectedProvince.join(","));
    Object.assign(this.loanAgreementType.LoanTypeBorrower2, this.LoanTypeBorrower2Form.getRawValue());
    this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerDetails = [];

    if (this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailIdCardAddressForm.LoanTypeBorrowerId && this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailIdCardAddressForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailIdCardAddressForm);
    }

    if (this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailCurrentAddressForm.LoanTypeBorrowerId && this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailCurrentAddressForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailCurrentAddressForm);
    }

    if (this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailWorkplaceAddressForm.LoanTypeBorrowerId && this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailWorkplaceAddressForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailWorkplaceAddressForm);
    }

    if (this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailIdCardAddressContractForm.LoanTypeBorrowerId && this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailIdCardAddressContractForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailIdCardAddressContractForm);
    }

    if (this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailCurrentAddressContractForm.LoanTypeBorrowerId && this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailCurrentAddressContractForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailCurrentAddressContractForm);
    }

    if (this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailWorkplaceAddressContractForm.LoanTypeBorrowerId && this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailWorkplaceAddressContractForm.LoanTypeCode) {
      this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerDetails.push(this.LoanTypeBorrower2Form.value.LoanTypeBorrower2DetailWorkplaceAddressContractForm);
    }

    if (this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerDetails.length === 0) {
      this.loanAgreementType.LoanTypeBorrower2.IsCheckAddress = false;
    } else {
      this.loanAgreementType.LoanTypeBorrower2.IsCheckAddress = true;
    }

    this.loanAgreementType.LoanTypeBorrower2.CustomerCredits = this.loanAgreementType.LoanTypeBorrower2.CustomerCredits2;
    const customercredit2 = this.getCustomerCredit2.getRawValue();
    // add
    const adding = customercredit2.filter(function (item) {
      return item.RowState === RowState.Add;
    });
    // edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
    this.loanAgreementType.LoanTypeBorrower2.CustomerCredits.map(label => {
      return Object.assign(label, customercredit2.filter(item => item.RowState === RowState.Edit).find((item) => {
        return label.LoanTypeCustomerCreditId === item.LoanTypeCustomerCreditId;
      }));
    });
    // เก็บค่าลง array ที่จะส่งไปบันทึก โดยกรองเอา add ออกไปก่อนเพื่อป้องกันการ add ซ้ำ
    this.loanAgreementType.LoanTypeBorrower2.CustomerCredits = this.loanAgreementType.LoanTypeBorrower2.CustomerCredits.filter(item => item.RowState !== RowState.Add).concat(adding);
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    this.loanAgreementType.LoanTypeBorrowers = [];
    this.loanAgreementType.LoanTypeBorrowers.push(this.loanAgreementType.LoanTypeBorrower1);
    this.loanAgreementType.LoanTypeBorrowers.push(this.loanAgreementType.LoanTypeBorrower2);

    //----------------------------------Interface----------------------------------------------------
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailIdCardAddress'];
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailCurrentAddress'];
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailWorkplaceAddress'];
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailIdCardAddressContract'];
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailCurrentAddressContract'];
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailWorkplaceAddressContract'];
    // delete this.loanAgreementType.LoanTypeBorrower1['CustomerCredits1'];

    // //----------------------------------Form----------------------------------------------------
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailIdCardAddressForm'];
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailCurrentAddressForm'];
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailWorkplaceAddressForm'];
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailIdCardAddressContractForm'];
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailCurrentAddressContractForm'];
    // delete this.loanAgreementType.LoanTypeBorrower1['LoanTypeBorrower1DetailWorkplaceAddressContractForm'];
    // delete this.loanAgreementType.LoanTypeBorrower1['CustomerCredit1Form'];

    // delete this.loanAgreementType['LoanTypeBorrower1'];
    // delete this.loanAgreementType['LoanTypeBorrower2'];
  }

  checkDuplicateCustomerCredit1() {
    const duplicate1 = this.getCustomerCredit1.getRawValue().some((row1, idx1) => {
      return this.getCustomerCredit1.getRawValue().some((row2, idx2) => {
        return row1.LoanTypeCode === row2.LoanTypeCode && row1.LoanTypeBorrowerId === row2.LoanTypeBorrowerId
          && row1.CustomerGrade === row2.CustomerGrade && row1.AgeNotOver === row2.AgeNotOver
          && row1.NewContractMaximumLimit === row2.NewContractMaximumLimit && row1.RefinanceMaximumLimit === row2.RefinanceMaximumLimit
          && row1.RefinanceAdditionalPayment === row2.RefinanceAdditionalPayment && idx1 < idx2
      });
    });
    return duplicate1;
  }

  checkDuplicateCustomerCredit2() {
    const duplicate2 = this.getCustomerCredit2.getRawValue().some((row1, idx1) => {
      return this.getCustomerCredit2.getRawValue().some((row2, idx2) => {
        return row1.LoanTypeCode === row2.LoanTypeCode && row1.LoanTypeBorrowerId === row2.LoanTypeBorrowerId
          && row1.CustomerGrade === row2.CustomerGrade && row1.AgeNotOver === row2.AgeNotOver
          && row1.NewContractMaximumLimit === row2.NewContractMaximumLimit && row1.RefinanceMaximumLimit === row2.RefinanceMaximumLimit
          && row1.RefinanceAdditionalPayment === row2.RefinanceAdditionalPayment && idx1 < idx2
      });
    });
    return duplicate2;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loanAgreementForm.invalid) {
      this.focusToggle = !this.focusToggle;
      this.saving = false;
      return;
    }

    if (this.getCustomerCredit1.getRawValue().length === 0) {
      this.as.warning('', 'Message.STD00012', ['Label.LOMT12.CustomerCredit']);
      return;
    }

    if (this.checkDuplicateCustomerCredit1() || this.checkDuplicateCustomerCredit2()) {
      this.as.warning('', 'Message.STD00004', ['Label.LOMT12.CustomerCredit']);
      return;
    }

    if (this.LoanTypeBorrower2Form.controls.ContractMaximumLimit.value && !this.LoanTypeBorrower1Form.controls.ContractMaximumLimit.value) {
      this.as.warning('', 'Message.LO00054');
      return;
    }

    this.saving = true;
    this.prepareSave(this.loanAgreementForm.getRawValue());
    this.lomt12Service.saveLoanType(this.loanAgreementType).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: LoanAgreementType) => {
          this.loanAgreementType = res;
          this.rebuildForm();
          this.as.success('', 'Message.STD00006');
        }
      );
  }

  onSubmitBorrower1Detail() {
    var selected = [];
    var selectedNameTha = [];

    this.RegisProvinceList.value.forEach(element => {
      if (element.IsCheck) {
        selected.push(element.Value);
        selectedNameTha.push(element.TextTha);
      }
    });

    if (this.borrowerDetailType === this.execution) {
      if (this.addressType === this.idCardAddress) {
        if (this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeCode);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerId);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      } else if (this.addressType === this.currentAddress) {
        if (this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeCode);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerId);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      } else if (this.addressType === this.workplaceAddress) {
        if (this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeCode);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerId);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      }
    } else if (this.borrowerDetailType === this.contract) {
      if (this.addressType === this.idCardAddress) {
        if (this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressContractForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressContractForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeCode);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressContractForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerId);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressContractForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressContractForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressContractForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailIdCardAddressContractForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      } else if (this.addressType === this.currentAddress) {
        if (this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressContractForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressContractForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeCode);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressContractForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerId);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressContractForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressContractForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressContractForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailCurrentAddressContractForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      } else if (this.addressType === this.workplaceAddress) {
        if (this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressContractForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressContractForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeCode);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressContractForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower1.LoanTypeBorrowerId);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressContractForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressContractForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressContractForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower1Form.controls.LoanTypeBorrower1DetailWorkplaceAddressContractForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      }
    }

    this.popup.hide();
  }

  onSubmitBorrower2Detail() {
    var selected = [];
    var selectedNameTha = [];

    this.RegisProvinceList2.value.forEach(element => {
      if (element.IsCheck) {
        selected.push(element.Value);
        selectedNameTha.push(element.TextTha);
      }
    });

    if (this.borrowerDetailType === this.execution) {
      if (this.addressType === this.idCardAddress) {
        if (this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeCode);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerId);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      } else if (this.addressType === this.currentAddress) {
        if (this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeCode);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerId);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      } else if (this.addressType === this.workplaceAddress) {
        if (this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeCode);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerId);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      }
    } else if (this.borrowerDetailType === this.contract) {
      if (this.addressType === this.idCardAddress) {
        if (this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressContractForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressContractForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeCode);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressContractForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerId);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressContractForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressContractForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressContractForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailIdCardAddressContractForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      } else if (this.addressType === this.currentAddress) {
        if (this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressContractForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressContractForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeCode);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressContractForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerId);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressContractForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressContractForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressContractForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailCurrentAddressContractForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      } else if (this.addressType === this.workplaceAddress) {
        if (this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressContractForm.get('IsInProvince').value && selected.length == 0) {
          this.as.warning('', 'Message.STD00012', ['Label.LOMT12.Province']);
          return;
        }

        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressContractForm.get('LoanTypeCode').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeCode);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressContractForm.get('LoanTypeBorrowerId').setValue(this.loanAgreementType.LoanTypeBorrower2.LoanTypeBorrowerId);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressContractForm.get('BorrowerDetailType').setValue(this.borrowerDetailType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressContractForm.get('AddressType').setValue(this.addressType);
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressContractForm.get('RegisProvince').setValue(selected.join(","));
        this.LoanTypeBorrower2Form.controls.LoanTypeBorrower2DetailWorkplaceAddressContractForm.get('RegisProvinceName').setValue(selectedNameTha.join(", "));
      }
    }

    this.popup.hide();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.loanAgreementForm.dirty && !this.LoanTypeBorrower1Form.dirty && !this.LoanTypeBorrower2Form.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  changeIsCheck1() {

  }
}
