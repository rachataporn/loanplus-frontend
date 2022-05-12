import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TemplateView, Lomt10Service } from './lomt10.service'
import { finalize } from 'rxjs/internal/operators/finalize';
import { Page, ModalService } from '@app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '@app/core';
import { SaveDataService } from '@app/core';
@Component({
    templateUrl: './lomt10-view.component.html'
})

export class Lomt10ViewComponent implements OnInit {
    templateView: TemplateView = {} as TemplateView;
    viewForm: FormGroup;
    getView = [];
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
        private route: ActivatedRoute,
        private saveData: SaveDataService,
        private saveDatas: SaveDataService,
    ) {
        this.createForm();
    }

    createForm() {
        this.viewForm = this.fb.group({
            TemplateViewID: null,
            TemplateName: null
        });
    }

    ngOnInit() {
        let saveData = this.saveData.retrive("View");
        if (saveData) this.viewForm.patchValue(saveData);
        this.viewForm.controls['TemplateName'].disable();
        if (this.route.snapshot.params.templateViewID && this.route.snapshot.params.templateName) {
            this.viewForm.controls['TemplateViewID'].setValue(this.route.snapshot.params.templateViewID);
            this.viewForm.controls['TemplateName'].setValue(this.route.snapshot.params.templateName);
        }
        this.onSearch();
    }

    ngOnDestroy() {
        this.viewForm.controls['TemplateName'].enable();
        this.saveData.save(this.viewForm.value, "View");
    }

    onTableEvent(event) {
        this.page = event;
        this.onSearch();
    }

    onSearch() {
        this.Lomt10Service.getView(this.viewForm.value, this.page)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (res: any) => {
                    this.getView = res.Rows;
                    this.page.totalElements = res.Rows.length ? res.Total : 0;
                });
    }
    
    back() {
        let dataStore = sessionStorage.getItem('LOTS01Page');
        let sessionValue = JSON.parse(dataStore)? JSON.parse(dataStore): 'No Value';
        if(sessionValue.data == "LOTS01Page"){
            this.router.navigate(['/lo/lomt01'], { skipLocationChange: true });
        }else{
            this.router.navigate(['/lo/lomt10'], { skipLocationChange: true });
        }
    }

    add() {
        let templateViewID = this.viewForm.controls['TemplateViewID'].value
        this.router.navigate(['/lo/lomt10-2/detail', { templateViewID: templateViewID }], { skipLocationChange: true });
    }

    edit(viewId) {
        if (this.route.snapshot.params.programCode == 'lomt01') {
            this.router.navigate(['/lo/lomt10-2/detail', { viewId: viewId, programCode : 'lomt01' }], { skipLocationChange: true });
            
        } else {
            this.router.navigate(['/lo/lomt10-2/detail', { viewId: viewId }], { skipLocationChange: true });

        }
    }

    remove(id: number, version: string) {
        this.modal.confirm("Message.STD00003").subscribe(
            (res) => {
                if (res) {
                    this.Lomt10Service.deleteView(id, version).subscribe(
                        (response) => {
                            if (response) {
                                this.as.success("", "Message.STD00014");
                                this.onSearch();
                            }
                        });
                }
            })
    }
}
