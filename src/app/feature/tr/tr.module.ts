import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { TrRoutingModule } from './tr-routing.module';
import { ChartModule } from 'angular2-chartjs';
import { WebcamModule } from 'ngx-webcam';
import { AgmCoreModule } from '@agm/core';

// ---Component---
import { Trts01Component } from './trts01/trts01.component';
import { Trts0102Component } from './trts01-2/trts01-2.component';
import { Trts02Component } from './trts02/trts02.component';
import { Trts03Component } from './trts03/trts03.component';
import { Trts04Component } from './trts04/trts04.component';
import { Trts05Component } from './trts05/trts05.component';
import { Trts06Component } from './trts06/trts06.component';
import { Trts07Component } from './trts07/trts07.component';

import { Trmt01Component } from './trmt01/trmt01.component';

import { Trrp01Component } from './trrp01/trrp01.component';
import { Trrp02Component } from './trrp02/trrp02.component';
import { Trrp03Component } from './trrp03/trrp03.component';
import { Trrp04Component } from './trrp04/trrp04.component';
import { Trrp05Component } from './trrp05/trrp05.component';

// ---DetailComponent---
import { Trts01DetailComponent } from './trts01/trts01-detail.component';
import { Trts0102DetailComponent } from './trts01-2/trts01-2-detail.component';
import { Trts02DetailComponent } from './trts02/trts02-detail.component';
import { Trts03DetailComponent } from './trts03/trts03-detail.component';
import { Trts04DetailComponent } from './trts04/trts04-detail.component';
import { Trts05DetailComponent } from './trts05/trts05-detail.component';
import { Trts06DetailComponent } from './trts06/trts06-detail.component';

import { Trmt01DetailComponent } from './trmt01/trmt01-detail.component';

// ----LOV
import { Trts01LookupComponent } from './trts01/trts01-lookup.component';
import { Trts02LookupComponent } from './trts02/trts02-lookup.component';
import { Trts03LookupComponent } from './trts03/trts03-lookup.component';
import { Trts04LookupComponent } from './trts04/trts04-lookup.component';
import { Trts0401LookupComponent } from './trts04/trts0401-lookup.component';
import { Trts06LookupComponent } from './trts06/trts06-lookup.component';

import { Trrp01LookupComponent } from './trrp01/trrp01-lookup.component';

// ---Service---
import { Trts01Service } from './trts01/trts01.service';
import { Trts0102Service } from './trts01-2/trts01-2.service';
import { Trts02Service } from './trts02/trts02.service';
import { Trts03Service } from './trts03/trts03.service';
import { Trts04Service } from './trts04/trts04.service';
import { Trts05Service } from './trts05/trts05.service';
import { Trts06Service } from './trts06/trts06.service';
import { Trts07Service } from './trts07/trts07.service';

import { Trmt01Service } from './trmt01/trmt01.service';

import { Trrp01Service } from './trrp01/trrp01.service';
import { Trrp02Service } from './trrp02/trrp02.service';
import { Trrp03Service } from './trrp03/trrp03.service';
import { Trrp04Service } from './trrp04/trrp04.service';
import { Trrp05Service } from './trrp05/trrp05.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TrRoutingModule,
    SharedModule,
    TranslateModule,
    ChartModule,
    WebcamModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBrPDcGALMcZsq7tKos1lj_JbsnVqqROik',
      libraries: ['places']
    })
  ],
  declarations: [
    Trts01Component, Trts01DetailComponent, Trts01LookupComponent,
    Trts0102Component, Trts0102DetailComponent, Trts02LookupComponent,
    Trts02Component, Trts02DetailComponent,
    Trts03Component, Trts03DetailComponent, Trts03LookupComponent,
    Trts04Component, Trts04DetailComponent, Trts04LookupComponent, Trts0401LookupComponent,
    Trts05Component, Trts05DetailComponent,
    Trts06Component, Trts06DetailComponent, Trts06LookupComponent,
    Trts07Component, 
    Trmt01Component, Trmt01DetailComponent,
    Trrp01Component, Trrp01LookupComponent,
    Trrp02Component,
    Trrp03Component,
    Trrp04Component,
    Trrp05Component,
  ],
  entryComponents: [
    Trts01LookupComponent,
    Trts02LookupComponent,
    Trts03LookupComponent,
    Trts04LookupComponent,
    Trts0401LookupComponent,
    Trts06LookupComponent,
    Trrp01LookupComponent
  ],
  providers: [
    Trts01Service,
    Trts0102Service,
    Trts02Service,
    Trts03Service,
    Trts04Service,
    Trts05Service,
    Trts06Service,
    Trts07Service,
    Trmt01Service,
    Trrp01Service,
    Trrp02Service,
    Trrp03Service,
    Trrp04Service,
    Trrp05Service,
  ]
})
export class TrModule { }
