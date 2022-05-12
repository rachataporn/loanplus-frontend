import { Component,Output,EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'update-confirm',
  templateUrl: './update-confirm.component.html',
  styleUrls: ['./update-confirm.component.css'],

})
export class UpdateConfirmComponent {
  message: string;
  options: string[];
  @Output() selected = new EventEmitter<boolean>();
  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  confirm(): void {
   this.selected.emit(true);
    this.bsModalRef.hide();
  }

  // decline(): void {
  //   this.selected.emit(false);
  //   this.bsModalRef.hide();
  // }

}
