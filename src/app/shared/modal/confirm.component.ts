import { Component, Output, EventEmitter } from '@angular/core';
import { LoadingService } from '@app/core/loading.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent {
  message: string;
  options: string[];
  @Output() selected = new EventEmitter<boolean>();
  constructor(
    public bsModalRef: BsModalRef,
    private ls: LoadingService,
  ) { }

  confirm(): void {
    this.selected.emit(true);
    this.bsModalRef.hide();
  }

  decline(): void {
    this.selected.emit(false);
    this.bsModalRef.hide();
    this.ls.hide();
  }
}
