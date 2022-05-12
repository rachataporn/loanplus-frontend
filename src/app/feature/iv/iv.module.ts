import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { IvRoutingModule } from './iv-routing.module';

// ---Component---
import { Ivts01Component } from './ivts01/ivts01.component';
import { Ivts02Component } from './ivts02/ivts02.component';
import { Ivts03Component } from './ivts03/ivts03.component';
import { Ivts04Component } from './ivts04/ivts04.component';
import { Ivts05Component } from './ivts05/ivts05.component';
import { Ivts06Component } from './ivts06/ivts06.component';
import { Ivts07Component } from './ivts07/ivts07.component';
import { Ivts08Component } from './ivts08/ivts08.component';

// ---DetailComponent---
import { Ivts03DetailComponent } from './ivts03/ivts03-detail.component';
import { Ivts02DetailComponent } from './ivts02/ivts02-detail.component';
import { Ivts08DetailComponent } from './ivts08/ivts08.detail.component';


// ---Service---
import { Ivts01Service } from './ivts01/ivts01.service';
import { Ivts02Service } from './ivts02/ivts02.service';
import { Ivts03Service } from './ivts03/ivts03.service';
import { Ivts04Service } from './ivts04/ivts04.service';
import { Ivts05Service } from './ivts05/ivts05.service';
import { Ivts06Service } from './ivts06/ivts06.service';
import { Ivts07Service } from './ivts07/ivts07.service';
import { Ivts08Service } from './ivts08/ivts08.service';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IvRoutingModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [
    Ivts01Component,
    Ivts02Component,
    Ivts03Component, Ivts03DetailComponent,
    Ivts02Component, Ivts02DetailComponent,
    Ivts03Component,
    Ivts04Component,
    Ivts05Component,
    Ivts06Component,
    Ivts07Component,
    Ivts08Component,Ivts08DetailComponent,
  ],
  entryComponents: [],
  providers: [
    Ivts01Service,
    Ivts02Service,
    Ivts03Service,
    Ivts04Service,
    Ivts05Service,
    Ivts06Service,
    Ivts07Service,
    Ivts08Service
  ]
})
export class IvModule { }
