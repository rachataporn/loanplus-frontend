import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Lomt10Service } from './lomt10.service'
import { finalize } from 'rxjs/internal/operators/finalize';
import { Page, ModalService } from '@app/shared';
import { Router } from '@angular/router';
import { AlertService } from '@app/core';
import { SaveDataService } from '@app/core';

@Component({
    templateUrl: './lomt10.component.html'
})

export class Lomt10Component implements OnInit {
    templateViewForm: FormGroup;
    getTemplateView = [];
    count: number = 0;
    page = new Page();
    beforeSearch = '';
    statusPage: boolean;

    constructor(
        private fb: FormBuilder,
        private Lomt10Service: Lomt10Service,
        private router: Router,
        private modal: ModalService,
        private as: AlertService,
        private saveData: SaveDataService,
    ) {
        this.createForm();
    }

    createForm() {
        this.templateViewForm = this.fb.group({
            keywords: null,
            flagSearch: true,
            beforeSearch: null,
            page: new Page()
        });
    }

    ngOnInit() {
        let saveData = this.saveData.retrive("LOMT10");
        if (saveData) this.templateViewForm.patchValue(saveData);

        this.page = this.templateViewForm.controls.page.value;
        if (!this.templateViewForm.controls.flagSearch.value) {
            this.beforeSearch = this.templateViewForm.controls.beforeSearch.value;
            this.statusPage = this.templateViewForm.controls.flagSearch.value;
        } else {
            this.statusPage = true;
        }
        this.onSearch();
    }

    ngOnDestroy() {
        if (this.router.url.split('/')[2] === 'lomt10') {
            this.templateViewForm.controls.flagSearch.setValue(false);
            this.saveData.save(this.templateViewForm.value, 'LOMT10');
        } else {
            this.saveData.delete('LOMT10');
        }
    }

    search() {
        this.page = new Page();
        this.statusPage = true;
        this.onSearch();
    }

    onTableEvent(event) {
        this.page = event;
        this.statusPage = false;
        this.onSearch();
    }


    onSearch() {
        if (this.templateViewForm.controls['keywords'].value) {
            this.templateViewForm.controls['keywords'].setValue(this.templateViewForm.controls['keywords'].value.trim());
        }
        this.Lomt10Service.getTemplateView(this.statusPage ? (this.templateViewForm.value) : this.beforeSearch, this.page)
            .pipe(finalize(() => {
                if (this.statusPage) {
                    this.beforeSearch = this.templateViewForm.value;
                    this.templateViewForm.controls.beforeSearch.reset();
                    this.templateViewForm.controls.page.setValue(this.page);
                    this.templateViewForm.controls.beforeSearch.setValue(this.templateViewForm.value);
                }
            })).subscribe(
                (res: any) => {
                    this.getTemplateView = res.Rows;
                    this.page.totalElements = res.Rows.length ? res.Total : 0;
                });
    }


    add() {
        this.router.navigate(['/lo/lomt10/detail'], { skipLocationChange: true });
    }

    edit(id) {
        this.router.navigate(['/lo/lomt10/detail', { id: id }], { skipLocationChange: true });
    }

    view(templateViewID, templateName) {
        this.router.navigate(['/lo/lomt10-2', { templateViewID: templateViewID, templateName: templateName }], { skipLocationChange: true });
    }

    remove(id: number, version: string) {
        this.modal.confirm("Message.STD00003").subscribe(
            (res) => {
                if (res) {
                    this.Lomt10Service.deleteTemplateView(id, version).subscribe(
                        (response) => {
                            if (response) {
                                this.as.success("", "Message.STD00014");
                                this.search();
                            }
                        });
                }
            })
    }
}
