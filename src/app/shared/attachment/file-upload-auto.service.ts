import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Attachment } from './attachment.model';
import { FileService } from '../service/file.service';

export interface AttachmentUpload {
    AttahmentName: string;
    File: Attachment;
    CategoryType: string;
}

@Injectable()
export class FileAutoUploadService {
    AttahmentUpload: AttachmentUpload = {} as AttachmentUpload;
    constructor(private http: HttpClient, private fs: FileService) { }

    uploadFileAuto(fileUpload: Attachment, categoryType: string) {
        this.AttahmentUpload.AttahmentName = fileUpload.Name;
        this.AttahmentUpload.CategoryType = categoryType;
        let formData = this.fs.convertModelToFormData(this.AttahmentUpload, {AttachmentFiles: fileUpload });
        return this.http.post<number>('loan/uploadfileauto/uploadfileauto', formData).toPromise();;
    }
}