import { Component, Input, Output, EventEmitter, HostBinding, ElementRef, Renderer2, ViewEncapsulation, Optional, Inject } from '@angular/core';
import {
    AnimationTriggerMetadata,
    trigger,
    style,
    transition,
    animate,
    state
} from '@angular/animations';
import { LangService } from '@app/core';
import { MenuSelect } from './menu-select.model';
import { DOCUMENT } from '@angular/common';
import { merge, fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const slideAnimation = trigger('slideAnimation', [
    transition('void => *', [
        style({ transform : 'translateY(-2%)',  opacity: 0 ,visibility: 'hidden'}),
        animate('200ms ease-out',style({ transform : 'translateY(0)', opacity: 1,visibility: 'visible' }))
    ]),
    transition('* => void', [
        animate('200ms ease-out', style({ transform : 'translateY(-2%)',  opacity: 0,visibility: 'hidden' }))
    ])
])

@Component({
    selector: 'menu-tree',
    templateUrl: './menu-tree.component.html',
    styleUrls: ['./menu-select.scss'],
    animations: [slideAnimation],
    encapsulation: ViewEncapsulation.None,
})
export class MenuTreeComponent {
    @Input() menus: MenuSelect[];
    @Input() actives: any[] = [];
    @Output() selected = new EventEmitter<any>();
    @Output() outsideClick = new EventEmitter<void>();

    open = {}
    private disposeDocumentResizeListener = () => { };
    private readonly destroy = new Subject<void>();
    private readonly menuInput: HTMLElement;
    private menuDropdown: HTMLElement;
    @HostBinding('@slideAnimation') animation;
    constructor(
        private renderer: Renderer2,
        public lang: LangService,
        elementRef: ElementRef,
        @Optional() @Inject(DOCUMENT) private document: any
    ) {
        this.menuInput = elementRef.nativeElement;
    }
    ngOnInit() {
        this.menuDropdown = this.menuInput.parentElement;
        if (this.document) {
            merge(
                fromEvent(this.document, 'touchstart', { capture: true }),
                fromEvent(this.document, 'mousedown', { capture: true })
            )
                .pipe(takeUntil(this.destroy))
                .subscribe(($event) => this.handleOutsideClick($event));
        }
        this.actives.forEach((item) => {
            this.open[item] = true;
        })
    }
    ngOnDestroy() {
        this.disposeDocumentResizeListener();
        this.destroy.next();
        this.destroy.complete();
        this.renderer.removeChild(this.menuInput.parentNode, this.menuInput);

    }
    ngAfterContentInit() {
        this.appendDropdown();
        this.handleDocumentResize();
        this.updateDropdownPosition();
    }
    private appendDropdown() {
        const parent = document.querySelector("body");
        parent.appendChild(this.menuInput);
    }

    private handleDocumentResize() {
        this.disposeDocumentResizeListener = this.renderer.listen('window', 'resize', () => {
            this.updateAppendedDropdownPosition();
        });
    }

    private updateDropdownPosition() {
        this.updateAppendedDropdownPosition();
        this.menuInput.style.opacity = '1';
    }

    private updateAppendedDropdownPosition() {
        const parent = document.body;
        const selectRect: ClientRect = this.menuDropdown.getBoundingClientRect();
        const boundingRect = parent.getBoundingClientRect();
        const offsetTop = selectRect.top - boundingRect.top;
        const offsetLeft = selectRect.left - boundingRect.left;
        const topDelta = selectRect.height;
        this.menuInput.style.top = offsetTop + topDelta + 'px';
        this.menuInput.style.bottom = 'auto';
        this.menuInput.style.left = offsetLeft + 'px';
        this.menuInput.style.width = selectRect.width + 'px';
        this.menuInput.style.minWidth = selectRect.width + 'px';
    }

    private handleOutsideClick(event: any) {
        if (this.menuDropdown.contains(event.target)) {
            return;
        }

        if (this.menuInput.contains(event.target)) {
            return;
        }

        if (event.target && event.target.shadowRoot && event.path && event.path[0] && this.menuDropdown.contains(event.path[0])) {
            return;
        }

        this.outsideClick.emit();
    }

    hasChild(menu) {
        return this.menus.some((item) => {
            return item.Main == menu;
        })
    }

    children(value) {
        return this.menus.filter((item) => {
            return item.Main == value;
        })
    }
    toggle(value) {
        this.open[value] = !this.open[value];
    }
    onSelect(value: any) {
        this.selected.emit(value);
    }
    active(value: any) {
        return this.actives.includes(value);
    }
}