import { Component, OnInit, ViewChild, TemplateRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ApproveLoanService, ApproveLoan } from './approve_loan.service';
import { ModalService, ImageFile, Guid } from '@app/shared';
import { AlertService, LangService, SaveDataService, } from '@app/core';
import { Image, PlainGalleryConfig, GridLayout, PlainGalleryStrategy, ButtonEvent, ButtonType, ButtonsConfig, ButtonsStrategy, GalleryService, ImageModalEvent } from '@ks89/angular-modal-gallery';
import { NgxImageCompressService } from 'ngx-image-compress';
import { LoadingService } from '@app/core/loading.service';
import * as Buffer from 'buffer';
import * as moment from 'moment';

//For line application.
declare var liff: any;

@Component({
  templateUrl: './approve_loan.component.html'
})
export class ApproveLoanComponent implements OnInit {
  @ViewChild('gallery') gallery;
  approveLoanForm: FormGroup;
  approveLoan: ApproveLoan = {} as ApproveLoan;
  line: string;
  userId: string;
  Email: string;
  data: any;
  srcImg: any;
  submitted: boolean;
  saving: boolean;
  show: boolean = false;
  userProfile: any;
  isDisable: boolean = false;
  focusToggle: boolean;
  fileRender = [];
  imgResultAfterCompress: string;
  images: Image[] = []
  arrayImage: Image[] = [];
  imagesToSave: any[] = [];
  imageFiles: ImageFile = new ImageFile();
  assetTypeDDL = [];
  imageIndex = 1;
  galleryId = 1;
  now = new Date();

  imagesExample: Image[] = [
    new Image(0, {
      img: 'https://pueantae-bucket-s3.s3-ap-southeast-1.amazonaws.com/Image/PreApprove/PreApproveExample/card5.jpg',
    }),
    new Image(1, {
      img: 'https://pueantae-bucket-s3.s3-ap-southeast-1.amazonaws.com/Image/PreApprove/PreApproveExample/car.jpg',
    }),
    new Image(2, {
      img: 'https://pueantae-bucket-s3.s3-ap-southeast-1.amazonaws.com/Image/PreApprove/PreApproveExample/home.jpg',
    }),
  ];

  constructor(
    private fb: FormBuilder,
    private approveLoanService: ApproveLoanService,
    private as: AlertService,
    private imageCompress: NgxImageCompressService,
    private ls: LoadingService,
    private route: ActivatedRoute,
    private galleryService: GalleryService,
    private renderer: Renderer2
  ) {
    this.createForm();
    this.initLineLiff();
  }

  async initLineLiff() {
    try {
      this.data = await this.approveLoanService.initLineLiff();
      this.userProfile = await liff.getProfile();
      this.userId = this.userProfile.userId;
    } catch (err) {
      alert(err)
    }
  }

  createForm() {
    this.approveLoanForm = this.fb.group({
      Name: [null, Validators.required],
      MobileNo: [null, Validators.required],
    //   UserLineId: 'Ue074ef16e3ea59a852268d4fd1d50f1b',
      UserLineId: null,
      ImageName: null,
      Email: null,
      Career: [null, Validators.required],
      LoanAmount: [null, Validators.required],
      CreditType: [null, Validators.required],
      StatusContact: false,
      ImageAssetFile: null,
      Age: [null, Validators.required]
    });
  }

  async ngOnInit() {
    await this.initLineLiff();
    this.approveLoanForm.controls.UserLineId.setValue(this.userId);
    this.route.data.subscribe((data) => {
      this.assetTypeDDL = data.LOTS02.loanTypeDDL.LoanTypesDto;
    });
    this.approveLoanForm.controls.CreditType.setValue(this.assetTypeDDL[0].Value);
  }

  onRemove(fileName: string) {
    this.approveLoan.ImageAssetDeleting = fileName;
  }

  prepareSave() {
    this.approveLoan.PrefixId = null;
    const name = this.approveLoanForm.controls.Name.value.split(' ');
    this.approveLoan.FirstName = name[0];
    if (name[1] == undefined || name[1] == null) {
      this.approveLoan.LastName = '';
    } else {
      this.approveLoan.LastName = name[1];
    }

    this.approveLoan.MobileNo = this.approveLoanForm.controls.MobileNo.value;
    this.approveLoan.UserLineId = this.approveLoanForm.controls.UserLineId.value;
    // this.approveLoan.UserLineId = 'Ue074ef16e3ea59a852268d4fd1d50f1b';
    this.approveLoan.Career = this.approveLoanForm.controls.Career.value;
    this.approveLoan.LoanAmount = this.approveLoanForm.controls.LoanAmount.value;
    this.approveLoan.SecuritiesCategoryId = this.approveLoanForm.controls.CreditType.value;
    this.approveLoan.StatusContact = this.approveLoanForm.controls.StatusContact.value;
    // this.approveLoan.BirthDate = this.approveLoanForm.controls.BirthDate.value;
    this.approveLoan.Age = this.approveLoanForm.controls.Age.value;
  }

