import { Component, forwardRef, Input, ViewChild, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

//handle keypress by input number directive
@Component({
    selector: 'year-input',
    template: `
     <input #year [disabled]="isDisable" type="number" (change)="change($event)" (blur)="blur()" class="form-control" [ngClass]="inputClass" placeholder="{{holder}}" style="text-align: left !important;">
  `,
    styles: [],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => YearInputComponent),
            multi: true
        }
    ]
})
export class YearInputComponent implements ControlValueAccessor {
    private min = 1000;
    private max = 9999;
    @Input() inputClass: string;
    @Input() holder: string;
    @Input() minYear: number = this.min;
    @Input() maxYear: number = this.max;
    @ViewChild('year') textbox;
    isDisable: boolean = false;
    private previousValue = null;
    constructor(private renderer: Renderer2
    ) { }

    ngOnInit() {
        if (this.minYear < this.min) this.minYear = this.min;
        if (this.maxYear > this.max) this.maxYear = this.max;
    }

    onChange = (value: number) => { };

    onTouched = () => { };

    private ToValue(value: string | number): number {
        // return value ? Number(value) - 543 : null;
        return value ? Number(value) : null;
    }
    private ToDisplay(value: number): string {
        // return value ? (value + 543).toString() : null;
        return value ? (value).toString() : null;
    }

    writeValue(value: number): void {
        this.previousValue = value;
        const input = this.textbox.nativeElement;
        this.renderer.setProperty(input, 'value', this.ToDisplay(value));
    }
    change(event: any) {
        const input = this.textbox.nativeElement;
        const value = Number(event.target.value);
        const limitValue = this.limitValue(value);

        if (value !== limitValue) {
            this.renderer.setProperty(input, 'value', limitValue);
        }

        if (this.previousValue != limitValue) {
            this.previousValue = limitValue;
            this.onChange(this.ToValue(limitValue));
        }
    }
    limitValue(value: number) {
        if (value < this.minYear) {
            return this.minYear;
        }
        if (value > this.maxYear) {
            return this.maxYear;
        }
        return value;
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
}