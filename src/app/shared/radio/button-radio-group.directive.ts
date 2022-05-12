// tslint:disable:no-use-before-declare
import { ChangeDetectorRef, Directive, ElementRef, forwardRef,Output,EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const RADIO_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ButtonRadioGroupDirective),
  multi: true
};

/**
 * A group of radio buttons.
 * A value of a selected button is bound to a variable specified via ngModel.
 */
@Directive({
  selector: '[btnRadioGroup]',
  providers: [RADIO_CONTROL_VALUE_ACCESSOR]
})
export class ButtonRadioGroupDirective implements ControlValueAccessor {
  @Output() disableStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;
  private isDisable = false;
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    this._value = value;
  }

  get disabled(){
      return this.isDisable;
  }
  private _value: any;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  writeValue(value: any): void {
    this._value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
     this.isDisable = disabled;
     this.disableStateChange.emit(disabled);
  }
}