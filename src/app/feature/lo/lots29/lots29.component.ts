import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Lots29Service } from '@app/feature/lo/lots29/lots29.service';
import { Page, ModalService, ModalRef, Size } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { Category } from '@app/shared/service/configuration.service';
import { Attachment } from '@app/shared/attachment/attachment.model';

@Component({
  templateUrl: './lots29.component.html'
})

export class Lots29Component implements OnInit {
  searchForm: FormGroup;
  branchDDL = [];
  loanPaymentsList = [];
  page = new Page();
  beforeSearch = '';
  statusPage: boolean;
  cashSubmitStatusList = [];
  category = Category.CashSubmitAttachment;
  attachmentFiles: Attachment[] = [];

  constructor(
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lots29Service: Lots29Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      cashSubmitNo: null,
      fromBranch: null,
      toBranch: null,
      fromDate: null,
      toDate: null,
      cashSubmitStatus: ''
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.branchDDL = data.lots29.company;
      this.cashSubmitStatusList = data.lots29.master.CashSubmitStatus;
    });

    this.onSearch();
  }

  onTableEvent(event) {
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    this.onSearch();
  }

  onSearch() {
    this.lots29Service.getCashSubmitList(this.searchForm.value, this.page)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (res: any) => {
          this.loanPaymentsList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });
  }

  ngOnDestroy() {
    if (this.router.url.split('/')[2] === 'lots29') {
      this.saveData.save(this.searchForm.value, 'LOTS29');
    } else {
      this.saveData.delete('LOTS29');
    }
  }

  add() {
    // this.lots29Service.checkCreateCashSubmit()
    //   .pipe(finalize(() => {
    //   }))
    //   .subscribe(
    //     (res: any) => {
    //       if(res > 0){
    //         this.as.warning('','มีรายการที่ยังไม่ได้รับการอนุมัติ กรุณาตรวจสอบอีกครั้ง')
    //       }else {
    this.router.navigate(['/lo/lots29/detail'], { skipLocationChange: true });
    //   }
    // });
  }

  edit(CashSubmitHeadId) {
    this.router.navigate(['/lo/lots29/detail', { CashSubmitHeadId: CashSubmitHeadId }], { skipLocationChange: true });
  }

  open(data) {
    this.OpenWindow(data)
  }

  async OpenWindow(data) {
    await window.open(data, '_blank');
  }
}
