import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileService } from '@app/shared';

export interface MotorcyclePrice {
    MotorcycleId: number;
    BrandName: string;
    ModelName: string;
    IdentificationNo: string;
    EngineNo: string;
    ModelCode: string;
    Year: number;
    Price: number;
    CreatedBy: string;
    CreatedDate: Date;
    CreatedProgram: string;
    UpdatedBy: string;
    UpdatedDate: Date;
    UpdatedProgram: string;
    RowVersion: string;
}

export interface MotorcyclePrice {
    MotorcycleId: number;
    BrandName: string;
    ModelName: string;
    IdentificationNo: string;
    EngineNo: string;
    ModelCode: string;
    Year: number;
    Price: number;
    CreatedBy: string;
    CreatedDate: Date;
    CreatedProgram: string;
    UpdatedBy: string;
    UpdatedDate: Date;
    UpdatedProgram: string;
    RowVersion: string;
}

export interface MotorcyclePriceUpload {
    FileName: string;
}

export interface CreateMotorcyclePriceUploadReturn {
    ErrorLog: string;
}

@Injectable()
export class Lomt13Service {
    constructor(private http: HttpClient, private fs: FileService) { }

    getMaster(): Observable<any> {
        return this.http.get<any>('loan/MotorcyclePrice/master');
    }

    getModelNameCBB(BrandName: string): Observable<any> {
        return this.http.get<any>('loan/MotorcyclePrice/getModelNameCBB', { params: { BrandName: BrandName } });
    }

    getMotorcyclePriceList(search: any, page: any) {
        search.Year == null ? search.Year = 0 : search.Year = search.Year;
        const filter = Object.assign(search, page);
        filter.sort = page.sort || 'BrandName'
        return this.http.get<any>('loan/MotorcyclePrice/motorcyclePriceList', { params: filter });
    }

    getDetail(MotorcycleId: any): Observable<any> {
        return this.http.get<any>('loan/MotorcyclePrice/detail', { params: { MotorcycleId: MotorcycleId } });
    }

    save(data: MotorcyclePrice) {
        if (data.RowVersion) {
            return this.http.unit().put<MotorcyclePrice>('loan/MotorcyclePrice/update', data);
        } else {
            return this.http.unit().post<MotorcyclePrice>('loan/MotorcyclePrice/insert', data);
        }
    }

    delete(id, version) {
        return this.http.unit().delete('loan/MotorcyclePrice/delete', { params: { MotorcycleId: id, RowVersion: version } });
    }

    upload(FileName, attachment) {
        let fileExcel = this.fs.convertModelToFormData(FileName, { fileExcel: attachment });
        return this.http.post<CreateMotorcyclePriceUploadReturn>('loan/MotorcyclePrice/uploadexcel', fileExcel);
    }

    saveExcel() {
        return this.http.post<any>('loan/MotorcyclePrice/uploadexcelsave', null).toPromise();
    }
}
