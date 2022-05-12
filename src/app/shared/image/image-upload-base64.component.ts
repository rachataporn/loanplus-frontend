import { Component, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { FileService } from '../service/file.service';
import { ImageFile } from './image-file-base64.model';

class ImageFileDisplay extends ImageFile {
    dataUrl: string;
}
@Component({
    selector: 'image-upload-base64',
    templateUrl: './image-upload-base64.component.html',
    styleUrls: ['./image-upload-base64.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: ImageUploadBase64Component, multi: true }
    ]
})
export class ImageUploadBase64Component implements ControlValueAccessor {

    isOver: boolean = false;
    file: ImageFileDisplay;
    isDisable: boolean = false;
    errors: string[] = [];
    status: boolean;
    @Input() outputByte = true;
    @Input() placeholder: string;
    @Output() remove = new EventEmitter<string>();
    onChange = (value: ImageFile) => { };
    onTouched = () => { };

    constructor(private fs: FileService,
    ) { }

    writeValue(value: ImageFileDisplay) {
        this.file = value;
    }
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any) { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void {
        this.isDisable = isDisabled;
    }

    @HostListener('dragstart', ['$event']) onDrag(event) {
        event.preventDefault();
    }

    @HostListener('dragover', ['$event']) onDragOver(event) {
        this.isOver = true && !this.isDisable;
        event.preventDefault();
    }

    @HostListener('dragend', ['$event']) onDragEnd(event) {
        this.isOver = false;
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event) {
        this.isOver = false;
        event.preventDefault();
    }
    @HostListener('drop', ['$event']) async onDrop(event) {
        this.isOver = false;
        event.preventDefault();
        event.stopPropagation();
        if (!this.isDisable) {
            await this.addFile(event.dataTransfer.files);
            this.onChange(this.file as ImageFile);
        }
    }
    onClick(input: HTMLElement) {
        if (!this.isDisable) {
            input.click();
        }
    }
    async onFileChange(event) {
        await this.addFile(event.target.files);
        this.onChange(this.file as ImageFile);

    }

    // onRemove(fileInput) {
    //     this.onTouched();
    //     if (this.fileName) {
    //         this.remove.emit(this.fileName);
    //     }
    //     fileInput.value = null;
    //     this.file.File = null;
    //     this.file.Name = null;
    //     this.fileName = null;
    //     this.onChange(this.fileName);
    // }
    
    onRemove(fileInput) {
        this.onTouched();
        if (this.file) {
            this.remove.emit(this.file.Name);
        }
        
        fileInput.value = null;
        this.file = null;
        this.onChange(this.file);

    }

    private async addFile(files: File[]) {
        this.errors = [];
        let file = files[0];
        if (file != undefined) {
            const result = this.fs.invalidSize(file.size, 4);
            if (result.invalid) {

                this.status = false;

                //     this.errors.push(`Error (File Size): ${file.name} : exceed file size limit of ${5} MB `)
                //     return false;
                // }
                // if(!(file.type.includes("image") || file.type.includes("svg"))){
                //     this.errors.push(`Error (Extension): ${file.name}`);
                //     return false;
            } else {
                this.status = true;

            }

            if (!(file.type.includes("image"))) {
                this.errors.push(`Error (Extension): ${file.name}`);
                return false;
            }

            let dataUrl = file.type.includes("svg") ? "assets/img/svg-dummy.svg" : await this.fs.getUrl(file);

            this.file = { Name: file.name, DataUrl: dataUrl, Uploaded: false, Status: this.status } as ImageFileDisplay;
            // if(this.outputByte){  
            //     let content = await this.fs.getContent(file);
            //     this.file.Content = content;
            // }
            // else{
            //     this.file.File = file;
            // }
            this.onTouched();
        }
    }
}