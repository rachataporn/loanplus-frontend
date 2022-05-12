import { ChangeDetectorRef, Directive, ElementRef, forwardRef, Host, Renderer2 } from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors,
  Validator
} from '@angular/forms';
import { parseDate } from 'ngx-bootstrap/chronos/create/local';
import { formatDate } from 'ngx-bootstrap/chronos/format';
import { getLocale } from 'ngx-bootstrap/chronos/locale/locales';
import { isAfter, isBefore } from 'ngx-bootstrap/chronos/utils/date-compare';
import { isDate, isDateValid } from 'ngx-bootstrap/chronos/utils/type-checks';
import { BsDatepickerDirective } from './bs-datepicker.component';
import { BsDatepickerConfig } from './bs-datepicker.config';
import { BsLocaleService } from './bs-locale.service';
import './utils/be-year'; // add this for buddhist era.
const BS_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line
  useExisting: forwardRef(() => BsDatepickerInputDirective),
  multi: true
};

const BS_DATEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => BsDatepickerInputDirective),
  multi: true
};

@Directive({
  selector: `input[bsDatepicker]`,
  host: {
    '(change)': 'onChange($event)',
    '(keyup.esc)': 'hide()',
    '(blur)': 'onBlur()'
  },
  providers: [BS_DATEPICKER_VALUE_ACCESSOR, BS_DATEPICKER_VALIDATOR]
})
export class BsDatepickerInputDirective
  implements ControlValueAccessor, Validator {
  private _onChange = Function.prototype;
  private _onTouched = Function.prototype;
  private _validatorChange = Function.prototype;
  private _value: Date;
  constructor(@Host() private _picker: BsDatepickerDirective,
    private _localeService: BsLocaleService,
    private _renderer: Renderer2,
    private _elRef: ElementRef,
    private changeDetection: ChangeDetectorRef) {

    // update input value on datepicker value update
    this._picker.bsValueChange.subscribe((value: Date) => {
      this._setInputValue(value);
      if (!this._value || (this._value !== value)) {
        this._value = value;
        this._onChange(value);
        this._onTouched();
      }
      this.changeDetection.markForCheck();
    });

    // update input value on locale change
    this._localeService.localeChange.subscribe(() => {
      this._setInputValue(this._value);
    });
  }
  ngOnInit() {
    let div = this._renderer.createElement('div');
    let label = this._renderer.createElement('label');
    let icon = this._renderer.createElement('i');

    this._renderer.setAttribute(div, "class", "date-wrap");
    this._renderer.setAttribute(label, "class", "input-icon");
    this._renderer.setAttribute(icon, "class", "far fa-calendar-minus");

    this._renderer.appendChild(label, icon);

    let group = this._elRef.nativeElement.parentElement;
    this._renderer.addClass(this._elRef.nativeElement, "text-center");
    this._renderer.appendChild(div, this._elRef.nativeElement);
    this._renderer.appendChild(div, label);
    let validate = group.querySelector('.invalid-feedback');
    if(validate)
     this._renderer.appendChild(div,validate);
    this._renderer.appendChild(group, div);

    this._renderer.listen(label, 'click', (evt) => {
      this._elRef.nativeElement.click();
    })
  }
  _setInputValue(value: Date): void {
    const initialDate = !value ? ''
      : formatDate(value, this._picker._config.dateInputFormat, this._localeService.currentLocale);
    this._renderer.setProperty(this._elRef.nativeElement, 'value', initialDate);
  }

  onChange(event: any) {
    let date = this.parseToDateOrNull(event.target.value);
    if (
      this._picker.minDate && isBefore(date, this._picker.minDate, 'date')
      || this._picker.maxDate && isAfter(date, this._picker.maxDate, 'date')
      || !isDateValid(date)
    ) {
      date = null;
    }

    this._setInputValue(date);
    this.writeValue(date);
    this._onChange(this._value);
    this._onTouched();
  }
  parseToDateOrNull(value: Date | string): Date {
    let result = parseDate(value, this._picker._config.dateInputFormat, this._localeService.currentLocale);
    return result;
  }
  validate(c: AbstractControl): ValidationErrors | null {
    const _value: Date | string = c.value;

    if (_value === null || _value === undefined || _value === '') {
      return null;
    }

    if (isDate(_value)) {
      const _isDateValid = isDateValid(_value);
      if (!_isDateValid) {
        return { bsDate: { invalid: _value } };
      }

      if (this._picker && this._picker.minDate && isBefore(_value, this._picker.minDate, 'date')) {
        return { bsDate: { minDate: this._picker.minDate } };
      }

      if (this._picker && this._picker.maxDate && isAfter(_value, this._picker.maxDate, 'date')) {
        return { bsDate: { maxDate: this._picker.maxDate } };
      }
    }
  }

  registerOnValidatorChange(fn: () => void): void {
    this._validatorChange = fn;
  }

  writeValue(value: Date | string) {
    if (!value) {
      this._value = null;
    } else {
      const _localeKey = this._localeService.currentLocale;
      const _locale = getLocale(_localeKey);
      if (!_locale) {
        throw new Error(
          `Locale "${_localeKey}" is not defined, please add it with "defineLocale(...)"`
        );
      }
      if (value instanceof Date) {
        (value as Date).setHours(0, 0, 0, 0);
      }
      this._value = this.parseToDateOrNull(value);
    }

    this._picker.bsValue = this._value;
  }

  setDisabledState(isDisabled: boolean): void {
    this._picker.isDisabled = isDisabled;
    if (isDisabled) {
      this._renderer.setAttribute(this._elRef.nativeElement, 'disabled', 'disabled');

      return;
    }
    this._renderer.removeAttribute(this._elRef.nativeElement, 'disabled');
  }

  registerOnChange(fn: (value: any) => any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => any): void {
    this._onTouched = fn;
  }

  onBlur() {
    this._onTouched();
  }

  hide() {
    this._picker.hide();
  }
}
