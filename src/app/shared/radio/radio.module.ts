import { NgModule, ModuleWithProviders } from '@angular/core';

import { ButtonRadioDirective } from './button-radio.directive';
import { ButtonRadioGroupDirective } from './button-radio-group.directive';

@NgModule({
  declarations: [ ButtonRadioDirective, ButtonRadioGroupDirective],
  exports: [ ButtonRadioDirective, ButtonRadioGroupDirective]
})
export class RadioModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: RadioModule, providers: [] };
  }
}