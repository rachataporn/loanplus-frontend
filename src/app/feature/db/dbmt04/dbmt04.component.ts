import { Component, OnInit, OnDestroy } from '@angular/core';
import { Page, TableService, ModalService } from '@app/shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Dbmt04Service } from './dbmt04.service';
import { finalize } from 'rxjs/operators';
import { AlertService, SaveDataService } from '@app/core';

@Component({
  selector: 'app-dbmt04',
  templateUrl: './dbmt04.component.html',
  styleUrls: ['./dbmt04.component.scss']
})
export class Dbmt04Component implements OnInit,OnDestroy {
  listItems = [];
  page = new Page();
  searchForm: FormGroup;
  systems = [];
  listItemGroups = [];
  listItemGroupsFilter = [];
  submitted = false;
  focusToggle = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ds: Dbmt04Service,
    private modal: ModalService,
    private as: AlertService,
    private ts: TableService,
    private saveData:SaveDataService,
  ) {
    this.createForm();
  }
  createForm() {
    this.searchForm = this.fb.group({
      SystemCode: null,
      ListItemGroupCode: [null, Validators.required],
      Keyword: null,
    });
    this.searchForm.controls.SystemCode.valueChanges
      .subscribe(value => {
        this.listItemGroupsFilter = [];
        this.searchForm.controls.ListItemGroupCode.setValue(null,{emitEvent:false});
        if(value){
          this.listItemGroupsFilter = this.listItemGroups.filter(item => item.SystemCode == value);
        }
        else{
          this.listItemGroupsFilter = this.listItemGroups;
        }
      })
  }
  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.systems = data.listItem.Systems;
      this.listItemGroups = data.listItem.ListItemGroups;

      const saveData = this.saveData.retrive('DBMT04');
      if (saveData){
        this.searchForm.patchValue(saveData);
      } 
      else{
        this.listItemGroupsFilter = this.listItemGroups;
      }
      const pageData = this.saveData.retrive('DBMT04Page');
      if(pageData) this.page = pageData;
      if(this.searchForm.valid)
         this.search(false);
    });
  }
  ngOnDestroy(): void {
    this.saveData.save(this.searchForm.value, 'DBMT04');
    this.saveData.save(this.page,'DBMT04Page');
  }
  onTableEvent() {
    this.search(false);
  }

  search(resetIndex) {
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.focusToggle = !this.focusToggle;
      return;
    }
    if(resetIndex) this.page.index = 0;
    this.ds.getListItems(this.searchForm.value, this.page).pipe(
      finalize(() => {
        this.submitted = false;
      }))
      .subscribe((res: any) => {
        this.listItems = res.Rows;
        this.page.totalElements = res.Total;
      });
  }

  add() {
    this.router.navigate(['/db/dbmt04/detail'], { skipLocationChange: true });
  }

  edit(listItemGroupCode: String, listItemCode: String) {
    this.router.navigate(['/db/dbmt04/detail', { listItemGroupCode: listItemGroupCode, listItemCode: listItemCode }], { skipLocationChange: true });
  }
  remove(listItemGroupCode: String, listItemCode: String, version: string) {
    this.modal.confirm("Message.STD00003").subscribe(
      (res) => {
        if (res) {
          this.ds.deleteListItem(listItemGroupCode, listItemCode, version)
            .subscribe(() => {
                this.as.success("", "Message.STD00014");
                this.page = this.ts.setPageIndex(this.page);
                this.search(false);
            });
        }
      })
  }
}
