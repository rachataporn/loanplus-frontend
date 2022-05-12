import { Component, OnInit } from '@angular/core';
import { LangService, SaveDataService, AlertService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Page, ModalService, SelectFilterService, TableService, } from '@app/shared';
import { Sumt03Service } from './sumt03.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, RequiredValidator, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-sumt03',
  templateUrl: './sumt03.component.html',
  styleUrls: ['./sumt03.component.scss']
})
export class Sumt03Component implements OnInit {
  searchForm: FormGroup;
  language: any[];
  system: any[];
  programData: any[];
  page = new Page();
  count = 0;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private sumt03service: Sumt03Service,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private fb: FormBuilder,
    private filter: SelectFilterService,
    private sumt03: Sumt03Service,
    private ts: TableService, ) { this.createForm() }

  createForm() {
    this.searchForm = this.fb.group({
      inputSearch: null
    });
    this.searchForm.valueChanges.subscribe(()=> this.page.index = 0);
  }

  ngOnInit() {
    const saveData = this.saveData.retrive('SUMT03');
    if (saveData) this.searchForm.patchValue(saveData);
      const pageData = this.saveData.retrive('SUMT03Page');
      if(pageData) this.page = pageData;
    this.search();
  }

  search() {
    this.sumt03service.getProgram(this.searchForm.value, this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.programData = res.Rows;
          this.page.totalElements = res.Total;
        }, (error) => {
          console.log(error);
        });
  }
  
  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'SUMT03');
    this.saveData.save(this.page,'SUMT03Page');
  }


  onTableEvent(event) {
    this.search();
  }

  add() {
    this.router.navigate(['/su/sumt03/detail'], { skipLocationChange: true });
  }

  edit(programCode) {
    this.router.navigate(['/su/sumt03/detail', { programCode: programCode, }], { skipLocationChange: true });
  }

  remove(ProgramCode: String, version: string) {
    this.modal.confirm("Message.STD00003").subscribe(
      (res) => {
        if (res) {
          this.sumt03.deleteProgram(ProgramCode, version)
            .subscribe(response => {
                this.as.success("", "Message.STD00014");
                this.page = this.ts.setPageIndex(this.page);
                this.search();
            });
        }
      })
  }

}
