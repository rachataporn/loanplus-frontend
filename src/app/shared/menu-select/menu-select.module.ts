import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomService } from '../service/dom.service';
import { MenuTreeComponent } from './menu-tree.component';
import { MenuSelectComponent } from './menu-select.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [MenuSelectComponent,MenuTreeComponent],
  exports: [
        MenuTreeComponent,
        MenuSelectComponent
  ],
  providers: [ DomService]
})
export class MenuSelectModule { }