import { Component, OnInit, ContentChildren, QueryList, ViewChild, ContentChild, ViewChildren, Output, EventEmitter } from '@angular/core';
import { DataTableColumnDirective } from '@swimlane/ngx-datatable';

@Component({
  selector: 'custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.scss']
})
export class CustomCheckboxComponent  {

  @Output() change = new EventEmitter<any>();
  @ViewChild(DataTableColumnDirective) selectorColumn: DataTableColumnDirective;
  constructor() { 
    
  }

  ngAfterViewInit() {
    
  }

  onChange(event){
     this.change.emit(event);
  }

}
