import { Component, Input, ContentChildren, ViewChild, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { DataTableColumnDirective, DatatableComponent, DatatableRowDetailDirective } from '@swimlane/ngx-datatable'
import { Page } from './page.interface';
import { FormArray } from '@angular/forms';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';

@Component({
    selector: 'aaa-grid',
    templateUrl: './table-client.component.html',
    styleUrls: ['./table.component.scss']
})
/* server side paging & sorting clear checkbox on request. note:can persist checkbox state if manualy set rowIdentity */
export class TableClientComponent {
    @Input() rows: any[];
    @Input() rowSelect: any[] = [];
    @Input() loading: boolean = false;
    @Input() formArray: FormArray;
    @Input() pagination: boolean = true;
    @Input() trackByProp: string;
    @Input() rowIdentity: (x: any) => any = ((x: any) => x);
    @Input() summaryRow: boolean = false;
    page = new Page();
    pageSizes = Array.from(Array(20).keys()).map((v, i) => 10 + i * 10);

    constructor(private cd: ChangeDetectorRef) {
        if (!this.pagination) this.page.size = undefined;
    }

    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    @ContentChildren(DataTableColumnDirective, { descendants: true }) val: QueryList<DataTableColumnDirective>;
    @ContentChildren(CustomCheckboxComponent) checkColumn: QueryList<CustomCheckboxComponent>;

    ngAfterContentInit() {
        if (this.checkColumn.length === 0)
            this.datatable.columnTemplates = this.val;
    }
    ngAfterViewInit() {
        if (this.checkColumn.length > 0) {
            this.val.reset([...this.checkColumn.map(col => col.selectorColumn), ...this.val.toArray()]);
            this.datatable.columnTemplates = this.val;
            this.cd.detectChanges();
        }
    }

    onPageSize(value) {
        this.page.index = 0;
        this.page.size = Number(value);
        if (this.datatable.selectAllRowsOnPage) {
            this.rowSelect = [];
        }
    }

    onPage(event, focus?: boolean): void {
        this.page.index = event.offset;
        if (focus) {
            setTimeout(() => {
                let invalid = this.datatable.element.querySelector(".ng-invalid");
                if (invalid) invalid.scrollIntoView();
            }, 2);

        }
    }

    onSelect({ selected }) {
        if (selected) {
            this.rowSelect.splice(0, this.rowSelect.length);
            this.rowSelect.push(...selected);
        }

    }
    goLastPage() {
        const count = this.rows.length;
        let goOffset = (count) / this.page.size;
        this.onPage({ offset: Math.floor(goOffset) || 0 });
    }

    focusInvalid() {
        let firstInvalid = null;
        this.formArray.controls.forEach(function (control, index) {
            if (control.invalid) {
                if (!firstInvalid) firstInvalid = index;
            }
        }, this)
        if (firstInvalid || firstInvalid == 0) {
            let goOffset = (firstInvalid + 1) / this.page.size;
            this.onPage({ offset: Math.floor(goOffset) || 0 }, true);
        }
    }
}