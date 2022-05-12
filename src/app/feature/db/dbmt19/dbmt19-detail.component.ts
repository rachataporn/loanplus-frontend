import { Component, OnInit ,Input, Output, EventEmitter ,ViewChild ,TemplateRef} from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page, ImageFile } from '@app/shared';
import { ImageDisplayService, SecuritiesImage } from '../../../shared/image/image-display.service';
import { Observable } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FileService } from '../../../shared/service/file.service';
import { finalize } from 'rxjs/operators';
import { Size, ModelRef } from '../../../shared/modal/modal.service';
import { Dbmt19Service, Country,Banner } from './dbmt19.service';
import { Guid } from '../../../shared/service/guid';
import { NgxPicaService, NgxPicaErrorInterface, NgxPicaResizeOptionsInterface } from 'ngx-pica';

@Component({
  templateUrl: './dbmt19-detail.component.html'
})
export class Dbmt19DetailComponent implements OnInit {
  @ViewChild('addImage') addImage: TemplateRef<any>;
  @ViewChild('addImageRef') addImageRef: TemplateRef<any>;

  popupImageRef: ModelRef;
  CountryDetail: Country = {} as Country;
  CountryFrom: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  isOver: boolean = false;
  focusToggle: boolean;
  statusSave: boolean = true;
  BannerDetail: Banner = {} as Banner;
  BannerFrom: FormGroup;
  mageFiles: ImageFile[] = [];
  fileName: string;
  isDisable: boolean = false;
  uploaded: boolean = false;
  isFileDialogActive: boolean = false;
  popup: ModelRef;
  errors: string[] = [];
  dataUrl: string;
  attahmentId: number;

  @Input() maxSize = 6;
  @Input() file: ImageFile;
  @Input() disabled = false;
  @Input() placeholder: string;
  @Input() referenceSecure: string;
  @Output() selected = new EventEmitter<SecuritiesImage>();
  @Output() remove = new EventEmitter<number>();

