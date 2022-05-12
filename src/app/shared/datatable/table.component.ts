import { Component, Input, Output, EventEmitter, ContentChildren, ViewChild, QueryList, SimpleChanges, ContentChild } from '@angular/core';
import { DataTableColumnDirective, DatatableComponent, DatatableRowDetailDirective } from '@swimlane/ngx-datatable'
import { Page } from './page.interface';

import { LangService } from '@app/core';
@Component({
    selector: 'aaa-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
/* server side paging & sorting clear checkbox on request. note:can persist checkbox state if manualy set rowIdentity */
export class TableComponent {

    @Output() onTableEvent = new EventEmitter<any>();
    @Input() rows: any[];
    @Input() rowSelect: any[] = [];
    @Input() loading: boolean = false;
    @Input() count: number; //remove later
    @Input() selectOnePage: boolean = false;
    @Input() rowIdentity: (x: any) => any = ((x: any) => x);
    @Input() summaryRow: boolean = false;
    @Input() page = new Page();
    pageSizes = Array.from(Array(20).keys()).map((v, i) => 10 + i * 10);

    constructor(private lang: LangService) {
        if (this.count) this.page.totalElements = this.count; //remove later
    }

    ngOnChanges(changes: SimpleChanges) { //remove later
        if (changes['count']) {
            this.page.totalElements = this.count;
        }
    }

    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    @ContentChildren(DataTableColumnDirective) val: QueryList<DataTableColumnDirective>;
    @ContentChild(DatatableRowDetailDirective) rowDetail: DatatableRowDetailDirective;

    ngAfterContentInit() {
        this.datatable.columnTemplates = this.val;
        this.datatable.rowDetail = this.rowDetail;
    }

    onSort(event): void {
        this.datatable.offset = this.page.index;
        let prop: string = event.sorts[0].prop;
        if (prop.includes("{lang}")) {
            prop = prop.replace(/\{lang\}/g, this.lang.CURRENT);
        }
        this.page.sort = prop + " " + event.sorts[0].dir;
        this.onTableEvent.emit(this.page);
    }

    onPage(event): void {
        this.page.index = event.offset;
        this.onTableEvent.emit(this.page);
    }

    onPageSize(value) {
        this.page.index = 0;
        this.page.size = Number(value);
        if (this.datatable.selectAllRowsOnPage) {
            this.rowSelect = [];
        }
        this.onTableEvent.emit(this.page);
    }

    onChecked({ selected }) {
        this.rowSelect.splice(0, this.rowSelect.length);
        this.rowSelect.push(...selected);
    }

    toggleExpandRow(row) {
        this.datatable.rowDetail.toggleExpandRow(row);
    }
}