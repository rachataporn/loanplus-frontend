import { Component, forwardRef, Input, ViewChild, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MenuSelect } from './menu-select.model';
import { LangService } from '@app/core';
@Component({
    selector: 'menu-select',
    templateUrl: './menu-select.component.html',
    styleUrls: ['./menu-select.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MenuSelectComponent),
            multi: true
        }
    ]
})
export class MenuSelectComponent implements ControlValueAccessor {

    @Input() menus: MenuSelect[];
    @Input() placeholder: string = "please select";

    value: any;
    disabled: boolean = false;

    isOpen: boolean = false;
    private menuTree = [];
    private actives = [];
    private menu = { TextTha: '', TextEng: '' }

    constructor(private el: ElementRef, public lang: LangService
    ) { }

    onChange = (value: any) => { };

    onTouched = () => { };

    ngOnInit() {
        if (!this.menus) throw ('please provide menus');
    }
    toggle() {
        if (!this.isOpen) {
            this.open();
        }
        else {
            this.close();
        }
    }

    private open() {
        this.isOpen = true;
    }
    public close() {
        this.isOpen = false;
    }
    private orderMenu(currentValue: MenuSelect) {
        let parent = this.menus.find((item) => {
            return item.Value == currentValue.Main;
        });
        this.menuTree.unshift(currentValue);
        if (parent) {
            this.orderMenu(parent);
        }
    }

    private setSelectedMenu() {
        this.menuTree = [];
        this.actives = [];
        let TextTha = '';
        let TextEng = '';
        this.menu = null;
        if (this.currentMenu) {
            this.orderMenu(this.currentMenu);
            this.menuTree.forEach((item) => {
                this.actives.push(item.Value);
                TextTha += (TextTha ? ' > ' : '') + item.TextTha;
                TextEng += (TextEng ? ' > ' : '') + item.TextEng;
            })
            this.menu = { TextTha: TextTha, TextEng: TextEng }
        }
    }
    get display() {
        return this.menu ? this.menu['Text' + this.lang.CURRENT] : this.placeholder;
    }
    get currentMenu() {
        return this.menus.find((item) => {
            return item.Value == this.value;
        })
    }

    public onSelected(value) {
        this.value = value;
        this.onChange(this.value);
        this.setSelectedMenu();
        this.close();
    }

    clear() {
        if (!this.disabled) {
            this.onSelected(null);
        }
    }

    writeValue(value: any): void {
        this.value = value;
        this.setSelectedMenu();
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}