import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Page, ModalService, TableService } from '@app/shared';
import { Router } from '@angular/router';
import { SaveDataService, LangService, AlertService } from '@app/core';
import { Dbmt06Service } from './dbmt06.service';

@Component({
  selector: 'app-dbmt06',
  templateUrl: './dbmt06.component.html',
  styleUrls: ['./dbmt06.component.scss']
})
export class Dbmt06Component implements OnInit {

  bankAccountType: any[];
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;
  step: string;
  dirty: boolean;
  submitted = false;
  focusToggle = false;
  constructor(
    private dbmt06Service: Dbmt06Service,
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private ts: TableService
  ) {
    this.createForm();
  }
  createForm() {
    this.searchForm = this.fb.group({
      inputSearch: null
    });
    this.searchForm.valueChanges.subscribe(() => this.page.index = 0);
  }
  ngOnInit() {
    const saveData = this.saveData.retrive('DBMT06');
    if (saveData) this.searchForm.patchValue(saveData);
    const pageData = this.saveData.retrive('DBMT06Page');
    if(pageData) this.page = pageData;
    this.search(false);
  }
  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'DBMT06');
    this.saveData.save(this.page,'DBMT06Page');
  }
  search(reset) {
    if (reset) this.page.index = 0;
    this.dbmt06Service.getBankAccountType(this.searchForm.value, this.page)
      .subscribe((res: any) => {
        this.bankAccountType = res.Rows;
        this.page.totalElements = res.Total;
      })
  }


  onTableEvent(event) {
    this.search(false);
  }
  goStep(event) {
    if (!this.dirty) {
      this.step = event;
    }
  }
  add() {
    this.router.navigate(['/db/dbmt06/detail'], { skipLocationChange: true });
  }

  edit(bankAccountTypeCode) {
    this.router.navigate(['/db/dbmt06/detail', { bankAccountTypeCode: bankAccountTypeCode, }], { skipLocationChange: true });
  }

  remove(BankAccountTypeCode: String, version: string) {
    this.modal.confirm("Message.STD00003").subscribe(
      (res) => {
        if (res) {
          this.dbmt06Service.deleteBankAccountType(BankAccountTypeCode, version)
            .subscribe(response => {
              this.as.success("", "Message.STD00014");
              this.page = this.ts.setPageIndex(this.page);
              this.search(false);
            });
        }
      })
  }


}
