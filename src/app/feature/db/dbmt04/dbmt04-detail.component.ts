import { Component, OnInit } from '@angular/core';
import { ListItem, Dbmt04Service } from './dbmt04.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from '@app/shared';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dbmt04-detail',
  templateUrl: './dbmt04-detail.component.html',
  styleUrls: ['./dbmt04-detail.component.scss']
})
export class Dbmt04DetailComponent implements OnInit {
  listItem: ListItem = {} as ListItem;

  listItemGroups = [];
  listItemForm: FormGroup;
  submitted = false;
  saving = false;
  focusToggle = false;
  constructor(
    private fb: FormBuilder,
    private ds: Dbmt04Service,
    private as: AlertService,
    private router: Router,
    private modal: ModalService,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  createForm() {
    this.listItemForm = this.fb.group({
      ListItemGroupCode: [null, [Validators.required
        // , Validators.pattern(/^[A-Za-z0-9]+$/)
      ]],
      SystemCode: [{ value: null, disabled: true }],
      ListItemCode: [null, [Validators.required,Validators.pattern(/^[A-Za-z0-9]+$/)]],
      ListItemNameTha: [null, [Validators.required,Validators.pattern(/\S+/)]],
      ListItemNameEng: null,
      Sequence: [null, [Validators.required, Validators.min(1),Validators.max(999999999)]],
      Remark: null,
      Active: true,
    });
    this.listItemForm.controls.ListItemGroupCode.valueChanges
      .subscribe(value => {
        let system = null;
        if (value) system = this.listItemGroups.find(group => group.ListItemGroupCode == value).SystemCode;
        this.listItemForm.controls.SystemCode.setValue(system);
      })
  }
  get ListItemGroupCode() {
    return this.listItemForm.controls.ListItemGroupCode;
  }
  get ListItemCode() {
    return this.listItemForm.controls.ListItemCode;
  }
  get Sequence() {
    return this.listItemForm.controls.Sequence;
  }
  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.listItem = data.listItem.detail;
      this.listItemGroups = data.listItem.master.ListItemGroups;
      this.rebuildForm();
    });
  }

  rebuildForm() {
    this.listItemForm.markAsPristine();
    if (this.listItem.RowVersion) {
      this.listItemForm.patchValue(this.listItem);
      this.listItemForm.controls.ListItemGroupCode.disable({emitEvent:false});
      this.listItemForm.controls.ListItemCode.disable({emitEvent:false});
    }

  }

  prepareSave(values: Object) {
    Object.assign(this.listItem, values);
  }

  onSubmit() {
    this.submitted = true;
    if (this.listItemForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    this.saving = true;
    this.prepareSave(this.listItemForm.getRawValue());
    this.ds.saveListItem(this.listItem).pipe(
      switchMap(()=>this.ds.getListItem(this.listItem.ListItemGroupCode,this.listItem.ListItemCode)),
      finalize(() => {
        this.saving = false;
        this.submitted = false;
      }))
      .subscribe((res: ListItem) => {
        if (res) {
          this.listItem = res;
          this.rebuildForm();
          this.as.success("", "Message.STD00006");
        }
      });
  }

  back() {
    this.router.navigate(['/db/dbmt04'], { skipLocationChange: true });
  }
  canDeactivate(): Observable<boolean> | boolean {
    if (!this.listItemForm.dirty) {
      return true;
    }
    return this.modal.confirm("Message.STD00002");
  }

}
