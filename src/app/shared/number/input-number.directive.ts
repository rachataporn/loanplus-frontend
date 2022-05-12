import { Directive, Input, forwardRef, HostListener, Renderer2, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const defaultMin: number = -9999999999999;
const defaultMax: number = 9999999999999;

@Directive({
  selector: 'input[type="number"]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberDirective),
      multi: true
    }
  ]
})
export class InputNumberDirective implements ControlValueAccessor {
  private keyRegex: RegExp;
  private dataRegex: RegExp = new RegExp(/^\D{1}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']
  private inputValue: string;

  @Input() min: number = 0;
  @Input() max: number = defaultMax;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, "text-right");
    this.min = this.min < defaultMin ? defaultMin : this.min;
    this.max = this.max > defaultMax ? defaultMax : this.max;
    this.keyRegex = this.min < 0 ? new RegExp(/(\d|-)/) : new RegExp(/\d/);
  }

  onChange = (value: number) => { };
  onTouched = () => { };

  private limitRange(value: number) {
    if ((value < this.min && this.min < 0) || value > this.max) {
      const valueStr = String(value).slice(0, -1);
      return Number(valueStr);
    }
    else if (value < this.min && this.min >= 0) {
      return this.min;
    }
    return value;
  }
  private updateValue(value: number) {
    if (Number(this.inputValue) != value) {
      this.onChange(value);
      this.inputValue = String(value || '');
    }

  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (!String(event.key).match(this.keyRegex) && !this.specialKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event.target.value', '$event']) input(value, event) {

    let number = value ? Number(value) : null;
    let data: string = event.data;
    if (this.inputValue && !value && String(data).match(this.dataRegex)) { //prevent empty value from invalid number
      this.renderer.setProperty(this.el.nativeElement, 'value', this.inputValue);
    }
    else {
      const limitNumber = this.limitRange(number);
      if (number != limitNumber) {
        number = limitNumber;
        this.renderer.setProperty(this.el.nativeElement, 'value', String(number));
      }
      this.updateValue(limitNumber);
    }
  }

  @HostListener('blur') blur() {
    this.onTouched();
    if (this.el.nativeElement.value) {
      this.renderer.setProperty(this.el.nativeElement, 'value', Number(this.el.nativeElement.value));
    }
    else {
      this.renderer.setProperty(this.el.nativeElement, 'value', '');
    }
  }

  writeValue(value: number): void {
    this.renderer.setProperty(this.el.nativeElement, 'value', value);
    this.inputValue = String(value || '');
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }

}
