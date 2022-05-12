import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Trmt01Service } from './trmt01.service';
import { Page, ModalService, ModalRef, SelectFilterService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';

@Component({
    templateUrl: './trmt01.component.html'
})

export class Trmt01Component implements OnInit {
    searchForm: FormGroup;

    page = new Page();
    statusPage: boolean;
    beforeSearch = '';

    trackingList = [];
    StatusList = [];

    statusAll = { value: null, textTha: 'ทั้งหมด', textEng: 'All' };

    constructor(
        private router: Router,
        private modal: ModalService,
        private fb: FormBuilder,
        private sv: Trmt01Service,
        private lang: LangService,
        private saveData: SaveDataService,
        private as: AlertService,
        private route: ActivatedRoute,
        private selectFilter: SelectFilterService
    ) {
        this.createForm();
    }

    ngOnInit() {
        this.lang.onChange().subscribe(() => {
            // this.siteList = [...this.siteList];
        });

        this.route.data.subscribe((data) => {
            // this.siteList = data.ammt03.DDL[0];
            // this.status = data.ammt03.DDL[8];
            // this.blacklist = data.ammt03.DDL[9];
            // this.status.push(this.statusAll);
            // this.blacklist.push(this.statusAll);
        });

        this.StatusList.push(this.statusAll);
        const saveData = this.saveData.retrive('AMMT03');
        if (saveData) { this.searchForm.patchValue(saveData); }
        this.page = this.searchForm.controls.page.value;
        if (!this.searchForm.controls.flagSearch.value) {
            this.beforeSearch = this.searchForm.controls.beforeSearch.value;
            this.statusPage = this.searchForm.controls.flagSearch.value;
        } else {
            this.statusPage = true;
        }
        this.search();
    }


    createForm() {
        this.searchForm = this.fb.group({
            InputSearch: null,
            status: true,
            flagSearch: true,
            beforeSearch: null,
            page: new Page(),
        });
    }

    onTableEvent(event) {
        this.page = event;
        this.statusPage = false;
        this.onSearch();
    }

    search() {
        this.page = new Page();
        this.statusPage = true;
        this.onSearch();
    }

    onSearch() {
        if (this.searchForm.controls['InputSearch'].value) {
            this.searchForm.controls['InputSearch'].setValue(this.searchForm.controls['InputSearch'].value.trim());
        }

        this.sv.getListTableMaster(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
            .pipe(finalize(() => {
                if (this.statusPage) {
                    this.beforeSearch = this.searchForm.value;
                    this.searchForm.controls.beforeSearch.setValue(this.searchForm.value);
                }
            }))
            .subscribe(
                (res: any) => {
                    this.trackingList = res.Rows;
                    this.page.totalElements = res.Rows.length ? res.Total : 0;
                });
    }

    edit(row) {
        this.router.navigate(['/tr/trmt01/detail', { trackingItemId: row.trackingItemId }], { skipLocationChange: true });
    }

    add() {
        this.router.navigate(['/tr/trmt01/detail', {}], { skipLocationChange: true });
    }

    ngOnDestroy() {
        if (this.router.url.split('/')[2] === 'trmt01') {
            this.searchForm.controls.flagSearch.setValue(false);
            this.saveData.save(this.searchForm.value, 'TRMT01');
        }
        //  else {
        //     this.searchForm.controls.flagSearch.setValue(true);
        //     this.saveData.save(this.searchForm.value, 'TRMT01');
        // }
    }

    remove(row) {
        this.modal.confirm('Message.STD000030').subscribe(
            (res) => {
                if (res) {
                    this.sv.deleteTracking(row).subscribe(
                        (response) => {
                            this.as.success(' ', 'Message.STD00014');
                            this.search();
                        }, (error) => {
                            console.log(error);
                            this.as.error(' ', 'Message.STD000032');
                        });
                }
            });
    }

}