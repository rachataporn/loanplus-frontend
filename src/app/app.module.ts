import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CoreModule } from '@app/core';
import { AccountModule } from './account/account.module';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoadingComponent } from './loading/loading.component';
import { NgxImageCompressService } from 'ngx-image-compress';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CoreModule,
    AccountModule,
    AppRoutingModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [NgxImageCompressService],
  declarations: [
    AppComponent,
    LoadingComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
