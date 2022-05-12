import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuRoutingModule } from './su-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared';


import { Sumt03Component } from './sumt03/sumt03.component';
import { Sumt04Component } from './sumt04/sumt04.component';
import { Sumt05Component } from './sumt05/sumt05.component';
import { Sumt06Component } from './sumt06/sumt06.component';
import { Sumt07Component } from './sumt07/sumt07.component';
import { Sumt08Component } from './sumt08/sumt08.component';


import { Sumt03DetailComponent } from './sumt03/sumt03-detail.component';
import { Sumt04DetailComponent } from './sumt04/sumt04-detail.component';
import { Sumt05DetailComponent } from './sumt05/sumt05-detail.component';
import { Sumt05ModalComponent } from './sumt05/sumt05-modal.component';
import { Sumt06DetailComponent } from './sumt06/sumt06-detail.component';
import { Sumt07DetailComponent } from './sumt07/sumt07-detail.component';
import { Sumt08DetailComponent } from './sumt08/sumt08-detail.component';


import { Sumt03Service } from './sumt03/sumt03.service';
import { Sumt04Service } from './sumt04/sumt04.service';
import { Sumt05Service } from './sumt05/sumt05.service';
import { Sumt06Service } from './sumt06/sumt06.service';
import { Sumt07Service } from './sumt07/sumt07.service';
import { Sumt08Service } from './sumt08/sumt08.service';
import { Sumt01Component } from './sumt01/sumt01.component';
import { Sumt01DetailComponent } from './sumt01/sumt01-detail.component';
import { Sumt01Service } from './sumt01/sumt01.service';

@NgModule({
  declarations: [  Sumt01Component, Sumt01DetailComponent,
                  Sumt03Component, Sumt03DetailComponent,
                  Sumt05Component, Sumt05DetailComponent,Sumt05ModalComponent,
                  Sumt06Component, Sumt06DetailComponent,
                  Sumt07Component, Sumt07DetailComponent,
                  Sumt08Component, Sumt08DetailComponent,
                  Sumt04Component, Sumt04DetailComponent,
  ],
  imports: [
    CommonModule,
    SuRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule
  ],
  entryComponents: [
    Sumt05ModalComponent,
  ],
  providers: [Sumt01Service,
              Sumt03Service,
              Sumt04Service,
              Sumt05Service,
              Sumt06Service,
              Sumt07Service,
              Sumt08Service,
            ]
})
export class SuModule { }
