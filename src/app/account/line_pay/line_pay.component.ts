import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { LinePayService, LinePay } from './line_pay.service';
import { ImageFile, Guid } from '@app/shared';
import { AlertService, LangService } from '@app/core';
import { Image, PlainGalleryConfig, GridLayout, PlainGalleryStrategy, ButtonEvent, ButtonType, ButtonsConfig, ButtonsStrategy, GalleryService } from '@ks89/angular-modal-gallery';
import { NgxImageCompressService } from 'ngx-image-compress';
import { LoadingService } from '@app/core/loading.service';
import * as Buffer from 'buffer';

//For line application.
declare var liff: any;

@Component({
  templateUrl: './line_pay.component.html'
})
export class LinePayComponent implements OnInit {

  @ViewChild('gallery') gallery;
  linePayForm: FormGroup;
  ContractHeadFrom: FormGroup;
  linePay: LinePay = {} as LinePay;
  line: string;
  userId: string;
  data: any;
  srcImg: any;
  submitted: boolean;
  saving: boolean;
  show: boolean = false;
  userProfile: any;
  isDisable: boolean = false;
  focusToggle: boolean;
  imgResultAfterCompress: string;
  images: Image[] = []
  arrayImage: Image[] = [];
  imagesToSave: any[] = [];
  imageFiles: ImageFile = new ImageFile();
  getlinePay = [];
  getConreactDDL = [];

  constructor(
    private fb: FormBuilder,
    private linePayService: LinePayService,
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

  createForm() {
    this.linePayForm = this.fb.group({
      // LineUserId: 'Ue074ef16e3ea59a852268d4fd1d50f1b',
      LineUserId: null,
      FirstName: null,
      ContractNo: null,
      Period: null,
      TotalAmount: null,
      DueDate: null,
      ImageName: null,
      SlipImageFile: null,
    });
    this.ContractHeadFrom = this.fb.group({
      ContractHeadId: null
    });
  }

  async initLineLiff() {
    try {
      this.data = await this.linePayService.initLineLiff();
      this.userProfile = await liff.getProfile();
      this.userId = this.userProfile.userId;
    } catch (err) {
      alert(err);
    }
  }

  async ngOnInit() {
    await this.initLineLiff();
    this.linePayForm.controls.LineUserId.setValue(this.userId);
    this.searchContract();
    this.rebuildForm();
  }

  searchContract() {
    this.linePayService.getContractList(this.linePayForm.controls.LineUserId.value).pipe(
      finalize(() => {
        this.submitted = false;
      }))
      .subscribe(
        (res: any) => {
          this.getConreactDDL = res.ContractHeadList;
        }, (error) => {
          console.log(error);
        });
  }

  searchLinePay() {
    this.linePayForm.reset();
    this.linePay = {} as LinePay;
    if (this.ContractHeadFrom.controls.ContractHeadId.value) {
      this.linePayService.getLinePay(this.ContractHeadFrom.controls.ContractHeadId.value).pipe(
        finalize(() => {
          this.submitted = false;
          this.linePayForm.markAsPristine();
          this.linePayForm.patchValue(this.linePay);
        }))
        .subscribe(
          (res: any) => {
            if (res.Rows.length > 0) {
              this.linePay = res.Rows[0];
            }
          }, (error) => {
            console.log(error);
          });
    }
  }

  rebuildForm() {
    this.linePayForm.controls.FirstName.disable();
    this.linePayForm.controls.Period.disable();
    this.linePayForm.controls.TotalAmount.disable();
    this.linePayForm.controls.DueDate.disable();
  }

  plainGalleryGrid: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.GRID,
    layout: new GridLayout({ width: '80px', height: '80px' }, { length: 3, wrap: true })
  };

  onButtonAfterHook(event: ButtonEvent) {
    if (!event || !event.button) {
      return;
    }

    if (event.button.type === ButtonType.DELETE) {
      this.linePayForm.controls.SlipImageFile.setValue(null);
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

  onRemove(fileName: string) {
    this.linePay.SlipImageDeleting = fileName;
  }

  // prepareSave() {
  //   this.linePay.LineUserId = this.linePayForm.controls.LineUserId.value;
  //   this.linePay.FirstName = this.linePayForm.controls.FirstName.value;
  //   this.linePay.Period = this.linePayForm.controls.Period.value;
  //   this.linePay.TotalAmount = this.linePayForm.controls.TotalAmount.value;
  //   this.linePay.DueDate = this.linePayForm.controls.DueDate.value;
  // }

  onSave() {
    this.submitted = true;
    if (this.linePay.FirstName == null) {
      this.as.warning('', 'ไม่มียอดค้างชำระ');
      return;
    }
    if (this.linePayForm.invalid || this.imagesToSave.length == 0) {
      this.as.warning('', 'กรอกข้อมูลให้ครบถ้วน');
      this.focusToggle = !this.focusToggle;
      return;
    }
    // this.linePayForm.disable();
    // this.prepareSave(/*this.linePayForm.value*/);
    this.saving = true;
    this.linePayService.saveLinePay(this.linePay, this.imagesToSave).pipe(
      finalize(() => {
        // this.linePayForm.enable();
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: any) => {
        if (res) {
          this.as.success('บันทึกข้อมูลสำเร็จ', 'สำเร็จ');
          liff.closeWindow();
        }
      }, (error) => {
        this.as.warning('กรุณาอัพโหลดรูปใหม่ เนื่องจากมีขนาดใหญ่เกินไป ', 'แจ้งเตือน')
      }
      );
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

  onClick(input: HTMLElement) {
    if (!this.isDisable) {
      input.click();
    }
  }

  openModalViaService(id: number | undefined, index: number) {
    this.galleryService.openGallery(id, index);
  }
}
