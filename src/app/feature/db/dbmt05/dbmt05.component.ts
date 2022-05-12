import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Page, ModalService, TableService } from '@app/shared';
import { Router } from '@angular/router';
import { SaveDataService, LangService, AlertService } from '@app/core';
import { Dbmt05Service } from './dbmt05.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dbmt05',
  templateUrl: './dbmt05.component.html',
  styleUrls: ['./dbmt05.component.scss']
})
export class Dbmt05Component implements OnInit {

  bank : any[];
 
  menuForm: FormGroup;
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;
  step:string;
  dirty:boolean;
  submitted = false;
  focusToggle = false;
  constructor(
    private dbmt05Service: Dbmt05Service,
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
    this.searchForm.valueChanges.subscribe(()=> this.page.index = 0);
    
  }
  ngOnInit() {
    const saveData = this.saveData.retrive('DBMT05');
    if (saveData) this.searchForm.patchValue(saveData);
    const pageData = this.saveData.retrive('DBMT05Page');
    if(pageData) this.page = pageData;
    this.search(false);
  }
  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'DBMT05');
    this.saveData.save(this.page,'DBMT05Page');
  }
  search(reset) {
    if(reset) this.page.index = 0;
    this.dbmt05Service.getBank(this.searchForm.value, this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.bank = res.Rows;
          this.page.totalElements = res.Total;
        }, (error) => {
          console.log(error);
        });
  }
 

  onTableEvent(event) {
    this.search(false);
  }
  goStep(event){
    if(!this.dirty){
      this.step = event;
    }
  }
  add() {
    this.router.navigate(['/db/dbmt05/detail'], { skipLocationChange: true });
  }

  edit(bankCode) {
    this.router.navigate(['/db/dbmt05/detail', {bankCode: bankCode, }], { skipLocationChange: true });
  }
  remove(BankCode: String, version: string) {
    this.modal.confirm("Message.STD00003").subscribe(
      (res) => {
        if (res) {
          this.dbmt05Service.deleteBank(BankCode, version)
            .subscribe(response => {
                this.as.success("", "Message.STD00014");
                this.page = this.ts.setPageIndex(this.page);
                this.search(false);
            });
        }
      })
  }


}
