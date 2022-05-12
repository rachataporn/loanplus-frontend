import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoRoutingModule } from './demo-routing.module';
import { ProgramComponent } from './program/program.component';
import { AttributeLookupComponent } from './program/attribute-lookup.component';
import { AttributeLookupService } from './program/attribute-lookup.service';
import { programService } from './program/program.service';
import { SharedModule } from '../../shared';
import { ReactiveFormsModule } from '@angular/forms';
import { SingleLookupComponent } from './program/single-lookup.component';
import { SingleLookupService } from './program/single-lookup.service';
@NgModule({
  declarations: [ProgramComponent,AttributeLookupComponent,SingleLookupComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    DemoRoutingModule
  ],
  entryComponents:[AttributeLookupComponent,SingleLookupComponent],
  providers:[
    programService,AttributeLookupService,SingleLookupService
  ]
})
export class DemoModule { }
