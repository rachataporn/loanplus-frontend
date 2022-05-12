import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Page, ModalService, TableService } from '@app/shared';
import { Router } from '@angular/router';
import { SaveDataService, LangService, AlertService } from '@app/core';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Dbmt08Service } from './dbmt08.service';

@Component({
  selector: 'app-dbmt08',
  templateUrl: './dbmt08.component.html',
  styleUrls: ['./dbmt08.component.scss']
})
export class Dbmt08Component implements OnInit {

  Prefix :any[];
  
  menuForm: FormGroup;
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;
  step:string;
  dirty:boolean;
  submitted = false;
  focusToggle = false;

  constructor(
    private dbmt08Service: Dbmt08Service,
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    public lang: LangService,
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
    this.menuForm = this.fb.group({
      inputSearch: null
    });
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('DBMT08');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.search();
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'DBMT08');
  }

  search(reset?: boolean) {
    if(reset) this.page.index = 0;
    this.dbmt08Service.getPrefix(this.searchForm.value, this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.Prefix = res.Rows;
          this.page.totalElements = res.Total;
        }, (error) => {
          console.log(error);
        });
  }

  onTableEvent(event) {
    this.search();
  }

  goStep(event){
    if(!this.dirty){
      this.step = event;
    }
  }

  add() {
    this.router.navigate(['/db/dbmt08/detail'], { skipLocationChange: true });
  }

  edit(Prefix) {
    this.router.navigate(['/db/dbmt08/detail', {PrefixId: Prefix, }], { skipLocationChange: true });
  }
  
  remove(PrefixId: number, version: string) {
    this.modal.confirm("Message.STD00003").subscribe(
      (res) => {
        if (res) {
          this.dbmt08Service.deletePrefix(PrefixId, version)
            .subscribe(response => {
                this.as.success("", "Message.STD00014");
                this.page = this.ts.setPageIndex(this.page);
                this.search();
            });
        }
      })
  }

}

