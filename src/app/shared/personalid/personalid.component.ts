import { Component, forwardRef, Input, ViewChild, Renderer2, OnInit, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl, ValidationErrors, Validator } from '@angular/forms';

const keyCodes = {
    minus: 189,
    dot: 190,
    e: 69,
    Backspace: 8,
    Tab: 9,
    Home: 36,
    ArrowLeft: 37,
    ArrowRight: 39,
    Delete: 46,
    ControlV: 86
};

@Component({
    selector: 'personalid-input',
    template: `
        <input #personalid type="text" [disabled]="isDisable"
        (keydown)="handleKeyDown($event)" (change)="change($event)" (blur)="blur()"
        class="form-control text-center" [ngClass]="inputClass" placeholder="{{holder}}">
    `,
    styles: [],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PersonalIdInputComponent),
            multi: true
        }, {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => PersonalIdInputComponent),
            multi: true
        }
    ]
})
export class PersonalIdInputComponent implements ControlValueAccessor, Validator {
    @Input() inputClass: string;
    @Input() holder: string;
    @ViewChild('personalid') textbox;
    isDisable: Boolean = false;
    constructor(private renderer: Renderer2) { }

    onChange = (value: number) => { };

    onTouched = () => { };

    writeValue(value: number): void {
        const input = this.textbox.nativeElement;
        this.renderer.setProperty(input, 'value', value);
    }
    change(event: any) {
        const value = event.target.value;
        this.onChange(value);
    }

    validate(c: AbstractControl): ValidationErrors | null {
        const _value: string = c.value;
        if (_value === null || _value === undefined || _value === '') {
            return null;
        }
        if (_value.length === 13) {
            if (!this.checkDigit(_value)) {
                return { invalid: _value };
            }
        } else if (_value.length < 13) {
            if (_value.length === 10) {
                if (!this.validateTIN(_value)) {
                    return { invalid: _value };
                }
            } else {
                return { minlength: true };
            }
        }
    }

    private validateTIN(TIN: string): boolean {
        const regex = /^\d{10}$/;
        return regex.test(TIN);
    }

    handleKeyDown(event: KeyboardEvent) {
        const value = this.textbox.nativeElement.value;
        if (!this.isDisable) {
            switch (event.which) {
                case keyCodes.Backspace:
                    break;
                case keyCodes.ArrowLeft:
                    break;
                case keyCodes.ArrowRight:
                    break;
                case keyCodes.Home:
                    break;
                case keyCodes.Delete:
                    break;
                case keyCodes.Tab:
                    break;
                default:
                    if (value.length < 13) {
                        const reg = new RegExp(/^\d+$/);
                        if (!reg.test(event.key) && !keyCodes.ControlV) {
                            event.preventDefault();
                            return false;
                        }
                    } else {
                        event.preventDefault();
                        return false;
                    }
            }
        }
    }
    registerOnChange(fn: (value: any) => void): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
    blur() {
        this.onTouched();
    }
    setDisabledState(isDisabled: boolean): void {
        this.isDisable = isDisabled;
    }
    checkDigit(value) {
        let checkSum = 0;
        let result = 0;
        for (let i = 0; i < value.length - 1; i++) {
            checkSum = checkSum + (Number(value[i]) * (value.length - i));
        }
        result = (11 - (checkSum % 11)) % 10;
        return result === Number(value[12]);
    }
}
