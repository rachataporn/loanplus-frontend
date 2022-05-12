import { Component, forwardRef, ElementRef, Input, ViewChild, Renderer2, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { LookupService } from './lookup.service';
import { Size } from '../modal/modal.service';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
    selector: 'lookup-input',
    template: `
  <div class="input-group">
     <input #textbox [disabled]="isDisable || searching" type="text" (change)="change($event)" (blur)="blur()" class="form-control" [class.form-control-sm]="small" placeholder="{{holder}}">
     <div class="input-group-append">
      <button type="button" class="btn btn-warning" [class.btn-sm]="small" [disabled]="isDisable || searching" (click)="open(false)" >
        <i class="fas fa-cog fa-spin" [hidden]="!searching"></i>  
        <i class="fas fa-glasses" [hidden]="searching"></i>
      </button>
    </div>
</div>
  `,
    styles: [],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LookupInputComponent),
            multi: true
        }
    ]
})
export class LookupInputComponent implements ControlValueAccessor {
    @Input() small: boolean = false;
    @Input() size: Size;
    @Input() holder: string;
    @Input() lookupName: string;
    @Input() content: Component;
    @Input() param: any = {};
    @Input() searchUrl: string;
    @Input() descUrl: string;
    @Input() keyColumn: string;
    @Input() detailFlag: boolean = false;
    @Input() detailCheck: boolean = false;
    @Output() detail = new EventEmitter();
    @ViewChild('textbox') textbox;
    searching: boolean = false;
    isDisable: boolean = false;
    descriptions: any[];
    prev = null;
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private bsModalService: BsModalService,
        private lookupService: LookupService
    ) { }

    ngOnInit() {
        if (!this.lookupName || !this.content || !this.keyColumn) {
            throw ("please provide lookupName, content, and keyColumn");
        }
        const form = this.el.nativeElement.closest("form");
        this.descriptions = form.querySelectorAll(`[lookupParent='${this.lookupName}']`);
    }

    onChange = (key: any) => { };

    onTouched = () => { };

    open(clearValueOnClose: boolean) {
        this.onTouched();
        const initialState = {
            keyword: clearValueOnClose ? this.textbox.nativeElement.value : null,
            parameter: this.param
        };
        const result = new Subject<any>();
        const modal = this.bsModalService.show(this.content, { initialState, ignoreBackdropClick: true, class: this.size || Size.large });
        modal.content.result = result;
        result.subscribe(
            (res) => {
                if (this.detailFlag) {
                    if ((res !== null && res != this.prev) || (res === null && res != this.prev && clearValueOnClose)) {
                        this.writeValue(res.value);
                        this.onChange(res.value);
                        this.detail.emit(res);
                    }
                    else if (clearValueOnClose) this.writeValue(res.value);
                } else {
                    if ((res !== null && res != this.prev) || (res === null && res != this.prev && clearValueOnClose)) {
                        this.writeValue(res);
                        this.onChange(res);
                    }
                    else if (clearValueOnClose) this.writeValue(res);
                }
            })
    }

    openDetailCheck(clearValueOnClose: boolean) {
        this.onTouched();
        const initialState = {
            keyword:  this.textbox.nativeElement.value,
            parameter: this.param
        };
        const result = new Subject<any>();
        const modal = this.bsModalService.show(this.content, { initialState, ignoreBackdropClick: true, class: this.size || Size.large });
        modal.content.result = result;
        result.subscribe(
            (res) => {
                if (this.detailFlag) {
                    if ((res !== null && res != this.prev) || (res === null && res != this.prev && clearValueOnClose)) {
                        this.writeValue(res.value);
                        this.onChange(res.value);
                        this.detail.emit(res);
                    }
                    else if (clearValueOnClose) this.writeValue(res.value);
                } else {
                    if ((res !== null && res != this.prev) || (res === null && res != this.prev && clearValueOnClose)) {
                        this.writeValue(res);
                        this.onChange(res);
                    }
                    else if (clearValueOnClose) this.writeValue(res);
                }
            })
    }

    private search(): Observable<any> {
        return this.lookupService.search(this.searchUrl || `${this.lookupName}/search`, Object.assign(this.param || {}, { keyword: this.textbox.nativeElement.value }), this.keyColumn)
    }
    private getDescription(value: any): Observable<any> {
        return this.lookupService.getDescription(this.descUrl || `${this.lookupName}/description`, Object.assign(this.param || {}, { key: value }))
    }

    private bindDescription() {
        if (this.descriptions && this.descriptions.length > 0) {
            let value = this.textbox.nativeElement.value;
            if (value) {
                this.getDescription(value).subscribe(
                    (res) => {
                        this.descriptions.forEach(function (desc) {
                            this.renderer.setProperty(desc, 'value', res[desc.name]);
                        }, this)
                    }
                )
            }
            else {
                this.descriptions.forEach(function (desc) {
                    this.renderer.setProperty(desc, 'value', null);
                }, this)
            }
        }
    }

    writeValue(key: any): void {
        const input = this.textbox.nativeElement;
        this.prev = key;
        this.renderer.setProperty(input, 'value', key);
        this.bindDescription();
    }

    registerOnChange(fn: (key: any) => void): void {
        this.onChange = fn;
    }
    change(event) {
        if (event.target.value) {
            this.searching = true;
            this.search().pipe(finalize(() => { this.searching = false })).subscribe(
                (res) => {
                    if (res) {
                        this.writeValue(res);
                        this.onChange(res);
                    }
                    else {
                        if(this.detailCheck) {
                            this.openDetailCheck(false);
                        } else {
                            this.open(true);
                        }
                    }
                }
            )
        }
        else {
            this.writeValue(null);
            this.onChange(null);
        }
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