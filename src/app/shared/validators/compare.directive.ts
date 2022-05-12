import { Directive, Attribute, forwardRef, Input  } from '@angular/core';
import { Validator,  NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[compare]',
  providers: [{provide: NG_VALIDATORS,  useExisting: CompareDirective, multi: true}]
})
export class CompareDirective implements Validator {

  @Input('compare') controlNameToCompare : string;
  validate(c: AbstractControl): ValidationErrors | null {
    if(c.value === null || c.value.length === 0){
      return null;
    }
    const controlToCompare = c.root.get(this.controlNameToCompare);
    if(controlToCompare){
      const subscription:Subscription = controlToCompare.valueChanges.subscribe(()=>{
        c.updateValueAndValidity();
        subscription.unsubscribe();
      })
    }
    return controlToCompare && controlToCompare.value !== c.value ? { 'compare' : true } : null;
  }
}