import { Component, HostListener, Output, EventEmitter, Input, ViewChild, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { FileService } from '../service/file.service';
import { ImageFile } from './image-file.model';
import { ImageDisplayService, SecuritiesImage } from './image-display.service';
import { Guid } from '../service/guid';
import { ConfigurationService, ContentType, Category } from '../service/configuration.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Size, ModelRef } from '../modal/modal.service';
import { finalize } from 'rxjs/operators';
import { NgxPicaService, NgxPicaErrorInterface, NgxPicaResizeOptionsInterface } from 'ngx-pica';
import { Replace } from '@app/core/shell/replace';

@Component({
    selector: 'image-upload-securities',
    templateUrl: './image-securities-upload.component.html',
    styleUrls: ['./image-upload.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: ImageUploadSecuritiesComponent, multi: true }
    ]
})
export class ImageUploadSecuritiesComponent implements ControlValueAccessor {
    @ViewChild('addImage') addImage: TemplateRef<any>;
    @ViewChild('addImageRef') addImageRef: TemplateRef<any>;

    requestSecuritiesImageForm: FormGroup;
    securitiesImageModel: SecuritiesImage = {} as SecuritiesImage;
    popup: ModelRef;
    popupImageRef: ModelRef;
    isFileDialogActive: boolean = false;
    isOver: boolean = false;
    dataUrl: string;
    isDisable: boolean = false;
    errors: string[] = [];
    fileName: string;
    attahmentId: number;
    uploaded: boolean = false;
    imageFiles: ImageFile[] = [];
    viewImageList = [];

    @Input() category: Category;
    @Input() file: ImageFile;
    @Input() maxSize = 6;
    @Input() outputByte = true;
    @Input() isSelect = false;
    @Input() placeholder: string;
    @Input() referenceSecure: string;
    @Input() pictureName: string;
    @Input() disabled = false;
    @Output() selected = new EventEmitter<SecuritiesImage>();
    @Output() remove = new EventEmitter<number>();
    onChange = (value) => { };
    onTouched = () => { };

    constructor(
        private fb: FormBuilder,
        private fs: FileService,
        public image: ImageDisplayService,
        private config: ConfigurationService,
        private bsModalService: BsModalService,
        private ngxPicaService: NgxPicaService
    ) {
        this.createForm();
    }

    createForm() {
        this.requestSecuritiesImageForm = this.fb.group({
            SecuritiesImages: this.fb.array([]),
        });
    }

    openImg(data) {
        window.open(data, '_blank');
    }
    get SecuritiesImages(): FormArray {
        return this.requestSecuritiesImageForm.get('SecuritiesImages') as FormArray;
    }

    createDetailForm(item: SecuritiesImage): FormGroup {
        let fg = this.fb.group({
            ImageId: null,
            ImageName: null,
            RegisterId: null,
            AttahmentId: null
        });
        fg.patchValue(item, { emitEvent: false });
        this.imageFiles.push(new ImageFile());
        return fg;
    }

    writeValue(value) {
        if (isNaN(value)) {
            this.pictureName = value;
        }
        if (!value && this.pictureName) {
            value = this.pictureName;
        }
        if (value && this.pictureName) {
            this.fileName = this.pictureName;
            this.attahmentId = isNaN(value) ? null : value;
            this.uploaded = true;
            this.file.File = null;
            this.file.Name = null;
            this.config.configChanged().subscribe(config => {
                this.dataUrl = `${config.DisplayPath}/${ContentType.Image}/${this.category}/${this.fileName}`;
            })
        }
    }
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any) { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void {
        this.isDisable = isDisabled;
    }

    @HostListener('dragstart', ['$event']) onDrag(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('dragover', ['$event']) onDragOver(event) {
        this.isOver = true && !this.isDisable && !this.disabled;
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event) {
        this.isOver = false;
        if ((this as any).element) {
            if (event.currentTarget === (this as any).element[0]) {
                return;
            }
        }
        event.preventDefault();
        event.stopPropagation();
    }
    @HostListener('drop', ['$event']) async onDrop(event) {
        this.isOver = false;
        event.preventDefault();
        event.stopPropagation();
        if (!this.isDisable && !this.disabled) {
            await this.addFile(event.dataTransfer.files);
            this.onChange(this.fileName);
        }

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

    async onRemove(fileInput) {
        this.onTouched();
        if (this.fileName && this.attahmentId) {
            // await this.image.deleteImgAuto(this.fileName, this.attahmentId);
            this.remove.emit(this.attahmentId);
        }
        fileInput.value = null;
        this.file.File = null;
        this.file.Name = null;
        this.fileName = null;
        this.attahmentId = null
        this.onChange(this.attahmentId);
    }

    onSelect() {
        this.onTouched();
        if (this.fileName) {
            this.securitiesImageModel.ImageName = this.fileName;
            this.securitiesImageModel.AttahmentId = this.attahmentId;
            this.selected.emit(this.securitiesImageModel);
        }
        this.onChange(this.fileName);
    }

    private async addFile(files: File[]) {
        if (!files || !files.length) {
            return false;
        }
        this.errors = [];
        let file = files[0];

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
        }

        this.dataUrl = file.type.includes("svg") ? "assets/img/svg-dummy.svg" : await this.fs.getUrl(file);
        this.fileName = Guid.newGuid().toString() + '.' + file.name.split('?')[0].split('.').pop();
        this.file.File = file;
        this.file.Name = this.fileName;
        this.file.AttahmentId = await this.image.uploadImgAuto(this.file);
        this.attahmentId = this.file.AttahmentId;
        this.uploaded = false;
        this.onTouched();
    }

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

    getDimention(base64: string): Promise<any> {
        return new Promise((resolve) => {
            let im = new Image;
            im.src = base64;
            im.onload = () => resolve(im);
        });
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

    uploadOwner(input: HTMLElement) {
        input.click();
    }

    uploadFromLine() {
        this.popup.hide();

        setTimeout(() => {
            this.image.getReferenceSecureImage(this.referenceSecure)
                .pipe(finalize(() => {
                }))
                .subscribe(
                    (res) => {
                        this.viewImageList = res;
                        this.requestSecuritiesImageForm.setControl('SecuritiesImages', this.fb.array(this.viewImageList.map((detail) => this.createDetailForm(detail))));
                        this.category = Category.PreApprove;
                        this.popupImageRef = this.bsModalService.show(this.addImageRef, { ignoreBackdropClick: true, class: Size.large });
                    });
        }, 100);
    }

    closeModal() {
        this.popup.hide();
    }

    closeModalImageRef() {
        this.popupImageRef.hide();
    }

    onSelectedImage(index, securitiesImage: SecuritiesImage) {
        let detail = this.SecuritiesImages.at(index) as FormGroup
        Object.assign(securitiesImage, detail.value)

        this.selected.emit(securitiesImage);
        if (this.popupImageRef) {
            this.popupImageRef.hide();
        }
    }

    
}