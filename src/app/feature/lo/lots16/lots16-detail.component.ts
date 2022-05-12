import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, ModelRef, Size, RowState, ImageFile, BrowserService, SelectFilterService, Page } from '@app/shared';
import { Lots16Service, Mgm, MgmAddressIdCard, MgmAddressCurrent, MgmAddressWork, MgmMobile, SaveL, MgmAttachment } from './lots16.service';
import { finalize, switchMap } from 'rxjs/operators';
import { ConfigurationService, ContentType, Category } from '@app/shared/service/configuration.service';
import { ImageDisplayService } from '@app/shared/image/image-display.service';
import { Observable } from 'rxjs';
import { ButtonsConfig, ButtonsStrategy, Image, PlainGalleryConfig, GridLayout, PlainGalleryStrategy, ButtonType, ButtonEvent, GalleryService } from '@ks89/angular-modal-gallery';
import * as numeral from 'numeral';
import { cloneObject } from '@app/shared/utils/objectUtil';
import { Lots16CustomerLookupComponent } from './lots16-customer-lookup.component';

import { Attachment } from '@app/shared/attachment/attachment.model';

@Component({
    templateUrl: './lots16-detail.component.html'
})
export class Lots16DetailComponent implements OnInit {
    mgm: Mgm = {} as Mgm;
    mgmAddressIdCard: MgmAddressIdCard = {} as MgmAddressIdCard;
    mgmAddressCurrent: MgmAddressCurrent = {} as MgmAddressCurrent;
    mgmAddressWork: MgmAddressWork = {} as MgmAddressWork;
    mgmMobile: MgmMobile = {} as MgmMobile;
    mgmAttachment: MgmAttachment = {} as MgmAttachment;

    mgmAttachmentDeletePicture: any[];
    saveLog: SaveL = {} as SaveL;
    attachmentFiles: Attachment[] = [];
    popupCancel: ModelRef;
    lots16CustomerLookupContent = Lots16CustomerLookupComponent;
    category = Category.MgmAttachment;
    MgmMasterForm: FormGroup;
    MgmAddressIdCardForm: FormGroup;
    MgmAddressCorrentForm: FormGroup;
    MgmAddressWorkForm: FormGroup;
    MgmMobileForm: FormGroup;
    MgmDocumentForm: FormGroup;

    loadingMasterCustomer: Boolean = false;
    flagMasterDetail: Boolean = false;
    flagAddressIdCard: Boolean = false;
    flagAddressCurrent: Boolean = false;
    flagAddressWork: Boolean = false;
    flafDisable: Boolean = false;

    PrefixList = [];
    NationalityList = [];
    ReligionList = [];
    GenderList = [];
    MaritalStatusList = [];
    RaceList = [];
    GroupOfCareerList = [];
    IncomeRangeList = [];
    showAge = {};
    attachmentTypes = [];
    ageCustomermer: number;
    dateNow = new Date();
    // minDateExpiry = new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate());
    minDateExpiry = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    ProvinceList = [];

    DistrictCardList = [];
    SubDistrictCardList = [];
    zipcodeCardList = [];

    DistrictCurrentList = [];
    SubDistrictCurrentList = [];
    zipcodeListCurrentList = [];

    DistrictWorkList = [];
    SubDistrictWorkList = [];
    zipcodeListWorkList = [];

    showAlert: string = 'STD00000';

    phoneList = [];
    phoneNumberDeleting: MgmMobile[] = [];
    phoneListTemp = [];
    countPhoneListTemp: Number = 0;

    pagePhone = new Page();
    loadingPhoneList: boolean;
    countPhoneList: Number = 0;
    checkModal = false;
    modalEdit: ModelRef;

