import { Component, Input } from '@angular/core';
import { FormGroup,FormBuilder }        from '@angular/forms';
import { SubFormsBase }   from './sub-dynamic-forms.model';
import { LangService } from '@app/core';
import { DropdownSubForms, RadioSubForms } from '@app/shared/sub-dynamic-forms/sub-dynamic-forms.model';

@Component({
  selector: 'app-sub-dynamic-form',
  templateUrl: './sub-dynamic-forms.component.html'
})
export class SubDynamicFormComponent {
  @Input() formsBase: SubFormsBase<any>;
  @Input() form: FormGroup;
  items = [];
  config: any[] = [];
  get isValid() { return this.form.controls[this.formsBase.key].valid; }
  
  constructor(public lang: LangService,private fb:FormBuilder) { }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
        this.BindDropdown();
    });
    this.BindDropdown();
  }

  BindDropdown(){
    if(this.formsBase.controlType == 'List'){
      let item = this.formsBase as DropdownSubForms
      this.items = [...item.options];
    } else if (this.formsBase.controlType == 'Radio') {
      let item = this.formsBase as RadioSubForms
      this.items = [...item.options];
    }
  }

  // createGroup() {
  //   const group = this.fb.group({});
  //   this.config.forEach(control => group.addControl(control.name, this.fb.control()));
  //   return group;
  // }
}
