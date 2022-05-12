
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { DbRoutingModule } from './db-routing.module';
import { ChartModule } from 'angular2-chartjs';
import { WebcamModule } from 'ngx-webcam';
import { AgmCoreModule } from '@agm/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";





// ---Component---
import { Dbmt04Component } from './dbmt04/dbmt04.component';
import { Dbmt05Component } from './dbmt05/dbmt05.component';
import { Dbmt06Component } from './dbmt06/dbmt06.component';
import { Dbmt16Component } from './dbmt16/dbmt16.component';
import { Dbmt08Component } from './dbmt08/dbmt08.component';
import { Dbmt09Component } from './dbmt09/dbmt09.component';
import { Dbmt10Component } from './dbmt10/dbmt10.component';
import { Dbmt111Component } from './dbmt11/dbmt11-1.component';
import { Dbmt112Component } from './dbmt11/dbmt11-2.component';
import { Dbmt12Component } from './dbmt12/dbmt12.component';
import { Dbmt07Component } from './dbmt07/dbmt07.component';
import { Dbmt17Component } from './dbmt17/dbmt17.component';
import { Dbmt18Component } from './dbmt18/dbmt18.component';
import { Dbmt19Component } from './dbmt19/dbmt19.component';
import { Dbmt20Component } from './dbmt20/dbmt20.component';
import { Dbmt21Component } from './dbmt21/dbmt21.component';

// ---DetailComponent---
import { Dbmt04DetailComponent } from './dbmt04/dbmt04-detail.component';
import { Dbmt05DetailComponent } from './dbmt05/dbmt05-detail.component';
import { Dbmt06DetailComponent } from './dbmt06/dbmt06-detail.component';
import { Dbmt16DetailComponent } from './dbmt16/dbmt16-detail.component';
import { Dbmt08DetailComponent } from './dbmt08/dbmt08-detail.component';
import { Dbmt09DetailComponent } from './dbmt09/dbmt09-detail.component';
import { Dbmt10DetailComponent } from './dbmt10/dbmt10-detail.component';
import { Dbmt111DetailComponent } from './dbmt11/dbmt11-1-detail.component';
import { Dbmt112DetailComponent } from './dbmt11/dbmt11-2-detail.component';
import { Dbmt12DetailComponent } from './dbmt12/dbmt12-detail.component';
import { Dbmt07DetailComponent } from './dbmt07/dbmt07-detail.component';
import { Dbmt17DetailComponent } from './dbmt17/dbmt17-detail.component';
import { Dbmt18DetailComponent } from './dbmt18/dbmt18-detail.component';
import { Dbmt19DetailComponent } from './dbmt19/dbmt19-detail.component';
import { Dbmt21DetailComponent } from './dbmt21/dbmt21-detail.component';

// ---Service---
import { Dbmt04Service } from './dbmt04/dbmt04.service';
import { Dbmt05Service } from './dbmt05/dbmt05.service';
import { Dbmt06Service } from './dbmt06/dbmt06.service';
import { Dbmt16Service } from './dbmt16/dbmt16.service';
import { Dbmt08Service } from './dbmt08/dbmt08.service';
import { Dbmt09Service } from './dbmt09/dbmt09.service';
import { Dbmt10Service } from './dbmt10/dbmt10.service';
import { Dbmt111Service } from './dbmt11/dbmt11-1.service';
import { Dbmt112Service } from './dbmt11/dbmt11-2.service';
import { Dbmt12Service } from './dbmt12/dbmt12.service';
import { Dbmt07Service } from './dbmt07/dbmt07.service';
import { Dbmt17Service } from './dbmt17/dbmt17.service';
import { Dbmt18Service } from './dbmt18/dbmt18.service';
import { Dbmt19Service } from './dbmt19/dbmt19.service';
import { Dbmt20Service } from './dbmt20/dbmt20.service';
import { Dbmt21Service } from './dbmt21/dbmt21.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DbRoutingModule,
    SharedModule,
    TranslateModule,
    ChartModule,
    WebcamModule,
    HighchartsChartModule,
    LeafletModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBrPDcGALMcZsq7tKos1lj_JbsnVqqROik',
      libraries: ['places']
    })
  ],
  declarations: [
    Dbmt04Component, Dbmt04DetailComponent,
    Dbmt05Component, Dbmt05DetailComponent,
    Dbmt06Component, Dbmt06DetailComponent,
    Dbmt16Component, Dbmt16DetailComponent,
    Dbmt09Component, Dbmt09DetailComponent,
    Dbmt08Component, Dbmt08DetailComponent,
    Dbmt10Component, Dbmt10DetailComponent,
    Dbmt111Component, Dbmt111DetailComponent,
    Dbmt112Component, Dbmt112DetailComponent,
    Dbmt12Component, Dbmt12DetailComponent,
    Dbmt07Component, Dbmt07DetailComponent,
    Dbmt17Component, Dbmt17DetailComponent,
    Dbmt18Component, Dbmt18DetailComponent,
    Dbmt19Component, Dbmt19DetailComponent,
    Dbmt20Component,
    Dbmt21Component, Dbmt21DetailComponent

  ],
  providers: [
    Dbmt04Service,
    Dbmt05Service,
    Dbmt06Service,
    Dbmt08Service,
    Dbmt16Service,
    Dbmt09Service,
    Dbmt08Service,
    Dbmt10Service,
    Dbmt111Service,
    Dbmt112Service,
    Dbmt12Service,
    Dbmt07Service,
    Dbmt17Service,
    Dbmt18Service,
    Dbmt19Service,
    Dbmt20Service,
    Dbmt21Service,
  ]
})
export class DbModule { }
