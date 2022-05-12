import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileService, RowState } from '@app/shared';
import { ImageFile } from '@app/shared/image/image-file-base64.model';

export interface Example {
    Code: string,
    Description: string,
    FileName: string,
    ExampleAttachments: ExampleAttachment[]
}
export interface ExampleAttachment {
    Id: number,
    Code: string,
    FileName: string,
    RowState: RowState
}
export interface ExampleReport {
    CompanyCode: string,
    ReportName: string,
    ExportType: string,
}

@Injectable()
export class programService {
    constructor(private http: HttpClient,
        private fs: FileService
    ) { }

    getDemo() {
        return this.http.get('system/example/detail', { params: { code: '001' } });
    }

    saveDemo(company, image, attachment, attachments) {
        let companyFormData = this.fs.convertModelToFormData(company, { ImageFile: image, AttachmentFile: attachment, AttachmentDetailFiles: attachments });
        if (company.Code) {
            return this.http.put('system/example', companyFormData);
        }
        else {
            return this.http.post('system/example', companyFormData);
        }
    }

    generateReport(data: ExampleReport) {
        return this.http.post('loan/example', data, { responseType: 'text' });
    }
}