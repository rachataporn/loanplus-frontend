import { Component, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { FileService } from '../service/file.service';
import { Attachment } from './attachment.model';
import { Guid } from '../service/guid';
import { ConfigurationService, ContentType, Category } from '../service/configuration.service';

@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: FileUploadComponent, multi: true }
    ]
})
export class FileUploadComponent implements ControlValueAccessor {


    isDisable: boolean = false;
    error: string;
    uploaded: boolean = false;
    value: string;
    dataUrl: string;
    @Input() small: boolean = false;
    @Input() file: Attachment;
    @Input() category: Category;
    @Input() maxSize = 100;
    @Input() excel: boolean = false;
    onChange = (value) => { };
    @HostListener('blur') onTouched = () => { };

    constructor(private fs: FileService, private config: ConfigurationService) { }

    writeValue(value: string) {
        if (value) {
            this.value = value;
            this.uploaded = true;
        }
        if (this.excel) {
            this.value = value;
            this.uploaded = false;
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

    async onClickFile(event) {
        if (event.target.files.length > 0) {
            await this.addFile(event.target.files);
            this.onChange(this.value);
        }
    }

    private addFile(files: File[]) {
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
            this.value = name.replace(regex, `$1_${Guid.newGuid().toString()}.$2`);
            this.file.File = file;
            this.file.Name = this.value;
        }
    }
    setDisabledState(isDisabled: boolean): void {
        this.isDisable = isDisabled;
    }
    open() {
        this.config.configChanged().subscribe(config => {
            this.dataUrl = `${config.DisplayPath}/${ContentType.File}/${this.category}/${this.value}`;
            window.open(this.dataUrl);
        })
    }
}