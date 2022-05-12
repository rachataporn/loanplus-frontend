import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Page, ModalService, TableService } from '@app/shared';
import { Router } from '@angular/router';
import { AlertService, SaveDataService, LangService } from '@app/core';
import { Sumt01Service } from "./sumt01.service";
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sumt01',
  templateUrl: './sumt01.component.html',
  styleUrls: ['./sumt01.component.scss']
})
export class Sumt01Component implements OnInit {
  company : any[];
  //menuForm: FormGroup;
  page = new Page();
  submitted = false;
  focusToggle = false;
  searchForm: FormGroup;
  constructor(
    public lang: LangService,
    private Sumt01Service: Sumt01Service,
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    private saveData: SaveDataService,
    private as: AlertService,
    private ts: TableService
  ) { 
    this.createForm();}
  createForm() {
    this.searchForm = this.fb.group({
      inputSearch: null
    });
    this.searchForm.valueChanges.subscribe(()=> this.page.index = 0);
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('SUMT01');
    if (saveData) this.searchForm.patchValue(saveData);
    const pageData = this.saveData.retrive('SUMT01Page');
    if(pageData) this.page = pageData;
    this.search(false);
  }
 
  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'SUMT01');
    this.saveData.save(this.page,'SUMT01Page');
  }

  search(reset) {
    if(reset) this.page.index = 0;
    this.Sumt01Service.getCompany(this.searchForm.value, this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.company = res.Rows;
          this.page.totalElements = res.Total;
        }, (error) => {
          console.log(error);
        });
  }
  onTableEvent(event) {
    this.search(false);
  }
  add() {
    this.router.navigate(['/su/sumt01/detail'], { skipLocationChange: true });
  }
  edit(companyCode) {
    this.router.navigate(['/su/sumt01/detail', {companyCode: companyCode, }], { skipLocationChange: true });
  }
  remove(CompanyCode: String, version: string, mainCompany: string, divFlag: boolean) {
    this.modal.confirm("Message.STD00003").subscribe(
      (res) => {
        if (res) {
          this.Sumt01Service.deleteCompany(CompanyCode, version, mainCompany, divFlag)
            .subscribe(response => {
                this.as.success("", "Message.STD00014");
                this.page = this.ts.setPageIndex(this.page);
                this.search(false);
            });
        }
      })
  }
}
