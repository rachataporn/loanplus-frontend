import { CommonModule} from '@angular/common';
import { NgModule, ModuleWithProviders} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// App Breadcrumb Component
import { AppBreadcrumbService } from './app-breadcrumb.service';
import { AppBreadcrumbComponent } from './app-breadcrumb.component';

// @dynamic
@NgModule({
  imports: [ CommonModule, RouterModule,TranslateModule ],
  exports: [ AppBreadcrumbComponent ],
  declarations: [ AppBreadcrumbComponent ]
})
export class AppBreadcrumbModule {
  static forRoot(config?: any): ModuleWithProviders {
    return {
      ngModule: AppBreadcrumbModule,
      providers: [
        AppBreadcrumbService
      ]
    };
  }
}