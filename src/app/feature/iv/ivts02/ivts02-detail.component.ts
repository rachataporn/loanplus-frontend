import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LangService } from '@app/core';
import { ModalService, RowState, Page, ModalRef, Size } from '@app/shared';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Ivts02Service } from './ivts02.service';

@Component({
  templateUrl: './ivts02-detail.component.html'
})
export class Ivts02DetailComponent implements OnInit {
  @ViewChild('template') tpl: TemplateRef<any>;
  flagClose = null;
  popup: ModalRef;
  menuForm: FormGroup;
  history = [
    { code: '1', date: '10/01/2561', detail: 'กำหนดนัดชำระวันที่ 04/01/2562', status: 'M', tracking: '' }
  ];

  guarantor = [
    { name: 'นายทองใส ดวงมาลา', phone: '0981185852' }
  ];

  countNewLoant: Number = 5;
  pageNewLoant = new Page();
  loadingNewLoan: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private as: AlertService,
    private js: Ivts02Service,
    private modal: ModalService,
    public lang: LangService
  ) {
    this.createForm();
  }

  createForm() {
    this.menuForm = this.fb.group({
      systemCode: [null, Validators.required],
      menuCode: [null, Validators.required],
      mainMenu: null,
      programCode: null,
      active: true,
      icon: null,
      menuLabelForm: this.fb.array([])
    });
  }

  ngOnInit() {
    this.flagClose = this.route.snapshot.params.flagClose;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    if (this.flagClose === '1') {
      setTimeout(() => this.openPopup(this.tpl));
    }
  }
  openPopup(template) {
    this.popup = this.modal.open(template, Size.medium);
  }
  onClose() {
    this.popup.hide();
  }

}
