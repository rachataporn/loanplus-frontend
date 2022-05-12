import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { ModalService, RowState, Page, ImageFile, } from '@app/shared';
import { ImageDisplayService, SecuritiesImage } from '../../../shared/image/image-display.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Size, ModelRef } from '../../../shared/modal/modal.service';
import { FileService } from '../../../shared/service/file.service';
import { Dbmt17Service, Country, PcmContractInfo } from './dbmt17.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Guid } from '../../../shared/service/guid';
import { NgxPicaService, NgxPicaErrorInterface, NgxPicaResizeOptionsInterface } from 'ngx-pica';

@Component({
  templateUrl: './dbmt17-detail.component.html',
  styleUrls: ['./dbmt17.component.scss']
})
export class Dbmt17DetailComponent implements OnInit {
  @ViewChild('addImage') addImage: TemplateRef<any>;
  @ViewChild('addImageRef') addImageRef: TemplateRef<any>;

  CountryDetail: Country = {} as Country;
  PcmContractDetail: PcmContractInfo = {} as PcmContractInfo;
  popupImageRef: ModelRef;
  CountryFrom: FormGroup;
  PcmContractFrom: FormGroup;
  searchForm: FormGroup;
  saving: boolean;
  submitted: boolean;
  isOver: boolean = false;
  focusToggle: boolean;
  statusSave: boolean = true;
  imageFiles: ImageFile[] = [];
  fileName: string;
  isDisable: boolean = false;
  uploaded: boolean = false;
  isFileDialogActive: boolean = false;
  popup: ModelRef;
  errors: string[] = [];
  dataUrl: string;
  attahmentId: number;

  //file: ImageFile;


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
    private js: Dbmt17Service,
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
      fileName: null,
      isDisable: null
    });

    this.PcmContractFrom = this.fb.group({
      TelNumber: null,
      OfficeLine: null,
      OfficeEmail: null,
      OfficeHour: null,
      OfficeImgPath: null,
      OfficeImgName: null,
      Id: null,
      RowState: 0,
      RowVersion: 0,
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
    const saveData = this.saveData.retrive('DBMT17');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.route.data.subscribe((data) => {
      if (null != data) this.PcmContractDetail = data.dbmt17.ContractDetail;
      this.rebuildForm();
    });
    this.searchForm.controls.flagSearch.setValue(false);
  }

  rebuildForm() {
    this.PcmContractFrom.markAsPristine();
    if (this.PcmContractDetail) this.PcmContractFrom.patchValue(this.PcmContractDetail);
    //this.PcmContractFrom.patchValue(this.PcmContractDetail);
    if (this.PcmContractFrom.controls.OfficeImgPath.value != null && this.PcmContractFrom.controls.OfficeImgPath.value != "") this.uploaded = true;
    // if (this.CountryDetail.CountryCode) {
    //   this.CountryFrom.controls.CountryCode.disable();
    //   this.statusSave = false;
    // } else {
    //   this.CountryFrom.controls.CountryCode.enable();
    // }
  }

  prepareSave(values: Object) {
    this.PcmContractDetail = {} as PcmContractInfo;
    Object.assign(this.PcmContractDetail, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.PcmContractFrom.controls.TelNumber.value == '' || this.PcmContractFrom.controls.TelNumber.value == null ||
      this.PcmContractFrom.controls.OfficeLine.value == '' || this.PcmContractFrom.controls.OfficeLine.value == null ||
      this.PcmContractFrom.controls.OfficeEmail.value == '' || this.PcmContractFrom.controls.OfficeEmail.value == null ||
      this.PcmContractFrom.controls.OfficeHour.value == '' || this.PcmContractFrom.controls.OfficeHour.value == null ||
      this.PcmContractFrom.controls.OfficeImgPath.value == '' || this.PcmContractFrom.controls.OfficeImgPath.value == null
    ) {
      this.as.error('', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (this.PcmContractFrom.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    // if (this.CountryFrom.controls.CountryCode.value || this.CountryFrom.controls.CountryNameTha.value) {
    //   this.CountryFrom.controls.CountryCode.setValue(this.CountryFrom.controls.CountryCode.value.trim());
    //   this.CountryFrom.controls.CountryNameTha.setValue(this.CountryFrom.controls.CountryNameTha.value.trim());
    //   if (this.CountryFrom.controls.CountryCode.value == null || this.CountryFrom.controls.CountryCode.value == '' || this.CountryFrom.controls.CountryNameTha.value == null || this.CountryFrom.controls.CountryNameTha.value == '') {
    //     return;
    //   }
    // }
    this.prepareSave(this.PcmContractFrom.value);
    if (this.statusSave) {
      this.onSave();
    } else {
      this.onSave();
    }
  }

  onSave() {
    this.js.savePcmContract(this.PcmContractDetail).pipe(
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe(
        (res: PcmContractInfo) => {
          this.PcmContractDetail = res;
          this.rebuildForm();
          // this.CountryFrom.controls.CountryCode.disable();
          this.as.success('', 'Message.STD000033');
        }
      );
  }


  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'dbmt17') {
      this.saveData.save(this.searchForm.value, 'DBMT17');
    } else {
      this.saveData.save(this.searchForm.value, 'DBMT17');
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.CountryFrom.dirty) {
      return true;
    }
    return this.modal.confirm('Message.STD00002');
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
    this.PcmContractFrom.controls.OfficeImgName.setValue(file.name);
    this.PcmContractFrom.controls.OfficeImgPath.setValue(await this.toBase64(file));

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
    } else {
      console.log(" result not invalid ")
    }

    this.dataUrl = file.type.includes("svg") ? "assets/img/svg-dummy.svg" : await this.fs.getUrl(file);
    this.fileName = Guid.newGuid().toString() + '.' + file.name.split('?')[0].split('.').pop();
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
    this.PcmContractFrom.controls.OfficeImgName.setValue(null);
    this.PcmContractFrom.controls.OfficeImgPath.setValue(null);
    fileInput.value = null;
    // this.file.File = null;
    // this.file.Name = null;
    // this.fileName = null;
    this.attahmentId = null
    this.onChange(this.attahmentId);
  }


}
