import { Component, OnInit } from '@angular/core';
import { LangService, SaveDataService, AlertService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Page, ModalService, SelectFilterService, TableService, } from '@app/shared';
import { Dbmt21Service } from './dbmt21.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, RequiredValidator, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-dbmt21',
  templateUrl: './dbmt21.component.html'
})
export class Dbmt21Component implements OnInit {
  documentTypeList = [];
  page = new Page();
  keyword = "";
  searchForm: FormGroup;
  statusPage: boolean;
  departmentList = [];
  master: {
    // StatusList: any[]
  };
  // statusList = [];


  constructor(private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private saveData: SaveDataService,
    private dbmt21service: Dbmt21Service,
    private as: AlertService,
    private fb: FormBuilder,
    public lang: LangService,
    private filter: SelectFilterService,
    private ts: TableService, ) { this.createForm() }

  createForm() {
    this.searchForm = this.fb.group({
      keyword: null,

    });
    this.searchForm.valueChanges.subscribe(()=> this.page.index = 0)
  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      // this.bindDropDownList();
    })
    // this.route.data.subscribe((data) => {
    //   this.master = data.dbmt19.master;
    //   // this.bindDropDownList();
    //   console.log(this.master);
    //   console.log(data);

    // });
    const saveData = this.saveData.retrive('DBMT21');
    if (saveData) { this.searchForm.patchValue(saveData); }
    const pageData = this.saveData.retrive('DBMTPage');
    if (pageData) { this.page = pageData; }
    this.search(false);
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'DBMT');
    this.saveData.save(this.page,'DBMTPage');
  }

  onTableEvent() {
    this.search(false);
  }

  search(resetIndex) {
    if(resetIndex) this.page.index = 0;
    // let Keyword = this.searchForm.controls.DepartmentSearch.value

    this.dbmt21service.getDepartments( this.searchForm.value, this.page)
      .pipe()
      .subscribe(res => {
        this.departmentList = res.Rows;
        this.page.totalElements = res.Total;
      });
  }

  add() {
    this.router.navigate(['/db/dbmt21/detail'], { skipLocationChange: true });
  }

  edit(DepartmentCode) {
    this.router.navigate(['/db/dbmt21/detail', { DepartmentCode: DepartmentCode }], { skipLocationChange: true });
  }

  remove(DepartmentCode, version){
    this.modal.confirm("Message.STD00003").subscribe(
      (res) => {
        if (res) {
          this.dbmt21service.delete(DepartmentCode, version)
            .subscribe(() => {
                this.as.success("", "Message.STD00014");
                this.page = this.ts.setPageIndex(this.page);
                this.search(false);
            });
        }
      })
  }
  // bindDropDownList() {
  //   this.filter.SortByLang(this.master.StatusList);
  //   this.statusList = [...this.master.StatusList];
  // }
}
