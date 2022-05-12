import { Component, ViewChild, Input, Output, EventEmitter, HostListener, OnInit, forwardRef } from '@angular/core';
import {
    ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator,
    AbstractControl, ValidationErrors,
} from '@angular/forms';
import { NgxCropperjsComponent } from 'ngx-cropperjs';
import { ImageFile } from './image-file.model';
import { FileService } from '../service/file.service';
import * as Buffer from 'buffer';
import { ImageDisplayService } from './image-display.service';

@Component({
    selector: 'image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-upload.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ImageCropperComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => ImageCropperComponent), multi: true }
    ]
})
export class ImageCropperComponent implements ControlValueAccessor, Validator, OnInit {

    isOver: Boolean = false;
    file: ImageFile;
    isDisable: Boolean = false;
    errors: string[] = [];
    
    /*
      select  : Select Image.
      crop    : Crop Image.
      cropped : Cropped Image.
    */
    state = 'select';
    imageSrc = '';
    config;
    scaleWidth = 300;
    imageWidth = '180px';
    scaleHeight = 300;
    imageHeight = '180px';

    @ViewChild('popUpCropper') popUpImage;
    @ViewChild('imageToCrop') imageToCrop: NgxCropperjsComponent;
    @Input() imageUrl = '';
    @Input() placeholder: string;
    @Input() ratio = 1 / 1;
    @Input() maxSize  = 1024;
    @Output() remove = new EventEmitter<string>();
    onTouched = () => { };

    constructor(private fs: FileService,public image:ImageDisplayService) { }

    ngOnInit() {
        this.config = {
            aspectRatio: this.ratio, // default 1 / 1, for example: 16 / 9, 4 / 3 ...
        };
        if (this.ratio > 1) {
            this.imageWidth = this.scaleWidth + 'px';
            this.imageHeight = this.scaleWidth / this.ratio + 'px';
        } else if (this.ratio < 1) {
            this.imageWidth = this.scaleHeight / this.ratio + 'px';
            this.imageHeight = this.scaleHeight + 'px';
        } else {
            this.imageWidth = '180px';
            this.imageHeight = '180px';
        }

    }

    writeValue(file: ImageFile): void {
        if (file) {
            this.state = 'cropped';
        } else {
            this.state = 'select';
        }
        this.file = file;
    }
    onChange = (value) => { };
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any) { this.onTouched = fn; }

    validate(c: AbstractControl): ValidationErrors | null {
        const _value: string = c.value;
        if (this.state === 'select') {
            return null;
        } else if (this.state === 'cropped') {
            return null;
        }
        return { valid: false };
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisable = isDisabled;
    }

    openInputFile(input: HTMLElement) {
        if (!this.isDisable) {
            input.click();
        }
    }

    _handleReaderLoaded(readerEvt) {
        this.imageUrl = readerEvt.target.result;
        this.state = 'crop';
        this.onChange('');
    }

    onInputFileChange(event) {
        const reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(event.target.files[0]);
    }

    onCut() {
        this.imageSrc = this.imageToCrop.cropper.getCroppedCanvas().toDataURL();
        this.addFile();
        this.onChange(this.file);
    }

    onRemove(fileInput) {
        this.onTouched();
        if (this.file.Uploaded) {
            this.remove.emit(this.file.Name);
        }
        fileInput.value = null;
        this.state = 'select';
        this.file = null;
        this.onChange(this.file);
    }

    private addFile() {
        this.errors = [];
        const head = 'data:image/png;base64,';
        const imgFileSize = Math.round((this.imageSrc.length - head.length) * 3 / 4);
        const result = this.fs.invalidSize(imgFileSize, this.maxSize);
        if (result.invalid) {
            this.errors.push(`Error file size : exceed file size limit of ${this.maxSize} KB ( ${result.size}KB )`);
            this.state = 'crop';
        } else {
            const content = this.convertBase64URIToBinary(this.imageSrc);
            this.file = { Name: 'image_crop.png', Content: content, Uploaded: false } as ImageFile;
            this.state = 'cropped';
        }
    }

    private convertBase64URIToBinary(dataURI): any {
        const BASE64_MARKER = ';base64,';
        const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        const base64 = dataURI.substring(base64Index);

        return Buffer.Buffer.from(base64, 'base64');
    }
}
