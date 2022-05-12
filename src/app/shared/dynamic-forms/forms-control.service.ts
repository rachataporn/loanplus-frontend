import { Injectable }   from '@angular/core';
import { FormControl ,FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FormsBase } from './dynamic-forms.model';
import { RowState } from '../datatable/state.enum';
 
@Injectable()
export class FormsControlService {
  constructor(private fb:FormBuilder) {  }
  toFormGroup(forms: FormsBase<any>[] ) {
    let group: any = { };

    forms.forEach(form => {
      group[form.key] = form.required ? new FormControl(form.value || null, Validators.required)
                                        : new FormControl(form.value || null);
      (group[form.key] as FormControl).valueChanges.subscribe(
        val => {
          if(val != null){
            if (form.RowState == null || form.RowState == RowState.Add )
              form.RowState = RowState.Add;
            else form.RowState = RowState.Edit;
          }
          else {
            if (form.RowState == RowState.Add)
              form.RowState = null; 
            else form.RowState = RowState.Delete;
          }
          form.value = val;
        }
      )
    });
    return this.fb.group(group);
  }
}
