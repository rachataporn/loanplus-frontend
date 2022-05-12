import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileService } from '@app/shared';

export interface CarPrice {
    CarId: number;
    BrandName: string;
    ModelName: string;
    ModelType: string;
    Year: number;
    Price: number;
    CreatedBy: string;
    CreatedDate: Date;
    CreatedProgram: string;
    UpdatedBy: string;
    UpdatedDate: Date;
    UpdatedProgram: string;
    CarType: string;
    RowVersion: string;
}

export interface CarPriceUpload {
    FileName: string;
}

export interface CreateCarPriceUploadReturn {
    ErrorLog: string;
}

@Injectable()
export class Lomt14Service {
    constructor(private http: HttpClient, private fs: FileService) { }

    getMaster(): Observable<any> {
        return this.http.get<any>('loan/CarPrice/master');
    }

    getModelNameCBB(BrandName: string): Observable<any> {
        return this.http.get<any>('loan/CarPrice/getModelNameCBB', { params: { BrandName: BrandName } });
    }

    getCarPriceList(search: any, page: any) {
        search.Year == null ? search.Year = 0 : search.Year = search.Year;
        const filter = Object.assign(search, page);
        filter.sort = page.sort || 'BrandName'
        return this.http.get<any>('loan/CarPrice/carPriceList', { params: filter });
    }

    getDetail(CarId: any): Observable<any> {
        return this.http.get<any>('loan/CarPrice/detail', { params: { CarId: CarId } });
    }

    save(data: CarPrice) {
        if (data.RowVersion) {
            return this.http.unit().put<CarPrice>('loan/CarPrice/update', data);
        } else {
            return this.http.unit().post<CarPrice>('loan/CarPrice/insert', data);
        }
    }

    delete(id, version) {
        return this.http.unit().delete('loan/CarPrice/delete', { params: { CarId: id, RowVersion: version } });
    }

    upload(FileName, attachment) {
        let fileExcel = this.fs.convertModelToFormData(FileName, { fileExcel: attachment });
        return this.http.post<CreateCarPriceUploadReturn>('loan/CarPrice/uploadexcel', fileExcel);
    }

    saveExcel(cartpye) {
        return this.http.post<any>('loan/CarPrice/uploadexcelsave', cartpye).toPromise();
    }
}