  onChange = (value) => { };
  onTouched = () => { };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Dbmt19Service,
    private saveData: SaveDataService,
    private modal: ModalService,
    public lang: LangService,
    private bsModalService: BsModalService,
    private fs: FileService,
    public image: ImageDisplayService,
    private ngxPicaService: NgxPicaService

  ) {
    this.createForm();
    this.createBackSearchForm();
  }

  createForm() {
    this.CountryFrom = this.fb.group({
      CountryCode: [null, Validators.required],
      CountryNameTha: [null, Validators.required],
      CountryNameEng: null,
      Active: true,
    });
 
    this.BannerFrom = this.fb.group({
      BannerCode: [null, Validators.required],
      BannerName: [null, Validators.required],
      BannerBase64: [null, Validators.required],
      Active: null,
      BannerUrlName: [null, Validators.required]
    });


  }
  createBackSearchForm() {
    this.searchForm = this.fb.group({
      InputSearch: null,
      flagSearch: null,
      beforeSearch: null
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('DBMT19');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      this.BannerDetail = data.dbmt19.BannerDetail;
      this.rebuildForm(); 
      if (data.dbmt19.BannerDetail.BannerCode) {
        this.statusSave = false;
      }
    });
    this.searchForm.controls.flagSearch.setValue(false);
  }

  rebuildForm() {
    this.BannerFrom.markAsPristine();
    //this.BannerDetail.BannerBase64 = this.BannerDetail.BannerBase64.replace(" \" ","");
    this.BannerFrom.patchValue(this.BannerDetail);
    //this.BannerFrom.controls.BannerBase64.setValue(this.BannerDetail.BannerBase64.replace(" \" ",""));
    if (this.BannerDetail.BannerCode) {
      this.BannerFrom.controls.BannerCode.disable();
      this.BannerFrom.controls.BannerCode.setValue(this.BannerDetail.BannerCode);
      // this.FaqFrom.controls.FaqTopic.disable();
      this.statusSave = false;
    } else {
      this.BannerFrom.controls.BannerCode.enable();
    }


  }

  prepareSave(values: Object) {
    Object.assign(this.CountryDetail, values);
  }

  prepareSaveBanner(values: Object) {
    Object.assign(this.BannerDetail, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.BannerFrom.invalid) {
      if(this.BannerFrom.controls.BannerBase64.value==null) this.as.warning('', 'กรุณาเพิ่มรูปภาพ Banner');
      this.focusToggle = !this.focusToggle;
      return;
    }
    
    if (this.BannerFrom.controls.BannerCode.value ) {
      this.BannerFrom.controls.BannerCode.setValue(this.BannerFrom.controls.BannerCode.value.trim());
      if (this.BannerFrom.controls.BannerCode.value == null || this.BannerFrom.controls.BannerCode.value == '' ) {
        return;
      }
    }

    if(this.BannerFrom.controls.Active.value == null) this.BannerFrom.controls.Active.setValue(false);
    this.prepareSaveBanner(this.BannerFrom.value);
    if (this.statusSave) {
      this.js.CheckDuplicateBanner(this.BannerDetail).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe(
          (res) => {
            if (res) {
              this.onSave();
            } else {
              this.as.warning('', 'ข้อมูลมีค่าซ้ำ');
            }
          }
        );
    } else {
      this.onSave();
    }
  }

  onSave() {
    this.js.savePcmBanner(this.BannerDetail).pipe(
        finalize(() => {
          this.saving = false;
          this.submitted = false;
        }))
        .subscribe(
          (res: Banner) => {
            this.BannerDetail = res;
            this.rebuildForm();
            //this.F.controls.CountryCode.disable();
            this.as.success('', 'Message.STD000033');
          }
        );
    // this.js.saveCountry(this.CountryDetail).pipe(
    //   finalize(() => {
    //     this.saving = false;
    //     this.submitted = false;
    //   }))
    //   .subscribe(
    //     (res: Country) => {
    //       this.CountryDetail = res;
    //       this.rebuildForm();
    //       this.CountryFrom.controls.CountryCode.disable();
    //       this.as.success('', 'Message.STD000033');
    //     }
    //   );
  }


  ngOnDestroy() {
    // if (this.router.url.split('/')[2] === 'dbmt18') {
    //   this.saveData.save(this.searchForm.value, 'DBMT18');
    // } else {
    //   this.saveData.save(this.searchForm.value, 'DBMT18');
    // }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.BannerFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
  }

  back(flagSearch) {
    this.router.navigate(['/db/dbmt19', { flagSearch: flagSearch }], { skipLocationChange: true });
  }

  
  onClick(input: HTMLElement) {
    if (!this.isDisable && !this.disabled) {
        this.isFileDialogActive = true;
        if (this.referenceSecure != undefined) {
            this.popup = this.bsModalService.show(this.addImage, { ignoreBackdropClick: true, class: Size.small });
        } else {
            input.click();
        }
    }
  }

  async onFileChange(event) {
    await this.addFile(event.target.files);
    
    this.onChange(this.attahmentId);
    if (this.popup) {
        this.popup.hide();
    }
    if (this.popupImageRef) {
        this.popupImageRef.hide();
    }
  }

  private async addFile(files: File[]) {
    if (!files || !files.length) {
        return false;
    }
    this.errors = [];
    let file = files[0];
    //this.BannerFrom.controls.BannerBase64.setValue(file.name);
    this.BannerFrom.controls.BannerBase64.setValue(await this.toBase64(file));

    if (!(file.type.includes("image") || file.type.includes("svg"))) {
        this.errors.push(`Error (Extension): ${file.name}`);
        return false;
    }

    const result = this.fs.invalidSize(file.size, this.maxSize);

    if (result.invalid) {
        let resizeImg = await this.resize(files);
        file = new File([this.dataURItoBlob(resizeImg.toString())], file.name, { type: 'image/jpeg' });
        // this.errors.push(`Error (File Size): ${file.name} : exceed file size limit of ${this.maxSize} MB ( ${result.size} MB )`)
        // return false;
    }else{
    }
   
    this.dataUrl = file.type.includes("svg") ? "assets/img/svg-dummy.svg" : await this.fs.getUrl(file);
    this.fileName = Guid.newGuid().toString() + '.' + file.name.split('?')[0].split('.').pop();
    // this.file.File = file;
    // this.file.Name = this.fileName;
    //this.file.AttahmentId = await this.image.uploadImgAuto(this.file);
    //this.PcmContractFrom.controls.OfficeImgName.setValue(this.fileName);
    //this.PcmContractFrom.controls.OfficeImgPath.setValue(this.getBase64(file));
    //this.PcmContractFrom.setControl('OfficeImgPath',this.getBase64(file))
    //this.attahmentId = this.file.AttahmentId;
    this.uploaded = false;
    this.onTouched();
}

toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

dataURItoBlob(dataURI) {
  let base64Marker = ';base64,';
  let base64Index = dataURI.indexOf(base64Marker) + base64Marker.length;
  let base64 = dataURI.substring(base64Index);
  const byteString = window.atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([int8Array], { type: 'image/jpeg' });
  return blob;
}

async resize(files: File[]): Promise<any> {
  let file = files[0];
  let base64 = await this.fs.getUrl(file);
  let img = await this.getDimention(base64);
  return new Promise((resolve) => {
      this.ngxPicaService.resizeImages(files, Math.floor(img.width * 0.3), Math.floor(img.height * 0.3))
          .subscribe((imageResized: File) => {
              let reader: FileReader = new FileReader();
              reader.addEventListener('load', (event: any) => {
                  resolve(event.target.result);
              });
              reader.readAsDataURL(imageResized);
          }, (err: NgxPicaErrorInterface) => {
              throw err.err;
          });
  })
}

getDimention(base64: string): Promise<any> {
  return new Promise((resolve) => {
      let im = new Image;
      im.src = base64;
      im.onload = () => resolve(im);
  });
}

async onRemove(fileInput) {
  this.onTouched();
  // if (this.fileName && this.attahmentId) {
  //     // await this.image.deleteImgAuto(this.fileName, this.attahmentId);
  //     this.remove.emit(this.attahmentId);
  // }
  this.BannerFrom.controls.BannerBase64.setValue(null);
  this.BannerFrom.controls.BannerBase64.setValue(null);
  fileInput.value = null;
  // this.file.File = null;
  // this.file.Name = null;
  // this.fileName = null;
  this.attahmentId = null
  this.onChange(this.attahmentId);
}


}
