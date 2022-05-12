import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Trts07Service, FileUpload, CreateFileUploadReturn } from '@app/feature/tr/trts07/trts07.service';
import { Page, ModalService, SelectFilterService, ModalRef, Size } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Attachment } from '@app/shared/attachment/attachment.model';

@Component({
  templateUrl: './Trts07.component.html'
})

export class Trts07Component implements OnInit {
  popup: ModalRef;
  @ViewChild('LogError') LogError: TemplateRef<any>;
  uploadForm: FormGroup;
  errorForm: FormGroup;
  blackListsCustomer = [];
  blackListsSecurities = [];
  fileUpload: FileUpload = {} as FileUpload;
  attachmentFile: Attachment = new Attachment();
  page = new Page();
  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private ls: Trts07Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
    private selectFilter: SelectFilterService,
  ) {
    this.createForm();
  }

  createForm() {
    this.uploadForm = this.fb.group({
      FileName: null
    });
    this.uploadForm.controls.FileName.valueChanges.subscribe((val) => {
      if (val != null) {
        this.upload()
      }
    })
    this.errorForm = this.fb.group({
      error: null
    });

  }

  ngOnInit() {
    this.search();
  }

  onTableEvent(event) {
    this.search();
  }

  search() {
    this.ls.getCustomerBlackList(this.page)
      .pipe()
      .subscribe(res => {
        this.blackListsCustomer = res.Rows;
        this.page.totalElements = res.Total;
      });

    this.ls.getSecuritiesBlackList(this.page)
      .pipe()
      .subscribe(res => {
        this.blackListsSecurities = res.Rows;
        this.page.totalElements = res.Total;
      });
  }

  upload() {
    Object.assign(this.fileUpload, this.uploadForm.getRawValue());
    if (this.attachmentFile.Name != null && this.fileUpload.FileName != null) {
      this.ls.checkFileUpload(this.fileUpload, this.attachmentFile)
        .subscribe((res: CreateFileUploadReturn) => {
          if (res.ErrorLog != '') {
            this.errorForm.controls.error.setValue(res.ErrorLog);
            this.errorForm.controls.error.disable({ emitEvent: false });
            this.popup = this.modal.open(this.LogError, Size.large);
          } else {
            this.ls.upload(this.fileUpload, this.attachmentFile)
              .subscribe((res: CreateFileUploadReturn) => {
                this.as.success("", "Message.STD00006");
                this.search();
              });
          }
        });
    }
  }

  closePopup() {
    this.uploadForm.controls.FileName.reset();
    this.popup.hide();
  }

  linkCustomerDetail(CustomerCode?: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots01/detail', { CustomerCode: CustomerCode, backToPage: '/lo/lots01' }], { skipLocationChange: true }));
    window.open(url, '_blank');
  }


  linkContractDetail(id?: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots03/detail', { id: id, backToPage: '/lo/lots03' }], { skipLocationChange: true }));
    window.open(url, '_blank');
  }

  linkSecuritiesDetail(SecuritiesCode?: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/lo/lots13/detail', { SecuritiesCode: SecuritiesCode, backToPage: '/lo/lots13' }], { skipLocationChange: true }));
    window.open(url, '_blank');
  }
}
