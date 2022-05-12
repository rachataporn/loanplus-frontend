import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Page, ModalService, TableService, ModalRef, Size } from '@app/shared';
import { Lomt13Service, MotorcyclePriceUpload, CreateMotorcyclePriceUploadReturn } from './lomt13.service';
import { AlertService, SaveDataService, LangService } from '@app/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Attachment } from '@app/shared/attachment/attachment.model';
@Component({
    templateUrl: './lomt13.component.html'
})

export class Lomt13Component implements OnInit {
    popup: ModalRef;
    @ViewChild('LogError') LogError: TemplateRef<any>;
    motorcyclePriceLists = [];
    attachmentFile: Attachment = new Attachment();
    motorcyclePriceUpload: MotorcyclePriceUpload = {} as MotorcyclePriceUpload;
    BrandCBB = [];
    ModelCBB = [];
    page = new Page();
    statusPage: boolean;
    searchForm: FormGroup;
    uploadForm: FormGroup;
    errorForm: FormGroup;
    beforeSearch = '';

    constructor(
        private router: Router,
        private modal: ModalService,
        private Lomt13Service: Lomt13Service,
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
            Model: null,
            IdentificationNo: null,
            EngineNo: null,
            Year: null
        });
        this.searchForm.valueChanges.subscribe(() => this.page.index = 0)
        this.uploadForm = this.fb.group({
            FileName: null
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
                this.Lomt13Service.getModelNameCBB(this.searchForm.controls.Brand.value)
                    .pipe()
                    .subscribe(res => {
                        this.ModelCBB = res.ModelList;
                    });
            }
        );
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.BrandCBB = data.Lomt13.master.BrandList;
            this.ModelCBB = data.Lomt13.master.ModelList;
        });

        const saveData = this.saveData.retrive('LOMT13');
        if (saveData) { this.searchForm.patchValue(saveData); }
        const pageData = this.saveData.retrive('LOMT13Page');
        if (pageData) { this.page = pageData; }
        this.search(false);
    }

    ngOnDestroy() {
        this.saveData.save(this.searchForm.value, 'LOMT13');
        this.saveData.save(this.page, 'LOMT13Page');
    }

    onTableEvent(event) {
        this.page = event;
        this.search(false);
    }

    search(resetIndex) {
        if (resetIndex) this.page.index = 0;
        this.Lomt13Service.getMotorcyclePriceList(this.searchForm.value, this.page)
            .pipe()
            .subscribe(res => {
                this.motorcyclePriceLists = res.Rows;
                this.page.totalElements = res.Total;
            });
    }

    upload() {
        Object.assign(this.motorcyclePriceUpload, this.uploadForm.getRawValue());
        if (this.attachmentFile.Name != null && this.motorcyclePriceUpload.FileName != null) {
            this.Lomt13Service.upload(this.motorcyclePriceUpload, this.attachmentFile)
                .subscribe((res: CreateMotorcyclePriceUploadReturn) => {
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
                                }
                            }
                        )
                    }
                }, (error) => {
                    this.uploadForm.controls.FileName.setValue(null);
                });
        }
    }

    async saveUpload() {
        await this.Lomt13Service.saveExcel();
        this.as.success("", "Message.STD00006");
        this.uploadForm.controls.FileName.setValue(null);
        this.search(true);
    }

    add() {
        this.router.navigate(['/lo/lomt13/detail'], { skipLocationChange: true });
    }

    edit(MotorcycleId) {
        this.router.navigate(['/lo/lomt13/detail', { MotorcycleId: MotorcycleId }], { skipLocationChange: true });
    }

    remove(id, version) {
        this.modal.confirm("Message.STD00003").subscribe(
            (res) => {
                if (res) {
                    this.Lomt13Service.delete(id, version)
                        .subscribe(() => {
                            this.as.success("", "Message.STD00014");
                            this.page = this.ts.setPageIndex(this.page);
                            this.search(false);
                        });
                }
            })
    }

    closePopup() {
        this.uploadForm.controls.FileName.setValue(null);
        this.popup.hide();
    }

}
