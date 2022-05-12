/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, RowState, SelectFilterService, ImageFile, Size, ModelRef } from '@app/shared';
import { Observable, Subject, timer, BehaviorSubject, Subscription } from 'rxjs';
import { Attachment } from '@app/shared/attachment/attachment.model';
import { finalize } from 'rxjs/operators';
import { Category } from '@app/shared/service/configuration.service';
import {
    Lots01Service, Customer, CustomerBankAccount, ContactPerson, PhoneNumber, PhoneNumberVerify
    , Securities, CustomerWorkplace, CustomerAddress, CustomerCardAddress, CustomerWorkAddress, SaveL, CustomerBorrower, CustomerAttachment
} from './lots01.service';
import { WebcamImage, WebcamUtil } from 'ngx-webcam';
import { LoadingService } from '@app/core/loading.service';
import { Page } from '@app/shared';
import { Lots01ModalComponent } from './lots01-modal.component';
import { BrowserService } from '@app/shared/service/browser.service';
import { switchMap, concatMap, map, filter, take } from 'rxjs/operators';
import { Lots01BorrowerLookupComponent } from './lots01-borrower-lookup.component';
import { tap } from 'rxjs/operators';

@Component({
    templateUrl: './lots01-detail.component.html',
    styleUrls: ['./lots01.component.scss']
})
export class Lots01DetailComponent implements OnInit {
    phoneList = [];
    statusPage: boolean;
    minDateExpiry = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 60);
    customerDetail: Customer = {} as Customer;
    phoneNumberVerifys: PhoneNumberVerify[] = [];
    saveLog: SaveL = {} as SaveL;
    ageCustomermer: number;
    customerCardAddress: CustomerCardAddress = {} as CustomerCardAddress;
    customerWorkAddress: CustomerWorkAddress = {} as CustomerWorkAddress;
    customerAddress: CustomerAddress = {} as CustomerAddress;
    customerBankAccount: CustomerBankAccount = {} as CustomerBankAccount;
    customerWorkplace: CustomerWorkplace = {} as CustomerWorkplace;
    imageFile: ImageFile = new ImageFile();
    attachmentFile: Attachment = new Attachment();
    attachmentFiles: Attachment[] = [];
    customerForm: FormGroup;
    bankAccountForm: FormGroup;
    pageContractHead = new Page();
    pageBorrower = new Page();
    pageGuarantor = new Page();
    pagePhone = new Page();
    addressForm: FormGroup;
    addressCurrentForm: FormGroup;
    addressCardForm: FormGroup;
    addressWorkForm: FormGroup;
    workplaceForm: FormGroup;
    loadingContract: boolean;
    loadingPhoneList: boolean;
    loadingBorrower: boolean;
    checkModal = false;
    loadingGuarantor: boolean;
    webcamImage: string;
    trigger: Subject<void> = new Subject<void>();
    showWebcam = false;
    switching: boolean;
    lineConnect = false;
    multipleWebcamsAvailable = false;
    nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
    submitted: boolean;
    focusToggle: boolean;
    zoom = 8;
    placeId: string;
    cid: string;
    address: string;
    birth: string;
    enFullname: string;
    expireDate: string;
    issueDate: string;
    thFullname: string;
    imgWebcamera: string;
    gender: string;
    issuer: string;
    showAlert: string = 'STD00000';
    showAlertDesc: string = 'STD00000';
    showImg = 1;
    category = Category.Example;
    countContract = 0;
    countBorrower = 0;
    countGuarantor = 0;
    photo: any;
    checkId: boolean = false;
    provinceData = [];
    province = [];
    district = [];
    zipcodeList = [];
    zipcode = [];
    zipcodedata = [];
    districtData = [];
    subDistrict = [];
    subDistrictData = [];
    subDistrictSelect = [];
    SubDistrictData = [];
    phonlist = [];
    value = [];
    currentDistrict = [];
    currentDistrictSelect = [];
    currentDistrictData = [];
    currentSubDistrict = [];
    currentSubDistrictSelect = [];
    currentSubDistrictData = [];
    currentPostCode = [];
    currentPostCodeSelect = [];
    currentPostCodeData = [];
    workDistrict = [];
    workDistrictSelect = [];
    workDistrictData = [];
    modalEdit: ModelRef;
    workSubDistrict = [];
    workSubDistrictSelect = [];
    workSubDistrictData = [];
    workPostCode = [];
    workPostCodeSelect = [];
    workPostCodeData = [];
    showAge = {};
    showExperience = {};
    master: {
        PrefixList: any[], ReligionList: any[], GenderList: any[], NationalityList: any[],
        MaritalStatusList: any[], BankList: any[],
        BankAccountTypeList: any[], ProvinceList: any[], Race: any[], GroupOfCareer: any[], IncomeRange: any[]
        , GetSuParameterDisplay: any[], ContractType: any[], LawStatus: any[]
    };
    prefixList = [];
    prefix = [];
    race = [];
    raceData = [];
    religionList = [];
    religion = [];
    genderList = [];
    genderData = [];
    nationalityList = [];
    nationality = [];
    GroupOfCareerList = [];
    GroupOfCareer = [];
    IncomeRangeList = [];
    IncomeRange = [];
    maritalStatusList = [];
    maritalStatus = [];
    bankList = [];
    bankAccountTypeList = [];
    bankAccountType = [];
    bank = [];
    SubDistrictList = [];
    ProvinceList = [];
    DistrictList = [];
    provinceList = [];
    districtList = [];
    districtSelect = [];
    imageOffLine: string;
    imageOnLine: string;
    checkStartRead = true;
    i = 0;
    tambonList = [];
    saving: Boolean;
    disConnect: Boolean;
    phoneNumberDeleting: PhoneNumber[] = [];
    contactPersonDeleting: ContactPerson[] = [];
    contactSecuritiesDeleting: Securities[] = [];
    contractGuarantor = [];
    contractBorrower = [];
    contractHead = [];
    countContractHead: Number = 0;
    countContractBorrower: Number = 0;
    countPhoneList: Number = 0;
    countContractGuarantor: Number = 0;
    borrower = [];
    cardSocket: WebSocket;
    readerSocket: WebSocket;
    districtsCard: string;
    subDistrictsCard: string;
    phonePage = new Page();
    flagChkMsgError = false;
    loanContractType = [];
    application = new BehaviorSubject('');
    customerBorrowerdeleting: CustomerBorrower[] = [];
    markers: google.maps.Marker[] = [];
    customerAttachmentDeleting: CustomerAttachment[] = [];
    refTokenOTP: string;
    countDown: Subscription;
    countDownDisplay: string = '00:00';
    lawStatus = [];
    markersCurrent: google.maps.Marker[] = [];
    customerCourtHistory = [];
    customerCreditGradeHistory = [];
    customerBranchComment = [];
    pageCustomerCourtHistory = new Page();
    pageCustomerCreditGradeHistory = new Page();
    pageCustomerBranchComment = new Page();
    countCustomerCourtHistory: Number = 0;
    countCustomerCreditGradeHistory: Number = 0;
    countCustomerBranchComment: Number = 0;
    flageSaveOnly: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private browser: BrowserService,
        private as: AlertService,
        private lots01Service: Lots01Service,
        private modal: ModalService,
        public lang: LangService,
        private filter: SelectFilterService,
        private ls: LoadingService,
    ) {
        this.createForm();
        this.readCard();

    }

    private resize() {
        if (this.browser.isIE) {
            var evt = document.createEvent('UIEvents');
            evt.initEvent('resize', true, false);
            window.dispatchEvent(evt);
        } else {
            window.dispatchEvent(new Event('resize'));
        }
    }

    tabSelected(tab) {
        setTimeout(this.resize.bind(this), 1);
    }

    disError() {
        if (this.customerDetail.CreatedProgram == null || this.flagChkMsgError) {
            this.as.error('', 'Message.LO00040');
        }
        this.flagChkMsgError = false;
        this.ls.hide();
    }

    onReadCard() {
        this.flagChkMsgError = true;
        setTimeout(() => {
            this.onConnect();
        }, 3000);
        this.ls.show();
        this.cardSocket.send(`getcard:0`);
        this.disConnect = false;
    }

    onConnect() {
        this.ls.show();
        this.readCard();
    }

    onReadCardFinish(obj) {
        if (obj.cid != "") {
            const nameTha = obj.thFullname.split('#');
            const nameEng = obj.enFullname.split('#');
            const Address = obj.Address.split('#');
            this.addressCard(Address);
            this.customerForm.controls.Birthday.setValue(this.dateCard(obj.birth));
            this.customerForm.controls.DateExpiry.setValue(this.dateCard(obj.expireDate));
            this.customerForm.controls.DateIssue.setValue(this.dateCard(obj.issueDate));
            this.customerForm.controls.Gender.setValue(this.genderCard(obj.gender));
            this.prefixCard(nameTha[0]);
            this.i += 1;
            const img = { DataUrl: 'data:image/jpeg;base64,' + obj.photo, Name: 'imgCard' + this.i + '.jpg', Uploaded: false };
            this.customerForm.controls.FirstName.setValue(nameTha[1]);
            this.customerForm.controls.LastName.setValue(nameTha[3]);
            this.customerForm.controls.IdCard.setValue(obj.cid);
            this.customerForm.controls.ProfileImage.setValue(img);
            if (this.imgWebcamera !== null) {
                const imgWebcam = { DataUrl: this.imgWebcamera, Name: 'imgCard2.jpg', Uploaded: false };
                this.customerForm.controls.ProfileWebcam.setValue(imgWebcam);
            }
            this.ls.hide();
        } else {
            this.ls.hide();
            this.as.warning('', 'Message.LO00041');
            this.disConnect = true;
            return;
        }
    }

    addressCard(address) {
        const id = this.addressCardForm.controls.AddressId.value ? this.addressCardForm.controls.AddressId.value : null
        const version = this.addressCardForm.controls.RowVersion.value ? this.addressCardForm.controls.RowVersion.value : null

        this.addressCardForm.reset();
        this.addressCardForm.controls.AddressType.setValue("2");
        if (id) {
            this.addressCardForm.controls.RowVersion.setValue(version);
            this.addressCardForm.controls.AddressId.setValue(id);
        }
        this.addressCardForm.controls.BuildingNo.setValue(address[0]);
        this.addressCardForm.controls.Alley.setValue(address[3]);
        this.addressCardForm.controls.VillageNo.setValue(address[1].substring(8));
        const districts = address[6].split('อำเภอ');
        const provinces = address[7].split('จังหวัด');
        let districtSub: any;
        if (districts.length === 2) {
            districtSub = address[6].substring(5);
        } else {
            districtSub = address[6];
        }
        this.districtsCard = districtSub;
        this.subDistrictsCard = address[5].substring(4);
        this.province.forEach(element => {
            if (element.TextTha === provinces[provinces.length - 1]) {
                this.addressCardForm.controls.ProvinceId.setValue(element.Value);
                this.loadCityList(element.Value, this.addressCardForm);
                this.loadZipcodeList(element.Value, this.addressCardForm);
            } else {
                this.addressCardForm.controls.DistrictId.disable();
                this.addressCardForm.controls.SubDistrictId.disable();
                this.addressCardForm.controls.ZipCode.disable();
            }
        });
    }

    dateCard(date) {
        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);
        return date = new Date(year - 543, month - 1, day);
    }

    genderCard(gender) {
        if (gender === '1') {
            return 'M';
        } else if (gender === '2') {
            return 'F';
        }
    }

    prefixCard(prefix) {
        this.prefixList.forEach(element => {
            if (element.prefixAbbreviationTha === prefix) {
                this.customerForm.controls.PrefixId.setValue(element.Value);
            }
        });
    }

    waitConnect() {
        this.ls.hide();
    }

    readCard() {
        this.cardSocket = new WebSocket('ws://localhost:64321/card');

        this.readerSocket = new WebSocket('ws://localhost:64321/reader');
        // reader ----------------------------------
        this.readerSocket.onerror = function (e) {
            // console.error('readerSocket.onerror ' + e);
        };
        this.readerSocket.onmessage = function (m) {
            // readerSlot.innerHTML = JSON.parse(m.data)
        };

        this.readerSocket.onopen = function (this: WebSocket, ev: Event) {
            // readerSlot.innerHTML = 'connecting...'
            setTimeout(() => {
                this.send('');
            }, 1000);
        };
        // card ----------------------------------
        this.cardSocket.onerror = (e) => {
            // alertBox.innerHTML += e.message
            this.disError();
            // console.error("his.cardSocket.onerror " + e);
        };
        this.cardSocket.onopen = (e) => {
            // status.innerHTML = "waiting";
            if (this.disConnect != undefined && !this.disConnect) {
                this.as.info('', 'Message.LO00042');
            }
            this.waitConnect();
        };

        this.cardSocket.onmessage = (m) => {
            if (m.data !== 'waiting' && m.data !== 'Waiting for a Card' && m.data !== 'Reading card' && m.data !== 'scard: error(8010002e): Cannot find a smart card reader.') {
                const obj = JSON.parse(m.data);
                this.onReadCardFinish(obj);
            } else if (m.data === 'Waiting for a Card') {
                this.as.info('', 'Message.LO00043');
                setTimeout(() => {
                    if (m.data !== 'Reading card') {
                        this.ls.hide();
                        return;
                    }
                }, 10000);
            } else if (m.data === 'Reading card') {
                this.disConnect = true;
                this.as.info('', 'Message.LO00044');
            }
        };
    }

    createForm() {
        this.customerForm = this.fb.group({
            CustomerCode: null,
            IdcardHidden: null,
            // IdcardShow: null,
            PrefixId: [null, Validators.required],
            FirstName: [null, Validators.required],
            LastName: [null, Validators.required],
            FirstNameEn: [null, [Validators.required, Validators.pattern('^[A-Z][a-z]+')]],
            LastNameEn: [null, [Validators.required, Validators.pattern('^[A-Z][a-z]+')]],
            Email: [null],
            Birthday: [null, Validators.required],
            Age: null,
            IdCard: [null, Validators.required],
            DateIssue: [null, Validators.required],
            DateExpiry: [null, Validators.required],
            // ProfileImage: [null, Validators.required],
            ProfileImage: null,
            ProfileWebcam: null,
            Nationality: null,
            Religion: null,
            Career: [null, Validators.required],
            Gender: [null, Validators.required],
            MaritalStatus: [null, Validators.required],
            LoanStatus: null,
            Remark: null,
            Credit: [{ value: 'N', disabled: true }],
            LoanFlag: false,
            GuarantorFlag: false,
            DepositFlag: false,
            CreatedProgram: null,
            StockFlag: false,
            ResignFlag: false,
            OtherFlag: false,
            OtherRemark: null,
            BlacklistRemark: null,
            VerifyFace: false,
            VerifyName: false,
            VerifyDate: false,
            BlacklistStatus: false,
            Race: null,
            FlagSendToMgm: false,
            GroupOfCareer: [null, Validators.required],
            IncomeRange: [null, Validators.required],
            SecurityCode: null,
            MgmCode: null,
            ContractType: 'M',
            PhoneNumber: this.fb.array([]),
            ContactPersons: this.fb.array([]),
            Securities: this.fb.array([]),
            PicoInterestUsed36: null,
            PicoInterestUsed28: null,
            LawInterestUsed: null,
            ConfirmPhoneNumber: null,
            SignatureImage: null,
            CustomerBorrower: this.fb.array([]),
            Lat: null,
            Lng: null,
            CustomerAttachment: this.fb.array([]),
            LawRemark: null,
            SubmitLawDepartment: false,
            MortgageOnly: false,
            LawStatus: null,
            LawStartDate: [{ value: null, disabled: true }],
            LatCurrent: null,
            LngCurrent: null,
            BranchComment: null,
        });

        this.bankAccountForm = this.fb.group({
            BankAccountId: null,
            CustomerCode: null,
            BankCode: [null, Validators.required],
            AccountNo: [null, Validators.required],
            BankBranch: [null, Validators.required],
            AccountName: [null, Validators.required],
            BankAccountTypeCode: [null, Validators.required],
            RowVersion: 0,
        });

        this.addressCurrentForm = this.fb.group({
            Replaces: false,
            AddressId: null,
            CustomerCode: null,
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
            PhoneNo: null,
            MobileNo: null,
            Email: null,
            Latitude: null,
            Longitude: null,
            RowVersion: 0,
        });

        this.addressCardForm = this.fb.group({
            Replaces: false,
            AddressId: null,
            CustomerCode: null,
            AddressType: '2',
            BuildingName: null,
            BuildingNo: [null, Validators.required],
            VillageNo: null,
            Alley: null,
            Street: null,
            SubDistrictId: [null, Validators.required],
            DistrictId: [null, Validators.required],
            ProvinceId: [null, Validators.required],
            ZipCode: null,
            PhoneNo: null,
            MobileNo: null,
            Email: null,
            Latitude: null,
            Longitude: null,
            RowVersion: 0,
        });

        this.addressWorkForm = this.fb.group({
            Replaces: false,
            AddressId: null,
            CustomerCode: null,
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
            PhoneNo: null,
            MobileNo: null,
            Email: null,
            Latitude: null,
            Longitude: null,
            RowVersion: 0,
        });

        this.workplaceForm = this.fb.group({
            WorkplaceId: null,
            WorkplaceName: null,
            CustomerCode: null,
            StartDate: null,
            WorkplacePosition: null,
            Department: null,
            WorkplaceUnder: null,
            YearExperience: null,
            Salary: null,
            RowVersion: 0,
        });

        this.addressCardForm.valueChanges.subscribe(
            (value) => {
                if (this.addressCurrentForm.controls.Replaces.value) {
                    this.onChangeCopytoCerrent();
                }
                if (this.addressWorkForm.controls.Replaces.value) {
                    this.onChangeCopytoWorkplace();
                }
            }
        );

        this.workplaceForm.controls.StartDate.valueChanges.subscribe(
            (value) => {
                if (this.workplaceForm.controls.StartDate.value != null) {
                    this.sumExperience();
                } else {
                    this.workplaceForm.controls['YearExperience'].setValue(null);
                }

            }
        );

        this.customerForm.controls.Birthday.valueChanges.subscribe(
            (value) => {
                if (this.customerForm.controls.Birthday.value != null) {
                    this.sumAge();
                } else {
                    this.customerForm.controls['Age'].setValue(null);
                }
            }
        );

        this.customerForm.controls.ProfileWebcam.valueChanges.subscribe(
            (value) => {
                if (value == null) {
                    this.showImg = 1;
                }
            }
        );

        this.customerForm.controls.IdCard.valueChanges.subscribe(
            (value) => {
                // if (value) {
                //     if (!this.customerForm.controls.BlacklistStatus.value && this.customerForm.controls.CreatedProgram.value != null) {
                //         this.checkId = false;
                //     } else {
                //         this.checkId = true;
                //     }
                // } else {
                //     this.checkId = false;
                // }
            }
        );

        this.customerForm.controls.BlacklistStatus.valueChanges.subscribe(
            (value) => {
                if (value && this.customerForm.controls.CreatedProgram.value == null) {
                    this.customerForm.controls.Birthday.setValue(new Date());
                    this.customerForm.controls.DateIssue.setValue(new Date());
                    this.customerForm.controls.DateExpiry.setValue(new Date(new Date().getFullYear(), new Date().getMonth() + 3, new Date().getDate()));
                    this.customerForm.controls.Career.setValue('-');
                    this.customerForm.controls.Gender.setValue('M');
                    this.customerForm.controls.GroupOfCareer.setValue('001');
                    this.customerForm.controls.IncomeRange.setValue('01');

                    this.addressCurrentForm.controls.BuildingNo.setValue('-');
                    this.addressCurrentForm.controls.SubDistrictId.setValue(300101);
                    this.addressCurrentForm.controls.DistrictId.setValue(203);
                    this.addressCurrentForm.controls.ProvinceId.setValue(30);

                    this.addressCardForm.controls.BuildingNo.setValue('-');
                    this.addressCardForm.controls.SubDistrictId.setValue(300101);
                    this.addressCardForm.controls.DistrictId.setValue(203);
                    this.addressCardForm.controls.ProvinceId.setValue(30);
                }
            }
        );

        this.customerForm.controls.LawStatus.valueChanges.subscribe(
            (value) => {
                if (this.customerForm.controls.LawStatus.value != null) {
                    this.customerForm.controls.LawStartDate.enable();
                } else {
                    this.customerForm.controls.LawStartDate.disable();
                    this.customerForm.controls.LawStartDate.setValue(null);
                }
            }
        );
    }

    onRemove(fileName: string) {
        this.customerDetail.ProfileImage = fileName;
    }

    ngOnInit() {
        this.lang.onChange().subscribe(
            () => {
                this.sumAge();
                this.sumExperience();
                this.bindDropDownZipcodeList();
                this.bindDropDownMaritalStatus();
                this.bindDropDownReligion();
                this.bindDropDownNationality();
                this.bindDropDownRace();
                this.bindDropDownGender();
                this.bindDropDownPrefix();
                this.bindDropDownGroupOfCureer();
                this.bindDropDownIncomeRange();
                this.bindDropDownAccountType();
                this.bindDropDownBank();
                this.bindDropDownProvince();
                this.bindDropDownDistrict();
                this.bindDropDownSubDistrict();
                this.bindDropDownCurrentDistrict();
                this.bindDropDownCurrentSubDistrict();
                this.bindDropDownCurrentZipcode();
                this.bindDropDownWorkDistrict();
                this.bindDropDownWorkSubDistrict();
                this.bindDropDownWorkZipcode();
            }
        );
        this.route.data.subscribe((data) => {
            this.master = data.attribute.master;
            this.imageOffLine = this.master.GetSuParameterDisplay[0].Value + '/File/Example/line_2f5f5096-29d5-48e7-8cca-b900886fc762.png';
            this.imageOnLine = this.master.GetSuParameterDisplay[0].Value + '/File/Example/linegreen_d7ded2ee-3ad4-4c83-a6b5-416d5a098e35.png';
            this.customerDetail = data.attribute.customerDetail;
            // this.contractHead = data.attribute.ContactHeadList.Rows;
            this.contractBorrower = data.attribute.ContactBorrowList.Rows;
            this.contractGuarantor = data.attribute.ContactGuarantorList.Rows;
            this.phoneList = data.attribute.PhoneList.Rows;
            this.loanContractType = this.master.ContractType;
            this.phoneNumberVerifys = data.attribute.customerDetail.PhoneNumber;
            this.lawStatus = this.master.LawStatus;

            if (this.customerDetail.CreatedProgram != null) {
                this.onSetCountSearch();
            }

            this.onChangeDefaultPhoneNumber();
            this.checkSignature()
            this.checkUserVerify()

            this.rebuildForm();
        });
        WebcamUtil.getAvailableVideoInputs()
            .then((mediaDevices: MediaDeviceInfo[]) => {
                this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
            });

    }

    onSetCountSearch() {
        // this.countContract = this.contractHead.length ? this.contractHead.length : 0;
        this.countBorrower = this.contractBorrower.length ? this.contractBorrower.length : 0;
        this.countGuarantor = this.contractGuarantor.length ? this.contractGuarantor.length : 0;
        this.countPhoneList = this.phoneList.length ? this.phoneList.length : 0;
        this.countPhoneList = this.phoneList.length ? this.phoneList.length : 0;
    }

    bildDropDown() {
        this.bindDropDownZipcodeList(true);
        this.bindDropDownAccountType(true);
        this.bindDropDownBank(true);
        this.bindDropDownSubDistrict(true);
        this.bindDropDownDistrict(true);
        this.bindDropDownMaritalStatus(true);
        this.bindDropDownReligion(true);
        this.bindDropDownRace(true);
        this.bindDropDownNationality(true);
        this.bindDropDownGender(true);
        this.bindDropDownPrefix(true);
        this.bindDropDownGroupOfCureer(true);
        this.bindDropDownIncomeRange(true);
        this.bindDropDownProvince(true);
        this.bindDropDownCurrentDistrict(true);
        this.bindDropDownCurrentSubDistrict(true);
        this.bindDropDownCurrentZipcode(true);
        this.bindDropDownWorkDistrict(true);
        this.bindDropDownWorkSubDistrict(true);
        this.bindDropDownWorkZipcode(true);
    }

    rebuildForm() {
        this.bildDropDown()
        this.lineConnect = false;
        this.customerForm.controls.Age.disable();
        this.workplaceForm.controls.YearExperience.disable();
        this.customerForm.controls.CustomerCode.disable();
        this.customerForm.controls.SecurityCode.disable();
        this.customerForm.controls.MgmCode.disable();
        // ------------
        // if ( this.customerDetail.PhoneNumber != null){
        //   this.phoneList = this.customerDetail.PhoneNumber;
        //   this.countPhoneList = this.contractGuarantor.length ? this.contractGuarantor.length : 0;
        // }
        this.onChangeOtherFlag();
        this.onChangeBlacklistStatus();
        if (this.customerDetail.CustomerCode) {
            this.checkId = true;

            // this.customerForm.controls.Credit.disable();
            this.customerForm.setControl('ContactPersons', this.fb.array(
                this.customerDetail.ContactPersons.map((detail) => this.createContactPersonsForm(detail))
            ));
            this.customerForm.setControl('Securities', this.fb.array([]));
            this.customerForm.setControl('Securities', this.fb.array(
                this.customerDetail.Securities.map((detail) => this.createSecuritiesForm(detail))
            ));
            this.customerForm.setControl('PhoneNumber', this.fb.array(
                this.customerDetail.PhoneNumber.map((detail) => this.createPhoneNumberForm(detail))
            ));
            this.customerForm.setControl('CustomerBorrower', this.fb.array(
                this.customerDetail.CustomerBorrower.map((detail) => this.createCustomerBorrowerForm(detail))
            ));
            setTimeout(() => {
                this.customerForm.setControl('CustomerAttachment', this.fb.array(
                    this.customerDetail.CustomerAttachment.map((detail) => this.CustomerAttachmentForm(detail))
                ));
            }, 300);
            this.customerDetail.CustomerAddress.forEach(element => {
                if (element.AddressType === '1') {
                    this.addressCurrentForm.patchValue(element);
                    Object.assign(this.customerAddress, element);
                    if (element.Replaces) {
                        this.addressCurrentForm.disable();
                        this.addressCurrentForm.controls.Replaces.enable();
                    }
                } else if (element.AddressType === '2') {
                    this.addressCardForm.patchValue(element);
                    Object.assign(this.customerCardAddress, element);
                } else if (element.AddressType === '3') {
                    this.addressWorkForm.patchValue(element);
                    if (element.Replaces) {
                        this.addressWorkForm.disable();
                        this.addressWorkForm.controls.Replaces.enable();
                        Object.assign(this.customerWorkAddress, element);
                    }
                }
            });

            this.customerForm.controls.CreatedProgram.setValue(this.customerDetail.CreatedProgram);
            this.customerForm.patchValue(this.customerDetail);

            if (this.customerDetail.ProfileImage) {
                const imgProfileImage = { DataUrl: this.customerDetail.ProfileImage, Name: 'imgCard1.jpg', Uploaded: false };
                this.customerForm.controls.ProfileImage.setValue(imgProfileImage);
            }

            if (this.customerDetail.ProfileWebcam) {
                this.showImg = 3;
                const imgWebcam = { DataUrl: this.customerDetail.ProfileWebcam, Name: 'imgCard2.jpg', Uploaded: false };
                this.customerForm.controls.ProfileWebcam.setValue(imgWebcam);
                this.imgWebcamera = this.customerDetail.ProfileWebcam;
            }

            if (this.customerDetail.CustomerBankAccount.length > 0) {
                this.bankAccountForm.patchValue(this.customerDetail.CustomerBankAccount[0]);
            }

            if (this.customerDetail.CustomerWorkplace.length > 0) {
                this.workplaceForm.patchValue(this.customerDetail.CustomerWorkplace[0]);
            }

            // this.customerForm.setControl('ContactPersons', this.fb.array([]));
            if (this.customerDetail.LineUserId) {
                this.lineConnect = true;
            }

            this.sumAge();
            this.sumExperience();
            this.onChangeOtherFlag();
            this.onChangeBlacklistStatus();

            if (this.customerForm.controls.IdCard.value) {
                const subIdCard = this.customerForm.controls.IdCard.value.substr(9);
                this.customerForm.controls['IdcardHidden'].setValue("xxxxxxxx" + subIdCard);
                this.customerForm.controls.IdcardHidden.disable();
            }

            if (this.addressCardForm.controls['ProvinceId'].value) {
                this.loadCityList(this.addressCardForm.controls['ProvinceId'].value, this.addressCardForm);
            }
            if (this.addressCurrentForm.controls['ProvinceId'].value) {
                this.loadCityList(this.addressCurrentForm.controls['ProvinceId'].value, this.addressCurrentForm);
            }
            if (this.addressWorkForm.controls['ProvinceId'].value) {
                this.loadCityList(this.addressWorkForm.controls['ProvinceId'].value, this.addressWorkForm);
            }
            if (this.addressCardForm.controls['DistrictId'].value) {
                this.loadSubCityList(this.addressCardForm.controls['DistrictId'].value, this.addressCardForm);
            }
            if (this.addressCurrentForm.controls['DistrictId'].value) {
                this.loadSubCityList(this.addressCurrentForm.controls['DistrictId'].value, this.addressCurrentForm);
            }
            if (this.addressWorkForm.controls['DistrictId'].value) {
                this.loadSubCityList(this.addressWorkForm.controls['DistrictId'].value, this.addressWorkForm);
            }
            if (this.addressCardForm.controls['ProvinceId'].value) {
                this.loadZipcodeList(this.addressCardForm.controls['ProvinceId'].value, this.addressCardForm);
            }
            if (this.addressCurrentForm.controls['ProvinceId'].value) {
                this.loadZipcodeList(this.addressCurrentForm.controls['ProvinceId'].value, this.addressCurrentForm);
            }
            if (this.addressWorkForm.controls['ProvinceId'].value) {
                this.loadZipcodeList(this.addressWorkForm.controls['ProvinceId'].value, this.addressWorkForm);
            }
            this.onReplacesCerrent();
            this.onReplacesWorkplace();
        } else {
            this.customerForm.controls['CustomerCode'].setValue('AUTO');
            this.addressCardForm.controls.DistrictId.disable();
            this.addressCardForm.controls.SubDistrictId.disable();
            this.addressCurrentForm.controls.DistrictId.disable();
            this.addressCurrentForm.controls.SubDistrictId.disable();
            this.addressWorkForm.controls.DistrictId.disable();
            this.addressWorkForm.controls.SubDistrictId.disable();
            this.addressCurrentForm.controls.ZipCode.disable();
            this.addressWorkForm.controls.ZipCode.disable();
        }
        this.initMap();
        this.initMapCurrent();
        this.searchContract(this.customerForm.controls.CustomerCode.value, this.customerForm.controls.ContractType.value);
        this.searchCustomerCourtHistory();
        this.searchCustomerCreditGradeHistory();
        this.searchCustomerBranchComment();
    }

    sumAge() {
        if (this.customerForm.controls.Birthday.value != null) {
            let Age: number = 0;
            let Mouth: number = 0;
            let Day: number = 0;
            const FullDateNow = new Date();
            const NowD: number = (FullDateNow.getDate());
            const NowM: number = (FullDateNow.getMonth() + 1);
            const NowY: number = (FullDateNow.getFullYear());
            const SelectD: number = this.customerForm.controls.Birthday.value.getDate();
            const SelectM: number = this.customerForm.controls.Birthday.value.getMonth() + 1;
            const SelectY: number = this.customerForm.controls.Birthday.value.getFullYear();
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
            this.customerForm.controls['Age'].setValue(this.showAge['text' + this.lang.CURRENT]);
            this.ageCustomermer = Age;
        }
    }

    sumExperience() {
        if (this.workplaceForm.controls.StartDate.value != null) {
            let Age: number = 0;
            let Mouth: number = 0;
            let Day: number = 0;
            const FullDateNow = new Date();
            const NowD: number = (FullDateNow.getDate());
            const NowM: number = (FullDateNow.getMonth() + 1);
            const NowY: number = (FullDateNow.getFullYear());
            const SelectD: number = this.workplaceForm.controls.StartDate.value.getDate();
            const SelectM: number = this.workplaceForm.controls.StartDate.value.getMonth() + 1;
            const SelectY: number = this.workplaceForm.controls.StartDate.value.getFullYear();
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
            this.showExperience = { textTha: Age + " ปี " + Mouth + " เดือน " + Day + " วัน", textEng: Age + " year " + Mouth + " month " + Day + " day" };
            this.workplaceForm.controls['YearExperience'].setValue(this.showExperience['text' + this.lang.CURRENT]);
        }
    }

    back() {
        this.router.navigate(['/lo/lots01'], { skipLocationChange: true });
    }

    addPhoneNumber() {
        this.PhoneNumber.push(this.createPhoneNumberForm({} as PhoneNumber));
        this.customerForm.markAsDirty();
    }

    get PhoneNumber(): FormArray {
        return this.customerForm.get('PhoneNumber') as FormArray;
    }

    openEdit(edit) {
        this.saveLog.LogSystem = 'LO';
        this.saveLog.LogDiscription = 'ขอดูข้อมูลเบอร์โทรศัพท์ผู้กู้ จากหน้า ลูกค้า/สมาชิก ของ ลูกค้า/สมาชิก เลขที่ ' + this.customerForm.controls.CustomerCode.value + ': ' + this.customerForm.controls.FirstName.value + ' ' + this.customerForm.controls.LastName.value;
        this.saveLog.LogItemGroupCode = 'SaveLog';
        this.saveLog.LogItemCode = '2';
        this.saveLog.LogProgram = 'LOTS01';
        this.saveLog.CustomerCode = this.customerForm.controls.CustomerCode.value;
        this.saveLog.CustomerName = this.customerForm.controls.FirstName.value + ' ' + this.customerForm.controls.LastName.value;
        this.saveLog.ContractHeadId = null;

        this.lots01Service.saveLog(this.saveLog).pipe(
            finalize(() => { })
        ).subscribe((res) => {
            this.checkModal = true;
            this.modalEdit = this.modal.open(edit, Size.large);
        });
    }

    openEditPhone2(edit) {
        this.saveLog.LogSystem = 'LO';
        this.saveLog.LogDiscription = 'ขอดูข้อมูลเบอร์โทรศัพท์ผู้ติดต่อ จากหน้า ลูกค้า/สมาชิก ของ ลูกค้า/สมาชิก เลขที่ ' + this.customerForm.controls.CustomerCode.value + ': ' + this.customerForm.controls.FirstName.value + ' ' + this.customerForm.controls.LastName.value;
        this.saveLog.LogItemGroupCode = 'SaveLog';
        this.saveLog.LogItemCode = '4';
        this.saveLog.LogProgram = 'LOTS01';
        this.saveLog.CustomerCode = this.customerForm.controls.CustomerCode.value;
        this.saveLog.CustomerName = this.customerForm.controls.FirstName.value + ' ' + this.customerForm.controls.LastName.value;
        this.saveLog.ContractHeadId = null;

        this.lots01Service.saveLog(this.saveLog).pipe(
            finalize(() => { })
        ).subscribe((res) => {
            this.checkModal = true;
            this.modalEdit = this.modal.open(edit, Size.large);
        });
    }

    createPhoneNumberForm(item: PhoneNumber): FormGroup {
        const fg = this.fb.group({
            MobileId: null,
            MobileNumber: [null, Validators.required],
            MobileDescription: [null, Validators.required],
            Default: false,
            CustomerCode: null,
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

                if (control.MobileDescription) {
                    this.showAlertDesc = "STD00037";
                } else {
                    this.showAlertDesc = "STD00000";
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

    addContactPerson() {
        this.ContactPersons.push(this.createContactPersonsForm({} as ContactPerson));
        this.customerForm.markAsDirty();
    }

    get ContactPersons(): FormArray {
        return this.customerForm.get('ContactPersons') as FormArray;
    }

    get CustomerBorrower(): FormArray {
        return this.customerForm.get('CustomerBorrower') as FormArray;
    }

    createContactPersonsForm(item: ContactPerson): FormGroup {
        const fg = this.fb.group({
            ContactId: null,
            CustomerCode: null,
            PrefixId: null,
            FirstName: null,
            LastName: null,
            MobileNo: null,
            Relationship: null,
            Remark: null,
            RowVersion: 0,
            RowState: RowState.Add
        });
        fg.patchValue(item, { emitEvent: false });
        fg.valueChanges.subscribe(
            (control) => {
                if (control.RowState === RowState.Normal) {
                    fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                }
            }
        );
        return fg;
    }

    createCustomerBorrowerForm(item: CustomerBorrower): FormGroup {
        const fg = this.fb.group({
            CustomerBorrowerId: null,
            CustomerCode: null,
            CustomerBorrowerCode: null,
            CustomerNameEng: null,
            CustomerNameTha: null,
            RowVersion: 0,
            RowState: RowState.Add
        });
        fg.patchValue(item, { emitEvent: false });
        fg.valueChanges.subscribe(
            (control) => {
                if (control.RowState === RowState.Normal) {
                    fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                }
            }
        );
        return fg;
    }

    removeContactPersons(index) {
        const ContactPerson = this.ContactPersons.at(index) as FormGroup;
        if (ContactPerson.controls.RowState.value !== RowState.Add) {
            ContactPerson.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
            this.contactPersonDeleting.push(ContactPerson.getRawValue());
        }

        const rows = [...this.ContactPersons.getRawValue()];
        rows.splice(index, 1);

        this.ContactPersons.patchValue(rows, { emitEvent: false });
        this.ContactPersons.removeAt(this.ContactPersons.length - 1);
        this.customerForm.markAsDirty();
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
        this.customerForm.markAsDirty();
    }

    addSecurities() {
        this.Securities.push(this.createSecuritiesForm({} as Securities));
        this.customerForm.markAsDirty();
    }

    get Securities(): FormArray {
        return this.customerForm.get('Securities') as FormArray;
    }

    checkDuplicateAdd(result) {
        for (const form of this.Securities.getRawValue()) {
            if (form.SecuritiesCode === result.SecuritiesCode) {
                return false;
            }
        }
    }

    addRow() {
        const data = {
            CustomerCode: this.customerDetail.CustomerCode,
            SecuritiesList: this.Securities.getRawValue()
        };
        this.modal.openComponent(Lots01ModalComponent, Size.large, data).subscribe(
            (result) => {
                result.forEach(item => {
                    if (this.checkDuplicateAdd(item) != false) {
                        this.Securities.push(this.createSecuritiesForm(item as Securities));
                    }
                });
            });
    }

    createSecuritiesForm(item: Securities): FormGroup {
        const fg = this.fb.group({
            CustomerSecuritiesId: null,
            SecuritiesCode: null,
            CustomerCode: null,
            SecuritiesType: null,
            Description: null,
            EstimateAmount: null,
            LoanLimitAmount: null,
            Active: true,
            SecuritiesImage: null,
            CategoryNameTha: null,
            CategoryNameEng: null,
            StatusTracking: null,
            ContractNo: null,
            RowVersion: 0,
            RowState: RowState.Add
        });
        fg.patchValue(item, { emitEvent: false });
        fg.valueChanges.subscribe(
            (control) => {
                if (control.RowState === 'N') {
                    fg.controls.RowState.setValue(RowState.Edit, { emitEvent: false });
                }
            }
        );
        this.attachmentFiles.push(new Attachment());
        return fg;
    }

    removeSecurities(index) {
        const Securities = this.Securities.at(index) as FormGroup;
        if (Securities.controls.RowState.value !== RowState.Add) {
            Securities.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
            this.contactSecuritiesDeleting.push(Securities.getRawValue());
        }

        const rows = [...this.Securities.getRawValue()];
        rows.splice(index, 1);

        this.Securities.patchValue(rows, { emitEvent: false });
        this.Securities.removeAt(this.Securities.length - 1);
        this.customerForm.markAsDirty();
    }

    handleImage(webcamImage: WebcamImage): void {
        const imgWeb = { DataUrl: webcamImage.imageAsDataUrl, Name: 'imgCard2.jpg', Uploaded: false };
        this.customerForm.controls.ProfileWebcam.setValue(imgWeb);
        this.imgWebcamera = webcamImage.imageAsDataUrl;
        this.showImg = 3;
    }

    triggerSnapshot(): void {
        this.trigger.next();
    }

    get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    get nextWebcamObservable(): Observable<boolean | string> {
        return this.nextWebcam.asObservable();
    }

    toggleWebcam(): void {
        this.switching = true;
        const time = 2 * 1000;
        this.showImg = 2
        setTimeout(() => {
            this.switching = false;
        }, time);
    }

    closeWebcam(): void {
        this.switching = true;
        const time = 2 * 1000;
        this.showImg = 1
        setTimeout(() => {
            this.switching = false;
        }, time);
    }

    public showNextWebcam(directionOrDeviceId: boolean | string): void {
        this.switching = true;
        this.nextWebcam.next(directionOrDeviceId);
        this.switching = false;
    }

    onChangeOtherFlag() {
        if (this.customerForm.controls.OtherFlag.value) {
            this.customerForm.controls.OtherRemark.setValidators([Validators.required]);
            this.customerForm.controls.OtherRemark.enable();
        } else {
            this.customerForm.controls.OtherRemark.setValue(null);
            this.customerForm.controls.OtherRemark.clearValidators();
            this.customerForm.controls.OtherRemark.disable();
        }
    }

    onChangeBlacklistStatus() {
        if (this.customerForm.controls.BlacklistStatus.value) {
            this.customerForm.controls.BlacklistRemark.setValidators([Validators.required]);
            this.customerForm.controls.BlacklistRemark.enable();

            this.customerForm.controls.IdCard.clearValidators();
            if (this.customerForm.controls.IdCard.value) {
                this.customerForm.controls.IdCard.setValue(this.customerForm.controls.IdCard.value);
            } else {
                this.customerForm.controls.IdCard.setValue(null);
            }
        } else {
            this.customerForm.controls.BlacklistRemark.clearValidators();
            this.customerForm.controls.BlacklistRemark.setValue(null);
            this.customerForm.controls.BlacklistRemark.disable();

            this.customerForm.controls.IdCard.setValidators([Validators.required]);
            if (this.customerForm.controls.IdCard.value) {
                if (this.customerForm.controls.IdCard.value.length === 13) {
                    if (!this.checkDigit(this.customerForm.controls.IdCard.value)) {
                        return this.customerForm.controls.IdCard.setErrors({ invalid: true });
                    }
                } else if (this.customerForm.controls.IdCard.value.length < 13) {
                    if (this.customerForm.controls.IdCard.value.length === 10) {
                        if (!this.validateTIN(this.customerForm.controls.IdCard.value)) {
                            return this.customerForm.controls.IdCard.setErrors({ invalid: true });
                        }
                    } else {
                        return this.customerForm.controls.IdCard.setErrors({ minlength: true });
                    }
                }
            } else {
                this.customerForm.controls.IdCard.setValue(null);
            }
        }
    }

    onChangeCopytoCerrent() {
        this.currentDistrict = this.district;
        this.currentSubDistrict = this.subDistrict;
        this.currentPostCode = this.zipcodeList;
        this.bindDropDownCurrentDistrict(true);
        this.bindDropDownCurrentSubDistrict(true);
        this.bindDropDownCurrentZipcode(true);
        const id = this.addressCurrentForm.controls.AddressId.value ? this.addressCurrentForm.controls.AddressId.value : null
        const version = this.addressCurrentForm.controls.RowVersion.value ? this.addressCurrentForm.controls.RowVersion.value : null
        const replaces = this.addressCurrentForm.controls.Replaces.value;
        if (replaces) {
            if (this.addressCardForm.getRawValue()) {
                this.addressCurrentForm.patchValue(this.addressCardForm.getRawValue());
                this.addressCurrentForm.controls.AddressType.setValue("1");
                this.addressCurrentForm.controls.Replaces.setValue(replaces);
                if (id) {
                    this.addressCurrentForm.controls.RowVersion.setValue(version);
                    this.addressCurrentForm.controls.AddressId.setValue(id);
                }
                this.addressCurrentForm.disable();
                this.addressCurrentForm.controls.Replaces.enable();
            }
        } else {
            this.addressCurrentForm.reset();
            this.addressCurrentForm.enable();
            this.addressCurrentForm.controls.Replaces.setValue(replaces);
            this.addressCurrentForm.controls.AddressType.setValue("1");
            this.addressCurrentForm.controls.DistrictId.disable();
            this.addressCurrentForm.controls.SubDistrictId.disable();
            if (id) {
                this.addressCurrentForm.controls.RowVersion.setValue(version);
                this.addressCurrentForm.controls.AddressId.setValue(id);
            }
        }
    }

    onChangeCopytoWorkplace() {
        this.workDistrict = this.district;
        this.workSubDistrict = this.subDistrict;
        this.workPostCode = this.zipcodeList;
        this.bindDropDownWorkDistrict(true);
        this.bindDropDownWorkSubDistrict(true);
        this.bindDropDownWorkZipcode(true);
        const id = this.addressWorkForm.controls.AddressId.value ? this.addressWorkForm.controls.AddressId.value : null
        const version = this.addressWorkForm.controls.RowVersion.value ? this.addressWorkForm.controls.RowVersion.value : null
        const replaces = this.addressWorkForm.controls.Replaces.value;
        if (replaces) {
            if (this.addressCardForm.getRawValue()) {
                this.addressWorkForm.patchValue(this.addressCardForm.getRawValue());
                this.addressWorkForm.controls.Replaces.setValue(replaces);
                this.addressWorkForm.controls.AddressType.setValue("3");
                if (id) {
                    this.addressWorkForm.controls.RowVersion.setValue(version);
                    this.addressWorkForm.controls.AddressId.setValue(id);
                }
                this.addressWorkForm.disable();
                this.addressWorkForm.controls.Replaces.enable();
            }
        } else {
            this.addressWorkForm.reset();
            this.addressWorkForm.enable();
            this.addressWorkForm.controls.Replaces.setValue(replaces);
            this.addressWorkForm.controls.AddressType.setValue("3");
            this.addressWorkForm.controls.DistrictId.disable();
            this.addressWorkForm.controls.SubDistrictId.disable();
            if (id) {
                this.addressWorkForm.controls.RowVersion.setValue(version);
                this.addressWorkForm.controls.AddressId.setValue(id);
            }
        }
    }

    onReplacesCerrent() {
        const replaces = this.addressCurrentForm.controls.Replaces.value;
        if (replaces) {
            this.addressCurrentForm.disable();
            this.addressCurrentForm.controls.Replaces.enable();
        }
    }

    onReplacesWorkplace() {
        const replaces = this.addressWorkForm.controls.Replaces.value;
        if (replaces) {
            this.addressWorkForm.disable();
            this.addressWorkForm.controls.Replaces.enable();
        }
    }

    validateSecurities() {
        let seen = new Set();
        let hasDuplicates = this.Securities.getRawValue().some(function (item) {
            seen.add(item.SecuritiesCode.toLowerCase()).size;
            return seen.size > 0 ? true : false;
        });
        return hasDuplicates;
    }

    validatePhoneNumber() {
        let seen = new Set();
        let hasDuplicates = this.PhoneNumber.getRawValue().some(function (item) {
            seen.add(item.MobileNumber.toLowerCase()).size;
            return seen.size > 0 ? true : false;
        });
        return hasDuplicates;
    }

    prepareSave(customerForm, bankAccountForm, workplaceForm, securitieFrom
        , contactFrom, phonNumberFrom, addressCurrnForm, addressCardForm, addressWorkForm, customerBorrowerForm, customerAttachment) {
        Object.assign(this.customerDetail, customerForm);
        // this.customerDetail.GradeCustomer = this.customerDetail.Credit;
        Object.assign(this.customerBankAccount, bankAccountForm);
        this.customerDetail.CustomerBankAccount = [this.customerBankAccount];
        Object.assign(this.customerWorkplace, workplaceForm);
        this.customerDetail.CustomerWorkplace = [this.customerWorkplace];
        Object.assign(this.customerAddress, addressCurrnForm);
        Object.assign(this.customerCardAddress, addressCardForm);
        Object.assign(this.customerWorkAddress, addressWorkForm);
        if (this.customerForm.controls.ProfileImage.value) {
            this.customerDetail.ProfileImage = this.customerForm.controls.ProfileImage.value.DataUrl
        }
        if (this.customerForm.controls.ProfileWebcam.value) {
            this.customerDetail.ProfileWebcam = this.customerForm.controls.ProfileWebcam.value.DataUrl
        }

        this.customerDetail.CustomerAddress = [this.customerAddress, this.customerCardAddress, this.customerWorkAddress];

        this.customerDetail.Securities.map(security => {
            return Object.assign(security, securitieFrom.concat(this.contactSecuritiesDeleting).find((o) => {
                return o.CustomerSecuritiesId === security.CustomerSecuritiesId && o.SecuritiesCode === security.SecuritiesCode
                    && o.SecuritiesType === security.SecuritiesType && o.Description === security.Description;
            }));
        });
        const securitiesAdding = securitieFrom.filter(function (item) {
            return item.rowState === RowState.Add;
        });

        this.customerDetail.Securities = this.customerDetail.Securities.concat(securitiesAdding);
        this.customerDetail.Securities = this.customerDetail.Securities.concat(this.contactSecuritiesDeleting);
        this.contactSecuritiesDeleting = [];

        this.customerDetail.ContactPersons.map(contact => {
            return Object.assign(contact, contactFrom.concat(this.contactPersonDeleting).find((o) => {
                return o.ContactId === contact.ContactId && o.CustomerCode === contact.CustomerCode
                    && o.FirstName === contact.FirstName && o.LastName === contact.LastName
                    && o.MobileNo === contact.MobileNo;
            }));
        });
        const contactAdding = contactFrom.filter(function (item) {
            return item.rowState === RowState.Add;
        });

        this.customerDetail.ContactPersons = this.customerDetail.ContactPersons.concat(contactAdding);
        this.customerDetail.ContactPersons = this.customerDetail.ContactPersons.concat(this.contactPersonDeleting);
        this.contactPersonDeleting = [];

        this.customerDetail.PhoneNumber.map(phon => {
            return Object.assign(phon, phonNumberFrom.concat(this.phoneNumberDeleting).find((o) => {
                return o.MobileId === phon.MobileId && o.MobileNumber === phon.MobileNumber;
            }));
        });
        const phonNumberAdding = phonNumberFrom.filter(function (item) {
            return item.rowState === RowState.Add;
        });

        this.customerDetail.PhoneNumber = this.customerDetail.PhoneNumber.concat(phonNumberAdding);
        this.customerDetail.PhoneNumber = this.customerDetail.PhoneNumber.concat(this.phoneNumberDeleting);
        this.phoneNumberDeleting = [];

        // ---------------------------
        this.customerDetail.CustomerBorrower.map(br => {
            return Object.assign(br, customerBorrowerForm.concat(this.customerBorrowerdeleting).find((o) => {
                return o.CustomerBorrowerId === br.CustomerBorrowerId && o.CustomerBorrowerCode === br.CustomerBorrowerCode;
            }));
        });

        const addingBorrowers = customerBorrowerForm.filter(function (item) {
            return item.RowState == RowState.Add;
        });

        // delete
        // this.customerDetail.CustomerBorrower = this.customerDetail.CustomerBorrower.concat(addingBorrowers);
        this.customerDetail.CustomerBorrower = this.customerDetail.CustomerBorrower.concat(this.customerBorrowerdeleting);
        this.customerBorrowerdeleting = [];



        // -----------------------------------------------------contractAttachments--------------------------------------------------------
        //add
        const adding = customerAttachment.filter(function (item) {
            return item.rowState == RowState.Add;
        });
        //edit ถ่ายค่าให้เฉพาะที่โดนแก้ไข โดย find ด้วย pk ของ table
        this.customerDetail.CustomerAttachment.map(phon => {
            return Object.assign(phon, customerAttachment.concat(this.customerAttachmentDeleting).find((o) => {
                return o.CustomerAttachmentId === phon.CustomerAttachmentId;
            }));
        });

        this.customerDetail.CustomerAttachment = this.customerDetail.CustomerAttachment.concat(adding);
        this.customerDetail.CustomerAttachment = this.customerDetail.CustomerAttachment.concat(this.customerAttachmentDeleting);
        this.customerAttachmentDeleting = [];
    }

    canDeactivate(): Observable<boolean> | boolean {
        if (this.customerForm.dirty || this.bankAccountForm.dirty || this.addressCurrentForm.dirty || this.addressCardForm.dirty || this.addressWorkForm.dirty || this.workplaceForm.dirty) {
            return this.modal.confirm('Message.STD00002');
        }
        return true;
    }

    validatePermissionIsDefault() {
        const hasIsDefault = this.PhoneNumber.getRawValue().some(function (item) {
            return item.Default == true;
        });
        return hasIsDefault;
    }

    onSubmit(edit) {
        const customer = {
            PrefixId: ['Label.LOTS01.Prefix'],
            FirstName: ['Label.LOTS01.FristName'],
            LastName: ['Label.LOTS01.LastName'],
            FirstNameEn: ['Label.LOTS01.FristNameEn'],
            LastNameEn: ['Label.LOTS01.LastNameEn'],
            Birthday: ['Label.LOTS01.BirthDay'],
            IdCard: ['Label.LOTS01.CardId'],
            DateIssue: ['Label.LOTS01.CardIssuance'],
            DateExpiry: ['Label.LOTS01.CardExpiration'],
            ProfileImage: ['Label.LOTS01.Img'],
            MaritalStatus: ['Label.LOTS01.State'],
            Career: ['Label.LOTS01.GroupOfCareers'],
            Gender: ['Label.LOTS01.Gender'],
            GroupOfCareer: ['Label.LOTS01.GroupOfCareers'],
            IncomeRange: ['Label.LOTS01.IncomeRange'],
            MobileNumber: ['Label.LOTS01.PhoneNumber'],
            MobileDescription: ['Label.LOTS01.Detail'],
            BlacklistRemark: ['Label.LOTS01.CauseBlacklist'],
        }

        const addressCurrenta = {
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

        const accountNoCard = {
            BankCode: ['Label.LOTS01.BankName'],
            AccountNo: ['Label.LOTS01.AccountNumber'],
            BankBranch: ['Label.LOTS01.Branch'],
            AccountName: ['Label.LOTS01.AccountName'],
            BankAccountTypeCode: ['Label.LOTS01.DepositType'],
        }

        this.submitted = true;
        if (this.customerForm.controls.BlacklistStatus.value && this.customerForm.controls.CreatedProgram.value == null) {
            if (this.customerForm.invalid
                || this.addressCurrentForm.invalid
                || this.addressCardForm.invalid
            ) {
                this.focusToggle = !this.focusToggle;
                Object.keys(this.customerForm.controls).forEach(
                    (key) => {
                        if (this.customerForm.controls[key].invalid) {
                            if (key == 'PhoneNumber') {
                                this.as.warning('', 'Message.LO00030', ['Message.LO00045']);
                            } else {
                                this.as.warning('', 'Message.LO00030', customer[key]);
                            }
                        }
                    });

                Object.keys(this.addressCurrentForm.controls).forEach(
                    (key) => {
                        if (this.addressCurrentForm.controls[key].invalid) {
                            this.as.warning('', 'Message.LO00031', [addressCurrenta[key], 'Label.LOTS01.CurrentAddress']);
                        }
                    });

                Object.keys(this.addressCardForm.controls).forEach(
                    (key) => {
                        if (this.addressCardForm.controls[key].invalid) {
                            this.as.warning('', 'Message.LO00031', [addressCard[key], 'Label.LOTS01.CardAddress']);
                        }
                    });

                return;
            }

        } else {
            if (this.customerForm.invalid
                || this.addressCurrentForm.invalid
                || this.addressCardForm.invalid
                || (this.customerForm.controls.ProfileImage.value == null &&
                    this.customerForm.controls.ProfileWebcam.value == null)
                || this.bankAccountForm.invalid
            ) {
                this.focusToggle = !this.focusToggle;
                Object.keys(this.customerForm.controls).forEach(
                    (key) => {
                        if (this.customerForm.controls[key].invalid) {
                            if (key == 'PhoneNumber') {
                                this.as.warning('', 'Message.LO00030', ['Message.LO00045']);
                            } else if (key == 'CustomerAttachment') {
                                this.as.warning('', 'Message.LO00030', ['เอกสารแนบสำหรับ บัญชีธนาคาร']);
                            } else {
                                this.as.warning('', 'Message.LO00030', customer[key]);
                            }
                        }
                    });

                Object.keys(this.addressCurrentForm.controls).forEach(
                    (key) => {
                        if (this.addressCurrentForm.controls[key].invalid) {
                            this.as.warning('', 'Message.LO00031', [addressCurrenta[key], 'Label.LOTS01.CurrentAddress']);
                        }
                    });

                Object.keys(this.addressCardForm.controls).forEach(
                    (key) => {
                        if (this.addressCardForm.controls[key].invalid) {
                            this.as.warning('', 'Message.LO00031', [addressCard[key], 'Label.LOTS01.CardAddress']);
                        }
                    });

                if (this.customerForm.controls.ProfileImage.value == null && this.customerForm.controls.ProfileWebcam.value == null) {
                    this.as.warning('', 'Message.LO00046');
                }

                Object.keys(this.bankAccountForm.controls).forEach(
                    (key) => {
                        if (this.bankAccountForm.controls[key].invalid) {
                            this.as.warning('', 'Message.LO00030', accountNoCard[key]);
                        }
                    });

                return;
            }

            if (this.ageCustomermer < 20) {
                this.as.warning('', 'Message.LO00047');
                return;
            }

            if (!this.validatePhoneNumber()) {
                this.as.warning('', 'Message.STD00012', ['Message.LO00048']);
                return;
            }

            if (!this.validatePermissionIsDefault()) {
                this.as.warning('', 'Message.LO00049');
                return;
            }

            // if (!this.validateSecurities()) {
            //   this.as.error('', 'Message.STD00012', ['Label.LOTS01.SecuritiesInformation']);
            //   return;
            // }

            if (!this.customerForm.controls.VerifyFace.value) {
                this.as.warning('', 'Message.LO00026');
                return;
            }

            if (this.customerForm.controls.VerifyName.value == false && this.customerForm.controls.VerifyDate.value == false) {
                this.as.warning('', 'Message.LO00026');
                return;
            }

            if (this.CustomerAttachment.getRawValue().length <= 0) {
                this.as.warning('', 'ต้องมีเอกสารแนบ Book Bank อย่างน้อย 1 รายการ');
                return;
            }
        }

        this.prepareSave(this.customerForm.getRawValue(), this.bankAccountForm.value
            , this.workplaceForm.value, this.Securities.getRawValue(), this.ContactPersons.getRawValue(), this.PhoneNumber.getRawValue(), this.addressCurrentForm.getRawValue()
            , this.addressCardForm.getRawValue(), this.addressWorkForm.getRawValue(), this.CustomerBorrower.getRawValue(), this.CustomerAttachment.getRawValue());

        this.lots01Service.searchIdCard(this.customerDetail.IdCard, this.customerDetail.CustomerCode).pipe(
            finalize(() => {
                // this.saving = false;
                // this.submitted = false;
            }))
            .subscribe(
                (res) => {
                    if (res == 0) {
                        this.lots01Service.searchName(this.customerDetail.FirstName, this.customerDetail.LastName, this.customerDetail.CustomerCode).pipe(
                            finalize(() => { }))
                            .subscribe(
                                (res) => {
                                    if (res == 0) {
                                        if (this.customerDetail.CreatedProgram == null) {
                                            this.openCheckToMgm(edit);
                                        } else {
                                            this.saving = true;

                                            this.lots01Service.saveCustomer(this.customerDetail, this.imageFile, this.attachmentFile, this.attachmentFiles).pipe(
                                                finalize(() => {
                                                    this.saving = false;
                                                    this.submitted = false;
                                                }))
                                                .subscribe(
                                                    (res) => {
                                                        if (res != null) {
                                                            this.customerDetail = res;
                                                            this.flageSaveOnly = true;
                                                            this.rebuildForm();
                                                            this.clearDirty();
                                                            if (this.customerDetail.CustomerCode != null) {
                                                                this.searchPhoneNumber(this.customerDetail.CustomerCode);
                                                            }
                                                            if (this.checkModal) {
                                                                this.closeEdit(true);
                                                            }
                                                            // this.checkId = true;

                                                            this.onChangeDefaultPhoneNumber();

                                                            this.as.success('', 'Message.STD00006');
                                                        } else {
                                                            // this.checkId = false;
                                                        }
                                                    }
                                                );
                                        }
                                    } else {
                                        this.as.warning('', 'ชื่อและนามสกุล มีค่าซ้ำ');
                                    }
                                }
                            );
                    } else {
                        this.as.warning('', 'Message.LO00050');
                    }
                }
            );
    }

    onSetChkMgm(flag) {
        this.customerForm.controls.FlagSendToMgm.setValue(flag);
        this.closeCheckToMgm(true);


        this.saving = true;
        this.prepareSave(this.customerForm.getRawValue(), this.bankAccountForm.value
            , this.workplaceForm.value, this.Securities.getRawValue(), this.ContactPersons.getRawValue(), this.PhoneNumber.getRawValue(), this.addressCurrentForm.getRawValue()
            , this.addressCardForm.getRawValue(), this.addressWorkForm.getRawValue(), this.CustomerBorrower.getRawValue(), this.CustomerAttachment.getRawValue());

        this.lots01Service.saveCustomer(this.customerDetail, this.imageFile, this.attachmentFile, this.attachmentFiles).pipe(
            finalize(() => {
                this.saving = false;
                this.submitted = false;
            }))
            .subscribe(
                (res) => {
                    if (res != null) {
                        this.customerDetail = res;
                        this.flageSaveOnly = true;
                        this.rebuildForm();
                        this.clearDirty();
                        if (this.customerDetail.CustomerCode != null) {
                            this.searchPhoneNumber(this.customerDetail.CustomerCode);
                        }
                        if (this.checkModal) {
                            this.closeEdit(true);
                        }
                        this.checkId = true;

                        this.onChangeDefaultPhoneNumber();

                        this.as.success('', 'Message.STD00006');
                    } else {
                        this.checkId = false;
                        this.as.warning('', 'Message.LO00050');
                    }
                }
            );
    }

    clearDirty() {
        this.customerForm.markAsPristine();
        this.bankAccountForm.markAsPristine();
        this.addressCurrentForm.markAsPristine();
        this.addressCardForm.markAsPristine();
        this.addressWorkForm.markAsPristine();
        this.workplaceForm.markAsPristine();
    }

    addSecur(values) {
        const adding = values.Securities.filter((item) => {
            return item.RowState === RowState.Add;
        });
        this.customerDetail.Securities = this.customerDetail.Securities.concat(adding);
        this.contactSecuritiesDeleting = [];
    }

    addContact(values) {
        const adding = values.ContactPersons.filter((item) => {
            return item.RowState === RowState.Add;
        });
        this.customerDetail.ContactPersons = this.customerDetail.ContactPersons.concat(adding);
        this.contactPersonDeleting = [];
    }

    checkDistrict(fromgroup: FormGroup) {
        if (fromgroup.controls.DistrictId.value) {
            fromgroup.controls.DistrictId.enable();
            this.checkSubDistrict(fromgroup);
        } else {
            fromgroup.controls.DistrictId.disable();
            fromgroup.controls.SubDistrictId.disable();
        }
    }

    checkSubDistrict(fromgroup: FormGroup) {
        if (this.customerCardAddress.SubDistrictId) {
            fromgroup.controls.SubDistrictId.enable();
        } else {
            fromgroup.controls.SubDistrictId.disable();
        }
    }

    bindDropDownIncomeRange(filter?: boolean) {
        if (filter) {
            if (this.customerForm.controls.IncomeRange.value) {
                this.IncomeRange = this.filter.FilterActiveByValue(this.master.IncomeRange, this.customerForm.controls.PrefixId.value);
            } else {
                this.IncomeRange = this.filter.FilterActive(this.master.IncomeRange);
            }
        }
        this.IncomeRangeList = [...this.IncomeRange];
        return;
    }

    bindDropDownGroupOfCureer(filter?: boolean) {
        if (filter) {
            if (this.customerForm.controls.GroupOfCareer.value) {
                this.GroupOfCareer = this.filter.FilterActiveByValue(this.master.GroupOfCareer, this.customerForm.controls.PrefixId.value);
            } else {
                this.GroupOfCareer = this.filter.FilterActive(this.master.GroupOfCareer);
            }
        }
        this.filter.SortByLang(this.GroupOfCareer);
        this.GroupOfCareerList = [...this.GroupOfCareer];
        return;
    }

    bindDropDownPrefix(filter?: boolean) {
        if (filter) {
            if (this.customerForm.controls.PrefixId.value) {
                this.prefix = this.filter.FilterActiveByValue(this.master.PrefixList, this.customerForm.controls.PrefixId.value);
            } else {
                this.prefix = this.filter.FilterActive(this.master.PrefixList);
            }
        }
        this.filter.SortByLang(this.prefix);
        this.prefixList = [...this.prefix];
        return;
    }


    bindDropDownGender(filter?: boolean) {
        if (filter) {
            if (this.customerForm.controls.Gender.value) {
                this.genderData = this.filter.FilterActiveByValue(this.master.GenderList, this.customerForm.controls.Gender.value);
            } else {
                this.genderData = this.filter.FilterActive(this.master.GenderList);
            }
        }
        this.filter.SortByLang(this.genderData);
        this.genderList = [...this.genderData];
        return;
    }

    bindDropDownNationality(filter?: boolean) {
        if (filter) {
            if (this.customerForm.controls.Nationality.value) {
                this.nationality = this.filter.FilterActiveByValue(this.master.NationalityList, this.customerForm.controls.Nationality.value);
            } else {
                this.nationality = this.filter.FilterActive(this.master.NationalityList);
            }
        }
        this.filter.SortByLang(this.nationality);
        this.nationalityList = [...this.nationality];
        return;
    }

    bindDropDownRace(filter?: boolean) {
        if (filter) {
            if (this.customerForm.controls.Race.value) {
                this.raceData = this.filter.FilterActiveByValue(this.master.Race, this.customerForm.controls.Race.value);
            } else {
                this.raceData = this.filter.FilterActive(this.master.Race);
            }
        }
        this.filter.SortByLang(this.raceData);
        this.race = [...this.raceData];
        return;
    }

    bindDropDownReligion(filter?: boolean) {
        if (filter) {
            if (this.customerForm.controls.Religion.value) {
                this.religion = this.filter.FilterActiveByValue(this.master.ReligionList, this.customerForm.controls.Religion.value);
            } else {
                this.religion = this.filter.FilterActive(this.master.ReligionList);
            }
        }
        this.filter.SortByLang(this.religion);
        this.religionList = [...this.religion];
        return;
    }

    bindDropDownMaritalStatus(filter?: boolean) {
        if (filter) {
            if (this.customerForm.controls.MaritalStatus.value) {
                this.maritalStatus = this.filter.FilterActiveByValue(this.master.MaritalStatusList, this.customerForm.controls.MaritalStatus.value);
            } else {
                this.maritalStatus = this.filter.FilterActive(this.master.MaritalStatusList);
            }
        }
        this.filter.SortByLang(this.maritalStatus);
        this.maritalStatusList = [...this.maritalStatus];
        return;
    }

    bindDropDownBank(filter?: boolean) {
        if (filter) {
            if (this.bankAccountForm.controls.BankCode.value) {
                this.bank = this.filter.FilterActiveByValue(this.master.BankList, this.bankAccountForm.controls.BankCode.value);
            } else {
                this.bank = this.filter.FilterActive(this.master.BankList);
            }
        }
        this.filter.SortByLang(this.bank);
        this.bankList = [...this.bank];
        return;
    }

    bindDropDownAccountType(filter?: boolean) {
        if (filter) {
            if (this.bankAccountForm.controls.BankAccountTypeCode.value) {
                this.bankAccountType = this.filter.FilterActiveByValue(this.master.BankAccountTypeList, this.bankAccountForm.controls.BankAccountTypeCode.value);
            } else {
                this.bankAccountType = this.filter.FilterActive(this.master.BankAccountTypeList);
            }
        }
        this.filter.SortByLang(this.bankAccountType);
        this.bankAccountTypeList = [...this.bankAccountType];
        return;
    }

    bindDropDownProvince(filter?: boolean) {
        if (filter) {
            if (this.addressCardForm.controls.ProvinceId.value) {
                this.provinceData = this.filter.FilterActiveByValue(this.master.ProvinceList, this.addressCardForm.controls.ProvinceId.value);
            } else {
                this.provinceData = this.filter.FilterActive(this.master.ProvinceList);
            }
        }
        this.filter.SortByLang(this.provinceData);
        this.province = [...this.provinceData];
        return;
    }

    bindDropDownDistrict(filter?: boolean) {
        if (filter) {
            if (this.addressCardForm.controls.DistrictId.value) {
                this.districtSelect = this.filter.FilterActiveByValue(this.district, this.addressCardForm.controls.DistrictId.value);
            } else {
                this.districtSelect = this.filter.FilterActive(this.district);
            }
        }
        this.filter.SortByLang(this.districtSelect);
        this.districtData = [...this.districtSelect];
        return;
    }

    bindDropDownSubDistrict(filter?: boolean) {
        if (filter) {
            if (this.addressCardForm.controls.SubDistrictId.value) {
                this.subDistrictSelect = this.filter.FilterActiveByValue(this.subDistrict, this.addressCardForm.controls.SubDistrictId.value);
            } else {
                this.subDistrictSelect = this.filter.FilterActive(this.subDistrict);
            }
        }
        this.filter.SortByLang(this.subDistrictSelect);
        this.subDistrictData = [...this.subDistrictSelect];
        return;
    }

    bindDropDownZipcodeList(filter?: boolean) {
        if (filter) {
            if (this.addressCardForm.controls.ZipCode.value) {
                this.zipcode = this.filter.FilterActiveByValue(this.zipcodeList, this.addressCardForm.controls.ZipCode.value);
            } else {
                this.zipcode = this.filter.FilterActive(this.zipcodeList);
            }
        }
        this.filter.SortByLang(this.zipcode);
        this.zipcodedata = [...this.zipcode];
        return;
    }

    bindDropDownCurrentDistrict(filter?: boolean) {
        if (filter) {
            if (this.addressCurrentForm.controls.DistrictId.value) {
                this.currentDistrictSelect = this.filter.FilterActiveByValue(this.currentDistrict, this.addressCurrentForm.controls.DistrictId.value);
            } else {
                this.currentDistrictSelect = this.filter.FilterActive(this.currentDistrict);
            }
        }
        this.filter.SortByLang(this.currentDistrictSelect);
        this.currentDistrictData = [...this.currentDistrictSelect];
        return;
    }

    bindDropDownCurrentSubDistrict(filter?: boolean) {
        if (filter) {
            if (this.addressCurrentForm.controls.SubDistrictId.value) {
                this.currentSubDistrictSelect = this.filter.FilterActiveByValue(this.currentSubDistrict, this.addressCurrentForm.controls.SubDistrictId.value);
            } else {
                this.currentSubDistrictSelect = this.filter.FilterActive(this.currentSubDistrict);
            }
        }
        this.filter.SortByLang(this.currentSubDistrictSelect);
        this.currentSubDistrictData = [...this.currentSubDistrictSelect];
        return;
    }

    bindDropDownCurrentZipcode(filter?: boolean) {
        if (filter) {
            if (this.addressCurrentForm.controls.ZipCode.value) {
                this.currentPostCodeSelect = this.filter.FilterActiveByValue(this.currentPostCode, this.addressCurrentForm.controls.ZipCode.value);
            } else {
                this.currentPostCodeSelect = this.filter.FilterActive(this.currentPostCode);
            }
        }
        this.filter.SortByLang(this.currentPostCodeSelect);
        this.currentPostCodeData = [...this.currentPostCodeSelect];
        return;
    }

    bindDropDownWorkDistrict(filter?: boolean) {
        if (filter) {
            if (this.addressWorkForm.controls.DistrictId.value) {
                this.workDistrictSelect = this.filter.FilterActiveByValue(this.workDistrict, this.addressWorkForm.controls.DistrictId.value);
            } else {
                this.workDistrictSelect = this.filter.FilterActive(this.workDistrict);
            }
        }
        this.filter.SortByLang(this.workDistrictSelect);
        this.workDistrictData = [...this.workDistrictSelect];
        return;
    }

    bindDropDownWorkSubDistrict(filter?: boolean) {
        if (filter) {
            if (this.addressWorkForm.controls.SubDistrictId.value) {
                this.workSubDistrictSelect = this.filter.FilterActiveByValue(this.workSubDistrict, this.addressWorkForm.controls.SubDistrictId.value);
            } else {
                this.workSubDistrictSelect = this.filter.FilterActive(this.workSubDistrict);
            }
        }
        this.filter.SortByLang(this.workSubDistrictSelect);
        this.workSubDistrictData = [...this.workSubDistrictSelect];
        return;
    }

    bindDropDownWorkZipcode(filter?: boolean) {
        if (filter) {
            if (this.addressWorkForm.controls.ZipCode.value) {
                this.workPostCodeSelect = this.filter.FilterActiveByValue(this.workPostCode, this.addressWorkForm.controls.ZipCode.value);
            } else {
                this.workPostCodeSelect = this.filter.FilterActive(this.workPostCode);
            }
        }
        this.filter.SortByLang(this.workPostCodeSelect);
        this.workPostCodeData = [...this.workPostCodeSelect];
        return;
    }

    changeProvince(fromgroup: FormGroup) {
        this.districtData = [];
        fromgroup.controls.DistrictId.setValue(null);
        this.subDistrictData = [];
        fromgroup.controls.SubDistrictId.setValue(null);
        fromgroup.controls.SubDistrictId.disable();
        this.districtData = this.district.filter(data => data.ProvinceId === fromgroup.controls.ProvinceId.value);
        if (this.districtData.length > 0) {
            fromgroup.controls.DistrictId.enable();
        } else {
            fromgroup.controls.DistrictId.disable();
        }
    }

    changeDistrict(fromgroup: FormGroup) {
        this.subDistrictData = [];
        fromgroup.controls.SubDistrictId.setValue(null);
        this.subDistrictData = this.subDistrict.filter(data => data.DistrictId === fromgroup.controls.DistrictId.value);
        if (this.subDistrictData.length > 0) {
            fromgroup.controls.SubDistrictId.enable();
        } else {
            fromgroup.controls.SubDistrictId.disable();
        }
    }

    searchContract(customerCode, ContractType) {
        this.loadingContract = true;
        this.lots01Service.getContract(customerCode, ContractType, this.pageContractHead)
            .pipe(finalize(() => { this.loadingContract = false; }))
            .subscribe(
                (res: any) => {
                    this.sumTotal1();
                    this.contractHead = res.Rows;
                    this.countContract = res.Rows.length ? res.Total : 0;
                });
    }

    searcBorrower(customerCode) {
        this.loadingBorrower = true;
        this.lots01Service.getBorrower(customerCode, this.pageBorrower)
            .pipe(finalize(() => { this.loadingBorrower = false; }))
            .subscribe(
                (res: any) => {
                    this.contractBorrower = res.Rows;
                    this.countBorrower = res.Rows.length ? res.Total : 0;
                });
    }

    searchGuarantor(customerCode) {
        this.loadingGuarantor = true;
        this.lots01Service.getGuarantor(customerCode, this.pageGuarantor)
            .pipe(finalize(() => { this.loadingGuarantor = false; }))
            .subscribe(
                (res: any) => {
                    this.contractGuarantor = res.Rows;
                    this.countGuarantor = res.Rows.length ? res.Total : 0;
                });
    }

    onEventContract(event) {
        this.pageContractHead = event;
        this.searchContract(this.customerDetail.CustomerCode, this.customerForm.controls.ContractType.value);
    }

    onEventBorrower(event) {
        this.pageBorrower = event;
        this.searcBorrower(this.customerDetail.CustomerCode);
    }

    onEventGuarantor(event) {
        this.pageGuarantor = event;
        this.searchGuarantor(this.customerDetail.CustomerCode);
    }

    onChangeSubCountry(event, fromgroup: FormGroup) {
        this.districtsCard = null;
        if (event) {
            fromgroup.controls.DistrictId.setValue(null);
            fromgroup.controls.SubDistrictId.setValue(null);
            fromgroup.controls.ZipCode.setValue(null);
            this.loadCityList(event.Value, fromgroup);
            this.loadZipcodeList(event.Value, fromgroup);
        } else {
            fromgroup.controls.DistrictId.setValue(null);
            fromgroup.controls.DistrictId.disable();
            fromgroup.controls.SubDistrictId.setValue(null);
            fromgroup.controls.SubDistrictId.disable();
            fromgroup.controls.ZipCode.setValue(null);
            fromgroup.controls.ZipCode.disable();
        }
    }

    loadCityList(provinceId, fromgroup: FormGroup) {
        this.lots01Service.getDistrict(provinceId).pipe(finalize(() => { })).subscribe(
            (res) => {
                this.filter.SortByLang(res.DistrictList);

                if (fromgroup == this.addressCardForm) {
                    this.district = res.DistrictList;
                    this.districtData = res.DistrictList;
                    this.bindDropDownDistrict(true);
                } else if (fromgroup == this.addressCurrentForm) {
                    this.currentDistrict = res.DistrictList;
                    this.bindDropDownCurrentDistrict(true);
                } else if (fromgroup == this.addressWorkForm) {
                    this.workDistrict = res.DistrictList;
                    this.bindDropDownWorkDistrict(true);
                }

                fromgroup.controls.DistrictId.enable();
                if (fromgroup.controls.Replaces.value) {
                    fromgroup.controls.DistrictId.disable();
                }

                if (this.districtsCard != null) {
                    this.districtData.forEach(element => {
                        if (element.TextTha === this.districtsCard) {
                            this.addressCardForm.controls.DistrictId.setValue(element.Value);
                            this.addressCardForm.controls.DistrictId.enable();
                            this.loadSubCityList(element.Value, this.addressCardForm)
                        } else {
                            this.addressCardForm.controls.SubDistrictId.disable();
                        }
                    });
                }
            });
    }

    onChangeCity(event, fromgroup: FormGroup) {
        this.subDistrictsCard = null;
        if (event) {
            fromgroup.controls.SubDistrictId.setValue(null);
            fromgroup.controls.ZipCode.setValue(null);
            this.loadSubCityList(event.Value, fromgroup);
        } else {
            fromgroup.controls.SubDistrictId.setValue(null);
            fromgroup.controls.SubDistrictId.disable();
            fromgroup.controls.ZipCode.setValue(null);
            fromgroup.controls.ZipCode.disable();
        }
    }

    loadSubCityList(districtId, fromgroup: FormGroup) {
        this.lots01Service.getSubDistrict(districtId).pipe(finalize(() => { })).subscribe(
            (res) => {
                this.filter.SortByLang(res.SubDistrictList);

                if (fromgroup == this.addressCardForm) {
                    this.subDistrict = res.SubDistrictList;
                    this.subDistrictData = res.SubDistrictList;
                    this.bindDropDownSubDistrict(true);
                } else if (fromgroup == this.addressCurrentForm) {
                    this.currentSubDistrict = res.SubDistrictList;
                    this.bindDropDownCurrentSubDistrict(true);
                } else if (fromgroup == this.addressWorkForm) {
                    this.workSubDistrict = res.SubDistrictList;
                    this.bindDropDownWorkSubDistrict(true);
                }

                fromgroup.controls.SubDistrictId.enable();
                if (fromgroup.controls.Replaces.value) {
                    fromgroup.controls.SubDistrictId.disable();
                }

                if (this.subDistrictsCard != null) {
                    this.subDistrict.forEach(element => {
                        if (element.TextTha === this.subDistrictsCard) {
                            this.addressCardForm.controls.SubDistrictId.setValue(element.Value);
                            this.addressCardForm.controls.SubDistrictId.enable();
                        }
                    });
                }
            });
    }

    loadZipcodeList(subDistrictId, fromgroup: FormGroup) {
        this.lots01Service.getZipcode(subDistrictId).pipe(finalize(() => { })).subscribe(
            (res) => {
                this.filter.SortByLang(res.ZipcodeList);

                if (fromgroup == this.addressCardForm) {
                    this.zipcodeList = res.ZipcodeList;
                    this.bindDropDownZipcodeList(true);
                } else if (fromgroup == this.addressCurrentForm) {
                    this.currentPostCode = res.ZipcodeList;
                    this.bindDropDownCurrentZipcode(true);
                } else if (fromgroup == this.addressWorkForm) {
                    this.workPostCode = res.ZipcodeList;
                    this.bindDropDownWorkZipcode(true);
                }

                fromgroup.controls.ZipCode.enable();
                if (fromgroup.controls.Replaces.value) {
                    fromgroup.controls.ZipCode.disable();
                }
            });
    }

    sumTotal1() {
        return this.contractHead.length > 0 ? this.contractHead.map(row => row.AppLoanPrincipleAmount)
            .reduce((res, cell) => res += cell, 0) : 0;
    }

    sumTotal2() {
        return this.contractHead.reduce((res, cell) => null, 0);
    }

    closeEdit(flag) {
        if (flag) {
            this.checkModal = false;
            this.modalEdit.hide();
        }
    }

    openCheckToMgm(edit) {
        this.checkModal = true;
        this.modalEdit = this.modal.open(edit, Size.medium);
    }

    closeCheckToMgm(flag) {
        if (flag) {
            this.checkModal = false;
            this.modalEdit.hide();
        }
    }

    onEventPhone(event) {
        this.countPhoneList = event;
        this.searchPhoneNumber(this.customerDetail.CustomerCode);
    }

    searchPhoneNumber(customerCode) {
        this.loadingPhoneList = true;
        this.lots01Service.getPhone(customerCode, this.pagePhone)
            .pipe(finalize(() => { this.loadingPhoneList = false; }))
            .subscribe(
                (res: any) => {
                    this.phoneList = res.Rows;
                    this.countPhoneList = res.Rows.length ? res.Total : 0;
                });
    }

    chkIdCard() {
        //false ยกเลิกการซ่อน
        this.saveLog.LogSystem = 'LO';
        this.saveLog.LogDiscription = 'ขอดูข้อมูลบัตรประชาชน จากหน้า ลูกค้า/สมาชิก ของ ลูกค้า/สมาชิก เลขที่ ' + this.customerForm.controls.CustomerCode.value + ': ' + this.customerForm.controls.FirstName.value + ' ' + this.customerForm.controls.LastName.value;
        this.saveLog.LogItemGroupCode = 'SaveLog';
        this.saveLog.LogItemCode = '1';
        this.saveLog.LogProgram = 'LOTS01';
        this.saveLog.CustomerCode = this.customerForm.controls.CustomerCode.value;
        this.saveLog.CustomerName = this.customerForm.controls.FirstName.value + ' ' + this.customerForm.controls.LastName.value;
        this.saveLog.ContractHeadId = null;

        this.lots01Service.saveLog(this.saveLog).pipe(
            finalize(() => { })
        ).subscribe((res) => {
            this.checkId = false;
            if (this.customerDetail.CustomerCode != null) {
                this.customerForm.controls.IdCard.disable();

            }
        });
    }

    onRemoveImg(fileName: string) {
        this.customerForm.controls.ProfileWebcam.setValue(null, { emitEvent: false });
    }

    onRemoveImgWeb(fileName: string) {
        this.customerForm.controls.ProfileImage.setValue(null, { emitEvent: false });
    }

    checkDigit(value) {
        let checkSum = 0;
        let result = 0;
        for (let i = 0; i < value.length - 1; i++) {
            checkSum = checkSum + (Number(value[i]) * (value.length - i));
        }
        result = (11 - (checkSum % 11)) % 10;
        return result === Number(value[12]);
    }

    validateTIN(TIN: string): boolean {
        const regex = /^\d{10}$/;
        return regex.test(TIN);
    }

    toLots13(SecuritiesCode, event) {
        if (event.which == 3) {
            const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots13/detail', { SecuritiesCode: SecuritiesCode, backToPage: '/lo/lots01' }], { skipLocationChange: true }));
            window.open(url, '_blank');
        }
    }

    toLots03(id, event) {
        if (event.which == 3) {
            const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots01' }], { skipLocationChange: true }));
            window.open(url, '_blank');
        }
    }

    prename(id): string {
        if (id) {
            const data = this.prefixList.find(data => data.Value == id)
            return data.TextTha;
        }
    }

    getPhone(phone): string {
        if (phone) {
            var res = phone.substr(6, 9);
            return 'xxxxxx' + res;
        }
    }

    get FirstNameEn() {
        return this.customerForm.controls.FirstNameEn;
    }

    get LastNameEn() {
        return this.customerForm.controls.LastNameEn;
    }

    onChangeDefaultPhoneNumber() {
        try {
            const phoneNumberList = this.customerDetail.PhoneNumber as PhoneNumberVerify[];
            if (phoneNumberList) {
                phoneNumberList.map((data, i) => {
                    if (data.Default) this.customerForm.controls.ConfirmPhoneNumber.setValue(data.MobileNumber);
                });
            }
        } catch (e) {
        }
    }

    checkIsNullOrWhiteSpace = (value) => {
        if (value == undefined) return true;
        if (value == null) return true;
        if (value.trim() == '') return true;
        return false;
    }

    getRefToken: boolean = false;
    requestOTPProcessing: boolean = false;

    callOTP() {
        this.requestOTPProcessing = true;
        const idCard = this.customerForm.controls.IdCard.value;
        if (null == this.customerForm.controls.ConfirmPhoneNumber.value) {
            this.as.warning('', 'กรุณาบันทึกข้อมูล ก่อนทำการขอOTP');
            return;
        }

        // if (this.checkIsNullOrWhiteSpace(idCard)) {
        //     this.as.warning('', 'กรุณากรอกเลขบัตรประชาชน');
        //     return false;
        // }

        const firstNameEn = this.customerForm.controls.FirstNameEn.value;
        const lastNameEn = this.customerForm.controls.LastNameEn.value;

        // if (this.checkIsNullOrWhiteSpace(firstNameEn) || this.checkIsNullOrWhiteSpace(lastNameEn)) {
        //     this.as.warning('', 'กรุณากรอกชื่อ - นามสกุล ภาษาอังกฤษ');
        //     return false;
        // }

        let phoneNumber = this.customerForm.controls.ConfirmPhoneNumber.value;
        let CustomerCode = this.customerDetail.CustomerCode;
        this.startCountdown(CustomerCode, phoneNumber, firstNameEn, lastNameEn, idCard);
        // this.lots01Service.request(CustomerCode, phoneNumber, firstNameEn, lastNameEn, idCard).pipe(
        //     tap((res: any) => {

        //     var resJSON = JSON.parse(res)
        //     console.log(resJSON)
        //     this.refTokenOTP = resJSON.responseRefToken;
        //     if(null != this.refTokenOTP) this.getRefToken = true;
        //     if(resJSON.response!="1"){
        //         throw this.as.error('', resJSON.message);
        //     }else if(resJSON.checkUserData != "pass")
        //         throw this.as.error('', resJSON.checkUserDataMessage);
        //     }
        //     ),
        //     finalize(() => { })
        // ).subscribe((res: any) => {
        //     this.checkSignatureRealTime()
        // });
    }

    endTimmer: boolean = false;
    findSign: boolean = false;
    AfterRequestOTP: boolean = false;
    UserIsVerified: boolean = false;

    checkSignature(): string {
        const userTel = this.customerForm.controls.ConfirmPhoneNumber.value;
        var base64Str = "";
        this.lots01Service.checkSignature(userTel).pipe(
            finalize(() => { })
        ).subscribe((response: any) => {
            if ("" != response && null !== response) {
                base64Str = response;
                this.customerForm.controls.SignatureImage.setValue(base64Str);
                this.findSign = true;
                this.AfterRequestOTP = true;
            }
        });
        return base64Str;
    }

    checkSignatureRealTime() {
        this.endTimmer = true;
        this.findSign = false;

        timer(300000).subscribe(() => { this.endTimmer = false; });

        const userTel = this.customerForm.controls.ConfirmPhoneNumber.value;
        this.application.pipe(
            switchMap(() => timer(3000, 3000).pipe(
                concatMap(() => this.lots01Service.checkSignature(userTel)),//เรียก service
                map((response: string) => { return response; })//ค่าที่ return กลับมา
            ).pipe(
                filter(data => (data !== "" && null !== data) || this.endTimmer === false) //เช็คถ้าเข้าเงื่อนไขที่ต้องการ จะหลุด loop ออกมา
            ).pipe(take(1)))
        ).subscribe((response) => {  //การกระทำเมื่อพ่น loop ออกมา
            if ("" != response && null !== response) {
                this.customerForm.controls.SignatureImage.setValue(response);
                this.findSign = true;
                this.AfterRequestOTP = true;
                this.requestOTPProcessing = false;
            }
            this.endTimmer = false;
        })
    }

    confirmSign() {
        const userTel = this.customerForm.controls.ConfirmPhoneNumber.value;
        this.lots01Service.confirmSign(this.customerDetail, userTel).pipe(
            finalize(() => { })
        ).subscribe((res: any) => {
            if (res == "Save Success") {
                this.checkUserVerify();
                this.as.success('', 'Message.STD00006');
            } else {
                this.as.error('', 'ดำเนินการไม่สำเร็จ');
            }
        });
    }

    clearSign() {
        const userTel = this.customerForm.controls.ConfirmPhoneNumber.value;
        this.customerForm.controls.SignatureImage.setValue(null);
        this.lots01Service.clearSign(userTel).pipe(
            finalize(() => { })
        ).subscribe((res: any) => {
            if (res == "Save Success") {
                this.findSign = true;
                this.as.success('', 'Message.STD00006');
            } else {
                this.findSign = false;
                this.as.error('', 'ดำเนินการไม่สำเร็จ');
            }
        });
    }

    checkUserVerify() {
        const userTel = this.customerForm.controls.ConfirmPhoneNumber.value;
        this.lots01Service.checkUserVerify(userTel).pipe(
            finalize(() => { })
        ).subscribe((response: any) => {
            if ("" != response && null !== response) {
                this.findSign = true;

                this.UserIsVerified = response == 'IsVerified';
            }
        });
    }

    addBorrower() {
        this.modal.openComponent(Lots01BorrowerLookupComponent, Size.large, { CustomerMain: this.customerForm.controls.CustomerCode.value, IsRefinance: false }).subscribe(
            (result) => {
                result.forEach(element => {
                    if (element.CustomerBorrowerCode) {
                        this.CustomerBorrower.push(this.createCustomerBorrowerForm(element));
                        this.CustomerBorrower.markAsDirty();
                    }
                });
            }
        )
    }

    removeRowBorrower(index) {
        let detail = this.CustomerBorrower.at(index) as FormGroup;

        if (detail.controls.RowState.value !== RowState.Add) {
            detail.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
            this.customerBorrowerdeleting.push(detail.getRawValue());
        }

        let rows = [...this.CustomerBorrower.value];
        rows.splice(index, 1);

        this.CustomerBorrower.patchValue(rows, { emitEvent: false });
        this.CustomerBorrower.removeAt(this.CustomerBorrower.length - 1);
        this.CustomerBorrower.markAsDirty();
    }

    initMap(): void {
        //map1
        setTimeout(() => {
            let map: any
            const input = document.getElementById("pac-input") as HTMLInputElement;

            if (!this.customerForm.controls.Lat.value && !this.customerForm.controls.Lng.value) {
                map = new google.maps.Map(
                    document.getElementById("map") as HTMLElement,
                    {
                        zoom: 9,
                        center: { lat: 15.8700, lng: 100.9925 },
                    }
                );
            } else {
                map = new google.maps.Map(
                    document.getElementById("map") as HTMLElement,
                    {
                        zoom: 18,
                        center: { lat: this.customerForm.controls.Lat.value, lng: this.customerForm.controls.Lng.value },
                    }
                );
            }

            map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

            if (!this.flageSaveOnly) {
                const searchBox = new google.maps.places.SearchBox(input);
                map.addListener("bounds_changed", () => {
                    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
                });

                searchBox.addListener("places_changed", () => {
                    const places = searchBox.getPlaces();

                    if (places.length == 0) {
                        return;
                    } else {
                        // Clear out the old markers.
                        this.markers.forEach((marker) => {
                            marker.setMap(null);
                        });
                        this.markers = [];

                        // For each place, get the icon, name and location.
                        const bounds = new google.maps.LatLngBounds();

                        places.forEach((place) => {
                            if (!place.geometry || !place.geometry.location) {
                                console.log("Returned place contains no geometry");
                                return;
                            }

                            // Create a marker for each place.
                            this.markers.push(
                                new google.maps.Marker({
                                    map,
                                    //   icon,
                                    title: place.name,
                                    position: place.geometry.location,
                                })
                            );

                            this.customerForm.controls.Lat.setValue(place.geometry.location.lat());
                            this.customerForm.controls.Lng.setValue(place.geometry.location.lng());

                            if (place.geometry.viewport) {
                                // Only geocodes have viewport.
                                bounds.union(place.geometry.viewport);
                            } else {
                                bounds.extend(place.geometry.location);
                            }
                        });
                        map.fitBounds(bounds);
                    }
                });
            }

            map.addListener("click", (e) => {
                this.placeMarkerAndPanTo(e.latLng, map);
            });
            this.placeMarkerAndPanToFromRebuild(map);
        }, 100);
    }

    initMapCurrent(): void {
        // setTimeout(() => {
        // let map: any
        // const input2 = document.getElementById("pac-input-current") as HTMLInputElement;
        // const searchBox2 = new google.maps.places.SearchBox(input2);

        // if (!this.customerForm.controls.LatCurrent.value && !this.customerForm.controls.LngCurrent.value) {
        //     map = new google.maps.Map(
        //         document.getElementById("map-current") as HTMLElement,
        //         {
        //             zoom: 9,
        //             center: { lat: 15.8700, lng: 100.9925 },
        //         }
        //     );
        // } else {
        //     map = new google.maps.Map(
        //         document.getElementById("map-current") as HTMLElement,
        //         {
        //             zoom: 18,
        //             center: { lat: this.customerForm.controls.LatCurrent.value, lng: this.customerForm.controls.LngCurrent.value },
        //         }
        //     );
        // }

        // map.controls[google.maps.ControlPosition.TOP_CENTER].push(input2);
        // map.addListener("bounds_changed", () => {
        //     searchBox2.setBounds(map.getBounds() as google.maps.LatLngBounds);
        // });

        // searchBox2.addListener("places_changed", () => {
        //     const places = searchBox2.getPlaces();

        //     if (places.length == 0) {
        //         return;
        //     } else {
        //         // Clear out the old markers.
        //         this.markersCurrent.forEach((marker) => {
        //             marker.setMap(null);
        //         });
        //         this.markersCurrent = [];

        //         // For each place, get the icon, name and location.
        //         const bounds = new google.maps.LatLngBounds();

        //         places.forEach((place) => {
        //             if (!place.geometry || !place.geometry.location) {
        //                 console.log("Returned place contains no geometry");
        //                 return;
        //             }

        //             // Create a marker for each place.
        //             this.markersCurrent.push(
        //                 new google.maps.Marker({
        //                     map,
        //                     //   icon,
        //                     title: place.name,
        //                     position: place.geometry.location,
        //                 })
        //             );

        //             this.customerForm.controls.LatCurrent.setValue(place.geometry.location.lat());
        //             this.customerForm.controls.LngCurrent.setValue(place.geometry.location.lng());

        //             if (place.geometry.viewport) {
        //                 // Only geocodes have viewport.
        //                 bounds.union(place.geometry.viewport);
        //             } else {
        //                 bounds.extend(place.geometry.location);
        //             }
        //         });
        //         map.fitBounds(bounds);
        //     }
        // });

        // map.addListener("click", (e) => {
        //     this.placeMarkerAndPanToCurrent(e.latLng, map);
        // });
        // this.placeMarkerAndPanToFromRebuildCurrent(map);
        // }, 100);
    }

    placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
        this.deleteMarkers();
        const marker = new google.maps.Marker({
            position: latLng,
            map: map,
        });
        const maplink = "https://www.google.com/maps/search/?api=1&query=" + latLng;

        marker.addListener("click", () => {
            window.open(maplink)
        });
        this.customerForm.controls.Lat.setValue(latLng.lat());
        this.customerForm.controls.Lng.setValue(latLng.lng());
        this.markers.push(marker);
    }

    deleteMarkers(): void {
        this.setMapOnAll(null);
        this.markers = [];
    }

    setMapOnAll(map: google.maps.Map | null) {
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    }

    placeMarkerAndPanToFromRebuild(map: google.maps.Map) {
        if (this.customerForm.controls.Lat.value && this.customerForm.controls.Lng.value) {
            this.deleteMarkers();
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.customerForm.controls.Lat.value, this.customerForm.controls.Lng.value),
                map: map
            });
            const maplink = "https://www.google.com/maps/search/?api=1&query=" + marker.getPosition();

            marker.addListener("click", () => {
                window.open(maplink)
            });
            this.markers.push(marker);
        }

    }

    placeMarkerAndPanToCurrent(latLng: google.maps.LatLng, map: google.maps.Map) {
        this.deleteMarkersCurrent();
        const marker = new google.maps.Marker({
            position: latLng,
            map: map,
        });
        const maplink = "https://www.google.com/maps/search/?api=1&query=" + latLng;

        marker.addListener("click", () => {
            window.open(maplink)
        });
        this.customerForm.controls.LatCurrent.setValue(latLng.lat());
        this.customerForm.controls.LngCurrent.setValue(latLng.lng());
        this.markersCurrent.push(marker);
    }

    deleteMarkersCurrent(): void {
        this.setMapOnAllCurrent(null);
        this.markersCurrent = [];
    }

    setMapOnAllCurrent(map: google.maps.Map | null) {
        for (let i = 0; i < this.markersCurrent.length; i++) {
            this.markersCurrent[i].setMap(map);
        }
    }

    placeMarkerAndPanToFromRebuildCurrent(map: google.maps.Map) {
        if (this.customerForm.controls.LatCurrent.value && this.customerForm.controls.LngCurrent.value) {
            this.deleteMarkersCurrent();
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.customerForm.controls.LatCurrent.value, this.customerForm.controls.LngCurrent.value),
                map: map
            });
            const maplink = "https://www.google.com/maps/search/?api=1&query=" + marker.getPosition();

            marker.addListener("click", () => {
                window.open(maplink)
            });
            this.markersCurrent.push(marker);
        }

    }

    CustomerAttachmentForm(item: CustomerAttachment): FormGroup {
        let fg = this.fb.group({
            CustomerAttachmentId: 0,
            CustomerCode: null,
            FileName: null,
            AttahmentId: [null, Validators.required],
            Description: null,
            RowVersion: null,
            Active: true,
            IsDisableAttachment: true,
            RowState: RowState.Add,
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

    get CustomerAttachment(): FormArray {
        return this.customerForm.get('CustomerAttachment') as FormArray;
    }

    addAttachment() {
        this.CustomerAttachment.markAsDirty();
        this.CustomerAttachment.push(this.CustomerAttachmentForm({} as CustomerAttachment));
    }

    fileNameReturn(filename, index) {
        let form = this.CustomerAttachment.controls[index] as FormGroup;
        form.controls.FileName.setValue(filename);
    }

    removeAttachment(index) {
        const customerAttachment = this.CustomerAttachment.at(index) as FormGroup;
        if (customerAttachment.controls.RowState.value !== RowState.Add) {

            customerAttachment.controls.RowState.setValue(RowState.Delete, { emitEvent: false });
            this.customerAttachmentDeleting.push(customerAttachment.getRawValue());
        }

        const rows = [...this.CustomerAttachment.getRawValue()];
        rows.splice(index, 1);

        this.CustomerAttachment.patchValue(rows, { emitEvent: false });
        this.CustomerAttachment.removeAt(this.CustomerAttachment.length - 1);
        this.CustomerAttachment.markAsDirty();

        this.checkCustmerAttachment();
    }

    checkCustmerAttachment() {
        this.CustomerAttachment.enable();
        for (let i = 0; i < this.CustomerAttachment.length; i++) {
            let form = this.CustomerAttachment.controls[i] as FormGroup;
            if (form.controls.CustomerAttachmentId.value != 0) {
                form.controls.AttahmentId.disable({ emitEvent: false });
                form.controls.Description.disable({ emitEvent: false });
            }
        }
    }

    startCountdown(CustomerCode, phoneNumber, firstNameEn, lastNameEn, idCard) {
        console.log(" Into seconds ");
        let counter;// = seconds;
        this.countDownDisplay = '00:00';
        this.lots01Service.getCountDownTime().pipe(
            finalize(() => { })
        ).subscribe((res: any) => {
            console.log(res);
            counter = parseInt(res.response);
            const interval = setInterval(() => {
                console.log(counter);
                --counter;
                const minutes: number = Math.floor(counter / 60);
                this.countDownDisplay = ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(counter - minutes * 60)).slice(-2)

                if (counter == 0) {
                    this.requestOTPProcessing = false;
                    return true;
                }
                if (counter < 0) {
                    clearInterval(interval);
                }
            }, 1000);

            //call OTP
            this.lots01Service.request(CustomerCode, phoneNumber, firstNameEn, lastNameEn, idCard).pipe(
                tap((res: any) => {

                    var resJSON = JSON.parse(res)
                    console.log(resJSON)
                    this.refTokenOTP = resJSON.responseRefToken;
                    if (null != this.refTokenOTP) this.getRefToken = true;
                    if (resJSON.response != "1") {
                        throw this.as.error('', resJSON.message);
                    } else if (resJSON.checkUserData != "pass")
                        throw this.as.error('', resJSON.checkUserDataMessage);
                }
                ),
                finalize(() => { })
            ).subscribe((res: any) => {
                this.checkSignatureRealTime()
            });

        });
    }

    searchCustomerCourtHistory() {
        this.lots01Service.getCustomerCourtHistory(this.customerDetail.CustomerCode, this.pageCustomerCourtHistory)
            .subscribe(
                (res: any) => {
                    this.customerCourtHistory = res.Rows;
                    this.countCustomerCourtHistory = res.Rows.length ? res.Total : 0;

                });
    }

    onTableEventCustomerCourtHistory(event) {
        this.pageCustomerCourtHistory = event;
        this.searchCustomerCourtHistory();
    }

    searchCustomerCreditGradeHistory() {
        this.lots01Service.getCustomerCreditGradeHistory(this.customerDetail.CustomerCode, this.pageCustomerCreditGradeHistory)
            .subscribe(
                (res: any) => {
                    this.customerCreditGradeHistory = res.Rows;
                    this.countCustomerCreditGradeHistory = res.Rows.length ? res.Total : 0;

                });
    }

    onTableEventCustomerCreditGradeHistory(event) {
        this.pageCustomerCreditGradeHistory = event;
        this.searchCustomerCreditGradeHistory();
    }

    searchCustomerBranchComment() {
        this.lots01Service.getCustomerBranchComment(this.customerDetail.CustomerCode, this.pageCustomerBranchComment)
            .subscribe(
                (res: any) => {
                    this.customerBranchComment = res.Rows;
                    this.countCustomerBranchComment = res.Rows.length ? res.Total : 0;

                });
    }

    onTableEventCustomerBranchComment(event) {
        this.pageCustomerBranchComment = event;
        this.searchCustomerBranchComment();
    }
}

