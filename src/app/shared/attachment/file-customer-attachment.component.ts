import { Component, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { FileService } from '../service/file.service';
import { Attachment } from './attachment.model';
import { FileAutoUploadService } from './file-upload-auto.service';
import { Guid } from '../service/guid';
import { ConfigurationService, ContentType, Category } from '../service/configuration.service';

@Component({
    selector: 'file-customer-attachment',
    templateUrl: './file-customer-attachment.component.html',
    styleUrls: ['./file-customer-attachment.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: FileCustomerAttachmentComponent, multi: true }
    ]
})
export class FileCustomerAttachmentComponent implements ControlValueAccessor {
    // isDisable: boolean = false;
    error: string;
    uploaded: boolean = false;
    value: number;
    dataUrl: string;
    @Input() small: boolean = false;
    @Input() file: Attachment;
    @Input() category: Category;
    @Input() fileName: string;
    @Input() isDisable: boolean = false;
    @Input() maxSize = 100;
    @Input() isDisableDownload: boolean = false;
    @Output() fileNameReturn = new EventEmitter<string>();
    onChange = (value) => { };
    @HostListener('blur') onTouched = () => { };

    constructor(private fs: FileService, private config: ConfigurationService, private fileAutoUploadService: FileAutoUploadService) { }

    writeValue(value: number) {
        if (value) {
            this.value = value;
            if (this.isDisableDownload) {
                this.uploaded = false;
            } else {
                this.uploaded = true;
            }
        }
    }
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any) { this.onTouched = fn; }

    async onFileChange(event) {
        if (event.target.files.length > 0) {
            await this.addFile(event.target.files);
            this.onChange(this.value);
        }
    }

    async addFile(files: File[]) {
        this.error = "";
        this.uploaded = false;
        const file = files[0];
        this.value = null;
        this.file.File = null;
        this.file.Name = null;
        const result = this.fs.invalidSize(file.size, this.maxSize)
        if (result.invalid) {
            this.error = `Error (File Size): ${file.name} : exceed file size limit of ${this.maxSize} MB ( ${result.size} MB )`;
            return false;
        }
        else {
            var regex = /(\w+)\.(\w+)/;
            var name = file.name;
            this.file.File = file;
            this.file.Name = name.replace(regex, `$1_${Guid.newGuid().toString()}.$2`);
            this.file.AttahmentId = await this.fileAutoUploadService.uploadFileAuto(this.file, this.category);
            this.fileName = this.file.Name;
            this.value = this.file.AttahmentId;
            this.fileNameReturn.emit(this.fileName);
        }
    }
    setDisabledState(isDisabled: boolean): void {
        this.isDisable = isDisabled;
    }
    open() {
        this.config.configChanged().subscribe(config => {
            this.dataUrl = `${config.DisplayPath}/${ContentType.File}/${this.category}/${this.fileName}`;
            window.open(this.dataUrl);
        })
    }
}