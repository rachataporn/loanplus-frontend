import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader/component-loader.factory';
import { PositioningService } from 'ngx-bootstrap/positioning/positioning.service';

import { warnOnce } from 'ngx-bootstrap/utils/warn-once';
import { BsDatepickerInputDirective } from './bs-datepicker-input.directive';
import { BsDatepickerDirective } from './bs-datepicker.component';
import { BsDatepickerConfig } from './bs-datepicker.config';
import { BsDaterangepickerInputDirective } from './bs-daterangepicker-input.directive';
import { BsDaterangepickerDirective } from './bs-daterangepicker.component';
import { BsDaterangepickerConfig } from './bs-daterangepicker.config';

import { BsLocaleService } from './bs-locale.service';
import { BsDatepickerActions } from './reducer/bs-datepicker.actions';
import { BsDatepickerEffects } from './reducer/bs-datepicker.effects';
import { BsDatepickerStore } from './reducer/bs-datepicker.store';
import { BsCalendarLayoutComponent } from './themes/bs/bs-calendar-layout.component';
import { BsCurrentDateViewComponent } from './themes/bs/bs-current-date-view.component';
import { BsCustomDatesViewComponent } from './themes/bs/bs-custom-dates-view.component';
import { BsDatepickerContainerComponent } from './themes/bs/bs-datepicker-container.component';
import { BsDatepickerDayDecoratorComponent } from './themes/bs/bs-datepicker-day-decorator.directive';
import { BsDatepickerNavigationViewComponent } from './themes/bs/bs-datepicker-navigation-view.component';
import { BsDaterangepickerContainerComponent } from './themes/bs/bs-daterangepicker-container.component';
import { BsDaysCalendarViewComponent } from './themes/bs/bs-days-calendar-view.component';
import { BsMonthCalendarViewComponent } from './themes/bs/bs-months-calendar-view.component';
import { BsTimepickerViewComponent } from './themes/bs/bs-timepicker-view.component';
import { BsYearsCalendarViewComponent } from './themes/bs/bs-years-calendar-view.component';

const _exports = [
  BsDatepickerContainerComponent,
  BsDaterangepickerContainerComponent,

  BsDatepickerDirective,
  BsDatepickerInputDirective,

  BsDaterangepickerInputDirective,
  BsDaterangepickerDirective
];

@NgModule({
  imports: [CommonModule],
  declarations: [
    BsDatepickerDayDecoratorComponent,
    BsCurrentDateViewComponent,
    BsDatepickerNavigationViewComponent,
    BsTimepickerViewComponent,

    BsCalendarLayoutComponent,
    BsDaysCalendarViewComponent,
    BsMonthCalendarViewComponent,
    BsYearsCalendarViewComponent,

    BsCustomDatesViewComponent,

    ..._exports
  ],
  entryComponents: [
    BsDatepickerContainerComponent,
    BsDaterangepickerContainerComponent
  ],
  exports: _exports
})
export class BsDatepickerModule {
  constructor() {
    warnOnce(`BsDatepickerModule is under development,
      BREAKING CHANGES are possible,
      PLEASE, read changelog`);
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BsDatepickerModule,
      providers: [
        ComponentLoaderFactory,
        PositioningService,
        BsDatepickerStore,
        BsDatepickerActions,
        BsDatepickerConfig,
        BsDaterangepickerConfig,
        BsDatepickerEffects,
        BsLocaleService
      ]
    };
  }
}
