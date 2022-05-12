import { Component, HostListener, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { FileService } from '../service/file.service';
import { ImageFile } from './image-file.model';
import { ImageDisplayService } from './image-display.service';
import { Guid } from '../service/guid';
import { ConfigurationService, ContentType, Category } from '../service/configuration.service';
import { NgxImageCompressService } from 'ngx-image-compress';

class ImageFileDisplay extends ImageFile {
    DataUrl: string;
}
@Component({
    selector: 'image-identity-upload',
    templateUrl: './image-identity-upload.component.html',
    styleUrls: ['./image-upload.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: ImageIdentityUploadComponent, multi: true }
    ]
})
export class ImageIdentityUploadComponent implements ControlValueAccessor {
    isFileDialogActive: boolean = false;
    isOver: boolean = false;
    dataUrl: string;
    isDisable: boolean = false;
    errors: string[] = [];
    fileName: string;
    uploaded: boolean = false;
    attahmentId: number;

    @Input() category: Category;
    @Input() file: ImageFileDisplay;
    @Input() maxSize = 5;
    @Input() outputByte = true;
    @Input() placeholder: string;
    @Input() customerCode: string;
    @Input() disabled: boolean = false;

    @Output() remove = new EventEmitter<string>();
    @Output() fileNameReturn = new EventEmitter<string>();

    onChange = (value) => { };
    onTouched = () => { };

    constructor(
        private fs: FileService,
        public image: ImageDisplayService,
        private config: ConfigurationService,
        private imageCompress: NgxImageCompressService
    ) { }

    writeValue(value) {
        if (value) {
            this.fileName = value.DataUrl;
            this.uploaded = true;
            this.file.File = null;
            this.file.Name = null;
            this.config.configChanged().subscribe(config => {
                this.dataUrl = `${config.DisplayPath}${this.fileName}`;
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
            input.click();
        }
    }
    async onFileChange(event) {
        await this.addFile(event.target.files);
        this.onChange(this.fileName);

    }

    async onRemove(fileInput) {
        this.onTouched();
        if (this.fileName) {
            this.remove.emit(this.fileName);
            await this.image.removeImgIdentityAuto(fileInput, this.category, this.customerCode, this.fileName);
        }
        fileInput.value = null;
        this.file.File = null;
        this.file.Name = null;
        this.fileName = null;
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
            this.errors.push(`Error (File Size): ${file.name} : exceed file size limit of ${this.maxSize} MB ( ${result.size}MB )`)
            return false;
        }

        this.dataUrl = file.type.includes("svg") ? "assets/img/svg-dummy.svg" : await this.fs.getUrl(file);
        this.fileName = Guid.newGuid().toString() + '.' + file.name.split('?')[0].split('.').pop();
        this.file.File = file;
        this.file.Name = this.fileName;
        this.file.AttahmentId = await this.image.uploadImgIdentityAuto(this.file, this.category, this.customerCode);
        this.attahmentId = this.file.AttahmentId;
        this.fileNameReturn.emit(`/${ContentType.Image}/${this.category}/${this.customerCode}/${this.fileName}`);

        this.uploaded = false;
        this.onTouched();
    }

    openImg(data) {
        if (data.substring(0, 4) == 'http') {
            window.open(data, '_blank');
        } else {
            var image = new Image();
            image.src = data;

            let w = window.open('about:blank');
            setTimeout(function () {
                w.document.write(image.outerHTML);
            }, 0);
        }
    }
}