  plainExample: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.GRID,
    layout: new GridLayout({ width: '0px', height: '0px' }, { length: 3, wrap: true })
  };

  plainGalleryGrid: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.GRID,
    layout: new GridLayout({ width: '80px', height: '80px' }, { length: 3, wrap: true })
  };

  onButtonAfterHook(event: ButtonEvent) {
    if (!event || !event.button) {
      return;
    }

    if (event.button.type === ButtonType.DELETE) {
      this.approveLoanForm.controls.ImageAssetFile.setValue(null);
      this.images = this.images.filter((val: Image) => event.image && val.id !== event.image.id);
      this.arrayImage = this.arrayImage.filter((val: Image) => event.image && val.id !== event.image.id);
      this.imagesToSave = this.imagesToSave.filter((val: ImageFile) => event.image && val.Name !== event.image.modal.description);
    }
  }

  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'fas fa-trash-alt white',
        type: ButtonType.DELETE,
        fontSize: '30px'
      }, {
        className: 'fas fa-times white',
        type: ButtonType.CLOSE,
        fontSize: '30px'
      }
    ]
  };

  onSave() {
    this.submitted = true;
    if (this.approveLoanForm.invalid || this.imagesToSave.length == 0) {
      this.as.error('กรุณากรอกข้อมูลให้ถูกต้อง', 'ข้อมูลไม่ถูกต้อง');
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.approveLoanForm.disable();
    this.prepareSave(/*this.approveLoanForm.value*/);
    this.saving = true;
    this.approveLoanService.saveApproveLoan(this.approveLoan, this.imagesToSave).pipe(
      finalize(() => {
        this.approveLoanForm.enable();
        this.approveLoanForm.controls.UserLineId.disable();
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: any) => {
        if (res) {
          this.as.success('บันทึกข้อมูลสำเร็จ', 'สำเร็จ');
          liff.closeWindow()
        }
      }, (error) => {
        this.as.warning('กรุณาอัพโหลดรูปใหม่ เนื่องจากมีขนาดใหญ่เกินไป ', 'แจ้งเตือน')
      }
      );
  }

  onClick(input: HTMLElement) {
    if (!this.isDisable) {
      input.click();
    }
  }

  openModalViaService(id: number | undefined, index: number) {
    this.galleryService.openGallery(id, index);
  }

  calculateAge(dateOfBirth: any) {
    const today = new Date();
    var result = {
      years: 0,
      months: 0,
      days: 0,
      toString: function () {
        return (this.years ? this.years + ' ปี ' : '')
          + (this.months ? this.months + ' เดือน ' : '')
          + (this.days ? this.days + ' วัน ' : '');
      }
    }

    result.months = ((today.getFullYear() * 12) + (today.getMonth() + 1))
      - ((dateOfBirth.getFullYear() * 12) + (dateOfBirth.getMonth() + 1));

    if (0 > (result.days = today.getDate() - dateOfBirth.getDate())) {
      var y = today.getFullYear(),
        m = today.getMonth();
      m = (--m < 0) ? 11 : m;
      result.days += [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m]
        + (((1 == m) && ((y % 4) == 0) && (((y % 100) > 0) || ((y % 400) == 0)))
          ? 1 : 0);
      --result.months;
    }
    result.years = (result.months - (result.months % 12)) / 12;
    result.months = (result.months % 12);

    return result;
  }

  async onFileChange(event) {
    await this.uploadFile(event.target.files);
  }

  async uploadFile(files: File[]) {
    let file = files[0];
    if (file != undefined) {
      let dataUrl = file.type.includes("svg") ? "assets/img/svg-dummy.svg" : await this.getUrl(file);
      this.ls.show();
      this.imageCompress.compressFile(dataUrl, 0, 50, 50).then(
        result => {
          this.imgResultAfterCompress = result;
          let imgName = '';
          let imageSave = null;
          imgName = Guid.newGuid().toString() + '.' + file.name.split('?')[0].split('.').pop();;
          imageSave = this.dataURLtoFile(this.imgResultAfterCompress, imgName);
          let index = this.arrayImage.length + 1
          this.arrayImage.push(new Image(index, {
            img: result,
            description: imgName,
          }));
          this.images = this.arrayImage.slice();
          this.imageFiles = new ImageFile();
          this.imageFiles.File = imageSave;
          this.imageFiles.Name = imgName;
          this.imagesToSave.push(this.imageFiles);
          this.ls.hide();
        }
      );
    }
  }

  getUrl(file): Promise<any> {
    return new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (event: any) => {
        let url = event.target.result;
        resolve(url);
      }
      fileReader.readAsDataURL(file)
    })
  }

  getContent(file): Promise<any> {
    return new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (event: any) => {
        let buffer = event.target.result;
        const byte = Buffer.Buffer.from(buffer);
        resolve(byte);
      }
      fileReader.readAsArrayBuffer(file)
    })
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
