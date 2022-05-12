import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
    selector: 'modal-layout',
    templateUrl: './modal-layout.component.html',
})
export class ModalLayoutComponent {

    @Input() header: string;
    @Output() onClose = new EventEmitter();
    constructor(

    ) { }
    close() {
        this.onClose.emit();
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.onClose.emit();
    }
}
