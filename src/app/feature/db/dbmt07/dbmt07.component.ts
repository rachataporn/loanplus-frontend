import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Page, ModalService, TableService, SelectFilterService } from '@app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SaveDataService, LangService, AlertService } from '@app/core';
import { Dbmt07Service, Employee } from './dbmt07.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dbmt07',
  templateUrl: './dbmt07.component.html',
  styleUrls: ['./dbmt07.component.scss']
})
export class Dbmt07Component implements OnInit {
  employee: Employee = {} as Employee;
  CompanyCode = [];
  master: { CompanyCode: any[] };
  Company = [];

  Employee: any[];
  menuForm: FormGroup;
  page = new Page();
  statusPage: boolean;
  searchForm: FormGroup;
  step: string;
  dirty: boolean;
  submitted = false;
  focusToggle = false;

  constructor(
    private dbmt07Service: Dbmt07Service,
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private fb: FormBuilder,
    public lang: LangService,
    private saveData: SaveDataService,
    private as: AlertService,
    private filter: SelectFilterService,
    private ts: TableService
  ) {
    this.createForm();
  }
  createForm() {
    this.searchForm = this.fb.group({
      inputSearch: null,
      CompanyCode: null
    });
    this.searchForm.valueChanges.subscribe(() => this.page.index = 0);
    this.menuForm = this.fb.group({
      inputSearch: null
    });

  }

  ngOnInit() {
    this.lang.onChange().subscribe(() => {
      this.bindDropDownList();
    });
    this.route.data.subscribe((data) => {
      this.Company = data.employee.master.CompanyCode;
      this.rebuildForm()
    });
    const saveData = this.saveData.retrive('DBMT07');
    if (saveData) { this.searchForm.patchValue(saveData); }
    this.search();
  }

  bindDropDownList() {
    this.filter.SortByLang(this.Company);
    this.Company = [...this.Company];
  }

  rebuildForm() {
    this.searchForm.markAsPristine();
    this.bindDropDownList();
    if (this.employee.RowVersion) {
      this.searchForm.patchValue(this.employee);
      this.searchForm.controls.CompanyCode.disable();
    }
  }

  ngOnDestroy() {
    this.saveData.save(this.searchForm.value, 'DBMT07');
  }

  search(reset?: boolean) {
    if (this.searchForm.controls['inputSearch'].value) {
      this.searchForm.controls['inputSearch'].setValue(this.searchForm.controls['inputSearch'].value.trim());
    }

    this.dbmt07Service.getEmployee(this.searchForm.value, this.page)
      .pipe(finalize(() => { }))
      .subscribe(
        (res: any) => {
          this.Employee = res.Rows;
          this.page.totalElements = res.Total;
        }, (error) => {
          console.log(error);
        });
  }

  onTableEvent(event) {
    this.search();
  }

  goStep(event) {
    if (!this.dirty) {
      this.step = event;
    }
  }
  add() {
    this.router.navigate(['/db/dbmt07/detail'], { skipLocationChange: true });
  }

  edit(Company, Employee) {
    this.router.navigate(['/db/dbmt07/detail', { CompanyCode: Company, EmployeeCode: Employee }], { skipLocationChange: true });
  }

  remove(EmployeeCode: string, CompanyCode: string, version: string) {
    this.modal.confirm("Message.STD00003").subscribe(
      (res) => {
        if (res) {
          this.dbmt07Service.DeleteEmployee(EmployeeCode, CompanyCode, version)
            .subscribe(response => {
              this.as.success("", "Message.STD00014");
              this.page = this.ts.setPageIndex(this.page);
              this.search();
            });
        }
      })
  }

}