    saving: boolean;
    submitted: boolean;
    focusToggle: boolean;
    checkId: boolean = true;
    prepay: boolean = false;
    editMode: boolean = false;
    statusCancel: boolean = false;
    selected = [];
    recieptStatus = [];
    invoiceStatus = [];
    priorityList = [];
    receiveType = [];
    bankAccount = [];
    UserName: string;
    dataUrl: string;
    ReceiveTypeCash: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private as: AlertService,
        private service: Lots16Service,
        private modal: ModalService,
        public lang: LangService,
        private config: ConfigurationService,
        public image: ImageDisplayService,
        private browser: BrowserService,
        private galleryService: GalleryService,
        private filter: SelectFilterService,
    ) {
        this.createForm();
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.PrefixList = data.Lots16.master.PrefixList;
            this.NationalityList = data.Lots16.master.NationalityList;
            this.ReligionList = data.Lots16.master.ReligionList;
            this.GenderList = data.Lots16.master.GenderList;
            this.MaritalStatusList = data.Lots16.master.MaritalStatusList;
            this.RaceList = data.Lots16.master.Race;
            this.GroupOfCareerList = data.Lots16.master.GroupOfCareer;
            this.IncomeRangeList = data.Lots16.master.IncomeRange;
            this.attachmentTypes = data.Lots16.master.AttachmentTypes;
            this.ProvinceList = cloneObject(data.Lots16.master.ProvinceList);
            this.mgm = data.Lots16.mgmDetail;

            this.rebuildForm();
        });

        this.lang.onChange().subscribe(() => {
            this.rebuildForm();
        });
    }

    onFilterAll() { }

    createForm() {
        this.MgmMasterForm = this.fb.group({
            MgmCode: 'AUTO',
            CustomerCode: null,
            PrefixId: [null, Validators.required],
            FirstName: [null, Validators.required],
            LastName: [null, Validators.required],
            Email: null,
            Birthday: [null, Validators.required],
            Age: null,
            IdCard: [null, Validators.required],
            DateIssue: [null, Validators.required],
            DateExpiry: [null, Validators.required],
            Race: null,
            Nationality: null,
            Religio: null,
            Gender: [null, Validators.required],
            MaritalStatus: null,
            GroupOfCareer: [null, Validators.required],
            Career: [null, Validators.required],
            IncomeRange: [null, Validators.required],
            IdcardHidden: null,
            RowVersion: null,
            PhoneNumber: this.fb.array([]),
            Attachment: this.fb.array([]),
        });

        this.MgmAddressIdCardForm = this.fb.group({
            AddressId: null,
            MgmCode: null,
            AddressType: '2',
            BuildingName: null,
            BuildingNo: [null, Validators.required],
            VillageNo: null,
            Alley: null,
            Street: null,
            SubDistrictId: [null, Validators.required],
            DistrictId: [null, Validators.required],
            ProvinceId: [null, Validators.required],
            // ZipCode: [null, Validators.required],
            ZipCode: null,
            Replaces: false,
            RowVersion: 0,
        });

        this.MgmAddressCorrentForm = this.fb.group({
            AddressId: null,
            MgmCode: null,
            AddressType: '1',
            BuildingName: null,
            BuildingNo: [null, Validators.required],
            VillageNo: null,
            Alley: null,
            Street: null,
            SubDistrictId: [null, Validators.required],
            DistrictId: [null, Validators.required],
            ProvinceId: [null, Validators.required],
            ZipCode: null,
            Replaces: null,
            RowVersion: 0,
        });

        this.MgmAddressWorkForm = this.fb.group({
            AddressId: null,
            MgmCode: null,
            AddressType: '3',
            BuildingName: null,
            BuildingNo: null,
            VillageNo: null,
            Alley: null,
            Street: null,
            SubDistrictId: null,
            DistrictId: null,
            ProvinceId: null,
            ZipCode: null,
            Replaces: false,
            RowVersion: 0,
        });

        this.MgmMobileForm = this.fb.group({});

        this.MgmDocumentForm = this.fb.group({});

        // ----- MasterForm -----
        this.MgmMasterForm.controls.MgmCode.disable();
        this.MgmMasterForm.controls.Age.disable();
        this.MgmMasterForm.controls.DateIssue.disable();
        this.MgmMasterForm.controls.DateExpiry.disable();

        this.MgmMasterForm.controls.Birthday.valueChanges.subscribe(
            (value) => {
                if (this.MgmMasterForm.controls.Birthday.value != null) {
                    this.MgmMasterForm.controls.DateIssue.enable();
                    this.sumAge();
                } else {
                    this.MgmMasterForm.controls.DateIssue.disable();
                    this.MgmMasterForm.controls.DateIssue.setValue(null);
                    this.MgmMasterForm.controls.Age.setValue(null);
                }
            }
        );

        this.MgmMasterForm.controls.DateIssue.valueChanges.subscribe(value => {
            if (this.MgmMasterForm.controls.DateIssue.value != null) {
                this.MgmMasterForm.controls.DateExpiry.enable();
                this.sumAge();
            } else {
                this.MgmMasterForm.controls.DateExpiry.disable();
                this.MgmMasterForm.controls.DateExpiry.setValue(null);
            }
        });

        // ----- AddressIdCardForm -----
        this.MgmAddressIdCardForm.valueChanges.subscribe(value => {
            if (this.MgmAddressCorrentForm.controls.Replaces.value) {
                this.onChangeCopytoCurrent();
            }

            if (this.MgmAddressWorkForm.controls.Replaces.value) {
                this.onChangeCopytoWorkplace();
            }
        })

        // ----- AddressCorrentForm -----

        // ----- AddressWorkForm -----

        // ----- MobileForm -----

        // ----- DocumentForm -----   
    }

    createPhoneNumberForm(item: MgmMobile): FormGroup {
        const fg = this.fb.group({
            MobileId: null,
            MobileNumber: [null, Validators.required],
            MobileDescription: [null, Validators.required],
            Default: false,
            MgmCode: null,
            RowVersion: 0,
            RowState: RowState.Add
        });
        fg.patchValue(item, { emitEvent: false });
        fg.valueChanges.subscribe(
            (control) => {
                if (control.RowState === RowState.Normal) {
                    fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                }
                if (control.MobileNumber) {
                    this.showAlert = "STD00030";
                } else {
                    this.showAlert = "STD00000";
                }
            }
        );

        fg.controls.Default.valueChanges.subscribe(
            (val) => {
                if (val) {
                    this.PhoneNumber.controls.forEach(
                        control => {
                            var a = control as FormGroup;
                            a.controls.Default.setValue(null, { emitEvent: false });
                            if (a.controls.RowState.value != RowState.Add && a.controls.RowState.value != RowState.Delete) {
                                a.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                            }
                        }
                    )
                    fg.controls.Default.setValue(true, { emitEvent: false })
                }
            })

        return fg;
    }

    createAttachmentForm(item: MgmAttachment): FormGroup {
        let fg = this.fb.group({
            MgmAttachmentId: null,
            ContractHeadId: null,
            FilePath: null,
            AttachmentTypeCode: [null, Validators.required],
            FileName: null,
            AttahmentId: [null, Validators.required],
            Description: null,
            RowState: RowState.Add
        });
        fg.patchValue(item, { emitEvent: false });

        fg.valueChanges.subscribe(
            (control) => {
                if (control.RowState == RowState.Normal) {
                    fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                }
            }
        )

        this.attachmentFiles.push(new Attachment());
        return fg;
    }

    rebuildForm() {
        this.MgmMasterForm.markAsPristine();
        this.MgmAddressIdCardForm.markAsPristine();
        this.MgmAddressCorrentForm.markAsPristine();
        this.MgmAddressWorkForm.markAsPristine();
        this.MgmMobileForm.markAsPristine();
        this.MgmDocumentForm.markAsPristine();

        // if (this.mgm.MgmCode == 'AUTO') {
        //     this.mgm.MgmCode = null;
        // }

        if (this.mgm.MgmCode || this.mgm.CustomerCode) {
            // Patch Master
            this.MgmMasterForm.patchValue(this.mgm);
            const subIdCard = this.MgmMasterForm.controls.IdCard.value.substr(9);
            this.MgmMasterForm.controls.IdcardHidden.setValue("xxxxxxxx" + subIdCard);
            this.MgmMasterForm.controls.IdcardHidden.disable();

            // Patch Address
            this.mgm.MgmAddress.forEach(element => {
                if (element.AddressType === '2') {          //Card
                    this.MgmAddressIdCardForm.patchValue(element);
                    Object.assign(this.mgmAddressIdCard, element);
                } else if (element.AddressType === '1') {   //Current
                    // element.Replaces ? this.onChangeCopytoCurrent() : this.MgmAddressCorrentForm.patchValue(element);
                    this.MgmAddressCorrentForm.patchValue(element);
                    Object.assign(this.mgmAddressCurrent, element);
                } else if (element.AddressType === '3') {   //Work
                    // element.Replaces ? this.onChangeCopytoWorkplace() : this.MgmAddressWorkForm.patchValue(element);
                    this.MgmAddressWorkForm.patchValue(element);
                    Object.assign(this.mgmAddressWork, element);
                }
            });

            // ---------- Load DDL ----------
            // Load District
            if (this.MgmAddressIdCardForm.controls.ProvinceId.value) {
                this.loadDistrict(this.MgmAddressIdCardForm.controls.ProvinceId.value, this.MgmAddressIdCardForm);
            }
            if (this.MgmAddressCorrentForm.controls.ProvinceId.value) {
                this.loadDistrict(this.MgmAddressCorrentForm.controls.ProvinceId.value, this.MgmAddressCorrentForm);
            }
            if (this.MgmAddressWorkForm.controls.ProvinceId.value) {
                this.loadDistrict(this.MgmAddressWorkForm.controls.ProvinceId.value, this.MgmAddressWorkForm);
            }
            // Load SubDistrict
            if (this.MgmAddressIdCardForm.controls.DistrictId.value) {
                this.loadSubDistrict(this.MgmAddressIdCardForm.controls.DistrictId.value, this.MgmAddressIdCardForm);
            }
            if (this.MgmAddressCorrentForm.controls.DistrictId.value) {
                this.loadSubDistrict(this.MgmAddressCorrentForm.controls.DistrictId.value, this.MgmAddressCorrentForm);
            }
            if (this.MgmAddressWorkForm.controls.DistrictId.value) {
                this.loadSubDistrict(this.MgmAddressWorkForm.controls.DistrictId.value, this.MgmAddressWorkForm);
            }
            // Load ZipCode
            if (this.MgmAddressIdCardForm.controls.ProvinceId.value) {
                this.loadZipCode(this.MgmAddressIdCardForm.controls.ProvinceId.value, this.MgmAddressIdCardForm);
            }
            if (this.MgmAddressCorrentForm.controls.ProvinceId.value) {
                this.loadZipCode(this.MgmAddressCorrentForm.controls.ProvinceId.value, this.MgmAddressCorrentForm);
            }
            if (this.MgmAddressWorkForm.controls.ProvinceId.value) {
                this.loadZipCode(this.MgmAddressWorkForm.controls.ProvinceId.value, this.MgmAddressWorkForm);
            }

            // Patch Mobile
            setTimeout(() => {
                this.MgmMasterForm.setControl('PhoneNumber', this.fb.array(
                    this.mgm.MgmMobile.map((detail) => this.createPhoneNumberForm(detail))
                ));
            });

            // Patch Attachment
            this.MgmMasterForm.setControl('Attachment', this.fb.array(
                this.mgm.MgmAttachment.map((detail) => this.createAttachmentForm(detail))
            ));

            this.MgmMasterForm.controls.CustomerCode.disable();
            if (this.mgm.CreatedProgram) {
                this.searchPhoneNumber(this.mgm.MgmCode);
            }

            this.checkAttachment();

        } else {
            this.MgmAddressIdCardForm.controls.DistrictId.disable();
            this.MgmAddressIdCardForm.controls.SubDistrictId.disable();
            this.MgmAddressIdCardForm.controls.ZipCode.disable();

            this.MgmAddressCorrentForm.controls.DistrictId.disable();
            this.MgmAddressCorrentForm.controls.SubDistrictId.disable();
            this.MgmAddressCorrentForm.controls.ZipCode.disable();

            this.MgmAddressWorkForm.controls.DistrictId.disable();
            this.MgmAddressWorkForm.controls.SubDistrictId.disable();
            this.MgmAddressWorkForm.controls.ZipCode.disable();

            if (this.mgm.MgmAttachment == undefined) {
                this.mgm.MgmAttachment = [];
            }
            this.checkAttachment();
        }

    }

    // ---------------------------------------Event Tab1---------------------------------------
    chkIdCard() {
        //false ยกเลิกการซ่อน
        this.saveLog.LogSystem = 'LO';
        this.saveLog.LogDiscription = 'ขอดูข้อมูลบัตรประชาชน จากหน้า MGM ของ MGM เลขที่ ' + this.MgmMasterForm.controls.MgmCode.value + ': ' + this.MgmMasterForm.controls.FirstName.value + ' ' + this.MgmMasterForm.controls.LastName.value;
        this.saveLog.LogItemGroupCode = 'SaveLog';
        this.saveLog.LogItemCode = '1';
        this.saveLog.LogProgram = 'LOTS16';
        this.saveLog.MgmCode = this.MgmMasterForm.controls.MgmCode.value;
        this.saveLog.CustomerName = this.MgmMasterForm.controls.FirstName.value + ' ' + this.MgmMasterForm.controls.LastName.value;
        this.saveLog.ContractHeadId = null;

        this.service.saveLog(this.saveLog).pipe(
            finalize(() => { })
        ).subscribe((res) => {
            this.checkId = false;
        });
    }

    sumAge() {
        if (this.MgmMasterForm.controls.Birthday.value != null) {
            let Age: number = 0;
            let Mouth: number = 0;
            let Day: number = 0;
            const FullDateNow = new Date();
            const NowD: number = (FullDateNow.getDate());
            const NowM: number = (FullDateNow.getMonth() + 1);
            const NowY: number = (FullDateNow.getFullYear());
            const SelectD: number = this.MgmMasterForm.controls.Birthday.value.getDate();
            const SelectM: number = this.MgmMasterForm.controls.Birthday.value.getMonth() + 1;
            const SelectY: number = this.MgmMasterForm.controls.Birthday.value.getFullYear();
            Day = NowD - SelectD;
            Mouth = NowM - SelectM;
            Age = NowY - SelectY;
            if (Mouth < 0) {
                Age -= 1;
                Mouth += 12;
            }

            if (Day < 0) {
                var indexM = FullDateNow.getMonth();
                var indexM = ((indexM - 1) < 0) ? 11 : indexM - 1
                Day += [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][indexM]
                    + (((1 == indexM) && ((NowY % 4) == 0) && (((NowY % 100) > 0) || ((NowY % 400) == 0)))
                        ? 1 : 0);
                Mouth -= 1;
            }
            this.showAge = { textTha: Age + " ปี " + Mouth + " เดือน " + Day + " วัน", textEng: Age + " year " + Mouth + " month " + Day + " day" };
            this.MgmMasterForm.controls['Age'].setValue(this.showAge['text' + this.lang.CURRENT]);
            this.ageCustomermer = Age;
        }
    }

    loanDetailOutput(loanDetail) {
        this.loadingMasterCustomer = false;
        if (loanDetail != undefined) {
            this.service.getMgmCustomerDetail(loanDetail)
                .pipe(finalize(() => {
                    this.phoneList = this.phoneListTemp;
                    this.countPhoneList = this.countPhoneListTemp;
                    this.loadingMasterCustomer = false;
                }))
                .subscribe(
                    (res: any) => {
                        if (res.CustomerCode != null) {
                            this.mgm = res;
                            this.phoneListTemp = res.MgmMobile;
                            this.countPhoneListTemp = res.MgmMobile.length ? res.MgmMobile.length : 0;
                            this.rebuildForm();
                            if (res.MgmCode == 'AUTO' && res.CustomerCode != null) {
                                this.MgmMasterForm.controls.CustomerCode.enable();
                            }
                        }
                    });
        }
    }

    // ---------------------------------------Event Tab2---------------------------------------
    onChangeCopytoCurrent() {
        this.DistrictCurrentList = this.DistrictCardList;
        this.SubDistrictCurrentList = this.SubDistrictCardList == undefined ? [] : this.SubDistrictCardList;
        this.zipcodeListCurrentList = this.zipcodeCardList;
        this.bindDropDownCorrentDistrict(true);
        this.bindDropDownCorrentSubDistrict(true);
        this.bindDropDownCorrentZipcode(true);
        const id = this.MgmAddressCorrentForm.controls.AddressId.value ? this.MgmAddressCorrentForm.controls.AddressId.value : null
        const version = this.MgmAddressCorrentForm.controls.RowVersion.value ? this.MgmAddressCorrentForm.controls.RowVersion.value : null
        const replaces = this.MgmAddressCorrentForm.controls.Replaces.value;
        if (replaces) {
            this.MgmAddressCorrentForm.patchValue(this.MgmAddressIdCardForm.getRawValue());
            this.MgmAddressCorrentForm.controls.RowVersion.setValue(version);
            this.MgmAddressCorrentForm.controls.AddressId.setValue(id);
            this.MgmAddressCorrentForm.disable();

        } else {
            this.MgmAddressCorrentForm.reset();
            this.MgmAddressCorrentForm.enable();
            this.MgmAddressCorrentForm.controls.DistrictId.disable();
            this.MgmAddressCorrentForm.controls.SubDistrictId.disable();
            this.MgmAddressCorrentForm.controls.ZipCode.disable();
        }
        this.MgmAddressCorrentForm.controls.RowVersion.setValue(version);
        this.MgmAddressCorrentForm.controls.AddressId.setValue(id);
        this.MgmAddressCorrentForm.controls.AddressType.setValue("1");
        this.MgmAddressCorrentForm.controls.Replaces.setValue(replaces);
        this.MgmAddressCorrentForm.controls.Replaces.enable();
    }

    onChangeCopytoWorkplace() {
        this.DistrictWorkList = this.DistrictCardList;
        this.SubDistrictWorkList = this.SubDistrictCardList == undefined ? [] : this.SubDistrictCardList;
        this.zipcodeListWorkList = this.zipcodeCardList;
        this.bindDropDownWorkDistrict(true);
        this.bindDropDownWorkSubDistrict(true);
        this.bindDropDownWorkZipcode(true);
        const id = this.MgmAddressWorkForm.controls.AddressId.value ? this.MgmAddressWorkForm.controls.AddressId.value : null
        const version = this.MgmAddressWorkForm.controls.RowVersion.value ? this.MgmAddressWorkForm.controls.RowVersion.value : null
        const replaces = this.MgmAddressWorkForm.controls.Replaces.value;
        if (replaces) {
            this.MgmAddressWorkForm.patchValue(this.MgmAddressIdCardForm.getRawValue());
            this.MgmAddressWorkForm.controls.RowVersion.setValue(version);
            this.MgmAddressWorkForm.controls.AddressId.setValue(id);
            this.MgmAddressWorkForm.disable();
        } else {
            this.MgmAddressWorkForm.reset();
            this.MgmAddressWorkForm.enable();
            this.MgmAddressWorkForm.controls.DistrictId.disable();
            this.MgmAddressWorkForm.controls.SubDistrictId.disable();
            this.MgmAddressWorkForm.controls.ZipCode.disable();
        }

        this.MgmAddressWorkForm.controls.RowVersion.setValue(version);
        this.MgmAddressWorkForm.controls.AddressId.setValue(id);
        this.MgmAddressWorkForm.controls.AddressType.setValue("3");
        this.MgmAddressWorkForm.controls.Replaces.setValue(replaces);
        this.MgmAddressWorkForm.controls.Replaces.enable();
    }

    onChangeProvince(event, fromgroup: FormGroup) {
        if (fromgroup.controls.AddressType.value == '1') {
            this.DistrictCurrentList = [];
        } else if (fromgroup.controls.AddressType.value == '2') {
            this.DistrictCardList = [];
        } else if (fromgroup.controls.AddressType.value == '3') {
            this.DistrictWorkList = [];
        }

        if (event) {
            fromgroup.controls.DistrictId.setValue(null);
            fromgroup.controls.SubDistrictId.setValue(null);
            fromgroup.controls.ZipCode.setValue(null);
            this.loadDistrict(event.Value, fromgroup);
            this.loadZipCode(event.Value, fromgroup);
        } else {
            fromgroup.controls.DistrictId.setValue(null);
            fromgroup.controls.DistrictId.disable();
            fromgroup.controls.SubDistrictId.setValue(null);
            fromgroup.controls.SubDistrictId.disable();
            fromgroup.controls.ZipCode.setValue(null);
            fromgroup.controls.ZipCode.disable();
        }
    }

    onChangeDistrict(event, fromgroup: FormGroup) {
        if (fromgroup.controls.AddressType.value == '1') {
            this.SubDistrictCurrentList = [];
        } else if (fromgroup.controls.AddressType.value == '2') {
            this.SubDistrictCardList = [];
        } else if (fromgroup.controls.AddressType.value == '3') {
            this.SubDistrictWorkList = [];
        }

        if (event) {
            fromgroup.controls.SubDistrictId.setValue(null);
            fromgroup.controls.ZipCode.setValue(null);
            this.loadSubDistrict(event.Value, fromgroup);
        } else {
            fromgroup.controls.SubDistrictId.setValue(null);
            fromgroup.controls.SubDistrictId.disable();
        }
    }

    loadDistrict(provinceId, fromgroup: FormGroup) {
        this.service.getDistrict(provinceId).pipe(finalize(() => { })).subscribe(
            (res) => {
                this.filter.SortByLang(res.DistrictList);
                if (fromgroup.controls.AddressType.value == '1') {
                    this.DistrictCurrentList = res.DistrictList;
                } else if (fromgroup.controls.AddressType.value == '2') {
                    this.DistrictCardList = res.DistrictList;
                } else if (fromgroup.controls.AddressType.value == '3') {
                    this.DistrictWorkList = res.DistrictList;
                }

                fromgroup.controls.DistrictId.enable();
                if (fromgroup.controls.Replaces.value) {
                    fromgroup.controls.DistrictId.disable();
                }
            });
    }

    loadSubDistrict(districtId, fromgroup: FormGroup) {
        this.service.getSubDistrict(districtId).pipe(finalize(() => { })).subscribe(
            (res) => {
                this.filter.SortByLang(res.SubDistrictList);
                if (fromgroup.controls.AddressType.value == '1') {
                    this.SubDistrictCurrentList = res.SubDistrictList;
                } else if (fromgroup.controls.AddressType.value == '2') {
                    this.SubDistrictCardList = res.SubDistrictList;
                } else if (fromgroup.controls.AddressType.value == '3') {
                    this.SubDistrictWorkList = res.SubDistrictList;
                }

                fromgroup.controls.SubDistrictId.enable();
                if (fromgroup.controls.Replaces.value) {
                    fromgroup.controls.SubDistrictId.disable();
                }
            });
    }

    loadZipCode(provinceId, fromgroup: FormGroup) {
        this.service.getZipcode(provinceId).pipe(finalize(() => { })).subscribe(
            (res) => {
                this.filter.SortByLang(res.ZipcodeList);
                if (fromgroup.controls.AddressType.value == '1') {
                    this.zipcodeListCurrentList = res.ZipcodeList;
                } else if (fromgroup.controls.AddressType.value == '2') {
                    this.zipcodeCardList = res.ZipcodeList;
                } else if (fromgroup.controls.AddressType.value == '3') {
                    this.zipcodeListWorkList = res.ZipcodeList;
                }

                fromgroup.controls.ZipCode.enable();
                if (fromgroup.controls.Replaces.value) {
                    fromgroup.controls.ZipCode.disable();
                }
            });
    }

    // ---------------------------------------Event Tab3---------------------------------------
    addPhoneNumber() {
        this.PhoneNumber.push(this.createPhoneNumberForm({} as MgmMobile));
        this.MgmMasterForm.markAsDirty();
    }

    get PhoneNumber(): FormArray {
        return this.MgmMasterForm.get('PhoneNumber') as FormArray;
    }

    removePhoneNumber(index) {
        const PhoneNumber = this.PhoneNumber.at(index) as FormGroup;
        if (PhoneNumber.controls.RowState.value !== RowState.Add) {
            PhoneNumber.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
            this.phoneNumberDeleting.push(PhoneNumber.getRawValue());
        }

        const rows = [...this.PhoneNumber.getRawValue()];
        rows.splice(index, 1);

        this.PhoneNumber.patchValue(rows, { emitEvent: false });
        this.PhoneNumber.removeAt(this.PhoneNumber.length - 1);
        this.MgmMasterForm.markAsDirty();
    }

    validatePhoneNumber() {
        let seen = new Set();
        let notRowPhoneNumber = this.PhoneNumber.getRawValue().some(function (item) {
            seen.add(item.MobileNumber.toLowerCase()).size;
            return seen.size > 0 ? true : false;
        });
        return notRowPhoneNumber;
    }

    validateCheckDuplicatePhoneNumber() {
        const seen = new Set();
        const hasDuplicates = this.PhoneNumber.getRawValue().some(function (item) {
            return item.MobileNumber !== null && seen.size === seen.add(item.MobileNumber.toLowerCase()).size;
        });
        return hasDuplicates;
    }

    validatePermissionIsPhoneNmberDefault() {
        const hasIsDefault = this.PhoneNumber.getRawValue().some(function (item) {
            return item.Default == true;
        });
        return hasIsDefault;
    }

    searchPhoneNumber(mgmCode) {
        this.loadingPhoneList = true;
        this.service.getPhone(mgmCode, this.pagePhone)
            .pipe(finalize(() => { this.loadingPhoneList = false; }))
            .subscribe(
                (res: any) => {

                    this.phoneList = res.Rows;
                    this.countPhoneList = res.Rows.length ? res.Total : 0;

                });
    }

    openEdit(edit, id) {
        this.saveLog.LogSystem = 'LO';
        this.saveLog.LogDiscription = 'ขอดูข้อมูลเบอร์โทรศัพท์ จากหน้า MGM ของ MGM เลขที่ ' + this.MgmMasterForm.controls.MgmCode.value + ': ' + this.MgmMasterForm.controls.FirstName.value + ' ' + this.MgmMasterForm.controls.LastName.value;
        this.saveLog.LogItemGroupCode = 'SaveLog';
        this.saveLog.LogItemCode = '2';
        this.saveLog.LogProgram = 'LOTS16';
        this.saveLog.MgmCode = this.MgmMasterForm.controls.MgmCode.value;
        this.saveLog.CustomerName = this.MgmMasterForm.controls.FirstName.value + ' ' + this.MgmMasterForm.controls.LastName.value;
        this.saveLog.ContractHeadId = null;

        this.service.saveLog(this.saveLog).pipe(
            finalize(() => { })
        ).subscribe((res) => {
            this.checkModal = true;
            this.modalEdit = this.modal.open(edit, Size.large);
        });
    }

    closeEdit(flag) {
        if (flag) {
            this.checkModal = false;
            this.modalEdit.hide();
        }
    }

    // ---------------------------------------Event Tab4---------------------------------------
    addAttachment() {
        this.Attachment.push(this.createAttachmentForm({} as MgmAttachment));
        this.MgmMasterForm.markAsDirty();
    }

    get Attachment(): FormArray {
        return this.MgmMasterForm.get('Attachment') as FormArray;
    }

    removeAttachment(index) {
        this.attachmentFiles.splice(index, 1);
        let detail = this.Attachment.at(index) as FormGroup;
        if (detail.controls.RowState.value !== RowState.Add) {
            //เซตค่าในตัวแปรที่ต้องการลบ ให้เป็นสถานะ delete 
            const deleting = this.mgm.MgmAttachment.find(item =>
                item.MgmAttachmentId == detail.controls.MgmAttachmentId.value
            )
            deleting.RowState = RowState.Delete;
        }
        
        const rows = [...this.Attachment.getRawValue()];
        rows.splice(index, 1);

        //--ลบข้อมูลrecordนี้ออกจาก formarray
        this.Attachment.patchValue(rows, { emitEvent: false });
        this.Attachment.removeAt(this.Attachment.length - 1);
        this.Attachment.markAsDirty();
        //---------------------------------
        this.checkAttachment();
    }

    checkAttachment() {
        this.Attachment.enable();
        for (let i = 0; i < this.Attachment.length; i++) {
            let form = this.Attachment.controls[i] as FormGroup;
            if (form.controls.MgmAttachmentId.value != null) {
                form.controls.AttachmentTypeCode.disable({ emitEvent: false });
                form.controls.AttahmentId.disable({ emitEvent: false });
                form.controls.Description.disable({ emitEvent: false });
            }
        }
    }

    fileNameReturn(filename, index) {
        let form = this.Attachment.controls[index] as FormGroup;
        form.controls.FileName.setValue(filename);
    }

    // ---------------------------------------Event Master---------------------------------------

    onSelect(tabValue) { }

    prepareSave() {
        // prepare Master
        Object.assign(this.mgm, this.MgmMasterForm.getRawValue());

        // prepare Address
        Object.assign(this.mgmAddressIdCard, this.MgmAddressIdCardForm.getRawValue());
        Object.assign(this.mgmAddressCurrent, this.MgmAddressCorrentForm.getRawValue());
        Object.assign(this.mgmAddressWork, this.MgmAddressWorkForm.getRawValue());
        this.mgm.MgmAddress = [this.mgmAddressIdCard, this.mgmAddressCurrent, this.mgmAddressWork]

        // prepare Mobile
        const getMgmMobile = this.PhoneNumber.getRawValue();
        const adding = getMgmMobile.filter(function (item) {
            return item.RowState === RowState.Add;
        });

        this.mgm.PhoneNumber.map(phon => {
            return Object.assign(phon, getMgmMobile.concat(this.phoneNumberDeleting).find((o) => {
                return o.MobileId === phon.MobileId && o.MobileNumber === phon.MobileNumber;
            }));
        });
        const phonNumberAdding = getMgmMobile.filter(function (item) {
            return item.rowState === RowState.Add;
        });

        this.mgm.MgmMobile = this.mgm.PhoneNumber;
        this.mgm.MgmMobile = this.mgm.MgmMobile.concat(phonNumberAdding);
        this.mgm.MgmMobile = this.mgm.MgmMobile.concat(this.phoneNumberDeleting);
        this.phoneNumberDeleting = [];

        // prepare Attachment
        const attachments = this.Attachment.getRawValue();
        //add
        const addingattachments = attachments.filter(function (item) {
            return item.RowState == RowState.Add;
        });
        //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
        this.mgm.MgmAttachment.map(attach => {
            return Object.assign(attach, attachments.filter(item => item.RowState == RowState.Edit).find((item) => {
                return attach.MgmAttachmentId == item.MgmAttachmentId
            }));
        })
        this.mgm.MgmAttachment = this.mgm.MgmAttachment.filter(item => item.RowState !== RowState.Normal && item.RowState !== RowState.Add).concat(addingattachments);

    }

    onSubmit() {
        const MasterAndPhone = {
            PrefixId: ['Label.LOTS01.No'],
            FirstName: ['Label.LOTS01.FristName'],
            LastName: ['Label.LOTS01.LastName'],
            Birthday: ['Label.LOTS01.BirthDay'],
            IdCard: ['Label.LOTS01.CardId'],
            DateIssue: ['Label.LOTS01.CardIssuance'],
            DateExpiry: ['Label.LOTS01.CardExpiration'],
            ProfileImage: ['Label.LOTS01.Img'],
            Career: ['Label.LOTS01.GroupOfCareers'],
            Gender: ['Label.LOTS01.Gender'],
            GroupOfCareer: ['Label.LOTS01.GroupOfCareers'],
            IncomeRange: ['Label.LOTS01.IncomeRange'],
            MobileNumber: ['Label.LOTS01.PhoneNumber'],
            MobileDescription: ['Label.LOTS01.Detail'],
        }

        const addressCurrent = {
            BuildingNo: 'Label.LOTS01.No',
            SubDistrictId: 'Label.LOTS01.SubDistrict',
            DistrictId: 'Label.LOTS01.District',
            ProvinceId: 'Label.LOTS01.Province',
        }

        const addressCard = {
            BuildingNo: 'Label.LOTS01.No',
            SubDistrictId: 'Label.LOTS01.SubDistrict',
            DistrictId: 'Label.LOTS01.District',
            ProvinceId: 'Label.LOTS01.Province',
        }

        this.submitted = true;
        if (this.MgmMasterForm.invalid || this.MgmAddressIdCardForm.invalid || this.MgmAddressCorrentForm.invalid || this.MgmMobileForm.invalid) {
            this.focusToggle = !this.focusToggle;
            Object.keys(this.MgmMasterForm.controls).forEach(
                (key) => {
                    if (this.MgmMasterForm.controls[key].invalid) {
                        if (key == 'PhoneNumber') {
                            this.as.warning('', 'Message.LO00030', ['ข้อมูลเบอร์ติดต่อ']);
                        } else {
                            this.as.warning('', 'Message.LO00030', MasterAndPhone[key]);
                        }
                    }
                });

            Object.keys(this.MgmAddressCorrentForm.controls).forEach(
                (key) => {
                    if (this.MgmAddressCorrentForm.controls[key].invalid) {
                        this.as.warning('', 'Message.LO00031', [addressCurrent[key], 'Label.LOTS01.CurrentAddress']);
                    }
                });

            Object.keys(this.MgmAddressIdCardForm.controls).forEach(
                (key) => {
                    if (this.MgmAddressIdCardForm.controls[key].invalid) {
                        this.as.warning('', 'Message.LO00031', [addressCard[key], 'Label.LOTS01.CardAddress']);
                    }
                });
            return;
        }

        if (!this.validatePhoneNumber()) {
            this.as.warning('', 'Message.STD00012', ['เบอร์ติดต่อ']);
            return;
        }

        if (this.validateCheckDuplicatePhoneNumber()) {
            this.as.warning('', 'Message.STD00004', ['เบอร์ติดต่อ']);
            return;
        }

        if (!this.validatePermissionIsPhoneNmberDefault()) {
            this.as.warning('', 'กรุณาเลือกเบอร์โทรหลัก');
            return;
        }

        this.saving = true;

        this.onSave();
    }

    onSave() {
        this.prepareSave();
        this.service.save(this.mgm, this.attachmentFiles).pipe(
            // switchMap(() => this.service.getMgmDetail(this.mgm.MgmCode)),
            finalize(() => {
                this.saving = false;
                this.submitted = false;
            }))
            .subscribe((res: Mgm) => {
                if (res != null) {
                    this.mgm = res;
                    this.rebuildForm();
                    // this.clearDirty();
                    this.searchPhoneNumber(this.mgm.MgmCode);
                    this.checkId = true;
                    this.as.success('', 'Message.STD00006');
                } else {
                    this.checkId = false;
                    this.as.warning('', 'รหัสบัตรประชาชน มีค่าซ้ำ');
                }
            });
    }

    canDeactivate(): Observable<boolean> | boolean {
        if (!this.MgmMasterForm.dirty) {
            return true;
        }
        return this.modal.confirm('Message.STD00002');
    }

    back() {
        this.router.navigate(['lo/lots16'], { skipLocationChange: true });
    }

    // --------------------------------------- filter DDL ---------------------------------------
    bindDropCardDistrict(filter?: boolean) {
        if (filter) {
            if (this.MgmAddressIdCardForm.controls.DistrictId.value) {
                this.DistrictCardList = this.filter.FilterActiveByValue(this.DistrictCardList, this.MgmAddressIdCardForm.controls.DistrictId.value);
            } else {
                this.DistrictCardList = this.filter.FilterActive(this.DistrictCardList);
            }
        }
        this.filter.SortByLang(this.DistrictCardList);
        this.DistrictCardList = [...this.DistrictCardList];
        return;
    }

    bindDropDownCardSubDistrict(filter?: boolean) {
        if (filter) {
            if (this.MgmAddressIdCardForm.controls.SubDistrictId.value) {
                this.SubDistrictCardList = this.filter.FilterActiveByValue(this.SubDistrictCardList, this.MgmAddressIdCardForm.controls.SubDistrictId.value);
            } else {
                this.SubDistrictCardList = this.filter.FilterActive(this.SubDistrictCardList);
            }
        }
        this.filter.SortByLang(this.SubDistrictCardList);
        this.SubDistrictCardList = [...this.SubDistrictCardList];
        return;
    }

    bindDropDownCardZipcode(filter?: boolean) {
        if (filter) {
            if (this.MgmAddressIdCardForm.controls.ZipCode.value) {
                this.zipcodeCardList = this.filter.FilterActiveByValue(this.zipcodeCardList, this.MgmAddressIdCardForm.controls.ZipCode.value);
            } else {
                this.zipcodeCardList = this.filter.FilterActive(this.zipcodeCardList);
            }
        }
        this.filter.SortByLang(this.zipcodeCardList);
        this.zipcodeCardList = [...this.zipcodeCardList];
        return;
    }

    bindDropDownCorrentDistrict(filter?: boolean) {
        if (filter) {
            if (this.MgmAddressCorrentForm.controls.DistrictId.value) {
                this.DistrictCurrentList = this.filter.FilterActiveByValue(this.DistrictCurrentList, this.MgmAddressCorrentForm.controls.DistrictId.value);
            } else {
                this.DistrictCurrentList = this.filter.FilterActive(this.DistrictCurrentList);
            }
        }
        this.filter.SortByLang(this.DistrictCurrentList);
        this.DistrictCurrentList = [...this.DistrictCurrentList];
        return;
    }

    bindDropDownCorrentSubDistrict(filter?: boolean) {
        if (filter) {
            if (this.MgmAddressCorrentForm.controls.SubDistrictId.value) {
                this.SubDistrictCurrentList = this.filter.FilterActiveByValue(this.SubDistrictCurrentList, this.MgmAddressCorrentForm.controls.SubDistrictId.value);
            } else {
                this.SubDistrictCurrentList = this.filter.FilterActive(this.SubDistrictCurrentList);
            }
        }
        this.filter.SortByLang(this.SubDistrictCurrentList);
        this.SubDistrictCurrentList = [...this.SubDistrictCurrentList];
        return;
    }

    bindDropDownCorrentZipcode(filter?: boolean) {
        if (filter) {
            if (this.MgmAddressCorrentForm.controls.ZipCode.value) {
                this.zipcodeListCurrentList = this.filter.FilterActiveByValue(this.zipcodeListCurrentList, this.MgmAddressCorrentForm.controls.ZipCode.value);
            } else {
                this.zipcodeListCurrentList = this.filter.FilterActive(this.zipcodeListCurrentList);
            }
        }
        this.filter.SortByLang(this.zipcodeListCurrentList);
        this.zipcodeListCurrentList = [...this.zipcodeListCurrentList];
        return;
    }

    bindDropDownWorkDistrict(filter?: boolean) {
        if (filter) {
            if (this.MgmAddressWorkForm.controls.DistrictId.value) {
                this.DistrictWorkList = this.filter.FilterActiveByValue(this.DistrictWorkList, this.MgmAddressWorkForm.controls.DistrictId.value);
            } else {
                this.DistrictWorkList = this.filter.FilterActive(this.DistrictWorkList);
            }
        }
        this.filter.SortByLang(this.DistrictWorkList);
        this.DistrictWorkList = [...this.DistrictWorkList];
        return;
    }

    bindDropDownWorkSubDistrict(filter?: boolean) {
        if (filter) {
            if (this.MgmAddressWorkForm.controls.SubDistrictId.value) {
                this.SubDistrictWorkList = this.filter.FilterActiveByValue(this.SubDistrictWorkList, this.MgmAddressWorkForm.controls.SubDistrictId.value);
            } else {
                this.SubDistrictWorkList = this.filter.FilterActive(this.SubDistrictWorkList);
            }
        }
        this.filter.SortByLang(this.SubDistrictWorkList);
        this.SubDistrictWorkList = [...this.SubDistrictWorkList];
        return;
    }

    bindDropDownWorkZipcode(filter?: boolean) {
        if (filter) {
            if (this.MgmAddressWorkForm.controls.ZipCode.value) {
                this.zipcodeListWorkList = this.filter.FilterActiveByValue(this.zipcodeListWorkList, this.MgmAddressWorkForm.controls.ZipCode.value);
            } else {
                this.zipcodeListWorkList = this.filter.FilterActive(this.zipcodeListWorkList);
            }
        }
        this.filter.SortByLang(this.zipcodeListWorkList);
        this.zipcodeListWorkList = [...this.zipcodeListWorkList];
        return;
    }

    filterAttachmentTypes(ContractAttachmentId) {
        const baseValue = this.mgm.MgmAttachment.find((item) => {
            return item.MgmAttachmentId === ContractAttachmentId
        });
        if (baseValue) {
            this.attachmentTypes = this.filter.FilterActiveByValue(this.attachmentTypes, baseValue.AttachmentTypeCode);
        } else {
            this.attachmentTypes = this.filter.FilterActive(this.attachmentTypes);
        }
        this.attachmentTypes = [...this.attachmentTypes];
    }
}