import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Page, ModalService, TableService, ModalRef, Size } from '@app/shared';
import { Lomt14Service, CarPriceUpload, CreateCarPriceUploadReturn } from './lomt14.service';
import { AlertService, SaveDataService, LangService } from '@app/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Attachment } from '@app/shared/attachment/attachment.model';
@Component({
    templateUrl: './lomt14.component.html'
})

export class Lomt14Component implements OnInit {
    popup: ModalRef;
    @ViewChild('LogError') LogError: TemplateRef<any>;
    carPriceLists = [];
    BrandCBB = [];
    ModelCBB = [];
    CarType = [];
    page = new Page();
    attachmentFile: Attachment = new Attachment();
    carPriceUpload: CarPriceUpload = {} as CarPriceUpload;
    statusPage: boolean;
    searchForm: FormGroup;
    uploadForm: FormGroup;
    errorForm: FormGroup;
    beforeSearch = '';

    constructor(
        private router: Router,
        private modal: ModalService,
        private Lomt14Service: Lomt14Service,
        public lang: LangService,
        private fb: FormBuilder,
        private saveData: SaveDataService,
        private as: AlertService,
        private ts: TableService,
        private route: ActivatedRoute
    ) {
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            Brand: null,
            ModelName: null,
            ModelType: null,
            Year: null,
            CarType: 'C'
        });
        this.searchForm.valueChanges.subscribe(() => this.page.index = 0)
        this.uploadForm = this.fb.group({
            FileName: null,
            CarType: 'C'
        });
        this.uploadForm.controls.FileName.valueChanges.subscribe((val) => {
            if (val != null) {
                this.upload()
            }
        })
        this.errorForm = this.fb.group({
            error: null
        });

        this.searchForm.controls.Brand.valueChanges.subscribe(
            (value) => {
                if (value) {
                    this.searchForm.controls.Brand.setValue(value.toUpperCase(), { emitEvent: false });
                }
                this.Lomt14Service.getModelNameCBB(this.searchForm.controls.Brand.value)
                    .pipe()
                    .subscribe(res => {
                        this.ModelCBB = res.ModelList;
                    });
            }
        );
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.BrandCBB = data.Lomt14.master.BrandList;
            this.ModelCBB = data.Lomt14.master.ModelList;
            this.CarType = data.Lomt14.master.CarTypeList;
        });

        const saveData = this.saveData.retrive('LOMT14');
        if (saveData) { this.searchForm.patchValue(saveData); }
        const pageData = this.saveData.retrive('LOMT14Page');
        if (pageData) { this.page = pageData; }
        this.search(false);
    }

    ngOnDestroy() {
        this.saveData.save(this.searchForm.value, 'LOMT14');
        this.saveData.save(this.page, 'LOMT14Page');
    }

    onTableEvent(event) {
        this.search(false);
    }

    search(resetIndex) {
        if (resetIndex) this.page.index = 0;
        this.Lomt14Service.getCarPriceList(this.searchForm.value, this.page)
            .pipe()
            .subscribe(res => {
                this.carPriceLists = res.Rows;
                this.page.totalElements = res.Total;
            });
    }

    add() {
        this.router.navigate(['/lo/lomt14/detail'], { skipLocationChange: true });
    }

    edit(CarId) {
        this.router.navigate(['/lo/lomt14/detail', { CarId: CarId }], { skipLocationChange: true });
    }

    remove(id, version) {
        this.modal.confirm("Message.STD00003").subscribe(
            (res) => {
                if (res) {
                    this.Lomt14Service.delete(id, version)
                        .subscribe(() => {
                            this.as.success("", "Message.STD00014");
                            this.page = this.ts.setPageIndex(this.page);
                            this.search(false);
                        });
                }
            })
    }

    upload() {
        Object.assign(this.carPriceUpload, this.uploadForm.getRawValue());
        if (this.attachmentFile.Name != null && this.carPriceUpload.FileName != null) {
            this.Lomt14Service.upload(this.carPriceUpload, this.attachmentFile)
                .subscribe((res: CreateCarPriceUploadReturn) => {
                    if (res.ErrorLog != '') {
                        this.errorForm.controls.error.setValue(res.ErrorLog);
                        this.errorForm.controls.error.disable({ emitEvent: false });
                        this.popup = this.modal.open(this.LogError, Size.large);
                    } else {
                        this.modal.confirm("Message.LO00034").subscribe(
                            (result) => {
                                if (result) {
                                    this.saveUpload();
                                } else {
                                    this.uploadForm.controls.FileName.setValue(null);
                                    this.uploadForm.controls.CarType.setValue('C');
                                }
                            }
                        )
                    }
                }, (error) => {
                    this.uploadForm.controls.FileName.setValue(null);
                    this.uploadForm.controls.CarType.setValue('C');
                });
        }
    }

    async saveUpload() {
        await this.Lomt14Service.saveExcel(this.uploadForm.getRawValue());
        this.as.success("", "Message.STD00006");
        this.uploadForm.controls.FileName.setValue(null);
        this.uploadForm.controls.CarType.setValue('C');
        this.search(true);
    }

    closePopup() {
        this.uploadForm.controls.FileName.setValue(null);
        this.uploadForm.controls.CarType.setValue('C');
        this.popup.hide();
    }

}
