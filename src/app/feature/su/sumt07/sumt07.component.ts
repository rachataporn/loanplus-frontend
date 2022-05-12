import { Component, OnInit } from '@angular/core';
import { LangService, SaveDataService, AlertService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Page, ModalService, SelectFilterService, TableService, } from '@app/shared';
import { Sumt07Service } from './sumt07.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, RequiredValidator, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-sumt07',
  templateUrl: './sumt07.component.html'
})
export class Sumt07Component implements OnInit {
  documentTypeList = [];
  page = new Page();
  
  searchForm: FormGroup;
  statusPage: boolean;
  userList = [];
  master: {
    StatusList: any[]
  };
  statusList = [];


  constructor(private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private saveData: SaveDataService,
    private sumt07service: Sumt07Service,
    private as: AlertService,
    private fb: FormBuilder,
    public lang: LangService,
    private filter: SelectFilterService,
    private ts: TableService, ) { this.createForm() }

  createForm() {
    this.searchForm = this.fb.group({
      UserSearch: null,
      EmployeeSearch: null,
      StatusSearch: null,
    });
    this.searchForm.valueChanges.subscribe(()=> this.page.index = 0)
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    })
    this.route.data.subscribe((data) => {
      this.master = data.sumt07.master;
      this.bindDropDownList();
    });
    const saveData = this.saveData.retrive('SUMT07');
    if (saveData) { this.searchForm.patchValue(saveData); }
    const pageData = this.saveData.retrive('SUMT07Page');
    if (pageData) { this.page = pageData; }
    this.search(false);
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'SUMT07');
    this.saveData.save(this.page,'SUMT07Page');
  }

  onTableEvent() {
    this.search(false);
  }
  search(resetIndex) {
    if(resetIndex) this.page.index = 0;
    this.sumt07service.getUsers(this.searchForm.value, this.page)
      .pipe()
      .subscribe(res => {
        this.userList = res.Rows;
        this.page.totalElements = res.Total;
      });
  }

  add() {
    this.router.navigate(['/su/sumt07/detail'], { skipLocationChange: true });
  }

  edit(UserId) {
    this.router.navigate(['/su/sumt07/detail', { UserId: UserId }], { skipLocationChange: true });
  }

  remove(id,version){
    this.modal.confirm("Message.STD00003").subscribe(
      (res) => {
        if (res) {
          this.sumt07service.delete(id,version)
            .subscribe(() => {
                this.as.success("", "Message.STD00014");
                this.page = this.ts.setPageIndex(this.page);
                this.search(false);
            });
        }
      })
  }
  bindDropDownList() {
    this.filter.SortByLang(this.master.StatusList);
    this.statusList = [...this.master.StatusList];
  }
}
