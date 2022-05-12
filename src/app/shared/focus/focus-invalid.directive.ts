import { Directive, ElementRef, Input,OnChanges } from '@angular/core';
@Directive({
    selector: '[focusInvalid]'
})
export class FocusDirective implements OnChanges {

    @Input() focusInvalid;
    constructor(private elRef: ElementRef) {}
    
    ngOnChanges(){
       let input = this.elRef.nativeElement.querySelector('.ng-invalid');
       if(input) input.scrollIntoView(false);
     
    }
}
