import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsBase } from './dynamic-forms.model';
import { LangService } from '@app/core';
import { DropdownForms } from '@app/shared/dynamic-forms/dynamic-forms.model';
import { Subject, Subscription } from 'rxjs';
import { first, filter } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-forms.component.html'
})
export class DynamicFormComponent {
  @Input() formsBase: FormsBase<any>;
  @Input() form: FormGroup;
  items = [];
  config: any[] = [];
  private readySub?:Subscription; 
  get isValid() { return this.form.controls[this.formsBase.key].valid; }
  
  constructor(public lang: LangService, private fb: FormBuilder) { }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.BindDropdown();
    });
    this.BindDropdown();
  }
  ngOnDestroy(){
    if(this.readySub) this.readySub.unsubscribe();
  }
  BindDropdown() {
    if (this.formsBase.controlType == 'List') {
      let item = this.formsBase as DropdownForms
      if(item.isObservableOptions && item.isReady){
      this.readySub =  item.isReady.pipe(filter(ready=>ready)).subscribe(()=>{
          this.items = [...item.options];
        })
      } else{
        this.items = [...item.options];
      }

    }
  }

  // createGroup() {
  //   const group = this.fb.group({});
  //   this.config.forEach(control => group.addControl(control.name, this.fb.control()));
  //   return group;
  // }
}
